# Plan de la primera versión

Quién hace qué para llegar a las siete pantallas de [PANTALLAS.md](PANTALLAS.md), capa por capa ([CAPAS.md](CAPAS.md)). Propuesta de Silvi, pendiente de que Luca y Julián la confirmen. El avance se sigue en el plan de trabajo.

**Regla para todo el plan:** lo que hace uno lo revisa otro. Lo delicado (accesos, base de datos, IA) espera esa aprobación antes de entrar.

## Reparto por capa

| Capa              | Silvi                                                                                                                      | Luca                                                                                      | Julián                                       |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------- |
| 0. Alcance        | Escribir el alcance: siete pantallas, inicial y primario, solo docentes                                                    | Revisar                                                                                   | —                                            |
| 1. Boceto         | Bocetos de las siete pantallas a 360 px                                                                                    | Aprobar                                                                                   | Aprobar                                      |
| 3. Datos          | Preparar el contenido: áreas por nivel, escalas, preguntas del diagnóstico de inicial y la sala inventada para las pruebas | Tablas y migraciones, cada tabla con su test                                              | —                                            |
| 4. Accesos        | Revisar los textos y el recorrido del registro                                                                             | Login, registro, escuelas, espacios y roles. La versión de prueba en internet             | Estilos generales: colores, letras y botones |
| 5. Seguridad      | Comprobar las reglas de datos de menores: sin apellidos ni transcripciones guardadas                                       | Rutas cerradas, validaciones y revisión de seguridad                                      | —                                            |
| 6 y 7. Pantallas  | Mi sala → Proyectos → Diagnóstico → Informes                                                                               | Registro, escuela y sala → conexión con la IA → Dictar → Importar desde papel (la última) | Elegir y ajustar los íconos de Lucide        |
| Fuera de la lista | —                                                                                                                          | —                                                                                         | Landing page: falta decidir en qué capa va   |

## Por qué en este orden

- **Dictar necesita alumnos e indicadores.** Por eso Silvi arranca por Mi sala y Proyectos, mientras Luca hace el registro y la conexión con la IA.
- **La conexión con la IA vive en un solo lugar del servidor**, que es delicado. Luca la arma una vez y la usan Proyectos ("Proponer indicadores"), Dictar, Importar desde papel e Informes.
- **Informes es el único punto compartido.** Silvi define qué escribe el informe y cómo, con las reglas de [PANTALLAS.md](PANTALLAS.md). Luca hace la conexión con la IA que lo genera.
- **Los estilos generales van antes de la primera pantalla**, como pide la capa 4. Es lo primero que destraba el trabajo de Julián.

## Pendientes

- **Íconos:** Julián usa la librería Lucide, como dice `CLAUDE.md`. No se dibujan íconos propios.
- **Landing page:** no está en ninguna capa. Hay que decidir dónde va; la capa 8 ("antes de lanzar") parece el lugar.
- **Directiva:** se suma en la segunda parte, con la pantalla Mi escuela.
