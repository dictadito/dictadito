# Cómo trabajamos

Guía de Luca, Silvi y Julián para trabajar en paralelo sobre el mismo código sin pisarnos. Es la referencia corta que vive en el repo; si cambia la forma de trabajar, se cambia acá, por pull request.

¿Recién te sumás? Empezá por [ALTA.md](ALTA.md).

## Palabras

- **Rama:** una línea paralela del código donde trabajás sin tocar lo de los demás.
- **Commit:** una foto guardada de tus cambios, con un mensaje.
- **Push:** subir tus commits a GitHub.
- **Pull request:** el pedido de sumar tu rama a `staging`. Si toca algo delicado, otra persona lo aprueba antes de que se sume; si no, entra con los controles en verde y otro lo revisa después. En GitHub aparece abreviado como PR.
- **Lo delicado:** lo que figura en `.github/CODEOWNERS`: frenos, reglas para Claude, controles automáticos, dependencias, base de datos e IA.
- **Controles automáticos:** lo que GitHub corre en cada pull request (formato, reglas del código, tipos, tests, build, claves, y el título y el nombre de la rama). Si da rojo, no se puede sumar.
- **Squash:** juntar todos los commits de una rama en uno solo al sumarla.

## Ramas

| Rama                        | Para qué                     | Sale de   | Vuelve a             |
| --------------------------- | ---------------------------- | --------- | -------------------- |
| `staging` (por defecto)     | Prueba compartida            | —         | se promueve a `main` |
| `main`                      | Producción                   | —         | —                    |
| `feature/<tema>-<qué>`      | Funcionalidad nueva          | `staging` | `staging`            |
| `fix/<qué>`                 | Arreglos, también urgentes   | `staging` | `staging`            |
| `chore/<qué>`, `docs/<qué>` | Mantenimiento, documentación | `staging` | `staging`            |

Nombres en minúscula y con guiones: `feature/dictar-grabacion`, `fix/fecha-informe`.

Nadie trabaja directo en `staging` ni en `main`. GitHub no lo permite.

## Una tarea, de punta a punta

1. **Elegís tu parte en el Seguimiento** del plan de trabajo. Cada parte tiene su lista de qué tiene que hacer.
2. **`/nueva-tarea <nombre>`.** Trae lo último de `staging` y crea tu rama.
3. **Commits chicos**, con el formato de abajo.
4. **`/guardar`** apenas hay algo hecho. Sube tu trabajo como respaldo y, la primera vez, abre la propuesta como borrador: así los demás ven en qué estás, sin pedirle revisión a nadie.
5. **`/sincronizar`** si `staging` avanzó mientras trabajabas. Usa merge, nunca rebase: así nadie tiene que forzar un push.
6. **`/listo`.** Corre `npm run check`, completa la propuesta con la plantilla y la deja lista para revisar.
7. **Revisión.** Controles automáticos en verde. Si toca algo delicado, espera la aprobación de otra persona; si no, entra y otro lo revisa después. Si subís algo después de que te aprueben, la aprobación se cae.
8. **Squash a `staging`.** Con todo en verde, y la aprobación si era algo delicado. Un commit por tarea. Lo suma quien hizo la tarea, sin esperar a nadie. Mejor todavía: al entregar, tocá **Enable auto-merge** y GitHub la suma sola cuando se cumple todo. Se despliega solo en staging y se prueba ahí.
9. **Promoción.** Pull request de `staging` a `main` con merge commit, aprobado por otra persona.

- Si los controles fallan o te piden cambios: volvés a tu rama, corregís y subís. El pull request se actualiza solo.
- Si algo roto en `staging` traba la promoción: se deshace ese cambio con un pull request que lo da vuelta (un revert, lo arma Claude). No se arregla a las apuradas encima.
- Si la revisión de después encuentra algo en lo que ya entró: se arregla con una tarea `fix/` nueva.

## Seguimiento

Cómo vamos se ve en la pestaña Seguimiento del plan de trabajo. El link no va al repo, porque el repo es público. Nadie escribe ahí a mano.

**La fuente es GitHub.** Lo que hace cada uno queda ahí: la propuesta en borrador, la entrega, la aprobación y lo que entra a `staging`. El Claude de quien administra el plan lo pasa al plan con `/seguimiento`. Los demás Claude no pueden escribir en el plan, porque se compartió desde otra cuenta de claude.ai, y no hace falta.

Lo que no pasa por GitHub, como una idea o el relato de cómo funciona algo, tu Claude te lo arma en un texto corto y se lo mandás a quien administra el plan.

## Mensajes de commit

`tipo: qué cambió`, en minúscula y en español.

| Tipo       | Cuándo                                | Ejemplo                                     |
| ---------- | ------------------------------------- | ------------------------------------------- |
| `feat`     | Algo nuevo para quien usa la app      | `feat: botón para volver a grabar`          |
| `fix`      | Un arreglo                            | `fix: el informe mostraba el día siguiente` |
| `docs`     | Documentación                         | `docs: cómo correr la base local`           |
| `test`     | Solo tests                            | `test: casos de rúbricas sin indicadores`   |
| `refactor` | Cambia el código sin cambiar qué hace | `refactor: separar el cliente de la IA`     |
| `chore`    | Mantenimiento (dependencias, configs) | `chore: actualizar vitest`                  |

## Revisar el pull request de otro

Plazo: lo delicado, en el día; lo demás, en menos de 24 horas hábiles.

**Desde el celular:** con la app de GitHub te llega el aviso cuando un compañero necesita tu OK. Leés el bloque **Para quien aprueba** que va arriba de la propuesta y, si está todo bien, **Revisar cambios** → **Aprobar** → **Enviar**. Si tenía la suma automática activada, entra sola. Cómo bajar la app: paso 7 de [ALTA.md](ALTA.md). Por qué trabajamos así: [decisión 0003](decisiones/0003-sumar-sin-trabar.md).

Antes de aprobar, fijate:

- ¿Entendés qué cambia y por qué? Si no, preguntá en el pull request.
- ¿Los controles automáticos están en verde?
- ¿No hay claves, tokens ni datos reales?
- Si cambia una pantalla: ¿tiene la captura a 360 px?
- Si cambia la base: ¿está la migración?
- Si toca un área sensible (controles automáticos, frenos, reglas del código en `eslint.config.js`, los `package.json`, migraciones, módulo de IA, `CLAUDE.md`): mirala con más cuidado.

Comentarios concretos, sobre el código y no sobre la persona. Al final: **Approve** o **Request changes**. Si algo no se entiende desde el celular, no se aprueba: se pregunta en el grupo o se mira con Claude en la compu.

El agente `revisor-pr` te puede ayudar a revisar, pero la aprobación es tuya.

## Reglas de convivencia

1. **Una tarea, una rama, un pull request**, y chico: menos de 400 líneas cambiadas. Si crece, se parte.
2. **Nadie aprueba su propio pull request.** GitHub lo impide.
3. **Un pull request se revisa en menos de 24 horas hábiles.** Si no, el autor avisa por el canal del equipo.
4. **Lo delicado espera el OK de otro.** Lo demás entra con los controles en verde y otro lo revisa después. Si para algo delicado faltan los otros dos, se espera, o se sigue el procedimiento de emergencia.
5. **Un chat de Claude por carpeta.** No tengas dos chats de Claude trabajando a la vez en la misma carpeta del proyecto. Si necesitás dos, pedile a Claude una segunda carpeta (por debajo, `git worktree` o un segundo clon).
6. **La documentación se actualiza en el mismo pull request** que la deja vieja. Cómo va cada tarea se ve en el Seguimiento del plan y en su pull request, no en un archivo del repo que todos editan.
7. **Cambios de pantalla:** captura a 360 px en el pull request y checklist del design system.
8. **Cambios de base de datos:** la migración va dentro del pull request.
9. **Nunca entran al repo** claves, datos reales de docentes o alumnos, ni documentos del negocio. Para probar se usa una sala inventada.
10. **Las reglas para Claude van por pull request al `CLAUDE.md`.**

## Frenos

| Capa | Qué es                | Qué frena                                                                                                                                                                                                                                                                                          |
| ---- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Reglas de GitHub      | Subir directo a `staging` o `main`, sumar con controles en rojo, sumar algo delicado (o cualquier cosa a `main`) sin aprobación, forzar un push, borrar esas ramas                                                                                                                                 |
| 2    | Controles automáticos | Formato, reglas del código, tipos, tests, build, claves en el código, título y nombre de la rama, y pull requests a `main` que no salen de `staging`. Las migraciones se suman cuando haya base de datos                                                                                           |
| 3    | Freno de Claude       | Que Claude suba a `staging` o `main`, fuerce un push, saltee los frenos de git, haga rebase, edite o haga commits en `staging` o `main`, apruebe o mergee pull requests, toque un `.env`, borre en masa, apunte a una base que no es local, publique desde la terminal o modifique el propio freno |
| 4    | Freno de git          | Commits directo en `staging` o `main` y commits con claves (gitleaks). Frena a todos, con o sin Claude                                                                                                                                                                                             |
| 5    | Agentes y comandos    | No frenan: guían                                                                                                                                                                                                                                                                                   |

Las capas 1 y 2 no se pueden saltear desde ninguna compu. Si ves un mensaje `FRENO:`, no busques la vuelta: preguntá.

Los frenos 3 y 4 viven en el repo (`.claude/` y `.githooks/`) y se activan con `npm install`. Para comprobar que andan en tu compu: `npm run probar-frenos`. Cómo funciona cada uno: [GUIA.md](GUIA.md).

## Si algo sale mal

- **Me trabé con git:** pedile ayuda al agente `guia-git`. Primero mira, después propone.
- **Subí una clave sin querer:** avisá a los otros dos y cambiá la clave en el proveedor. Borrarla del repo no alcanza: ya es pública.
- **Se rompió staging:** pull request de revert del cambio que lo rompió.
- **Se rompió producción:** procedimiento de emergencia, en el repo privado del equipo.
