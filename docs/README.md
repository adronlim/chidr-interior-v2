# Documentation

The markdown specs and journal for chidr-interior-v2. All docs live flat under
this directory — group them by purpose mentally, not by folder.

## Where to start

- **Claude Code session?** → `CLAUDE.md` at the repo root is auto-loaded and summarizes everything below
- **New to the project?** → [ARCHITECTURE.md](ARCHITECTURE.md) for the system view, then [PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md) for the repo layout
- **Tracking what's done and what's next?** → [PHASES.md](PHASES.md)
- **Building the SPA?** → [FRONTEND.md](FRONTEND.md)
- **Building / running the Studio?** → [CMS.md](CMS.md)
- **Deploying?** → [DEVOPS.md](DEVOPS.md), then [GITHUB.md](GITHUB.md)
- **Designing?** → [UI-MOCKUP.md](UI-MOCKUP.md)

## All docs by topic

### Overview
| File | Topic |
| --- | --- |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System diagram, trust boundaries, decision log, failure modes |
| [PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md) | Repo tree, file naming conventions, "where to put new things" |
| [STANDARDS.md](STANDARDS.md) | Code-level conventions: validation patterns, hooks ordering, perf budget, commit format |
| [PHASES.md](PHASES.md) | Append-only log of every milestone |

### Implementation
| File | Topic |
| --- | --- |
| [FRONTEND.md](FRONTEND.md) | `apps/web` — Vite/React/TS/Tailwind config, routing, data fetching, styling |
| [BACKEND.md](BACKEND.md) | No-server rationale + the `/contact` serverless function spec, backups |
| [CMS.md](CMS.md) | `apps/studio` — Sanity schemas, Studio setup, designer login, content migration |

### Operations
| File | Topic |
| --- | --- |
| [DEVOPS.md](DEVOPS.md) | Environments, deploys, env var matrix, monitoring, cost, runbook |
| [GITHUB.md](GITHUB.md) | Branch model, PR template, CI workflows, required secrets |

### Design
| File | Topic |
| --- | --- |
| [UI-MOCKUP.md](UI-MOCKUP.md) | Design language, color/type/spacing tokens, page wireframes |
| [DESIGN-REVAMP.md](DESIGN-REVAMP.md) | Inner-inspired revamp: palette mapping, in-house motion system, per-page composition |

## Generated PDF

`yarn docs:pdf` at the repo root produces a single styled PDF combining every
doc above (in the order: README → Architecture → Project Structure → DevOps →
GitHub → Frontend → Backend → CMS → UI Mockup → Phases).

- **Output:** [`docs/dist/chidr-interior-v2-docs.pdf`](dist/chidr-interior-v2-docs.pdf) (gitignored — regenerate any time)
- **Intermediate HTML:** [`docs/dist/docs.html`](dist/docs.html) — handy for previewing styling without re-running Chrome

## Conventions

- **Filenames:** UPPER-CASE for docs (matches root `README.md` / `LICENSE.md`
  convention); kebab-case is for source files — see [PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md)
- **Cross-links** between docs use relative paths (e.g. `[BACKEND.md](BACKEND.md)`)
- **Update [PHASES.md](PHASES.md)** when a phase wraps; don't edit past entries
- **One topic per doc** — split a doc when it sprouts a second concern, don't
  let it grow into "everything I know about X"
