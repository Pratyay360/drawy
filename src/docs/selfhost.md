---
title: Self-hosting Drawy Party
description: >-
  Run your own instance — the TanStack Start app, the PartyKit worker and
  Postgres.
date: '1111-11-11T11:11:00Z'
draft: false
tags:
  - self
  - hosting
  - self hosting
  - drawy
  - partykit
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
- A PartyKit project on Cloudflare
- Any host that can run the Nitro build; the Netlify preset is already wired up

## 1. Install

```bash
git clone https://github.com/Pratyay360/drawyparty.git
cd drawyparty
bun install
```

[mise](https://mise.jdx.dev/) is optional. `mise install` pulls in the pinned
bun and sops from `mise.toml`, and `mise run <task>` gives you the same
commands the maintainers use.

## 2. Configure the environment


| Variable            | Required | Purpose                                                                     |
| ------------------- | -------- | --------------------------------------------------------------------------- |
| `DATABASE_URL`      | yes      | Postgres connection string; prefer a pooled URL if your provider offers one |
| `SESSION_SECRET`    | yes      | Signs the session cookie — generate one with `openssl rand -hex 32`         |
| `VITE_PARTYKIT_URL` | yes      | Host of the PartyKit deployment, e.g. `drawy.username.partykit.dev`         |
| `VITE_SITE_URL`     | no       | Canonical app URL; defaults to `https://drawyparty.pratyay.online`          |
| `SENTRY_AUTH_TOKEN` | no       | Uploads source maps during the build                                        |
| `PARTYKIT_SECRET`   | no       | Only used by the PartyKit deploy template; the app never reads it           |


The repository's `.env.example` is encrypted with sops. With the matching age
key, `mise run decrypt` unwraps it into `.env`; otherwise write `.env` yourself.

The app picks its database driver from the host in `DATABASE_URL`: a Neon host
is reached over Neon's HTTP API, so no TCP connection to port 5432 stays open
and serverless hosts are happy. Any other Postgres — Supabase, your own
server — is reached over plain TCP.

## 3. Create the tables

```bash
bun run db:push
```

This applies `src/lib/db/schema.ts` to `DATABASE_URL` and creates `app_users`,
`canvases` and `canvas_versions`. If you prefer versioned migrations, run
`bun run db:generate` and then `bun run db:migrate`.

## 4. Deploy the realtime worker

```bash
bun run party:deploy
```

`partykit.json` already points at `src/party/server.ts` and the `rooms` party.
The command prints the deployment host; use it for `VITE_PARTYKIT_URL`.

The worker relays Yjs updates but stores nothing — the browser saves each
canvas to Postgres, which stays the source of truth.

To host the realtime worker in your own Cloudflare account instead of
PartyKit Cloud, add `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` to your
shell and run `bunx partykit deploy --domain parties.example.com`.

## 5. Run locally

```bash
bun run dev     # app on http://localhost:3000
```

In development the Vite server proxies `/parties` to `VITE_PARTYKIT_URL`, so
you can develop against an already-deployed worker. To run the worker locally
as well:

```bash
bun run party:dev   # worker on http://localhost:1999
```

Then set `VITE_PARTYKIT_URL=http://localhost:1999` and restart `bun run dev`.

## 6. Deploy the app to Cloudflare Workers

The build targets the `cloudflare_module` Nitro preset, so the app ships as a
Cloudflare Worker with the client bundle attached as static assets.

```bash
bun run build          # writes .output/server and .output/public
bun run deploy:dry-run # packages the worker without uploading it
bun run deploy         # builds and uploads to Cloudflare
```

`wrangler.jsonc` in the repository root is the worker configuration: the
worker name, the compatibility date and flags, and the `ASSETS` binding the
generated server reads its public files from. Nitro mirrors that file into
`.output/server/wrangler.json` and points Wrangler at it, so the root file
stays the place to change things.

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
realtime host and `VITE_SITE_URL` for the canonical URL that the sitemap and
`robots.txt` advertise.

## Operational notes

- Your reverse proxy must forward WebSocket upgrades on `/parties`; the browser
connects there directly for realtime sync.
- Image uploads go to imgcdn.dev from `src/lib/s3.ts`. Replace that function if
you would rather keep objects on your own storage.
- The session cookie is only marked `Secure` when `NODE_ENV=production`, so
serve the app over HTTPS.
- Lint and format are mise tasks: `mise run lint` (oxlint) and `mise run format`
(oxfmt).

## Related

- [Privacy and security](/docs/privacy-and-security) — what your instance stores
- [Getting started](/docs/getting-started) — using Drawy as an end user
