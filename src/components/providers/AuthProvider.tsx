"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'
import { apiCall } from '@/lib/api'

interface User {
  id: number;
  email: string;
  username?: string;
  isOnboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
  updateOnboardingStatus: (completed: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  const {
    isAuthenticated,
    user,
    setAuth,
    clearAuth,
    setUser,
    updateOnboardingStatus
  } = useAuthStore()

  const login = async (email: string, password: string) => {
    try {
      const response = await apiCall<{ token: string; user: User }>('/auth/login', 'POST', { email, password })

      if (response.token) {
        localStorage.setItem('token', response.token)
        setAuth(response.token, response.user)
        // Check if onboarding is needed
        if (!response.user.isOnboardingCompleted) {
          router.push('/dashboard') // Will show onboarding modal
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error) {
      throw error
    }
  }

  const signup = async (email: string, password: string) => {
    try {
      const response = await apiCall<{ message: string; user: User }>('/auth/signup', 'POST', { email, password })

      router.push('/login')
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    clearAuth()
    router.push('/login')
  }

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setIsLoading(false)
        return
      }

      const response = await apiCall<{ valid: boolean; user: User }>('/auth/check-auth', 'GET', undefined, {
        'Authorization': `Bearer ${token}`
      })

      if (response.valid && response.user) {
        setAuth(token, response.user)
      } else {
        localStorage.removeItem('token')
        clearAuth()
      }
    } catch (error) {
      localStorage.removeItem('token')
      clearAuth()
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    login,
    signup,
    logout,
    checkAuth,
    updateOnboardingStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}