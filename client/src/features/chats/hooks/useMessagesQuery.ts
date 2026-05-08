import { apiClient } from '@/libs';
import type { ApiError, PaginatedResponse } from '@/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { Message } from '@/features/chats/types';

async function getMessages(conversationId: number, cursor?: string) {
  const response = await apiClient.get(`/chat/conversations/${conversationId}/messages/`, {
    params: {
      ...(cursor ? { cursor } : {}),
    },
  });
  return response.data;
}

export const useMessagesQuery = (conversationId: number) => {
  return useInfiniteQuery<PaginatedResponse<Message>, ApiError>({
    queryKey: ['conversations', conversationId, 'messages'],
    queryFn: ({ pageParam }) => getMessages(conversationId, pageParam as string),
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      const nextCursor = url.searchParams.get('cursor');
      return nextCursor ? nextCursor : undefined;
    },
    initialPageParam: undefined,
  });
};
