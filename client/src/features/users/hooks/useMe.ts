import { apiClient } from '@/libs';
import { useQuery } from '@tanstack/react-query';
import { type User } from '@/features/users/types';
import type { ApiError } from '@/types';
import { IS_LOGGED_IN_FLAG_KEY } from '@/libs/axios';

async function fetchUserData() {
  const { data } = await apiClient.get('/users/me/');
  return data;
}

export const useMe = () => {
  // Check if the user is logged in by looking for the flag in localStorage
  const isLoggedIn = localStorage.getItem(IS_LOGGED_IN_FLAG_KEY) === 'true';

  return useQuery<User, ApiError>({
    queryKey: ['users', 'me'],
    queryFn: fetchUserData,
    enabled: isLoggedIn, // Only run this query if the user is logged in
  });
};
