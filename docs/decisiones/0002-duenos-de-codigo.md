# 0002 · Dueños de código: los tres

- **Fecha:** 5 de noviembre de 2026
- **Estado:** decidido
- **Decidieron:** Luca, Silvi y Julián

## Decisión

Luca, Silvi y Julián son dueños de código de todas las áreas sensibles. Está escrito en [`.github/CODEOWNERS`](../../.github/CODEOWNERS).

Áreas sensibles:

- `.github/`: controles automáticos y plantillas
- `.claude/hooks/`, `.claude/settings.json`, `.githooks/`, `.gitleaks.toml` y `scripts/`: los frenos y lo que los activa
- Los `package.json` y `package-lock.json`: dependencias y comandos
- `eslint.config.js`: las reglas del código
- `apps/backend/prisma/`: esquema y migraciones de la base
- `apps/backend/src/ia/`: el único lugar que habla con la IA
- `CLAUDE.md`: las reglas para Claude

## Por qué

Somos tres y los tres tenemos que poder revisar cualquier parte. Nadie queda como cuello de botella.

## Qué implica

- Con los tres como dueños, un cambio en un área sensible lo aprueba otro de los tres, igual que cualquier otro cambio. GitHub les pide la revisión solo.
- El cuidado extra no viene de GitHub sino de nosotros: la plantilla del pull request tiene una casilla para marcar que toca un área sensible, y quien revisa la mira con más cuidado. El agente `revisor-pr` también lo señala.
- Si algún día entra una cuarta persona, se decide si es dueña de estas áreas o no.

## Cambio del 6 de noviembre de 2026

Los comandos y agentes de `.claude/` dejan de ser área sensible. Guían a Claude, pero no frenan nada: si uno pidiera algo prohibido, el freno de Claude lo bloquea igual, y el freno sí sigue protegido. Así, mejorar un comando o un agente entra con los controles en verde, sin esperar una aprobación.

## Qué se descartó

- **Dos dueños por área:** con tres personas, dejaba a alguien sin poder aprobar en algunas áreas y sumaba esperas sin aportar más control.
