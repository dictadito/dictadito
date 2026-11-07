# Bocetos de la primera versión

Capa 1 de [CAPAS.md](CAPAS.md): un boceto de celular a 360 px por cada pantalla de la primera versión. Son las siete que propone el alcance de la propuesta 9: las seis de [PANTALLAS.md](PANTALLAS.md) más Informes. Los dibujó Silvi y falta que los aprueben Luca y Julián.

Los bocetos están en una página de claude.ai. El link está en el plan de trabajo, no acá, porque el repo es público.

## Qué muestra cada boceto

| #   | Pantalla                 | Qué se ve                                                                                                                                                                      |
| --- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Registro, escuela y sala | Tres pasos: la cuenta con el nivel, la escuela (entrar con un código o crearla) y la sala. Al final, el selector de espacio abierto                                            |
| 2   | Mi sala                  | La lista de alumnos con número y nombre de pila, el acceso a Diagnóstico y el botón para agregar alumnos por texto o dictado                                                   |
| 3   | Diagnóstico              | Las áreas como pestañas, una pregunta editable, una marca por alumno (Sí / En proceso / No), el porcentaje del área y el cuadro cualitativo                                    |
| 4   | Proyectos y rúbricas     | El proyecto activo con fechas y pregunta problematizadora, sus indicadores con área y tres formas de sumar indicadores: a mano, desde la secuencia didáctica o desde una foto  |
| 5   | Dictar                   | El proyecto activo, el micrófono grande, la transcripción en vivo y las tarjetas para confirmar o corregir. Abajo, escribir, grilla rápida y desde papel                       |
| 6   | Importar desde papel     | Los pasos (subir, revisar, confirmar), el período, el aviso de apellidos con el botón para sacarlos y la tabla editable con el emparejamiento de nombres                       |
| 7   | Informes                 | Etapa y año, generar para toda la sala, las vistas por alumno y por asignatura, el estado de cada alumno, los párrafos editables y la lista de control antes de marcar "listo" |

## Las reglas de [PANTALLAS.md](PANTALLAS.md) que se ven en los bocetos

- Lo que propone la IA (un indicador, una tarjeta de Dictar) espera el OK de la docente.
- La transcripción se ve hasta confirmar y después se descarta.
- La observación queda con las palabras de la docente, entre comillas.
- Un área sin registros queda vacía en el informe, con el aviso "Sin registros".
- Importar desde papel ofrece sacar los apellidos.

## Para aprobar

Estos puntos los decidió el boceto y no están en [PANTALLAS.md](PANTALLAS.md):

1. **La barra de abajo** tiene Mi sala, Proyectos, Dictar e Informes. Diagnóstico se abre desde Mi sala, e Importar desde papel, desde Dictar.
2. **El selector de espacio** va arriba en todas las pantallas.
3. **El registro tiene tres pasos** en ese orden: cuenta, escuela y sala.

## Lo que el boceto no decide

- **El estilo.** Son en blanco y negro a propósito: colores, letras y botones se deciden en la capa 4, con los estilos generales.
- **El contenido.** Las áreas, las preguntas del diagnóstico y los indicadores aparecen como marcadores ("Área 1", "[Indicador 1]"). Se cargan en la capa 3.
- **Los datos.** Los nombres son inventados y solo de pila.
