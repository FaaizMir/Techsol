"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { onboardingAPI } from '@/lib/api'

// API Response Types
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
}

interface StartOnboardingResponse {
  projectId: number
  currentStep: number
  message: string
}

interface SaveProjectResponse {
  project: {
    id: number
    title: string
    description: string
    category: string
    deadline: string
    status: string
    userId: number
    createdAt: string
    updatedAt: string
  }
  nextStep: number
}

interface SaveRequirementsResponse {
  requirements: {
    id: number
    projectId: number
    notes: string
    files: Array<{
      filename: string
      originalName: string
      mimetype: string
      size: number
      url: string
      uploadedAt: string
    }>
    createdAt: string
    updatedAt: string
  }
  nextStep: number
}

interface SaveMilestonesResponse {
  milestones: Array<{
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
  }>
  nextStep: number
}

interface SaveClientResponse {
  client: {
    id: number
    projectId: number
    name: string
    email: string
    company: string
    country: string
    phone?: string
    createdAt: string
    updatedAt: string
  }
  nextStep: number
}

interface ReviewResponse {
  project: any
  requirements: any
  milestones: any[]
  client: any
  nextStep: number
}

interface CompleteResponse {
  message: string
  project: {
    id: number
    status: string
  }
}

interface ProgressResponse {
  currentStep: number
  isCompleted: boolean
  completedSteps: number[]
  lastUpdated: string
  projectId: number
}

interface OnboardingDataResponse {
  project: any
  requirements: any
  milestones: any[]
  client: any
  progress: {
    currentStep: number
    isCompleted: boolean
  }
}

interface UpdateStepResponse {
  message: string
  currentStep: number
}

interface ProjectsResponse {
  projects: Array<{
    id: number
    title: string
    description: string
    category: string
    deadline: string
    status: string
    userId: number
    createdAt: string
    updatedAt: string
  }>
}

interface ProjectResponse {
  project: {
    id: number
    title: string
    description: string
    category: string
    deadline: string
    status: string
    userId: number
    createdAt: string
    updatedAt: string
  }
}

interface RequirementsResponse {
  requirements: {
    id: number
    projectId: number
    notes: string
    files: Array<{
      filename: string
      originalName: string
      mimetype: string
      size: number
      url: string
      uploadedAt: string
    }>
    createdAt: string
    updatedAt: string
  }
}

interface MilestonesResponse {
  milestones: Array<{
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
  }>
}

interface ClientResponse {
  client: {
    id: number
    projectId: number
    name: string
    email: string
    company: string
    country: string
    phone?: string
    createdAt: string
    updatedAt: string
  }
}

// Query keys
export const onboardingKeys = {
  all: ['onboarding'] as const,
  progress: (userId: number) => [...onboardingKeys.all, 'progress', userId] as const,
  data: (projectId: number) => [...onboardingKeys.all, 'data', projectId] as const,
  projects: () => [...onboardingKeys.all, 'projects'] as const,
  project: (projectId: number) => [...onboardingKeys.all, 'project', projectId] as const,
  requirements: (projectId: number) => [...onboardingKeys.all, 'requirements', projectId] as const,
  milestones: (projectId: number) => [...onboardingKeys.all, 'milestones', projectId] as const,
  client: (projectId: number) => [...onboardingKeys.all, 'client', projectId] as const,
}

// Start onboarding mutation
export function useStartOnboarding() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: number) => onboardingAPI.start({ userId }) as Promise<ApiResponse<StartOnboardingResponse>>,
    onSuccess: (data) => {
      if (data.success && data.data?.projectId) {
        // Invalidate progress queries
        queryClient.invalidateQueries({ queryKey: onboardingKeys.all })
      }
    },
  })
}

// Save project details mutation
export function useSaveProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { projectId?: number; title: string; description: string; category: string; deadline: string }) =>
      onboardingAPI.saveProject(data) as Promise<ApiResponse<SaveProjectResponse>>,
    onSuccess: (data, variables) => {
      if (data.success && data.data?.project?.id) {
        // Update the onboarding data cache
        queryClient.invalidateQueries({
          queryKey: onboardingKeys.data(data.data.project.id)
        })
      }
    },
  })
}

// Save requirements mutation
export function useSaveRequirements() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, formData }: { projectId: number; formData: FormData }) =>
      onboardingAPI.saveRequirements(projectId, formData) as Promise<ApiResponse<SaveRequirementsResponse>>,
    onSuccess: (data, variables) => {
      if (data.success) {
        // Update the onboarding data cache
        queryClient.invalidateQueries({
          queryKey: onboardingKeys.data(variables.projectId)
        })
      }
    },
  })
}

// Save milestones mutation
export function useSaveMilestones() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, milestones }: { projectId: number; milestones: any[] }) =>
      onboardingAPI.saveMilestones(projectId, milestones) as Promise<ApiResponse<SaveMilestonesResponse>>,
    onSuccess: (data, variables) => {
      if (data.success) {
        // Update the onboarding data cache
        queryClient.invalidateQueries({
          queryKey: onboardingKeys.data(variables.projectId)
        })
      }
    },
  })
}

// Save client info mutation
export function useSaveClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, client }: { projectId: number; client: { name: string; email: string; company?: string; country: string; phone?: string } }) =>
      onboardingAPI.saveClient(projectId, client) as Promise<ApiResponse<SaveClientResponse>>,
    onSuccess: (data, variables) => {
      if (data.success) {
        // Update the onboarding data cache
        queryClient.invalidateQueries({
          queryKey: onboardingKeys.data(variables.projectId)
        })
      }
    },
  })
}

// Review onboarding data mutation
export function useReviewOnboarding() {
  return useMutation({
    mutationFn: (data: { projectId: number }) => onboardingAPI.review(data) as Promise<ApiResponse<ReviewResponse>>,
  })
}

// Complete onboarding mutation
export function useCompleteOnboarding() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { projectId: number; userId: number }) =>
      onboardingAPI.complete(data) as Promise<ApiResponse<CompleteResponse>>,
    onSuccess: (data, variables) => {
      if (data.success) {
        // Invalidate all onboarding queries
        queryClient.invalidateQueries({ queryKey: onboardingKeys.all })
      }
    },
  })
}

// Get onboarding progress query
export function useOnboardingProgress(userId: number) {
  return useQuery({
    queryKey: onboardingKeys.progress(userId),
    queryFn: () => onboardingAPI.getProgress(userId) as Promise<ApiResponse<ProgressResponse>>,
    enabled: !!userId,
  })
}

// Get onboarding data query
export function useOnboardingData(projectId: number) {
  return useQuery({
    queryKey: onboardingKeys.data(projectId),
    queryFn: () => onboardingAPI.getOnboardingData(projectId) as Promise<ApiResponse<OnboardingDataResponse>>,
    enabled: !!projectId,
  })
}

// Update onboarding step mutation
export function useUpdateOnboardingStep() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { userId: number; projectId: number; step: number }) =>
      onboardingAPI.updateStep(data) as Promise<ApiResponse<UpdateStepResponse>>,
    onSuccess: (data, variables) => {
      if (data.success) {
        // Invalidate progress queries
        queryClient.invalidateQueries({
          queryKey: onboardingKeys.progress(variables.userId)
        })
      }
    },
  })
}

// Get all projects query
export function useProjects() {
  return useQuery({
    queryKey: onboardingKeys.projects(),
    queryFn: () => onboardingAPI.getProjects() as Promise<ApiResponse<ProjectsResponse>>,
  })
}

// Get project by ID query
export function useProject(projectId: number) {
  return useQuery({
    queryKey: onboardingKeys.project(projectId),
    queryFn: () => onboardingAPI.getProjectById(projectId) as Promise<ApiResponse<ProjectResponse>>,
    enabled: !!projectId,
  })
}

// Get requirements for project query
export function useRequirements(projectId: number) {
  return useQuery({
    queryKey: onboardingKeys.requirements(projectId),
    queryFn: () => onboardingAPI.getRequirements(projectId) as Promise<ApiResponse<RequirementsResponse>>,
    enabled: !!projectId,
  })
}

// Get milestones for project query
export function useMilestones(projectId: number) {
  return useQuery({
    queryKey: onboardingKeys.milestones(projectId),
    queryFn: () => onboardingAPI.getMilestones(projectId) as Promise<ApiResponse<MilestonesResponse>>,
    enabled: !!projectId,
  })
}

// Get client for project query
export function useClient(projectId: number) {
  return useQuery({
    queryKey: onboardingKeys.client(projectId),
    queryFn: () => onboardingAPI.getClient(projectId) as Promise<ApiResponse<ClientResponse>>,
    enabled: !!projectId,
  })
}