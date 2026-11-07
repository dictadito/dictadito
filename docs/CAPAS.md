# Orden de construcción

Dictadito se construye por capas, de abajo hacia arriba: primero lo que sostiene todo y al final lo que se ve. Una capa se da por terminada cuando cumple su "lista cuando". No se adelanta trabajo de una capa que todavía no empezó.

Las pruebas no son una capa: van en todas, y ninguna capa se cierra sin sus tests en verde. El boceto y el cierre de los cimientos van en paralelo, porque no dependen uno del otro. El avance de cada una se ve en la pestaña Seguimiento del plan de trabajo.

| Orden | Capa               | Qué se hace                                                                                                                                                                                                                                        | Lista cuando                                                                                                 |
| ----- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 0     | Idea y alcance     | Qué problema resuelve, para quién, y qué entra en la primera versión y qué no                                                                                                                                                                      | El alcance de la primera cohorte está acordado                                                               |
| 1     | Boceto             | Las seis pantallas, contadas por la dueña del producto, y de ahí qué datos y qué roles hay                                                                                                                                                         | Lo aprobamos los tres                                                                                        |
| 2     | Cimientos          | Repo, frenos, controles automáticos y la base de la app, con `/health` y `/version` para saber que el servidor anda y qué versión corre                                                                                                            | La base de la app está sumada, con `npm run check` en verde en GitHub                                        |
| 3     | Datos              | Arranca con la base de datos en cada compu. Todas las tablas. **Nada fijo en el código:** estados, tipos, planes, horarios y zona horaria van en tablas o en la configuración                                                                      | Cada tabla con su test                                                                                       |
| 4     | Accesos y roles    | Antes, la versión de prueba en internet y los estilos generales sobre el WIARK Design System. Después, login, registro, recuperar contraseña, escuelas, espacios y membresías, y qué puede hacer cada rol (docente, directiva), cerrado en la base | Una docente entra y ve solo sus espacios, y hay un test por rol en verde, empezando por el de menos permisos |
| 5     | Seguridad          | Rutas cerradas por defecto, claves fuera del código, validación de todo lo que entra y cuidado de los datos de los chicos                                                                                                                          | `npm run check` en verde y la revisión de seguridad sin riesgos                                              |
| 6     | Lógica del negocio | Las funcionalidades, una por una: cálculos en funciones únicas y la API que usan las pantallas                                                                                                                                                     | Tests con casos de la sala inventada en verde                                                                |
| 7     | Diseño final       | Pantallas reales con el WIARK Design System, sobre una base ya probada                                                                                                                                                                             | Quien revisa lo probó en su celular                                                                          |
| 8     | Antes de lanzar    | Producción y planes pagos, respaldo, aviso de errores, lo legal de los datos de menores, plan de emergencia y cobros                                                                                                                               | Simulacro de restauración hecho y auditoría 360 sin nada bloqueante                                          |
| 9     | Lanzar y operar    | La primera semana, acompañando a las docentes de la primera cohorte                                                                                                                                                                                | Las docentes la usan solas                                                                                   |
| 10    | Cierre             | Qué salió bien y qué no. Lo aprendido queda escrito para el próximo proyecto                                                                                                                                                                       | El resumen está escrito y compartido                                                                         |

## Los ambientes, cuando hacen falta

No se arman antes de tiempo: cada uno cuando el avance lo pide, y recién ahí se paga.

- **Base de datos en cada compu:** al arrancar la capa 3.
- **Versión de prueba en internet:** al arrancar la capa 4, antes de la primera pantalla.
- **Producción:** en la capa 8.

## Revisar con lentes

Al cerrar cada capa, Claude hace una revisión corta con las lentes de pruebas y seguridad. Antes de lanzar va la auditoría 360 completa: producto, pruebas, líder técnico, seguridad y experta del tema. Los mensajes para pedirlas están en el plan de trabajo.
