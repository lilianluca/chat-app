import { apiClient } from '@/libs';
import { IS_LOGGED_IN_FLAG_KEY } from '@/libs/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

async function logout() {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await apiClient.post('/auth/logout/');
}

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear the login flag from localStorage
      localStorage.removeItem(IS_LOGGED_IN_FLAG_KEY);
      // Invalidate the user data in the cache after logout
      queryClient.setQueryData(['users', 'me'], null);
      // Clear all queries to ensure no stale data is shown after logout
      queryClient.clear();
      // Navigate to the login page after logout
      navigate('/login');
    },
  });
};
