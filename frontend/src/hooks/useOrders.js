import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { checkout, getOrder, getOrders } from '../services/orders';

export const useOrders = () =>
  useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
    staleTime: 0,
  });

export const useOrder = (id, options = {}) =>
  useQuery({
    queryKey: ['orders', id],
    queryFn: () => getOrder(id),
    staleTime: 0,
    enabled: id != null,
    ...options,
  });

export const useCheckout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (shippingId) => checkout(shippingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
