# Contexto del proyecto: Dictadito

Lo leen los agentes del equipo (`guia-programador`, `guia-ambientes`, `bombero`) al arrancar. Acá va lo real de **este** sistema: las trampas, lo frágil y el estado de los ambientes. Verificá contra el código antes de citarlo, porque puede haber quedado viejo. **Nunca claves, tokens ni datos reales:** el repo es público.

Las reglas generales para Claude están en `CLAUDE.md`, la forma de trabajar en `docs/COMO-TRABAJAMOS.md` y el orden de construcción en `docs/CAPAS.md`.

## Qué es

App para docentes de nivel inicial: dictan observaciones por voz, la IA las ordena en registros (alumno, indicador, valor y observación) y arma los informes por área. Maneja **datos de menores**.

Monorepo npm:

- `apps/frontend`: React, Vite y Tailwind 4, mobile first, sobre el WIARK Design System.
- `apps/backend`: Express 5. Prisma entra en la capa de datos.
- `packages/shared`: validaciones con Zod y utilidades que usan los dos lados.

## Trampas y reglas duras

**Fechas.** El día se saca con `diaLocal()` de `packages/shared`, con la zona horaria de la configuración. Nunca con `toISOString()`: de noche en Córdoba da el día siguiente, y una observación de las 22 h cae en otro día o en otro período. El lint lo prohíbe. Los instantes se guardan con zona horaria.

**Datos de menores.**

- A la IA solo va el nombre de pila o el número de lista; nunca apellidos ni DNI.
- El servicio de transcripción recibe el audio crudo, con todo lo que dice la docente. Antes de construir Dictar hay que decidir si la transcripción se limpia antes de mandarla a la IA.
- Nada de audios, transcripciones ni contenido de pedidos en los registros del servidor.
- Los audios van a un bucket privado, con links firmados.

**Lo que devuelve el servidor.** Cada respuesta se arma con un esquema de salida de `packages/shared`: una lista de los campos que sí van. Nunca se devuelve el registro entero de la base.

**Aislamiento entre escuelas.** Cada consulta filtra por la escuela y el espacio de la persona, tomados de la sesión y nunca de un parámetro que manda el navegador. Una docente nunca ve los alumnos de otra escuela, y cada rol ve solo lo suyo: la directiva ve resultados, no registros diarios ni audios.

**Identidad por id, nunca por texto.** En una sala puede haber dos alumnos con el mismo nombre de pila. Todo se identifica por su id; el nombre es solo la etiqueta.

**La IA propone, la docente confirma.**

- Nada entra a un informe sin la confirmación de la docente.
- Lo que genera la IA no pisa lo que la docente editó mientras tanto.
- Toda llamada a la IA pasa por un único módulo con tope de gasto.

**No duplicar ni perder.**

- Cada envío lleva una clave para no duplicarse.
- Un informe por alumno y período, con restricción de único en la base.
- Los botones que mandan algo quedan deshabilitados mientras esperan.
- El audio se borra recién cuando los registros quedaron guardados, nunca en la misma operación.

**Estados como códigos.** Estados, niveles de rúbrica y tipos se guardan como código. La etiqueta que ve la docente va aparte y se puede renombrar. Se compara con listas de lo que sí vale, nunca con "todo menos X".

**Una validación, en todas las puertas.** Si algo se bloquea en una ruta, se bloquea en todas las que hacen lo mismo, con un helper único.

**Base de datos.**

- Los cambios van solo como migración de Prisma, dentro del pull request.
- Las migraciones nunca se aplican contra una base que no sea local.
- Nada de borrados ni de cambios masivos sobre datos reales.
- Los scripts que cargan o cambian datos corren primero en seco.

**Antes de cerrar algo:** `npm run check` en verde, y cada arreglo trae un test que falla sin el arreglo.

## Archivos frágiles

- `apps/frontend/src/lib/http.ts`: el cliente HTTP único. Todo pedido al backend pasa por acá.
- `packages/shared`: lo usan el front y el back, así que cambiar una validación cambia los dos.
- `apps/backend/src/lib/config.ts`: lee y valida el entorno. Si falta algo, dice qué variable revisar, nunca su valor.
- Lo que figura en `.github/CODEOWNERS` es delicado y lo aprueba otra persona antes de entrar: frenos, reglas para Claude, controles, dependencias, migraciones (`apps/backend/prisma/`) y el módulo de IA (`apps/backend/src/ia/`).

## Ambientes

**Hoy no hay ningún ambiente armado:** solo se trabaja en la compu de cada uno, sin base de datos. Cada uno se arma cuando el avance lo pide:

- Base de datos en cada compu, al arrancar la capa 3.
- Versión de prueba en internet (Supabase, Railway y Vercel), al arrancar la capa 4.
- Producción, en la capa 8.

Cuando se armen, `guia-ambientes` completa esta sección relevando el sistema real, nunca de plantilla:

- el identificador de cada ambiente, que sirve de candado para no confundir prueba con producción;
- la conexión directa y la del pooler;
- las variables por ambiente, solo los nombres;
- la región, que tiene que ser la misma para la base y el servidor;
- dónde están los respaldos.

Reglas que ya valen:

- Ninguna compu guarda claves de producción.
- Los frenos impiden que Claude apunte a una base que no sea local.
- La piloto nunca prueba con datos reales en la versión de prueba: se usa la sala inventada.
