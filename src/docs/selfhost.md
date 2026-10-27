---
title: Self-hosting Drawy with Supabase backend
description: Self-hosting Drawy with Supabase backend instead of partykit.
date: '1111-11-11T11:11:00Z'
draft: false
tags:
  - selfhost
  - opensource
  - drawy
  - supabase
isCJKLanguage: false
headless: false
---
### Self-hosting Drawy with Supabase

Drawy needs one Supabase project for Postgres, Realtime and Storage, plus a host
for the TanStack Start app.

## What you need

- Bun 1.3 or newer
- A Supabase project, or Docker for the local Supabase stack
- The Supabase CLI — `mise install` includes it

## 1. Install

```bash
git clone https://github.com/Pratyay360/drawysupabase.git
cd drawysupabase
bun install
```

## 2. Configure the environment


| Variable                        | Required | Purpose                                                         |
| ------------------------------- | -------- | --------------------------------------------------------------- |
| `SESSION_SECRET`                | yes      | Seals the session cookie — generate with `openssl rand -hex 32` |
| `SUPABASE_URL`                  | yes      | Project URL, used on the server                                 |
| `SUPABASE_SECRET_KEY`           | yes      | Server key; bypasses RLS, never expose it to the browser        |
| `VITE_SUPABASE_URL`             | yes      | Project URL for the browser bundle                              |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | yes      | Public key for the browser bundle                               |
| `VITE_SITE_URL`                 | no       | Canonical app URL; defaults to `https://drawy.pratyay.online`   |
| `SENTRY_AUTH_TOKEN`             | no       | Uploads source maps during the build                            |


Only `VITE_*` variables reach the client bundle, so keep the secret key out of
anything with that prefix.

## 3. Create the schema

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

`mise run dbsetup` runs the same push. Migrations live in
`supabase/migrations/` and must be applied in order.

## 4. Run locally

```bash
supabase start      # needs Docker
supabase db push
bun run dev         # app on http://localhost:3000
```

`supabase status` prints the local URL and keys — use those values in `.env`
while working against the local stack.

## 5. Deploy

```bash
bun run build
```

The build uses the Nitro Netlify preset; swap it in `vite.config.ts` for another
platform. Run the migrations against your hosted project before the first
deploy, then set every environment variable in the hosting dashboard.

## Notes

- Realtime is enabled by default on Supabase projects; the app uses broadcast
and presence channels, so leaving it on is required.
- Auth is app-owned (`app_users` table), so Supabase Auth sign-ups and email
templates are unused.
- Images are uploaded to a public `canvas-assets` bucket with a 10 MB limit, and
the app creates the bucket on first upload.
- Lint and format are mise tasks: `mise run lint` and `mise run format`.
