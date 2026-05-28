# Architecture

System-level view of how the chidr-interior-v2 stack hangs together: what runs
where, who talks to whom, and which choices need to be revisited if the
requirements change.

## System diagram

```
                ┌──────────────────────────────┐
                │      Visitor's browser        │
                └──┬────────────┬───────────┬──┘
                   │            │           │
        static SPA │  GROQ API  │  images   │ POST /contact
                   ▼            ▼           ▼          │
          ┌─────────────┐ ┌──────────────────┐         │
          │   Netlify   │ │     Sanity       │         │
          │     CDN     │ │   Content Lake   │         │
          │ (web/dist)  │ │ + Asset CDN      │         │
          └─────────────┘ └──────┬───────────┘         │
                                 ▲                      │
                                 │ write inquiry doc    │
                                 │ (token, server-side) │
                                 │              ┌───────▼──────────┐
                                 └──────────────│  Netlify Func    │
                                                │   /contact       │
                                                └─────────┬────────┘
                                                          │ send email
                                                          ▼
                                                   ┌─────────────┐
                                                   │   Resend    │
                                                   └─────────────┘

      Designer's browser ───────────────────► Sanity Studio (login)
                                              chidr.sanity.studio
```

## Components

| Component | What it is | Why it exists |
| --- | --- | --- |
| Static SPA | `apps/web/dist` served by Netlify | Public showcase site |
| Sanity Content Lake | Hosted document store + GROQ API | Project data, company info |
| Sanity Asset CDN | Image transform + edge CDN | Resize, focal crop, format conversion |
| Sanity Studio | Hosted admin UI at `*.sanity.studio` | Where the designer logs in to edit |
| `/contact` function | Netlify serverless (Node) | Bridge between browser and Sanity write API + Resend |
| Resend | Email API | Inquiry notifications to the studio inbox |

## Trust boundaries

| Surface | Secrets allowed |
| --- | --- |
| SPA bundle (browser) | `VITE_SANITY_PROJECT_ID`, dataset, API version — all public values |
| `/contact` function | `SANITY_WRITE_TOKEN`, `RESEND_API_KEY`, `NOTIFY_EMAIL` |
| Sanity Studio | Designer auth handled by Sanity (Google / email magic link) |

Public env vars are identifiers, not secrets — they name the dataset, not
authorize access. Read access is governed by Sanity CORS plus dataset
visibility (set to public).

## Data flow per page

| Route | Reads | Writes |
| --- | --- | --- |
| `/` | `HOMEPAGE_QUERY` (hero + featured + company) | — |
| `/projects` | `PROJECTS_QUERY` (+ optional `category` filter) | — |
| `/projects/:slug` | `PROJECT_DETAIL_QUERY` (with related subquery) | — |
| `/about` | `COMPANY_QUERY` + `TEAM_QUERY` | — |
| `/contact` | `COMPANY_QUERY` + `CATEGORIES_QUERY` (form select) | `POST /.netlify/functions/contact` → Sanity (inquiry doc) + Resend |

While Sanity is not yet provisioned, the same hooks read from
`apps/web/src/lib/dummy-data.ts`. The branch happens in each hook —
see [PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md).

## Decision log

| Decision | Why | When to revisit |
| --- | --- | --- |
| Vite SPA, not Next.js | Client-specified; SEO needs are modest (single brand, small site) | If organic search becomes a primary acquisition channel |
| Sanity, not Payload/Strapi | Hosted Studio, hosted login, image transforms, no server to maintain | If we need fine-grained per-record access control, multi-tenancy, or row-level security |
| No own backend | Only one writeable surface (inquiries); Sanity handles content | If we add public sign-up, transactions, or anything non-content |
| Yarn 1 workspaces | Operator preference | Yarn 3+ Berry has PnP and constraints; switch if dependency hygiene becomes painful |
| Dummy-data shim in hooks | Ship runnable before Sanity provisioning | Remove the branch once a Sanity project ID lands in `.env.local` |
| placehold.co images | Honest placeholders during dev | Delete the helper after the designer uploads real photos |
| Tailwind 3 (not 4) | Stable, widest plugin ecosystem | Migrate to v4 when a needed plugin requires it |

## Performance characteristics

| Metric | Value | Notes |
| --- | --- | --- |
| Initial JS (gzipped) | ~138 KB | Under the 180 KB budget defined in FRONTEND.md |
| LCP target (mobile) | < 2.5 s | Hero image dominates — use Sanity's image transforms + lazy below the fold |
| Sanity read latency | ~50–150 ms (edge-cached) | `useCdn: true` |
| Image CDN | Global edge with avif/webp on demand | Built into Sanity's asset pipeline |

## Scaling envelope

Free-tier ceilings we need to stay under:

| Service | Free limit | What blows it |
| --- | --- | --- |
| Netlify | 100 GB bandwidth/mo, 125k function invocations/mo | Viral spike, contact-form spam |
| Sanity | 10k API requests/day, 100 GB CDN/mo, 3 users | Many uncached SPA hits, or scraping |
| Resend | 3,000 emails/mo | Contact-form spam |

Mitigations:
- `useCdn: true` keeps most visitor sessions to 0–2 origin hits; the rest are CDN hits.
- Contact form is zod-validated; add Cloudflare Turnstile + Upstash rate-limit once we see spam.

## Failure modes

| What fails | Symptom | Mitigation |
| --- | --- | --- |
| Sanity API down | Routes stuck on loading state | Accept — paid plan SLA 99.9%+; add stale-while-revalidate cache if needed later |
| Asset CDN down | Broken images | Browser falls back to `alt` text |
| `/contact` function down | Form shows error; designer email visible as fallback | Already implemented in `contact-form.tsx` |
| Netlify build fails on push | Last green deploy stays live | Roll back via Netlify dashboard |
| Designer locked out of Studio | Designer can't update content | Email magic-link recovery; admin can re-invite |
| Resend over quota | Inquiries hit Sanity but no email | Designer still sees inquiries in Studio |

## Security model

- **No accounts on the public site.** Nothing to authenticate.
- **All writes through the function.** SPA never holds a write token.
- **Function token scoped to `inquiry` creation only** — Sanity supports
  document-type role policies; configure the token's role accordingly.
- **CORS allow-list** on both Sanity and the function: localhost + staging + prod.
- **Validation on both ends:** zod in browser, zod in function — never trust the client.
- **No PII at rest beyond inquiries.** Inquiries contain name/email/phone/message;
  treat as sensitive. Retention policy: TBD with the designer.

## What is NOT in this architecture (and why)

| Not included | Why |
| --- | --- |
| Own user accounts | No public sign-up requirement |
| Search service (Algolia/Meilisearch) | 9–30 projects is too small to need it; client-side filter is fine |
| Analytics platform | Defer until launch; pick Plausible (privacy-friendly) when needed |
| CDN in front of Sanity | Sanity ships its own CDN |
| GraphQL gateway | One client, one source — GROQ is sufficient |
| Error reporting (Sentry, etc.) | Defer; revisit if real-user errors become a blocker |
