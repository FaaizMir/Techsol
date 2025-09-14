"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'

interface PublicRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export function PublicRoute({ children, redirectTo = '/dashboard' }: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, router, redirectTo])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-900">
        <div className="animate-pulse text-xl md:text-2xl text-white">
          Loading...
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return <>{children}</>
}