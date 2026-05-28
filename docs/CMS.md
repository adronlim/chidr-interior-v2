# CMS — Sanity (`apps/studio`)

This is the "CRMS" piece: where the designer logs in, edits company info, and
uploads projects with images.

## Why Sanity

| Need | Sanity gives us |
| --- | --- |
| Designer can log in without a custom auth flow | Hosted login at `chidr.sanity.studio` (Google + email magic link) |
| Upload images with cropping / focal point | Image hotspots + Asset Pipeline (resize, focal crop, format) |
| Update text without redeploys | Live content from Content Lake, CDN-cached |
| Structured schema we can typecheck | TypeScript types generated from schema |
| Hosted by default | No server to run; `sanity deploy` ships the Studio |

The alternative we considered was **Payload**, which is self-hosted Node + Postgres
and gives more raw control. For a single-designer studio, the hosted option is
the lower-maintenance choice. Revisit if multi-tenancy or fine-grained access
control becomes a requirement.

## Studio setup

The Studio is already scaffolded under [apps/studio/](../apps/studio/) — yarn
workspace `studio`, hand-written rather than generated from the Sanity template
so the schemas and desk structure are versioned with the rest of the repo.

```
apps/studio/
├── sanity.config.ts         # plugins (structure, vision) + schema registration
├── sanity.cli.ts            # `sanity` CLI auth config (project ID + dataset)
├── deskStructure.ts         # singleton items (Company, Hero) + grouped lists
├── schemas/
│   ├── index.ts             # exports all schemaTypes
│   ├── company.ts           # singleton — see below
│   ├── hero.ts              # singleton — see below
│   ├── project.ts
│   ├── projectCategory.ts
│   ├── teamMember.ts
│   └── inquiry.ts           # read-only, written by /contact function
├── scripts/
│   └── seed.ts              # `yarn studio:seed` — creates the 9 known projects
├── package.json
├── tsconfig.json
└── .env.example
```

### Provisioning

See [README → First-time Sanity provisioning](../README.md#first-time-sanity-provisioning)
for the end-to-end checklist. In short:

1. Create the project at sanity.io (manual via dashboard, or
   `yarn workspace studio exec sanity init` if you want the CLI to do it)
2. Fill `apps/studio/.env` and `apps/web/.env.local` with the project ID
3. Add CORS origins for `localhost:5173` and `localhost:3333`
4. Generate an Editor token for the seed script
5. `yarn studio:seed` → `yarn studio:dev` → upload images in the UI

## Schemas

Six document types, defined under [`apps/studio/schemas/`](../apps/studio/schemas/)
with `defineType` + `defineField`. Two are **singletons** (Company, Hero) —
enforced via desk structure so only one document of each ever exists.

| Schema | Source | Key fields | Notes |
| --- | --- | --- | --- |
| `company` | [company.ts](../apps/studio/schemas/company.ts) | name, tagline, logo, address, phone, email, mapEmbedUrl, socials[], services[] | Singleton (id: `company`). Address/phone/email flagged DUMMY until designer provides. |
| `hero` | [hero.ts](../apps/studio/schemas/hero.ts) | heading, subheading, image, ctaLabel, ctaHref | Singleton (id: `hero`). Drives the homepage hero. |
| `project` | [project.ts](../apps/studio/schemas/project.ts) | title, slug, category (ref), year, location, areaSqft, featured, coverImage (hotspot), gallery[] (hotspot + caption), videoUrl (optional YouTube), description (portable text), order | Cover required. videoUrl validated as YouTube; rendered as click-to-play on the project detail page. Two orderings: manual (`order`) and year-desc. |
| `projectCategory` | [projectCategory.ts](../apps/studio/schemas/projectCategory.ts) | title, slug, description | Seeded as Residential, Commercial, Office. |
| `teamMember` | [teamMember.ts](../apps/studio/schemas/teamMember.ts) | name, role, photo (hotspot), bio, order | All DUMMY at seed; designer fills in. |
| `inquiry` | [inquiry.ts](../apps/studio/schemas/inquiry.ts) | name, email, phone, message, projectInterest, submittedAt, status, notes | Every form field `readOnly` — written by the future `/contact` function. Only `status` (new/replied/archived) and `notes` editable. |

## Singleton enforcement

Pinned in [`apps/studio/deskStructure.ts`](../apps/studio/deskStructure.ts):
Company info and Homepage hero are list items with fixed document IDs (so
they can't be duplicated); projects, categories, team members appear as type
lists below; inquiries get their own section.

## Roles and login

Sanity's free tier includes 3 users with **Editor/Admin** roles.

- **Admin (developer):** schema changes, deploys, token management
- **Editor (designer):** creates/edits content, can't change schemas
- **Viewer (optional, e.g. client stakeholder):** read-only access

Invite the designer via sanity.io → Members → Invite → role: Editor. They log
in at `https://chidr.sanity.studio` with Google or email magic link. No
password to forget, no recovery flow to build.

## GROQ queries (used by the frontend)

```groq
// homepage hero + featured projects + company info
{
  "hero": *[_type == "hero"][0]{ heading, subheading, image, ctaLabel, ctaHref },
  "featured": *[_type == "project" && featured == true] | order(order asc)[0...6]{
    _id, title, "slug": slug.current, coverImage,
    "category": category->title
  },
  "company": *[_type == "company"][0]{ name, tagline, logo, services }
}
```

```groq
// /projects with optional filter
*[_type == "project" && ($category == null || category->slug.current == $category)]
| order(order asc, year desc){
  _id, title, "slug": slug.current, year, location, coverImage,
  "category": category->{ title, "slug": slug.current }
}
```

```groq
// /projects/:slug
*[_type == "project" && slug.current == $slug][0]{
  ..., "category": category->{ title, "slug": slug.current },
  "related": *[_type == "project" && _id != ^._id && category._ref == ^.category._ref][0...3]{
    _id, title, "slug": slug.current, coverImage
  }
}
```

## Migration / seed

A one-off script to seed the 9 known projects so the site isn't empty on first
deploy. `apps/studio/scripts/seed.ts`:

```ts
const seed = [
  { title: 'Desa Pinang', category: 'residential', year: 2023, location: 'Penang' },
  { title: 'QuayWest Residence', category: 'residential', year: 2022, location: 'Penang' },
  { title: 'Queen Residence', category: 'residential', year: 2022, location: 'Penang' },
  { title: 'The Marin', category: 'residential', year: 2023, location: 'Penang' },
  { title: 'The Zen', category: 'residential', year: 2021, location: 'Penang' },
  { title: 'Waterside Residence', category: 'residential', year: 2022, location: 'Penang' },
  { title: 'Beacon Executive Suites', category: 'commercial', year: 2023, location: 'Penang' },
  { title: 'Imperial Grande', category: 'residential', year: 2024, location: 'Penang' },
  { title: 'Jelutong Office', category: 'office', year: 2023, location: 'Jelutong, Penang' },
];
// then sanity.create() with placeholder coverImage assets pulled from the live site
```

Run with: `yarn studio:seed` (registered at the workspace root).

Year/location are guesses pending the designer's confirmation — flag them
with `> [DUMMY]` notes inline. The designer can edit each record in Studio
after first login.

## Studio deployment

```bash
yarn studio:deploy
# pick a hostname, e.g. "chidr" → https://chidr.sanity.studio
```

CI also runs this on every push to `main` — see [GITHUB.md](GITHUB.md).
