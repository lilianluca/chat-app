import { apiClient } from '@/libs';
import { useQuery } from '@tanstack/react-query';
import type { SearchUser } from '@/features/users/types';

async function searchUsers(search: string) {
  const response = await apiClient.get('/users/search/', {
    params: { search },
  });
  return response.data;
}
export const useSearchUsersQuery = (search: string) => {
  return useQuery<SearchUser[]>({
    queryKey: ['users', 'search', search],
    queryFn: () => searchUsers(search),
    enabled: search.length > 0, // Only fetch when search is not empty
    placeholderData: (previousData) => previousData,
  });
};
