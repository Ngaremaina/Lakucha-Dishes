import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addToCart, getCart, removeCartItem, updateCartQuantity } from '../services/cart';

export const useCart = () =>
  useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
    staleTime: 0,
  });

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }) => addToCart(productId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });
};

export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantity }) => updateCartQuantity(id, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => removeCartItem(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });
};
