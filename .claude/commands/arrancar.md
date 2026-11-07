---
description: Arranca el día (o te dice cómo venís). Revisa tu compu, GitHub y el plan, y te dice qué conviene hacer primero.
---

# /arrancar

La persona arranca el día, o vuelve después de un rato y quiere saber cómo viene. Tu trabajo es mirar todo, sin cambiar nada, y decirle en pocas líneas dónde está parada y qué conviene hacer primero. Úsalo también si la persona dice "arranquemos", "¿cómo vengo?" o "¿qué hay para hoy?".

Cómo hablar: español rioplatense, simple, sin tecnicismos. Primero el resumen; los detalles, solo si los pide.

## 1. Tu compu

- `git fetch origin --prune`: trae lo último de GitHub sin tocar archivos.
- `git status --short --branch`: en qué rama estás y si hay cambios sin guardar.
- `git log --oneline HEAD..origin/staging`: si la versión de prueba avanzó y tu rama no lo tiene.
- `git branch -vv`: las ramas que dicen `: gone]` ya no están en GitHub, porque casi siempre se sumaron y GitHub las borró. Confirmalo con `gh pr list --state merged --head <rama>`. Si se sumaron, se dejan en la compu: no molestan ni se suben a ningún lado (ver "Nunca").

## 2. GitHub

- Tus propuestas abiertas: `gh pr list --author "@me" --state open --json number,title,url,reviewDecision,mergeStateStatus,statusCheckRollup`.
  - Controles en rojo: hay que arreglar algo en esa rama.
  - Espera aprobación: toca algo delicado, y hay que avisarle a otro.
  - Lista para sumar: con todo en verde, la persona toca **Squash and merge**. Si todavía corren los controles o falta el OK, que toque **Enable auto-merge** y se suma sola. Dale el link.
- Lo que espera tu revisión: `gh pr list --search "review-requested:@me" --state open --json number,title,author,url`. Lo delicado se mira en el día.

## 3. El plan

Si tenés el link del plan en la memoria y podés leerlo, leé "Hoy" (`estado/hoy`) y lo que esta persona tiene en el seguimiento. Si "Hoy" no es de hoy, ofrecé armarlo con ella, y si en GitHub hay novedades que el plan no tiene, ofrecé ponerlo al día (ver `/seguimiento`).

Si no podés leerlo, es normal (el plan se compartió desde otra cuenta de claude.ai): seguí con lo de GitHub, que alcanza.

## 4. El resumen

En pocas líneas, en este orden:

1. **Dónde estás:** la rama y si tenés algo sin guardar. Si estás en una rama que ya se sumó, decilo: lo próximo va en una rama nueva, con `/nueva-tarea`.
2. **Qué cambió:** si la versión de prueba avanzó, y qué llegó.
3. **Qué te espera:** propuestas tuyas para sumar o arreglar, y revisiones que te pidieron.
4. **Qué conviene hacer primero**, una sola cosa. Por ejemplo: "traer lo nuevo con `/sincronizar`", "sumar tu propuesta 12", "revisar la de Silvi" o "seguir con el login".

Ofrecé las acciones, pero no hagas ninguna sin el OK:

- Cambios sin guardar de hace rato: `/guardar`.
- La versión de prueba avanzó: `/sincronizar`.

## Nunca

- Cambiar archivos, hacer merge o borrar algo en este comando sin el OK.
- Borrar las ramas ya sumadas. Como se suman con squash, `git branch -d` se niega, y `git branch -D` lo frena el freno, porque podría tirar trabajo. No hace falta: no molestan.
- Si aparece un mensaje que empieza con `FRENO:`, no busques otra forma de hacer lo mismo: explicá qué se frenó, por qué y cuál es el camino seguro.
