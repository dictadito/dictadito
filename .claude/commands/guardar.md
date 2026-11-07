---
description: Guarda tu trabajo y lo sube a tu rama en GitHub como respaldo, sin entregarlo. La primera vez abre la propuesta como borrador.
---

# /guardar

La persona quiere dejar su trabajo a salvo, aunque no esté terminado: antes de cerrar la compu, al final del día o porque lleva un rato sin guardar. Tu trabajo es hacer un commit, subir su rama a GitHub y, la primera vez, abrir la propuesta como **borrador**. Entregarla es `/listo`.

Subir tu rama no afecta a nadie: es tuya. Si la compu se rompe, el trabajo queda en GitHub. Y el borrador hace que los demás vean en qué estás, sin pedirle revisión a nadie.

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

## 4. El borrador, la primera vez

Fijate si la rama ya tiene propuesta: `gh pr view <rama> --json number,isDraft,url`.

- **Ya tiene:** no hagas nada más. El push la actualiza sola.
- **No tiene:** abrila como borrador. Escribí el texto en un archivo temporal fuera del repo, con dos líneas:
  - `**Parte del seguimiento:** <la parte del plan>`. Si no sabés cuál es, preguntale a la persona.
  - `En curso. La descripción completa se arma con /listo.`

  Después corré:

  `gh pr create --draft --base staging --head <rama> --title "<tipo>: <qué cambia>" --body-file <archivo>`

  El título sigue el formato `tipo: qué cambió`, igual que en `/listo`. Un borrador no le pide revisión a nadie.

Si `gh` no está instalado o no tiene la sesión iniciada, saltá este paso y avisale en una línea: el trabajo igual quedó guardado.

## 5. Confirmá

Decile que quedó guardado en GitHub, en su rama, y que los demás ven en qué está pero nada se suma hasta que diga "terminé" (`/listo`).

## Nunca

- Forzar un push, hacer rebase ni guardar en `staging` o en `main`.
- Abrir la propuesta lista para revisar o sacarla de borrador: eso lo hace `/listo`.
- Si aparece un mensaje que empieza con `FRENO:`, no busques otra forma de hacer lo mismo: explicá qué se frenó, por qué y cuál es el camino seguro.
