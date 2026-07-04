import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAdminOrders, updateOrderStatus } from '../services/orders';

export const useAdminOrders = ({ status, page = 0 } = {}) =>
  useQuery({
    queryKey: ['admin-orders', { status, page }],
    queryFn: () => getAdminOrders({ status, page }),
    staleTime: 0,
  });

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] }),
  });
};
