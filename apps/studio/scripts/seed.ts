/**
 * Seed initial content into Sanity.
 *
 * Prerequisites in apps/studio/.env:
 *   SANITY_STUDIO_PROJECT_ID  — created via `yarn workspace studio exec sanity init`
 *   SANITY_STUDIO_DATASET     — e.g. "production"
 *   SANITY_AUTH_TOKEN         — Editor-scoped token from sanity.io → API → Tokens
 *
 * Run: yarn workspace studio seed
 *
 * Creates the 9 known projects without images. The designer fills coverImage
 * and gallery in Studio during their first session.
 */
import 'dotenv/config';
import { createClient } from '@sanity/client';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';
const token = process.env.SANITY_AUTH_TOKEN;

if (!projectId || !token) {
  console.error(
    'Missing SANITY_STUDIO_PROJECT_ID or SANITY_AUTH_TOKEN. Copy apps/studio/.env.example to .env and fill them in.',
  );
  process.exit(1);
}

const sanity = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  token,
  useCdn: false,
});

const categories = [
  { _id: 'category-residential', _type: 'projectCategory', title: 'Residential', slug: { _type: 'slug', current: 'residential' } },
  { _id: 'category-commercial', _type: 'projectCategory', title: 'Commercial', slug: { _type: 'slug', current: 'commercial' } },
  { _id: 'category-office', _type: 'projectCategory', title: 'Office', slug: { _type: 'slug', current: 'office' } },
];

const projects = [
  { title: 'Desa Pinang', slug: 'desa-pinang', cat: 'residential', year: 2023, location: 'Penang', order: 1, featured: true },
  { title: 'QuayWest Residence', slug: 'quaywest-residence', cat: 'residential', year: 2022, location: 'Bayan Lepas, Penang', order: 2, featured: true },
  { title: 'Queen Residence', slug: 'queen-residence', cat: 'residential', year: 2022, location: 'George Town, Penang', order: 3, featured: false },
  { title: 'The Marin', slug: 'the-marin', cat: 'residential', year: 2023, location: 'Tanjung Tokong, Penang', order: 4, featured: true },
  { title: 'The Zen', slug: 'the-zen', cat: 'residential', year: 2021, location: 'Sungai Ara, Penang', order: 5, featured: false },
  { title: 'Waterside Residence', slug: 'waterside-residence', cat: 'residential', year: 2022, location: 'Gelugor, Penang', order: 6, featured: false },
  { title: 'Beacon Executive Suites', slug: 'beacon-executive-suites', cat: 'commercial', year: 2023, location: 'George Town, Penang', order: 7, featured: true },
  { title: 'Imperial Grande', slug: 'imperial-grande', cat: 'residential', year: 2024, location: 'Pulau Tikus, Penang', order: 8, featured: true },
  { title: 'Jelutong Office', slug: 'jelutong-office', cat: 'office', year: 2023, location: 'Jelutong, Penang', order: 9, featured: false },
];

async function run() {
  console.log('› Categories');
  for (const c of categories) {
    await sanity.createOrReplace(c);
    console.log(`  ✓ ${c.title}`);
  }

  console.log('› Company singleton');
  await sanity.createOrReplace({
    _id: 'company',
    _type: 'company',
    name: 'CH iDesign & Renovation',
    tagline: 'Spaces that quietly endure.',
    address: 'Lot 00, Jalan Macalister,\n10400 George Town, Penang, Malaysia',
    phone: '+60 4-000 0000',
    email: 'hello@chidr.com.my',
    socials: [
      { _key: 's1', platform: 'instagram', url: 'https://instagram.com/chidr' },
      { _key: 's2', platform: 'facebook', url: 'https://facebook.com/chidr' },
    ],
    services: [
      { _key: 'sv1', title: 'Interior Design', description: 'Full design service from brief to handover, for homes that age well.', icon: 'pencil-ruler' },
      { _key: 'sv2', title: 'Renovation', description: 'Build-out, joinery and finishes managed end-to-end.', icon: 'hammer' },
      { _key: 'sv3', title: 'Space Planning', description: 'Floor-plan reconfiguration for apartments and small commercial spaces.', icon: 'layout-grid' },
    ],
  });
  console.log('  ✓ company');

  console.log('› Hero singleton');
  await sanity.createOrReplace({
    _id: 'hero',
    _type: 'hero',
    heading: 'Spaces that quietly endure.',
    subheading:
      'Residential, commercial and office interiors based in Penang. Considered detailing, restrained palettes, and rooms that age gracefully.',
    ctaLabel: 'View projects',
    ctaHref: '/projects',
  });
  console.log('  ✓ hero');

  console.log('› Projects');
  for (const p of projects) {
    await sanity.createOrReplace({
      _id: `project-${p.slug}`,
      _type: 'project',
      title: p.title,
      slug: { _type: 'slug', current: p.slug },
      category: { _type: 'reference', _ref: `category-${p.cat}` },
      year: p.year,
      location: p.location,
      order: p.order,
      featured: p.featured,
    });
    console.log(`  ✓ ${p.title}`);
  }

  console.log(
    '\nDone. Open Studio (`yarn studio:dev`) and upload coverImage + gallery for each project.',
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
