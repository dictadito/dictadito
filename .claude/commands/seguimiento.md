---
description: Pone al día el seguimiento del plan con lo que pasó en GitHub y lo que charlamos, y arma el plan del día.
argument-hint: '[algo para anotar, si hay]'
---

# /seguimiento

La persona quiere que el seguimiento del plan quede al día. Lo que pidió anotar, si dijo algo: "$ARGUMENTS".

Cómo hablar: español rioplatense, simple, sin tecnicismos. Al final, un resumen corto: qué cambió, cómo vamos y qué sigue.

## 1. Encontrar el plan

- El link del plan de trabajo está en tu memoria. Si no está, pedíselo a la persona y guardalo. Nunca lo escribas en el repo.
- Se escribe con las herramientas de artefactos de claude.ai: la base de datos del plan. Si figuran como herramientas diferidas, cargalas primero.
- Si no tenés esas herramientas, o el plan no te deja escribir, decíselo a la persona en una línea y pará acá.

## 2. Leer antes de escribir

Leé lo que hay, y guardá la versión de cada cosa que vayas a cambiar:

| Dónde             | Qué es                                                                                                                                                                                       |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `estado/actual`   | Capa actual (número del 0 al 10), capas hechas, resumen, lo próximo y fecha de actualización                                                                                                 |
| `estado/hoy`      | El plan del día: fecha, objetivo y tareas (`quien`, `t`, `ok`)                                                                                                                               |
| `trabajos/<id>`   | Cada parte del proyecto: título, capa, orden, quién, estado, resumen, pasos (`criterios`: `t`, `ok` y `g`, que es `funcion` o `calidad`), lo que falta, rama y número de pull request (`pr`) |
| `pendientes/<id>` | Otras tareas y decisiones: título, detalle, quién, estado (`haciendo`, `esperando`, `por-hacer` o `hecho`) y orden                                                                           |
| `ideas/<id>`      | Título, detalle, quién, fecha y estado (`nueva`, `para-charlar`, `aceptada`, `mas-adelante` o `descartada`)                                                                                  |
| `bitacora/<id>`   | Fecha, número de orden dentro del día (`n`), tipo (`hito`, `avance` o `decision`), título, detalle y quién                                                                                   |

Las fechas van como `AAAA-MM-DD`, con el día de Córdoba: de noche, la hora de la computadora en UTC ya da el día siguiente.

## 3. Mirar GitHub

```
gh pr list --state all --limit 30 --json number,title,headRefName,baseRefName,state,reviewDecision,mergedAt,body
```

Cada pull request dice a qué parte corresponde en la línea **Parte del seguimiento**. Si no la tiene, guiate por el título y la rama. Si igual no queda claro, preguntale a la persona.

Por cada parte que se movió:

| Lo que pasó                          | Qué cambia                                                                                     |
| ------------------------------------ | ---------------------------------------------------------------------------------------------- |
| Alguien abrió su rama para esa parte | `estado`: `en-curso`, y `quien`: esa persona                                                   |
| Se abrió el pull request             | `estado`: `en-revision`, y `pr`: su número                                                     |
| Los controles dieron verde           | Tildá "Validaciones compartidas" y "Tests en verde" si el cambio los tiene de verdad           |
| Lo aprobó otra persona               | Tildá "Pull request aprobado"                                                                  |
| Entró a `staging`                    | Tildá "En staging y probada en el celular" solo si alguien confirmó que la probó en el celular |
| Entró a `main` con una promoción     | Tildá "En producción"                                                                          |
| Están todos los pasos tildados       | `estado`: `terminado`                                                                          |

Los pasos de "qué tiene que hacer" se tildan según lo que muestra el pull request, o lo que confirma la persona. Ante la duda, no tildes: anotalo en `falta`.

## 4. Ideas y decisiones

- Una idea nueva va a `ideas`, como `nueva`.
- Si los tres la aceptan, se suma como pasos a la parte que corresponde, o como una parte nueva en su capa (`id` como `c6-nombre`, con el orden que sigue).
- Una decisión tomada va a la bitácora, con tipo `decision`.

## 5. El plan del día

Si `estado/hoy` no es de hoy, armalo con la persona: el objetivo del día y qué encara cada uno. Si ya es de hoy, solo tildá lo que se hizo.

## 6. Escribir

- Todo junto, en un solo lote, cada cambio con la versión que leíste. Si algo cambió mientras tanto, volvé a leer y rehacé ese cambio.
- Una entrada en la bitácora por cada cosa importante.
- Actualizá `estado/actual`: resumen, lo próximo y la fecha.
- Nunca datos reales de docentes o alumnos, claves ni nada de un `.env`.
