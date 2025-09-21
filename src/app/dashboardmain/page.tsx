"use client"

import { Suspense } from "react"
import Dashboard from "../(protected)/dashboard/page"

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
  return (
    <div className="dark min-h-screen">
      <Dashboard />
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
