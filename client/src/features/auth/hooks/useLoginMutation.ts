import { apiClient } from '@/libs';
import type { LoginFormData } from '@/features/auth/schemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IS_LOGGED_IN_FLAG_KEY } from '@/libs/axios';
import { useNavigate } from 'react-router';

async function login(credentials: LoginFormData) {
  const { data } = await apiClient.post('/auth/token/', credentials);
  return data;
}

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      // Set a flag in localStorage to indicate the user is logged in
      localStorage.setItem(IS_LOGGED_IN_FLAG_KEY, 'true');
      // Invalidate the 'users/me' query to refetch user data after login
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
      // Navigate to the user's profile page after successful login
      navigate('/my-profile');
    },
  });
};
