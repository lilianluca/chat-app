import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/libs';
import { type RegisterPayload } from '@/features/auth/schemas';
import { type ApiError } from '@/types';
import type { RegisterResponse } from '@/features/auth/types';

export const useRegisterMutation = () => {
  return useMutation<RegisterResponse, ApiError, RegisterPayload>({
    mutationFn: async (data) => {
      const response = await apiClient.post('/users/', data);
      return response.data;
    },
  });
};
