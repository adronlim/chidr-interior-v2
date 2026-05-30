import { useQuery } from '@tanstack/react-query';
import { projects as dummy } from '@/lib/dummy-data';
import { sanity, sanityEnabled } from '@/lib/sanity';
import { PROJECTS_QUERY } from '@/lib/queries';
import type { CategorySlug, Project } from '@/lib/types';

export function useProjects(category?: CategorySlug) {
  return useQuery({
    queryKey: ['projects', category ?? 'all'],
    queryFn: async (): Promise<Project[]> => {
      if (sanityEnabled && sanity) {
        return sanity.fetch(PROJECTS_QUERY, { category: category ?? null });
      }
      const sorted = [...dummy].sort((first, second) => first.order - second.order);
      return category ? sorted.filter((project) => project.category.slug === category) : sorted;
    },
    staleTime: 60_000,
  });
}
