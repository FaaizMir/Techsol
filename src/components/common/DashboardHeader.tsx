"use client"

import { useAuth } from "@/components/providers/AuthProvider"
import Button from "@/components/common/Button"
import { LogOut, Home, User } from "lucide-react"
import Link from "next/link"

export default function DashboardHeader() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header className="bg-[#0a0f1c] border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              TechSol Dashboard
            </h1>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="flex items-center space-x-2 text-gray-300">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">
                {user?.email || 'User'}
              </span>
            </div>

         

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-400"
              icon={<LogOut className="h-4 w-4" />}
              iconPosition="left"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}