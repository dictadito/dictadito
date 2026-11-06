# Cómo funciona

Un pantallazo de lo que pasa cuando trabajamos. En el día a día todo se opera con Claude Code y los comandos del equipo; esta guía es para que entiendas qué está haciendo Claude y por qué, y no te asustes cuando algo te frena.

Las reglas de convivencia están en [COMO-TRABAJAMOS.md](COMO-TRABAJAMOS.md). Para sumarte al equipo: [ALTA.md](ALTA.md).

## 1. Las piezas

| Palabra          | Qué es                                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------------------------- |
| **Repo**         | La carpeta del proyecto con toda su historia. Hay una copia en GitHub, la compartida, y una en tu compu. |
| **Commit**       | Una foto guardada de tus cambios, con un mensaje que dice qué cambió. Se puede volver a cualquier foto.  |
| **Rama**         | Una línea de trabajo paralela. Trabajás en la tuya sin tocar lo de los demás.                            |
| **Push**         | Subir tus commits a GitHub. **Fetch** es lo contrario: traer lo que subieron los demás.                  |
| **Pull request** | El pedido de sumar tu rama a `staging`. Ahí otra persona revisa y aprueba.                               |
| **Merge**        | Sumar una rama a otra. Con **squash**, todos los commits de la tarea entran como uno solo.               |
| **Conflicto**    | Dos personas cambiaron las mismas líneas y git no sabe con cuál quedarse: te pregunta a vos.             |

## 2. Las ramas

```
main       ●─────────────────────────●────────   producción: lo que usan los docentes
            \                       ↑
             \                      │ pull request de staging a main
staging       ●───●───────●───────●─┴──────────   lo revisado, publicado en el ambiente de prueba
                  ↑       ↑       ↑
                  │       │       └── docs/guia
                  │       └────────── fix/fecha-informe
                  └────────────────── feature/dictado-por-voz
```

- Un cambio pasa por tres lugares: tu compu (local), donde trabajás y probás con datos inventados; `staging`, el ambiente de prueba que vemos los tres; y producción (`main`), lo que usan los docentes. De tu compu nunca se sube directo a `staging`: subís tu rama, y entra por un pull request.
- Cada tarea sale de `staging` en su propia rama: `feature/`, `fix/`, `chore/` o `docs/`.
- Vuelve a `staging` por un pull request que aprueba otra persona.
- A `main` solo se llega desde `staging`. Cada vez que `main` cambia, se publica para los docentes.
- En `staging` y en `main` nadie trabaja directo. Ni vos, ni Claude, ni GitHub lo permiten.

## 3. Una tarea, y qué pasa por debajo

| Paso              | Qué hacés                                                     | Qué pasa por debajo                                                                                                        |
| ----------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 1. Empezar        | `/nueva-tarea dictado-por-voz`                                | `git fetch origin` y `git switch --no-track -c feature/dictado-por-voz origin/staging`: tu rama, desde lo último de GitHub |
| 2. Trabajar       | Le pedís a Claude los cambios                                 | Claude edita archivos en tu rama y va haciendo commits chicos (`git add` + `git commit`)                                   |
| 3. Ponerse al día | `/sincronizar`, si `staging` avanzó                           | `git fetch origin` y `git merge origin/staging`. Si hay un conflicto, Claude te lo muestra y decidís                       |
| 4. Entregar       | `/listo`                                                      | `npm run check`, `git push -u origin <tu-rama>` y `gh pr create --base staging`                                            |
| 5. Revisión       | Otra persona lo revisa en GitHub                              | Corren los controles automáticos. Si te piden cambios, los hacés en tu rama y el pull request se actualiza solo            |
| 6. Sumar          | Con aprobación y todo en verde: **Squash and merge**          | La tarea entra a `staging` como un commit y se publica en el ambiente de prueba. Tu rama se borra sola                     |
| 7. Producción     | Pull request de `staging` a `main`, aprobado por otra persona | **Merge commit**: lo que estaba probado en staging pasa a producción                                                       |

¿Por qué merge y nunca rebase? El rebase reescribe la historia de tu rama, y después hay que forzar el push, que puede pisar trabajo ajeno. Con merge nunca hace falta forzar nada.

## 4. Los frenos

Son cinco capas. Cada una frena algo distinto, así que si una falla, la siguiente ataja.

| Capa                     | Dónde vive                      | Qué frena                                                                                                                                                                             |
| ------------------------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Reglas de GitHub      | En GitHub (las pone Luca)       | Subir directo a `staging` o `main`, sumar sin aprobación o con controles en rojo, forzar un push, borrar esas ramas                                                                   |
| 2. Controles automáticos | En GitHub, en cada pull request | Código que no compila, tests rotos, claves en el código                                                                                                                               |
| 3. Freno de Claude       | `.claude/hooks/frenos.cjs`      | Que Claude haga algo de lo que no se hace: subir a `staging` o `main`, forzar, saltear frenos, rebase, aprobar o mergear, tocar un `.env`, borrar en masa, publicar desde la terminal |
| 4. Freno de git          | `.githooks/pre-commit`          | Commits directo en `staging` o `main`, y commits con claves (lo revisa gitleaks). Frena a todos, con o sin Claude                                                                     |
| 5. Agentes y comandos    | `.claude/`                      | No frenan: guían. `/nueva-tarea`, `/sincronizar`, `/listo` y el agente `guia-git`                                                                                                     |

Cuando algo se frena, aparece un mensaje así:

```
FRENO: subir directo a main.
Camino seguro: Todo entra a staging por un pull request que aprueba otra persona, y a main
solo se llega desde staging. Subí tu rama de trabajo y abrí el pull request con /listo.
```

- **Qué hacer:** leer el camino seguro y seguirlo. El freno no es un error, es la regla funcionando.
- **Qué no hacer:** buscar la vuelta. Si creés que el freno se equivoca, avisale al equipo.
- **Los frenos se cuidan solos:** Claude no puede modificarlos. Cambiarlos es un pull request como cualquier otro, y lo revisa otra persona.
- **Para comprobar que andan en tu compu:** `npm run probar-frenos`. Tiene que terminar en "todo OK".

## 5. Si algo sale mal

| Pasó esto                                          | Hacé esto                                                                                                                  |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Te apareció un `FRENO:`                            | Leé el camino seguro y seguilo. Si no lo entendés, preguntale al agente `guia-git`                                         |
| GitHub rechaza tu push porque la rama avanzó       | `/sincronizar` y volvé a subir. Nunca forzar                                                                               |
| Un conflicto                                       | `/sincronizar` te muestra las líneas en disputa. Decidís con qué quedarte; si son cambios de otro, preguntale              |
| Subiste una clave, aunque sea a tu rama            | Avisale al equipo enseguida. La clave se cambia en el servicio: borrarla del archivo no alcanza, porque el repo es público |
| Algo roto llegó a `staging`                        | Se saca con un pull request de **revert**. No se arregla a las apuradas encima                                             |
| Creés que perdiste trabajo                         | No toques nada y avisá. Git guarda casi todo un tiempo (`git reflog`) y casi siempre se recupera                           |
| Te trabaste con git y no sabés en qué estado quedó | Pedile ayuda al agente `guia-git`: primero mira, explica y recién después propone                                          |
