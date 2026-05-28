# Frontend — `apps/web`

Public showcase site. Vite + React 18 + TypeScript SPA. Reads all content from
Sanity at runtime; no server-side rendering. Static `dist/` deploys to
Netlify/Vercel.

## Stack

| Concern | Choice | Why |
| --- | --- | --- |
| Bundler / dev | Vite 5 | Instant HMR, lean build, good TS story |
| Language | TypeScript 5 (strict) | Catches schema mismatches with Sanity types |
| UI library | React 18 | Required by the brief |
| Routing | React Router 6 (data router) | Loaders pair well with Sanity GROQ queries |
| Styling | Tailwind CSS 3 + a small `tokens.css` | Matches the warm-minimal aesthetic, fast to iterate |
| Data fetching | `@sanity/client` + TanStack Query | Caching, refetching, devtools |
| Image handling | `@sanity/image-url` | Sanity CDN serves resized/cropped images on demand |
| Forms | `react-hook-form` + `zod` | Lightweight, schema-validated contact form |
| Animations | `framer-motion` (sparingly) | Page transitions + image reveals only |
| Icons | `lucide-react` | Consistent stroke icons |
| Testing | Vitest + Testing Library | Component-level; e2e deferred |

## Folder structure

```
apps/web/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx               # entry — sets up Router + QueryClient
│   ├── App.tsx                # layout shell (Nav + <Outlet/> + Footer)
│   ├── routes/
│   │   ├── home.tsx
│   │   ├── projects.tsx       # list + filter
│   │   ├── project-detail.tsx # /projects/:slug
│   │   ├── about.tsx
│   │   └── contact.tsx
│   ├── components/
│   │   ├── nav.tsx
│   │   ├── footer.tsx
│   │   ├── project-card.tsx
│   │   ├── project-grid.tsx   # masonry via CSS columns
│   │   ├── gallery.tsx        # lightbox
│   │   ├── rich-text.tsx      # portable-text renderer
│   │   ├── filter-chips.tsx
│   │   └── contact-form.tsx
│   ├── lib/
│   │   ├── sanity.ts          # client + imageUrlBuilder
│   │   ├── queries.ts         # GROQ strings
│   │   └── types.ts           # generated from Sanity schemas
│   ├── hooks/
│   │   ├── use-projects.ts
│   │   ├── use-project.ts
│   │   └── use-company.ts
│   └── styles/
│       ├── tokens.css         # CSS variables — see UI-MOCKUP.md
│       └── globals.css        # Tailwind base/components/utilities
├── index.html
├── tailwind.config.ts
├── vite.config.ts
├── tsconfig.json
└── .env.example
```

## Routing

```ts
// src/main.tsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'projects', element: <Projects /> },
      { path: 'projects/:slug', element: <ProjectDetail /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
```

Scroll restoration: use `<ScrollRestoration />` from React Router so navigating
between project detail pages doesn't keep the old scroll position.

## Sanity client

```ts
// src/lib/sanity.ts
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanity = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION, // '2025-01-01'
  useCdn: true, // public data — CDN is fine, faster
});

const builder = imageUrlBuilder(sanity);
export const urlFor = (src: unknown) => builder.image(src);
```

## Data fetching pattern

```ts
// src/hooks/use-projects.ts
export function useProjects(category?: string) {
  return useQuery({
    queryKey: ['projects', category ?? 'all'],
    queryFn: () => sanity.fetch(PROJECTS_QUERY, { category: category ?? null }),
    staleTime: 60_000,
  });
}
```

```ts
// src/lib/queries.ts
export const PROJECTS_QUERY = /* groq */ `
  *[_type == "project" && ($category == null || category->slug.current == $category)]
  | order(year desc) {
    _id, title, "slug": slug.current, year, location,
    coverImage, "category": category->{ title, "slug": slug.current }
  }
`;
```

GROQ samples for every page live in [CMS.md](CMS.md).

## Styling

`tailwind.config.ts` extends the theme with tokens from [UI-MOCKUP.md](UI-MOCKUP.md):

```ts
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bone: '#F5F1EA',
        ink: '#1A1A1A',
        ash: '#8A8580',
        brass: '#A6814C',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: { container: '88rem' },
    },
  },
};
```

## Image handling

```tsx
<img
  src={urlFor(project.coverImage).width(1600).fit('crop').auto('format').url()}
  srcSet={`
    ${urlFor(project.coverImage).width(800).url()} 800w,
    ${urlFor(project.coverImage).width(1600).url()} 1600w,
    ${urlFor(project.coverImage).width(2400).url()} 2400w
  `}
  sizes="(max-width: 768px) 100vw, 50vw"
  alt={project.title}
  loading="lazy"
/>
```

Sanity supports image hotspots — `.fit('crop')` will respect the focal point the
designer set in Studio. Critical for cropped hero shots.

## Forms

Contact form posts to a serverless function — see [BACKEND.md](BACKEND.md).

```tsx
const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
  projectInterest: z.string().optional(),
});
```

On submit, write the inquiry to Sanity (via a write token from the function,
not the client) **and** send an email — see [BACKEND.md](BACKEND.md).

## Environment variables

`.env.example` (committed):

```
VITE_SANITY_PROJECT_ID=
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2025-01-01
VITE_CONTACT_ENDPOINT=/.netlify/functions/contact
```

> `VITE_*` vars are embedded in the bundle — they are public. Anything secret
> (write tokens, Resend keys) lives on the function side. See [BACKEND.md](BACKEND.md).

## Build & deploy

```bash
yarn build       # tsc -b && vite build → apps/web/dist
yarn preview     # serve the production build locally
```

Netlify config (`apps/web/netlify.toml`):

```toml
[build]
  command = "yarn build"
  publish = "apps/web/dist"
  base = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[functions]
  directory = "apps/web/netlify/functions"
```

The catch-all redirect is required for client-side routing — without it, a hard
reload on `/projects/desa-pinang` would 404.

## Performance budget

| Metric | Target |
| --- | --- |
| LCP (mobile) | < 2.5s |
| JS bundle (gzipped) | < 180 KB initial |
| Largest image (cover) | < 250 KB at 1600w |
| Lighthouse Performance | ≥ 90 |

Code-split route components with `React.lazy` — keeps initial JS under budget.

## Open changes from the existing site

| Existing | New |
| --- | --- |
| Static HTML, project images in repo | All content from Sanity, designer-editable |
| No admin / login | Sanity Studio at `chidr.sanity.studio` |
| Limited responsive behavior | Mobile-first Tailwind |
| Plain project list | Categorized + filterable grid, detail pages with gallery |
| No contact form | Validated form → email + saved inquiry record |
