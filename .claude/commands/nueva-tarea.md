---
description: Empieza o retoma una tarea. Se fija si ya tiene rama; si no, trae lo último de staging y crea la rama de trabajo.
argument-hint: <tema de la tarea, por ejemplo dictado-por-voz>
---

# /nueva-tarea

La persona quiere trabajar en una tarea. Tema: "$ARGUMENTS".

Tu trabajo es dejarla en la rama correcta para esa tarea: la que ya existe, si la tarea está a medio hacer, o una nueva, creada desde lo último de `staging` en GitHub. Sos el que sabe de git: decidilo vos, explicalo en una línea y pedí el OK. La persona no tiene que saber si hace falta una rama nueva.

Cómo hablar: español rioplatense, simple, de a un paso. Cada vez que corras un comando de git, mostralo con una línea que diga qué hace, así la persona aprende qué pasa por debajo.

## 1. Mirá el estado, sin cambiar nada

- `git status --short --branch`: en qué rama está y si hay cambios sin guardar.
- `git fetch origin --prune`: trae lo último de GitHub sin tocar sus archivos.

Si no es un repo de git, si no hay `origin` o si no existe `origin/staging`, explicá qué falta y pará.

## 2. Si hay cambios sin guardar, pará y preguntá

No sigas hasta resolverlo. Mostrá qué archivos tienen cambios y ofrecé:

- **Son de la tarea en la que estaba** (está en otra rama de trabajo): guardarlos ahí con un commit, y recién después crear la rama nueva.
- **Son para la tarea nueva** (por ejemplo, empezó a trabajar en `staging` sin querer): llevarlos a la rama nueva. `git switch` los lleva solos al crearla. Avisale y seguí. Si git se niega porque chocan con lo último de staging, explicalo y llamá al agente `guia-git`.
- **No los quiere:** que los descarte la persona. Vos no tirás cambios.

## 3. ¿Esta tarea ya tiene rama?

Antes de crear nada, buscá si la tarea ya está empezada:

- Ramas con ese tema, en la compu y en GitHub: `git branch -a --list "*<tema>*"`.
- Sus pull requests: `gh pr list --state all --head <rama>` por cada rama que aparezca.
- Si tenés el seguimiento del plan a mano, la parte de esa tarea puede tener anotada su rama (campo `rama`).

Y decidí:

| Lo que encontraste                                        | Qué hacés                                                                                                                                                                                     |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ya estás en la rama de esa tarea                          | Seguís ahí. Si `staging` avanzó, proponé `/sincronizar`                                                                                                                                       |
| Hay una rama de esa tarea, de esta persona, sin sumar     | Es la tarea a medio hacer: `git switch <rama>` (si solo está en GitHub, `git switch` la trae). Ponela al día con `/sincronizar` y seguí ahí                                                   |
| La rama de esa tarea ya se sumó a `staging`               | No se reusa: la tarea ya entró. Lo nuevo va en una rama nueva desde `staging` (paso 4), con un nombre que diga qué agrega. Si la vieja quedó en la compu, ofrecé borrarla con `git branch -d` |
| La rama de esa tarea es de otra persona                   | No trabajes ahí. Avisá quién la tiene y preguntá: ¿se la pide?, ¿es otra parte?                                                                                                               |
| Estás en la rama de otra tarea y lo que piden es distinto | No mezcles dos tareas en una rama: guardá lo de la actual con un commit (paso 2) y después cambiá o creá la rama correcta                                                                     |
| No hay ninguna                                            | Rama nueva desde `staging` (paso 4)                                                                                                                                                           |

Si no está claro a qué tarea pertenece lo que pide, preguntá antes de decidir.

## 4. Elegí el nombre de la rama nueva

Formato `<tipo>/<tema>`:

| Tipo      | Cuándo                                     |
| --------- | ------------------------------------------ |
| `feature` | Algo nuevo para quien usa la app           |
| `fix`     | Un arreglo                                 |
| `docs`    | Documentación                              |
| `chore`   | Mantenimiento, configuración, dependencias |

El tema va en minúsculas, con guiones, sin tildes ni ñ, y corto (dos a cuatro palabras): "Dictado por voz" → `dictado-por-voz`.

- Si no hay tema, preguntá de qué es la tarea.
- Si el tipo no se deduce del tema, preguntá con las cuatro opciones.
- Si el nombre ya existe (`git branch --list <rama>` o `git ls-remote --heads origin <rama>`) y no es la misma tarea, proponé otro nombre.

Mostrá el nombre propuesto y esperá el OK.

## 5. Creá la rama

`git switch --no-track -c <rama> origin/staging`

Explicale las dos partes:

- Sale de `origin/staging`, lo último que hay en GitHub, y no de su `staging` local, que puede estar vieja.
- `--no-track`: la rama nueva no queda atada a `staging`. Se ata a su propia rama en GitHub la primera vez que se sube, con `/listo`.

## 6. Confirmá y orientá

- `git log --oneline -1` y `git status --short --branch`.
- Decile en qué rama quedó y desde qué commit de `staging` salió.
- Contale cómo sigue:
  - Trabajan juntos en la tarea. Cuando algo quede andando, le vas a proponer un commit chico con el formato `tipo: qué cambió`.
  - Si `staging` avanza mientras tanto: `/sincronizar`.
  - Para entregar: `/listo`, que abre el pull request.
- Anotá en el seguimiento del plan que esa parte la tiene esta persona, con su rama (ver `/seguimiento`).

## Nunca

- Crear la rama desde `main`, ni trabajar en `staging` o `main`.
- Tirar cambios de la persona (`git reset --hard`, `git checkout -- .`, `git stash drop`).
- Si aparece un mensaje que empieza con `FRENO:`, no busques otra forma de hacer lo mismo: explicá qué se frenó, por qué, y cuál es el camino seguro.
