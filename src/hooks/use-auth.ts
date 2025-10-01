import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '@/lib/api';

// Types
interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  data: {
    user: {
      id: number;
      email: string;
      isOnboardingCompleted: boolean;
    };
    token: string;
  };
}

interface ProfileResponse {
  success: boolean;
  data: {
    id: number;
    email: string;
    isOnboardingCompleted: boolean;
  };
}

interface CheckAuthResponse {
  success: boolean;
  data: {
    authenticated: boolean;
    user: {
      id: number;
      email: string;
    };
  };
}

// Login hook
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) => authAPI.login(credentials) as Promise<AuthResponse>,
    onSuccess: (data: AuthResponse) => {
      // Store token in localStorage
      if (data.data?.token) {
        localStorage.setItem('authToken', data.data.token);
      }
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['checkAuth'] });
    },
  });
};

// Signup hook
export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, SignupCredentials>({
    mutationFn: (credentials: SignupCredentials) => authAPI.signup(credentials) as Promise<AuthResponse>,
    onSuccess: (data: AuthResponse) => {
      // Store token in localStorage
      if (data.data?.token) {
        localStorage.setItem('authToken', data.data.token);
      }
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['checkAuth'] });
    },
  });
};

// Get profile hook
export const useProfile = () => {
  return useQuery<ProfileResponse>({
    queryKey: ['profile'],
    queryFn: () => authAPI.getProfile() as Promise<ProfileResponse>,
    enabled: !!localStorage.getItem('authToken'), // Only run if token exists
  });
};

// Check auth status hook
export const useCheckAuth = () => {
  return useQuery<CheckAuthResponse>({
    queryKey: ['checkAuth'],
    queryFn: () => authAPI.checkAuth() as Promise<CheckAuthResponse>,
    enabled: !!localStorage.getItem('authToken'), // Only run if token exists
    retry: false, // Don't retry on auth failures
  });
};

// Logout function (not a hook, but utility)
export const logout = () => {
  localStorage.removeItem('authToken');
  // Note: This should be called with useQueryClient from a component
};