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
  useProjects,
  useClearOnboarding
} from './use-onboarding-api'
import type {
  OnboardingFormData,
  SaveProjectRequest,
  SaveMilestonesRequest,
  SaveClientRequest,
  CompleteRequest,
  StartOnboardingRequest,
} from '@/types/onboarding'
import {
  sanitizeProjectData,
  sanitizeMilestoneData,
  sanitizeClientData,
  fromISODate,
} from '@/types/onboarding'

const initialData: OnboardingFormData = {
  project: { title: "", description: "", category: "", deadline: "" },
  requirements: { notes: "", files: [] },
  milestones: [],
  client: { name: "", email: "", company: "", country: "", phone: "", contactPerson: "" },
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
  const clearMutation = useClearOnboarding()

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
            
            // Check if user has started onboarding (currentStep > 0 or has projectId)
            const hasStarted = progress?.projectId || (progress?.currentStep && progress.currentStep > 0)
            
            if (hasStarted) {
              setIsResuming(true)
              // Set current step from progress
              if (progress?.currentStep !== undefined) {
                setStep(progress.currentStep)
              }
              // Set projectId from progress if available
              if (progress?.projectId) {
                setProjectId(progress.projectId)
              }
            } else {
              // New user - hasn't started onboarding yet
              setIsResuming(false)
              setStep(0)
            }
          }
        } else {
          // If no progress exists, start fresh onboarding
          setShowModal(true)
          setIsResuming(false)
          setStep(0)
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
  
  const updateData = useCallback((section: keyof OnboardingFormData, newData: OnboardingFormData[typeof section]) => {
    storeUpdateData({ [section]: newData })
  }, [storeUpdateData])
  // Populate store with fetched onboarding data
  useEffect(() => {
    if (onboardingData?.success && onboardingData.data && projectId) {
      const fetchedData = onboardingData.data
      if (fetchedData.project) {
        updateData('project', {
          title: fetchedData.project.title || "",
          description: fetchedData.project.description || "",
          category: fetchedData.project.category || "",
          deadline: fromISODate(fetchedData.project.deadline) || "",
        })
      }

      // Update requirements data
      if (fetchedData.requirements) {
        // Parse files if they're a JSON string
        let files = fetchedData.requirements.files
        if (typeof files === 'string') {
          try {
            files = JSON.parse(files)
          } catch (e) {
            console.error('Failed to parse requirements files:', e)
            files = []
          }
        }
        
        const requirements = {
          notes: fetchedData.requirements.notes || "",
          files: Array.isArray(files) ? files as any : [],
        }
        updateData('requirements', requirements)
      }

      // Update milestones data
      if (fetchedData.milestones && Array.isArray(fetchedData.milestones)) {
        const milestones = fetchedData.milestones.map((m: any) => ({
          title: m.title || "",
          deliverable: m.deliverable || "",
          deadline: fromISODate(m.deadline) || "",
          amount: String(m.amount || ""),
        }))
        updateData('milestones', milestones)
      }

      // Update client data
      if (fetchedData.client) {
        updateData('client', {
          name: fetchedData.client.name || "",
          email: fetchedData.client.email || "",
          company: fetchedData.client.company || "",
          country: fetchedData.client.country || "",
          phone: fetchedData.client.phone || "",
          contactPerson: fetchedData.client.contactPerson || "",
        })
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
      const payload: StartOnboardingRequest = { userId: user.id }
      const result = await startOnboardingMutation.mutateAsync(payload)

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

  const saveProjectDetails = async (projectData: OnboardingFormData['project']) => {
    // If no projectId exists, start onboarding first to initialize the process
    if (!projectId) {
      await startOnboarding()
      // Note: startOnboarding returns projectId: null, which is expected
      // The actual project will be created by saveProject below
    }

    if (!user?.id) {
      throw new Error("User not authenticated")
    }

    try {
      setError(null)
      // Sanitize and prepare payload
      const sanitized = sanitizeProjectData(projectData)
      const payload: SaveProjectRequest = {
        ...sanitized,
        userId: user.id,
      }

      const result = await saveProjectMutation.mutateAsync(payload)

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

  const saveRequirements = async (requirementsData: OnboardingFormData['requirements']) => {
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

  const saveMilestones = async (milestonesData: OnboardingFormData['milestones']) => {
    if (!projectId) throw new Error("No project ID available")

    try {
      setError(null)
      
      // Sanitize and convert milestones
      const sanitizedMilestones = sanitizeMilestoneData(milestonesData)
      const payload: SaveMilestonesRequest = {
        milestones: sanitizedMilestones
      }

      const result = await saveMilestonesMutation.mutateAsync({
        projectId,
        data: payload
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

  const saveClientInfo = async (clientData: OnboardingFormData['client']) => {
    if (!projectId) throw new Error("No project ID available")

    try {
      setError(null)
      
      // Sanitize client data
      const sanitizedClient = sanitizeClientData(clientData)
      
      // Validate required fields
      if (!sanitizedClient.name) {
        throw new Error("Client name is required")
      }
      if (!sanitizedClient.email) {
        throw new Error("Client email is required")
      }
      if (!sanitizedClient.country) {
        throw new Error("Client country is required")
      }

      const payload: SaveClientRequest = {
        client: sanitizedClient
      }

      const result = await saveClientMutation.mutateAsync({
        projectId,
        data: payload
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
        // Update store with review data for display
        if (result.data.project) {
          updateData('project', {
            title: result.data.project.title || "",
            description: result.data.project.description || "",
            category: result.data.project.category || "",
            deadline: fromISODate(result.data.project.deadline) || "",
          })
        }

        if (result.data.requirements) {
          // Parse files if they're a JSON string
          let files = result.data.requirements.files
          if (typeof files === 'string') {
            try {
              files = JSON.parse(files)
            } catch (e) {
              console.error('Failed to parse requirements files:', e)
              files = []
            }
          }
          
          updateData('requirements', {
            notes: result.data.requirements.notes || "",
            files: Array.isArray(files) ? files as any : [],
          })
        }

        if (result.data.milestones) {
          const milestones = result.data.milestones.map((m: any) => ({
            title: m.title || "",
            deliverable: m.deliverable || "",
            deadline: fromISODate(m.deadline) || "",
            amount: String(m.amount || ""),
          }))
          updateData('milestones', milestones)
        }

        if (result.data.client) {
          updateData('client', {
            name: result.data.client.name || "",
            email: result.data.client.email || "",
            company: result.data.client.company || "",
            country: result.data.client.country || "",
            phone: result.data.client.phone || "",
            contactPerson: result.data.client.contactPerson || "",
          })
        }

        // Don't update step here - let the modal handle step progression
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
      case 0: // Project details
        return !!(data.project?.title && data.project?.description && data.project?.category && data.project?.deadline)
      case 2: // Milestones
        return data.milestones && data.milestones.length > 0 && data.milestones.every(m => m.title && m.deliverable && m.deadline && m.amount)
      case 3: // Client info
        return !!(data.client?.name && data.client?.email && data.client?.country)
      default:
        return true
    }
  }

  const handleStepChange = async (newStep: number) => {
    if (!projectId || !user?.id) return
    
    try {
      const result = await updateStepMutation.mutateAsync({ 
        userId: user.id, 
        projectId, 
        step: newStep 
      })
      
      if (result.success) {
        setStep(newStep)
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update step"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const handleClear = async (projectIdToClear: number) => {
    try {
      await clearMutation.mutateAsync(projectIdToClear)
      // Reset state
      setProjectId(null)
      setStep(0)
      setIsComplete(false)
      setError(null)
      setShowModal(true)
    } catch (err: any) {
      const errorMessage = err.message || "Failed to clear onboarding"
      setError(errorMessage)
      throw new Error(errorMessage)
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
    updateStepMutation.isPending ||
    clearMutation.isPending

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
    handleStepChange,
    handleClear,

    // API data
    progressData: progressData?.data,
    onboardingData: onboardingData?.data,
  }
}
