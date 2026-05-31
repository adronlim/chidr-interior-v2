# DevOps

Where the app runs in each environment, how it gets there, and what to do
when it doesn't.

## Environments

| Env | Branch | Web URL | Studio URL | Sanity dataset | Purpose |
| --- | --- | --- | --- | --- | --- |
| Local | (any) | http://localhost:5173 | http://localhost:3333 | `production` (read-only by convention) | Dev work |
| Staging | `develop` | `chidr-staging.netlify.app` | `chidr.sanity.studio` | `production` | Client review |
| Production | `main` | `www.chidr.com.my` | `chidr.sanity.studio` | `production` | Live site |

Single dataset across all envs for now. When the content-review process
matures, split into:
- `staging` dataset — preview copy changes before they go live
- `production` dataset — locked behind a Sanity scheduled-publishing workflow

## Hosting

| Asset | Host | Why |
| --- | --- | --- |
| SPA (`apps/web/dist`) | Netlify | Best Vite/SPA story, free tier, integrated functions |
| `/contact` function | Netlify Functions | Lives beside the SPA, same deploy |
| Sanity Studio | Sanity Cloud (`sanity deploy`) | Hosted free; no server to run |
| Content + assets | Sanity Content Lake + Asset CDN | Managed |
| Email | Resend | Modern API, generous free tier |
| DNS | Cloudflare (recommended) or domain registrar | DNS-only, no proxy needed unless we add Turnstile |

## Deployment pipeline

```
Open PR  ────────► CI: yarn typecheck && yarn build
                   (.github/workflows/ci.yml)
                       │
                       ▼ approve + squash-merge
                develop ─────────────► Netlify auto-deploy → staging URL
                       │
                       ▼ PR develop → main, approve + squash-merge
                main ────────────────► Netlify auto-deploy → www.chidr.com.my
                                       GHA: yarn workspace studio sanity deploy
```

Frontend deploys are driven by Netlify's GitHub integration — no GHA needed.
Studio deploy is its own GHA workflow (see [GITHUB.md](GITHUB.md)).

## Environment variable matrix

| Variable | Where it's set | Used by | Secret? |
| --- | --- | --- | --- |
| `VITE_SANITY_PROJECT_ID` | Netlify (web), `apps/web/.env.local` (dev) | SPA bundle | No (public ID) |
| `VITE_SANITY_DATASET` | same | SPA | No |
| `VITE_SANITY_API_VERSION` | same | SPA | No |
| `VITE_CONTACT_ENDPOINT` | same | SPA | No |
| `SANITY_PROJECT_ID` | Netlify (function context) | function | No |
| `SANITY_DATASET` | Netlify (function context) | function | No |
| `SANITY_WRITE_TOKEN` | Netlify (function context) | function | **Yes** — scope to `inquiry` writes only |
| `RESEND_API_KEY` | Netlify (function context) | function | **Yes** |
| `NOTIFY_EMAIL` | Netlify (function context) | function | No |
| `SANITY_DEPLOY_TOKEN` | GitHub Actions secret | `deploy-studio.yml` | **Yes** — Deploy Studio scope only |

Public `VITE_*` vars are embedded in the JS bundle — anyone can read them.
That's fine; they identify the dataset, not authorize access.

### Local studio env files: which command reads which file

`apps/studio/` uses two local env files (both gitignored), each defining the
same three vars (`SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`,
`SANITY_AUTH_TOKEN`). Different commands read different files:

| Command | Loader | File used |
| --- | --- | --- |
| `yarn studio:seed` | `dotenv` (explicit `.env.local` path, `scripts/seed.ts`) | **`.env.local`** |
| `yarn studio:dev` | Sanity CLI (development mode) | **`.env.local`** |
| `yarn studio:build` / `:deploy` | Sanity CLI (production mode) | **`.env.production`** (overrides `.env.local`) |

Precedence for the CLI (low → high): `.env` → `.env.local` → `.env.[mode]` →
`.env.[mode].local` (`mode` = `development` for dev, `production` for build/deploy).
The seed script loads only `.env.local` explicitly (it does **not** read
`.env.production`), so dev and seed always share one token while build/deploy can
use a separate production token.

`project ID` and `dataset` should match across the files; only the token is
expected to differ (dev/seed vs. production). Rotating a token in one file but
not the others will silently point those commands at different credentials.

Deploying the Studio needs a credential with the `deployStudio` grant, which the
local editor token lacks. Log in as a project admin and bypass the local token
for that one command:

```bash
cd apps/studio
yarn sanity login                       # personal admin account
SANITY_AUTH_TOKEN= yarn studio:deploy   # empty var → CLI falls back to the login
```

Check which token a command resolves to with `yarn sanity debug --secrets`.

## Custom domain + SSL

1. In Netlify → Domain settings, add `www.chidr.com.my` (and `chidr.com.my`
   apex with a redirect to `www`).
2. At the DNS registrar / Cloudflare:
   - `www` → CNAME to Netlify's load balancer
   - apex → ALIAS / ANAME, or use Netlify DNS
3. Netlify provisions a Let's Encrypt cert automatically (~5 min).
4. Force HTTPS in Netlify settings.

Migration from the existing site:
- Capture the old URL → new URL map (only ~9 project URLs)
- Add `[[redirects]]` to `netlify.toml` for any old paths still in Google's index
- Submit a sitemap to Google Search Console after launch

## Monitoring

| What | Where |
| --- | --- |
| Build status, deploy history | Netlify dashboard |
| Function logs (`/contact`) | Netlify dashboard → Functions |
| Sanity API usage, request volume | sanity.io project dashboard |
| Email delivery | Resend dashboard |
| Uptime checks | Deferred — BetterStack / UptimeRobot free tier when launch-ready |
| Performance | Lighthouse CI deferred; manual runs pre-launch |
| Frontend errors | Deferred — consider Sentry if usage warrants |

## Cost expectations

At launch traffic levels (small studio, modest paid ads at most):

| Service | Tier | Monthly |
| --- | --- | --- |
| Netlify | Free | $0 |
| Sanity | Free | $0 |
| Resend | Free | $0 |
| DNS (Cloudflare) | Free | $0 |
| Domain (chidr.com.my) | renewal | ~$1/mo amortized |
| **Total runtime** | | **~$1/mo** |

First paid line is likely Sanity (Growth plan @ $99/mo) once we exceed 10k
API requests/day — unlikely for a 9-project showcase with CDN caching on.

## Backups

- **Daily Sanity dataset export** via GHA cron — see
  [BACKEND.md](BACKEND.md#backups). Artifact retained 30 days; push to S3/B2
  for longer retention.
- **Deploy history** — Netlify keeps every deploy; one-click rollback.
- **Code** — Git is source of truth; tag releases (`v0.1.0` → `v1.0.0`).

## Rollback procedures

| Layer | How |
| --- | --- |
| Web (Netlify) | Dashboard → Deploys → previous green deploy → "Publish deploy" |
| Function | Same as web — function code ships with the SPA bundle |
| Studio | `git revert <bad-commit>` → push to `main` → GHA redeploys Studio |
| Content | `npx sanity dataset import backup.tar.gz production --replace` |

## Runbook (common incidents)

| Symptom | First check | Likely fix |
| --- | --- | --- |
| Site shows blank page | Netlify deploy log | Re-run failed build or roll back to last green |
| Contact form returns 500 | Netlify function log | Verify `SANITY_WRITE_TOKEN`, Resend quota, Sanity API status |
| Contact form returns 400 | Browser devtools → request body | Schema mismatch; reconcile zod schema between client and function |
| Images broken sitewide | sanity.io status page | Wait for Sanity recovery; nothing actionable client-side |
| Designer can't log in | sanity.io → Members | Re-send invite / magic link |
| High Sanity API spend | sanity.io usage tab | Audit React Query `staleTime`; ensure `useCdn: true`; look for unbounded queries |
| Spam in inquiries | Inquiry doc volume in Studio | Add Cloudflare Turnstile to contact form + Upstash rate-limit in function |
| `yarn install` fails on CI | Look at action log | Clear cache; pin a working `node-version` |
| TypeScript build fails post-merge | `yarn build` locally | Likely a type drift; fix and reopen PR — never bypass CI |

## CI workflows (summary)

Canonical YAML lives in [GITHUB.md](GITHUB.md).

- `ci.yml` — every PR. `yarn install --frozen-lockfile`, `yarn typecheck`, `yarn build` with secrets injected.
- `deploy-studio.yml` — push to `main` when `apps/studio/**` changes.
- `sanity-backup.yml` — daily cron; archives the dataset.

## Pre-launch checklist

- [ ] Custom domain pointed and HTTPS live
- [ ] All env vars set in Netlify (web context + function context) and verified via a test deploy
- [ ] `SANITY_WRITE_TOKEN` scoped to `inquiry` writes only
- [ ] Test inquiry sends to `NOTIFY_EMAIL` (end-to-end through Resend)
- [ ] Real project photos uploaded for the 9 seeded projects
- [ ] Real company contact info entered in Studio (replaces every DUMMY value)
- [ ] Lighthouse run on homepage: Performance ≥ 90, Accessibility ≥ 95
- [ ] Google Search Console verified, sitemap submitted
- [ ] 301 redirects in `netlify.toml` for any indexed old URLs
- [ ] Sanity Studio: designer invited and successfully logged in
- [ ] Daily backup workflow ran at least once and the artifact is downloadable
- [ ] CORS origins on Sanity include only `localhost`, staging, and prod
- [ ] Final responsive QA at 375 / 768 / 1440
