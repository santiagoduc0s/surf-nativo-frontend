# syntax=docker/dockerfile:1.7
#
# Imagen de producción de surfnativo.uy (Next.js 15, App Router).
#
# Tres etapas: deps (npm ci) -> build (next build) -> runner (node server.js).
# `output: "standalone"` en next.config.ts hace que .next/standalone traiga
# solo los node_modules que el servidor necesita, así la imagen final no
# carga con devDependencies ni con el toolchain de Tailwind.
#
# Las NEXT_PUBLIC_* se hornean en el bundle en `next build`: por eso llegan
# como build args y no como env de runtime. Cambiarlas exige redeploy.
#
# El build necesita red: `/` y `/buscar` son ISR y se prerenderizan contra
# NEXT_PUBLIC_API_URL, y next/font baja Libre Franklin de Google Fonts.

ARG NODE_IMAGE=node:22-bookworm-slim

# ---------------------------------------------------------------------------
# 1. Dependencias (incluye devDependencies: tailwind/typescript hacen falta
#    para compilar)
# ---------------------------------------------------------------------------
FROM ${NODE_IMAGE} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

# ---------------------------------------------------------------------------
# 2. Build
# ---------------------------------------------------------------------------
FROM ${NODE_IMAGE} AS build
WORKDIR /app
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
    NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} \
    NEXT_TELEMETRY_DISABLED=1
# Sin estas dos el código cae a http://127.0.0.1 y el sitio queda apuntando
# a localhost sin que nada falle: mejor cortar el build acá.
RUN if [ -z "$NEXT_PUBLIC_API_URL" ] || [ -z "$NEXT_PUBLIC_SITE_URL" ]; then \
        echo "Faltan los build args NEXT_PUBLIC_API_URL y/o NEXT_PUBLIC_SITE_URL" >&2; exit 1; \
    fi
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------------------------------------------------------------------------
# 3. Imagen final: solo el output standalone + estáticos + public
# ---------------------------------------------------------------------------
FROM ${NODE_IMAGE} AS runner

# curl solo para el healthcheck del compose.
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000

WORKDIR /app
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static

USER node

# Traefik (Coolify) termina TLS y le pega al 3000 en http.
EXPOSE 3000
CMD ["node", "server.js"]
