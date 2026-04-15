import { useMutation } from '@tanstack/react-query';
import { type RegisterFormData } from '@/features/auth/schemas';
import { type ApiError } from '@/types';
import { apiClient } from '@/libs';

export const useRegisterMutation = () => {
  return useMutation<void, ApiError, RegisterFormData>({
    mutationFn: async (data) => {
      const response = await apiClient.post('/users/', data);
      return response.data;
    },
  });
};
