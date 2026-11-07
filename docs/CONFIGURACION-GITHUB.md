# Configuración de GitHub

La hace Luca, que es el único que entra a la cuenta `dictadito`. Queda escrita para que cualquiera de los tres pueda revisarla y para poder rehacerla si hiciera falta.

## La cuenta `dictadito`

- **La usa una sola persona: Luca.** Los términos de GitHub no permiten compartir un login.
- **Nunca se usa para escribir código, subir commits ni aprobar pull requests.** Para eso cada uno usa su cuenta personal, Luca incluido (`lukag11`). Si `dictadito` aprobara un pull request de `lukag11`, la regla de "lo aprueba otra persona" quedaría vacía.
- **Verificación en dos pasos** activada en GitHub y en el Gmail de la cuenta, con el celular de Luca.
- **Códigos de recuperación** de GitHub y del Gmail guardados en un lugar que los tres sepan encontrar en una emergencia. Dónde están no se anota en este repo.

## 1. Ahora, con el repo recién creado

### General

**Settings → General**

- **Features:**
  - Issues activado, con **Issue permissions** limitado a colaboradores (no vence, a diferencia del límite de interacciones).
  - Wiki, Discussions y Sponsorships desactivados.
  - Preserve this repository: **no** (si algo se escapa por error, no queda en el archivo de largo plazo de GitHub).
- **Pull Requests:**
  - Allow merge commits: **sí** (para promover de `staging` a `main`)
  - Allow squash merging: **sí** (para sumar tareas a `staging`), con Default commit message: **Pull request title**
  - Allow rebase merging: **no**
  - Always suggest updating pull request branches: **sí**
  - Allow auto-merge: **no**
  - Automatically delete head branches: **sí** (borra la rama de la tarea después de sumarla)

### Colaboradores

**Settings → Collaborators → Add people:** `lukag11` (Luca), `silvibacci` (Silvi) y `jmreyneri` (Julián).

En un repo de cuenta personal, los colaboradores pueden subir ramas, abrir y mergear pull requests, pero no pueden cambiar la configuración. La configuración queda solo en manos de `dictadito`.

### Seguridad

**Settings → Advanced Security** (en algunas cuentas figura como **Code security**)

- Private vulnerability reporting: **activado**
- Dependency graph: **activado** (lo necesita Dependabot para saber qué librerías usamos)
- Dependabot alerts: **activado**
- Malware alerts: **activado** (avisa si una librería que usamos resulta ser maliciosa)
- Dependabot security updates: **activado**
- Grouped security updates: **activado** (un solo pull request por tanda de arreglos)
- Secret Protection: **activado**
- Push protection: **activado** (GitHub frena el push si detecta una clave conocida)
- No usar el botón **Create dependabot.yml**: crea un archivo directo en el repo, sin pull request. Si hace falta, ese archivo entra por un pull request como cualquier otro.
- Lo demás (escaneo con IA, Agentic autofix) queda como viene.

### Actions

**Settings → Actions → General**

- **Actions permissions:** "Allow dictadito, and select non-dictadito, actions and reusable workflows", con "Allow actions created by GitHub" tildado. Las que hagan falta además se suman cuando armemos los controles automáticos.
- **Approval for running fork pull request workflows from contributors:** "Require approval for all external contributors".
- **Workflow permissions:** "Read repository contents and packages permissions". Desactivado: "Allow GitHub Actions to create and approve pull requests".

### Moderación

**Settings → Moderation**

- **Interaction limits:** "Limit to repository collaborators", por 6 meses. **Este límite vence**: el primero vence el 5 de mayo de 2027. Renovarlo unos días antes.
- **Pull request limits:** "Limit open pull requests from users without write access" en **1**, con "Count draft pull requests toward the limit" tildado. Sin reglas de excepción y con la lista de excepciones vacía. No vence: queda de respaldo si el límite anterior se vence sin renovar.
- **Code review limits:** "Limit to users explicitly granted read or higher access". Solo quienes tienen acceso al repo pueden aprobar o pedir cambios en un pull request.

## 2. Después del primer push, cuando existan `main` y `staging`

### Rama por defecto

**Settings → General → Default branch:** cambiar a `staging`. Así los pull requests apuntan ahí sin pensarlo.

### Reglas de las ramas

**Settings → Rules → Rulesets → New ruleset → New branch ruleset.** Se crean dos, uno por rama:

| Opción                                                                  | `staging`          | `main`          |
| ----------------------------------------------------------------------- | ------------------ | --------------- |
| Ruleset name                                                            | `proteger-staging` | `proteger-main` |
| Enforcement status                                                      | Active             | Active          |
| Bypass list                                                             | vacía              | vacía           |
| Target branches                                                         | `staging`          | `main`          |
| Restrict deletions                                                      | sí                 | sí              |
| Block force pushes                                                      | sí                 | sí              |
| Require a pull request before merging                                   | sí                 | sí              |
| · Required approvals                                                    | 1                  | 1               |
| · Dismiss stale pull request approvals when new commits are pushed      | sí                 | sí              |
| · Require review from specific teams                                    | **no**             | **no**          |
| · Require review from Code Owners                                       | sí                 | sí              |
| · Require approval of the most recent reviewable push                   | sí                 | sí              |
| · Require conversation resolution before merging                        | sí                 | sí              |
| · Require an additional approval for unattributed Copilot pull requests | sí                 | sí              |
| · Allowed merge methods                                                 | solo Squash        | solo Merge      |
| Require status checks to pass                                           | sí (ver paso 3)    | sí (ver paso 3) |
| · Require branches to be up to date before merging                      | sí                 | **no**          |

En `main` no se exige "rama actualizada": con merge commits, esa opción trabaría cada promoción.

Dos opciones que GitHub fue sumando:

- **Require review from specific teams** es para organizaciones con equipos. Nosotros no tenemos: si queda tildada sin revisores, estorba.
- **Require an additional approval for unattributed Copilot pull requests** solo actúa si Copilot abre un pull request por su cuenta. No lo usamos; tildada no molesta.

Estado: hecho el 6 de noviembre de 2026.

## 3. Después de que los controles automáticos corran por primera vez

En cada ruleset, tildar **Require status checks to pass** → **Add checks** y agregar los tres controles, por nombre: `check` y `secretos` están en `.github/workflows/controles.yml`, y `reglas-del-pull-request` en `.github/workflows/reglas-del-pull-request.yml`, que corre también cuando se edita el título.

| Control                   | Qué revisa                                                                                          |
| ------------------------- | --------------------------------------------------------------------------------------------------- |
| `check`                   | `npm run check`: formato, reglas del código, tipos, tests, la batería de los frenos y el build      |
| `secretos`                | gitleaks sobre toda la historia, con las reglas de `.gitleaks.toml`                                 |
| `reglas-del-pull-request` | Título con el formato `tipo: qué cambió`, a `main` solo desde `staging` y ramas con nombre de tarea |

GitHub solo ofrece un control después de que corrió al menos una vez: aparecen cuando se abre el primer pull request. Si se cambia el nombre de un job en el archivo, hay que cambiarlo también acá y en las dos reglas.

Estado: hecho el 6 de noviembre de 2026, después de que los tres corrieran en verde en el pull request #1. Al agregarlos, elegir siempre el que dice **GitHub Actions**: si el buscador ofrece "Add manually", el nombre está mal escrito.

## Comprobar que quedó bien

Desde tu cuenta personal, no desde `dictadito`:

- [ ] Un push directo a `staging` es rechazado.
- [ ] Un pull request sin aprobación no habilita el botón de merge.
- [ ] Un pull request a `staging` solo ofrece **Squash and merge**; uno a `main`, solo **Create a merge commit**.
- [ ] Si alguien sube un commit después de una aprobación, la aprobación se cae.
