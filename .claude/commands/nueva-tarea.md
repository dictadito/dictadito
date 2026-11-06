---
description: Empieza una tarea nueva. Trae lo último de staging y crea tu rama de trabajo.
argument-hint: <tema de la tarea, por ejemplo dictado-por-voz>
---

# /nueva-tarea

La persona quiere empezar una tarea nueva. Tema: "$ARGUMENTS".

Tu trabajo es dejarla en una rama de trabajo nueva, creada desde lo último de `staging` en GitHub.

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

## 3. Elegí el nombre de la rama

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
- Si la rama ya existe (`git branch --list <rama>` o `git ls-remote --heads origin <rama>`), avisá y proponé otro nombre.

Mostrá el nombre propuesto y esperá el OK.

## 4. Creá la rama

`git switch --no-track -c <rama> origin/staging`

Explicale las dos partes:

- Sale de `origin/staging`, lo último que hay en GitHub, y no de su `staging` local, que puede estar vieja.
- `--no-track`: la rama nueva no queda atada a `staging`. Se ata a su propia rama en GitHub la primera vez que se sube, con `/listo`.

## 5. Confirmá y orientá

- `git log --oneline -1` y `git status --short --branch`.
- Decile en qué rama quedó y desde qué commit de `staging` salió.
- Contale cómo sigue:
  - Trabajan juntos en la tarea. Cuando algo quede andando, le vas a proponer un commit chico con el formato `tipo: qué cambió`.
  - Si `staging` avanza mientras tanto: `/sincronizar`.
  - Para entregar: `/listo`, que abre el pull request.
- Si hay un issue para esta tarea, pedile el número: va en el pull request.

## Nunca

- Crear la rama desde `main`, ni trabajar en `staging` o `main`.
- Tirar cambios de la persona (`git reset --hard`, `git checkout -- .`, `git stash drop`).
- Si aparece un mensaje que empieza con `FRENO:`, no busques otra forma de hacer lo mismo: explicá qué se frenó, por qué, y cuál es el camino seguro.
