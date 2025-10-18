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
import type {
  StartOnboardingRequest,
  SaveProjectRequest,
  SaveMilestonesRequest,
  SaveClientRequest,
  ReviewRequest,
  CompleteRequest,
  UpdateStepRequest,
  ApiResponse,
  StartOnboardingResponse,
  SaveProjectResponse,
  SaveRequirementsResponse,
  SaveMilestonesResponse,
  SaveClientResponse,
  ReviewResponse,
  CompleteResponse,
  ProgressData,
  OnboardingDataResponse,
  UpdateStepResponse,
} from '@/types/onboarding';

export const onboardingAPI = {
  // Start onboarding process
  start: (data: StartOnboardingRequest): Promise<ApiResponse<StartOnboardingResponse>> =>
    apiCall('/onboarding/start', 'POST', data),

  // Save project details
  saveProject: (data: SaveProjectRequest): Promise<ApiResponse<SaveProjectResponse>> =>
    apiCall('/onboarding/project', 'POST', data),

  // Save requirements with file upload
  saveRequirements: (projectId: number, formData: FormData): Promise<ApiResponse<SaveRequirementsResponse>> =>
    apiCall(`/onboarding/requirements/${projectId}`, 'POST', formData),

  // Save milestones
  saveMilestones: (projectId: number, data: SaveMilestonesRequest): Promise<ApiResponse<SaveMilestonesResponse>> =>
    apiCall(`/onboarding/milestones/${projectId}`, 'POST', data),

  // Save client info
  saveClient: (projectId: number, data: SaveClientRequest): Promise<ApiResponse<SaveClientResponse>> =>
    apiCall(`/onboarding/client/${projectId}`, 'POST', data),

  // Review onboarding data
  review: (data: ReviewRequest): Promise<ApiResponse<ReviewResponse>> =>
    apiCall('/onboarding/review', 'POST', data),

  // Complete onboarding
  complete: (data: CompleteRequest): Promise<ApiResponse<CompleteResponse>> =>
    apiCall('/onboarding/complete', 'POST', data),

  // Get onboarding progress
  getProgress: (userId: number): Promise<ApiResponse<ProgressData>> =>
    apiCall(`/onboarding/progress/${userId}`, 'GET'),

  // Get complete onboarding data
  getOnboardingData: (projectId: number): Promise<ApiResponse<OnboardingDataResponse>> =>
    apiCall(`/onboarding/${projectId}`, 'GET'),

  // Update onboarding step
  updateStep: (data: UpdateStepRequest): Promise<ApiResponse<UpdateStepResponse>> =>
    apiCall('/onboarding/step', 'PUT', data),

  // Get all projects
  getProjects: (): Promise<ApiResponse<{ projects: any[] }>> =>
    apiCall('/onboarding/projects', 'GET'),

  // Get project by ID
  getProjectById: (projectId: number): Promise<ApiResponse<{ project: any }>> =>
    apiCall(`/onboarding/projects/${projectId}`, 'GET'),

  // Get requirements for project
  getRequirements: (projectId: number): Promise<ApiResponse<{ requirements: any }>> =>
    apiCall(`/onboarding/projects/${projectId}/requirements`, 'GET'),

  // Get milestones for project
  getMilestones: (projectId: number): Promise<ApiResponse<{ milestones: any[] }>> =>
    apiCall(`/onboarding/projects/${projectId}/milestones`, 'GET'),

  // Get client for project
  getClient: (projectId: number): Promise<ApiResponse<{ client: any }>> =>
    apiCall(`/onboarding/projects/${projectId}/client`, 'GET'),

  // Get all projects (dashboard)
  getAllProjects: (params?: { status?: string; client?: string; search?: string; page?: number; limit?: number }): Promise<ApiResponse<any>> => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.client) queryParams.append('client', params.client);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    return apiCall(`/onboarding/all-projects?${queryParams.toString()}`, 'GET');
  },

  // Update project status
  updateProjectStatus: (projectId: number, data: { status: string; progress: number }): Promise<ApiResponse<any>> =>
    apiCall(`/onboarding/projects/${projectId}/status`, 'PUT', data),

  // Edit project
  editProject: (projectId: number, data: Partial<{
    title: string;
    description: string;
    category: string;
    deadline: string;
    status: string;
    priority: string;
    budget: number;
    progress: number;
  }>): Promise<ApiResponse<any>> =>
    apiCall(`/onboarding/projects/${projectId}`, 'PUT', data),

  // Edit milestones
  editMilestones: (projectId: number, data: { milestones: any[] }): Promise<ApiResponse<any>> =>
    apiCall(`/onboarding/projects/${projectId}/milestones`, 'PUT', data),

  // Edit requirements
  editRequirements: (projectId: number, data: { notes: string }): Promise<ApiResponse<any>> =>
    apiCall(`/onboarding/projects/${projectId}/requirements`, 'PUT', data),

  // Edit client
  editClient: (clientId: number, data: Partial<{
    name: string;
    email: string;
    company: string;
    country: string;
    phone: string;
    contactPerson: string;
  }>): Promise<ApiResponse<any>> =>
    apiCall(`/onboarding/clients/${clientId}`, 'PUT', data),

  // Delete project
  deleteProject: (projectId: number): Promise<ApiResponse<{ message: string }>> =>
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
  // Get all conversations for current user
  getConversations: () => apiCall('/chat/conversations', 'GET'),

  // Get conversation messages
  getConversationMessages: (conversationId: number) =>
    apiCall(`/chat/conversations/${conversationId}/messages`, 'GET'),

  // Send message to conversation (existing conversation)
  sendMessage: (conversationId: number, data: { message: string }) =>
    apiCall(`/chat/conversations/${conversationId}/messages`, 'POST', data),

  // Send first message (new conversation - for new users)
  sendFirstMessage: (data: { message: string }) =>
    apiCall('/chat/messages', 'POST', data),

  // Mark messages as read
  markAsRead: (conversationId: number) =>
    apiCall(`/chat/conversations/${conversationId}/read`, 'PUT'),

  // Get chat statistics
  getChatStats: () =>
    apiCall('/chat/stats', 'GET'),

  // Search messages
  searchMessages: (params: { query: string; conversationId?: number }) => {
    const queryParams = new URLSearchParams({ query: params.query });
    if (params.conversationId) {
      queryParams.append('conversationId', params.conversationId.toString());
    }
    return apiCall(`/chat/search?${queryParams.toString()}`, 'GET');
  },

  // Delete conversation (admin only)
  deleteConversation: (conversationId: number) =>
    apiCall(`/chat/conversations/${conversationId}`, 'DELETE'),
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

