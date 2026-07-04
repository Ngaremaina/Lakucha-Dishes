import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Catalog data changes rarely — cache it longer than the default.
export const CATALOG_STALE_TIME = 5 * 60 * 1000;
