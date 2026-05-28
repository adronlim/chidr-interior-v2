# chidr-interior-v2

Website revamp for **CH iDesign & Renovation** (chidr.com.my) — a project showcase
site for an interior design studio, with a login-protected admin so the designer can
upload projects and images without touching code.

## At a glance

| Area | Choice |
| --- | --- |
| Frontend | Vite + React 18 + TypeScript + Tailwind CSS + React Router |
| Content / Auth / Media | **Sanity** (hosted headless CMS — Content Lake + Studio + Image CDN) |
| Backend services | None dedicated. One serverless function for the contact form (Resend) |
| Hosting | Netlify or Vercel (frontend), Sanity-hosted Studio at `chidr.sanity.studio` |
| CI/CD | GitHub Actions: lint + typecheck on PR, auto-deploy on push to `main` |

The designer logs in to **Sanity Studio** (Google/email auth) to add projects,
upload images, edit company info, and reply to contact-form inquiries. The public
site is a static SPA that reads from Sanity at runtime — no server to maintain.

## Repo layout

```
chidr-interior-v2/
├── apps/
│   ├── web/                 # Vite + React SPA (the public site)
│   └── studio/              # Sanity Studio (admin)
├── docs/
│   ├── GITHUB.md            # branching, commits, CI, secrets
│   ├── FRONTEND.md          # web app architecture + config
│   ├── BACKEND.md           # serverless function + integrations
│   ├── CMS.md               # Sanity schemas, roles, deploy
│   └── UI-MOCKUP.md         # design language + page wireframes
├── .github/
│   ├── workflows/           # ci.yml, deploy.yml
│   └── pull_request_template.md
└── README.md                # this file
```

> Monorepo via yarn 1 (classic) workspaces.

## Quickstart

```bash
# 1. install
yarn install

# 2. set up env (see docs/FRONTEND.md and docs/CMS.md for the full list)
cp apps/web/.env.example apps/web/.env.local
# cp apps/studio/.env.example apps/studio/.env   # once the studio app exists

# 3. dev — web runs on http://localhost:5173
yarn dev
yarn build      # tsc -b && vite build → apps/web/dist
yarn preview    # serve the production build locally
```

> Without a Sanity project ID in `.env.local`, the app runs against the bundled
> dummy data in `apps/web/src/lib/dummy-data.ts`. Add `VITE_SANITY_PROJECT_ID` to
> switch to live content — no code changes required; the hooks auto-detect it.

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — system diagram, trust boundaries, decision log, failure modes
- [docs/PROJECT-STRUCTURE.md](docs/PROJECT-STRUCTURE.md) — repo layout, file naming conventions, where to put new things
- [docs/DEVOPS.md](docs/DEVOPS.md) — environments, deploys, env var matrix, monitoring, runbook
- [docs/GITHUB.md](docs/GITHUB.md) — repo conventions, GitHub Actions, required secrets
- [docs/FRONTEND.md](docs/FRONTEND.md) — Vite/React config, routing, data fetching, styling
- [docs/BACKEND.md](docs/BACKEND.md) — why we don't run a server, plus the contact-form function
- [docs/CMS.md](docs/CMS.md) — Sanity schemas, Studio setup, designer login, content migration
- [docs/UI-MOCKUP.md](docs/UI-MOCKUP.md) — design language, color/type tokens, page wireframes

## Source content from the existing site

Seeded from chidr.com.my:

- **Company name:** CH iDesign & Renovation
- **Nav:** Home · Project · About · Contact
- **Projects (9):** Desa Pinang, QuayWest Residence, Queen Residence, The Marin,
  The Zen, Waterside Residence, Beacon Executive Suites, Imperial Grande,
  Jelutong Office

Anything not surfaced on the live site (phone, email, address, services list,
team bios) uses **dummy placeholder content** flagged with `// DUMMY` in code and
`> [DUMMY]` in CMS entries, so they're easy to find and replace.
