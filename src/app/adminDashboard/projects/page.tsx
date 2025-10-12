"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAdminProjects, useAdminUsers, useAdminClients, type Project, type User } from "@/hooks/use-admin"
import { UserDetailsModal } from "@/components/admin-dashboard/UserDetailsModal"
import { Loader2, Search, FolderOpen, Calendar, DollarSign, User as UserIcon } from "lucide-react"

const statusColors = {
  "planning": "bg-yellow-600",
  "in progress": "bg-blue-600",
  "active": "bg-blue-600",
  "review": "bg-orange-600",
  "completed": "bg-green-600",
  "done": "bg-green-600",
  "on hold": "bg-gray-600",
  "cancelled": "bg-red-600"
}

export default function ProjectsPage() {
  const { data: projects, isLoading: projectsLoading, error: projectsError } = useAdminProjects()
  const { data: clients, isLoading: clientsLoading } = useAdminClients()
  const { data: users, isLoading: usersLoading } = useAdminUsers()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const isLoading = projectsLoading || clientsLoading || usersLoading
  const error = projectsError

  // Group projects by user following the CORRECTED relationship: Project -> User (direct)
  const userProjects = useMemo(() => {
    if (!projects || !users) return []

    const grouped: Record<string, { userEmail: string, userName: string, userId: number, projects: Project[] }> = {}

    projects.forEach(project => {
      // Find the user for this project directly via project.userId
      const user = users.find(u => u.id === project.userId)
      if (!user) return

      const email = user.email
      if (!grouped[email]) {
        grouped[email] = {
          userEmail: email,
          userName: user.username || email.split('@')[0],
          userId: user.id,
          projects: []
        }
      }
      grouped[email].projects.push(project)
    })

    return Object.values(grouped)
  }, [projects, users])

  // Filter user projects based on search
  const filteredUserProjects = useMemo(() => {
    if (!searchTerm) return userProjects

    return userProjects.filter(userProject =>
      userProject.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userProject.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userProject.projects.some(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [userProjects, searchTerm])

  const handleUserCardClick = (userEmail: string) => {
    setSelectedUserEmail(userEmail)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedUserEmail(null)
  }

  const getStatusColor = (status: string) => {
    return statusColors[status.toLowerCase() as keyof typeof statusColors] || "bg-gray-600"
  }

  const getProjectStats = (projects: Project[]) => {
    const totalBudget = projects.reduce((sum, project) => sum + (project.budget || 0), 0)
    const completedProjects = projects.filter(project => 
      ['completed', 'done'].includes(project.status.toLowerCase())
    ).length
    const activeProjects = projects.filter(project => 
      ['in progress', 'active', 'review'].includes(project.status.toLowerCase())
    ).length

    return { totalBudget, completedProjects, activeProjects }
  }

  // Find the selected user for the modal
  const selectedUser = users?.find(user => user.email === selectedUserEmail)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
          <span className="text-white">Loading projects...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="bg-red-900/20 border-red-800">
          <CardContent className="p-6">
            <div className="text-center text-red-400">
              <h3 className="font-semibold mb-2">Error loading projects</h3>
              <p className="text-sm">{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Projects by Users</h1>
            <p className="text-gray-400 mt-2">Manage and track projects organized by users</p>
          </div>
        </div>
      </div>

      {/* Project Statistics */}
      {projects && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{projects.length}</div>
              <p className="text-xs text-gray-400">Across all users</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Active Users</CardTitle>
              <UserIcon className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{userProjects.length}</div>
              <p className="text-xs text-green-400">With projects</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Completed</CardTitle>
              <Calendar className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {projects.filter(p => ['completed', 'done'].includes(p.status.toLowerCase())).length}
              </div>
              <p className="text-xs text-purple-400">Finished projects</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${projects.reduce((sum, p) => sum + (p.budget || 0), 0).toLocaleString()}
              </div>
              <p className="text-xs text-yellow-400">Combined value</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search */}
      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by user name, email, or project name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Project Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUserProjects.map((userProject) => {
          const stats = getProjectStats(userProject.projects)
          
          return (
            <Card 
              key={userProject.userEmail} 
              className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700/50 transition-colors"
              onClick={() => handleUserCardClick(userProject.userEmail)}
            >
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="text-lg bg-blue-600">
                      {userProject.userName[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg">{userProject.userName}</CardTitle>
                    <CardDescription className="text-gray-400">{userProject.userEmail}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">{userProject.projects.length}</div>
                    <div className="text-xs text-gray-400">Projects</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">{stats.completedProjects}</div>
                    <div className="text-xs text-gray-400">Completed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">{stats.activeProjects}</div>
                    <div className="text-xs text-gray-400">Active</div>
                  </div>
                </div>

                {/* Budget */}
                <div className="text-center p-3 bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-400">Total Budget</div>
                  <div className="text-xl font-bold text-white">
                    ${stats.totalBudget.toLocaleString()}
                  </div>
                </div>

                {/* Recent Projects Preview */}
                <div>
                  <div className="text-sm text-gray-400 mb-2">Recent Projects:</div>
                  <div className="space-y-2">
                    {userProject.projects.slice(0, 3).map((project) => (
                      <div key={project.id} className="flex items-center justify-between text-sm">
                        <span className="text-white truncate flex-1">{project.title}</span>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                    ))}
                    {userProject.projects.length > 3 && (
                      <div className="text-xs text-gray-400 text-center">
                        +{userProject.projects.length - 3} more projects
                      </div>
                    )}
                  </div>
                </div>

                {/* Click indicator */}
                <div className="text-center pt-2 border-t border-gray-700">
                  <span className="text-xs text-blue-400">Click to view detailed information</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredUserProjects.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-12">
            <div className="text-center">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-lg font-semibold text-white mb-2">No projects found</h3>
              <p className="text-gray-400">
                {searchTerm ? 'Try adjusting your search terms' : 'No projects available'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal 
          user={{
            id: selectedUser.id,
            email: selectedUser.email,
            username: selectedUser.username,
            role: selectedUser.role,
            isOnboardingCompleted: selectedUser.isOnboardingCompleted,
            createdAt: selectedUser.createdAt,
            updatedAt: selectedUser.updatedAt
          }}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}