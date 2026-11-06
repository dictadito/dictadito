'use strict'
// Pruebas del freno de Claude (.claude/hooks/frenos.cjs). Correr: node .claude/hooks/frenos.test.cjs
// Cada caso dice qué herramienta pide Claude y si el freno tiene que BLOQUEAR o dejar PASAR.
// Sale con código 1 si algún caso falla (lo usan los controles automáticos).
// Todos los datos son inventados. Las URLs remotas se arman por partes para que gitleaks
// no las confunda con claves reales.

const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const { decidir } = require('./frenos.cjs')

const URL_LOCAL = 'postgresql://u:p@localhost:5432/dictadito'
const URL_REMOTA = ['postgresql://postgres.abc', ':pw', '@aws-0-us-east-1.pooler.supabase.com:6543/postgres'].join('')

// Repos falsos: uno con .env local, uno con .env remoto y uno sin .env.
function repoFalso(nombre, env) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `frenos-${nombre}-`))
  if (env !== null) {
    fs.mkdirSync(path.join(dir, 'apps', 'backend'), { recursive: true })
    fs.writeFileSync(path.join(dir, 'apps', 'backend', '.env'), env)
  }
  return dir
}
const LOCAL = repoFalso('local', [`# DATABASE_URL="${URL_REMOTA}"`, `DATABASE_URL="${URL_LOCAL}"`, `DIRECT_URL=${URL_LOCAL} # local`].join('\n'))
const REMOTO = repoFalso('remoto', `DATABASE_URL="${URL_REMOTA}"\n`)
const SIN_ENV = repoFalso('sin-env', null)

const sh = (command, extra = {}) => ({ tool_name: 'Bash', tool_input: { command }, cwd: LOCAL, ...extra })
const ps = (command, extra = {}) => ({ tool_name: 'PowerShell', tool_input: { command }, cwd: LOCAL, ...extra })
const archivo = (tool, file_path, extra = {}) => ({ tool_name: tool, tool_input: { file_path, ...extra }, cwd: LOCAL })
const enLocal = (rel) => path.join(LOCAL, rel)

// [descripción, entrada, 'bloquea' | 'pasa', rama actual (opcional)]
const CASOS = [
  // --- subir a main o staging
  ['push a main', sh('git push origin main'), 'bloquea'],
  ['push a staging', sh('git push origin staging'), 'bloquea'],
  ['push HEAD:staging', sh('git push origin HEAD:staging'), 'bloquea'],
  ['push de una rama de trabajo a staging', sh('git push origin feature/x:staging'), 'bloquea'],
  ['promover staging:main', sh('git push origin staging:main'), 'bloquea'],
  ['push con sha a refs/heads/main', sh('git push origin 542a80e:refs/heads/main'), 'bloquea'],
  ['borrar main en GitHub', sh('git push origin --delete main'), 'bloquea'],
  ['borrar staging en GitHub', sh('git push origin --delete staging'), 'bloquea'],
  ['push --mirror', sh('git push --mirror origin'), 'bloquea'],
  ['push --all', sh('git push --all origin'), 'bloquea'],
  ['push sin rama estando en main', sh('git push'), 'bloquea', 'main'],
  ['push sin rama estando en staging', sh('git push'), 'bloquea', 'staging'],
  ['push origin HEAD estando en staging', sh('git push origin HEAD'), 'bloquea', 'staging'],
  ['git -C ruta push a main', sh('git -C "otra carpeta" push origin main'), 'bloquea'],
  ['git --no-pager push a main', sh('git --no-pager push origin main'), 'bloquea'],
  ['push a staging al final de un comando compuesto', sh('git add docs/x.md && git commit -m "docs: x" && git push origin staging'), 'bloquea'],
  ['push a main desde PowerShell', ps('git push origin main'), 'bloquea'],
  ['push a main por una herramienta externa', { tool_name: 'mcp__terminal__run', tool_input: { command: 'git push origin main' }, cwd: LOCAL }, 'bloquea'],

  // --- forzar
  ['push --force de una rama propia', sh('git push --force origin feature/x'), 'bloquea'],
  ['push --force-with-lease', sh('git push --force-with-lease origin feature/x'), 'bloquea'],
  ['push -f', sh('git push -f'), 'bloquea', 'feature/x'],
  ['push +rama', sh('git push origin +feature/x'), 'bloquea'],

  // --- nombres de rama
  ['rama sin prefijo', sh('git push -u origin mi-rama'), 'bloquea'],
  ['rama con mayúsculas', sh('git push origin Feature/Dictado'), 'bloquea'],
  ['push sin rama estando en una rama mal nombrada', sh('git push'), 'bloquea', 'prueba'],

  // --- pasan
  ['push -u de la rama nueva', sh('git push -u origin feature/dictado-por-voz'), 'pasa'],
  ['push de un fix', sh('git push origin fix/fecha-cordoba'), 'pasa'],
  ['push de docs', sh('git push -u origin docs/guia'), 'pasa'],
  ['push de chore', sh('git push origin chore/frenos'), 'pasa'],
  ['push sin rama en una rama de trabajo', sh('git push'), 'pasa', 'feature/x'],
  ['push origin HEAD en una rama de trabajo', sh('git push origin HEAD'), 'pasa', 'docs/guia'],
  ['borrar una rama de trabajo vieja', sh('git push origin --delete feature/vieja'), 'pasa'],
  ['rama que contiene la palabra main', sh('git push origin feature/main-menu'), 'pasa'],

  // --- saltear los frenos de git
  ['commit --no-verify', sh('git commit --no-verify -m "x"'), 'bloquea'],
  ['commit -n', sh('git commit -n -m "x"'), 'bloquea'],
  ['push --no-verify', sh('git push --no-verify origin feature/x'), 'bloquea'],
  ['git -c core.hooksPath', sh('git -c core.hooksPath=/dev/null commit -m "x"'), 'bloquea'],
  ['vaciar core.hooksPath', sh('git config core.hooksPath ""'), 'bloquea'],
  ['borrar core.hooksPath', sh('git config --unset core.hooksPath'), 'bloquea'],
  ['core.hooksPath global a otra carpeta', sh('git config --global core.hooksPath C:/hooks'), 'bloquea'],
  ['activar los frenos (lo que hace npm install)', sh('git config core.hooksPath .githooks'), 'pasa'],
  ['consultar core.hooksPath', sh('git config --get core.hooksPath'), 'pasa'],
  ['leer core.hooksPath', sh('git config core.hooksPath'), 'pasa'],

  // --- rebase
  ['git rebase', sh('git rebase origin/staging'), 'bloquea'],
  ['git rebase -i', sh('git rebase -i HEAD~3'), 'bloquea'],
  ['git pull --rebase', sh('git pull --rebase'), 'bloquea'],
  ['git pull -r', sh('git pull -r origin staging'), 'bloquea'],
  ['pull.rebase true', sh('git config pull.rebase true'), 'bloquea'],
  ['git rebase --abort (salir de un rebase)', sh('git rebase --abort'), 'pasa'],
  ['git pull', sh('git pull'), 'pasa'],
  ['git merge origin/staging (sincronizar)', sh('git fetch origin && git merge origin/staging'), 'pasa', 'feature/x'],
  ['pull.rebase false', sh('git config pull.rebase false'), 'pasa'],

  // --- commits en ramas protegidas
  ['commit en main', sh('git commit -m "x"'), 'bloquea', 'main'],
  ['commit en staging', sh('git commit -m "x"'), 'bloquea', 'staging'],
  ['cherry-pick en staging', sh('git cherry-pick abc123'), 'bloquea', 'staging'],
  ['revert en main', sh('git revert abc123'), 'bloquea', 'main'],
  ['commit en una rama de trabajo', sh('git commit -m "feat: dictado"'), 'pasa', 'feature/x'],
  ['revert en una rama de trabajo', sh('git revert abc123'), 'pasa', 'fix/x'],

  // --- reescribir historia
  ['filter-branch', sh('git filter-branch --tree-filter "rm x" HEAD'), 'bloquea'],
  ['filter-repo', sh('git filter-repo --path secreto.txt --invert-paths'), 'bloquea'],
  ['reflog expire', sh('git reflog expire --expire=now --all'), 'bloquea'],
  ['gc --prune=now', sh('git gc --prune=now'), 'bloquea'],
  ['git gc común', sh('git gc'), 'pasa'],
  ['ver el reflog', sh('git reflog'), 'pasa'],

  // --- git que tira trabajo
  ['reset --hard', sh('git reset --hard origin/staging'), 'bloquea'],
  ['clean -fd', sh('git clean -fd'), 'bloquea'],
  ['checkout -- .', sh('git checkout -- .'), 'bloquea'],
  ['checkout -f', sh('git checkout -f staging'), 'bloquea'],
  ['switch --discard-changes', sh('git switch --discard-changes staging'), 'bloquea'],
  ['restore de un archivo', sh('git restore apps/backend/src/app.ts'), 'bloquea'],
  ['stash drop', sh('git stash drop'), 'bloquea'],
  ['branch -D', sh('git branch -D feature/x'), 'bloquea'],
  ['add .', sh('git add .'), 'bloquea'],
  ['add -A', sh('git add -A'), 'bloquea'],
  ['add -f (forzar algo ignorado)', sh('git add -f apps/backend/.env.local'), 'bloquea'],
  ['commit -am', sh('git commit -am "fix"'), 'bloquea', 'feature/x'],
  ['add de un archivo', sh('git add docs/GUIA.md'), 'pasa'],
  ['commit -m con guiones en el mensaje', sh('git commit -m "fix: -a y -A no son opciones acá"'), 'pasa', 'feature/x'],
  ['commit --amend', sh('git commit --amend -m "x"'), 'pasa', 'feature/x'],
  ['restore --staged (solo saca del commit)', sh('git restore --staged docs/GUIA.md'), 'pasa'],
  ['branch -d (minúscula)', sh('git branch -d feature/vieja'), 'pasa'],
  ['cambiar de rama', sh('git switch staging'), 'pasa'],
  ['crear rama', sh('git switch -c feature/nueva origin/staging'), 'pasa'],
  ['status y log', sh('git status && git log --oneline -5'), 'pasa'],
  ['stash para guardar', sh('git stash push -m "a medias"'), 'pasa'],

  // --- GitHub desde la terminal
  ['gh pr merge', sh('gh pr merge 12 --squash'), 'bloquea'],
  ['gh pr review --approve', sh('gh pr review 12 --approve'), 'bloquea'],
  ['gh pr review -a', sh('gh pr review 12 -a'), 'bloquea'],
  ['gh pr review --request-changes', sh('gh pr review 12 --request-changes -b "x"'), 'bloquea'],
  ['gh repo delete', sh('gh repo delete dictadito/dictadito --yes'), 'bloquea'],
  ['gh repo edit', sh('gh repo edit --visibility private'), 'bloquea'],
  ['gh secret set', sh('gh secret set CLAVE'), 'bloquea'],
  ['gh api PUT merge', sh('gh api -X PUT repos/dictadito/dictadito/pulls/12/merge'), 'bloquea'],
  ['gh api con campos (POST)', sh('gh api repos/dictadito/dictadito/rulesets -f name=x'), 'bloquea'],
  ['gh pr create', sh('gh pr create --base staging --title "feat: x" --body "y"'), 'pasa'],
  ['gh pr view', sh('gh pr view 12'), 'pasa'],
  ['gh pr checks', sh('gh pr checks 12'), 'pasa'],
  ['gh pr review --comment', sh('gh pr review 12 --comment -b "se ve bien"'), 'pasa'],
  ['gh api GET', sh('gh api repos/dictadito/dictadito/pulls'), 'pasa'],

  // --- Prisma
  ['db push con .env remoto', sh('cd apps/backend && npx prisma db push', { cwd: REMOTO }), 'bloquea'],
  ['db push sin .env (no sé a dónde va)', sh('npx prisma db push', { cwd: SIN_ENV }), 'bloquea'],
  ['db push con URL remota en el comando', sh(`DATABASE_URL="${URL_REMOTA}" npx prisma db push`), 'bloquea'],
  ['db push con --accept-data-loss (aun local)', sh('npx prisma db push --accept-data-loss'), 'bloquea'],
  ['migrate reset', sh('npx prisma migrate reset'), 'bloquea'],
  ['migrate deploy con .env remoto', sh('npx prisma migrate deploy', { cwd: REMOTO }), 'bloquea'],
  ['migrate dev con .env local', sh('cd apps/backend && npx prisma migrate dev --name inicial'), 'pasa'],
  ['prisma generate', sh('npx prisma generate', { cwd: REMOTO }), 'pasa'],
  ['prisma migrate diff (solo mira)', sh('npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma', { cwd: REMOTO }), 'pasa'],

  // --- backend contra una base remota
  ['npm run dev del backend con .env remoto', sh('cd apps/backend && npm run dev', { cwd: REMOTO }), 'bloquea'],
  ['tsx watch con .env remoto', sh('npx tsx watch src/index.ts', { cwd: REMOTO }), 'bloquea'],
  ['script de datos con .env remoto', sh('cd apps/backend && npx tsx scripts/cargar-sala.ts', { cwd: REMOTO }), 'bloquea'],
  ['npm run dev del backend con .env local', sh('cd apps/backend && npm run dev'), 'pasa'],
  ['npm run dev del backend sin .env', sh('cd apps/backend && npm run dev', { cwd: SIN_ENV }), 'pasa'],
  ['npm run dev del frontend', sh('cd apps/frontend && npm run dev', { cwd: REMOTO }), 'pasa'],
  ['pruebas del backend', sh('cd apps/backend && npm test', { cwd: REMOTO }), 'pasa'],

  // --- datos masivos
  ['deleteMany desde node -e', sh('node -e "await prisma.observacion.deleteMany({})"'), 'bloquea'],
  ['TRUNCATE por psql', sh('psql "$URL" -c "TRUNCATE observaciones"'), 'bloquea'],
  ['buscar deleteMany en el código', sh('grep -rn "deleteMany" apps/backend/src | head -20'), 'pasa'],
  ['git log buscando TRUNCATE', sh('git log --oneline -S "TRUNCATE"'), 'pasa'],

  // --- borrados
  ['find -delete', sh('find . -name "*.tmp" -delete'), 'bloquea'],
  ['rm -rf de código', sh('rm -rf apps/backend/src'), 'bloquea'],
  ['Remove-Item -Recurse de código', ps('Remove-Item -Recurse -Force .\\apps'), 'bloquea'],
  ['rm -rf node_modules y dist', sh('rm -rf node_modules apps/frontend/dist'), 'pasa'],
  ['rm de un archivo suelto', sh('rm notas-viejas.txt'), 'pasa'],

  // --- publicar desde la terminal
  ['vercel --prod', sh('vercel --prod'), 'bloquea'],
  ['railway up', sh('railway up'), 'bloquea'],
  ['railway variables --set', sh('railway variables --set NIVEL=x'), 'bloquea'],
  ['supabase db push', sh('npx supabase db push'), 'bloquea'],
  ['supabase db reset --linked', sh('npx supabase db reset --linked'), 'bloquea'],
  ['vercel (vista previa)', sh('vercel'), 'pasa'],
  ['supabase start (local)', sh('npx supabase start'), 'pasa'],

  // --- .env por terminal
  ['cat del .env del backend', sh('cat apps/backend/.env'), 'bloquea'],
  ['Get-Content .env', ps('Get-Content .env'), 'bloquea'],
  ['pisar .env.local', sh('echo "X=1" > .env.local'), 'bloquea'],
  ['crear el .env desde el ejemplo', sh('cp apps/backend/.env.example apps/backend/.env'), 'bloquea'],
  ['cat .env.example', sh('cat apps/backend/.env.example'), 'pasa'],
  ['git check-ignore del .env', sh('git check-ignore -v apps/backend/.env'), 'pasa'],
  ['candado: imprimir solo el host', sh("node --input-type=module -e \"await import('dotenv/config'); console.log(new URL(process.env.DATABASE_URL).host)\""), 'pasa'],

  // --- el freno se protege
  ['sed -i sobre settings.json', sh("sed -i 's/PreToolUse/X/' .claude/settings.json"), 'bloquea'],
  ['redirigir encima del hook', sh('echo "" > .claude/hooks/frenos.cjs'), 'bloquea'],
  ['borrar el hook', sh('rm .claude/hooks/frenos.cjs'), 'bloquea'],
  ['borrar el freno de git', sh('rm .githooks/pre-commit'), 'bloquea'],
  ['pisar la configuración de gitleaks', sh('echo "" > .gitleaks.toml'), 'bloquea'],
  ['Set-Content al settings global', ps('Set-Content C:\\Users\\x\\.claude\\settings.json "{}"'), 'bloquea'],
  ['disableAllHooks por terminal', sh('node -e "x.disableAllHooks = true"'), 'bloquea'],
  ['leer settings.json', sh('cat .claude/settings.json'), 'pasa'],
  ['leer el freno de git', sh('cat .githooks/pre-commit'), 'pasa'],

  // --- herramientas de archivos
  ['Read del .env', archivo('Read', 'C:\\repo\\apps\\backend\\.env'), 'bloquea'],
  ['Read de .env.production', archivo('Read', '/repo/apps/frontend/.env.production'), 'bloquea'],
  ['Write de un .env', archivo('Write', '/repo/.env', { content: 'X=1' }), 'bloquea'],
  ['Grep dentro de un .env', { tool_name: 'Grep', tool_input: { pattern: 'URL', path: '/repo/apps/backend/.env' }, cwd: LOCAL }, 'bloquea'],
  ['Grep con glob de .env', { tool_name: 'Grep', tool_input: { pattern: 'URL', glob: '**/.env*' }, cwd: LOCAL }, 'bloquea'],
  ['Edit del settings.json', archivo('Edit', 'C:\\repo\\.claude\\settings.json', { old_string: 'a', new_string: 'b' }), 'bloquea'],
  ['Write del hook', archivo('Write', '/repo/.claude/hooks/frenos.cjs', { content: '' }), 'bloquea'],
  ['Edit del freno de git', archivo('Edit', '/repo/.githooks/pre-commit', { old_string: 'a', new_string: 'b' }), 'bloquea'],
  ['Write de .gitleaks.toml', archivo('Write', '/repo/.gitleaks.toml', { content: '' }), 'bloquea'],
  ['Write con disableAllHooks', archivo('Write', '/repo/notas.json', { content: '{"disableAllHooks": true}' }), 'bloquea'],
  ['Edit de código estando en main', archivo('Edit', enLocal('apps/backend/src/app.ts'), { old_string: 'a', new_string: 'b' }), 'bloquea', 'main'],
  ['Write de un archivo nuevo estando en staging', archivo('Write', enLocal('docs/nuevo/notas.md'), { content: 'x' }), 'bloquea', 'staging'],
  ['Read estando en main', archivo('Read', enLocal('apps/backend/.env.example')), 'pasa', 'main'],
  ['Edit de código en una rama de trabajo', archivo('Edit', enLocal('apps/backend/src/app.ts'), { old_string: 'a', new_string: 'b' }), 'pasa', 'feature/x'],
  ['Read del .env.example', archivo('Read', '/repo/apps/backend/.env.example'), 'pasa'],
  ['Read del settings.json', archivo('Read', '/repo/.claude/settings.json'), 'pasa'],
  ['Read del hook', archivo('Read', '/repo/.claude/hooks/frenos.cjs'), 'pasa'],
  ['Write de un documento', archivo('Write', '/repo/docs/GUIA.md', { content: 'x' }), 'pasa'],
  ['Grep normal en src', { tool_name: 'Grep', tool_input: { pattern: 'deleteMany', path: '/repo/src' }, cwd: LOCAL }, 'pasa'],
  ['Glob', { tool_name: 'Glob', tool_input: { pattern: '**/*.ts' }, cwd: LOCAL }, 'pasa'],
  ['herramienta sin comando', { tool_name: 'WebSearch', tool_input: { query: 'git merge' }, cwd: LOCAL }, 'pasa'],
]

let fallas = 0
const silencioso = process.argv.includes('--resumen')
for (const [desc, entrada, esperado, rama] of CASOS) {
  if (rama === undefined) delete process.env.FRENOS_RAMA_ACTUAL
  else process.env.FRENOS_RAMA_ACTUAL = rama
  let r
  try {
    r = decidir(entrada)
  } catch (err) {
    r = { motivo: `ERROR: ${err.message}` }
  }
  const obtenido = r ? 'bloquea' : 'pasa'
  const ok = obtenido === esperado && !String(r && r.motivo).startsWith('ERROR')
  if (!ok) fallas++
  if (!silencioso || !ok) {
    console.log(`${ok ? 'OK   ' : 'FALLA'} [${esperado.padEnd(7)}] ${desc}${ok ? '' : `  → obtuvo: ${obtenido}${r ? ` (${r.motivo})` : ''}`}`)
  }
}
delete process.env.FRENOS_RAMA_ACTUAL

// --- De punta a punta: el script real por stdin, como lo llama Claude Code.
const HOOK = path.join(__dirname, 'frenos.cjs')
const correr = (input) => spawnSync(process.execPath, [HOOK], { input, encoding: 'utf8' })
const bloqueado = correr(JSON.stringify({ tool_name: 'Bash', tool_input: { command: 'git push origin main' }, cwd: LOCAL }))
const libre = correr(JSON.stringify({ tool_name: 'Bash', tool_input: { command: 'git status' }, cwd: LOCAL }))
const roto = correr('esto no es json')
const e2e = [
  ['bloqueo: sale con código 2 y explica el camino seguro', bloqueado.status === 2 && /^FRENO: /.test(bloqueado.stderr) && /Camino seguro: /.test(bloqueado.stderr)],
  ['comando normal: sale con código 0 y en silencio', libre.status === 0 && libre.stderr === ''],
  ['pedido ilegible: bloquea por las dudas', roto.status === 2 && /FRENO: /.test(roto.stderr)],
]
for (const [desc, ok] of e2e) {
  if (!ok) fallas++
  if (!silencioso || !ok) console.log(`${ok ? 'OK   ' : 'FALLA'} [punta a punta] ${desc}`)
}

for (const d of [LOCAL, REMOTO, SIN_ENV]) fs.rmSync(d, { recursive: true, force: true })

const total = CASOS.length + e2e.length
console.log(`${silencioso ? '' : '\n'}${total - fallas}/${total} casos OK`)
process.exit(fallas ? 1 : 0)
