import { createClient, type SanityClient } from '@sanity/client';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET ?? 'production';
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION ?? '2025-01-01';

export const sanityEnabled = Boolean(projectId);

export const sanity: SanityClient | null = sanityEnabled
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      // Only ever serve published documents. This excludes Sanity drafts
      // (drafts.* IDs) from the public site even if a read token is added
      // later for previewing — drafts must never appear on the website.
      perspective: 'published',
    })
  : null;
