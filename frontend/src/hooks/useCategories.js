import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../services/categories';
import { CATALOG_STALE_TIME } from '../lib/queryClient';

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: CATALOG_STALE_TIME,
  });
