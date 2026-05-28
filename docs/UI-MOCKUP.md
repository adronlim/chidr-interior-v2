# UI mockup

Visual direction for the revamp. Reference: ThemeForest **Inner – Interior
Design & Architecture Template Kit** (warm minimal, large editorial typography,
generous whitespace, masonry portfolios). Adapted to CH iDesign &
Renovation's existing project list and Malaysian residential context.

> The Figma file lives at `<link to be added>`. This document is the source of
> truth when Figma and Figma disagree with code — update it when design changes.

## Design language

| Principle | What it means in practice |
| --- | --- |
| **Restraint** | Lots of whitespace. One accent color. Photography does the heavy lifting. |
| **Editorial** | Serif display headings, justified-left long-form text, named sections like a magazine. |
| **Tactile warmth** | Bone (off-white) backgrounds, ink (near-black) type, brass accent — feels like a sample-board, not a CMS. |
| **Photo-first** | Every section has at least one full-bleed image. Projects open with a hero shot, not a heading. |

## Color tokens

```css
/* src/styles/tokens.css */
:root {
  --color-bone:    #F5F1EA;  /* page background */
  --color-ink:     #1A1A1A;  /* primary text */
  --color-ash:     #8A8580;  /* secondary text, meta */
  --color-brass:   #A6814C;  /* accent — links, hover underlines, small details */
  --color-line:    #E2DCD2;  /* hairline dividers */
  --color-canvas:  #FFFFFF;  /* card backgrounds when contrast is needed */
}
```

Dark mode: deferred. The aesthetic depends on the bone background; a dark mode
would compromise the brand more than it would help.

## Typography

| Token | Family | Use |
| --- | --- | --- |
| `font-display` | Cormorant Garamond, serif | h1, h2, hero text, project titles in cards |
| `font-sans` | Inter, sans-serif | Body, nav, buttons, meta |

Scale (mobile → desktop, fluid via `clamp()`):

```
display-xl   clamp(2.5rem, 6vw, 5.5rem)    -- hero
display-lg   clamp(2rem, 4vw, 3.5rem)      -- section headings
display-md   clamp(1.5rem, 2.5vw, 2rem)    -- project titles
body-lg      1.125rem                       -- intro paragraphs
body         1rem                           -- default
caption      0.875rem                       -- meta, footer
```

Letter spacing: tight on serif headings (`-0.02em`), wide on small-caps nav (`0.12em`).

## Spacing scale

8px base. Tailwind defaults work; the only addition is `section` for the
between-section rhythm:

```ts
spacing: { section: '8rem' }   // 128px between major sections, desktop
```

On mobile, override to `4rem` via `lg:py-section`.

## Layout grid

- Max content width: `88rem` (1408px) — wider than typical for full-bleed photography
- Page gutters: `1.5rem` mobile, `4rem` desktop
- 12-column grid on desktop, 4-column on mobile
- Masonry portfolio uses CSS `columns: 2/3` (no JS library)

## Breakpoints

```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

Design hand-off at 375 (iPhone SE), 768 (iPad), and 1440 (desktop). Anything
between is interpolated.

## Page wireframes

### Home

```
┌───────────────────────────────────────────────────────────┐
│  NAV   [logo]                       HOME PROJECT ABOUT … │  ← thin, on bone
├───────────────────────────────────────────────────────────┤
│                                                           │
│   Spaces that quietly endure.            ┌──────────────┐ │
│   Residential and commercial             │              │ │
│   interiors based in Penang.             │   HERO IMG   │ │  ← full-bleed
│   ─── View projects ─→                   │              │ │     on the right
│                                          └──────────────┘ │
│                                                           │
├───────────────────────────────────────────────────────────┤
│   FEATURED WORK                                           │
│   ┌────────────┐  ┌────────────┐  ┌────────────┐         │
│   │            │  │            │  │            │          │
│   │ Desa Pinang│  │ The Marin  │  │ The Zen    │   …      │
│   └────────────┘  └────────────┘  └────────────┘          │
│   2023 · Residential  2023 · Residential  2021 · Residential
├───────────────────────────────────────────────────────────┤
│   WHAT WE DO                                              │
│   ── Interior Design  ── Renovation  ── Space Planning    │
├───────────────────────────────────────────────────────────┤
│   QUOTE / TESTIMONIAL  (single, large, serif)             │
├───────────────────────────────────────────────────────────┤
│   FOOTER  [logo]  contact · address · socials · ©         │
└───────────────────────────────────────────────────────────┘
```

### Projects (index)

```
┌───────────────────────────────────────────────────────────┐
│  NAV                                                       │
├───────────────────────────────────────────────────────────┤
│  PROJECTS                                                  │
│  All  /  Residential  /  Commercial  /  Office             │  ← filter chips
│                                                            │
│  ┌────────┐ ┌──────────┐ ┌────────┐                       │
│  │        │ │          │ │        │                       │  ← masonry
│  │        │ │          │ │        │                       │
│  └────────┘ │          │ └────────┘                       │
│  ┌────────┐ └──────────┘ ┌────────┐                       │
│  │        │  ┌────────┐  │        │                       │
│  │        │  │        │  │        │                       │
│  └────────┘  └────────┘  └────────┘                       │
└───────────────────────────────────────────────────────────┘
```

Hover state on cards: image desaturates 8%, title slides up with brass underline.

### Project detail (`/projects/:slug`)

```
┌───────────────────────────────────────────────────────────┐
│                                                           │
│             FULL-BLEED HERO IMAGE                          │
│                                                           │
├──────────────────────┬────────────────────────────────────┤
│                      │  Desa Pinang                       │
│   Long-form          │  ─────────                          │
│   description        │  Year       2023                   │
│   in serif body,     │  Location   Penang                 │
│   pulled from        │  Area       1,450 sqft             │
│   portable-text      │  Category   Residential            │
│   in Sanity.         │                                    │
│                      │  ┌──────────────────────────────┐  │
│                      │  │ Inquire about a project  →   │  │
│                      │  └──────────────────────────────┘  │
├──────────────────────┴────────────────────────────────────┤
│   GALLERY (4–8 images, click → lightbox)                  │
├───────────────────────────────────────────────────────────┤
│   YOU MAY ALSO LIKE  (3 related projects)                 │
└───────────────────────────────────────────────────────────┘
```

### About

```
┌───────────────────────────────────────────────────────────┐
│  About us — split hero (text left, photo right)            │
├───────────────────────────────────────────────────────────┤
│  Our approach (3 columns: principle / process / outcome)   │
├───────────────────────────────────────────────────────────┤
│  Team grid (4 cards: photo, name, role)                    │  ← DUMMY data
├───────────────────────────────────────────────────────────┤
│  CTA — "Have a space in mind? Let's talk." → /contact     │
└───────────────────────────────────────────────────────────┘
```

### Contact

```
┌───────────────────────────────────────────────────────────┐
│  Get in touch.                                             │
├──────────────────────┬────────────────────────────────────┤
│  Form                │  Address  (DUMMY)                  │
│  ─────               │  Phone    (DUMMY)                  │
│  Name [____________] │  Email    (DUMMY)                  │
│  Email [___________] │  Hours    (DUMMY)                  │
│  Phone [___________] │                                    │
│  Project interest    │  ┌─────────────────────────────┐  │
│   [select  v]        │  │                             │  │
│  Message             │  │     GOOGLE MAPS EMBED       │  │
│   [_____________]    │  │                             │  │
│   [_____________]    │  └─────────────────────────────┘  │
│   [Send inquiry  →]  │                                    │
└──────────────────────┴────────────────────────────────────┘
```

### Mobile adaptations

- Nav collapses to a hamburger; menu slides in from the right
- Hero image stacks **below** the heading
- Project grid collapses to single column
- Project detail meta sidebar moves above the gallery
- Contact form fills the width; map drops below the form

## Component inventory

| Component | Props (sketch) | Used on |
| --- | --- | --- |
| `<Nav>` | `links`, `logo` | every page |
| `<Footer>` | `company` | every page |
| `<Hero>` | `heading`, `subheading`, `image`, `cta` | Home, About |
| `<ProjectCard>` | `project` | Home (featured), Projects |
| `<ProjectGrid>` | `projects`, `variant: 'masonry' \| 'grid'` | Projects |
| `<FilterChips>` | `categories`, `active`, `onChange` | Projects |
| `<Gallery>` | `images` | Project detail |
| `<MetaList>` | `items: {label, value}[]` | Project detail |
| `<RichText>` | `value: PortableTextBlock[]` | Project detail, About |
| `<ContactForm>` | `categories` | Contact |
| `<SectionTitle>` | `children`, `eyebrow?` | many |

## Interactions / motion

Keep it minimal — overdoing animation feels unserious for an architecture studio.

- **Page transitions:** 200ms fade between routes (`framer-motion` `AnimatePresence`)
- **Image reveal:** `opacity 0 → 1` + 8px upward shift over 400ms on viewport enter
- **Card hover (desktop only):** image desaturates 8%, title gains brass underline
- **No** scroll-jacking, no parallax, no auto-playing video

Respect `prefers-reduced-motion`: disable all of the above.

## Mockup deliverables

- Figma file: `<TODO — share link once first round is approved>`
- Style guide page in Figma with all tokens + components
- Three rounds expected: low-fi wires → mid-fi (this doc) → hi-fi pixel-final

## Diffs from the existing site

| Existing chidr.com.my | Revamp |
| --- | --- |
| Default Wix-style nav | Editorial thin nav with small-caps labels |
| Generic project tiles, no filter | Categorized masonry with filter chips and hover state |
| No project detail pages | Full project detail with meta, gallery, related work |
| No contact form | Validated form with map and inquiry tracking |
| Single contact section | Dedicated About + Contact pages |
| Manual HTML edits to publish | Designer-friendly CMS at `chidr.sanity.studio` |
