---
description: Te pone al día con lo último de staging, con merge (nunca rebase), y te guía si hay conflictos.
---

# /sincronizar

La persona quiere traer a su rama lo que se sumó a `staging` mientras trabajaba. Se hace con **merge, nunca con rebase**: el rebase reescribe la historia y obliga a forzar el push, y forzar puede pisar trabajo ajeno.

Cómo hablar: español rioplatense, simple, de a un paso. Cada vez que corras un comando de git, mostralo con una línea que diga qué hace.

## 1. Mirá el estado

`git status --short --branch`

- **Si está en `main`:** en `main` no se trabaja y no hay nada que sincronizar. Preguntale en qué tarea quiere seguir.
- **Si está en `staging`:** lo único que se hace es actualizarla con `git pull --ff-only`. Si falla, es porque hay commits locales en `staging` que no deberían existir: pará y llamá al agente `guia-git`.
- **Si hay cambios sin guardar:** el merge necesita todo guardado. Mostrá los archivos, proponé un commit en esta rama con el formato `tipo: qué cambió` y esperá el OK.

## 2. Traé lo último y mirá qué llegó

- `git fetch origin --prune`
- `git log --oneline HEAD..origin/staging`: lo que entró a `staging` y la persona no tiene.

Si no hay nada, decile que ya está al día y terminá. Si hay, contá cuántos commits son y resumí de qué tratan por sus títulos.

## 3. Sumá staging a la rama

`git merge origin/staging`

Si sale bien, contale qué pasó: se creó un commit de merge, o la rama avanzó sola. Si hay conflictos, seguí con el paso 4.

## 4. Si hay conflictos

Un conflicto es normal: los dos lados cambiaron las mismas líneas y git pregunta con cuál quedarse.

1. `git status --short`: los archivos en conflicto aparecen con `UU`.
2. Por cada archivo, mostrá cada bloque en disputa:

   ```
   <<<<<<< HEAD
   lo que hay en tu rama
   =======
   lo que llegó de staging
   >>>>>>> origin/staging
   ```

   Explicá en palabras qué cambió cada lado y proponé cómo quedaría combinado.

3. **La decisión es de la persona.** Si lo que llegó de `staging` es trabajo de otra persona y no está claro qué hacer, sugerí preguntarle antes.
4. Con el OK, editá el archivo y dejá la versión acordada, sin las marcas `<<<<<<<`, `=======` y `>>>>>>>`.
5. `git add <archivo>`, de a un archivo.
6. Cuando no quede ninguno en conflicto: `git commit --no-edit`, que cierra el merge.

Si se complica o la persona prefiere dejarlo para después: `git merge --abort` deja todo como estaba antes del merge, sin perder nada.

## 5. Después del merge

- Si el proyecto ya tiene `npm run check`, corrélo. Lo que llegó de `staging` puede chocar con lo de la rama aunque git no marque conflicto.
- Si la rama ya estaba subida a GitHub, `git push` actualiza el pull request. Si todavía no se subió, no hace falta: se sube con `/listo`.

## Nunca

- `git rebase`, `git pull --rebase` ni forzar un push. El freno los bloquea igual.
- Resolver un conflicto tirando el trabajo de otra persona sin preguntar.
- Si aparece un mensaje que empieza con `FRENO:`, no busques otra forma de hacer lo mismo: explicá qué se frenó, por qué, y cuál es el camino seguro.
