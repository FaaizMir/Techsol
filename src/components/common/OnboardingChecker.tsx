"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import OnboardingModal from '@/components/common/onboarding-modal'

export default function OnboardingChecker() {
  const { user, isAuthenticated, updateOnboardingStatus } = useAuth()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user && !user.isOnboardingCompleted) {
      setShowModal(true)
    }
  }, [isAuthenticated, user])

  const handleOnboardingComplete = () => {
    setShowModal(false)
    updateOnboardingStatus(true)
  }

  const handleCloseModal = () => {
    // Allow closing the modal - users can close it and it will show again on next login if not completed
    setShowModal(false)
  }

  if (!showModal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <OnboardingModal
        onComplete={handleOnboardingComplete}
        onClose={handleCloseModal}
      />
    </div>
  )
}