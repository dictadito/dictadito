# 0001 · Repo público

- **Fecha:** 5 de noviembre de 2026
- **Estado:** decidido, por el momento
- **Decidieron:** Luca, Silvi y Julián

## Decisión

El repo de Dictadito es público, en la cuenta de GitHub `dictadito`.

## Por qué

Es gratis, y en un repo público GitHub aplica las reglas de ramas (pull request obligatorio, aprobación, controles en verde) sin pagar GitHub Pro.

## Qué implica

Todo lo que se sube lo puede leer cualquiera, para siempre. Desde el primer push son obligatorias estas salvaguardas:

1. Escaneo de claves antes de cada commit (gitleaks) y la protección de pushes de GitHub activada.
2. Seed sin contraseñas fijas, que se niega a correr si la base no es local. Solo datos inventados.
3. Prompts de la IA y plantillas de informe en la base de datos, no en el código.
4. Ningún secreto guardado en GitHub; nunca imprimir variables ni subir datos o copias de la base como artefactos.
5. Aprobación obligatoria antes de que corran los workflows de contribuidores externos. Nunca bajar ni ejecutar el pull request de un desconocido.
6. Interacciones limitadas a colaboradores; fallos de seguridad por el reporte privado de vulnerabilidades.
7. Repo privado aparte, gratis, para lo sensible: procedimiento de emergencia, inventario de secretos, issues con contexto delicado.
8. Licencia "todos los derechos reservados" y aviso de que no se aceptan contribuciones externas.
9. Email `noreply` de GitHub en los commits de cada uno.
10. Nada de otros proyectos ni documentos internos. Antes del primer push se revisa a mano.

Si más adelante pasamos a privado, lo que ya se publicó pudo haber sido copiado. Por eso estas salvaguardas valen desde el primer push y no dependen de esta decisión.

## Qué se descartó

- **Privado + GitHub Pro** (cerca de USD 4 por mes): las mismas reglas y nadie de afuera ve el repo. Descartado por ahora por el costo.
- **Privado gratis:** en una cuenta personal, GitHub no aplica ninguna regla de ramas. Todo quedaría en la disciplina de cada uno.
