import { useQuery } from '@tanstack/react-query';
import { team as dummy } from '@/lib/dummy-data';
import { sanity, sanityEnabled } from '@/lib/sanity';
import { TEAM_QUERY } from '@/lib/queries';
import type { TeamMember } from '@/lib/types';

export function useTeam() {
  return useQuery({
    queryKey: ['team'],
    queryFn: async (): Promise<TeamMember[]> => {
      if (sanityEnabled && sanity) return sanity.fetch(TEAM_QUERY);
      return [...dummy].sort((a, b) => a.order - b.order);
    },
    staleTime: 5 * 60_000,
  });
}
