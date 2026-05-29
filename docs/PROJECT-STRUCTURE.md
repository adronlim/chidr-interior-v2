# Project structure

How the repo is laid out and the conventions for adding things to it.

## Repo tree (current)

```
chidr-interior-v2/
├── apps/
│   └── web/                          # Vite + React SPA
│       ├── public/
│       │   └── favicon.svg
│       ├── src/
│       │   ├── main.tsx              # entry: Router + QueryClient
│       │   ├── App.tsx               # layout shell (Nav + Outlet + Footer)
│       │   ├── vite-env.d.ts         # env var types
│       │   ├── routes/               # one file per page
│       │   │   ├── home.tsx
│       │   │   ├── projects.tsx
│       │   │   ├── project-detail.tsx
│       │   │   ├── about.tsx
│       │   │   ├── contact.tsx
│       │   │   └── not-found.tsx
│       │   ├── components/           # reusable UI
│       │   │   ├── nav.tsx
│       │   │   ├── footer.tsx
│       │   │   ├── section-title.tsx
│       │   │   ├── project-card.tsx
│       │   │   ├── project-grid.tsx
│       │   │   ├── filter-chips.tsx
│       │   │   ├── gallery.tsx
│       │   │   ├── meta-list.tsx
│       │   │   └── contact-form.tsx
│       │   ├── hooks/                # one use-X.ts per data type
│       │   │   ├── use-projects.ts
│       │   │   ├── use-project.ts
│       │   │   ├── use-company.ts
│       │   │   ├── use-hero.ts
│       │   │   ├── use-categories.ts
│       │   │   └── use-team.ts
│       │   ├── lib/                  # non-React utilities
│       │   │   ├── sanity.ts         # Sanity client (null until env is set)
│       │   │   ├── queries.ts        # GROQ queries (constants)
│       │   │   ├── types.ts          # shared interfaces
│       │   │   └── dummy-data.ts     # seeded fallback content
│       │   └── styles/
│       │       ├── tokens.css        # CSS variables
│       │       └── globals.css       # Tailwind + base + components
│       ├── index.html
│       ├── vite.config.ts
│       ├── tailwind.config.ts
│       ├── postcss.config.js
│       ├── tsconfig.json             # references the two below
│       ├── tsconfig.app.json         # app code config
│       ├── tsconfig.node.json        # vite.config.ts + node-only files
│       ├── .env.example
│       ├── .gitignore
│       └── package.json
│   └── studio/                       # Sanity Studio (admin)
│       ├── sanity.config.ts          # plugins + schema registry
│       ├── sanity.cli.ts             # CLI auth config
│       ├── deskStructure.ts          # singletons + grouped lists
│       ├── schemas/
│       │   ├── index.ts
│       │   ├── company.ts            # singleton
│       │   ├── hero.ts               # singleton
│       │   ├── project.ts
│       │   ├── projectCategory.ts
│       │   ├── teamMember.ts
│       │   └── inquiry.ts            # read-only, written by /contact
│       ├── scripts/
│       │   └── seed.ts               # `yarn studio:seed`
│       ├── tsconfig.json
│       ├── .env.example
│       ├── .gitignore
│       └── package.json
├── docs/                             # documentation (this folder)
│   ├── README.md                     # landing / TOC
│   ├── ARCHITECTURE.md
│   ├── BACKEND.md
│   ├── CMS.md
│   ├── DEVOPS.md
│   ├── FRONTEND.md
│   ├── GITHUB.md
│   ├── PHASES.md                     # append-only milestone log
│   ├── PROJECT-STRUCTURE.md
│   ├── UI-MOCKUP.md
│   └── dist/                         # gitignored: `yarn docs:pdf` output
│       ├── chidr-interior-v2-docs.pdf
│       └── docs.html                 # intermediate, kept for debugging
├── scripts/
│   ├── build-docs-pdf.mjs            # combines docs into one styled PDF
│   └── log-config-changes.mjs        # pre-commit hook target — appends to CONFIG-LOG.md
├── .githooks/
│   └── pre-commit                    # invokes log-config-changes.mjs --commit
├── CLAUDE.md                         # Claude-loaded project summary (~2 KB)
├── .gitignore
├── .nvmrc                            # Node 20
├── package.json                      # workspace root
├── yarn.lock
└── README.md
```

Planned, not yet present: `.github/` (workflows, PR template, CODEOWNERS).

## Workspaces

Yarn 1 classic workspaces. Root `package.json` declares:

```json
{ "private": true, "workspaces": ["apps/*"] }
```

The root provides convenience scripts that proxy to the web workspace
(`yarn dev`, `yarn build`, etc.). When `apps/studio/` is added, it will be
picked up automatically.

## File naming conventions

| Kind | Pattern | Example |
| --- | --- | --- |
| Source files | `kebab-case.ext` | `project-card.tsx` |
| Default-exported component | PascalCase function in a kebab-case file | `export default function ProjectCard()` in `project-card.tsx` |
| Hooks | `use-foo.ts`, exporting `useFoo` | `use-projects.ts` → `useProjects` |
| Interfaces / types | `PascalCase` | `interface ProjectCategory` |
| GROQ constants | `UPPER_SNAKE` | `PROJECT_DETAIL_QUERY` |
| CSS utility classes | Tailwind-first; custom classes lowercase, in `@layer components` | `.container-page`, `.image-hover` |
| Env vars | `SCREAMING_SNAKE`; public ones prefixed `VITE_` | `VITE_SANITY_PROJECT_ID` |
| Branches | `feature/<short-name>`, `fix/<short-name>` | `feature/about-page-team-grid` |

Filenames are case-sensitive on Linux but not macOS — kebab-case avoids the
"works locally, breaks on Netlify" import-casing class of bugs.

## Where to put new things

| Adding… | Goes in | Plus |
| --- | --- | --- |
| A new page | `src/routes/foo.tsx` | Register in `src/main.tsx` router |
| A new shared component (used in 2+ routes) | `src/components/foo.tsx` | — |
| A page-only component | Inline in the route file until reused | Promote later when needed |
| A new data type | `src/lib/types.ts` (interface) | + dummy entries in `dummy-data.ts`, + `src/lib/queries.ts` GROQ, + `src/hooks/use-foo.ts` |
| A new GROQ query for an existing type | `src/lib/queries.ts` | Use it inside the existing hook or write a new one |
| A new env var | `apps/web/.env.example` | + `src/vite-env.d.ts` declaration, + Netlify dashboard, + this doc's table |
| A new design token (color, font size) | `tailwind.config.ts` `theme.extend` | + `src/styles/tokens.css` if it needs to be a CSS variable |
| A new global CSS rule | `src/styles/globals.css` under the right `@layer` | Prefer Tailwind utilities first |
| A new icon | `lucide-react` import in the component | Only add a custom SVG if lucide doesn't have it |
| A test (when we add tests) | `<file>.test.ts(x)` colocated | Vitest + Testing Library |

## Import conventions

- Use the `@/` alias for src imports: `import X from '@/components/x'`
- Relative paths only for **sibling** files: `./gallery` inside `components/`
- Type-only imports use `import type { Foo }` — keeps emitted JS smaller and clearer
- Order within a file:
  1. External packages (`react`, `@tanstack/react-query`, …)
  2. Internal modules via `@/`
  3. Type-only imports
- No barrel files (no `src/components/index.ts`). Explicit imports help
  tree-shaking and make grep useful.

## When to extract a component

Add a file to `src/components/` only when the component is used by **two or
more routes**, or when it has nontrivial internal state that benefits from
isolation. Otherwise keep it colocated. Premature componentization is harder
to undo than a 100-line route file.

## When to add a new hook

One hook per Sanity document type. Don't combine — `useHero` and `useCompany`
stay separate even though both are fetched on the homepage. Composing them
happens at the route level. This keeps query keys clean and individual
caches independent.

## Documentation layout

Docs are organized by topic, not by reader:

| Doc | Owner topic |
| --- | --- |
| `CLAUDE.md` (root) | Auto-loaded context for Claude Code: stack, commands, conventions, doc map, hard rules |
| `README.md` (root) | Entry point — quickstart + provisioning |
| `docs/README.md` | Docs landing — TOC by topic, points at everything below |
| `ARCHITECTURE.md` | System diagram, trust boundaries, decision log |
| `PROJECT-STRUCTURE.md` | This file — repo layout + conventions |
| `FRONTEND.md` | `apps/web` implementation detail |
| `BACKEND.md` | The single function + Sanity-as-backend rationale |
| `CMS.md` | Sanity schemas, Studio setup, designer login |
| `DEVOPS.md` | Environments, deploys, monitoring, runbook |
| `GITHUB.md` | Branch model, PR template, CI workflows |
| `UI-MOCKUP.md` | Visual language + page wireframes |
| `PHASES.md` | Append-only log of every milestone (commit, what landed, what's open) |
| `CONFIG-LOG.md` | Auto-appended pre-commit when workspace/build/CI config files change |

Generated artifact: `docs/dist/chidr-interior-v2-docs.pdf` (via `yarn docs:pdf`,
gitignored).

When updating one doc, scan the others for stale cross-references — these
files link to each other heavily.
