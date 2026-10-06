<p align="center">
  <img alt="drawy" src="https://shieldcn.dev/header/gradient.svg?title=drawy&amp;subtitle=Compose+beautiful+READMEs,+block+by+block&amp;mode=dark" />
</p>

<p align="center">
  <em>A fast, accessible README builder — edit blocks, drag to reorder, export clean Markdown.</em>
</p>

<p align="center">
  <a href="#features">Features</a> ·
  <a href="#quick-start">Quick start</a> ·
  <a href="#usage">Usage</a> ·
  <a href="#tech-stack">Tech stack</a> ·
  <a href="#project-structure">Project structure</a> ·
  <a href="#contributing">Contributing</a> ·
  <a href="#license">License</a>
</p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/github/pratyay360/drawy/stars.svg" />
    <img alt="GitHub Stars" src="https://shieldcn.dev/github/pratyay360/drawy/stars.svg?mode=light" />
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/github/pratyay360/drawy/forks.svg" />
    <img alt="GitHub Forks" src="https://shieldcn.dev/github/pratyay360/drawy/forks.svg?mode=light" />
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/github/last-commit/pratyay360/drawy.svg" />
    <img alt="Last commit" src="https://shieldcn.dev/github/last-commit/pratyay360/drawy.svg?mode=light" />
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/github/release/pratyay360/drawy.svg" />
    <img alt="Release" src="https://shieldcn.dev/github/release/pratyay360/drawy.svg?mode=light" />
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/github/ci/pratyay360/drawy.svg?variant=secondary" />
    <img alt="CI" src="https://shieldcn.dev/github/ci/pratyay360/drawy.svg?variant=secondary&amp;mode=light" />
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/github/license/pratyay360/drawy.svg?variant=ghost" />
    <img alt="License" src="https://shieldcn.dev/github/license/pratyay360/drawy.svg?variant=ghost&amp;mode=light" />
  </picture>
</p>

---

## Features

- 🧱 **Block-based editor** — every section of your README is a block you can edit, duplicate, or delete.
- 🖱️ **Drag to reorder** — rearrange your document in seconds, no cut-and-paste required.
- 📤 **Clean Markdown export** — get portable, lint-friendly Markdown with no vendor lock-in.
- 🎨 **Themeable** — ship a README that looks right in both light and dark mode.
- ⚡ **Fast** — instant previews powered by Vite and TanStack Query.
- ♿ **Accessible** — keyboard navigable, semantic markup, screen-reader friendly.

## Quick start

### Prerequisites

- [Bun](https://bun.sh) `>= 1.0` (or Node.js `>= 20` with `npm` / `pnpm`)
- A [Supabase](https://supabase.com) project for auth and persistence

### Installation

```bash
git clone https://github.com/pratyay360/drawy.git
cd drawy
bun install
```

### Environment

Create a `.env.local` file in the project root:

```dotenv
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Run locally

```bash
bun run dev
```

The app will be available at `http://localhost:5173`.

## Usage

1. **Pick a block** from the palette — headers, badges, lists, tables, code samples, and more.
2. **Edit inline** using the toolbar on the right. Changes preview instantly.
3. **Drag the list** to reorder blocks into the structure you want.
4. **Export** your finished README as Markdown and drop it straight into your repository.

> Tip: keep the source of truth in `README.md` and regenerate it from drawy whenever your project changes.

### Available scripts

| Command             | Description                               |
| ------------------- | ----------------------------------------- |
| `bun run dev`       | Start the dev server with HMR             |
| `bun run build`     | Type-check and build for production       |
| `bun run preview`   | Preview the production build locally      |
| `bun run lint`      | Lint and format with Biome                |
| `bun run typecheck` | Run the TypeScript compiler in check mode |
| `bun run test`      | Run the test suite                        |

## Tech stack

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/badge/Language-TypeScript-3178C6.svg?variant=branded&amp;logo=typescript" />
    <img alt="TypeScript" src="https://shieldcn.dev/badge/Language-TypeScript-3178C6.svg?variant=branded&amp;mode=light&amp;logo=typescript" />
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/badge/Stack-React-61DAFB.svg?variant=branded&amp;logo=react" />
    <img alt="React" src="https://shieldcn.dev/badge/Stack-React-61DAFB.svg?variant=branded&amp;mode=light&amp;logo=react" />
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/badge/Bundler-Vite-646CFF.svg?variant=branded&amp;logo=vite" />
    <img alt="Vite" src="https://shieldcn.dev/badge/Bundler-Vite-646CFF.svg?variant=branded&amp;mode=light&amp;logo=vite" />
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/badge/Stack-Tailwind_CSS-06B6D4.svg?variant=branded&amp;logo=tailwindcss" />
    <img alt="Tailwind CSS" src="https://shieldcn.dev/badge/Stack-Tailwind_CSS-06B6D4.svg?variant=branded&amp;mode=light&amp;logo=tailwindcss" />
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/badge/Stack-Zustand-FFB800.svg?variant=branded&amp;logo=zustand" />
    <img alt="Zustand" src="https://shieldcn.dev/badge/Stack-Zustand-FFB800.svg?variant=branded&amp;mode=light&amp;logo=zustand" />
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/badge/Stack-TanStack_Query-FF4154.svg?variant=branded&amp;logo=reactquery" />
    <img alt="TanStack Query" src="https://shieldcn.dev/badge/Stack-TanStack_Query-FF4154.svg?variant=branded&amp;mode=light&amp;logo=reactquery" />
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/badge/Stack-Supabase-3FCF8E.svg?variant=branded&amp;logo=supabase" />
    <img alt="Supabase" src="https://shieldcn.dev/badge/Stack-Supabase-3FCF8E.svg?variant=branded&amp;mode=light&amp;logo=supabase" />
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/badge/Stack-PostgreSQL-4169E1.svg?variant=branded&amp;logo=postgresql" />
    <img alt="PostgreSQL" src="https://shieldcn.dev/badge/Stack-PostgreSQL-4169E1.svg?variant=branded&amp;mode=light&amp;logo=postgresql" />
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/badge/Stack-Zod-3E67B1.svg?variant=branded&amp;logo=zod" />
    <img alt="Zod" src="https://shieldcn.dev/badge/Stack-Zod-3E67B1.svg?variant=branded&amp;mode=light&amp;logo=zod" />
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/badge/Lint-Biome-60A5FA.svg?variant=branded&amp;logo=biome" />
    <img alt="Biome" src="https://shieldcn.dev/badge/Lint-Biome-60A5FA.svg?variant=branded&amp;mode=light&amp;logo=biome" />
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/badge/Package_mgr-Bun-000000.svg?variant=branded&amp;logo=bun" />
    <img alt="Bun" src="https://shieldcn.dev/badge/Package_mgr-Bun-000000.svg?variant=branded&amp;mode=light&amp;logo=bun" />
  </picture>
</p>

**Frontend** · React + TypeScript, Vite, Tailwind CSS, Zustand, TanStack Query  
**Backend** · Supabase (Auth + Postgres), Zod for runtime validation  
**Tooling** · Biome (lint + format), ESM-only, Bun as the package manager

## Project structure

```text
drawy/
├── src/
│   ├── components/   # Blocks, toolbar, drag-and-drop list
│   ├── hooks/        # TanStack Query hooks and shared logic
│   ├── lib/          # Supabase client, schema, Markdown export
│   ├── stores/       # Zustand state stores
│   └── routes/       # App routes and layouts
├── public/
├── AGENTS.md         # Guidance for AI coding agents
└── README.md
```

## Contributing

Contributions are welcome. To get started:

1. Fork the repository and create a branch: `git checkout -b feat/my-feature`
2. Make your change and add tests where it makes sense.
3. Run the checks: `bun run lint && bun run typecheck && bun run test`
4. Commit using [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:` …).
5. Open a pull request with a clear description and a screenshot if the UI changed.

Please read `AGENTS.md` before submitting changes that touch architecture or shared state.

## License

Released under the MIT License. See [LICENSE](LICENSE) for details.

> This package is not published to npm — it is intended to be run locally or self-hosted.

---

<p align="center">
  <img alt="Star history" src="https://shieldcn.dev/chart/github/stars/pratyay360/drawy.svg" />
</p>

<details>
<summary><strong>All repository badges</strong></summary>
<br />

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/github/watchers/pratyay360/drawy.svg?variant=secondary" />
    <img alt="Watchers" src="https://shieldcn.dev/github/watchers/pratyay360/drawy.svg?variant=secondary&amp;mode=light" />
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/github/branches/pratyay360/drawy.svg?variant=ghost" />
    <img alt="Branches" src="https://shieldcn.dev/github/branches/pratyay360/drawy.svg?variant=ghost&amp;mode=light" />
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/github/contributors/pratyay360/drawy.svg?theme=emerald" />
    <img alt="Contributors" src="https://shieldcn.dev/github/contributors/pratyay360/drawy.svg?theme=emerald&amp;mode=light" />
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/github/commits/pratyay360/drawy.svg?variant=secondary" />
    <img alt="Commits" src="https://shieldcn.dev/github/commits/pratyay360/drawy.svg?variant=secondary&amp;mode=light" />
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/github/open-issues/pratyay360/drawy.svg?variant=secondary" />
    <img alt="Open issues" src="https://shieldcn.dev/github/open-issues/pratyay360/drawy.svg?variant=secondary&amp;mode=light" />
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/github/closed-issues/pratyay360/drawy.svg?variant=ghost" />
    <img alt="Closed issues" src="https://shieldcn.dev/github/closed-issues/pratyay360/drawy.svg?variant=ghost&amp;mode=light" />
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/github/open-prs/pratyay360/drawy.svg?variant=secondary" />
    <img alt="Open PRs" src="https://shieldcn.dev/github/open-prs/pratyay360/drawy.svg?variant=secondary&amp;mode=light" />
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/github/closed-prs/pratyay360/drawy.svg?variant=ghost" />
    <img alt="Closed PRs" src="https://shieldcn.dev/github/closed-prs/pratyay360/drawy.svg?variant=ghost&amp;mode=light" />
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/github/merged-prs/pratyay360/drawy.svg?variant=ghost" />
    <img alt="Merged PRs" src="https://shieldcn.dev/github/merged-prs/pratyay360/drawy.svg?variant=ghost&amp;mode=light" />
  </picture>
</p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/badge/Private-package-red.svg?variant=secondary" />
    <img alt="Private package" src="https://shieldcn.dev/badge/Private-package-red.svg?variant=secondary&amp;mode=light" />
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/badge/ESM-only-16a34a.svg?variant=secondary" />
    <img alt="ESM only" src="https://shieldcn.dev/badge/ESM-only-16a34a.svg?variant=secondary&amp;mode=light" />
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/badge/Agent--friendly-AGENTS.md-D97757.svg?variant=secondary" />
    <img alt="Agent-friendly AGENTS.md" src="https://shieldcn.dev/badge/Agent--friendly-AGENTS.md-D97757.svg?variant=secondary&amp;mode=light" />
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/badge/Sponsor-GitHub-ea4aaa.svg?variant=secondary&amp;logo=githubsponsors" />
    <img alt="GitHub Sponsors" src="https://shieldcn.dev/badge/Sponsor-GitHub-ea4aaa.svg?variant=secondary&amp;mode=light&amp;logo=githubsponsors" />
  </picture>
</p>

</details>
