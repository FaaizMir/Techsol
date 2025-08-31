"use client"

import { useState, useEffect } from "react"

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

interface OnboardingState {
  isComplete: boolean
  currentStep: number
  data: OnboardingData
}

const initialData: OnboardingData = {
  project: { title: "", description: "", category: "", deadline: "" },
  requirements: { notes: "", files: [] },
  milestones: [{ title: "", deliverable: "", deadline: "", amount: "" }],
  client: { name: "", email: "", company: "", country: "" },
}

const STORAGE_KEY = "techcraft-onboarding"

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>({
    isComplete: false,
    currentStep: 0,
    data: initialData,
  })

  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load state from localStorage on mount
  useEffect(() => {
    const loadOnboardingState = async () => {
      try {
        setIsLoading(true)
        const stored = localStorage.getItem(STORAGE_KEY)

        if (stored) {
          const parsedState = JSON.parse(stored)
          setState(parsedState)

          // Show modal if onboarding is not complete
          if (!parsedState.isComplete) {
            setShowModal(true)
          }
        } else {
          // First time user - show onboarding modal
          setShowModal(true)
        }
      } catch (error) {
        console.error("Failed to load onboarding state:", error)
        setState({
          isComplete: false,
          currentStep: 0,
          data: initialData,
        })
        setShowModal(true)
      } finally {
        setIsLoading(false)
      }
    }

    loadOnboardingState()
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      } catch (error) {
        console.error("Failed to save onboarding state:", error)
      }
    }
  }, [state, isLoading])

  const updateData = (section: keyof OnboardingData, data: any) => {
    setState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [section]: data,
      },
    }))
  }

  const setCurrentStep = (step: number) => {
    setState((prev) => ({
      ...prev,
      currentStep: step,
    }))
  }

  const completeOnboarding = () => {
    setState((prev) => ({
      ...prev,
      isComplete: true,
      currentStep: 0,
    }))
    setShowModal(false)

    console.log("Onboarding completed successfully!")
  }

  const resetOnboarding = () => {
    setState({
      isComplete: false,
      currentStep: 0,
      data: initialData,
    })
    setShowModal(true)
  }

  const startNewProject = () => {
    setState((prev) => ({
      ...prev,
      currentStep: 0,
      data: initialData,
    }))
    setShowModal(true)
  }

  const closeModal = () => {
    if (!state.isComplete && state.currentStep > 0) {
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

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!(state.data.project.title && state.data.project.description)
      case 1:
        return true // Requirements are optional
      case 2:
        return state.data.milestones.some((m) => m.title && m.amount)
      case 3:
        return !!(state.data.client.name && state.data.client.email)
      default:
        return true
    }
  }

  return {
    // State
    isComplete: state.isComplete,
    currentStep: state.currentStep,
    data: state.data,
    showModal,
    isLoading,

    // Actions
    updateData,
    setCurrentStep,
    completeOnboarding,
    resetOnboarding,
    startNewProject,
    closeModal,
    openModal,
    isStepValid,
  }
}
