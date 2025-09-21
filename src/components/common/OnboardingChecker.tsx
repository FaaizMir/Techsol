"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import OnboardingModal from '@/components/common/onboarding-modal'

export default function OnboardingChecker() {
  const { user, isAuthenticated, updateOnboardingStatus } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [onboardingCompleted, setOnboardingCompleted] = useState(false)

  useEffect(() => {
    // Only show onboarding modal if user is authenticated, user data is loaded, onboarding is NOT completed, and we haven't marked it as completed locally
    if (isAuthenticated && user && !user.isOnboardingCompleted && !onboardingCompleted) {
      setShowModal(true)
    } else {
      setShowModal(false)
    }
  }, [isAuthenticated, user, onboardingCompleted])

  const handleOnboardingComplete = () => {
    // Mark as completed locally first to prevent re-showing
    setOnboardingCompleted(true)
    setShowModal(false)

    // Then update the global state
    updateOnboardingStatus(true)
  }

  const handleCloseModal = () => {
    // Allow closing the modal - users can close it and it will show again on next login if not completed
    setShowModal(false)
  }

  // Don't render anything if onboarding is completed (either locally or globally) or user is not authenticated
  if (!isAuthenticated || !user || user.isOnboardingCompleted || onboardingCompleted || !showModal) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <OnboardingModal
        onComplete={handleOnboardingComplete}
        onClose={handleCloseModal}
      />
    </div>
  )
}