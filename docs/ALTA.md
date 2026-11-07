# Cómo sumarte al repo

Para Silvi, Julián y cualquiera que se sume después. Arrancamos todos igual, desde cero, aunque cada uno ya tenga su forma de trabajar en otros proyectos.

**No vas a escribir comandos.** Lo de GitHub se hace a mano en la página (pasos 1 y 2), y el resto son tres mensajes que le pegás a Claude en VS Code (pasos 3 a 5). Claude hace todo y te va explicando.

Si algo no sale como dice acá, preguntale a Claude ahí mismo, con tus palabras. Si sigue sin salir, avisale a Luca. No improvises con la configuración: varios de estos pasos son los que hacen que los frenos funcionen.

## Qué necesitás

- Tu cuenta personal de GitHub. Siempre la tuya: nunca la de otra persona ni la de `dictadito`.
- Una compu con Windows donde puedas instalar programas.
- VS Code con la extensión de Claude Code y tu sesión iniciada.

## Cómo se le pide algo a Claude

1. Abrí VS Code. Arriba, **File** → **New Window** (en español: **Archivo** → **Nueva ventana**).
2. Abrí el chat de Claude: abajo a la derecha, tocá **✻ Claude Code**.
3. Copiá el mensaje del paso, pegalo en el chat con **Ctrl+V** y mandalo con **Enter**.
4. Si Claude te pide permiso para hacer algo, leé qué es y aceptá. Si Windows pregunta si permitís que una app haga cambios, tocá **Sí**.

## 1. Aceptá la invitación (a mano)

Te llega un email de GitHub: la cuenta `dictadito` te invita al repo `dictadito/dictadito`. Abrilo, tocá **View invitation** y después **Accept invitation**, con tu cuenta personal. Si no encontrás el email, la invitación también está en [github.com/notifications](https://github.com/notifications).

La invitación vence a los 7 días. Si venció, pedile a Luca que te la reenvíe.

## 2. Asegurá tu cuenta de GitHub (a mano)

**Verificación en dos pasos.** En GitHub: tu foto arriba a la derecha → **Settings** → **Password and authentication** → **Enable two-factor authentication**. Seguí los pasos con una app del celular y guardá los códigos de recuperación en un lugar seguro: si perdés el celular, son la única forma de volver a entrar. Si ya la tenés activada, salteá esta parte.

**Email privado.** El repo es público y cada commit muestra el email de quien lo hizo. En **Settings** → **Emails**:

- Tildá **Keep my email addresses private**.
- Tildá **Block command line pushes that expose my email**.
- Copiá la dirección que termina en `@users.noreply.github.com` y guardala: Claude te la pide en el paso 4.

Los pasos 3 a 5 se hacen cuando Luca avise que el proyecto está listo. Son unos 20 minutos, de corrido.

## 3. Prepará la compu (con Claude)

Ventana nueva de VS Code, chat de Claude, y pegale esto:

```text
Hola Claude. Me estoy sumando al proyecto Dictadito y necesito preparar esta compu, que es Windows. Hacé estos pasos de a uno:

1. Fijate cuáles de estos programas ya tengo: Git, NVM para Windows, Gitleaks y GitHub CLI. Si ya tengo Node instalado de otra forma, explicame qué conviene antes de tocar nada.
2. Instalá con winget los que falten: Git.Git, CoreyButler.NVMforWindows, Gitleaks.Gitleaks y GitHub.cli.
3. Habilitá los scripts de PowerShell para mi usuario: Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force

Si Windows me va a pedir permiso, avisame antes. Al terminar, recordame cerrar y volver a abrir VS Code.
```

Cuando Claude termine, **cerrá VS Code del todo y volvé a abrirlo**. Si no, VS Code no ve los programas que se acaban de instalar.

## 4. Bajá el proyecto y dejalo andando (con Claude)

Otra vez ventana nueva y chat de Claude:

```text
Hola Claude. Sigo con el alta en el proyecto Dictadito: ahora hay que conectar mi cuenta y bajar el proyecto. Hacé estos pasos de a uno:

1. Instalá Node 22 con nvm y dejalo como el que se usa (nvm install 22 y nvm use 22).
2. Conectá GitHub CLI con MI cuenta personal de GitHub (gh auth login, por el navegador y con HTTPS), nunca con la cuenta dictadito, y hacé que git use esa cuenta (gh auth setup-git). Guiame cuando tenga que hacer algo en el navegador.
3. Creá la carpeta C:\Proyectos (fuera de OneDrive) y cloná ahí https://github.com/dictadito/dictadito.git
4. Configurá git solo para ese repo: mi nombre, mi email privado de GitHub (el que termina en @users.noreply.github.com) y pull.rebase false. Preguntame el nombre y el email.
5. Adentro del repo corré npm install y después npm run probar-frenos. Tiene que terminar en "todo OK".
6. Abrí la carpeta del proyecto en una ventana nueva de VS Code.

Si algo no lo podés hacer desde acá, explicame cómo hacerlo yo, paso a paso.
```

En un momento Claude te muestra un código corto (algo como `ABCD-1234`) y se abre GitHub en el navegador: pegá el código y aceptá. Fijate que arriba a la derecha esté **tu foto**, no la de `dictadito`.

Al final se abre otra ventana de VS Code con el proyecto. Si no se abre sola: **File** → **Open Folder** (**Archivo** → **Abrir carpeta**) → `C:\Proyectos\dictadito`. **Desde acá trabajás siempre en esa ventana.**

## 5. Probá el freno y hacé tu primer pull request (con Claude)

En la ventana del proyecto, abrí el chat de Claude y pegale esto:

```text
Hola Claude. Ya tengo Dictadito abierto. Dos cosas:

1. Como prueba, intentá git push origin main. El freno lo tiene que bloquear y tiene que aparecer un mensaje que empieza con FRENO:
2. Después quiero hacer mi pull request de práctica: empezá una tarea nueva llamada alta y mi nombre, agregá mi línea al final de docs/EQUIPO.md (preguntame mi nombre y mi usuario de GitHub) y entregala.
```

Primero tiene que aparecer el `FRENO:`. Si no aparece, pará y avisale a Luca: sin frenos andando no se trabaja.

Después Claude te muestra un resumen, te pide el OK y te da un link. Mandalo al grupo para que alguien lo revise. Cuando te lo aprueben, abrí el link y tocá el botón verde **Squash and merge** y después **Confirm**.

Si otro sumó su línea antes que vos, Claude te va a avisar que hay un conflicto. Es a propósito: pedile que te ayude a resolverlo.

Listo: ya estás trabajando en Dictadito. Cómo es el día a día: [GUIA.md](GUIA.md).

## Nunca

- Trabajar directo en `staging` o en `main`.
- Pegar claves, tokens o datos reales de docentes o alumnos. Tampoco en issues, pull requests ni capturas: todo es público.
- Usar la cuenta de otra persona o compartir la tuya.
- Bajar o correr el código de un pull request de alguien que no es del equipo.
- Abrir dos sesiones de Claude en la misma carpeta.

## Si algo no sale

- **Con git:** decile a Claude "me trabé con git" y contale qué pasó. Usa el agente `guia-git`.
- **Con la instalación o los permisos:** Luca.

## Qué hace Claude por debajo

Por si hay que revisar algo a mano.

| Paso | Comandos                                                                                                                                                                                                                                                                                                                                        |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3    | `winget install --id Git.Git -e`, lo mismo con `CoreyButler.NVMforWindows`, `Gitleaks.Gitleaks` y `GitHub.cli`; `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force` (sin esto, PowerShell no deja correr `npm`)                                                                                                                        |
| 4    | `nvm install 22` y `nvm use 22` (Node 22 es la versión fijada para el proyecto); `gh auth login` y `gh auth setup-git`; `git clone https://github.com/dictadito/dictadito.git`; `git config user.name`, `user.email` y `pull.rebase false`; `npm install`, que activa el freno de git (`core.hooksPath` = `.githooks`); `npm run probar-frenos` |
| 5    | `git push origin main`, que el freno de Claude bloquea; `/nueva-tarea` y `/listo`                                                                                                                                                                                                                                                               |

## Listo cuando

- [ ] Aceptaste la invitación
- [ ] Tenés la verificación en dos pasos y el email privado activados
- [ ] `npm run probar-frenos` terminó en "todo OK"
- [ ] Claude mostró `FRENO:` cuando le pediste subir a `main`
- [ ] Tu pull request de práctica está sumado a `staging`
