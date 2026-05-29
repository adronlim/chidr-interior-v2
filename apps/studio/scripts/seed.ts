/**
 * Seed Sanity with CHIDR's initial content.
 *
 * Pre-flight checks (run before any write):
 *   1. Required env vars present in apps/studio/.env
 *   2. Token can actually access the target project — catches the
 *      "wrong account/project" 401 case with an actionable error
 *
 * Then idempotently creates (via createOrReplace):
 *   - 3 categories (Residential, Commercial, Office)
 *   - company singleton
 *   - hero singleton
 *   - 9 project documents (no images — designer uploads in Studio)
 *
 * Flags:
 *   --dry-run    print the plan without writing anything
 *   --verbose    show every doc as it's written
 *
 * Run: yarn studio:seed [--dry-run] [--verbose]
 */
import 'dotenv/config';
import { createClient, type SanityClient } from '@sanity/client';

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const verbose = args.has('--verbose') || dryRun;

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';
const token = process.env.SANITY_AUTH_TOKEN;

// ─── env validation ──────────────────────────────────────────────────────────

function fail(message: string, hint?: string): never {
  console.error(`\x1b[31m✗\x1b[0m ${message}`);
  if (hint) console.error(`  ${hint}`);
  process.exit(1);
}

if (!projectId) {
  fail(
    'Missing SANITY_STUDIO_PROJECT_ID in apps/studio/.env',
    'Copy it from sanity.io → Settings → API → Project ID',
  );
}
if (!token) {
  fail(
    'Missing SANITY_AUTH_TOKEN in apps/studio/.env',
    'Generate at sanity.io → your project → API → Tokens (Editor scope)',
  );
}

const sanity: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  token,
  useCdn: false,
});

// ─── pre-flight: verify the token can see the target project ─────────────────

async function preflight() {
  console.log(`→ Pre-flight check against project "${projectId}"…`);
  const res = await fetch('https://api.sanity.io/v2025-01-01/projects', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) {
    fail(
      'Token rejected by Sanity (401).',
      'SANITY_AUTH_TOKEN is invalid or revoked. Generate a new one.',
    );
  }
  if (!res.ok) {
    fail(`Sanity returned HTTP ${res.status} for project list.`);
  }
  const projects = (await res.json()) as Array<{ id: string; displayName?: string }>;
  const target = projects.find((p) => p.id === projectId);
  if (!target) {
    console.error('\x1b[31m✗\x1b[0m Token has no access to project ' + `"${projectId}".`);
    console.error('  Projects this token CAN access:');
    if (projects.length === 0) {
      console.error('    (none — token is from a Sanity account with no project memberships)');
    } else {
      for (const p of projects) {
        console.error(`    • ${p.displayName ?? p.id} (${p.id})`);
      }
    }
    console.error('');
    console.error('  Recovery:');
    console.error(`    1. Sign in to sanity.io as the account that OWNS project "${projectId}"`);
    console.error('    2. Open that project → API → Tokens → Add API token (Editor scope)');
    console.error('    3. Replace SANITY_AUTH_TOKEN in apps/studio/.env');
    console.error('    4. Revoke the old token (it has now leaked into shell history)');
    process.exit(1);
  }
  console.log(
    `\x1b[32m✓\x1b[0m Token can access "${target.displayName ?? target.id}" (${target.id})`,
  );
}

// ─── content to seed ─────────────────────────────────────────────────────────

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

const company = {
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
};

const hero = {
  _id: 'hero',
  _type: 'hero',
  heading: 'Spaces that quietly endure.',
  subheading:
    'Residential, commercial and office interiors based in Penang. Considered detailing, restrained palettes, and rooms that age gracefully.',
  ctaLabel: 'View projects',
  ctaHref: '/projects',
};

function projectDoc(p: (typeof projects)[number]) {
  return {
    _id: `project-${p.slug}`,
    _type: 'project',
    title: p.title,
    slug: { _type: 'slug', current: p.slug },
    category: { _type: 'reference', _ref: `category-${p.cat}` },
    year: p.year,
    location: p.location,
    order: p.order,
    featured: p.featured,
  };
}

// ─── operations ──────────────────────────────────────────────────────────────

async function upsert(doc: { _id: string; _type: string; [k: string]: unknown }, label: string) {
  if (dryRun) {
    if (verbose) console.log(`  · would upsert ${doc._type}/${doc._id} — ${label}`);
    return;
  }
  await sanity.createOrReplace(doc);
  if (verbose) console.log(`  · ${doc._type}/${doc._id} — ${label}`);
}

async function run() {
  await preflight();

  const totalDocs = categories.length + 2 /* company + hero */ + projects.length;
  console.log(
    `\n${dryRun ? '⚠ DRY RUN — no writes will happen' : '→ Seeding'}: ${totalDocs} documents` +
      ` to dataset "${dataset}".\n`,
  );

  console.log('Categories');
  for (const c of categories) await upsert(c, c.title);

  console.log('Singletons');
  await upsert(company, 'company info');
  await upsert(hero, 'homepage hero');

  console.log('Projects');
  for (const p of projects) await upsert(projectDoc(p), p.title);

  if (dryRun) {
    console.log(`\n\x1b[33m⚠\x1b[0m Dry run complete — nothing was written.`);
  } else {
    console.log(`\n\x1b[32m✓\x1b[0m Done. ${totalDocs} documents upserted.`);
    console.log('  Next: `yarn studio:dev` → open http://localhost:3333 → upload images.');
  }
}

run().catch((err) => {
  console.error('\n\x1b[31m✗\x1b[0m Seed failed:\n');
  console.error(err?.message ?? err);
  process.exit(1);
});
