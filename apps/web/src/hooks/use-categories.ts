import { useQuery } from '@tanstack/react-query';
import { categories as dummy } from '@/lib/dummy-data';
import { sanity, sanityEnabled } from '@/lib/sanity';
import { CATEGORIES_QUERY } from '@/lib/queries';
import type { ProjectCategory } from '@/lib/types';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<ProjectCategory[]> => {
      if (sanityEnabled && sanity) return sanity.fetch(CATEGORIES_QUERY);
      return dummy;
    },
    staleTime: 10 * 60_000,
  });
}
