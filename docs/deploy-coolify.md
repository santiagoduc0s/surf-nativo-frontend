# Deploy en Coolify

Cómo corre el frontend de Surf Nativo (surfnativo.uy) en Coolify y cómo se
migra desde Forge.

## Qué es

Next.js 15 (App Router, React 18, Tailwind 4). **No es un sitio estático**:
las páginas de catálogo (`/`, `/buscar`, `/categoria/[slug]`,
`/producto/[slug]`) son ISR (`revalidate = 60`) y se renderizan en el servidor
de Next contra el backend Laravel; el login, el carrito y el chat pegan al
backend desde el navegador. Necesita un proceso node corriendo.

No hay base de datos, colas ni archivos subidos: todo vive en el backend
(`surf-nativo-backend`).

## Cómo corre hoy en Forge

- Directorio `/home/forge/surf-nativo.on-forge.com`, deploy por releases con
  symlink `current`.
- pm2 (`site-3169248`): `next start --hostname 0.0.0.0 --port 3000` desde
  `current/`, node 22.
- nginx hace `proxy_pass http://0.0.0.0:3000` y termina TLS en
  `surf-nativo.on-forge.com` (dominio de Forge, desaparece con la migración).
- `.env` de Forge: `NEXT_PUBLIC_API_URL=https://surf-nativo-backend.on-forge.com/api/v1`
  y `NEXT_PUBLIC_SITE_URL=http://localhost:3000` (esto último está mal en
  Forge: canonicals, sitemap y robots salen con `localhost`; en Coolify hay que
  cargar el dominio real).

## Cómo se buildea

`Dockerfile` en tres etapas sobre `node:22-bookworm-slim` (mismo node que
Forge):

1. `deps`: `npm ci` (con devDependencies, hacen falta para compilar).
2. `build`: `next build` con las `NEXT_PUBLIC_*` como **build args**. Si falta
   alguna el build corta, porque el código cae a `http://127.0.0.1` sin avisar.
3. `runner`: solo `.next/standalone` (`output: "standalone"` en
   `next.config.ts`) + `.next/static` + `public`, usuario `node`, `curl` para
   el healthcheck. Arranca con `node server.js` en `0.0.0.0:3000`.

`docker-compose.yml` tiene un único servicio `web` que expone el 3000 (Traefik
publica el dominio y emite el certificado), `restart: unless-stopped` y
healthcheck contra `/robots.txt` (estático, no depende del backend).

**El build necesita red y backend vivo**: `/` y `/buscar` se prerenderizan en
`next build` llamando a `NEXT_PUBLIC_API_URL` (sin try/catch: si el backend no
responde, el build falla) y `next/font` baja Libre Franklin de Google Fonts.
Por eso el backend tiene que estar desplegado y accesible por su URL pública
antes del primer deploy del frontend.

## Variables

Todas son de **build** (`build.args` en el compose). Cambiarlas exige
**redeploy**, no alcanza con reiniciar el contenedor.

| Variable               | Obligatoria | Valor en producción                         |
|------------------------|-------------|---------------------------------------------|
| `NEXT_PUBLIC_API_URL`  | sí          | URL pública del backend + `/api/v1` (p. ej. `https://api.surfnativo.uy/api/v1`) |
| `NEXT_PUBLIC_SITE_URL` | sí          | `https://surfnativo.uy`                     |

No hay secretos: ambas son públicas y terminan en el bundle del navegador.

## Dominio

El dominio real es **`surfnativo.uy`** (es el que aparece en el código: mail
`hola@surfnativo.uy`, asunto "Consulta desde surfnativo.uy", redes
`surfnativo.uy`). `surf-nativo.on-forge.com` es solo el placeholder de Forge.
Si se quiere `www.surfnativo.uy`, configurarlo en Coolify como redirección al
apex (o al revés) y usar el mismo valor en `NEXT_PUBLIC_SITE_URL`.

## Cómo apunta al backend

- Server side (ISR, sitemap): `lib/api.ts` y `lib/chat.ts` hacen `fetch` a
  `NEXT_PUBLIC_API_URL` desde el contenedor. Como la URL es pública, el
  contenedor sale por Traefik/Internet; no hace falta red interna de Docker
  con el backend.
- Client side (login, registro, chat): el navegador llama a la misma URL, así
  que el backend tiene que aceptar el origen del frontend por CORS. En el
  backend `config/cors.php` toma el origen de `FRONTEND_URL`: al migrar hay
  que ponerle `https://surfnativo.uy` (hoy en Forge vale
  `https://surf-nativo.on-forge.com`). La auth es por token Bearer, no por
  cookie de Sanctum, así que no hay `SANCTUM_STATEFUL_DOMAINS` que tocar.
- `next.config.ts` → `images.remotePatterns` solo lista el backend local
  (`localhost:8087`). Las imágenes de producto se pintan con CSS
  (`ProductImg`), no con `next/image`, así que no bloquea; si algún día se usa
  `next/image` con imágenes del backend hay que agregar su dominio ahí.

## Alta en Coolify

1. Resources → New → GitHub App → `santiagoduc0s/surf-nativo-frontend`, rama
   `main`, Build Pack **Docker Compose**, archivo `/docker-compose.yml`.
2. En el servicio `web` asignar el dominio con el puerto interno:
   `https://surfnativo.uy:3000`.
3. Environment Variables: `NEXT_PUBLIC_API_URL` y `NEXT_PUBLIC_SITE_URL`
   (Coolify las detecta por las referencias `${VAR}` del compose).
4. Deploy. Verificar `/`, `/buscar`, `/producto/<slug>`, `/sitemap.xml` (las
   URLs tienen que salir con `https://surfnativo.uy`) y un login desde el
   navegador (prueba el CORS del backend).

## Migración desde Forge

1. Migrar primero el backend y dejarlo accesible en su URL definitiva.
2. En el backend nuevo, `FRONTEND_URL=https://surfnativo.uy`.
3. Deploy del frontend en Coolify con el dominio temporal (`sslip.io`) y
   `NEXT_PUBLIC_SITE_URL` provisorio para probar; después redeploy con el
   dominio real.
4. Apuntar el DNS de `surfnativo.uy` (A al servidor de Coolify) y esperar el
   certificado.
5. Dejar Forge vivo una o dos semanas antes de borrar el sitio.

## Probar la imagen localmente

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://surf-nativo-backend.on-forge.com/api/v1 \
  --build-arg NEXT_PUBLIC_SITE_URL=http://localhost:3939 \
  -t surf-nativo:test .
docker run --rm -p 3939:3000 surf-nativo:test
# http://localhost:3939
```

`NEXT_PUBLIC_API_URL` tiene que apuntar a un backend accesible desde el build
(la ISR de `/` lo consulta); con el backend local en `127.0.0.1:8087` no
funciona desde adentro del build, usar `host.docker.internal:8087`.
