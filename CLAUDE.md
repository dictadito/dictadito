# Dictadito: reglas para Claude

Dictadito es una app de WIARK Solutions para docentes: dictan observaciones por voz y la app las ordena y arma los informes. La construyen Luca, Silvi y Julián, cada uno con su propia sesión de Claude Code.

Este archivo lo leen las tres sesiones. Se cambia solo por pull request, como cualquier otro archivo. Lo que Claude recuerda en una compu no lo ven las otras dos: si una regla es para todos, va acá.

## Cómo hablar

- Español rioplatense, simple y directo.
- Sin siglas sin explicar: escribí "pull request", "controles automáticos". Si una sigla hace falta, explicala la primera vez.
- De a un paso. Antes de algo que no tiene vuelta atrás, explicá qué va a pasar y esperá el OK.

## Antes de tocar nada

1. Mirá el estado: en qué rama estás, si hay cambios sin guardar y si `staging` avanzó.
2. Si estás en `staging` o en `main`, no edites: proponé `/nueva-tarea`.
3. Hacé solo lo que te pidieron. Si ves otra cosa para mejorar, mencionala en una línea y no la toques.

## El circuito

El detalle está en [docs/COMO-TRABAJAMOS.md](docs/COMO-TRABAJAMOS.md).

- Todo sale de `staging` en una rama `feature/`, `fix/`, `chore/` o `docs/`, y vuelve a `staging` por un pull request que aprueba otra persona.
- A `main` (producción) solo se llega desde `staging`.
- Comandos del equipo: `/nueva-tarea`, `/sincronizar`, `/listo`. Si alguien se traba con git, usá el agente `guia-git`.
- Ponerse al día con `staging` se hace con merge, nunca con rebase.
- Nunca: subir a `staging` o a `main`, forzar un push, reescribir algo que ya está subido, aprobar o mergear pull requests, ni saltear los frenos de git (`--no-verify`).

## Frenos

Si un comando devuelve un mensaje que empieza con `FRENO:`, no busques otra forma de hacer lo mismo. Explicale a la persona qué se frenó, por qué, y cuál es el camino seguro.

## El repo es público

Todo lo que se sube lo puede leer cualquiera, para siempre, aunque después se borre.

- Nunca claves, tokens, URLs de base de datos ni el contenido de un `.env`. No leas ni edites archivos `.env`: las variables se documentan en `.env.example`, con valores falsos.
- Nunca datos reales de docentes, alumnos o escuelas. Para probar se usa la sala inventada.
- Los prompts de la IA y las plantillas de informe viven en la base de datos, no en el código. En el código, solo marcadores.
- No nombres otros proyectos, clientes ni documentos internos de WIARK. Nada de documentos de negocio (precios, finanzas, acuerdos).

## Datos de menores

- A la IA nunca van apellidos ni DNI: solo nombre de pila o número de lista.
- Nunca se registran transcripciones, audios ni el contenido de los pedidos en los logs.
- Los audios van a un bucket privado, con links firmados.

## Código

- TypeScript en todo. Las validaciones, con Zod desde `packages/shared`, para que front y back usen las mismas.
- Cada funcionalidad tiene su carpeta, con el mismo nombre en el front (`apps/frontend/src/features/<tema>`) y en el back (`apps/backend/src/modules/<tema>`).
- Nada fijo en el código que sea un dato: estados, tipos, planes, horarios y zona horaria van en tablas o en la configuración.
- Fechas: nunca `toISOString()` para obtener un día; de noche en Córdoba da el día siguiente.
- Los pedidos al backend pasan por el cliente HTTP único de `apps/frontend/src/lib`; nada de `fetch` suelto.
- Nada de `catch` vacío.
- Los cambios de base van como migración de Prisma dentro del pull request, y nunca se aplican contra una base que no sea local.
- Pantallas: mobile first (360 px), con el design system de WIARK.

## Antes de dar algo por terminado

- `npm run check` en verde.
- La documentación que este cambio deja vieja, actualizada en el mismo pull request.
- Si cambió una pantalla: una captura a 360 px para el pull request.

## Orden de construcción

Se construye por capas ([docs/CAPAS.md](docs/CAPAS.md)). No adelantes trabajo de una capa que todavía no empezó.
