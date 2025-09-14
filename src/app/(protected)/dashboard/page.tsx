"use client"

import { useAuth } from "@/components/providers/AuthProvider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, User, Settings, Home } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-[#0a0f1c] bg-[radial-gradient(circle_at_50%_50%,#0a0f2c,#0d1117)]">
      {/* Navigation */}
      <nav className="bg-[#0a0f1c] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">TechSol Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-300 hover:text-white">
                <Home className="h-5 w-5" />
              </Link>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-gray-300 hover:text-white"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.username}!
            </h2>
            <p className="text-gray-400">
              Manage your projects and connect with clients from your dashboard.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-[#0a0f1c] border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Active Projects</CardTitle>
                <User className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">5</div>
                <p className="text-xs text-gray-400">+2 from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-[#0a0f1c] border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Completed</CardTitle>
                <Settings className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">12</div>
                <p className="text-xs text-gray-400">+3 this month</p>
              </CardContent>
            </Card>

            <Card className="bg-[#0a0f1c] border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Revenue</CardTitle>
                <User className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">$24,500</div>
                <p className="text-xs text-gray-400">+15% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-[#0a0f1c] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription className="text-gray-400">
                Get started with common tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link href="/onboarding">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                    Start New Project
                  </Button>
                </Link>
                <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                  View Projects
                </Button>
                <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}