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

Six document types. Two are **singletons** (Company, Hero) — only one document
of each ever exists, enforced via desk structure.

### `company` (singleton)

```ts
// apps/studio/schemas/company.ts
export default {
  name: 'company',
  type: 'document',
  title: 'Company info',
  fields: [
    { name: 'name', type: 'string', validation: r => r.required(),
      initialValue: 'CH iDesign & Renovation' },
    { name: 'tagline', type: 'string',
      description: 'Used on the homepage hero subtitle' },
    { name: 'logo', type: 'image',
      options: { hotspot: true }, validation: r => r.required() },
    { name: 'logoDark', type: 'image',
      description: 'Optional — used on dark backgrounds (footer)' },
    { name: 'address', type: 'text', rows: 3 },     // DUMMY until provided
    { name: 'phone', type: 'string' },              // DUMMY
    { name: 'email', type: 'string',
      validation: r => r.email() },                 // DUMMY
    { name: 'mapEmbedUrl', type: 'url',
      description: 'Google Maps embed URL for the Contact page' },
    { name: 'socials', type: 'array', of: [{
      type: 'object',
      fields: [
        { name: 'platform', type: 'string',
          options: { list: ['instagram','facebook','tiktok','linkedin'] } },
        { name: 'url', type: 'url' },
      ],
    }] },
    { name: 'services', type: 'array', of: [{
      type: 'object',
      fields: [
        { name: 'title', type: 'string' },
        { name: 'description', type: 'text', rows: 2 },
        { name: 'icon', type: 'string',
          description: 'lucide-react icon name, e.g. "hammer"' },
      ],
    }] },
  ],
};
```

### `project`

```ts
// apps/studio/schemas/project.ts
export default {
  name: 'project',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', validation: r => r.required() },
    { name: 'slug', type: 'slug', options: { source: 'title' },
      validation: r => r.required() },
    { name: 'category', type: 'reference', to: [{ type: 'projectCategory' }],
      validation: r => r.required() },
    { name: 'year', type: 'number',
      validation: r => r.integer().min(1990).max(new Date().getFullYear() + 1) },
    { name: 'location', type: 'string' },
    { name: 'areaSqft', type: 'number', title: 'Area (sqft)' },
    { name: 'featured', type: 'boolean',
      description: 'Show on the homepage featured grid', initialValue: false },
    { name: 'coverImage', type: 'image',
      options: { hotspot: true }, validation: r => r.required() },
    { name: 'gallery', type: 'array',
      of: [{ type: 'image', options: { hotspot: true },
             fields: [{ name: 'caption', type: 'string' }] }] },
    { name: 'description', type: 'array', of: [{ type: 'block' }],
      title: 'Description (rich text)' },
    { name: 'order', type: 'number',
      description: 'Lower numbers appear first', initialValue: 100 },
  ],
  orderings: [
    { name: 'manual', title: 'Manual order',
      by: [{ field: 'order', direction: 'asc' }] },
    { name: 'yearDesc', title: 'Year (newest first)',
      by: [{ field: 'year', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'location', media: 'coverImage' },
  },
};
```

### `projectCategory`

```ts
export default {
  name: 'projectCategory',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', validation: r => r.required() },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'description', type: 'text', rows: 2 },
  ],
};
```

Seed categories: **Residential**, **Commercial**, **Office**.

### `hero` (singleton)

```ts
export default {
  name: 'hero',
  type: 'document',
  title: 'Homepage hero',
  fields: [
    { name: 'heading', type: 'string' },          // "Spaces that quietly endure."
    { name: 'subheading', type: 'text', rows: 2 },
    { name: 'image', type: 'image', options: { hotspot: true } },
    { name: 'ctaLabel', type: 'string', initialValue: 'View projects' },
    { name: 'ctaHref', type: 'string', initialValue: '/projects' },
  ],
};
```

### `teamMember`

```ts
export default {
  name: 'teamMember',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', validation: r => r.required() },
    { name: 'role', type: 'string' },
    { name: 'photo', type: 'image', options: { hotspot: true } },
    { name: 'bio', type: 'text', rows: 4 },
    { name: 'order', type: 'number', initialValue: 100 },
  ],
};
```

### `inquiry` (read-only — written by the contact-form function)

```ts
export default {
  name: 'inquiry',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', readOnly: true },
    { name: 'email', type: 'string', readOnly: true },
    { name: 'phone', type: 'string', readOnly: true },
    { name: 'message', type: 'text', readOnly: true },
    { name: 'projectInterest', type: 'string', readOnly: true },
    { name: 'submittedAt', type: 'datetime', readOnly: true },
    { name: 'status', type: 'string',
      options: { list: ['new', 'replied', 'archived'] }, initialValue: 'new' },
    { name: 'notes', type: 'text', rows: 3,
      description: 'Internal notes — only the team sees these' },
  ],
  orderings: [{
    name: 'newest',
    by: [{ field: 'submittedAt', direction: 'desc' }],
  }],
};
```

`status` and `notes` are editable; everything else is locked so the designer
can't accidentally rewrite history of a real inquiry.

## Singleton enforcement

In `apps/studio/desk/structure.ts`:

```ts
import { StructureBuilder as S } from 'sanity/desk';

export const structure = (S: S) =>
  S.list().title('Content').items([
    S.listItem().title('Company info').child(
      S.document().schemaType('company').documentId('company'),
    ),
    S.listItem().title('Homepage hero').child(
      S.document().schemaType('hero').documentId('hero'),
    ),
    S.divider(),
    S.documentTypeListItem('project').title('Projects'),
    S.documentTypeListItem('projectCategory').title('Categories'),
    S.documentTypeListItem('teamMember').title('Team'),
    S.divider(),
    S.documentTypeListItem('inquiry').title('Inquiries (from contact form)'),
  ]);
```

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
