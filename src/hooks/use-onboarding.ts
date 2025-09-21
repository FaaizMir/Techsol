"use client"

import { useState, useEffect } from "react"
import { useOnboardingStore } from '@/lib/stores/onboarding-store'

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

export function useOnboarding() {
  const { step, data, setStep, updateData: storeUpdateData, reset } = useOnboardingStore()

  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isComplete, setIsComplete] = useState(false)

  // Load state on mount
  useEffect(() => {
    const loadOnboardingState = async () => {
      try {
        setIsLoading(true)
        // Zustand handles persistence, so just check if data exists
        if (Object.keys(data).length > 0) {
          setIsComplete(false)
          setShowModal(true)
        } else {
          setShowModal(true)
        }
      } catch (error) {
        console.error("Failed to load onboarding state:", error)
        setShowModal(true)
      } finally {
        setIsLoading(false)
      }
    }

    loadOnboardingState()
  }, [data])

  const updateData = (section: keyof OnboardingData, newData: OnboardingData[typeof section]) => {
    storeUpdateData({ [section]: newData })
  }

  const setCurrentStep = (stepNum: number) => {
    setStep(stepNum)
  }

  const completeOnboarding = () => {
    setIsComplete(true)
    setShowModal(false)
    console.log("Onboarding completed successfully!")
  }

  const resetOnboarding = () => {
    reset()
    setIsComplete(false)
    setShowModal(true)
  }

  const startNewProject = () => {
    reset()
    setIsComplete(false)
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
      case 0:
        return !!(data.project?.title && data.project?.description)
      case 1:
        return true // Requirements are optional
      case 2:
        return data.milestones?.some((m: OnboardingData['milestones'][0]) => m.title && m.amount)
      case 3:
        return !!(data.client?.name && data.client?.email)
      default:
        return true
    }
  }

  return {
    // State
    isComplete,
    currentStep: step,
    data,
    showModal,
    setShowModal,
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
