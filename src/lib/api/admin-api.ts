import { apiCall } from '@/lib/api'

// Types
export interface AdminDashboardStats {
  users: {
    total: number
    onboarded: number
    pending: number
    recent: number
  }
  projects: {
    total: number
    active: number
    completed: number
    pending: number
    cancelled: number
    recent: number
  }
  clients: {
    total: number
    active: number
    topClients: Array<{
      id: number
      name: string
      company: string
      projectCount: number
    }>
  }
  finance: {
    totalRevenue: string
    completedMilestones: number
    pendingMilestones: number
    overdueMilestones: number
  }
  documents: {
    total: number
    approved: number
    pending: number
  }
  chat: {
    totalConversations: number
    unreadMessages: number
  }
  trends: {
    monthlyProjects: Array<{
      month: string
      count: number
    }>
    monthlyUsers: Array<{
      month: string
      count: number
    }>
    projectsByStatus: Array<{
      status: string
      count: number
    }>
  }
}

export interface ProjectAnalytics {
  completionRate: number
  averageDuration: number
  statusDistribution: {
    pending: number
    active: number
    completed: number
    cancelled: number
  }
  categoryDistribution: Record<string, number>
  priorityDistribution: {
    low: number
    medium: number
    high: number
    urgent: number
  }
  budgetInfo: {
    totalBudget: number
    averageBudget: number
  }
}

export interface User {
  id: number
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  company?: string
  city?: string
  country?: string
  profilePicture?: string
  bio?: string
  address?: string
  timezone: string
  emailNotifications: boolean
  pushNotifications: boolean
  role: 'user' | 'admin'
  isOnboardingCompleted: boolean
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: number
  userId: number
  clientId?: number
  title: string
  description?: string
  category: string
  deadline: string
  budget?: number
  priority: string
  status: string
  progress: number
  createdAt: string
  updatedAt: string
  user?: User
  client?: Client
  milestones?: Milestone[]
  requirements?: Requirement[]
}

export interface Milestone {
  id: number
  projectId: number
  title: string
  deliverable: string
  deadline: string
  amount: string
  status: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface Requirement {
  id: number
  projectId: number
  notes: string
  files: string
  createdAt: string
  updatedAt: string
}

export interface Client {
  id: number
  name: string
  email: string
  company: string
  country: string
  phone?: string
  contactPerson?: string
  status: string
  createdAt: string
  updatedAt: string
  projects?: Array<{
    id: number
    title: string
    status: string
  }>
}

export interface Conversation {
  id: number
  userId: number
  lastMessage?: string
  lastMessageAt?: string
  unreadCount: number
  user?: User
}

export interface Message {
  id: number
  conversationId: number
  senderId: number
  message: string
  createdAt: string
  sender?: User
}

export interface Document {
  id: number
  projectId: number
  filename: string
  originalFilename: string
  mimeType: string
  size: number
  status: string
  uploadedBy: number
  createdAt: string
  updatedAt: string
  project?: Project
}

// API Functions

// Dashboard APIs
export const adminDashboardAPI = {
  getStats: (): Promise<{ success: boolean; data: AdminDashboardStats }> =>
    apiCall('/admin/dashboard/stats', 'GET'),

  getProjectAnalytics: (): Promise<{ success: boolean; data: ProjectAnalytics }> =>
    apiCall('/admin/dashboard/analytics/projects', 'GET'),
}

// User Management APIs
export const adminUserAPI = {
  getAll: (): Promise<{ success: boolean; count: number; data: User[] }> =>
    apiCall('/admin/users', 'GET'),

  getById: (id: number): Promise<{ success: boolean; data: User }> =>
    apiCall(`/admin/users/${id}`, 'GET'),

  update: (id: number, data: Partial<User>): Promise<{ success: boolean; data: User }> =>
    apiCall(`/admin/users/${id}`, 'PUT', data),

  delete: (id: number): Promise<{ success: boolean; message: string }> =>
    apiCall(`/admin/users/${id}`, 'DELETE'),
}

// Project Management APIs
export const adminProjectAPI = {
  getAll: (): Promise<{ success: boolean; count: number; data: Project[] }> =>
    apiCall('/admin/projects', 'GET'),

  getById: (id: number): Promise<{ success: boolean; data: Project }> =>
    apiCall(`/admin/projects/${id}`, 'GET'),

  create: (data: {
    userId: number
    clientId?: number
    title: string
    description?: string
    category: string
    deadline: string
    budget?: number
    priority: string
  }): Promise<{ success: boolean; data: Project }> =>
    apiCall('/admin/projects', 'POST', data),

  update: (id: number, data: Partial<Project>): Promise<{ success: boolean; data: Project }> =>
    apiCall(`/admin/projects/${id}`, 'PUT', data),

  updateStatus: (id: number, status: string): Promise<{ success: boolean; data: Project }> =>
    apiCall(`/admin/projects/${id}/status`, 'PUT', { status }),

  bulkUpdate: (projectIds: number[], status: string): Promise<{ success: boolean; message: string }> =>
    apiCall('/admin/projects/bulk-update', 'PUT', { projectIds, status }),

  search: (params: {
    query?: string
    status?: string
    category?: string
    priority?: string
    clientId?: number
    minBudget?: number
    maxBudget?: number
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
  }): Promise<{ success: boolean; data: { projects: Project[]; pagination: any } }> => {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value))
      }
    })
    return apiCall(`/admin/projects/search?${queryParams.toString()}`, 'GET')
  },

  delete: (id: number): Promise<{ success: boolean; message: string }> =>
    apiCall(`/admin/projects/${id}`, 'DELETE'),
}

// Milestone Management APIs
export const adminMilestoneAPI = {
  getAll: (): Promise<{ success: boolean; data: Milestone[] }> =>
    apiCall('/admin/milestones', 'GET'),

  create: (projectId: number, data: {
    title: string
    deliverable: string
    deadline: string
    amount: string
    order: number
  }): Promise<{ success: boolean; data: Milestone }> =>
    apiCall(`/admin/projects/${projectId}/milestones`, 'POST', data),

  update: (id: number, data: Partial<Milestone>): Promise<{ success: boolean; data: Milestone }> =>
    apiCall(`/admin/milestones/${id}`, 'PUT', data),

  delete: (id: number): Promise<{ success: boolean; message: string }> =>
    apiCall(`/admin/milestones/${id}`, 'DELETE'),
}

// Requirement Management APIs
export const adminRequirementAPI = {
  getAll: (): Promise<{ success: boolean; data: Requirement[] }> =>
    apiCall('/admin/requirements', 'GET'),

  create: (projectId: number, data: {
    notes: string
    files: string[]
  }): Promise<{ success: boolean; data: Requirement }> =>
    apiCall(`/admin/projects/${projectId}/requirements`, 'POST', data),

  update: (id: number, data: {
    notes?: string
    files?: string[]
  }): Promise<{ success: boolean; data: Requirement }> =>
    apiCall(`/admin/requirements/${id}`, 'PUT', data),

  delete: (id: number): Promise<{ success: boolean; message: string }> =>
    apiCall(`/admin/requirements/${id}`, 'DELETE'),
}

// Client Management APIs
export const adminClientAPI = {
  getAll: (): Promise<{ success: boolean; count: number; data: Client[] }> =>
    apiCall('/admin/clients', 'GET'),

  create: (data: {
    name: string
    email: string
    company: string
    country: string
    phone?: string
    contactPerson?: string
  }): Promise<{ success: boolean; data: Client }> =>
    apiCall('/admin/clients', 'POST', data),

  update: (id: number, data: Partial<Client>): Promise<{ success: boolean; data: Client }> =>
    apiCall(`/admin/clients/${id}`, 'PUT', data),

  delete: (id: number): Promise<{ success: boolean; message: string }> =>
    apiCall(`/admin/clients/${id}`, 'DELETE'),
}

// Chat/Communication APIs
export const adminChatAPI = {
  getConversations: (): Promise<{ success: boolean; data: Conversation[] }> =>
    apiCall('/admin/conversations', 'GET'),

  getMessages: (conversationId: number): Promise<{ success: boolean; data: Message[] }> =>
    apiCall(`/admin/conversations/${conversationId}/messages`, 'GET'),

  sendMessage: (conversationId: number, message: string): Promise<{ success: boolean; data: Message }> =>
    apiCall(`/admin/conversations/${conversationId}/messages`, 'POST', { message }),
}

// Document Management APIs
export const adminDocumentAPI = {
  getAll: (): Promise<{ success: boolean; data: Document[] }> =>
    apiCall('/admin/documents', 'GET'),

  upload: (projectId: number, file: File): Promise<{ success: boolean; data: Document }> => {
    const formData = new FormData()
    formData.append('file', file)
    return apiCall(`/admin/projects/${projectId}/documents`, 'POST', formData)
  },

  updateStatus: (documentId: number, status: string): Promise<{ success: boolean; data: Document }> =>
    apiCall(`/admin/documents/${documentId}/status`, 'PUT', { status }),

  delete: (documentId: number): Promise<{ success: boolean; message: string }> =>
    apiCall(`/admin/documents/${documentId}`, 'DELETE'),
}
