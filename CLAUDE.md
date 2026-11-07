# Dictadito: reglas para Claude

Dictadito es una app de WIARK Solutions para docentes: dictan observaciones por voz y la app las ordena y arma los informes. La construyen Luca, Silvi y Julián, cada uno con su propia sesión de Claude Code.

Este archivo lo leen las tres sesiones. Se cambia solo por pull request, como cualquier otro archivo. Lo que Claude recuerda en una compu no lo ven las otras dos: si una regla es para todos, va acá.

## Cómo hablar

- Español rioplatense, simple y directo.
- Sin siglas sin explicar: escribí "pull request", "controles automáticos". Si una sigla hace falta, explicala la primera vez.
- De a un paso. Antes de algo que no tiene vuelta atrás, explicá qué va a pasar y esperá el OK.

## Antes de tocar nada

1. Mirá el estado: en qué rama estás, si hay cambios sin guardar y si `staging` avanzó (`git fetch`). Hacelo al arrancar cada charla, antes de cada tarea y cuando pasó un rato largo desde la última vez. Si `staging` avanzó, decilo en una línea y proponé ponerse al día con `/sincronizar`; nunca lo hagas sin el OK de la persona.
2. Si estás en `staging` o en `main`, no edites: proponé `/nueva-tarea`.
3. Las ramas las decidís vos, no la persona: fijate si lo que piden ya tiene su rama, tuya o de otro, y si su pull request sigue abierto. Según el caso, seguís en esa rama, abrís una nueva desde `staging` o avisás que la tiene otro. Nunca mezcles dos tareas en una rama. El detalle está en `/nueva-tarea`.
4. Hacé solo lo que te pidieron. Si ves otra cosa para mejorar, mencionala en una línea y no la toques.
5. Antes de afirmar en qué estado está algo (una rama, un pull request, una tabla, una configuración), verificalo en GitHub o en el código. No te guíes por la memoria ni por el plan: pueden estar viejos.

## El circuito

El detalle está en [docs/COMO-TRABAJAMOS.md](docs/COMO-TRABAJAMOS.md).

- Todo sale de `staging` en una rama `feature/`, `fix/`, `chore/` o `docs/`, y vuelve a `staging` por un pull request con los controles en verde.
- Si el pull request toca algo delicado (lo que figura en `.github/CODEOWNERS`: frenos, reglas para Claude, controles, reglas del código, dependencias, base de datos, IA), lo aprueba otra persona antes de sumarlo. Lo demás entra sin esperar, y otro lo revisa después.
- A `main` (producción) solo se llega desde `staging`.
- Comandos del equipo: `/arrancar` (cómo venís y qué conviene hacer primero), `/nueva-tarea` (empezar o retomar una tarea), `/sincronizar` (traer lo nuevo), `/guardar` (respaldo en tu rama y propuesta en borrador), `/listo` (entregar) y `/seguimiento` (poner al día el plan, desde la compu de quien lo administra). Si alguien se traba con git, usá el agente `guia-git`.
- Proponé estos comandos sin que te los pidan: `/arrancar` al empezar el día, `/guardar` si hay trabajo sin guardar de hace rato o la persona se va, y `/sincronizar` si la versión de prueba avanzó. La persona no tiene que acordarse de ninguno: los puede pedir con sus palabras.
- Ponerse al día con `staging` se hace con merge, nunca con rebase.
- Nunca: subir a `staging` o a `main`, forzar un push, reescribir algo que ya está subido, aprobar o mergear pull requests, ni saltear los frenos de git (`--no-verify`).

## Frenos

Si un comando devuelve un mensaje que empieza con `FRENO:`, no busques otra forma de hacer lo mismo. Explicale a la persona qué se frenó, por qué, y cuál es el camino seguro.

## Seguimiento del proyecto

Cómo vamos se ve en la pestaña Seguimiento del plan de trabajo, un artefacto de claude.ai. Nadie escribe ahí a mano.

**La fuente es GitHub.** Lo que hace cada uno queda ahí: su propuesta en borrador, la entrega, la aprobación y lo que entra a `staging`. El Claude de quien administra el plan lo pasa al plan con `/seguimiento`.

- Para que se vea en qué está cada uno, el trabajo se guarda en GitHub con `/guardar` apenas hay algo hecho. La primera vez abre la propuesta como borrador, con la parte del seguimiento en la descripción.
- Cada propuesta dice a qué parte corresponde, en la línea **Parte del seguimiento**.
- Lo que no pasa por GitHub, como una idea, una decisión o el relato de cómo funciona algo, armalo en un texto corto para que la persona se lo mande a quien administra el plan.
- Solo escribe en el plan el Claude que puede hacerlo. Si no podés leerlo ni escribirlo, es normal (el plan se compartió desde otra cuenta de claude.ai): no insistas y seguí con GitHub.
- El link del plan no va en el repo, porque el repo es público.
- Solo lo que pasó de verdad: lo que se ve en GitHub o lo que la persona confirma. Nunca borres lo que anotó otro.

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
- Lo que propone la IA nunca entra a un informe sin la confirmación de la docente.
- Cada respuesta del servidor se arma con un esquema de salida de `packages/shared`, una lista de los campos que sí van. Nunca se devuelve el registro entero de la base.

## Código

- TypeScript en todo. Las validaciones, con Zod desde `packages/shared`, para que front y back usen las mismas.
- Cada funcionalidad tiene su carpeta, con el mismo nombre en el front (`apps/frontend/src/features/<tema>`) y en el back (`apps/backend/src/modules/<tema>`).
- Nada fijo en el código que sea un dato: estados, tipos, planes, horarios y zona horaria van en tablas o en la configuración.
- Estados, niveles y tipos se guardan como códigos; la etiqueta que ve la docente va aparte y se puede renombrar sin romper nada. Se compara con listas de lo que sí vale, nunca con "todo menos X".
- Cada arreglo (`fix/`) trae un test que falla sin el arreglo.
- Fechas: nunca `toISOString()` para obtener un día; de noche en Córdoba da el día siguiente.
- Los pedidos al backend pasan por el cliente HTTP único de `apps/frontend/src/lib`; nada de `fetch` suelto.
- Nada de `catch` vacío.
- Ningún archivo de código pasa las 300 líneas: si crece, se parte. Lo controla el lint.
- Los cambios de base van como migración de Prisma dentro del pull request, y nunca se aplican contra una base que no sea local.
- Pantallas: mobile first (360 px), siempre sobre el WIARK Design System. Las reglas están abajo, en "Design system (WIARK)".

## Design system (WIARK)

La guía completa va a `docs/DESIGN_SYSTEM.md`. Se suma con los estilos generales de Dictadito, que van antes del login; hasta entonces valen estas reglas.

- Antes de armar los estilos generales (colores, letras, botones), preguntale al equipo qué estilo quiere: colores, tono y cómo se tiene que sentir. Lo que decidan va en `theme.css`, sobre el núcleo de WIARK (`tokens.css`), nunca en su lugar.
- Para cambiar el design system: se propone, lo acuerdan los tres, se cambia primero el documento y después el código.

Seguí estrictamente el design system definido en `docs/DESIGN_SYSTEM.md`. Reglas no negociables:

- Usá SOLO tokens (variables CSS / clases del tema). Nunca colores hex, px sueltos ni z-index arbitrarios en componentes.
- Espaciado en múltiplos de 4 px. Escala tipográfica: 12/14/16/18/20/24/30/36. Pesos 400/500/600/700.
- Un solo botón `primary` por vista. Variantes de botón: primary, secondary, outline, ghost, link, destructive.
- Colores semánticos con significado fijo: success = completado; warning = atención; danger = error o destructivo; info = información. Nunca decorativos.
- Todo estado se comunica con color + ícono + texto.
- Mensajes: usá el componente menos intrusivo que alcance (inline < badge < toast < alert < modal).
- Inputs con label visible arriba, texto de 16 px, error debajo con `aria-describedby`.
- Toda lista/tabla tiene estado vacío, de carga y de error.
- Mobile first; probá en 360 px. Área táctil mínima 44 px.
- Accesibilidad WCAG AA: contraste 4,5:1, foco visible, navegable por teclado, `<button>` para acciones y `<a>` para navegación.
- Acciones destructivas irreversibles: modal de confirmación con texto específico. Reversibles: toast con "Deshacer".
- Soportá modo oscuro redefiniendo solo tokens semánticos.
- Layout: usá los contenedores según el contenido (prose 65ch, narrow 420, form 640, content 1024, page 1280, fluido para tablas/agenda/mapas). Fondo full-bleed, contenido contenido. Espacios con `gap`, no con márgenes.
- Celular (no negociable): etiqueta viewport `width=device-width, initial-scale=1, viewport-fit=cover`, sin bloquear el zoom; inputs con letra de 16 px o más; `100dvh` en vez de `100vh`; barras de acciones de formularios `sticky` dentro del formulario (no `fixed`); `enterkeyhint` en campos; barras fijas con `env(safe-area-inset-bottom)`; scroll del fondo bloqueado con modales abiertos y `overscroll-behavior: contain`; `overflow-wrap: anywhere` y `min-w-0` para textos largos; nada de anchos fijos en px; reglas para horizontal con poca altura.
- Responsive: mobile first con `min-width`; breakpoints 640/1024/1280; container queries para componentes reutilizables; nada importante depende del hover; sin scroll horizontal en 360 px.
- HTML semántico: `header`, `nav`, `main` (uno), `aside`, `footer`; un solo `h1` y títulos sin saltar niveles; `<button>` para acciones, `<a>` para navegar, `<table>` para datos, `<dialog>` para modales; inputs con `type`, `inputmode` y `autocomplete` correctos.
- Tablas: búsqueda → filtros (chips con "Limpiar todo", en la URL) → orden → acción principal; paginación numerada; selección masiva con barra de acciones; estados vacío, sin resultados, cargando y error.
- Gráficos: elegí la forma por la pregunta (métrica, línea, barras); nunca dos ejes Y; barras desde cero; paleta categórica en orden fijo; colores de estado nunca como serie; leyenda con 2+ series, tooltip y vista de tabla.
- Rendimiento: LCP < 2,5 s, INP < 200 ms, CLS < 0,1; JS inicial < 200 KB; skeleton en lugar de pantalla en blanco.
- Íconos de una sola librería (Lucide), trazo 2 px, 16/20/24 px, `currentColor`. Imágenes con `alt` y dimensiones. Animar solo `transform` y `opacity`.
- Si necesitás algo que el sistema no cubre, avisá y proponé la solución en lugar de inventarla.

## Antes de dar algo por terminado

- `npm run check` en verde.
- La documentación que este cambio deja vieja, actualizada en el mismo pull request.
- Si cambió una pantalla: una captura a 360 px para el pull request.

## Orden de construcción

Se construye por capas ([docs/CAPAS.md](docs/CAPAS.md)). No adelantes trabajo de una capa que todavía no empezó.
