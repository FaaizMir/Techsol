import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileAPI } from '@/lib/api';

// Types
interface Profile {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  profilePicture?: string;
  bio?: string;
  address?: string;
  city?: string;
  country?: string;
  timezone?: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  isOnboardingCompleted: boolean;
}

interface ProfileResponse {
  success: boolean;
  data: Profile;
}

interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  bio?: string;
  address?: string;
  city?: string;
  country?: string;
  timezone?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
}

interface UpdateProfileResponse {
  success: boolean;
  data: Profile;
}

interface UpdateProfilePictureResponse {
  success: boolean;
  data: {
    profilePicture: string;
  };
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

// Get user profile
export const useProfile = () => {
  return useQuery<ProfileResponse>({
    queryKey: ['profile'],
    queryFn: () => profileAPI.getProfile() as Promise<ProfileResponse>,
  });
};

// Update profile mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateProfileResponse, Error, UpdateProfileData>({
    mutationFn: (data) => profileAPI.updateProfile(data) as Promise<UpdateProfileResponse>,
    onSuccess: (response) => {
      if (response.success) {
        // Invalidate profile data
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }
    },
  });
};

// Update profile picture mutation
export const useUpdateProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateProfilePictureResponse, Error, FormData>({
    mutationFn: (formData) => profileAPI.updateProfilePicture(formData) as Promise<UpdateProfilePictureResponse>,
    onSuccess: (response) => {
      if (response.success) {
        // Invalidate profile data to refresh profile picture
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }
    },
  });
};

// Change password mutation
export const useChangePassword = () => {
  return useMutation<ChangePasswordResponse, Error, ChangePasswordData>({
    mutationFn: (data) => profileAPI.changePassword(data) as Promise<ChangePasswordResponse>,
  });
};