# Design Revamp — Inner-inspired

The front-end visual design, layout composition, and motion were revamped to
follow the **"Inner – Interior Design & Architecture" template kit** by jegtheme
([live demo](https://templatekit.jegtheme.com/inner/)) — adapted to CH iDesign's
own palette and content. Nothing about the data layer, routing, or Sanity wiring
changed; this is a presentation-layer revamp.

For the underlying tokens and base wireframes see [UI-MOCKUP.md](UI-MOCKUP.md);
for build/config see [FRONTEND.md](FRONTEND.md).

## Principles carried over from the reference

- Editorial, whitespace-led layout with a large serif display face.
- Uppercase eyebrow labels, frequently paired with a short brass rule.
- Calm scroll-reveal motion (fade / slide-up / image clip), light staggering.
- Looping marquee strip, count-up stats, an auto-advancing testimonial carousel.
- Restrained accent use — the brass (`#A6814C`) is the only "color"; everything
  else is bone / ink / ash / line.

## Palette mapping (own colours, not the template's)

| Role | Token | Hex |
| --- | --- | --- |
| Page background | `bone` | `#F5F1EA` |
| Text / dark sections | `ink` | `#1A1A1A` |
| Muted text | `ash` | `#8A8580` |
| Accent (rules, dots, suffixes, active states) | `brass` | `#A6814C` |
| Hairlines / image placeholders | `line` | `#E2DCD2` |
| Card hover fill | `canvas` | `#FFFFFF` |

Type: **Cormorant Garamond** (display) + **Inter** (sans). Unchanged from before.

## Motion system (in-house, zero dependencies)

A library was deliberately avoided to keep the bundle lean (the whole revamp
added ~2.6 KB gzip). The system is three small primitives plus CSS.

| Piece | File | Responsibility |
| --- | --- | --- |
| `useInView` | `apps/web/src/hooks/use-in-view.ts` | IntersectionObserver hook → `{ ref, inView }`. Reveals immediately under `prefers-reduced-motion`. |
| `Reveal` | `apps/web/src/components/reveal.tsx` | Wrapper applying a reveal variant + optional stagger `delay`. |
| `StatCounter` | `apps/web/src/components/stat-counter.tsx` | Counts up from 0 on first view (easeOutCubic, `requestAnimationFrame`). |
| `TestimonialCarousel` | `apps/web/src/components/testimonial-carousel.tsx` | Auto-advancing quotes; dots + arrows; pauses auto-play once the user takes control. |
| Reveal / marquee / fade CSS | `apps/web/src/styles/globals.css` | `.reveal*`, `.marquee*`, `fade-key` keyframes + a reduced-motion override. |

### Reveal variants

| Variant | Effect | Typical use |
| --- | --- | --- |
| `up` (default) | fade + 34px slide up | text blocks, cards |
| `right` | fade + slide in from left | side content |
| `fade` | opacity only | subtle blocks |
| `clip` | `clip-path` wipe upward | hero / feature images |

Stagger a list by passing `delay={index * 80}` (ms) to each `Reveal`.

### Accessibility

`prefers-reduced-motion: reduce` is honoured twice over: `useInView` reports
visible immediately, and a CSS block forces `.reveal` to its final state and
disables the marquee. No content depends on motion to be readable.

## Page composition

| Page | Sections (top → bottom) |
| --- | --- |
| **Home** (`routes/home.tsx`) | Hero (brass eyebrow rule + clip-reveal image) → looping marquee → studio intro + stat counters → featured projects (staggered) → services grid (hairline cells) → "How we work" 3-step process → team grid → testimonial carousel → dark CTA band |
| **Projects** (`routes/projects.tsx`) | Animated header + intro → filter chips → masonry grid (staggers in via `ProjectGrid`) |
| **Project detail** (`routes/project-detail.tsx`) | Clip-reveal cover → revealed title/description + meta aside → walkthrough video → gallery → staggered related grid |
| **About** (`routes/about.tsx`) | Split hero → stats band → three principles → staggered team → dark CTA |
| **Contact** (`routes/contact.tsx`) | Animated header → revealed form + studio info/map |

Shared chrome:

- **Nav** (`components/nav.tsx`) — sticky; solidifies (stronger bg + hairline)
  and shrinks height once scrolled past 8px.
- **Footer** (`components/footer.tsx`) — brand + socials, Visit/Explore, and a
  "Latest projects" thumbnail grid linking into the portfolio.

## Presentational content (not yet CMS-backed)

`apps/web/src/lib/site-content.ts` holds the process steps and the homepage/about
stats. These are **DUMMY** marketing figures — confirm with the designer before
launch:

- Stats: `15+ years`, `120+ projects`, `9 awards`, `100% Penang team`.
- The About "Studio" hero image is still a `placehold.co` URL.

The reference template's hero has a video overlay; CH's hero has no video source,
so an image is used instead. Project walkthrough videos still flow through the
existing `VideoEmbed` (YouTube) component on the detail page.

## Performance

- Bundle after revamp: ~143 KB gzip JS / ~4.7 KB gzip CSS — within the 180 KB
  budget noted in [STANDARDS.md](STANDARDS.md).
- No new runtime dependencies. Motion is CSS transitions + one IntersectionObserver
  per revealed element (disconnected after firing when `once`).
