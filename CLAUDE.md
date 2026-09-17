@AGENTS.md

## Deploy

Corre en **Coolify** como stack de Docker Compose: un solo servicio `web`
(`Dockerfile` multi-stage sobre `node:22-bookworm-slim`, `next build` con
`output: "standalone"`, arranca `node server.js` en el 3000). No hay base de
datos ni workers: todo viene del backend Laravel (`surf-nativo-backend`) vía
`NEXT_PUBLIC_API_URL`. Dominio de producción: `surfnativo.uy`.

`NEXT_PUBLIC_API_URL` y `NEXT_PUBLIC_SITE_URL` son **build args** (Next las
hornea en el bundle): cambiarlas exige redeploy. Cualquier `NEXT_PUBLIC_*`
nueva tiene que sumarse al `Dockerfile` (ARG/ENV), al `build.args` del
compose, a `.env.example` y a `docs/deploy-coolify.md`.

El build llama al backend (`/` y `/buscar` son ISR sin try/catch) y a Google
Fonts: sin red o con el backend caído, `next build` falla. Runbook completo,
migración desde Forge y prueba local de la imagen en `docs/deploy-coolify.md`.
