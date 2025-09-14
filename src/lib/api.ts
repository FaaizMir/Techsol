import axios, { AxiosResponse } from 'axios';

// Base API URL (from constants)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://techsol-backend.vercel.app/api';

// Generic API call function
export async function apiCall<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any,
  headers?: Record<string, string>
): Promise<T> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      data,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
    };

    const response: AxiosResponse<T> = await axios(config);
    return response.data;
  } catch (error: any) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    throw new Error(error.response?.data?.message || 'API request failed');
  }
}

// Specific API functions (extend as needed)
export const authAPI = {
  signup: (data: { username: string; password: string }) => apiCall('/auth/signup', 'POST', data),
  login: (data: { username: string; password: string }) => apiCall('/auth/login', 'POST', data),
};

export const onboardingAPI = {
  submitData: (formData: FormData) => apiCall('/onboarding/onboardingdata', 'POST', formData, { 'Content-Type': 'multipart/form-data' }),
};