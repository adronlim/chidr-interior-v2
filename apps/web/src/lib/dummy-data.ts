// Dummy seed data used until Sanity is provisioned. The 9 project titles
// come from chidr.com.my; year/location/area/description are flagged DUMMY
// and should be confirmed with the designer.
import type {
  Company,
  Hero,
  Project,
  ProjectCategory,
  TeamMember,
  Testimonial,
} from './types';

const placeholder = (width: number, height: number, text: string, dark = false) => {
  const background = dark ? '1A1A1A' : 'F5F1EA';
  const foreground = dark ? 'F5F1EA' : '1A1A1A';
  const encoded = encodeURIComponent(text);
  return `https://placehold.co/${width}x${height}/${background}/${foreground}?text=${encoded}&font=playfair`;
};

const gallery = (title: string, count = 5) =>
  Array.from({ length: count }, (_, index) => ({
    url: placeholder(1600, 1100, `${title} · ${index + 1}`),
    alt: `${title} — image ${index + 1}`,
  }));

export const categories: ProjectCategory[] = [
  { _id: 'cat-residential', title: 'Residential', slug: 'residential' },
  { _id: 'cat-commercial', title: 'Commercial', slug: 'commercial' },
  { _id: 'cat-office', title: 'Office', slug: 'office' },
];

export const projects: Project[] = [
  {
    _id: 'p-desa-pinang',
    title: 'Desa Pinang',
    slug: 'desa-pinang',
    category: { title: 'Residential', slug: 'residential' },
    year: 2023,
    location: 'Penang', // DUMMY — confirm with designer
    areaSqft: 1450,
    featured: true,
    coverImage: { url: placeholder(1600, 1100, 'Desa Pinang'), alt: 'Desa Pinang cover' },
    gallery: gallery('Desa Pinang'),
    // DUMMY — replace with a real walkthrough URL. "Me at the zoo" is the
    // first YouTube video ever uploaded; safe as a permanent placeholder.
    videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    description: [
      'A warm, daylight-led renovation of a corner apartment in Desa Pinang. Open kitchen with a stone island, soft oak joinery, and a quiet palette of bone and ash.',
      'The brief was a family home that aged gracefully — no statement pieces, no trend-chasing. Materials were chosen for how they would look in ten years, not ten months.',
    ],
    order: 1,
  },
  {
    _id: 'p-quaywest-residence',
    title: 'QuayWest Residence',
    slug: 'quaywest-residence',
    category: { title: 'Residential', slug: 'residential' },
    year: 2022,
    location: 'Bayan Lepas, Penang',
    areaSqft: 1620,
    featured: true,
    coverImage: { url: placeholder(1600, 1100, 'QuayWest Residence'), alt: 'QuayWest Residence' },
    gallery: gallery('QuayWest'),
    description: [
      'High-floor unit with sea views — the design recedes to let the horizon do the work. Floor-to-ceiling sheers, low-slung furniture, and a single brass detail in the dining area.',
    ],
    order: 2,
  },
  {
    _id: 'p-queen-residence',
    title: 'Queen Residence',
    slug: 'queen-residence',
    category: { title: 'Residential', slug: 'residential' },
    year: 2022,
    location: 'George Town, Penang',
    areaSqft: 1280,
    featured: false,
    coverImage: { url: placeholder(1600, 1100, 'Queen Residence'), alt: 'Queen Residence' },
    gallery: gallery('Queen Residence'),
    description: [
      'A compact two-bedroom turned into a generous one-plus-study. Removing the second bedroom freed the floor plan for a long library wall and a reading nook by the window.',
    ],
    order: 3,
  },
  {
    _id: 'p-the-marin',
    title: 'The Marin',
    slug: 'the-marin',
    category: { title: 'Residential', slug: 'residential' },
    year: 2023,
    location: 'Tanjung Tokong, Penang',
    areaSqft: 1380,
    featured: true,
    coverImage: { url: placeholder(1600, 1100, 'The Marin'), alt: 'The Marin' },
    gallery: gallery('The Marin'),
    description: [
      'Coastal apartment with bleached timber floors and a kitchen that doubles as the social heart of the home. Curved island, cane pendants, and stone counters.',
    ],
    order: 4,
  },
  {
    _id: 'p-the-zen',
    title: 'The Zen',
    slug: 'the-zen',
    category: { title: 'Residential', slug: 'residential' },
    year: 2021,
    location: 'Sungai Ara, Penang',
    areaSqft: 1100,
    featured: false,
    coverImage: { url: placeholder(1600, 1100, 'The Zen'), alt: 'The Zen' },
    gallery: gallery('The Zen'),
    description: [
      'Minimal apartment built around a single courtyard view. Tatami-inspired guest room and a tea corner at the entryway.',
    ],
    order: 5,
  },
  {
    _id: 'p-waterside-residence',
    title: 'Waterside Residence',
    slug: 'waterside-residence',
    category: { title: 'Residential', slug: 'residential' },
    year: 2022,
    location: 'Gelugor, Penang',
    areaSqft: 1750,
    featured: false,
    coverImage: { url: placeholder(1600, 1100, 'Waterside Residence'), alt: 'Waterside Residence' },
    gallery: gallery('Waterside'),
    description: [
      'Three-bedroom family home with a shared study and a long dining table that seats ten. Brass accents balanced against limewashed walls.',
    ],
    order: 6,
  },
  {
    _id: 'p-beacon-executive-suites',
    title: 'Beacon Executive Suites',
    slug: 'beacon-executive-suites',
    category: { title: 'Commercial', slug: 'commercial' },
    year: 2023,
    location: 'George Town, Penang',
    areaSqft: 2400,
    featured: true,
    coverImage: { url: placeholder(1600, 1100, 'Beacon Executive Suites'), alt: 'Beacon Suites' },
    gallery: gallery('Beacon Suites', 6),
    description: [
      'Boutique serviced-suite floor with a hotel-grade reception and four turndown-ready apartments. Joinery doubles as concealed storage; lighting is layered to feel residential at night.',
    ],
    order: 7,
  },
  {
    _id: 'p-imperial-grande',
    title: 'Imperial Grande',
    slug: 'imperial-grande',
    category: { title: 'Residential', slug: 'residential' },
    year: 2024,
    location: 'Pulau Tikus, Penang',
    areaSqft: 2100,
    featured: true,
    coverImage: { url: placeholder(1600, 1100, 'Imperial Grande'), alt: 'Imperial Grande' },
    gallery: gallery('Imperial Grande', 6),
    description: [
      'A larger-format unit reimagined as a single, continuous loft. The brief asked for the calm of a hotel suite; we delivered it with vein-matched stone, deep walnut joinery, and very little else.',
    ],
    order: 8,
  },
  {
    _id: 'p-jelutong-office',
    title: 'Jelutong Office',
    slug: 'jelutong-office',
    category: { title: 'Office', slug: 'office' },
    year: 2023,
    location: 'Jelutong, Penang',
    areaSqft: 1900,
    featured: false,
    coverImage: { url: placeholder(1600, 1100, 'Jelutong Office'), alt: 'Jelutong Office' },
    gallery: gallery('Jelutong Office'),
    description: [
      'A working office that doesn\'t look like one. Acoustic ceiling baffles wrapped in linen, oak desks in lieu of melamine, and a real kitchen instead of a pantry.',
    ],
    order: 9,
  },
];

export const company: Company = {
  name: 'CH iDesign & Renovation',
  tagline: 'Spaces that quietly endure.',
  // DUMMY contact info — replace with real values via Sanity
  address: 'Lot 00, Jalan Macalister,\n10400 George Town, Penang, Malaysia',
  phone: '+60 4-000 0000',
  email: 'hello@chidr.com.my',
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.9!2d100.31!3d5.42!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0!2sPenang!5e0!3m2!1sen!2smy!4v1700000000000',
  socials: [
    { platform: 'instagram', url: 'https://instagram.com/chidr' },
    { platform: 'facebook', url: 'https://facebook.com/chidr' },
    // DUMMY number — replace with the studio's real WhatsApp line via Sanity
    { platform: 'whatsapp', url: 'https://wa.me/60123456789' },
    { platform: 'email', url: 'mailto:hello@chidr.com.my' },
  ],
  services: [
    {
      title: 'Interior Design',
      description: 'Full design service from brief to handover, for homes that age well.',
      icon: 'pencil-ruler',
    },
    {
      title: 'Renovation',
      description: 'Build-out, joinery, and finishes managed end-to-end with trusted contractors.',
      icon: 'hammer',
    },
    {
      title: 'Space Planning',
      description: 'Floor-plan reconfiguration for apartments and small commercial spaces.',
      icon: 'layout-grid',
    },
  ],
};

export const hero: Hero = {
  heading: 'Spaces that quietly endure.',
  subheading:
    'Residential, commercial and office interiors based in Penang. Considered detailing, restrained palettes, and rooms that age gracefully.',
  image: { url: placeholder(1600, 2000, 'Hero'), alt: 'Hero image' },
  ctaLabel: 'View projects',
  ctaHref: '/projects',
};

// DUMMY — replace once the designer provides real team info
export const team: TeamMember[] = [
  {
    _id: 't-1',
    name: 'Chai H.',
    role: 'Principal Designer',
    photo: { url: placeholder(800, 1000, 'Principal'), alt: 'Principal' },
    bio: 'Fifteen years of residential and small commercial work across Penang and KL.',
    order: 1,
  },
  {
    _id: 't-2',
    name: 'Wei L.',
    role: 'Project Lead',
    photo: { url: placeholder(800, 1000, 'Project Lead'), alt: 'Project Lead' },
    bio: 'Runs site coordination and joinery detailing.',
    order: 2,
  },
  {
    _id: 't-3',
    name: 'Mei Y.',
    role: 'Designer',
    photo: { url: placeholder(800, 1000, 'Designer'), alt: 'Designer' },
    bio: 'Materials, FF&E, and styling.',
    order: 3,
  },
  {
    _id: 't-4',
    name: 'Hafiz R.',
    role: 'Site Manager',
    photo: { url: placeholder(800, 1000, 'Site Manager'), alt: 'Site Manager' },
    bio: 'Quality control on every build, from demo to handover.',
    order: 4,
  },
];

export const testimonials: Testimonial[] = [
  {
    _id: 'q-1',
    quote:
      'They listened. The home feels like ours — only better. Two years on and nothing looks dated.',
    author: 'Mr. & Mrs. Tan',
    role: 'Owners, QuayWest Residence',
  },
];
