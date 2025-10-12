"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminDashboardPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to dashboard section by default
    router.replace('/adminDashboard/dashboard')
  }, [router])

  return null
}


