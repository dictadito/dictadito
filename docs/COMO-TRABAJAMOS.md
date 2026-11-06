# Cómo trabajamos

Guía de Luca, Silvi y Julián para trabajar en paralelo sobre el mismo código sin pisarnos. Es la referencia corta que vive en el repo; si cambia la forma de trabajar, se cambia acá, por pull request.

¿Recién te sumás? Empezá por [ALTA.md](ALTA.md).

## Palabras

- **Rama:** una línea paralela del código donde trabajás sin tocar lo de los demás.
- **Commit:** una foto guardada de tus cambios, con un mensaje.
- **Push:** subir tus commits a GitHub.
- **Pull request:** el pedido de sumar tu rama a `staging`. Los otros dos lo leen, comentan y aprueban; recién ahí se suma. En GitHub aparece abreviado como PR.
- **Controles automáticos:** lo que GitHub corre en cada pull request (formato, tipos, tests, build, claves). Si da rojo, no se puede sumar.
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

1. **Issue.** Qué hay que hacer, por qué y cuándo está terminado. Asignado a una persona.
2. **`/nueva-tarea <nombre>`.** Trae lo último de `staging` y crea tu rama.
3. **Commits chicos**, con el formato de abajo.
4. **`/sincronizar`** si `staging` avanzó mientras trabajabas. Usa merge, nunca rebase: así nadie tiene que forzar un push.
5. **`/listo`.** Corre `npm run check`, sube la rama y abre el pull request contra `staging` con la plantilla.
6. **Revisión.** Controles automáticos en verde y la aprobación de otra persona. Si subís algo después de que te aprueben, la aprobación se cae.
7. **Squash a `staging`.** Un commit por tarea. Se despliega solo en staging y se prueba ahí.
8. **Promoción.** Pull request de `staging` a `main` con merge commit, aprobado por otra persona.

- Si los controles fallan o te piden cambios: volvés a tu rama, corregís y subís. El pull request se actualiza solo.
- Si algo roto en `staging` traba la promoción: se saca con un pull request de revert. No se arregla a las apuradas encima.

## Mensajes de commit

`tipo: qué cambió`, en minúscula y en español.

| Tipo       | Cuándo                                 | Ejemplo                                       |
| ---------- | -------------------------------------- | --------------------------------------------- |
| `feat`     | Algo nuevo para quien usa la app       | `feat: botón para volver a grabar`            |
| `fix`      | Un arreglo                             | `fix: el informe mostraba el día siguiente`   |
| `docs`     | Documentación                          | `docs: cómo correr la base local`             |
| `test`     | Solo tests                             | `test: casos de rúbricas sin indicadores`     |
| `refactor` | Cambia el código sin cambiar qué hace  | `refactor: separar el cliente de la IA`       |
| `chore`    | Mantenimiento (dependencias, configs)  | `chore: actualizar vitest`                    |

## Revisar el pull request de otro

Plazo: menos de 24 horas hábiles. Antes de aprobar, fijate:

- ¿Entendés qué cambia y por qué? Si no, preguntá en el pull request.
- ¿Los controles automáticos están en verde?
- ¿No hay claves, tokens ni datos reales?
- Si cambia una pantalla: ¿tiene la captura a 360 px?
- Si cambia la base: ¿está la migración?
- Si toca un área sensible (controles automáticos, frenos, `package.json`, migraciones, módulo de IA, `CLAUDE.md`): mirala con más cuidado.

Comentarios concretos, sobre el código y no sobre la persona. Al final: **Approve** o **Request changes**.

El agente `revisor-pr` te puede ayudar a revisar, pero la aprobación es tuya.

## Reglas de convivencia

1. **Una tarea, una rama, un pull request**, y chico: menos de 400 líneas cambiadas. Si crece, se parte.
2. **Nadie aprueba su propio pull request.** GitHub lo impide.
3. **Un pull request se revisa en menos de 24 horas hábiles.** Si no, el autor avisa por el canal del equipo.
4. **Si faltan dos de los tres, no se mergea nada.** Se espera, o se sigue el procedimiento de emergencia.
5. **Una carpeta por sesión de Claude.** Nunca dos sesiones en el mismo clon: para eso, `git worktree` o un segundo clon.
6. **La documentación se actualiza en el mismo pull request** que la deja vieja. El estado de cada tarea vive en su issue y su pull request, no en un archivo que todos editan.
7. **Cambios de pantalla:** captura a 360 px en el pull request y checklist del design system.
8. **Cambios de base de datos:** la migración va dentro del pull request.
9. **Nunca entran al repo** claves, datos reales de docentes o alumnos, ni documentos del negocio. Para probar se usa una sala inventada.
10. **Las reglas para Claude van por pull request al `CLAUDE.md`.**

## Frenos

| Capa | Qué es                  | Qué frena                                                                                                                      |
| ---- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 1    | Reglas de GitHub        | Subir directo a `staging` o `main`, mergear sin aprobación o con controles en rojo, forzar un push, borrar esas ramas            |
| 2    | Controles automáticos   | Formato, tipos, tests, build, claves en el código, migraciones rotas, pull requests a `main` que no salen de `staging`         |
| 3    | Freno de Claude         | Que Claude suba a `staging` o `main`, fuerce un push, saltee los frenos de git, haga rebase, edite o haga commits en `staging` o `main`, apruebe o mergee pull requests, toque un `.env`, borre en masa, apunte a una base que no es local, publique desde la terminal o modifique el propio freno |
| 4    | Freno de git            | Commits directo en `staging` o `main` y commits con claves (gitleaks). Frena a todos, con o sin Claude                       |
| 5    | Agentes y comandos      | No frenan: guían                                                                                                               |

Las capas 1 y 2 no se pueden saltear desde ninguna compu. Si ves un mensaje `FRENO:`, no busques la vuelta: preguntá.

Los frenos 3 y 4 viven en el repo (`.claude/` y `.githooks/`) y se activan con `npm install`. Para comprobar que andan en tu compu: `npm run probar-frenos`. Cómo funciona cada uno: [GUIA.md](GUIA.md).

## Si algo sale mal

- **Me trabé con git:** pedile ayuda al agente `guia-git`. Primero mira, después propone.
- **Subí una clave sin querer:** avisá a los otros dos y cambiá la clave en el proveedor. Borrarla del repo no alcanza: ya es pública.
- **Se rompió staging:** pull request de revert del cambio que lo rompió.
- **Se rompió producción:** procedimiento de emergencia, en el repo privado del equipo.
