'use strict'
// =====================================================================================
// FRENO DE CLAUDE (hook PreToolUse de Claude Code)
// -------------------------------------------------------------------------------------
// Antes de que Claude use una herramienta (correr un comando, leer o editar un archivo),
// Claude Code le pasa el pedido a este script. Si el pedido rompe una regla del equipo,
// el script lo BLOQUEA (sale con código 2) y le explica a Claude qué se frenó, por qué
// y cuál es el camino seguro. Las reglas son las de CLAUDE.md y docs/COMO-TRABAJAMOS.md.
//
// - Es SOLO LECTURA: no escribe archivos ni cambia nada.
// - Frena a Claude, no a las personas. Lo que una persona corre en su terminal lo frenan
//   las reglas de GitHub y el freno de git (.githooks/pre-commit).
// - Si este script falla o tarda demasiado, Claude Code bloquea igual
//   (onFailure: "block" en .claude/settings.json).
// - Claude no puede editar este archivo, .claude/settings*.json, .githooks/ ni
//   .gitleaks.toml. Se cambian a mano, por pull request, con revisión.
// - Para saber a qué base apunta un comando de Prisma, lee el .env del backend SIN
//   mostrar nada: solo decide "local" o "no local".
// - Pruebas: node .claude/hooks/frenos.test.cjs   (o npm run probar-frenos)
// =====================================================================================

const fs = require('node:fs')
const path = require('node:path')
const { execFileSync } = require('node:child_process')

const RAMAS_PROTEGIDAS = new Set(['main', 'staging'])
const NOMBRE_RAMA = /^(feature|fix|chore|docs)\/[a-z0-9][a-z0-9._-]*$/

const HERRAMIENTAS_LECTURA = new Set(['Read', 'Grep', 'Glob', 'LS'])
const HERRAMIENTAS_ESCRITURA = new Set(['Edit', 'Write', 'MultiEdit', 'NotebookEdit'])

// Los archivos que sostienen los frenos.
const PROTEGIDO =
  /(?:^|[\s"'`=\\/])(?:\.claude[\\/](?:hooks(?:[\\/]|$|\s)|settings(?:\.local)?\.json)|\.githooks(?:[\\/]|$|\s)|\.gitleaks(?:\.toml|ignore))/i

// Un archivo .env real (no .env.example) mencionado en un comando.
const ENV_ARCHIVO = /(^|[\s"'`=(\/\\])\.env(?:\.(?!example\b)[\w-]+)*(?=$|[\s"'`);|&>])/i

// Comandos que solo buscan o leen: mencionar "deleteMany" ahí no es ejecutarlo.
const BUSQUEDA = new Set(['grep', 'rg', 'egrep', 'fgrep', 'findstr', 'select-string', 'sls', 'git'])

const HOSTS_LOCALES = new Set(['localhost', '127.0.0.1', '::1', '[::1]', 'host.docker.internal'])

// ---------------------------------------------------------------- caminos seguros

const CAMINO_PR =
  'Todo entra a staging por un pull request que aprueba otra persona, y a main solo se llega desde staging. ' +
  'Subí tu rama de trabajo y abrí el pull request con /listo.'
const CAMINO_RAMA =
  'Creá tu rama de trabajo con /nueva-tarea (por debajo: git switch -c feature/<tema>; los cambios sin guardar viajan con vos) y seguí ahí.'
const CAMINO_SIN_GUARDAR =
  'Primero guardá el trabajo: un commit en tu rama, o git stash para dejarlo a un lado. ' +
  'Si de verdad hay que tirar cambios, que lo confirme y lo haga la persona.'
const CAMINO_FRENOS_GIT =
  'Los frenos de git cuidan a todo el equipo. Si un commit se frena, leé el mensaje: dice qué pasó y cómo arreglarlo. ' +
  'Si el freno se equivoca, avisale al equipo.'
const CAMINO_REBASE =
  'Para ponerse al día con staging usamos merge, nunca rebase: /sincronizar ' +
  '(por debajo: git fetch origin y git merge origin/staging). Si hay conflictos, te guía paso a paso.'
const CAMINO_HISTORIA =
  'Eso reescribe o borra historia y no tiene vuelta atrás. Si se subió algo por error (por ejemplo una clave), ' +
  'no lo tapes: avisale al equipo. La clave se cambia en el servicio y el arreglo se decide entre todos.'
const CAMINO_APROBAR =
  'Aprobar y mergear lo hace una persona desde la página de GitHub, después de revisar. ' +
  'Pasale el link del pull request a quien tenga que revisarlo.'
const CAMINO_CONFIG =
  'La configuración del repo, las claves y las variables las cambia solo Luca, desde la cuenta dictadito, ' +
  'siguiendo docs/CONFIGURACION-GITHUB.md.'
const CAMINO_PUBLICAR =
  'A staging y a producción se publica solo por el circuito: pull request a staging y después de staging a main. ' +
  'Vercel y Railway publican solos cuando se suma código.'
const CAMINO_BASE =
  'Los cambios de base van como migración de Prisma dentro del pull request y se prueban solo contra tu base local. ' +
  'Si hay que mirar algo de staging o producción, pedíselo al equipo.'
const CAMINO_ENV =
  'Las variables se documentan en .env.example con valores falsos. Si falta una variable o hay que revisar el .env, ' +
  'que lo haga la persona en su compu.'
const CAMINO_PROTEGIDO =
  'El freno (.claude/hooks/, .claude/settings*.json, .githooks/ y .gitleaks.toml) no lo modifica Claude: ' +
  'lo cambia una persona a mano, por pull request, y lo revisa otra.'
const CAMINO_BORRAR = 'Borrá archivo por archivo, o pedile a la persona que lo haga.'

const F = (motivo, camino) => ({ motivo, camino })

// ---------------------------------------------------------------- utilidades

const sinComillas = (s) => s.replace(/^["']|["']$/g, '')
const tokens = (s) => (s.match(/"[^"]*"|'[^']*'|\S+/g) || []).map(sinComillas)

// Parte un comando compuesto en comandos sueltos (&&, ||, ;, |, saltos de línea).
const segmentos = (cmd) => cmd.split(/\r?\n|&&|\|\||;|\|/).map((s) => s.trim()).filter(Boolean)

// Primer comando "real" del segmento (saltea VAR=valor, sudo, paréntesis, &).
function primerComando(seg) {
  const ts = tokens(seg.replace(/^[({\s]+/, ''))
  let i = 0
  while (i < ts.length && (/^\w+=/.test(ts[i]) || ['sudo', 'time', 'exec', 'command', '&'].includes(ts[i]))) i++
  return (ts[i] || '').toLowerCase()
}

// "git [-C dir] [-c k=v] [--opciones] <subcomando> args" → { sub, args, cPath, cfgs } o null.
function gitSub(seg) {
  const m = seg.match(
    /\bgit\b((?:\s+-[Cc]\s+(?:"[^"]*"|'[^']*'|\S+)|\s+--?[a-zA-Z][\w-]*(?:=(?:"[^"]*"|'[^']*'|\S+))?)*)\s+([a-z][\w-]*)(.*)$/,
  )
  if (!m) return null
  const cPath = (m[1].match(/-C\s+("[^"]*"|'[^']*'|\S+)/) || [])[1]
  const cfgs = [...m[1].matchAll(/-c\s+("[^"]*"|'[^']*'|\S+)/g)].map((x) => sinComillas(x[1]))
  return { sub: m[2], args: tokens(m[3]), cPath: cPath ? sinComillas(cPath) : null, cfgs }
}

function ramaActual(dir) {
  if (process.env.FRENOS_RAMA_ACTUAL !== undefined) return process.env.FRENOS_RAMA_ACTUAL // solo pruebas
  try {
    return execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
      cwd: dir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 3000,
    }).trim()
  } catch {
    return '' // no es un repo, o todavía no tiene commits
  }
}

// La carpeta existente más cercana a una ruta (el archivo puede no existir todavía).
function carpetaExistente(ruta) {
  let d = path.dirname(ruta)
  for (;;) {
    try {
      if (fs.statSync(d).isDirectory()) return d
    } catch {
      // no existe: sigo subiendo
    }
    const padre = path.dirname(d)
    if (padre === d) return null
    d = padre
  }
}

const dirDe = (g, ctx) => (g.cPath ? path.resolve(ctx.dir, g.cPath) : ctx.dir)

// ---------------------------------------------------------------- ¿a qué base apunta?

function esUrlLocal(url) {
  try {
    return HOSTS_LOCALES.has(new URL(url).hostname.toLowerCase())
  } catch {
    return false
  }
}

// Lee DATABASE_URL / DIRECT_URL de un .env como lo haría dotenv (la última línea sin
// comentar gana). Devuelve null si el archivo no existe. Nunca muestra los valores.
function urlsDelEnv(archivo) {
  let texto
  try {
    texto = fs.readFileSync(archivo, 'utf8')
  } catch {
    return null
  }
  const urls = {}
  for (const linea of texto.split(/\r?\n/)) {
    const m = linea.match(/^\s*(?:export\s+)?(DATABASE_URL|DIRECT_URL)\s*=\s*(.*)$/)
    if (!m) continue
    let v = m[2].trim()
    const q = v[0]
    if (q === '"' || q === "'") {
      const fin = v.indexOf(q, 1)
      v = fin > 0 ? v.slice(1, fin) : v.slice(1)
    } else {
      v = v.replace(/\s+#.*$/, '')
    }
    urls[m[1]] = v
  }
  return urls
}

// null si todas las bases a las que apuntaría el comando son locales; si no, el motivo.
function baseNoLocal(ctx, { exigirEnv }) {
  const inline = [...ctx.cmd.matchAll(/(?:\$env:)?\b(DATABASE_URL|DIRECT_URL)\s*=\s*("[^"]*"|'[^']*'|[^\s;&|]+)/gi)]
  for (const m of inline) {
    if (!esUrlLocal(sinComillas(m[2]))) return `el comando fija ${m[1]} a una base que no es local`
  }
  const dirs = new Set([ctx.cwd, ctx.dir])
  for (const m of ctx.cmd.matchAll(/\bcd\s+("[^"]*"|'[^']*'|[^\s;&|]+)/g)) dirs.add(path.resolve(ctx.cwd, sinComillas(m[1])))
  let encontrados = 0
  for (const d of dirs) {
    for (const archivo of [path.join(d, '.env'), path.join(d, 'apps', 'backend', '.env')]) {
      const urls = urlsDelEnv(archivo)
      if (!urls) continue
      encontrados++
      for (const clave of Object.keys(urls)) {
        if (!esUrlLocal(urls[clave])) {
          return `${path.relative(ctx.cwd, archivo) || '.env'} tiene ${clave} apuntando a una base que no es local`
        }
      }
    }
  }
  if (exigirEnv && !encontrados && !inline.length) return 'no encontré el .env del backend, así que no sé a qué base apunta'
  return null
}

// ---------------------------------------------------------------- reglas sobre comandos

const REGLAS_SHELL = [
  // 1. Saltear los frenos de git.
  function saltearFrenosGit(seg) {
    const g = gitSub(seg)
    if (!g) return null
    if (/(^|\s)--no-verify\b/.test(seg)) return F('--no-verify saltea los frenos de git', CAMINO_FRENOS_GIT)
    if (g.sub === 'commit' && g.args.some((t) => /^-(?!-)[a-zA-Z]*n[a-zA-Z]*$/.test(t))) {
      return F('git commit -n saltea los frenos de git (es lo mismo que --no-verify)', CAMINO_FRENOS_GIT)
    }
    if (g.cfgs.some((c) => /^core\.hookspath=/i.test(c))) {
      return F('git -c core.hooksPath=… cambia de dónde salen los frenos de git', CAMINO_FRENOS_GIT)
    }
    if (g.sub === 'config') {
      const i = g.args.findIndex((t) => /^core\.hookspath$/i.test(t))
      if (i < 0) return null
      const opciones = g.args.filter((t) => t.startsWith('--'))
      if (opciones.some((o) => /^--(unset|unset-all|remove-section|replace-all)$/.test(o))) {
        return F('borrar core.hooksPath apaga los frenos de git', CAMINO_FRENOS_GIT)
      }
      if (opciones.some((o) => /^--(get|get-all|get-regexp|list|show-origin)$/.test(o))) return null
      const valor = g.args[i + 1]
      if (valor !== undefined && valor !== '.githooks') {
        return F(`cambiar core.hooksPath a "${valor}" apaga los frenos de git`, CAMINO_FRENOS_GIT)
      }
    }
    return null
  },

  // 2. git push: nada directo a main ni a staging, nada forzado, ramas con nombre del equipo.
  function gitPush(seg, ctx) {
    const g = gitSub(seg)
    if (!g || g.sub !== 'push') return null
    const opciones = g.args.filter((t) => t.startsWith('-'))
    const pos = g.args.filter((t) => !t.startsWith('-'))
    if (opciones.some((o) => /^--(mirror|all)$/.test(o))) {
      return F('git push --mirror / --all sube todas las ramas de una, main y staging incluidas', CAMINO_PR)
    }
    const forzado =
      opciones.some((o) => /^--force/.test(o) || /^-(?!-)[a-zA-Z]*f[a-zA-Z]*$/.test(o)) ||
      pos.slice(1).some((r) => r.startsWith('+'))
    if (forzado) {
      return F(
        'push forzado (--force, -f o +rama): pisa en GitHub lo que había y puede borrar trabajo de otra persona',
        'Si GitHub rechaza tu push porque la rama avanzó, traé los cambios con /sincronizar y volvé a subir normal. Nunca se fuerza un push.',
      )
    }
    const borra = opciones.some((o) => o === '--delete' || o === '-d')
    if (opciones.includes('--tags') && pos.length <= 1) return null
    const refspecs = pos.slice(1)
    for (const r of refspecs.length ? refspecs : ['HEAD']) {
      let destino = r.split(':').pop().replace(/^refs\/heads\//, '')
      if (destino === 'HEAD') destino = ramaActual(dirDe(g, ctx))
      if (!destino) continue
      if (RAMAS_PROTEGIDAS.has(destino)) {
        return borra
          ? F(`borrar la rama ${destino} de GitHub`, 'main y staging no se borran nunca. Si algo anda mal, avisale al equipo.')
          : F(`subir directo a ${destino}`, CAMINO_PR)
      }
      if (!borra && !NOMBRE_RAMA.test(destino)) {
        return F(
          `la rama "${destino}" no sigue el formato de nombres del equipo`,
          'Las ramas de trabajo empiezan con feature/, fix/, chore/ o docs/, en minúsculas y con guiones ' +
            '(por ejemplo feature/dictado-por-voz). Renombrala con git branch -m feature/<tema> y subila de nuevo, ' +
            'o empezá la tarea con /nueva-tarea.',
        )
      }
    }
    return null
  },

  // 3. Rebase: nos ponemos al día con merge.
  function rebase(seg) {
    const g = gitSub(seg)
    if (!g) return null
    if (g.sub === 'rebase') {
      if (g.args.some((t) => t === '--abort' || t === '--quit')) return null
      return F('rebase reescribe la historia de la rama', CAMINO_REBASE)
    }
    if (g.sub === 'pull' && g.args.some((t) => /^--rebase(=(true|merges|interactive|i))?$/.test(t) || t === '-r')) {
      return F('git pull --rebase hace un rebase por debajo', CAMINO_REBASE)
    }
    if (g.sub === 'config') {
      const i = g.args.findIndex((t) => /^pull\.rebase$/i.test(t))
      const valor = i >= 0 ? g.args[i + 1] : undefined
      if (valor !== undefined && !/^false$/i.test(valor) && !g.args.some((o) => /^--(get|unset)/.test(o))) {
        return F('pull.rebase hace que cada git pull sea un rebase', CAMINO_REBASE)
      }
    }
    return null
  },

  // 4. Commits directo en main o staging.
  function trabajoEnRamaProtegida(seg, ctx) {
    const g = gitSub(seg)
    if (!g) return null
    const creaCommit =
      g.sub === 'commit' ||
      g.sub === 'cherry-pick' ||
      g.sub === 'am' ||
      (g.sub === 'revert' && !g.args.some((t) => t === '--no-commit' || t === '-n'))
    if (!creaCommit) return null
    if (g.args.some((t) => t === '--abort' || t === '--quit' || t === '--dry-run')) return null
    const rama = ramaActual(dirDe(g, ctx))
    if (!RAMAS_PROTEGIDAS.has(rama)) return null
    return F(`estás en ${rama}, y en ${rama} no se hacen commits directo`, CAMINO_RAMA)
  },

  // 5. Reescribir o borrar historia.
  function reescribirHistoria(seg) {
    const g = gitSub(seg)
    if (!g) return null
    if (['filter-branch', 'filter-repo', 'replace'].includes(g.sub)) {
      return F(`git ${g.sub} reescribe la historia del repo`, CAMINO_HISTORIA)
    }
    if (g.sub === 'reflog' && ['expire', 'delete'].includes(g.args[0])) {
      return F('git reflog expire / delete borra el registro que sirve para recuperar trabajo perdido', CAMINO_HISTORIA)
    }
    if (g.sub === 'gc' && g.args.some((t) => /^--prune(=|$)/.test(t))) {
      return F('git gc --prune borra para siempre commits que todavía se podían recuperar', CAMINO_HISTORIA)
    }
    if (g.sub === 'update-ref' && g.args.includes('-d')) return F('git update-ref -d borra una referencia a mano', CAMINO_HISTORIA)
    return null
  },

  // 6. git que tira trabajo sin guardar o mete de más en el commit.
  function gitDestructivo(seg) {
    const g = gitSub(seg)
    if (!g) return null
    const ts = g.args
    switch (g.sub) {
      case 'reset':
        if (ts.includes('--hard')) return F('git reset --hard tira los cambios sin guardar, sin vuelta atrás', CAMINO_SIN_GUARDAR)
        break
      case 'clean':
        if (ts.some((t) => /^-(?!-)[a-zA-Z]*f/.test(t) || t === '--force')) {
          return F('git clean -f borra archivos que git todavía no conoce, sin vuelta atrás', CAMINO_BORRAR)
        }
        break
      case 'checkout':
        if (ts.includes('--') || ts.includes('.') || ts.includes('-f') || ts.includes('--force')) {
          return F('git checkout -- / . / -f descarta cambios sin guardar', CAMINO_SIN_GUARDAR)
        }
        break
      case 'switch':
        if (ts.some((t) => ['--discard-changes', '-f', '--force'].includes(t))) {
          return F('git switch --discard-changes / -f descarta cambios sin guardar', CAMINO_SIN_GUARDAR)
        }
        break
      case 'restore':
        if (!ts.includes('--staged') || ts.includes('--worktree') || ts.includes('-W')) {
          return F('git restore descarta cambios sin guardar', CAMINO_SIN_GUARDAR)
        }
        break
      case 'stash':
        if (['drop', 'clear'].includes(ts[0])) {
          return F('git stash drop / clear tira trabajo guardado', 'Si un stash ya no sirve, que lo mire y lo borre la persona (git stash show -p).')
        }
        break
      case 'branch':
        if (ts.some((t) => /^-(?!-)[a-zA-Z]*D/.test(t)) || (ts.includes('--delete') && ts.includes('--force'))) {
          return F(
            'git branch -D borra la rama aunque tenga commits que no están en ningún otro lado',
            'Usá git branch -d (con minúscula): solo borra si la rama ya está sumada. Si se niega, hay trabajo sin sumar: preguntale a la persona.',
          )
        }
        break
      case 'add':
        if (ts.some((t) => ['.', '-A', '--all', '-u', '--update', '*', ':/', '-f', '--force'].includes(t))) {
          return F(
            'git add . / -A / -u / -f mete en el commit todo lo que haya, también lo que no tiene que ir',
            'Agregá archivo por archivo (git add ruta/del/archivo) y mostrale a la persona la lista antes del commit.',
          )
        }
        break
      case 'commit':
        if (ts.some((t) => t === '--all' || /^-(?!-)[a-zA-Z]*a[a-zA-Z]*$/.test(t))) {
          return F(
            'git commit -a mete todo lo modificado, también lo que no tiene que ir',
            'Agregá archivo por archivo con git add y después hacé git commit -m "...".',
          )
        }
        break
    }
    return null
  },

  // 7. GitHub desde la terminal (gh): ni aprobar, ni mergear, ni tocar la configuración.
  function ghCli(seg) {
    const ts = tokens(seg)
    const i = ts.findIndex((t) => /^(?:.*[\\/])?gh(?:\.exe)?$/i.test(t))
    if (i < 0) return null
    const [grupo, accion, ...resto] = ts.slice(i + 1)
    if (grupo === 'pr' && accion === 'merge') return F('mergear un pull request', CAMINO_APROBAR)
    if (grupo === 'pr' && accion === 'review' && resto.some((t) => ['--approve', '-a', '--request-changes', '-r'].includes(t))) {
      return F('aprobar o pedir cambios en un pull request en nombre de la persona', CAMINO_APROBAR)
    }
    if (grupo === 'repo' && (['delete', 'edit', 'rename', 'archive', 'unarchive'].includes(accion) || (accion === 'sync' && resto.includes('--force')))) {
      return F(`gh repo ${accion} cambia el repo o su configuración`, CAMINO_CONFIG)
    }
    if (['secret', 'variable'].includes(grupo) && ['set', 'delete', 'remove'].includes(accion)) {
      return F(`gh ${grupo} ${accion} toca las claves o variables del repo`, CAMINO_CONFIG)
    }
    if (grupo === 'api') {
      const args = [accion, ...resto].filter((t) => t !== undefined)
      const k = args.findIndex((t) => t === '-X' || t === '--method')
      const igual = args.find((t) => /^--method=/.test(t))
      const metodo = k >= 0 ? (args[k + 1] || '').toUpperCase() : igual ? igual.split('=')[1].toUpperCase() : null
      const conCampos = args.some((t) => /^(-f|-F|--field|--raw-field|--input)(=|$)/.test(t))
      if ((metodo && metodo !== 'GET') || (!metodo && conCampos)) {
        return F(
          'gh api que modifica cosas en GitHub',
          'Por API solo se consulta. Lo que haya que cambiar lo hace una persona desde la página de GitHub; para abrir un pull request está /listo.',
        )
      }
    }
    return null
  },

  // 8. Prisma: nada que pueda borrar datos, y cambios de esquema solo contra la base local.
  function prisma(seg, ctx) {
    if (!/\bprisma\b/i.test(seg)) return null
    if (/--accept-data-loss|--force-reset/i.test(seg)) return F('prisma con --accept-data-loss / --force-reset puede borrar datos', CAMINO_BASE)
    if (/\bmigrate\s+reset\b/i.test(seg)) return F('prisma migrate reset borra la base entera', CAMINO_BASE)
    if (/\bprisma\b.*\b(db\s+(push|pull|execute|seed)|migrate\s+(dev|deploy|resolve))\b/i.test(seg)) {
      const motivo = baseNoLocal(ctx, { exigirEnv: true })
      if (motivo) return F(`cambio de base contra una base que no es local: ${motivo}`, CAMINO_BASE)
    }
    return null
  },

  // 9. Levantar el backend o correr scripts de datos con el .env apuntando afuera de local.
  function backendContraRemoto(seg, ctx) {
    const enBackend = /backend/i.test(ctx.cmd) || /backend/i.test(ctx.dir)
    const arranca =
      /\bnodemon\b/.test(seg) ||
      /\btsx\s+watch\b/.test(seg) ||
      /\bnode\s+(?:\S*[\\/])?(?:src|dist)[\\/]index\.[cm]?[jt]s\b/.test(seg) ||
      (enBackend && /\bnpm\s+(?:run\s+)?(?:dev|start)\b/.test(seg))
    const script = enBackend && /\b(?:node|tsx)\s+(?:-r\s+\S+\s+)?\S*scripts[\\/][\w.-]+\.(?:m?[jt]s|cjs)\b/.test(seg)
    if (!arranca && !script) return null
    const motivo = baseNoLocal(ctx, { exigirEnv: false })
    if (!motivo) return null
    const que = arranca ? 'levantar el backend en tu compu' : 'correr un script de datos'
    return F(`${que} contra una base que no es local (staging y producción tienen datos reales): ${motivo}`, CAMINO_BASE)
  },

  // 10. Borrados o actualizaciones masivas de datos ejecutadas desde la terminal.
  function datosMasivos(seg, ctx) {
    if (!/\b(deleteMany|updateMany)\b|\btruncate\b|\bdrop\s+(table|database|schema)\b|\bdelete\s+from\b/i.test(seg)) return null
    if (BUSQUEDA.has(primerComando(seg))) return null
    if (!/\b(node|psql|deno|bun|tsx|ts-node|sqlite3|mysql)\b|prisma\s+db\s+execute/i.test(ctx.cmd)) return null
    return F(
      'borrado o actualización masiva de datos (deleteMany / updateMany / TRUNCATE / DROP / DELETE FROM)',
      'Los datos de prueba se borran de a uno, por id, y solo en la base local.',
    )
  },

  // 11. find con -delete.
  function findDelete(seg) {
    if (/\bfind\b.*\s-delete\b/i.test(seg) || /\bfind\b.*-exec\s+rm\b/i.test(seg)) {
      return F('find con -delete / -exec rm borra archivos en masa', CAMINO_BORRAR)
    }
    return null
  },

  // 12. Borrado recursivo fuera de carpetas descartables.
  function borradoRecursivo(seg) {
    let args = null
    let m = seg.match(/\brm\s+(.*)$/i)
    if (m && tokens(m[1]).some((t) => /^-(?!-)[a-z]*r/i.test(t) || t === '--recursive')) args = tokens(m[1])
    if (!args && (m = seg.match(/\b(?:remove-item|ri|del|erase|rmdir|rd)\b(.*)$/i)) && /-recurse\b|\s\/s\b/i.test(m[1])) {
      args = tokens(m[1])
    }
    if (!args) return null
    const rutas = args.filter((t) => !t.startsWith('-') && !/^\/[sq]$/i.test(t))
    const descartable = /(^|[\\/])(node_modules|dist|build|coverage|\.vite|\.turbo|\.cache|tmp|temp|scratchpad)([\\/]|$)/i
    if (rutas.length && rutas.every((r) => descartable.test(r))) return null
    return F(
      `borrado recursivo de "${rutas.join(' ') || '(sin ruta)'}": solo se permite sobre node_modules, dist, build, caché o temporales`,
      CAMINO_BORRAR,
    )
  },

  // 13. Publicar o cambiar servicios en la nube desde la terminal.
  function deployCli(seg) {
    if (/\bvercel\b/.test(seg) && /--prod\b|\bpromote\b|\brollback\b|\b(env|domains|alias)\s+(add|rm|remove|set)\b/.test(seg)) {
      return F('publicar o cambiar producción desde la terminal de Vercel', CAMINO_PUBLICAR)
    }
    if (/\brailway\s+(up|redeploy|down|delete)\b|\brailway\s+variables?\b.*(--set|\bset\b)/i.test(seg)) {
      return F('publicar o cambiar variables en Railway desde la terminal', CAMINO_PUBLICAR)
    }
    if (/\bsupabase\b/i.test(seg)) {
      const remoto = /--linked\b|--db-url\b/.test(seg)
      if (
        /\bdb\s+push\b/.test(seg) ||
        (remoto && /\b(db\s+reset|migration\s+(up|repair|squash))\b/.test(seg)) ||
        /\bsecrets\s+(set|unset)\b/.test(seg) ||
        /\bfunctions\s+deploy\b/.test(seg)
      ) {
        return F('cambiar la base o los servicios de Supabase en la nube desde la terminal', CAMINO_BASE)
      }
    }
    return null
  },

  // 14. Leer, copiar, pisar o borrar un .env desde la terminal.
  function envEnShell(seg) {
    if (!ENV_ARCHIVO.test(seg)) return null
    const c = primerComando(seg)
    if (['ls', 'dir', 'test-path', 'get-childitem', 'gci'].includes(c)) return null
    if (c === 'git' && /\bgit\b.*\b(check-ignore|ls-files|status)\b/.test(seg)) return null
    return F('el comando lee, copia, pisa o borra un archivo .env, que tiene claves', CAMINO_ENV)
  },

  // 15. Que Claude no se saque el freno.
  function protegerFreno(seg) {
    if (/disableAllHooks/i.test(seg)) return F('intento de apagar los hooks de Claude (disableAllHooks)', CAMINO_PROTEGIDO)
    if (!PROTEGIDO.test(seg)) return null
    const escribe =
      /\bsed\b[^|]*\s-i|\btee\b|\b(rm|mv|cp|del|move|copy|ren|rename|chmod|truncate)\b|\b(set-content|add-content|clear-content|out-file|remove-item|move-item|copy-item|new-item|rename-item)\b|\bgit\s+(checkout|restore|rm|mv|update-index)\b|writefile|appendfile|unlink|rmsync|renamesync|copyfile/i
    const redirige = [...seg.matchAll(/(?:^|[^\d&])>{1,2}\s*["']?([^\s"';|&]+)/g)].some((m) => PROTEGIDO.test(' ' + m[1]))
    if (escribe.test(seg) || redirige) return F('modificar el propio freno', CAMINO_PROTEGIDO)
    return null
  },
]

// ---------------------------------------------------------------- reglas sobre archivos

function revisarArchivo(tool, input, ctx) {
  const original = String(input.file_path || input.notebook_path || input.path || '')
  const ruta = original.replace(/\\/g, '/')
  const base = path.posix.basename(ruta)
  if (ruta && /^\.env(\..+)?$/i.test(base) && !/^\.env\.example$/i.test(base)) {
    return F(`${tool} sobre un archivo .env, que tiene claves`, CAMINO_ENV)
  }
  if (tool === 'Grep' && input.glob && /(^|[\\/*{,])\.env(?!\.example)/i.test(String(input.glob))) {
    return F('Grep sobre archivos .env, que tienen claves', CAMINO_ENV)
  }
  if (!HERRAMIENTAS_ESCRITURA.has(tool)) return null
  if (PROTEGIDO.test(ruta)) return F('modificar el propio freno', CAMINO_PROTEGIDO)
  if (/disableAllHooks/i.test(JSON.stringify(input))) return F('intento de apagar los hooks de Claude (disableAllHooks)', CAMINO_PROTEGIDO)
  if (ruta) {
    const dir = carpetaExistente(path.resolve(ctx.cwd, original))
    const rama = dir ? ramaActual(dir) : ''
    if (RAMAS_PROTEGIDAS.has(rama)) return F(`estás en la rama ${rama}, y en ${rama} no se edita`, CAMINO_RAMA)
  }
  return null
}

// ---------------------------------------------------------------- decisión

// Devuelve { motivo, camino } si hay que bloquear, o null si se deja pasar.
function decidir(entrada) {
  const tool = entrada.tool_name || ''
  const input = entrada.tool_input || {}
  const cwd = entrada.cwd || process.cwd()
  const ctx = { cwd, dir: cwd, cmd: '' }
  if (HERRAMIENTAS_LECTURA.has(tool) || HERRAMIENTAS_ESCRITURA.has(tool)) return revisarArchivo(tool, input, ctx)
  const cmd = typeof input.command === 'string' ? input.command : typeof input.cmd === 'string' ? input.cmd : null
  if (cmd === null) return null
  ctx.cmd = cmd
  for (const seg of segmentos(cmd)) {
    if (['cd', 'set-location', 'sl', 'pushd', 'chdir'].includes(primerComando(seg))) {
      const destino = tokens(seg).slice(1).find((t) => !t.startsWith('-'))
      if (destino) ctx.dir = path.resolve(ctx.dir, destino)
    }
    for (const regla of REGLAS_SHELL) {
      const r = regla(seg, ctx)
      if (r) return r
    }
  }
  return null
}

function bloquear({ motivo, camino }) {
  fs.writeSync(
    2,
    `FRENO: ${motivo}.\n` +
      `Camino seguro: ${camino}\n` +
      '(Freno de Claude, en .claude/hooks/frenos.cjs. No busques otra forma de hacer lo mismo: ' +
      'explicale a la persona qué se frenó, por qué y cuál es el camino seguro.)\n',
  )
  process.exit(2)
}

function main() {
  let texto = ''
  try {
    texto = fs.readFileSync(0, 'utf8')
  } catch {
    texto = ''
  }
  let entrada
  try {
    entrada = JSON.parse(texto || '{}')
  } catch {
    bloquear(
      F(
        'no pude leer el pedido de la herramienta (llegó en un formato que no entiendo)',
        'Avisale a la persona: puede que Claude Code haya cambiado. Mientras tanto, el freno bloquea por las dudas.',
      ),
    )
  }
  let r
  try {
    r = decidir(entrada)
  } catch (err) {
    if (HERRAMIENTAS_LECTURA.has(entrada.tool_name || '')) process.exit(0)
    r = F(
      `el freno tuvo un error interno (${err.message}) y por las dudas bloquea`,
      'Avisale a la persona. Leer archivos sigue funcionando; el freno lo arregla una persona, por pull request.',
    )
  }
  if (!r) process.exit(0)
  bloquear(r)
}

if (require.main === module) main()

module.exports = { decidir }
