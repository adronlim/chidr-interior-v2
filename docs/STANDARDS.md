# Standards

Code-level conventions for chidr-interior-v2: how code is written, what we
validate, what counts as "must stay green" on a PR, and how commits should
be shaped.

Complementary reading:
- [ARCHITECTURE.md](ARCHITECTURE.md) — *why* the stack looks like this
- [PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md) — *where* things go
- [CLAUDE.md](../CLAUDE.md) — quick 30-second summary for AI sessions

This doc covers the third axis: *how* code is written.

---

## React component patterns

### Validate every prop at the boundary

Every shared component that receives data via props **must** guard against
invalid input at the top of its body. TypeScript types describe what data
should look like; runtime guards describe what to do when reality disappoints.

```tsx
function ProjectCard({ project }: Props) {
  // Required fields — render nothing if any are missing.
  if (!project || !project.slug || !project.coverImage?.url || !project.title) {
    return null;
  }
  // ...safe to use plain access below
}
```

Arrays: check both shape and emptiness.

```tsx
if (!Array.isArray(items) || items.length === 0) return null;
```

Soft fallback (continue rendering with default):

```tsx
const safe = Array.isArray(input) ? input : [];
```

### Hooks order is sacred

If a component uses hooks, the validation guard goes **after** all hooks,
not before. Calling hooks conditionally violates React's Rules of Hooks
and silently breaks the component when input flips between valid and invalid
across renders.

```tsx
function Gallery({ images }: Props) {
  // ✗ WRONG — early return before hooks breaks render order
  // if (!images.length) return null;

  const [openIndex, setOpenIndex] = useState(null);
  const close = useCallback(() => setOpenIndex(null), []);
  useEffect(() => {/* ... */}, [openIndex]);

  // ✓ Guard belongs here — after hooks, before render
  if (!Array.isArray(images) || images.length === 0) return null;

  return <>...</>;
}
```

### Optional chaining policy

The linter in this environment auto-adds `?.` to every property access
regardless of TypeScript narrowing. **Don't fight it.** The explicit guards
above are the real safety net; `?.` chains are belt-and-suspenders on top.

If the churn becomes painful, configure the responsible rule (likely
`@typescript-eslint/prefer-optional-chain` or equivalent) to respect
narrowing. Out of scope until it actively blocks work.

### When to extract a shared component

Only when the component is used in **two or more routes**, or when its
internal state benefits from isolation. Otherwise keep it colocated in
the route file. Premature componentization is harder to undo than a 100-line
route file.

---

## TypeScript

- `strict: true`, `noUnusedLocals`, `noUnusedParameters` are non-negotiable
- `any` is never acceptable. Use `unknown` and narrow, or define the shape
- Type assertions (`as`) only when the truth can't be expressed in the type
  system — paired with a brief comment explaining why
- Imports: `@/` alias for src; relative paths only for siblings
- No barrel files (`index.ts` re-exports). Explicit imports help tree-shaking
  and grep
- Type-only imports use `import type { Foo }`

---

## Data layer

- One `useFoo` hook per Sanity document type. Don't combine — `useHero` and
  `useCompany` stay separate even when used on the same page. Composition
  happens at the route level
- Every hook auto-branches: live Sanity when `VITE_SANITY_PROJECT_ID` is
  set, dummy data otherwise. The branch is one line — see
  [src/hooks/use-projects.ts](../apps/web/src/hooks/use-projects.ts)
- All GROQ queries live as constants in
  [src/lib/queries.ts](../apps/web/src/lib/queries.ts), named in UPPER_SNAKE
- Loading and error states surface at the route level, not deeper

---

## Forms

- `react-hook-form` for state, `zod` for schema, `@hookform/resolvers/zod`
  to bridge them
- The same zod schema is enforced **both** client-side and server-side (in
  the `/contact` function). Trust nothing at boundaries
- Field error display: inline below each input, in brass

---

## Styling

- Tailwind utility-first. Custom classes only in `@layer components` of
  `globals.css` — e.g. `.container-page`, `.btn`, `.link-underline`
- Design tokens centralized in `tailwind.config.ts` `theme.extend` and
  mirrored in `tokens.css` for CSS-var consumers
- Palette: `bone`, `ink`, `ash`, `brass`, `line`, `canvas`
- Fonts: Cormorant Garamond (display), Inter (body), `ui-monospace` (code)
- Always respect `prefers-reduced-motion` — disable transitions/animations
  inside that media query
- No inline styles unless dynamic. Even one-offs go via Tailwind utilities

---

## File and naming conventions

| Kind | Pattern | Example |
| --- | --- | --- |
| Source files | kebab-case | `project-card.tsx` |
| Component exports | PascalCase (default export) | `export default function ProjectCard()` |
| Hooks | `useFoo` exported from `use-foo.ts` | `useProjects` |
| Types / interfaces | PascalCase | `interface ProjectCategory` |
| GROQ constants | UPPER_SNAKE | `PROJECT_DETAIL_QUERY` |
| CSS custom classes | lowercase | `.container-page`, `.image-hover` |
| Env vars | SCREAMING_SNAKE; public ones prefixed `VITE_` | `VITE_SANITY_PROJECT_ID` |
| Docs filenames | UPPER-CASE (matches root `README.md`/`LICENSE.md`) | `STANDARDS.md` |
| Branches | `feature/<short-name>`, `fix/<short-name>` | `feature/about-team-grid` |

See [PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md) for the full "where does
this go?" rules.

---

## Performance budget

| Metric | Target |
| --- | --- |
| Initial JS (gzipped) | **< 180 KB** |
| LCP (mobile) | < 2.5 s |
| Largest hero image | < 250 KB at 1600w |
| Lighthouse Performance | ≥ 90 |
| Lighthouse Accessibility | ≥ 95 |

A PR that crosses the JS budget needs a justification or a code-split plan.
Image weight is enforced by Sanity CDN params at request time, not by
upload size.

---

## Sensitive data hygiene

- **Tokens, API keys, passwords**: never in markdown, code, or commits.
  They live in `apps/*/.env*` (gitignored). See [DEVOPS.md](DEVOPS.md)
  for the env-var matrix
- **Sanity user IDs**: never in committed files — they enable targeted
  social engineering
- **Sanity project IDs**: technically public (they ship in the SPA bundle)
  but use dummy values in docs anyway: project id → `abc12def`, user id
  → `g-XXXXXXXXXX`. Flag dummy nature inline: "dummy; real in `.env`"
- Real values go through `apps/web/.env.local` and `apps/studio/.env` —
  both gitignored

Enforced by the hard rule in [CLAUDE.md](../CLAUDE.md).

---

## Git workflow

### Commit messages

Conventional Commits.

```
feat(scope): short imperative summary
fix(scope): ...
chore(scope): ...
refactor(scope): ...
docs(scope): ...
```

Body wraps at ~72 chars and explains the *why* (the diff already shows
*what*). Include a `Co-Authored-By:` trailer for AI-assisted commits.

Common scopes: `web`, `studio`, `components`, `docs`, `infra`,
`log-config`, `studio.scripts`.

### Branch model

| Branch | Purpose | Protected |
| --- | --- | --- |
| `main` | Production | yes |
| `develop` | Staging | yes |
| `feature/<name>` | New work | no |
| `fix/<name>` | Bug fixes | no |

Squash-merge into `develop`; regular merge `develop → main`. Linear history.

### Auto-logged config changes

The pre-commit hook ([.githooks/pre-commit](../.githooks/pre-commit)) appends
to [CONFIG-LOG.md](CONFIG-LOG.md) whenever a commit touches workspace, build,
CI, or hosting config files. Matched patterns live in
[scripts/log-config-changes.mjs](../scripts/log-config-changes.mjs).

Bypass for one commit: `git commit --no-verify`. Don't make a habit of it.

### Phase journal

[PHASES.md](PHASES.md) is append-only. New milestones get a new section;
don't silently rewrite past entries except for factual fixes.

---

## Build invariants

- `yarn build` must stay green (TS + Vite). Never bypass with `// @ts-ignore`
  or `// eslint-disable` without a paired comment explaining the why
- `yarn typecheck` must stay green on every PR — `tsc -b --noEmit`
- No tests yet; when added, `yarn test` joins the "must stay green" list

---

## Validation patterns at a glance

| Situation | Pattern |
| --- | --- |
| Required prop object | `if (!obj) return null` after hooks |
| Required fields on a prop object | `if (!obj || !obj.field) return null` |
| Required array (must be non-empty) | `if (!Array.isArray(arr) \|\| arr.length === 0) return null` |
| Optional array (continue with default) | `const safe = Array.isArray(arr) ? arr : []` |
| Loading state at route | `if (isLoading) return <Skeleton/>; if (!data) return null;` |
| String parse / regex | Guard input type before `.match()` / `.split()` |
| Form input | zod schema validated by react-hook-form |

---

## Future automations to consider

Not blocking work today, but worth adopting when they pay off:

- **Secret scanning** — `gitleaks` or `git-secrets` in a pre-commit hook to
  catch tokens / API keys / real Sanity IDs before they enter history.
  Right now we rely on the human "no real IDs in markdown" rule
- **Pre-push hook** — run `yarn typecheck && yarn build` before push, so a
  broken main is impossible regardless of who's pushing. Currently only the
  pre-commit config-log hook runs
- **Co-author auto-trailer** — a `prepare-commit-msg` hook that appends a
  `Co-Authored-By:` line based on environment (AI / pair-coding session).
  Eliminates the manual paste
- **Lighthouse CI in `ci.yml`** — measure perf budget on every PR; fail the
  build if Performance < 90 or JS bundle exceeds the threshold

## When in doubt

- Read the spec doc (`docs/<TOPIC>.md`) before "where does this go?"
- Read [PHASES.md](PHASES.md) for what shipped when and why
- Read [CLAUDE.md](../CLAUDE.md) for the 30-second project summary
