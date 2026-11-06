---
description: Guarda tu trabajo y lo sube a tu rama en GitHub como respaldo, sin entregarlo.
---

# /guardar

La persona quiere dejar su trabajo a salvo, aunque no esté terminado: antes de cerrar la compu, al final del día o porque lleva un rato sin guardar. Tu trabajo es hacer un commit y subir su rama a GitHub. **No se abre ninguna propuesta:** eso es `/listo`.

Subir tu rama no afecta a nadie: es tuya. Y si la compu se rompe, el trabajo queda en GitHub.

Cómo hablar: español rioplatense, simple. Cada vez que corras un comando de git, mostralo con una línea que diga qué hace.

## 1. Mirá dónde estás

`git status --short --branch`

- **En `staging` o en `main`:** ahí no se guarda nada. Llevá los cambios a una rama de trabajo con `/nueva-tarea` y seguí desde ahí.
- **Sin cambios y sin nada para subir:** decile que ya está todo a salvo y terminá.

## 2. Guardá

- Mostrá qué archivos cambiaron, en una lista corta.
- Proponé un commit con el formato `tipo: qué cambió`. Si es trabajo a medias, decilo en el mensaje, por ejemplo `feat: botón de dictar (a medias)`.
- Con el OK: `git add` de esos archivos y `git commit`. Nunca agregues un `.env` ni nada con claves.

## 3. Subí la rama

- La primera vez: `git push -u origin <rama>`. Las siguientes: `git push`.
- Si GitHub rechaza el push porque la rama tiene algo nuevo, no fuerces: traé eso primero con `git pull --no-rebase` y volvé a subir. Si hay un conflicto, seguí como en `/sincronizar`.

## 4. Confirmá

Decile que quedó guardado en GitHub, en su rama, y que nadie más lo ve sumado hasta que diga "terminé" (`/listo`). Si tenés el seguimiento a mano, anotá cómo quedó esa parte.

## Nunca

- Forzar un push, hacer rebase ni guardar en `staging` o en `main`.
- Abrir una propuesta: eso lo hace `/listo`.
- Si aparece un mensaje que empieza con `FRENO:`, no busques otra forma de hacer lo mismo: explicá qué se frenó, por qué y cuál es el camino seguro.
