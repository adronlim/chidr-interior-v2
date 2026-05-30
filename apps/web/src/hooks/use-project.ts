import { useQuery } from '@tanstack/react-query';
import { projects as dummy } from '@/lib/dummy-data';
import { sanity, sanityEnabled } from '@/lib/sanity';
import { PROJECT_DETAIL_QUERY } from '@/lib/queries';
import type { Project } from '@/lib/types';

export interface ProjectDetail extends Project {
  related: Project[];
}

export function useProject(slug: string | undefined) {
  return useQuery({
    queryKey: ['project', slug],
    enabled: Boolean(slug),
    queryFn: async (): Promise<ProjectDetail | null> => {
      if (!slug) 
        return null;
      if (sanityEnabled && sanity) {
        return sanity.fetch(PROJECT_DETAIL_QUERY, { slug });
      }
      const project = dummy.find((candidate) => candidate.slug === slug);
      if (!project) 
        return null;
      const related = dummy
        .filter((candidate) => candidate._id !== project._id && candidate.category.slug === project.category.slug)
        .slice(0, 3);
      return { ...project, related };
    },
  });
}
