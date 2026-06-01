# CH iDesign HTML Template Versions

Self-contained HTML templates for CH iDesign & Renovation website, with multiple design iterations tracked via semantic versioning.

## Quick Start

### Option 1: Use Default (v0 Classic)
The main `inner-template.html` in the root is always the baseline version. Open it directly in your browser:
```bash
open ../inner-template.html
```

### Option 2: Try Inner-Inspired Design (v1)
For the editorial, sophisticated design direction inspired by the ThemeForest "Inner" template:
```bash
open inner-template-v1-inner-inspired.html
```

## Files

| File | Version | Design Style | Status |
|------|---------|--------------|--------|
| `inner-template-v0-classic.html` | v0 | Clean, minimal, centered | ✓ Baseline |
| `inner-template-v1-inner-inspired.html` | v1 | Editorial, dark hero, left-aligned | ✓ Refined |

See `VERSION.md` for detailed comparison and design rationale.

## How to Switch Versions

If you want to use v1 as the main template:

```bash
cp inner-template-v1-inner-inspired.html ../inner-template.html
```

To revert to v0:

```bash
cp inner-template-v0-classic.html ../inner-template.html
```

## What's Included

All templates contain:
- **4 full pages:** Home, Projects, About, Contact
- **Responsive design:** Mobile-first (640px, 1024px breakpoints)
- **No dependencies:** Vanilla HTML/CSS/JavaScript — works offline
- **Design tokens:** Consistent color palette (bone, ink, brass, line, canvas)
- **Placeholder images:** No external image requests
- **Smooth navigation:** Anchor links with scroll behavior
- **Form ready:** Contact form structure (action endpoint customizable)

## Features by Section

### Home Page
- Hero section with CTA
- Featured projects (3-column grid)
- Services/process section
- Stats display
- Testimonial
- CTA banner

### Projects Page
- Project grid with masonry layout
- Category filter pills
- Hover effects
- Responsive columns (1 → 2 → 3)

### About Page
- Studio narrative (split layout)
- Principles section
- Team member profiles (4 circular photos)
- Stats repeated for emphasis

### Contact Page
- Contact form (name, email, phone, project type, message)
- Info sidebar (address, contact, hours)
- Map placeholder
- 2-column layout (form + info)

## Customization

### Colors
Edit CSS variables at the top of the `<style>` block:
```css
:root {
    --bone: #F5F1EA;      /* background */
    --ink: #1A1A1A;       /* text */
    --ash: #8A8580;       /* muted text */
    --brass: #A6814C;     /* accent */
    --line: #E2DCD2;      /* borders */
    --canvas: #FFFFFF;    /* white panels */
}
```

### Content
Replace all instances of:
- `CH iDesign` → your studio name
- Project names, years, categories from dummy data
- Team member names and roles
- Contact info (address, phone, email)

### Fonts
Currently uses Google Fonts:
- `Cormorant Garamond` (display/headings)
- `Inter` (body/UI)

Change by updating the font-family in CSS or swapping the `@import` link.

### Images
Replace placeholder `<div class="image-placeholder">` with real `<img>` tags:
```html
<!-- Before -->
<div class="image-placeholder">Photo</div>

<!-- After -->
<img src="path/to/image.jpg" alt="Project name">
```

## Deployment

These are static HTML files — no build step required. Deploy directly:

```bash
# To Netlify, GitHub Pages, or any static host
cp inner-template.html path/to/deployment/

# Or use as a reference during React/Vite development
# styles and layouts can be adapted to the Vite app at apps/web/
```

## Version History

- **v0** (2026-06-02): Baseline classic design
- **v1** (2026-06-02): Inner-inspired editorial direction

See `VERSION.md` for detailed changelog.

## Notes

- All templates use the same dummy data structure for consistency
- No JavaScript beyond simple nav/form interactions
- CSS is inline for self-contained distribution
- Responsive behavior tested at 375px, 768px, 1024px breakpoints
- Google Fonts require internet; fallbacks to system fonts
