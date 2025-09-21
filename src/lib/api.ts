import axios, { AxiosResponse } from 'axios';

// Base API URL (from constants)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

// Generic API call function
export async function apiCall<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any,
  headers: Record<string, string> = {}
): Promise<T> {
  // use the top-level API_BASE_URL constant (fallback already defined above)
  const base = API_BASE_URL.replace(/\/$/, '') // remove trailing slash if any
  const url = `${base}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // attach token if present (browser only)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (token) headers = { ...headers, Authorization: `Bearer ${token}` };

  }

  const init: RequestInit = { method };

  // Handle FormData specially: let the browser set Content-Type (boundary)
  if (data instanceof FormData) {
    init.body = data;
    // remove multipart Content-Type if provided
    const ctKey = Object.keys(headers).find((k) => k.toLowerCase() === 'content-type');
    if (ctKey && headers[ctKey].includes('multipart')) delete headers[ctKey];
  } else if (data != null) {
    headers = { 'Content-Type': 'application/json', ...headers };
    init.body = JSON.stringify(data);
  }

  init.headers = headers;

  const res = await fetch(url, init);
  console.log('API Call:', url);
  if (!res.ok) {
    const text = await res.text().catch(() => null);
    throw new Error(text || res.statusText || 'API error');
  }

  // attempt to parse json, but return void if no content
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json() as Promise<T>;
  return (await res.text()) as any;
}

// Specific API functions (extend as needed)
export const authAPI = {
  signup: (data: { username: string; password: string }) => apiCall('/auth/signup', 'POST', data),
  login: (data: { username: string; password: string }) => apiCall('/auth/login', 'POST', data),
};

export const onboardingAPI = {
  start: (payload: Record<string, any>) => apiCall('/onboarding/start', 'POST', payload),
  submitData: (formData: FormData) =>
    apiCall('/onboarding/complete', 'POST', formData),
  saveProject: (project: Record<string, any>) => apiCall('/onboarding/project', 'POST', project),
  saveRequirements: (projectId: number | null, formData: FormData) =>
    apiCall(`/onboarding/requirements/${projectId}`, 'POST', formData),
  saveMilestones: (projectId: number | null, milestones: any[]) =>
    apiCall(`/onboarding/milestones/${projectId}`, 'POST', { milestones }),
  saveClient: (projectId: number | null, client: Record<string, any>) =>
    apiCall(`/onboarding/client/${projectId}`, 'POST', client),
  getProgress: (userId: string) => apiCall(`/onboarding/progress/${userId}`, 'GET'),
  getOnboardingData: (projectId: string) => apiCall(`/onboarding/${projectId}`, 'GET'),
  updateStep: (payload: Record<string, any>) => apiCall('/onboarding/step', 'PUT', payload),

  // --- New helper GET endpoints ---
  getProjects: () => apiCall<{ success: boolean; data: { projects: any[] } }>('/onboarding/projects', 'GET'),
  getProjectById: (projectId: number) =>
    apiCall<{ success: boolean; data: { project: any } }>(`/onboarding/projects/${projectId}`, 'GET'),
  getRequirements: (projectId: number) =>
    apiCall<{ success: boolean; data: { requirements: any } }>(`/onboarding/projects/${projectId}/requirements`, 'GET'),
  getMilestones: (projectId: number) =>
    apiCall<{ success: boolean; data: { milestones: any[] } }>(`/onboarding/projects/${projectId}/milestones`, 'GET'),
  getClient: (projectId: number) =>
    apiCall<{ success: boolean; data: { client: any } }>(`/onboarding/projects/${projectId}/client`, 'GET'),
};
