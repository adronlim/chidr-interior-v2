import { useQuery } from '@tanstack/react-query';
import { hero as dummy } from '@/lib/dummy-data';
import { sanity, sanityEnabled } from '@/lib/sanity';
import { HERO_QUERY } from '@/lib/queries';
import type { Hero } from '@/lib/types';

export function useHero() {
  return useQuery({
    queryKey: ['hero'],
    queryFn: async (): Promise<Hero> => {
      if (sanityEnabled && sanity) return sanity.fetch(HERO_QUERY);
      return dummy;
    },
    staleTime: 5 * 60_000,
  });
}
