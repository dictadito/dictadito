# Orden de construcción

Dictadito se construye por capas. Una capa se da por terminada cuando cumple su "lista cuando". No se adelanta trabajo de una capa que todavía no empezó.

| Orden | Capa               | Qué se hace                                                                                                                       | Lista cuando                                              |
| ----- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| 0     | Boceto             | Pantallas en papel, y de ahí la lista de qué datos aparecen                                                                       | El dueño del producto lo aprobó                           |
| 1     | Cimientos          | Repo, base local, staging y producción separados, controles automáticos y frenos                                                  | `npm run check` en verde                                  |
| 2     | Datos              | Todas las tablas. **Nada fijo en el código:** estados, tipos, planes, horarios y zona horaria van en tablas o en la configuración | Cada tabla con su test                                    |
| 3     | Accesos            | Login, registro, recuperar contraseña, escuelas, espacios y membresías                                                            | Una docente entra y ve solo sus espacios                  |
| 4     | Roles y permisos   | Qué puede hacer cada rol (docente, directiva), cerrado en la base, tabla por tabla                                                | Test por rol en verde, empezando por el de menos permisos |
| 5     | Seguridad          | Rutas cerradas por defecto, claves fuera del código, validación de todo lo que entra                                              | `check-rules` y la auditoría sin riesgos                  |
| 6     | Lógica del negocio | Cálculos en funciones únicas; la API que usan las pantallas                                                                       | Tests con casos reales en verde                           |
| 7     | Diseño             | Pantallas reales con el design system de WIARK, sobre una base ya probada                                                         | El revisor lo probó en el celular                         |
| 8     | Operación          | Salud, errores, respaldo y publicación                                                                                            | Simulacro de restauración hecho                           |
