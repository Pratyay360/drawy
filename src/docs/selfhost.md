---
title: Self-hosting Drawy Party
description: >-
  Run your own instance — the TanStack Start app, the realtime worker and
  Postgres.
date: '1111-11-11T11:11:00Z'
draft: false
tags:
  - self
  - hosting
  - self hosting
  - drawy
  - partyserver
  - cloudflare workers
isCJKLanguage: false
headless: false
order: 5
---
Drawy has three components, frontend, backend and data store which holds the  
drawings. This page walks through all three.

## What you need

- MISE the version manager
- A PostgreSQL database — Neon, Supabase or any
- A Cloudflare account — the realtime Durable Objects live in the same Worker
  as the app, so `wrangler deploy` publishes everything.
- Any serverless platform like vercel, netlify, cloudflare worker.

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
| `VITE_PARTYKIT_URL` | no       | Realtime host; leave unset to use the app's own origin (same worker), e.g. `drawyparty.username.workers.dev` |
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
`canvases` and `canvas_versions`. If you prefer versioned migrations, run
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
```

In development the Vite server proxies `/parties` to `VITE_PARTYKIT_URL`, so
you can develop against an already-deployed worker. To run the worker locally
as well:

```bash
bun run cf:dev   # built worker on http://localhost:8787 (app + rooms)
```

Then set `VITE_PARTYKIT_URL=http://localhost:8787` and restart `bun run dev`.

## 6. Deploy the app to Cloudflare Workers

The build targets the `cloudflare_module` Nitro preset, so the app ships as a
Cloudflare Worker with the client bundle attached as static assets.

```bash
bun run build          # writes .output/server and .output/public
bun run deploy:dry-run # packages the worker without uploading it
bun run deploy         # builds and uploads to Cloudflare
```

`wrangler.jsonc` in the repository root is the worker configuration: the
worker name, the compatibility date and flags, the `ASSETS` binding the
generated server reads its public files from, and the `Main` / `Rooms`
Durable Object bindings the realtime rooms run in. Nitro's generated
`.output/server/wrangler.json` redirect is switched off (`cloudflare:
{ deployConfig: false }` in `vite.config.ts`) so this root file stays the one
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

Variables prefixed with `VITE_` are inlined into the bundle at build time, so
they have to be set before `bun run build`: `VITE_PARTYKIT_URL` for the
realtime host (unset means same-origin, since the rooms live in this worker)
and `VITE_SITE_URL` for the canonical URL that the sitemap and `robots.txt`
advertise.

## Operational notes

- Your reverse proxy must forward WebSocket upgrades on `/parties`; the browser  
connects there directly for real time sync.
- Image uploads go to imgcdn.dev from `src/lib/s3.ts`. Replace that function if
you would rather keep objects on your own storage.
- The session cookie is only marked `Secure` when `NODE_ENV=production`, so
serve the app over HTTPS.
- Lint and format are mise tasks: `mise run lint` (oxlint) and `mise run format`
(oxfmt).

## Related

- [Privacy and security](/docs/privacy-and-security) — what your instance stores
- [Getting started](/docs/getting-started) — using Drawy as an end user
