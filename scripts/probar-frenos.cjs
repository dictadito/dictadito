'use strict'
// npm run probar-frenos
// Comprueba, en tu compu, que los frenos están instalados y frenan de verdad.
// No toca el repo: las pruebas del freno de git corren en un repo descartable.

const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { spawnSync } = require('node:child_process')

const raiz = path.resolve(__dirname, '..')
const HOOK_CLAUDE = path.join(raiz, '.claude', 'hooks', 'frenos.cjs')
const PRUEBAS_CLAUDE = path.join(raiz, '.claude', 'hooks', 'frenos.test.cjs')
const SETTINGS = path.join(raiz, '.claude', 'settings.json')
const HOOK_GIT = path.join(raiz, '.githooks', 'pre-commit')
const CONFIG_GITLEAKS = path.join(raiz, '.gitleaks.toml')

const problemas = []
const ok = (txt) => console.log(`  ✔ ${txt}`)
const mal = (txt, arreglo) => {
  console.log(`  ✘ ${txt}`)
  problemas.push(arreglo || txt)
}
const titulo = (txt) => console.log(`\n${txt}`)
const correr = (cmd, args, opciones = {}) => spawnSync(cmd, args, { encoding: 'utf8', ...opciones })

console.log('Probando los frenos de Dictadito en esta compu...')

// ------------------------------------------------------------------ 1. lo que hace falta
titulo('1. Lo que hace falta')

const mayor = Number(process.versions.node.split('.')[0])
if (mayor === 22) ok(`Node 22 (${process.version})`)
else mal(`Node ${process.version}: el proyecto usa Node 22`, 'Instalá Node 22: nvm install 22 y nvm use 22')

const vGit = correr('git', ['--version'])
if (vGit.status === 0) ok(vGit.stdout.trim())
else mal('no encontré git', 'Instalá git: winget install --id Git.Git -e')

const INSTALAR_GITLEAKS =
  'Instalá gitleaks (winget install --id Gitleaks.Gitleaks -e). Si ya lo instalaste, cerrá y abrí VS Code o la terminal para que lo encuentre'
const vGitleaks = correr('gitleaks', ['version'])
const hayGitleaks = vGitleaks.status === 0
if (hayGitleaks) ok(`gitleaks ${vGitleaks.stdout.trim()}`)
else mal('no encontré gitleaks', INSTALAR_GITLEAKS)

const esRepo = correr('git', ['rev-parse', '--is-inside-work-tree'], { cwd: raiz }).status === 0
if (!esRepo) {
  mal('esta carpeta todavía no es un repo de git', 'Cloná el repo con git clone (ver docs/ALTA.md)')
} else {
  const hp = correr('git', ['config', '--get', 'core.hooksPath'], { cwd: raiz }).stdout.trim()
  if (hp === '.githooks') ok('freno de git activado (core.hooksPath = .githooks)')
  else mal(`freno de git sin activar (core.hooksPath = "${hp || 'vacío'}")`, 'Corré npm install en la carpeta del repo')
}

let settings = null
try {
  settings = JSON.parse(fs.readFileSync(SETTINGS, 'utf8'))
} catch {
  settings = null
}
const hookConfigurado = JSON.stringify((settings && settings.hooks && settings.hooks.PreToolUse) || []).includes('frenos.cjs')
if (hookConfigurado) ok('freno de Claude configurado (.claude/settings.json)')
else mal('el freno de Claude no está configurado en .claude/settings.json', 'Traé la última versión de staging: falta .claude/settings.json')

// ------------------------------------------------------------------ 2. freno de Claude
titulo('2. Freno de Claude (lo que Claude no puede hacer)')

const tmpClaude = fs.mkdtempSync(path.join(os.tmpdir(), 'probar-claude-'))
const sh = (command) => ({ tool_name: 'Bash', tool_input: { command }, cwd: tmpClaude })
const CASOS_CLAUDE = [
  ['frena', 'subir directo a main', sh('git push origin main')],
  ['frena', 'subir directo a staging', sh('git push origin staging')],
  ['frena', 'forzar un push', sh('git push --force origin feature/prueba')],
  ['frena', 'saltear los frenos de git (--no-verify)', sh('git commit --no-verify -m "x"')],
  ['frena', 'hacer un rebase', sh('git rebase origin/staging')],
  ['frena', 'hacer un commit estando en main', sh('git commit -m "x"'), 'main'],
  ['frena', 'editar archivos estando en staging', { tool_name: 'Edit', tool_input: { file_path: path.join(tmpClaude, 'a.ts'), old_string: 'a', new_string: 'b' }, cwd: tmpClaude }, 'staging'],
  ['frena', 'mergear un pull request', sh('gh pr merge 1 --squash')],
  ['frena', 'aprobar un pull request', sh('gh pr review 1 --approve')],
  ['frena', 'leer un archivo .env', { tool_name: 'Read', tool_input: { file_path: path.join(tmpClaude, '.env') }, cwd: tmpClaude }],
  ['frena', 'tocar el propio freno', { tool_name: 'Write', tool_input: { file_path: path.join(tmpClaude, '.claude', 'hooks', 'frenos.cjs'), content: '' }, cwd: tmpClaude }],
  ['pasa', 'subir tu rama de trabajo', sh('git push -u origin feature/prueba')],
  ['pasa', 'ponerse al día con merge', sh('git merge origin/staging'), 'feature/prueba'],
  ['pasa', 'abrir un pull request a staging', sh('gh pr create --base staging --title "feat: prueba" --body "x"')],
]

if (!fs.existsSync(HOOK_CLAUDE)) {
  mal('falta .claude/hooks/frenos.cjs', 'Traé la última versión de staging: falta el freno de Claude')
} else {
  for (const [esperado, desc, entrada, rama] of CASOS_CLAUDE) {
    const env = { ...process.env }
    if (rama) env.FRENOS_RAMA_ACTUAL = rama
    else delete env.FRENOS_RAMA_ACTUAL
    const r = correr(process.execPath, [HOOK_CLAUDE], { input: JSON.stringify(entrada), env })
    const frenó = r.status === 2 && /^FRENO: /.test(r.stderr)
    const bien = esperado === 'frena' ? frenó : r.status === 0
    const etiqueta = esperado === 'frena' ? 'frena' : 'deja pasar'
    if (bien) ok(`${etiqueta}: ${desc}`)
    else mal(`${etiqueta}: ${desc} (no se comportó como debía, código ${r.status})`, `El freno de Claude falla en "${desc}": avisale al equipo`)
  }
  const bateria = correr(process.execPath, [PRUEBAS_CLAUDE, '--resumen'])
  const resumen = (bateria.stdout.trim().split('\n').pop() || '').trim()
  if (bateria.status === 0) ok(`batería completa: ${resumen}`)
  else mal(`batería completa: ${resumen || 'no corrió'}`, 'Fallan pruebas del freno de Claude: corré node .claude/hooks/frenos.test.cjs y avisale al equipo')
}
fs.rmSync(tmpClaude, { recursive: true, force: true })

// ------------------------------------------------------------------ 3. freno de git
titulo('3. Freno de git (lo que nadie puede hacer, con o sin Claude)')

if (!fs.existsSync(HOOK_GIT) || !fs.existsSync(CONFIG_GITLEAKS)) {
  mal('falta .githooks/pre-commit o .gitleaks.toml', 'Traé la última versión de staging: falta el freno de git')
} else if (!hayGitleaks) {
  mal('no se puede probar el freno de git sin gitleaks (y sin gitleaks, git no deja hacer commits)', INSTALAR_GITLEAKS)
} else {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'probar-git-'))
  const hooks = `${repo}-hooks`
  fs.mkdirSync(hooks)
  fs.copyFileSync(HOOK_GIT, path.join(hooks, 'pre-commit'))
  if (process.platform !== 'win32') fs.chmodSync(path.join(hooks, 'pre-commit'), 0o755)
  const env = { ...process.env, GITLEAKS_CONFIG: CONFIG_GITLEAKS }
  const git = (args) => correr('git', args, { cwd: repo, env })
  const escribir = (archivo, texto) => fs.writeFileSync(path.join(repo, archivo), texto)

  git(['init', '-q', '-b', 'main'])
  git(['config', 'user.name', 'Prueba de frenos'])
  git(['config', 'user.email', 'prueba@example.com'])

  // El primer commit se hace antes de activar el freno, para que cada prueba mida una sola cosa.
  escribir('README.md', '# prueba\n')
  git(['add', 'README.md'])
  git(['commit', '-q', '-m', 'inicio'])
  git(['config', 'core.hooksPath', hooks])

  // Un token de GitHub inventado, armado al momento (así no queda escrito en ningún archivo).
  let semilla = 7
  const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const token = 'ghp_' + Array.from({ length: 36 }, () => ABC[(semilla = (semilla * 48271) % 2147483647) % ABC.length]).join('')

  escribir('notas.md', 'hola\n')
  git(['add', 'notas.md'])
  let r = git(['commit', '-q', '-m', 'directo en main'])
  if (r.status !== 0 && /FRENO: .*main/.test(r.stderr)) ok('frena: commit directo en main')
  else mal('no frenó un commit directo en main', 'El freno de git no frena commits en main: avisale al equipo')

  git(['switch', '-q', '-c', 'feature/prueba'])
  escribir('config.ts', `export const token = "${token}"\n`)
  git(['add', 'config.ts'])
  r = git(['commit', '-q', '-m', 'con clave'])
  const salida = r.stdout + r.stderr
  if (r.status !== 0 && /gitleaks encontró/.test(salida) && !salida.includes(token)) ok('frena: commit con una clave adentro (y la muestra tapada)')
  else if (/no encontré gitleaks/.test(salida)) mal('no pudo revisar claves porque falta gitleaks', 'Instalá gitleaks: winget install --id Gitleaks.Gitleaks -e')
  else mal('no frenó un commit con una clave', 'El freno de git no detecta claves: avisale al equipo')

  escribir('config.ts', 'export const token = process.env.TOKEN\n')
  git(['add', 'config.ts'])
  r = git(['commit', '-q', '-m', 'sin clave'])
  if (r.status === 0) ok('deja pasar: commit normal en una rama de trabajo')
  else mal('frenó un commit normal en una rama de trabajo', 'El freno de git frena de más: avisale al equipo')

  fs.rmSync(repo, { recursive: true, force: true })
  fs.rmSync(hooks, { recursive: true, force: true })
}

// ------------------------------------------------------------------ resultado
const arreglos = [...new Set(problemas)]
if (arreglos.length === 0) {
  console.log('\nResultado: todo OK. Los frenos están activos en esta compu.')
} else {
  console.log(`\nResultado: hay ${arreglos.length} ${arreglos.length === 1 ? 'cosa' : 'cosas'} para arreglar:`)
  for (const p of arreglos) console.log(`  - ${p}`)
  process.exitCode = 1
}
