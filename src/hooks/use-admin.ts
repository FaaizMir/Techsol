import { useQuery } from '@tanstack/react-query'
import { apiCall, adminAPI } from '@/lib/api'

export interface User {
  id: number
  email: string
  username?: string
  role: 'user' | 'admin'
  isOnboardingCompleted: boolean
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: number
  title: string
  description?: string
  category: string
  deadline: string
  status: string
  progress: number
  priority: string
  budget?: number
  clientId?: number
  userId: number
  createdAt: string
  updatedAt: string
  user?: {
    id: number
    email: string
    firstName?: string
    lastName?: string
  }
  client?: {
    id: number
    name: string
    email: string
    company: string
  }
}

interface Client {
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

interface Milestone {
  id: number
  title: string
  deliverable: string
  deadline: string
  amount: string
  status: string
  order: number
  projectId: number
  createdAt: string
  updatedAt: string
  project?: {
    id: number
    title: string
    status: string
    user?: {
      id: number
      email: string
      firstName?: string
      lastName?: string
    }
  }
}

interface Requirement {
  id: number
  notes: string
  files: string
  projectId: number
  createdAt: string
  updatedAt: string
  project?: {
    id: number
    title: string
    status: string
    category: string
    user?: {
      id: number
      email: string
      firstName?: string
      lastName?: string
    }
  }
}

export interface ProposalDocument {
  id: number
  projectId: number
  userId: number
  content: string
  createdAt: string
  updatedAt: string
  project?: {
    id: number
    title: string
    status: string
    category: string
  }
  user?: {
    id: number
    email: string
    firstName?: string
    lastName?: string
  }
  client?: {
    id: number
    name: string
    email: string
    company: string
  }
}

interface AdminUsersResponse {
  success: boolean
  data: User[]
}

interface AdminProjectsResponse {
  success: boolean
  data: Project[]
}

interface AdminClientsResponse {
  success: boolean
  data: Client[]
}

interface AdminMilestonesResponse {
  success: boolean
  data: Milestone[]
}

interface AdminRequirementsResponse {
  success: boolean
  data: Requirement[]
}

// Hook to fetch all users (admin only)
export const useAdminUsers = () => {
  return useQuery<User[]>({
    queryKey: ['admin', 'users'],
    queryFn: async (): Promise<User[]> => {
      try {
        const response = await apiCall<AdminUsersResponse>('/admin/users', 'GET')
        
        if ('error' in response) {
          throw new Error(String(response.error))
        }
        
        if (response.success && response.data) {
          return response.data
        }
        
        throw new Error('Failed to fetch users')
      } catch (error) {
        console.error('Error fetching admin users:', error)
        throw error
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to fetch all projects (admin only)
export const useAdminProjects = () => {
  return useQuery<Project[]>({
    queryKey: ['admin', 'projects'],
    queryFn: async (): Promise<Project[]> => {
      try {
        const response = await apiCall<AdminProjectsResponse>('/admin/projects', 'GET')
        
        if ('error' in response) {
          throw new Error(String(response.error))
        }
        
        if (response.success && response.data) {
          return response.data
        }
        
        throw new Error('Failed to fetch projects')
      } catch (error) {
        console.error('Error fetching admin projects:', error)
        throw error
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to fetch all clients (admin only)
export const useAdminClients = () => {
  return useQuery<Client[]>({
    queryKey: ['admin', 'clients'],
    queryFn: async (): Promise<Client[]> => {
      try {
        const response = await apiCall<AdminClientsResponse>('/admin/clients', 'GET')
        
        if ('error' in response) {
          throw new Error(String(response.error))
        }
        
        if (response.success && response.data) {
          return response.data
        }
        
        throw new Error('Failed to fetch clients')
      } catch (error) {
        console.error('Error fetching admin clients:', error)
        throw error
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to fetch all milestones (admin only)
export const useAdminMilestones = () => {
  return useQuery<Milestone[]>({
    queryKey: ['admin', 'milestones'],
    queryFn: async (): Promise<Milestone[]> => {
      try {
        const response = await apiCall<AdminMilestonesResponse>('/admin/milestones', 'GET')
        
        if ('error' in response) {
          throw new Error(String(response.error))
        }
        
        if (response.success && response.data) {
          return response.data
        }
        
        throw new Error('Failed to fetch milestones')
      } catch (error) {
        console.error('Error fetching admin milestones:', error)
        throw error
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to fetch all requirements (admin only)
export const useAdminRequirements = () => {
  return useQuery<Requirement[]>({
    queryKey: ['admin', 'requirements'],
    queryFn: async (): Promise<Requirement[]> => {
      try {
        const response = await apiCall<AdminRequirementsResponse>('/admin/requirements', 'GET')
        
        if ('error' in response) {
          throw new Error(String(response.error))
        }
        
        if (response.success && response.data) {
          return response.data
        }
        
        throw new Error('Failed to fetch requirements')
      } catch (error) {
        console.error('Error fetching admin requirements:', error)
        throw error
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to fetch milestones for a specific project (admin only)
export const useAdminProjectMilestones = (projectId: number | null) => {
  return useQuery<Milestone[]>({
    queryKey: ['admin', 'project-milestones', projectId],
    queryFn: async (): Promise<Milestone[]> => {
      if (!projectId) return []
      
      try {
        const response = await apiCall<AdminMilestonesResponse>(`/admin/milestones`, 'GET')
        
        if ('error' in response) {
          throw new Error(String(response.error))
        }
        
        if (response.success && response.data) {
          return response.data
        }
        
        throw new Error('Failed to fetch project milestones')
      } catch (error) {
        console.error('Error fetching project milestones:', error)
        throw error
      }
    },
    enabled: !!projectId,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to fetch requirements for a specific project (admin only)
export const useAdminProjectRequirements = (projectId: number | null) => {
  return useQuery<Requirement[]>({
    queryKey: ['admin', 'project-requirements', projectId],
    queryFn: async (): Promise<Requirement[]> => {
      if (!projectId) return []
      
      try {
        const response = await apiCall<AdminRequirementsResponse>(`/admin/requirements`, 'GET')
        
        if ('error' in response) {
          throw new Error(String(response.error))
        }
        
        if (response.success && response.data) {
          return response.data
        }
        
        throw new Error('Failed to fetch project requirements')
      } catch (error) {
        console.error('Error fetching project requirements:', error)
        throw error
      }
    },
    enabled: !!projectId,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to fetch all proposal documents (admin only)
export const useAdminProposalDocuments = () => {
  return useQuery<ProposalDocument[]>({
    queryKey: ['admin', 'proposal-documents'],
    queryFn: async (): Promise<ProposalDocument[]> => {
      try {
        const response = await adminAPI.getProposalDocuments() as { success: boolean; data: ProposalDocument[]; error?: any }

        if (response.error) {
          throw new Error(String(response.error))
        }

        if (response.success && response.data) {
          return response.data
        }

        throw new Error('Failed to fetch proposal documents')
      } catch (error) {
        console.error('Error fetching admin proposal documents:', error)
        throw error
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to get user statistics
export const useUserStats = (users: User[] | undefined) => {
  if (!users) return null
  
  const totalUsers = users.length
  const completedOnboarding = users.filter(user => user.isOnboardingCompleted).length
  const pendingOnboarding = totalUsers - completedOnboarding
  const adminUsers = users.filter(user => user.role === 'admin').length
  const regularUsers = users.filter(user => user.role === 'user').length
  
  return {
    total: totalUsers,
    completedOnboarding,
    pendingOnboarding,
    adminUsers,
    regularUsers,
    onboardingCompletionRate: totalUsers > 0 ? Math.round((completedOnboarding / totalUsers) * 100) : 0
  }
}

// Hook to get user details with related data following proper DB relationships
export const useUserDetails = (userEmail: string | null) => {
  const { data: users } = useAdminUsers()
  const { data: projects, isLoading: projectsLoading, error: projectsError } = useAdminProjects()
  const { data: clients, isLoading: clientsLoading, error: clientsError } = useAdminClients()
  const { data: milestones, isLoading: milestonesLoading, error: milestonesError } = useAdminMilestones()
  const { data: requirements, isLoading: requirementsLoading, error: requirementsError } = useAdminRequirements()

  // If userEmail is null, return null
  if (!userEmail) {
    return null
  }

  // Check for errors
  const hasErrors = projectsError || clientsError || milestonesError || requirementsError
  if (hasErrors) {
    console.error('API Errors:', {
      projects: projectsError?.message,
      clients: clientsError?.message,
      milestones: milestonesError?.message,
      requirements: requirementsError?.message
    })
  }

  // If any data is still loading, return loading state
  const isLoading = projectsLoading || clientsLoading || milestonesLoading || requirementsLoading
  if (isLoading) {
    return {
      isLoading: true,
      hasErrors,
      projects: [],
      clients: [],
      milestones: [],
      requirements: [],
      summary: {
        totalProjects: 0,
        totalMilestones: 0,
        totalRequirements: 0,
        completedMilestones: 0,
        pendingRequirements: 0
      }
    }
  }

  // Default to empty arrays if data is not available
  const safeUsers = users || []
  const safeProjects = projects || []
  const safeClients = clients || []
  const safeMilestones = milestones || []
  const safeRequirements = requirements || []

  // Debug logging
  console.log('UserDetails Debug:', {
    userEmail,
    totalUsers: safeUsers.length,
    totalProjects: safeProjects.length,
    totalClients: safeClients.length,
    totalMilestones: safeMilestones.length,
    totalRequirements: safeRequirements.length
  })

  // Step 1: Find the user by email
  const targetUser = safeUsers.find(user => user.email?.toLowerCase() === userEmail.toLowerCase())
  
  if (!targetUser) {
    console.log('User not found:', userEmail)
    return {
      isLoading: false,
      hasErrors,
      projects: [],
      clients: [],
      milestones: [],
      requirements: [],
      summary: {
        totalProjects: 0,
        totalMilestones: 0,
        totalRequirements: 0,
        completedMilestones: 0,
        pendingRequirements: 0
      }
    }
  }

  // Step 2: Find projects belonging directly to this user (projects.userId = user.id)
  const userProjects = safeProjects.filter(project => project.userId === targetUser.id)
  
  // Step 3: Find clients associated with user's projects (projects.clientId = client.id)
  const clientIds = userProjects.map(project => project.clientId).filter(Boolean) as number[]
  const userClients = safeClients.filter(client => clientIds.includes(client.id))
  
  // Step 4: Find milestones and requirements for these projects
  const projectIds = userProjects.map(project => project.id)
  const userMilestones = safeMilestones.filter(milestone => projectIds.includes(milestone.projectId))
  const userRequirements = safeRequirements.filter(requirement => projectIds.includes(requirement.projectId))

  // Debug filtered results
  console.log('Filtered Results:', {
    userEmail,
    userId: targetUser.id,
    userProjects: userProjects.length,
    projectIds,
    clientIds,
    userClients: userClients.length,
    userMilestones: userMilestones.length,
    userRequirements: userRequirements.length
  })

  return {
    isLoading: false,
    hasErrors,
    projects: userProjects,
    clients: userClients,
    milestones: userMilestones,
    requirements: userRequirements,
    summary: {
      totalProjects: userProjects.length,
      totalMilestones: userMilestones.length,
      totalRequirements: userRequirements.length,
      completedMilestones: userMilestones.filter(m => m.status?.toLowerCase() === 'completed').length,
      pendingRequirements: userRequirements.length // Requirements don't have status field
    }
  }
}