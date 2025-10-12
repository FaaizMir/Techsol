"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAdminProjects, useAdminUsers, type Project } from "@/hooks/use-admin"
import { ProjectEditModal } from "@/components/admin-dashboard/ProjectEditModal"
import { Loader2, Search, Edit, User as UserIcon } from "lucide-react"

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

export default function ManageProjectsPage() {
  const { data: projects, isLoading: projectsLoading, error: projectsError } = useAdminProjects()
  const { data: users, isLoading: usersLoading } = useAdminUsers()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const isLoading = projectsLoading || usersLoading
  const error = projectsError

  // Flatten projects with user info
  const projectsWithUsers = useMemo(() => {
    if (!projects || !users) return []

    return projects.map(project => {
      const user = users.find(u => u.id === project.userId)
      return {
        ...project,
        userName: user?.username || user?.email?.split('@')[0] || 'Unknown User',
        userEmail: user?.email || 'Unknown'
      }
    })
  }, [projects, users])

  // Filter projects
  const filteredProjects = useMemo(() => {
    if (!projectsWithUsers) return []

    return projectsWithUsers.filter(project =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [projectsWithUsers, searchTerm])

  const handleEditProject = (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
  }

  const handleUpdateProject = () => {
    // Refresh the projects data - you might want to invalidate the query or refetch
    window.location.reload() // Simple refresh for now
  }

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
            <h1 className="text-3xl font-bold text-white">Manage Projects</h1>
            <p className="text-gray-400 mt-2">Edit and manage all user projects</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search projects by title, user name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Projects ({filteredProjects.length})</CardTitle>
          <CardDescription className="text-gray-400">
            Click edit to modify project details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4 text-gray-300">Project</th>
                  <th className="text-left p-4 text-gray-300">User</th>
                  <th className="text-left p-4 text-gray-300">Status</th>
                  <th className="text-left p-4 text-gray-300">Deadline</th>
                  <th className="text-left p-4 text-gray-300">Budget</th>
                  <th className="text-left p-4 text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="p-4">
                      <div>
                        <div className="text-white font-medium">{project.title}</div>
                        {project.description && (
                          <div className="text-sm text-gray-400 truncate max-w-xs">{project.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-sm bg-blue-600">
                            {project.userName[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-white font-medium">{project.userName}</div>
                          <div className="text-xs text-gray-400">{project.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={statusColors[project.status as keyof typeof statusColors] || "bg-gray-600"}>
                        {project.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-gray-300">
                      {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 text-gray-300">
                      {project.budget ? `$${project.budget.toLocaleString()}` : 'N/A'}
                    </td>
                    <td className="p-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProject(project)}
                        className="flex items-center space-x-2"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No projects found</div>
              <p className="text-gray-500 text-sm">
                {searchTerm ? 'Try adjusting your search terms' : 'No projects available'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <ProjectEditModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdate={handleUpdateProject}
      />
    </div>
  )
}