# GitHub configuration

How the repo is organized, how we branch and commit, what CI runs, and which
secrets need to be set.

## Repository

- **Name:** `chidr-interior-v2`
- **Visibility:** private until launch, then public if the client agrees
- **Default branch:** `main` (protected)
- **License:** UNLICENSED (proprietary client work)

## Branch strategy

| Branch | Purpose | Protected |
| --- | --- | --- |
| `main` | Production. Auto-deploys to the live site. | yes |
| `develop` | Staging. Auto-deploys to a preview URL. | yes |
| `feature/<short-name>` | New work. Opens a PR into `develop`. | no |
| `fix/<short-name>` | Bug fixes. PR into `develop` (or `main` for hotfix). | no |

**Protections on `main` and `develop`:**

- Require PR review (1 approver)
- Require status checks: `lint`, `typecheck`, `build`
- Require branches to be up to date before merge
- No force pushes, no deletions
- Linear history (squash-merge only)

## Commit convention

Conventional Commits — keeps the changelog auto-generatable.

```
feat(web): add project filter chips on /projects
fix(studio): correct image hotspot ratio
docs: clarify Sanity deploy step
chore(deps): bump vite to 5.4
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`.
Scopes: `web`, `studio`, `infra`, `docs`.

## Pull request template

`.github/pull_request_template.md`:

```markdown
## What
<one-paragraph summary of the change>

## Why
<the problem or request being addressed>

## Screenshots / loom
<for UI changes, attach before/after>

## Checklist
- [ ] `yarn typecheck` passes
- [ ] `yarn build` succeeds locally
- [ ] Tested on mobile width (375px)
- [ ] No new env vars, or `.env.example` updated
```

## GitHub Actions

Two workflows.

### `.github/workflows/ci.yml` — on every PR

```yaml
name: CI
on:
  pull_request:
    branches: [main, develop]
jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'yarn' }
      - run: yarn install --frozen-lockfile
      - run: yarn typecheck
      - run: yarn build
        env:
          VITE_SANITY_PROJECT_ID: ${{ secrets.SANITY_PROJECT_ID }}
          VITE_SANITY_DATASET: production
          VITE_SANITY_API_VERSION: '2025-01-01'
```

### `.github/workflows/deploy-studio.yml` — on push to `main`

Frontend deploys are handled by the host (Netlify/Vercel) listening to the push
event. We only need an action for Studio:

```yaml
name: Deploy Sanity Studio
on:
  push:
    branches: [main]
    paths: ['apps/studio/**']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'yarn' }
      - run: yarn install --frozen-lockfile
      - run: yarn workspace studio exec sanity deploy --source-maps
        env:
          SANITY_AUTH_TOKEN: ${{ secrets.SANITY_DEPLOY_TOKEN }}
```

## Repository secrets

Set under **Settings → Secrets and variables → Actions**.

| Secret | Used by | Notes |
| --- | --- | --- |
| `SANITY_PROJECT_ID` | `ci.yml` build | Public, but kept as a secret for parity with envs |
| `SANITY_DEPLOY_TOKEN` | `deploy-studio.yml` | Generate in sanity.io → API → Tokens (Deploy Studio scope) |
| `RESEND_API_KEY` | Netlify/Vercel function env | For the contact form — see [BACKEND.md](BACKEND.md) |
| `NETLIFY_AUTH_TOKEN` *(optional)* | Manual deploys | Only if not using Netlify's GitHub integration |

## CODEOWNERS

`.github/CODEOWNERS`:

```
*                  @adron-lim
apps/studio/**     @adron-lim
docs/**            @adron-lim
```

Update when the client adds another developer.

## Issue labels

Keep it small — over-labelling slows triage:

- `bug`, `feature`, `chore`, `docs`
- `priority:high`, `priority:low`
- `area:web`, `area:studio`, `area:design`

## Releases

Optional. If we tag, use `v0.1.0` → `v1.0.0` at launch. Auto-changelog from
Conventional Commits via `changesets` or `release-please` — defer until v1.
