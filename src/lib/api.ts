import axios, { AxiosResponse } from 'axios';

// Base API URL (from constants)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

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

  // Always try to parse JSON response, even for error status codes
  // This allows structured error responses to be handled properly
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const jsonResponse = await res.json();
    return jsonResponse as T;
  }

  // For non-JSON responses, check if response is ok
  if (!res.ok) {
    const text = await res.text().catch(() => null);
    throw new Error(text || res.statusText || 'API error');
  }

  // Return text for non-JSON successful responses
  return (await res.text()) as any;
}

// Authentication API
export const authAPI = {
  signup: (data: { email: string; password: string }) => apiCall('/auth/signup', 'POST', data),
  login: (data: { email: string; password: string }) => apiCall('/auth/login', 'POST', data),
  checkAuth: () => apiCall('/protected/check-auth', 'GET'),
  getProfile: () => apiCall('/protected/profile', 'GET'),
};

// Onboarding API
export const onboardingAPI = {
  // Start onboarding process
  start: (data: { userId: number }) => apiCall('/onboarding/start', 'POST', data),

  // Save project details
  saveProject: (data: { title: string; description: string; category: string; deadline: string }) =>
    apiCall('/onboarding/project', 'POST', data),

  // Save requirements with file upload
  saveRequirements: (projectId: number, formData: FormData) => {
    return apiCall(`/onboarding/requirements/${projectId}`, 'POST', formData);
  },

  // Save milestones
  saveMilestones: (projectId: number, milestones: any[]) =>
    apiCall(`/onboarding/milestones/${projectId}`, 'POST', { milestones }),

  // Save client info
  saveClient: (projectId: number, client: { name: string; email: string; company?: string; country: string; phone?: string; contactPerson?: string }) =>
    apiCall(`/onboarding/client/${projectId}`, 'POST', { client }),

  // Review onboarding data
  review: (data: { projectId: number }) =>
    apiCall('/onboarding/review', 'POST', data),

  // Complete onboarding
  complete: (data: { projectId: number }) =>
    apiCall('/onboarding/complete', 'POST', data),

  // Get onboarding progress
  getProgress: (userId: number) =>
    apiCall(`/onboarding/progress/${userId}`, 'GET'),

  // Get complete onboarding data
  getOnboardingData: (projectId: number) =>
    apiCall(`/onboarding/${projectId}`, 'GET'),

  // Update onboarding step
  updateStep: (data: { userId: number; projectId: number; step: number }) =>
    apiCall('/onboarding/step', 'PUT', data),

  // Get all projects
  getProjects: () =>
    apiCall('/onboarding/projects', 'GET'),

  // Get project by ID
  getProjectById: (projectId: number) =>
    apiCall(`/onboarding/projects/${projectId}`, 'GET'),

  // Get requirements for project
  getRequirements: (projectId: number) =>
    apiCall(`/onboarding/projects/${projectId}/requirements`, 'GET'),

  // Get milestones for project
  getMilestones: (projectId: number) =>
    apiCall(`/onboarding/projects/${projectId}/milestones`, 'GET'),

  // Get client for project
  getClient: (projectId: number) =>
    apiCall(`/onboarding/projects/${projectId}/client`, 'GET'),

  // Get all projects (dashboard)
  getAllProjects: (params?: { status?: string; client?: string; search?: string; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.client) queryParams.append('client', params.client);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    return apiCall(`/onboarding/all-projects?${queryParams.toString()}`, 'GET');
  },

  // Update project status
  updateProjectStatus: (projectId: number, data: { status: string; progress: number }) =>
    apiCall(`/onboarding/projects/${projectId}/status`, 'PUT', data),

  // Delete project
  deleteProject: (projectId: number) =>
    apiCall(`/onboarding/projects/${projectId}`, 'DELETE'),
};

// Dashboard API
export const dashboardAPI = {
  // Get dashboard statistics
  getStats: () => apiCall('/dashboard/stats', 'GET'),

  // Get recent projects
  getRecentProjects: (limit?: number) => {
    const queryParams = limit ? `?limit=${limit}` : '';
    return apiCall(`/dashboard/recent-projects${queryParams}`, 'GET');
  },

  // Get recent messages
  getRecentMessages: (limit?: number) => {
    const queryParams = limit ? `?limit=${limit}` : '';
    return apiCall(`/dashboard/recent-messages${queryParams}`, 'GET');
  },
};

// Chat API
export const chatAPI = {
  // Get all conversations
  getConversations: () => apiCall('/chat/conversations', 'GET'),

  // Get conversation messages
  getConversationMessages: (conversationId: number) =>
    apiCall(`/chat/conversations/${conversationId}/messages`, 'GET'),

  // Send message
  sendMessage: (conversationId: number, data: { message: string }) =>
    apiCall(`/chat/conversations/${conversationId}/messages`, 'POST', data),

  // Mark messages as read
  markAsRead: (conversationId: number) =>
    apiCall(`/chat/conversations/${conversationId}/read`, 'PUT'),
};

// Documents API
export const documentsAPI = {
  // Get project documents
  getProjectDocuments: (projectId: number) =>
    apiCall(`/documents/projects/${projectId}/documents`, 'GET'),

  // Upload document
  uploadDocument: (projectId: number, formData: FormData) =>
    apiCall(`/documents/projects/${projectId}/documents`, 'POST', formData),

  // Download document
  downloadDocument: (documentId: number) =>
    apiCall(`/documents/${documentId}/download`, 'GET'),

  // Update document status
  updateDocumentStatus: (documentId: number, data: { status: string }) =>
    apiCall(`/documents/${documentId}/status`, 'PUT', data),

  // Delete document
  deleteDocument: (documentId: number) =>
    apiCall(`/documents/${documentId}`, 'DELETE'),
};

// Clients API
export const clientsAPI = {
  // Get all clients
  getClients: (params?: { status?: string; search?: string; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    return apiCall(`/clients?${queryParams.toString()}`, 'GET');
  },

  // Get client details
  getClientDetails: (clientId: number) =>
    apiCall(`/clients/${clientId}`, 'GET'),

  // Update client
  updateClient: (clientId: number, data: {
    name: string;
    email: string;
    company?: string;
    country: string;
    phone?: string;
    contactPerson?: string;
    status?: string;
  }) =>
    apiCall(`/clients/${clientId}`, 'PUT', data),

  // Create new client
  createClient: (data: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    country: string;
    contactPerson?: string;
    status?: string;
  }) =>
    apiCall('/clients', 'POST', data),
};

// Profile API
export const profileAPI = {
  // Get user profile
  getProfile: () => apiCall('/profile', 'GET'),

  // Update profile
  updateProfile: (data: {
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
  }) =>
    apiCall('/profile', 'PUT', data),

  // Update profile picture
  updateProfilePicture: (formData: FormData) =>
    apiCall('/profile/picture', 'POST', formData),

  // Change password
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiCall('/profile/password', 'PUT', data),
};
