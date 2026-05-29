# CLAUDE.md

CH iDesign & Renovation website revamp. Yarn 1 workspaces. Vite + React SPA at
`apps/web/`, Sanity Studio at `apps/studio/`. One Netlify Function planned for
the contact form. No other backend.

## Stack at a glance

| Layer | Choice |
| --- | --- |
| Web | Vite 5, React 18, TS strict, Tailwind 3, React Router 6 (data router), TanStack Query, react-hook-form + zod, @sanity/client |
| Studio | Sanity v3.70, structureTool + visionTool, 6 schemas |
| Hosting | Netlify (web + function), Sanity Cloud (Studio) |

## Commands

```bash
yarn install
yarn dev              # web → http://localhost:5173
yarn studio:dev       # studio → http://localhost:3333
yarn build            # tsc -b && vite build → apps/web/dist
yarn studio:build     # bundle studio
yarn studio:seed      # creates 9 projects + 3 categories + company/hero singletons
yarn typecheck
yarn docs:pdf         # → docs/dist/chidr-interior-v2-docs.pdf
yarn log:config       # preview which staged files would log to CONFIG-LOG.md
```

## Automation

- `yarn install` sets `core.hooksPath=.githooks`. Pre-commit hook
  (`.githooks/pre-commit`) auto-appends a row to `docs/CONFIG-LOG.md` whenever
  a commit touches workspace/build/CI/hosting config files. Bypass with
  `git commit --no-verify` if needed.

## Repo layout

```
apps/web/src/{routes,components,hooks,lib,styles}/
apps/studio/{schemas,scripts}/
docs/*.md                       # see docs/README.md for the doc map
scripts/build-docs-pdf.mjs
```

## Conventions

- **Filenames:** kebab-case (`project-card.tsx`, `use-projects.ts`). **Exports:** PascalCase components, `useFoo` hooks.
- **Imports:** `@/` alias for src; no barrel files.
- **Env vars:** `VITE_*` are public (in bundle). Anything secret lives function-side only.
- **Data layer auto-branches:** hooks read from Sanity if `VITE_SANITY_PROJECT_ID` is set; otherwise from `apps/web/src/lib/dummy-data.ts`. No code change to flip.
- **Singletons** (`company`, `hero`) enforced via `apps/studio/deskStructure.ts`.
- **Docs naming:** UPPER-CASE for markdown (README, ARCHITECTURE, etc.); kebab-case is for source.

## Sanity state (today)

Frontend currently runs against bundled dummy data — 9 real chidr.com.my
project titles + placeholder.co images. Sanity provisioning is in progress
(see `docs/PHASES.md` Phase 5; checklist in root `README.md`).

## Where to read for X

| Topic | Doc |
| --- | --- |
| System architecture, decisions, failure modes | `docs/ARCHITECTURE.md` |
| Repo layout, naming, "where to put new things" | `docs/PROJECT-STRUCTURE.md` |
| Frontend impl detail (Vite/React/Tailwind/data) | `docs/FRONTEND.md` |
| Contact function spec, no-server rationale | `docs/BACKEND.md` |
| Sanity schemas, Studio setup, provisioning | `docs/CMS.md` |
| Environments, deploys, env vars, runbook | `docs/DEVOPS.md` |
| Branching, PR template, CI workflows, secrets | `docs/GITHUB.md` |
| Design tokens, page wireframes | `docs/UI-MOCKUP.md` |
| Milestone log (append-only) | `docs/PHASES.md` |

## Hard rules

- `yarn build` must stay green (tsc + vite). Never bypass typecheck.
- `docs/PHASES.md` is append-only. Don't edit past entries except to fix factual errors.
- `apps/studio/.env`, `apps/web/.env.local` hold credentials — never commit.
- `docs/dist/` and `dist/` are generated, gitignored — don't hand-edit.
- Real photos arrive via Sanity Studio uploads, not via committed assets.
- When adding a new data type, update **all four**: `src/lib/types.ts`, `src/lib/dummy-data.ts`, `src/lib/queries.ts`, `src/hooks/use-foo.ts`.
- **Never put concrete Sanity project IDs, user IDs, tokens, or other deployment-specific identifiers in committed markdown.** They live only in `.env` files (gitignored). Refer to them generically — e.g. "the CHIDR project", "the value stored in `apps/studio/.env`".
