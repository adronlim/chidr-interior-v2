# CH iDesign Template Versions

## Overview
All template versions are located in `template-versions/` directory. Each version represents a distinct design iteration for the standalone HTML template.

---

## v0 – Classic (Baseline)
**File:** `inner-template-v0-classic.html`  
**Status:** ✓ Complete baseline  
**Date:** 2026-06-02

### Design Approach
- Clean, centered layout with gentle bone/ink/brass color palette
- Hero section: centered text overlay on light placeholder background
- Emphasis on whitespace and editorial typography
- Standard grid layouts for projects and team
- Full-height hero with centered content

### Key Features
- Featured projects in 3-column grid
- Service section with emoji icons
- Split-layout about teaser
- Masonry-grid projects page
- Standard contact form with sidebar
- All 4 pages: Home, Projects, About, Contact

### CSS Characteristics
- Hero: centered, light background
- Grid-based layouts
- Minimal dark overlays
- Service icons: emoji-based
- Nav links: ink-colored

---

## v1 – Inner Inspired (Editorial)
**File:** `inner-template-v1-inner-inspired.html`  
**Status:** ✓ Refined design direction  
**Date:** 2026-06-02

### Design Approach
Based on the ThemeForest "Inner" template aesthetic:
- Dark hero with dramatic left-aligned text overlay
- Split editorial layouts with image + content cards
- Brass accent colors in navigation and service numbers
- Magazine-like composition with generous imagery
- Professional, sophisticated visual hierarchy

### Key Features
- **Hero:** Dark gradient background, white text aligned left, full-viewport height
- **Welcome section:** Image-left + content-right split layout with inline stats
- **Services:** Numbered icons (01, 02, 03) in brass color for editorial feel
- **Navigation:** Brass-colored nav links for visual hierarchy
- **Projects preview:** 3-column grid on homepage
- **Maintained:** Full functionality of all 4 pages

### CSS Characteristics
- Hero: dark (#2a2a2a), left-aligned content
- Welcome content: semi-transparent white background overlay
- Service icons: large brass numbered text (Cormorant Garamond)
- Nav links: brass color with underline animation
- Typography: stronger visual hierarchy

### Changes from v0
- Hero background: light → dark gradient
- Hero text alignment: center → left
- Service icons: emoji → brass numbers
- Nav link color: ink → brass
- Added welcome section with split layout + inline stats
- Added projects preview section on home

---

## Comparison Matrix

| Aspect | v0 Classic | v1 Inner Inspired |
|--------|-----------|-------------------|
| Hero alignment | Center | Left |
| Hero background | Light (#E2DCD2) | Dark (#2a2a2a gradient) |
| Hero text color | White | White (on dark) |
| Nav link color | Ink | Brass |
| Service icons | Emoji | Brass numbers |
| Welcome section | No | Yes (split layout + stats) |
| Tone | Clean, minimal | Editorial, sophisticated |
| Image treatment | Neutral backgrounds | Part of layout composition |
| Typography hierarchy | Gentle | Strong |

---

## Switching Between Versions

Each version is standalone — no external dependencies.

To use v0:
```bash
cp template-versions/inner-template-v0-classic.html inner-template.html
```

To use v1:
```bash
cp template-versions/inner-template-v1-inner-inspired.html inner-template.html
```

Or open directly in browser:
- `template-versions/inner-template-v0-classic.html`
- `template-versions/inner-template-v1-inner-inspired.html`

---

## Future Versions

Potential iterations:
- **v2:** Dark mode variant (dark background, light text throughout)
- **v2:** Mobile-first refinement (enhanced responsive behavior)
- **v3:** Animation + scroll effects (reveal animations, parallax)
- **v4:** Integration variant (Vite component-compatible version for React)

---

## Notes for Developers

- All versions use the same color tokens (--bone, --ink, --brass, etc.)
- All versions are responsive (mobile-first from 640px, 1024px breakpoints)
- No external CSS frameworks or JavaScript libraries — vanilla HTML/CSS/JS
- Placeholder images use `<div>` with aspect-ratio + background color
- All content sourced from `apps/web/src/lib/dummy-data.ts`
