---

title: Self hosting Drawy
description: >-
Run your own instance of drawy the TanStack Start app, the real time worker
and Postgres
date: '1111-11-11T11:11:00Z'
draft: false
tags:
- self
- hosting
- self hosting
- drawy
- partyserver
- cloudflare workers
- durable
- worker
  isCJKLanguage: false
  headless: false
  order: 5

---

Drawy has three components, front end, back end, and data store which holds the  
drawings. This page walks through all three.

## What you need

- MISE the version manager
- A PostgreSQL database — Neon, Supabase or any
- A Cloudflare account — the realtime Durable Objects live in the same Worker
  as the app, so `wrangler deploy` publishes everything.
- Any serverless platform like cloudflare worker.

## 1. Install

```bash
git clone https://github.com/Pratyay360/drawy.git
cd drawy
mise deps
```

[mise](https://mise.jdx.dev/) is optional. `mise install` pulls in the pinned dependencies from `mise.toml`, and `mise run <task>` gives you the same commands the maintainers use.

## 2. Configure the environment

| Variable            | Required | Purpose                                                                     |
| ------------------- | -------- | --------------------------------------------------------------------------- |
| `DATABASE_URL`      | yes      | Postgres connection string; prefer a pooled URL if your provider offers one |
| `SESSION_SECRET`    | yes      | Signs the session cookie — generate one with `openssl rand -hex 32`         |
| `VITE_SITE_URL`     | no       | Canonical app URL; defaults to `https://drawyparty.pratyay.online`          |
| `SENTRY_AUTH_TOKEN` | no       | Uploads source maps during the build (optional)                             |

The repository's `.env.example` can be used as a reference.

## 3. Create the tables

```bash
bun run db:generate
bun run db:migrate
bun run db:push
```

This applies `src/lib/db/schema.ts` to `DATABASE_URL` and creates `app_users`,  
`canvases,` and `canvas_versions`. If you prefer versioned migrations, run
`bun run db:generate` and then `bun run db:migrate`.

## 4. Realtime ships with the app

There is no separate realtime deployment: `src/party/index.ts` is the worker
entry and routes `/parties/*` to two Durable Objects declared in
`wrangler.jsonc` — `Main` (the editor rooms, `/parties/main/:room`) and `Rooms`
(the occupancy singleton, `/parties/rooms/:room`). `bun run deploy` publishes
both together.

The worker relays Yjs updates but stores nothing — the browser saves each
canvas to Postgres, which stays the source of truth.

## 5. Run locally

```bash
bun run dev
bun run cf:dev   # built worker on http://localhost:8787 (app + rooms)
```

## 6. Deploy the app to Cloudflare Workers

By targeting the `cloudflare_module` Nitro preset, the application is packaged as a Cloudflare Worker, with the client bundle delivered as static assets.

```bash
bun run build          # writes .output/server and .output/public
bun run deploy:dry-run # packages the worker without uploading it
bun run deploy         # builds and uploads to Cloudflare
```

`wrangler.jsonc` in the repository root is the worker configuration: the
worker name, the compatibility date and flags, the `ASSETS` binding the
generated server reads its public files from, and the `Main` / `Rooms`
Durable Object bindings the realtime rooms run in. Nitro's generated
`.output/server/wrangler.json` redirect is switched off (`cloudflare: { deployConfig: false }` in `vite.config.ts`) so this root file stays the one
place to change things — its `main` points at `src/party/index.ts`, which
wraps the Nitro bundle.

Secrets live in the worker, not in the repository:

```bash
bunx wrangler secret put DATABASE_URL
bunx wrangler secret put SESSION_SECRET
```

Both values are read at runtime from the worker bindings, so the app talks to  
Neon over its HTTP API and signs sessions with the same secret as your local  
`.env`. `bun run cf:dev` runs the built worker locally; put the two values in  
`.dev.vars` (git-ignored) so the local run has them too.

Variables prefixed with `VITE_` are inlined into the bundle during the build process, so they must be defined before running `bun run build`. Use `VITE_SITE_URL` to define the canonical URL that appears in the sitemap and `robots.txt`.

## Operational Notes

- Your reverse proxy must forward WebSocket upgrades on `/parties`; the browser  
  connects there directly for real time sync.
- Image uploads go to the S3-compatible bucket configured with the `S3_*`
  variables.
- The session cookie is only marked `Secure` when `NODE_ENV=production`, so
  serve the app over HTTPS.
- Lint and format are mise tasks: `mise run lint` (oxlint) and `mise run format`
  (oxfmt).

## Related

- [Privacy and security](/docs/privacy-and-security) — what your instance stores
- [Getting started](/docs/getting-started) — using Drawy as an end user

&nbsp;