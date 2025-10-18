"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/AuthProvider"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, user?.role, router])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0a0f1c]">
        <div className="animate-pulse text-xl md:text-2xl text-white">
          Loading Admin Dashboard...
        </div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0a0f1c]">
        <div className="text-xl md:text-2xl text-white">
          Access Denied - Admin Only
        </div>
      </div>
    )
  }

  return <>{children}</>
}
