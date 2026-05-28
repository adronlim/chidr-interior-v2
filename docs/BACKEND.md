# Backend

There is **no dedicated backend server** in this project. Sanity hosts the
Content Lake, authenticates the designer, and serves images via its CDN. The
public site is a static SPA.

The only piece of bespoke server code is one **serverless function** that
handles the contact form — because we don't want to ship a write token to the
browser and we want to forward the inquiry by email.

## Why no traditional backend

| Need | How it's met without a server |
| --- | --- |
| Storing project records | Sanity Content Lake (Postgres-like document store) |
| Login for the designer | Sanity Studio auth (Google / email magic link) |
| Image upload + transforms | Sanity Asset Pipeline (`urlFor(img).width(1600)…`) |
| API to read content | Sanity GROQ API over HTTPS, edge-cached |
| Backups | Daily `sanity dataset export` cron (see below) |

Trade-off: we're locked to Sanity. Migration off Sanity later means exporting
the dataset (which is just JSON) and rewriting the read layer. For a single-tenant
showcase site, this is the right trade.

## The one function: `contact.ts`

`apps/web/netlify/functions/contact.ts` (works on Vercel too with a minor signature change).

```ts
import { Handler } from '@netlify/functions';
import { createClient } from '@sanity/client';
import { Resend } from 'resend';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  message: z.string().min(10).max(4000),
  projectInterest: z.string().max(100).optional(),
});

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: '2025-01-01',
  token: process.env.SANITY_WRITE_TOKEN!, // server-side only
  useCdn: false,
});

const resend = new Resend(process.env.RESEND_API_KEY!);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  // simple in-memory rate limit per IP — see notes below
  const ip = event.headers['x-forwarded-for'] ?? 'unknown';
  if (await isRateLimited(ip)) {
    return { statusCode: 429, body: 'Too many requests' };
  }

  let payload;
  try {
    payload = schema.parse(JSON.parse(event.body ?? '{}'));
  } catch {
    return { statusCode: 400, body: 'Invalid payload' };
  }

  // 1. record the inquiry in Sanity so the designer sees it in Studio
  await sanity.create({
    _type: 'inquiry',
    ...payload,
    submittedAt: new Date().toISOString(),
    status: 'new',
  });

  // 2. notify the designer by email
  await resend.emails.send({
    from: 'CHIDR Website <hello@chidr.com.my>',
    to: process.env.NOTIFY_EMAIL!,
    replyTo: payload.email,
    subject: `New inquiry from ${payload.name}`,
    text: `${payload.message}\n\n— ${payload.name}\n${payload.email}\n${payload.phone ?? ''}`,
  });

  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};
```

### Rate limiting

Stateless functions can't keep an in-memory counter reliably. Options:

1. **Upstash Redis** (free tier) — recommended. 5 requests / 10 min per IP.
2. **Netlify Edge Functions + Deno KV** — viable if we move the function to edge.
3. **Cloudflare Turnstile** in front of the form — captcha-style, no backend state.

Pick Turnstile if the form gets spammed; otherwise skip until needed.

## Environment variables (server-side)

Set on Netlify/Vercel — **never** in `VITE_*` vars.

| Name | Purpose | Notes |
| --- | --- | --- |
| `SANITY_PROJECT_ID` | Sanity project ID | Same value as the public one |
| `SANITY_DATASET` | `production` | |
| `SANITY_WRITE_TOKEN` | Token with Editor scope, document type = `inquiry` only | Generate in sanity.io → API → Tokens |
| `RESEND_API_KEY` | Resend account key | resend.com → API Keys |
| `NOTIFY_EMAIL` | Where inquiries land | e.g. `inbox@chidr.com.my` |

> Scope the write token narrowly: it should only be able to create `inquiry`
> documents. Sanity supports role-based permissions per document type.

## CORS

Sanity Content Lake — set allowed origins in sanity.io → API → CORS origins:

- `http://localhost:5173` (dev)
- `https://chidr-staging.netlify.app` (preview)
- `https://www.chidr.com.my` (prod)

The function reads `event.headers.origin` and accepts only the same set.

## Backups

Daily export via a GitHub Action cron (you could also use Sanity's built-in
scheduled exports if on a paid plan):

```yaml
# .github/workflows/sanity-backup.yml
on:
  schedule: [{ cron: '0 17 * * *' }]   # 01:00 MYT daily
jobs:
  export:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npx -y @sanity/cli@latest dataset export production backup.tar.gz \
              --project $PROJECT_ID --token $TOKEN
        env:
          PROJECT_ID: ${{ secrets.SANITY_PROJECT_ID }}
          TOKEN: ${{ secrets.SANITY_DEPLOY_TOKEN }}
      - uses: actions/upload-artifact@v4
        with: { name: sanity-backup, path: backup.tar.gz, retention-days: 30 }
```

For long-term backups, push the artifact to S3 or Backblaze B2 instead.

## What we are explicitly NOT building

- A REST/GraphQL API of our own — Sanity's GROQ API is the API
- A bespoke admin UI — Sanity Studio is the admin UI
- An image processing pipeline — Sanity's `urlFor()` does cropping, focal point, format conversion
- A users table / role system — Sanity manages designers, devs, and viewers

If any of these are ever needed (e.g. multi-tenant, public account signup),
that's a re-architecture conversation, not an incremental change.
