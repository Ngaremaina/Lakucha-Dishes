import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteContactMessage, getContactMessages } from '../services/contact';

export const useContactMessages = (page = 0) =>
  useQuery({
    queryKey: ['contact-messages', { page }],
    queryFn: () => getContactMessages({ page }),
    staleTime: 0,
  });

export const useDeleteContactMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteContactMessage,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contact-messages'] }),
  });
};
