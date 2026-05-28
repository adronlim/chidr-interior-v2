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
├── docs/                    # 8 markdown specs — see Documentation below
├── scripts/
│   └── build-docs-pdf.mjs   # yarn docs:pdf → dist/chidr-interior-v2-docs.pdf
└── package.json             # yarn workspace root
```

> Monorepo via yarn 1 (classic) workspaces.

## Quickstart

```bash
# 1. install
yarn install

# 2. set up env (see docs/CMS.md → Provisioning for the full walkthrough)
cp apps/web/.env.example apps/web/.env.local
cp apps/studio/.env.example apps/studio/.env

# 3. dev — web on :5173, studio on :3333
yarn dev            # web
yarn studio:dev     # studio (in a second terminal)

# build / preview
yarn build          # tsc -b && vite build → apps/web/dist
yarn preview        # serve the web production build locally
yarn studio:build   # bundle the studio
```

> Without `VITE_SANITY_PROJECT_ID` in `.env.local`, the web app falls through to
> bundled dummy data (`apps/web/src/lib/dummy-data.ts`) so you can run it locally
> with zero external setup. Add the ID and the hooks switch to live Sanity
> content — no code change required.

## First-time Sanity provisioning

1. **Create the project.** Sign in at [sanity.io](https://www.sanity.io/) and
   create a new project named "CHIDR Interior" with dataset `production`.
2. **Copy the project ID** from the dashboard (Settings → API → Project ID) and
   paste it into both `apps/web/.env.local` (as `VITE_SANITY_PROJECT_ID`) and
   `apps/studio/.env` (as `SANITY_STUDIO_PROJECT_ID`).
3. **Add CORS origins** at sanity.io → API → CORS Origins:
   `http://localhost:5173` (web dev), `http://localhost:3333` (studio dev).
4. **Generate a write token** at sanity.io → API → Tokens — Editor scope. Paste
   it into `apps/studio/.env` as `SANITY_AUTH_TOKEN`. Used only by the seed script.
5. **Seed content.** `yarn studio:seed` creates the 9 known projects + the
   company and hero singletons + the 3 categories — all without images.
6. **Open Studio.** `yarn studio:dev` → http://localhost:3333. Log in with Google
   or email magic link. Upload `coverImage` + `gallery` for each project, replace
   the DUMMY contact info, and you're done.
7. **Restart the web app.** `yarn dev` — it'll detect the env var and read from
   Sanity automatically.

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — system diagram, trust boundaries, decision log, failure modes
- [docs/PROJECT-STRUCTURE.md](docs/PROJECT-STRUCTURE.md) — repo layout, file naming conventions, where to put new things
- [docs/DEVOPS.md](docs/DEVOPS.md) — environments, deploys, env var matrix, monitoring, runbook
- [docs/GITHUB.md](docs/GITHUB.md) — repo conventions, GitHub Actions, required secrets
- [docs/FRONTEND.md](docs/FRONTEND.md) — Vite/React config, routing, data fetching, styling
- [docs/BACKEND.md](docs/BACKEND.md) — why we don't run a server, plus the contact-form function
- [docs/CMS.md](docs/CMS.md) — Sanity schemas, Studio setup, designer login, content migration
- [docs/UI-MOCKUP.md](docs/UI-MOCKUP.md) — design language, color/type tokens, page wireframes
- [docs/PHASES.md](docs/PHASES.md) — running log of every milestone: objective, what landed, verification, what's open

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
