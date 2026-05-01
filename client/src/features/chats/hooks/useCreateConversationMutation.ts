import { apiClient } from '@/libs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { SimpleConversation, CreateConversationPayload } from '@/features/chats/types';
import type { ApiError } from '@/types';
import { toast } from 'sonner';

async function createConversation(data: CreateConversationPayload) {
  const response = await apiClient.post('/chat/conversations/', data);
  return response.data;
}

export const useCreateConversationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<SimpleConversation, ApiError, CreateConversationPayload>({
    mutationFn: createConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
      toast.success('Group chat created successfully');
    },
  });
};
