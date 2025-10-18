"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'
import { apiCall } from '@/lib/api'

interface User {
  id: number;
  email: string;
  username?: string;
  role: 'user' | 'admin';
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

      // Check if the response contains an error
      if ('error' in response) {
        throw new Error(String(response.error))
      }

      if (response.token) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('jwt_token', response.token) // For socket compatibility
        localStorage.setItem('user_id', response.user.id.toString()) // Store user ID
        localStorage.setItem('user_role', response.user.role) // Store user role
        setAuth(response.token, response.user)
        
        // Check user role and redirect accordingly
        if (response.user.role === 'admin') {
          router.push('/admin')
        } else {
          // Check if onboarding is needed for regular users
          if (!response.user.isOnboardingCompleted) {
            router.push('/dashboard') // Will show onboarding modal
          } else {
            router.push('/dashboard')
          }
        }
      } else {
        throw new Error('Login failed: No token received')
      }
    } catch (error) {
      throw error
    }
  }

  const signup = async (email: string, password: string) => {
    try {
      const response = await apiCall<{ message: string; user: User }>('/auth/signup', 'POST', { email, password })

      // Check if the response contains an error
      if ('error' in response) {
        throw new Error(String(response.error))
      }

      router.push('/login')
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_role')
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

      const response = await apiCall<{ valid: boolean; user: User }>('/protected/check-auth', 'GET')

      if (response.valid && response.user) {
        setAuth(token, response.user)
        localStorage.setItem('user_id', response.user.id.toString())
        localStorage.setItem('user_role', response.user.role)
      } else {
        localStorage.removeItem('token')
        localStorage.removeItem('jwt_token')
        localStorage.removeItem('user_id')
        localStorage.removeItem('user_role')
        clearAuth()
      }
    } catch (error) {
      localStorage.removeItem('token')
      localStorage.removeItem('jwt_token')
      localStorage.removeItem('user_id')
      localStorage.removeItem('user_role')
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