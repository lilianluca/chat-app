import { apiClient } from '@/libs';
import type { ApiError } from '@/types';
import { useQuery } from '@tanstack/react-query';
import type { Inbox } from '@/features/chats/types';

async function getInbox() {
  const response = await apiClient.get('/chat/inbox/');
  return response.data;
}

export const useInboxQuery = () => {
  return useQuery<Inbox[], ApiError>({
    queryKey: ['inbox'],
    queryFn: getInbox,
  });
};
