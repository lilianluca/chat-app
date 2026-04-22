import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateProfileFormData } from '@/features/users/schemas';
import { apiClient } from '@/libs';
import { type ApiError } from '@/types';
import type { UserProfileResponse } from '@/features/users/types';

async function updateProfile(payload: UpdateProfileFormData) {
  // Create a FormData object to handle file upload
  const formData = new FormData();
  formData.append('firstName', payload.firstName);
  formData.append('lastName', payload.lastName);
  formData.append('bio', payload.bio);
  formData.append('statusEmoji', payload.statusEmoji);
  if (payload.avatar instanceof File) {
    formData.append('avatar', payload.avatar);
  }

  const response = await apiClient.patch('/users/me/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<UserProfileResponse, ApiError, UpdateProfileFormData>({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
  });
};
