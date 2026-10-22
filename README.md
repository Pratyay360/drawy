# Drawy — Supabase edition

The same collaborative Excalidraw workspace as [drawy-party](../drawyparty), with
Supabase doing the heavy lifting: Postgres for canvases, Realtime for live
editing, and no separate websocket service to deploy.

## Supabase vs PartyKit

Both editions share the same UI and feature set. Pick based on what you already
run:

|                    | Supabase edition                         | [PartyKit edition](../drawyparty)     |
| ------------------ | ---------------------------------------- | ------------------------------------- |
| Realtime           | Supabase Realtime broadcast + presence   | PartyKit (Cloudflare Durable Objects) |
| Storage            | Supabase Postgres (managed)              | Your own Postgres via Drizzle         |
| Services to deploy | One web app                              | Web app + PartyKit worker             |
| Schema changes     | SQL migrations in `supabase/migrations/` | Drizzle schema + generated migrations |

## How it fits together

```text
Browser (Excalidraw)
   ├── Realtime channel  → Supabase broadcast/presence (live scene, cursors)
   └── /api/rpc/*        → oRPC → Supabase Postgres (admin client)
```

- **Live editing** is in `src/utils/canvas-realtime.ts`. `CanvasRealtime` opens a
  `drawy:canvas:<id>` channel and broadcasts scene updates, save notifications,
  and presence counts. Merging is version-based: the newer Excalidraw element
  wins (`mergeElements`).
- **Auth is app-owned, not Supabase Auth.** Users live in the `app_users` table
  with scrypt password hashes. The server checks credentials, then writes a
  `drawy-session` cookie sealed with AES-256-GCM using `SESSION_SECRET`. See
  `src/lib/session.server.ts` and `src/lib/session-cookie.server.ts`.
- **Database access** goes through the Supabase admin client
  (`src/utils/server-supabase.ts`) which uses the secret key and bypasses RLS.
  Tables in `public` are locked down with RLS and grants revoked, because
  authorization is enforced in application code.
- **The UI** is a TanStack Start app: routes in `src/routes/`, Excalidraw in
  `src/components/canvas-editor.tsx`, Zustand stores in `src/stores/`.

## Stack

- **Frontend** — React 19, TanStack Start/Router/Query, Tailwind CSS 4, Excalidraw
- **Realtime** — Supabase Realtime channels
- **Data** — Supabase Postgres, `@supabase/supabase-js` and `@supabase/ssr`
- **API** — oRPC over `/api/rpc`
- **Build** — Vite (`vite-plus`) with Nitro, Bun as the package manager
- **Ops** — Sentry, Biome, mise

## Prerequisites

- [Bun](https://bun.sh) `>= 1.3` (the repo pins `bun@1.3.14`)
- A Supabase project, or the [Supabase CLI](https://supabase.com/docs/guides/local-development)
  with Docker for a local stack
- The Supabase CLI for pushing migrations (`mise install` covers it)

## Environment

`.env.example` is a [sops](https://getsops.io)-encrypted copy of the required
variables. With the matching age key, `mise run decrypt` unwraps it into `.env`.
Without the key, write `.env` yourself with the variables below.

| Variable                        | Required | Used for                                                                      |
| ------------------------------- | -------- | ----------------------------------------------------------------------------- |
| `SESSION_SECRET`                | yes      | Key for the AES-256-GCM sealed session cookie                                 |
| `SUPABASE_URL`                  | yes      | Project URL (server)                                                          |
| `SUPABASE_SECRET_KEY`           | yes      | Server key; bypasses RLS, never ship it to the browser                        |
| `SUPABASE_PUBLISHABLE_KEY`      | no       | Server-side fallback when no secret key is configured                         |
| `VITE_SUPABASE_URL`             | yes      | Same project URL, exposed to the client bundle                                |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | yes      | Same public key, exposed to the client bundle                                 |
| `VITE_SITE_URL`                 | no       | Canonical URL for sitemap/robots (defaults to `https://drawy.pratyay.online`) |
| `SENTRY_AUTH_TOKEN`             | no       | Uploads source maps; builds still work without it                             |

`VITE_*` variables are the only ones Vite inlines into client code (`envPrefix`
in `vite.config.ts`). Keep the secret key out of anything prefixed `VITE_`.

## Running it locally

```bash
mise install          # optional: bun, biome, supabase CLI, sops
bun install

mise run decrypt      # sops → .env (or write .env by hand)

supabase start        # local Postgres + API + Studio (needs Docker)
mise run dbsetup      # supabase db push → applies supabase/migrations

bun run dev           # http://localhost:3000
```

To use a hosted project instead of the local stack, run `supabase link` once,
then `mise run dbsetup` to push the migrations to it.

## Database

Migrations are plain SQL in `supabase/migrations/`, applied in order:

| Migration                    | What it does                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------ |
| `0001_init.sql`              | `canvases` table, `updated_at` trigger, RLS policies                           |
| `0002_app_auth.sql`          | Drops Supabase Auth in favor of app-owned `app_users`; moves `user_id` to text |
| `0003_canvas_sharing.sql`    | `shared_with`, `canvas_shares`                                                 |
| `0004_version_history.sql`   | `canvas_versions`, public links (`is_public`)                                  |
| `0005_canvas_id_default.sql` | Restores `gen_random_uuid()` on `canvases.id`                                  |

```bash
supabase migration new <name>   # write a new migration
mise run dbsetup                # apply everything that is pending
```

## Scripts

| Command                   | What it does                        |
| ------------------------- | ----------------------------------- |
| `bun run dev`             | Dev server on port 3000 with HMR    |
| `bun run build`           | Production build                    |
| `bun run preview`         | Serve the production build          |
| `bun run start`           | Same as preview                     |
| `bun run generate-routes` | Regenerate the TanStack Router tree |

Lint and formatting are mise tasks — `package.json` has no `lint` script:

```bash
mise run lint
mise run format
```

## Deploying

`vite.config.ts` uses the Nitro Netlify preset, so `bun run build` produces a
Netlify function; any [Nitro target](https://nitro.build/deploy) works too. Set
every variable from the table above in your host, including the server-only
Supabase key, and run the migrations against your hosted project before the
first deploy.

Sentry is wired through `@sentry/tanstackstart-react` with source maps uploaded
at build time when `SENTRY_AUTH_TOKEN` is present.

## Project layout

```text
src/
├── routes/        File routes (/login, /view/$id, /docs, authenticated canvas)
├── services/      Canvas and library logic on top of oRPC
├── orpc/          Router, context, client
├── lib/           Session handling, Supabase clients, site config
├── components/    Excalidraw editor, sidebar, dialogs, share and history modals
├── stores/        Zustand state
├── docs/          Markdown published at /docs
└── utils/         Supabase clients, realtime channel wrapper
supabase/
├── config.toml    Local stack configuration
└── migrations/    SQL migrations
```

## Docs

The app ships its own guides at `/docs` — sources are in `src/docs/`:
getting started, libraries, sharing, privacy and security, and self-hosting.

`AGENTS.md` covers the Astryx design system conventions used by the UI.

## License

Apache License 2.0. See [LICENSE](LICENSE).