# Bocetos de la primera versión

Capa 1 de [CAPAS.md](CAPAS.md): un boceto de celular a 360 px por cada una de las siete pantallas de la primera versión ([PANTALLAS.md](PANTALLAS.md)). Los armó Silvi y falta que los aprueben Luca y Julián: aprobar la propuesta que suma este archivo es aprobar los bocetos y cerrar la capa 1.

Los bocetos están en una página de claude.ai. El link se comparte por el grupo del equipo, no acá, porque el repo es público.

## Qué muestra cada boceto

| #   | Pantalla                 | Qué se ve                                                                                                                                                                                                                                              |
| --- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Registro, escuela y sala | Tres pasos: la cuenta (con el nivel y el código de curso opcional), la escuela (crearla, con el código para compartir por WhatsApp, o entrar con un código) y la sala. Al final, el selector de espacio                                                |
| 2   | Mi sala                  | La lista de alumnos con número de lista y nombre de pila, y dos botones: dictar la lista o agregar por texto. Tocar un nombre lo corrige                                                                                                               |
| 3   | Diagnóstico              | Las áreas como pestañas, una pregunta por vez, una marca por alumno (Sí / En proceso / No), el resumen del área en porcentajes, editar preguntas y el cuadro cualitativo                                                                               |
| 4   | Proyectos y rúbricas     | La lista de proyectos con el activo marcado, la rúbrica con cada indicador y su área, y tres formas de sumar indicadores: a mano, proponer con IA o desde una foto                                                                                     |
| 5   | Dictar                   | El proyecto activo (con un toque para cambiarlo), el micrófono grande, lo que se dictó, y la tarjeta con alumno, indicador, valor, observación y área para confirmar o corregir. Abajo, escribir, grilla rápida y desde papel, y los registros del día |
| 6   | Importar desde papel     | Subir la hoja (cámara, galería, PDF, Word o Excel), revisar la tabla leída con el emparejamiento de nombres, el aviso de apellidos sacados, el período y el botón para guardar los registros                                                           |
| 7   | Informes                 | Etapa y año, generar para toda la sala, las vistas por alumno y por área (en el orden del SGE), el estado de cada alumno, los párrafos con botón para copiar, un área sin registros con su aviso y la lista de control antes de marcar "listo"         |

## Las reglas de [PANTALLAS.md](PANTALLAS.md) que se ven en los bocetos

- Lo que propone la IA (un indicador, una tarjeta de Dictar) espera el OK de la docente.
- Lo que se dictó se ve hasta confirmar y después se descarta.
- La observación queda con las palabras de la docente, entre comillas.
- Un área sin registros queda vacía en el informe, con el aviso "Sin registros" y el acceso a Dictar.
- Importar desde papel saca los apellidos y deja solo el nombre de pila.

## Para aprobar

Estos puntos los decidió el boceto y no están en [PANTALLAS.md](PANTALLAS.md):

1. **La barra de abajo** tiene cinco secciones: Dictar, Mi sala, Diagnóstico, Proyectos e Informes. Importar desde papel se abre desde Dictar.
2. **El selector de espacio** va arriba en todas las pantallas.
3. **El registro tiene tres pasos**, en este orden: cuenta, escuela y sala.
4. **En primario, la pantalla de la sala suma dos casillas:** "Este grado tiene jornada extendida" y "¿Qué lenguajes de Artística tiene?", con Artes Visuales y Música tildados de entrada.
5. **El diagnóstico se responde de a una pregunta**, con la lista de alumnos debajo.

## Lo que el boceto no decide

- **El estilo.** Son en grises a propósito: colores, letras, botones e íconos los define Julián en la capa 4, con los estilos generales.
- **El contenido.** Las áreas, preguntas e indicadores que se ven son ejemplos. El contenido definitivo se carga en la capa 3.
- **Los datos.** La escuela y los alumnos son inventados, y solo con nombre de pila.
