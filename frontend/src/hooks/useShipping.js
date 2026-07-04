import { useMutation } from '@tanstack/react-query';
import { createShipping } from '../services/shipping';

export const useCreateShipping = () =>
  useMutation({
    mutationFn: (shipping) => createShipping(shipping),
  });
