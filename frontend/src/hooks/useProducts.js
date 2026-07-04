import { useQuery } from '@tanstack/react-query';
import { getProduct, getProducts } from '../services/products';
import { CATALOG_STALE_TIME } from '../lib/queryClient';

export const useProducts = (page = 0) =>
  useQuery({
    queryKey: ['products', { page }],
    queryFn: () => getProducts({ page }),
    staleTime: CATALOG_STALE_TIME,
  });

export const useProduct = (id) =>
  useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
    staleTime: CATALOG_STALE_TIME,
    enabled: id != null,
  });
