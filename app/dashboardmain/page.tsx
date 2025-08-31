"use client"

import { Suspense } from "react"
import Dashboard from "../dashboard/page"
import OnboardingModal from "../components/onboarding-modal"
import { useOnboarding } from "@/hooks/use-onboarding"

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-muted-foreground">Loading TechCraft Solutions...</p>
      </div>
    </div>
  )
}

function MainApp() {
  const { isComplete, showModal, completeOnboarding, closeModal, startNewProject } = useOnboarding()

  return (
    <div className="dark min-h-screen">
      <Dashboard onShowOnboarding={startNewProject} />
      {showModal && <OnboardingModal onComplete={completeOnboarding} onClose={closeModal} />}
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <MainApp />
    </Suspense>
  )
}
