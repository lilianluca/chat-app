import { apiClient } from '@/lib';
import { useQuery } from '@tanstack/react-query';
import { type User } from '@/features/users/types';
import type { ApiError } from '@/types';

async function fetchUserData() {
  const { data } = await apiClient.get('/users/me/');
  return data;
}

export const useMe = () => {
  return useQuery<User, ApiError>({
    queryKey: ['users', 'me'],
    queryFn: fetchUserData,
  });
};
