# Dictadito

App para docentes, de WIARK Solutions. En desarrollo.

Este es el repositorio de trabajo del equipo. Es público, pero **no se aceptan contribuciones externas**: los pull requests de personas que no son del equipo se cierran sin revisar.

- Si te sumás al equipo: [docs/ALTA.md](docs/ALTA.md)
- Cómo funciona (guía rápida): [docs/GUIA.md](docs/GUIA.md)
- Cómo trabajamos: [docs/COMO-TRABAJAMOS.md](docs/COMO-TRABAJAMOS.md)
- Orden de construcción: [docs/CAPAS.md](docs/CAPAS.md)
- Pantallas y alcance de la primera versión: [docs/PANTALLAS.md](docs/PANTALLAS.md)
- Quién hace qué en la primera versión: [docs/PLAN-PRIMERA-VERSION.md](docs/PLAN-PRIMERA-VERSION.md)
- Decisiones tomadas: [docs/decisiones/](docs/decisiones/)
- Configuración de GitHub: [docs/CONFIGURACION-GITHUB.md](docs/CONFIGURACION-GITHUB.md)

## Cómo está armado

Un solo repo con tres partes, que se instalan juntas con `npm install`:

| Carpeta           | Qué es                                                     |
| ----------------- | ---------------------------------------------------------- |
| `apps/frontend`   | La app web: React, Vite y Tailwind, mobile first           |
| `apps/backend`    | La API: Node 22, Express y TypeScript                      |
| `packages/shared` | Validaciones (Zod) y funciones que usan el front y el back |

## Cómo correrla en tu compu

En el día a día se lo pedís a Claude. Por debajo, son estos comandos:

| Comando                | Qué hace                                                                                        |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| `npm install`          | Instala todo y activa el freno de git                                                           |
| `npm run dev:backend`  | Levanta la API en `http://localhost:3000` (`/health` y `/version`)                              |
| `npm run dev:frontend` | Levanta la app en `http://localhost:5173`; lo que va a `/api`, al backend                       |
| `npm run check`        | Formato, reglas del código, tipos, tests, frenos y build: tiene que dar verde antes de entregar |

Las variables de cada parte están en su `.env.example`, con valores de ejemplo. En tu compu no hace falta ninguna.

## Seguridad

Si encontrás un problema de seguridad, no abras un issue: usá **Report a vulnerability** en la pestaña **Security** del repo.

## Licencia

Todos los derechos reservados. Ver [LICENSE](LICENSE).
