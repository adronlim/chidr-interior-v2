import { useQuery } from '@tanstack/react-query';
import { company as dummy } from '@/lib/dummy-data';
import { sanity, sanityEnabled } from '@/lib/sanity';
import { COMPANY_QUERY } from '@/lib/queries';
import type { Company } from '@/lib/types';

export function useCompany() {
  return useQuery({
    queryKey: ['company'],
    queryFn: async (): Promise<Company> => {
      if (sanityEnabled && sanity) return sanity.fetch(COMPANY_QUERY);
      return dummy;
    },
    staleTime: 5 * 60_000,
  });
}
