// Presentational copy for marketing sections that aren't (yet) CMS-backed.
// DUMMY figures and wording — confirm with the designer before launch. Kept
// separate from dummy-data.ts (which mirrors Sanity document shapes) because
// these are page-content constants, not data-layer types.

export interface ProcessStep {
  no: string;
  title: string;
  description: string;
}

export const process: ProcessStep[] = [
  {
    no: '01',
    title: 'Concept',
    description:
      'We start with how you live and work in the space — light, flow, and the feeling you want each room to hold. Briefing, site survey, and a clear scope.',
  },
  {
    no: '02',
    title: 'Design',
    description:
      'Plans, palettes, and joinery worked out in detail. Restrained material boards and 3D views so nothing about the outcome is a surprise.',
  },
  {
    no: '03',
    title: 'Build',
    description:
      'Build-out managed end-to-end with trusted contractors. Quality control on every visit, from demolition to a turndown-ready handover.',
  },
];

export interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

// DUMMY — replace with real figures from the designer.
export const stats: Stat[] = [
  { value: 15, suffix: '+', label: 'Years of practice' },
  { value: 120, suffix: '+', label: 'Projects completed' },
  { value: 9, suffix: '', label: 'Awards & features' },
  { value: 100, suffix: '%', label: 'Penang-based team' },
];
