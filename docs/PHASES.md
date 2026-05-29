# Project phases

A running log of the project's milestones — what each phase set out to do,
what landed, how it was verified, and what was left open. Each completed phase
has a git commit; in-progress and planned phases show what's next.

> Append a new section when wrapping a phase. Do not edit past entries except
> to fix factual errors — the value of this doc is in the audit trail.

| # | Phase | Status | Commit |
| --- | --- | --- | --- |
| 1 | Specs & architecture | ✅ Done | `ebe0de0` |
| 2 | Frontend scaffold | ✅ Done | `79e865b` |
| 3 | Docs PDF tooling | ✅ Done | `0872b0a` |
| 4 | Sanity Studio scaffold | ✅ Done | `645c7be` |
| 5 | Sanity provisioning & content | 🟡 In progress | — |
| 6 | Production-readiness pass | ⏳ Planned | — |
| 7 | Launch | ⏳ Planned | — |

Status badges: ✅ Done · 🟡 In progress · ⏳ Planned · ⛔ Blocked

---

## Phase 1 — Specs & architecture

**Status:** ✅ Done · **Commit:** `ebe0de0` · **Date:** 2026-05-28

### Objective
Take the brief from a fresh empty repo to a documented architecture: stack
decided, schemas sketched, wireframes drafted, and enough written down that
implementation can begin without re-deciding any of it.

### Brief intake
- Existing site: chidr.com.my — **CH iDesign & Renovation**, an interior
  design studio in Penang
- Reference: ThemeForest "Inner – Interior Design & Architecture Template Kit"
- Requirements: project showcase + login-protected admin so the designer can
  upload projects + images without touching code; company name / logo / contact
- Dummy data permitted where real content isn't on the live site

### Stack decisions
| Layer | Choice | Reason |
| --- | --- | --- |
| Frontend | Vite + React 18 + TypeScript + Tailwind CSS | Per operator preference; small site, SEO modest |
| CMS / auth / images | Sanity (hosted) | Hosted Studio + login + image transforms; no server to maintain |
| Backend | One Netlify Function for the contact form | Only one writeable surface; full server not warranted |
| Hosting | Netlify (web + function), Sanity Cloud (Studio) | Free tier, integrated functions, easy domain |
| Package manager | Yarn 1 classic workspaces | Per operator preference |

### What landed
| File | Purpose |
| --- | --- |
| `README.md` | Stack overview, repo layout, quickstart, doc index |
| `docs/ARCHITECTURE.md` | System diagram, trust boundaries, decision log, failure modes |
| `docs/PROJECT-STRUCTURE.md` | Repo tree, naming conventions, "where to put new things" |
| `docs/DEVOPS.md` | Environments, deploys, env var matrix, monitoring, runbook |
| `docs/GITHUB.md` | Branch model, PR template, CI workflows, secrets |
| `docs/FRONTEND.md` | Vite/React/TS/Tailwind config, routing, data fetching |
| `docs/BACKEND.md` | No-server rationale, contact-function spec, backups |
| `docs/CMS.md` | Sanity schemas, Studio setup, designer login, seed plan |
| `docs/UI-MOCKUP.md` | Design language, color/type tokens, page wireframes |

### Source content captured from chidr.com.my
- Company name: **CH iDesign & Renovation**
- Nav: Home · Project · About · Contact
- 9 project titles: Desa Pinang, QuayWest Residence, Queen Residence, The
  Marin, The Zen, Waterside Residence, Beacon Executive Suites, Imperial
  Grande, Jelutong Office
- Contact info, services list, team bios — not on the public site, flagged
  DUMMY for the designer to fill in

### Decisions / tradeoffs
- **SPA over Next.js** — small site, SEO needs modest. Revisit if organic
  search becomes the primary acquisition channel.
- **Sanity over Payload/Strapi** — hosted Studio + image CDN outweighs the
  lock-in. Revisit if multi-tenancy or fine-grained ACLs become a need.
- **No bespoke backend** — Sanity covers content; one function handles the
  one writeable surface. Revisit if public sign-up or transactions arrive.

---

## Phase 2 — Frontend scaffold

**Status:** ✅ Done · **Commit:** `79e865b`

### Objective
Stand up the public SPA — all 5 pages working — against bundled dummy data,
architected so that the eventual flip to live Sanity content is a single
env-var change.

### What landed

**Workspace:** [apps/web/](../apps/web/), yarn workspace `web`.

**Tooling:** Vite 5, React 18, TypeScript 5 (strict), Tailwind 3, React Router
6, TanStack Query, react-hook-form + zod, `@sanity/client`, lucide-react.

**Pages (all 5 + 404):**
| Route | What it does |
| --- | --- |
| `/` | Hero (split text/image), featured projects grid, services strip, testimonial, CTA |
| `/projects` | Filter chips backed by URL state, masonry grid |
| `/projects/:slug` | Full-bleed hero, meta sidebar, lightbox gallery, related projects |
| `/about` | Split hero, three principles, team grid |
| `/contact` | zod-validated form, contact blocks, Google Maps iframe |
| `*` | 404 with back-home CTA |

**Components:** Nav (sticky + mobile drawer), Footer, ProjectCard (hover →
image desaturate + brass underline), ProjectGrid (masonry + grid variants),
FilterChips, Gallery (lightbox + keyboard nav), MetaList, ContactForm,
SectionTitle.

**Data layer:**
- [src/lib/dummy-data.ts](../apps/web/src/lib/dummy-data.ts) — seeded with the 9 real projects + categories + company + hero + team
- [src/lib/sanity.ts](../apps/web/src/lib/sanity.ts) — client only constructs when `VITE_SANITY_PROJECT_ID` is set
- [src/lib/queries.ts](../apps/web/src/lib/queries.ts) — every GROQ query the app will need
- Hooks in [src/hooks/](../apps/web/src/hooks/) auto-branch: live Sanity if env is set, dummy otherwise

**Styling:** [tokens.css](../apps/web/src/styles/tokens.css) + [globals.css](../apps/web/src/styles/globals.css) — bone/ink/ash/brass palette, Cormorant Garamond + Inter, `@layer components` for shared classes, `prefers-reduced-motion` honored globally.

### Verification
- `yarn typecheck` — 0 errors
- `yarn build` — exit 0, **138 KB gzipped initial JS** (budget: 180 KB)
- `yarn dev` — boots in ~208 ms; HTTP 200 on `/`
- **Not verified:** visual correctness in a real browser (no GUI in scaffold env)

### Decisions / tradeoffs
- **Tailwind 3, not 4** — stable, widest plugin ecosystem; revisit when a plugin we need only ships for v4
- **React 18, not 19** — conservative; some sub-deps still lag React 19 peer
- **No `framer-motion` initially** — keeps bundle small; the UI-MOCKUP spec calls for it but CSS transitions cover hover effects today
- **Placeholder.co images** — honest placeholders. The designer's first Studio session is "upload real photos"

### Open items
- Real images (Phase 5)
- Per-route SEO meta (Phase 6)
- Loading skeletons + ErrorBoundary (Phase 6)
- Image `srcset`/`sizes` via Sanity (Phase 5/6)

---

## Phase 3 — Docs PDF tooling

**Status:** ✅ Done · **Commit:** `0872b0a`

### Objective
Make the markdown deliverable shareable as a single styled PDF — without
adding any runtime dependency on the SPA bundle.

### What landed
- [scripts/build-docs-pdf.mjs](../scripts/build-docs-pdf.mjs) — converts each markdown with `marked`, assembles cover + TOC + sections, prints with headless Chrome (autodetected from `/Applications/Google Chrome.app`, falls back to Chromium and Edge)
- `yarn docs:pdf` script at the workspace root
- `marked` as a workspace devDep (does not ship in the SPA)
- Output: `docs/dist/chidr-interior-v2-docs.pdf` — ~1.5 MB, A4, 18 mm margins, brand-aligned styling (bone background tones, serif cover)

### Verification
- Output PDF starts with `%PDF-1.4` magic bytes
- Generation time ~13 s (most of that is Chrome boot)
- `dist/` is gitignored — PDF is a generated artifact, not committed

---

## Phase 4 — Sanity Studio scaffold

**Status:** ✅ Done · **Commit:** `645c7be`

### Objective
Hand-scaffold the Sanity Studio so schemas, desk structure, and seed data
live in this repo — not whatever `sanity init` would generate.

### What landed
**Workspace:** [apps/studio/](../apps/studio/), yarn workspace `studio`,
Sanity v3.70.

**Config:**
- [sanity.config.ts](../apps/studio/sanity.config.ts) — registers `structureTool` + `visionTool`; env-driven `projectId`
- [sanity.cli.ts](../apps/studio/sanity.cli.ts) — CLI auth config
- [deskStructure.ts](../apps/studio/deskStructure.ts) — Company + Hero pinned as singletons; Projects / Categories / Team grouped; Inquiries in their own section

**Schemas** (all via `defineType`/`defineField`, fully typed):
| Schema | Notes |
| --- | --- |
| [`company`](../apps/studio/schemas/company.ts) | Singleton — name, tagline, logo, address, contact, socials, services |
| [`hero`](../apps/studio/schemas/hero.ts) | Singleton — homepage heading, subheading, image, CTA |
| [`project`](../apps/studio/schemas/project.ts) | Title, slug, category ref, year, location, areaSqft, featured, cover + gallery (hotspot), portable-text description, order |
| [`projectCategory`](../apps/studio/schemas/projectCategory.ts) | Title, slug, description |
| [`teamMember`](../apps/studio/schemas/teamMember.ts) | Name, role, photo, bio, order |
| [`inquiry`](../apps/studio/schemas/inquiry.ts) | All form fields `readOnly`; only `status` + `notes` editable — written by the future `/contact` function |

**Seed script:** [scripts/seed.ts](../apps/studio/scripts/seed.ts) — `yarn studio:seed` creates the 9 known projects + 3 categories + company + hero singletons. Images are uploaded manually in Studio.

**Root yarn scripts added:** `studio:dev`, `studio:build`, `studio:deploy`, `studio:seed`.

**Docs touched:**
- `README.md` — Quickstart now covers both web + studio; added "First-time Sanity provisioning" 7-step checklist
- `docs/CMS.md` — Studio Setup section rewritten to reflect the real scaffold (was a spec); seed/deploy commands swapped to the registered yarn scripts

### Verification
- `npx tsc --noEmit` — 0 errors
- `sanity build` with a placeholder `SANITY_STUDIO_PROJECT_ID` — exit 0, bundle compiles end-to-end
- **Not verified:** actual Studio dev server (requires real project ID)

### Decisions / tradeoffs
- **Hand-scaffolded, not via `sanity init` template** — schemas live with the repo from day one rather than being inserted by the CLI
- **Inquiry as a stored doc, not "send email and forget"** — designer has a UI-visible record + status workflow; spam comes with this choice

---

## Phase 5 — Sanity provisioning & content

**Status:** 🟡 In progress

### Objective
Connect the scaffolded code to a real Sanity project, populate it, upload real
photos, and flip the web app from dummy data to live content.

### Steps

| # | Step | Owner | Done? |
| --- | --- | --- | --- |
| 1 | Create Sanity project (`CHIDR Interior`, dataset `production`, visibility `public`) | User | ✓ (project id stored in `apps/studio/.env`) |
| 2 | Copy project ID into `apps/studio/.env` (`SANITY_STUDIO_PROJECT_ID`) | User | ✓ |
| 3 | Copy project ID into `apps/web/.env.local` (`VITE_SANITY_PROJECT_ID`) | User | ✓ (file created with project id + dataset + API version + contact endpoint) |
| 4 | Add CORS origins for `http://localhost:5173` and `http://localhost:3333` | User | ☐ (not yet verified) |
| 5 | Generate Editor-scoped token at sanity.io → API → Tokens → paste into `SANITY_AUTH_TOKEN` | User | ⛔ blocked — see Seed run log below |
| 6 | `yarn studio:seed` — creates 9 projects + 3 categories + company + hero | User | ⛔ blocked on step 5 |
| 7 | `yarn studio:dev` — log in, upload `coverImage` + `gallery` for each project | Designer | ☐ |
| 8 | Replace DUMMY company contact info + team in Studio | Designer | ☐ |
| 9 | Restart `yarn dev` — hooks detect the env var and pull from Sanity | User | ☐ |

### Seed run log

| When | Event | Outcome |
| --- | --- | --- |
| 2026-05-29 | First `yarn studio:seed` run | **401 Unauthorized** — `projectUserNotFoundError`. The token's owner is not a member of the CHIDR project. |
| 2026-05-29 | Diagnostic: list projects accessible by the token | HTTP 200 + empty array — the token is valid but its owner has **zero project memberships**. The token was generated by a different sanity.io account than the one that owns CHIDR Interior. |
| 2026-05-29 | Env file cleanup | Removed misplaced `VITE_SANITY_PROJECT_ID=<token-shaped value>` from `apps/studio/.env`; created `apps/web/.env.local` with the correct `VITE_*` vars sourced from `apps/studio/.env`. |
| 2026-05-29 | Seed script rewrite | [`apps/studio/scripts/seed.ts`](../apps/studio/scripts/seed.ts) gained a pre-flight check that lists the projects the token can access and fails fast with the recovery steps inline if the target project isn't reachable — replaces the previous 80-line HTTP-response dump. Adds `--dry-run` (preview without writing) and `--verbose` (log every doc) flags. Output is color-coded (✓/✗/⚠) and ends with the next-step prompt on success. All writes still go through `createOrReplace`, so re-runs are idempotent. |

### Recovery path (pending)

1. Sign in to sanity.io with the account that owns CHIDR Interior (the one where the project is visible at sanity.io/manage)
2. **Inside that project** → API → Tokens → Add API token → Editor permissions
3. Replace `SANITY_AUTH_TOKEN` in `apps/studio/.env` with the new value
4. Revoke the old token at sanity.io (it's now leaked into shell history)
5. Re-run `yarn studio:seed`

### Blockers
- Sanity account creation + token generation require the user's credentials — cannot be automated
- Active blocker: token from wrong account; see Seed run log above

### What this unblocks for later phases
- Phase 6 SEO meta needs real project titles + descriptions
- Phase 6 image strategy needs Sanity asset URLs
- Phase 6 Lighthouse can't measure against placeholder images
- Phase 7 Studio deploy to `chidr.sanity.studio` (`yarn studio:deploy`)

---

## Phase 6 — Production-readiness pass

**Status:** ⏳ Planned

### Objective
Bring the site from "demo-ready" to "real visitors won't notice gaps".

### Workstreams (rough priority)

**Blockers for any production traffic**
- `/contact` Netlify Function — Currently the form posts to an endpoint that doesn't exist and shows an error. Build per [docs/BACKEND.md](BACKEND.md) (zod validation, Sanity inquiry create, Resend email). Verify with an end-to-end test inquiry.
- Per-route SEO meta — Install `react-helmet-async` (or a small effect-based shim) and set `<title>` + `<meta description>` per route.
- Real images via Sanity — Replace placeholder.co URLs with `urlFor()` + `srcset`/`sizes` in `project-card.tsx`, `gallery.tsx`, and the hero.

**Quality bar before public launch**
- Open Graph + Twitter cards (drives WhatsApp/Instagram previews)
- `sitemap.xml` + `robots.txt` — generate at build time from the Sanity project list
- Favicon set + `manifest.webmanifest` — add 180px apple-touch-icon and a manifest
- Loading skeletons — replace "Loading…" text on Projects, ProjectDetail, Home
- Top-level `<ErrorBoundary>` — currently a runtime error in any component white-screens the site
- Accessibility pass — skip-to-content link, focus trap on Gallery lightbox + mobile menu, ARIA labels on icon buttons, contrast check on `text-ash`
- Lighthouse audit — measure LCP / CLS / TBT on the three key routes; remediate
- CI workflows committed — `.github/workflows/ci.yml` exists in docs but not on disk

**Polish (defer if needed)**
- Page transitions / image reveals (`framer-motion` or CSS only)
- Form upgrades — honeypot field, loading spinner, brand-tinted success state
- 301 redirects in `netlify.toml` from old chidr.com.my URLs
- Tests — Vitest for `ContactForm` validation + `useProjects` filtering; Playwright happy-path for navigation
- Analytics — Plausible after deciding what to track

### Open question
Whether to ship without `framer-motion` page transitions (the UI-MOCKUP spec
called for them; we skipped them in Phase 2 for bundle size). Designer review
once real photos are in.

---

## Phase 7 — Launch

**Status:** ⏳ Planned

### Objective
Ship to www.chidr.com.my.

### Pre-launch checklist (from [DEVOPS.md](DEVOPS.md))
- [ ] Custom domain pointed and HTTPS live (Netlify-issued Let's Encrypt)
- [ ] All env vars set in Netlify (web context + function context); verified via a test deploy
- [ ] `SANITY_WRITE_TOKEN` scoped to `inquiry` writes only
- [ ] Test inquiry sends end-to-end (form → function → Sanity → Resend → inbox)
- [ ] Real project photos uploaded for the 9 seeded projects
- [ ] Real company contact info entered in Studio (replaces every DUMMY)
- [ ] Lighthouse on homepage: Performance ≥ 90, Accessibility ≥ 95
- [ ] Google Search Console verified, sitemap submitted
- [ ] 301 redirects in `netlify.toml` for any indexed old URLs
- [ ] Sanity Studio: designer invited and successfully logged in
- [ ] Daily Sanity backup workflow ran at least once and the artifact is downloadable
- [ ] CORS origins on Sanity include only `localhost`, staging, prod
- [ ] Final responsive QA at 375 / 768 / 1440

### Rollback plan
- **Web** — Netlify Dashboard → Deploys → previous green → "Publish deploy"
- **Studio** — `git revert <bad-commit>` → push to `main` → GHA redeploys
- **Content** — `npx sanity dataset import backup.tar.gz production --replace`

---

## Conventions for this doc

- **Append-only**: wrap a phase by adding its section; never silently rewrite past entries
- **Each entry answers four questions**: objective, what landed, verification, what's open
- **Tables for "what landed"** — easier to scan than prose
- **Link to commits and files** by short hash / relative path
- **Status badges**: ✅ Done · 🟡 In progress · ⏳ Planned · ⛔ Blocked
- **Cross-link** to canonical specs (`docs/*.md`) instead of duplicating their content here — this log records *that* a decision was made, the linked doc records *what* the decision is
