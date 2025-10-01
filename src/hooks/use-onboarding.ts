"use client"

import { useState, useEffect, useCallback } from "react"
import { useQuery } from '@tanstack/react-query'
import { useOnboardingStore } from '@/lib/stores/onboarding-store'
import { useAuthStore } from '@/lib/stores/auth-store'
import { onboardingAPI } from '@/lib/api'
import {
  useStartOnboarding,
  useSaveProject,
  useSaveRequirements,
  useSaveMilestones,
  useSaveClient,
  useReviewOnboarding,
  useCompleteOnboarding,
  useOnboardingProgress,
  useOnboardingData,
  useUpdateOnboardingStep,
  useProjects
} from './use-onboarding-api'

interface OnboardingData {
  project: {
    title: string
    description: string
    category: string
    deadline: string
  }
  requirements: {
    notes: string
    files: File[]
  }
  milestones: Array<{
    title: string
    deliverable: string
    deadline: string
    amount: string
  }>
  client: {
    name: string
    email: string
    company: string
    country: string
  }
}

const initialData: OnboardingData = {
  project: { title: "", description: "", category: "", deadline: "" },
  requirements: { notes: "", files: [] },
  milestones: [{ title: "", deliverable: "", deadline: "", amount: "" }],
  client: { name: "", email: "", company: "", country: "" },
}

// Get all projects with filters (dashboard) - exported hook
export const useAllProjects = (params?: {
  status?: string;
  client?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['clientProjects', params],
    queryFn: () => onboardingAPI.getAllProjects(params),
  });
};

export function useOnboarding() {
  const { step, data, setStep, updateData: storeUpdateData, reset } = useOnboardingStore()
  const { user } = useAuthStore()

  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isComplete, setIsComplete] = useState(false)
  const [projectId, setProjectId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isResuming, setIsResuming] = useState(false)

  // API hooks
  const startOnboardingMutation = useStartOnboarding()
  const saveProjectMutation = useSaveProject()
  const saveRequirementsMutation = useSaveRequirements()
  const saveMilestonesMutation = useSaveMilestones()
  const saveClientMutation = useSaveClient()
  const reviewMutation = useReviewOnboarding()
  const completeMutation = useCompleteOnboarding()
  const updateStepMutation = useUpdateOnboardingStep()

  // Progress query
  const { data: progressData, refetch: refetchProgress } = useOnboardingProgress(user?.id || 0)

  // Projects query
  const { data: projectsData, refetch: refetchProjects } = useProjects()

  // Onboarding data query
  const { data: onboardingData, refetch: refetchOnboardingData } = useOnboardingData(projectId || 0)

  // Load state on mount
  useEffect(() => {
    const loadOnboardingState = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (!user?.id) {
          setShowModal(false)
          return
        }

        // Check if onboarding is already completed
        if (user.isOnboardingCompleted) {
          setIsComplete(true)
          setShowModal(false)
          return
        }

        // Fetch progress
        const progressResult = await refetchProgress()
        if (progressResult.data?.success) {
          const progress = progressResult.data.data
          if (progress?.isCompleted) {
            setIsComplete(true)
            setShowModal(false)
          } else {
            setShowModal(true)
            setIsResuming(true) // Indicate we're resuming existing onboarding
            // Set current step from progress
            if (progress?.currentStep !== undefined) {
              setStep(progress.currentStep)
            }
            // Set projectId from progress
            if (progress?.projectId) {
              setProjectId(progress.projectId)
            } else {
              // Fetch projects to find the most recent draft project for onboarding
              try {
                const projectsResult = await refetchProjects()
                if (projectsResult.data?.success && projectsResult.data.data?.projects?.length) {
                  // Find the most recent draft project (assuming onboarding creates draft projects)
                  const projects = projectsResult.data.data.projects
                  const draftProjects = projects.filter((p: any) => p.status === 'draft')
                  if (draftProjects.length > 0) {
                    // Sort by createdAt descending and take the most recent
                    const latestDraftProject = draftProjects.sort((a: any, b: any) =>
                      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    )[0]
                    setProjectId(latestDraftProject.id)
                  }
                }
              } catch (projectsError) {
                console.error('Failed to fetch projects for onboarding:', projectsError)
                // Continue without projectId - it will be created when saving project details
              }
            }
          }
        } else {
          // If no progress exists, start onboarding
          setShowModal(true)
          setIsResuming(false)
        }
      } catch (error) {
        console.error("Failed to load onboarding state:", error)
        setError("Failed to load onboarding data")
        setShowModal(true)
      } finally {
        setIsLoading(false)
      }
    }

    loadOnboardingState()
  }, [user?.id, user?.isOnboardingCompleted, refetchProgress, refetchProjects, setStep])

  // Guard: prevent accessing submit step without minimum required data
  useEffect(() => {
    if (step === 6 && !isResuming) {
      const hasMinimumData = !!(
        (data.project?.title && data.project?.description) ||
        (data.client?.name && data.client?.email) ||
        (data.milestones?.length > 0 && data.milestones.some((m: any) => m.title))
      )
      if (!hasMinimumData) {
        setStep(0)
      }
    }
  }, [step, data, setStep, isResuming])
  
  const updateData = useCallback((section: keyof OnboardingData, newData: OnboardingData[typeof section]) => {
    storeUpdateData({ [section]: newData })
  }, [storeUpdateData])
  // Populate store with fetched onboarding data
  useEffect(() => {
    if (onboardingData?.success && onboardingData.data && projectId) {
      const fetchedData = onboardingData.data
      if (fetchedData.project) {
        updateData('project', fetchedData.project)
      }
      if (fetchedData.requirements) {
        // Files should already be an array from the API, but handle legacy string format
        const requirements = { ...fetchedData.requirements }
        if (typeof requirements.files === 'string') {
          try {
            requirements.files = JSON.parse(requirements.files)
          } catch (e) {
            console.warn('Failed to parse requirements files, using empty array')
            requirements.files = []
          }
        } else if (!Array.isArray(requirements.files)) {
          requirements.files = []
        }
        updateData('requirements', requirements)
      }
      if (fetchedData.milestones && Array.isArray(fetchedData.milestones)) {
        updateData('milestones', fetchedData.milestones)
      }
      if (fetchedData.client) {
        updateData('client', fetchedData.client)
      }
    }
  }, [onboardingData, projectId, updateData])


  const setCurrentStep = (stepNum: number) => {
    setStep(stepNum)
  }

  // API integration methods
  const startOnboarding = async () => {
    if (!user?.id) return

    try {
      setError(null)
      const result = await startOnboardingMutation.mutateAsync(user.id)

      if (result.success && result.data) {
        // Note: projectId is null here - actual project created in saveProjectDetails
        setCurrentStep(result.data.currentStep)
        return result.data
      } else {
        throw new Error(result.error?.message || "Failed to start onboarding")
      }
    } catch (err: any) {
      setError(err.message || "Failed to start onboarding")
      throw err
    }
  }

  const saveProjectDetails = async (projectData: OnboardingData['project']) => {
    // If no projectId exists, start onboarding first to initialize the process
    if (!projectId) {
      await startOnboarding()
      // Note: startOnboarding returns projectId: null, which is expected
      // The actual project will be created by saveProject below
    }

    try {
      setError(null)
      // Call saveProject without projectId to create the actual project
      const result = await saveProjectMutation.mutateAsync({
        ...projectData
        // projectId is intentionally omitted to create a new project
      })

      if (result.success && result.data?.project?.id) {
        // Set the real projectId from the created project
        setProjectId(result.data.project.id)
        setCurrentStep(result.data?.nextStep || step + 1)
        return result.data
      } else {
        throw new Error(result.error?.message || "Failed to save project details")
      }
    } catch (err: any) {
      setError(err.message || "Failed to save project details")
      throw err
    }
  }

  const saveRequirements = async (requirementsData: OnboardingData['requirements']) => {
    if (!projectId) throw new Error("No project ID available")

    try {
      setError(null)
      const formData = new FormData()
      formData.append('notes', requirementsData.notes)

      requirementsData.files.forEach((file) => {
        formData.append('files', file)
      })

      const result = await saveRequirementsMutation.mutateAsync({
        projectId,
        formData
      })

      if (result.success) {
        setCurrentStep(result.data?.nextStep || step + 1)
        return result.data
      } else {
        throw new Error(result.error?.message || "Failed to save requirements")
      }
    } catch (err: any) {
      setError(err.message || "Failed to save requirements")
      throw err
    }
  }

  const saveMilestones = async (milestonesData: OnboardingData['milestones']) => {
    if (!projectId) throw new Error("No project ID available")

    try {
      setError(null)
      const result = await saveMilestonesMutation.mutateAsync({
        projectId,
        milestones: milestonesData
      })

      if (result.success) {
        setCurrentStep(result.data?.nextStep || step + 1)
        return result.data
      } else {
        throw new Error(result.error?.message || "Failed to save milestones")
      }
    } catch (err: any) {
      setError(err.message || "Failed to save milestones")
      throw err
    }
  }

  const saveClientInfo = async (clientData: OnboardingData['client']) => {
    if (!projectId) throw new Error("No project ID available")

    try {
      setError(null)
      const result = await saveClientMutation.mutateAsync({
        projectId,
        client: clientData
      })

      if (result.success) {
        setCurrentStep(result.data?.nextStep || step + 1)
        return result.data
      } else {
        throw new Error(result.error?.message || "Failed to save client info")
      }
    } catch (err: any) {
      setError(err.message || "Failed to save client info")
      throw err
    }
  }

  const reviewData = async () => {
    if (!projectId) throw new Error("No project ID available")

    try {
      setError(null)
      const result = await reviewMutation.mutateAsync({ projectId })

      if (result.success && result.data) {
        // Update store with review data
        const reviewData = result.data
        if (reviewData.project) updateData('project', reviewData.project)
        if (reviewData.requirements) {
          // Parse files string to array if needed
          const requirements = { ...reviewData.requirements }
          if (typeof requirements.files === 'string') {
            try {
              requirements.files = JSON.parse(requirements.files)
            } catch (e) {
              requirements.files = []
            }
          }
          updateData('requirements', requirements)
        }
        if (reviewData.milestones) updateData('milestones', reviewData.milestones)
        if (reviewData.client) updateData('client', reviewData.client)
        setCurrentStep(result.data?.nextStep || step + 1)
        return result.data
      } else {
        throw new Error(result.error?.message || "Failed to review data")
      }
    } catch (err: any) {
      setError(err.message || "Failed to review data")
      throw err
    }
  }

  const completeOnboardingProcess = async () => {
    if (!projectId || !user?.id) throw new Error("Missing project ID or user ID")

    try {
      setError(null)
      const result = await completeMutation.mutateAsync({
        projectId,
        userId: user.id
      })

      if (result.success) {
        setIsComplete(true)
        setShowModal(false)
        return result.data
      } else {
        throw new Error(result.error?.message || "Failed to complete onboarding")
      }
    } catch (err: any) {
      setError(err.message || "Failed to complete onboarding")
      throw err
    }
  }

  const completeOnboarding = () => {
    setIsComplete(true)
    setShowModal(false)
    console.log("Onboarding completed successfully!")
  }

  const resetOnboarding = () => {
    reset()
    setProjectId(null)
    setIsComplete(false)
    setError(null)
    setShowModal(true)
  }

  const startNewProject = () => {
    reset()
    setProjectId(null)
    setIsComplete(false)
    setError(null)
    setShowModal(true)
  }

  const closeModal = () => {
    if (!isComplete && step > 0) {
      const confirmClose = window.confirm(
        "Are you sure you want to close? Your progress will be saved, but you'll need to complete the onboarding later.",
      )
      if (!confirmClose) return
    }
    setShowModal(false)
  }

  const openModal = () => {
    setShowModal(true)
  }

  const isStepValid = (stepNum: number): boolean => {
    switch (stepNum) {
      case 1: // Project details
        return !!(data.project?.title && data.project?.description)
      case 3: // Payment plan (milestones)
        return data.milestones?.some((m: OnboardingData['milestones'][0]) => m.title && m.amount) ?? false
      case 4: // Client info
        return !!(data.client?.name && data.client?.email)
      default:
        return true
    }
  }

  // Combined loading state
  const isAnyLoading = isLoading ||
    startOnboardingMutation.isPending ||
    saveProjectMutation.isPending ||
    saveRequirementsMutation.isPending ||
    saveMilestonesMutation.isPending ||
    saveClientMutation.isPending ||
    reviewMutation.isPending ||
    completeMutation.isPending ||
    updateStepMutation.isPending

  return {
    // State
    isComplete,
    currentStep: step,
    data,
    showModal,
    setShowModal,
    isLoading: isAnyLoading,
    projectId,
    error,
    isResuming,

    // Actions
    updateData,
    setCurrentStep,
    startOnboarding,
    saveProjectDetails,
    saveRequirements,
    saveMilestones,
    saveClientInfo,
    reviewData,
    completeOnboardingProcess,
    completeOnboarding,
    resetOnboarding,
    startNewProject,
    closeModal,
    openModal,
    isStepValid,

    // API data
    progressData: progressData?.data,
    onboardingData: onboardingData?.data,
  }
}
