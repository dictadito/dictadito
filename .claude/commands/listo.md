---
description: Entrega la tarea. Guarda lo que falta, corre los controles, sube tu rama y abre el pull request contra staging.
argument-hint: '[número del issue, si hay]'
---

# /listo

La persona terminó su tarea, o quiere mostrarla. Tu trabajo es dejar todo guardado, subir la rama y abrir el pull request contra `staging` con la plantilla completa. Issue: "$ARGUMENTS" (puede estar vacío).

Cómo hablar: español rioplatense, simple, de a un paso. Cada vez que corras un comando de git, mostralo con una línea que diga qué hace. **Antes de subir nada, mostrá el resumen y esperá el OK.**

## 1. Estado

`git status --short --branch`

- Si está en `staging` o en `main`, pará: primero hay que llevar los cambios a una rama de trabajo con `/nueva-tarea`.
- La rama tiene que llamarse `feature/…`, `fix/…`, `chore/…` o `docs/…`. Si no, proponé renombrarla con `git branch -m <tipo>/<tema>` y esperá el OK.

## 2. Guardá lo que falta

Si hay cambios sin guardar:

- Mostrá la lista de archivos. Fijate que no haya nada que no va: un `.env`, capturas o textos con datos reales, audios, archivos enormes, pruebas sueltas. Si dudás, preguntá.
- Agregá archivo por archivo: `git add <archivo>`. Nunca `git add .`.
- Proponé el mensaje con el formato `tipo: qué cambió`, en minúscula y en español, y hacé `git commit -m "..."`.
- Si el freno de git frena el commit, leé el mensaje con la persona y seguí el camino seguro que indica.

## 3. Ponete al día

- `git fetch origin --prune`
- `git log --oneline HEAD..origin/staging`: si `staging` avanzó, hacé primero lo de `/sincronizar` (merge, nunca rebase).

## 4. Controles

- Si `package.json` tiene el script `check`: `npm run check`. Tiene que dar verde. Si falla, mostrá qué falló y arreglalo con la persona antes de seguir.
- Si todavía no existe, avisá que los controles automáticos de GitHub lo van a revisar igual, y seguí.

## 5. Mirá lo que vas a entregar

- `git log --oneline origin/staging..HEAD` y `git diff --stat origin/staging...HEAD`.
- Si cambian más de 400 líneas, sugerí partir la tarea o explicar el porqué en el pull request.
- Preguntá lo que la plantilla necesita y no sabés:
  - ¿Hay un issue? Va como `Closes #N`.
  - Si cambió una pantalla: ¿tiene la captura a 360 px? Se agrega después en GitHub, arrastrándola al pull request.
  - Si cambió la base de datos: ¿está la migración de Prisma?
  - ¿Toca un área sensible? Son `.github/`, `.claude/`, `.githooks/`, `.gitleaks.toml`, `scripts/`, `package.json`, las migraciones, `apps/backend/src/ia/` y `CLAUDE.md`.
  - ¿Quedó documentación vieja por este cambio?
- Mostrá el resumen: rama, commits, título y texto del pull request. Esperá el OK.

## 6. Subí la rama

`git push -u origin <rama>`: la sube a GitHub y la ata a su rama remota. La próxima vez alcanza con `git push`.

## 7. Abrí el pull request

- **Título:** `tipo: qué cambió`, igual que un mensaje de commit. Importa porque al sumar con squash, el título queda como el commit de la tarea en `staging`.
- **Texto:** la plantilla de `.github/pull_request_template.md` completa:
  - qué cambia y por qué;
  - `Closes #N`, o sin esa línea si no hay issue;
  - cómo lo probó;
  - las casillas tildadas solo si son ciertas.

Escribí el texto en un archivo temporal fuera del repo. Después fijate si la rama ya tiene propuesta, porque `/guardar` la abre como borrador: `gh pr view <rama> --json number,isDraft,url`.

- **Ya tiene:** completala y sacala de borrador.
  - `gh pr edit <número> --title "<título>" --body-file <archivo>`
  - `gh pr ready <número>`: recién ahí se pide la revisión.
- **No tiene:** abrila.
  - `gh pr create --base staging --head <rama> --title "<título>" --body-file <archivo>`

Si `gh` no está instalado o no tiene la sesión iniciada, no te trabes. Dale a la persona este link para abrirlo desde el navegador, con el título y el texto listos para pegar:

`https://github.com/dictadito/dictadito/compare/staging...<rama>?expand=1`

Para instalar `gh`: `winget install --id GitHub.cli -e` y después `gh auth login` con su cuenta personal, nunca con `dictadito`.

## 8. Cerrá

- Pasale el link del pull request.
- Contale lo que sigue:
  - Otra persona lo revisa.
  - Si le piden cambios, los hace en esta misma rama y con `git push` el pull request se actualiza solo.
  - Si sube algo después de que lo aprueben, la aprobación se cae y hay que pedirla de nuevo.
- Cuando esté aprobado y con los controles en verde, la persona toca **Squash and merge** en GitHub. Eso no lo hace Claude.

## Nunca

- Subir a `staging` o `main`, forzar un push, aprobar ni mergear. El freno los bloquea igual.
- `git add .` o `git commit -a`.
- Si aparece un mensaje que empieza con `FRENO:`, no busques otra forma de hacer lo mismo: explicá qué se frenó, por qué, y cuál es el camino seguro.
