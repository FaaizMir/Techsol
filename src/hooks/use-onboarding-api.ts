"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { onboardingAPI } from '@/lib/api'
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
} from '@/types/onboarding'

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
    mutationFn: (data: StartOnboardingRequest) => 
      onboardingAPI.start(data),
    onSuccess: (response, variables) => {
      if (response.success && response.data) {
        // Invalidate progress queries
        queryClient.invalidateQueries({ queryKey: onboardingKeys.progress(variables.userId) })
      }
    },
    onError: (error: any) => {
      console.error('Start onboarding error:', error)
    }
  })
}

// Save project details mutation
export function useSaveProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SaveProjectRequest) =>
      onboardingAPI.saveProject(data),
    onSuccess: (response, variables) => {
      if (response.success && response.data?.project?.id) {
        // Update the onboarding data cache
        queryClient.invalidateQueries({
          queryKey: onboardingKeys.data(response.data.project.id)
        })
        // Invalidate progress to update cache
        if (variables.userId) {
          queryClient.invalidateQueries({
            queryKey: onboardingKeys.progress(variables.userId)
          })
        }
      }
    },
    onError: (error: any) => {
      console.error('Save project error:', error)
    }
  })
}

// Save requirements mutation
export function useSaveRequirements() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, formData }: { projectId: number; formData: FormData }) =>
      onboardingAPI.saveRequirements(projectId, formData),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Update the onboarding data cache
        queryClient.invalidateQueries({
          queryKey: onboardingKeys.data(variables.projectId)
        })
        // Invalidate requirements cache
        queryClient.invalidateQueries({
          queryKey: onboardingKeys.requirements(variables.projectId)
        })
      }
    },
    onError: (error: any) => {
      console.error('Save requirements error:', error)
    }
  })
}

// Save milestones mutation
export function useSaveMilestones() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: SaveMilestonesRequest }) =>
      onboardingAPI.saveMilestones(projectId, data),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Update the onboarding data cache
        queryClient.invalidateQueries({
          queryKey: onboardingKeys.data(variables.projectId)
        })
        // Invalidate milestones cache
        queryClient.invalidateQueries({
          queryKey: onboardingKeys.milestones(variables.projectId)
        })
      }
    },
    onError: (error: any) => {
      console.error('Save milestones error:', error)
    }
  })
}

// Save client info mutation
export function useSaveClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: SaveClientRequest }) =>
      onboardingAPI.saveClient(projectId, data),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Update the onboarding data cache
        queryClient.invalidateQueries({
          queryKey: onboardingKeys.data(variables.projectId)
        })
        // Invalidate client cache
        queryClient.invalidateQueries({
          queryKey: onboardingKeys.client(variables.projectId)
        })
      }
    },
    onError: (error: any) => {
      console.error('Save client error:', error)
    }
  })
}

// Review onboarding data mutation
export function useReviewOnboarding() {
  return useMutation({
    mutationFn: (data: ReviewRequest) => 
      onboardingAPI.review(data),
    onError: (error: any) => {
      console.error('Review onboarding error:', error)
    }
  })
}

// Complete onboarding mutation
export function useCompleteOnboarding() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CompleteRequest) =>
      onboardingAPI.complete(data),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Invalidate all onboarding queries
        queryClient.invalidateQueries({ queryKey: onboardingKeys.all })
        // Specifically invalidate progress
        queryClient.invalidateQueries({
          queryKey: onboardingKeys.progress(variables.userId)
        })
      }
    },
    onError: (error: any) => {
      console.error('Complete onboarding error:', error)
    }
  })
}

// Get onboarding progress query
export function useOnboardingProgress(userId: number) {
  return useQuery({
    queryKey: onboardingKeys.progress(userId),
    queryFn: () => onboardingAPI.getProgress(userId),
    enabled: !!userId && userId > 0,
    staleTime: 30000, // 30 seconds
    retry: 2,
  })
}

// Get onboarding data query
export function useOnboardingData(projectId: number) {
  return useQuery({
    queryKey: onboardingKeys.data(projectId),
    queryFn: () => onboardingAPI.getOnboardingData(projectId),
    enabled: !!projectId && projectId > 0,
    staleTime: 30000,
    retry: 2,
  })
}

// Update onboarding step mutation
export function useUpdateOnboardingStep() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateStepRequest) =>
      onboardingAPI.updateStep(data),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Invalidate progress queries
        queryClient.invalidateQueries({
          queryKey: onboardingKeys.progress(variables.userId)
        })
      }
    },
    onError: (error: any) => {
      console.error('Update step error:', error)
    }
  })
}

// Get all projects query
export function useProjects() {
  return useQuery({
    queryKey: onboardingKeys.projects(),
    queryFn: () => onboardingAPI.getProjects(),
    staleTime: 60000, // 1 minute
    retry: 2,
  })
}

// Get project by ID query
export function useProject(projectId: number) {
  return useQuery({
    queryKey: onboardingKeys.project(projectId),
    queryFn: () => onboardingAPI.getProjectById(projectId),
    enabled: !!projectId && projectId > 0,
    staleTime: 30000,
    retry: 2,
  })
}

// Get requirements for project query
export function useRequirements(projectId: number) {
  return useQuery({
    queryKey: onboardingKeys.requirements(projectId),
    queryFn: () => onboardingAPI.getRequirements(projectId),
    enabled: !!projectId && projectId > 0,
    staleTime: 30000,
    retry: 2,
  })
}

// Get milestones for project query
export function useMilestones(projectId: number) {
  return useQuery({
    queryKey: onboardingKeys.milestones(projectId),
    queryFn: () => onboardingAPI.getMilestones(projectId),
    enabled: !!projectId && projectId > 0,
    staleTime: 30000,
    retry: 2,
  })
}

// Clear onboarding mutation
export function useClearOnboarding() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (projectId: number) => onboardingAPI.deleteProject(projectId),
    onSuccess: () => {
      // Invalidate all onboarding queries
      queryClient.invalidateQueries({ queryKey: onboardingKeys.all })
    },
    onError: (error: any) => {
      console.error('Clear onboarding error:', error)
    }
  })
}
