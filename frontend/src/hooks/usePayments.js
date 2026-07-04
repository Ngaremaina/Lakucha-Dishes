import { useMutation, useQuery } from '@tanstack/react-query';
import { getPaymentForOrder, initiateStkPush } from '../services/payments';

export const useInitiateStkPush = () =>
  useMutation({
    mutationFn: ({ orderId, phoneNumber }) => initiateStkPush(orderId, phoneNumber),
  });

export const usePaymentStatus = (orderId, { enabled }) =>
  useQuery({
    queryKey: ['payment', orderId],
    queryFn: () => getPaymentForOrder(orderId),
    enabled,
    refetchInterval: (query) => (query.state.data?.status === 'PENDING' ? 3000 : false),
  });
