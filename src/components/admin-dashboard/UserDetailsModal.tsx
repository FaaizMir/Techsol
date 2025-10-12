"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useUserDetails } from "@/hooks/use-admin"
import { ProjectEditModal } from "./ProjectEditModal"
import { 
  FolderOpen, 
  Target, 
  CheckSquare, 
  Calendar, 
  DollarSign,
  AlertCircle,
  Clock,
  User,
  Edit
} from "lucide-react"

interface User {
  id: number
  email: string
  username?: string
  role: 'user' | 'admin'
  isOnboardingCompleted: boolean
  createdAt: string
  updatedAt: string
}

interface UserDetailsModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
}

export function UserDetailsModal({ user, isOpen, onClose }: UserDetailsModalProps) {
  const userDetails = useUserDetails(user?.email || null)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)

  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">User Details</DialogTitle>
            <DialogDescription className="text-gray-400">
              No user selected
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

  if (!userDetails || userDetails.isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">User Details</DialogTitle>
            <DialogDescription className="text-gray-400">
              Loading user details for {user.email}...
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="text-white">Loading...</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': case 'done': case 'finished':
        return 'bg-green-600'
      case 'in progress': case 'active': case 'working':
        return 'bg-blue-600'
      case 'pending': case 'waiting':
        return 'bg-yellow-600'
      case 'cancelled': case 'failed':
        return 'bg-red-600'
      default:
        return 'bg-gray-600'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': case 'critical':
        return 'bg-red-600'
      case 'medium':
        return 'bg-orange-600'
      case 'low':
        return 'bg-green-600'
      default:
        return 'bg-gray-600'
    }
  }

  const handleEditProject = (project: any) => {
    setSelectedProject(project)
    setIsProjectModalOpen(true)
  }

  const handleCloseProjectModal = () => {
    setIsProjectModalOpen(false)
    setSelectedProject(null)
  }

  const handleUpdateProject = () => {
    // Refresh user details
    window.location.reload()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
        <DialogHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-lg bg-blue-600">
                {user.username ? user.username[0].toUpperCase() : user.email[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-white text-2xl">
                {user.username || user.email.split('@')[0]}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {user.email} • {user.role.toUpperCase()}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Debug Info - Remove this in production */}
        <Card className="bg-yellow-900/20 border-yellow-700 my-4">
          <CardContent className="p-4">
            <div className="text-sm text-yellow-200">
              <strong>Debug Info:</strong> Email: {user.email} | 
              Projects: {userDetails.projects?.length || 0} | 
              Milestones: {userDetails.milestones?.length || 0} | 
              Requirements: {userDetails.requirements?.length || 0} |
              HasErrors: {userDetails.hasErrors ? 'Yes' : 'No'}
            </div>
          </CardContent>
        </Card>

        {/* Error Info */}
        {userDetails.hasErrors && (
          <Card className="bg-red-900/20 border-red-700 my-4">
            <CardContent className="p-4">
              <div className="text-sm text-red-200">
                <strong>⚠️ Some data could not be loaded:</strong> Please check the browser console for API errors.
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{userDetails.summary.totalProjects}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-700 border-gray-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Milestones</CardTitle>
              <Target className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{userDetails.summary.totalMilestones}</div>
              <p className="text-xs text-green-400">
                {userDetails.summary.completedMilestones} completed
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-700 border-gray-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Requirements</CardTitle>
              <CheckSquare className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{userDetails.summary.totalRequirements}</div>
              <p className="text-xs text-yellow-400">
                {userDetails.summary.pendingRequirements} pending
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-700 border-gray-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Status</CardTitle>
              <User className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <Badge className={user.isOnboardingCompleted ? "bg-green-600" : "bg-yellow-600"}>
                {user.isOnboardingCompleted ? "Active" : "Pending"}
              </Badge>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-700">
            <TabsTrigger value="projects" className="data-[state=active]:bg-gray-600">
              Projects ({userDetails.projects.length})
            </TabsTrigger>
            <TabsTrigger value="milestones" className="data-[state=active]:bg-gray-600">
              Milestones ({userDetails.milestones.length})
            </TabsTrigger>
            <TabsTrigger value="requirements" className="data-[state=active]:bg-gray-600">
              Requirements ({userDetails.requirements.length})
            </TabsTrigger>
            <TabsTrigger value="info" className="data-[state=active]:bg-gray-600">
              User Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="mt-6">
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Projects</CardTitle>
                <CardDescription className="text-gray-400">
                  All projects associated with this user
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userDetails.projects.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    No projects found for this user
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-600">
                        <TableHead className="text-gray-300">Title</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Budget</TableHead>
                        <TableHead className="text-gray-300">Details</TableHead>
                        <TableHead className="text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userDetails.projects.map((project) => (
                        <TableRow key={project.id} className="border-gray-600 hover:bg-gray-600/50">
                          <TableCell>
                            <div>
                              <div className="text-white font-medium">{project.title}</div>
                              {project.description && (
                                <div className="text-sm text-gray-400">{project.description}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {project.budget ? `$${project.budget.toLocaleString()}` : 'N/A'}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            <div className="text-sm">
                              <div>Category: {project.category}</div>
                              <div>Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProject(project)}
                              className="flex items-center space-x-2"
                            >
                              <Edit className="h-4 w-4" />
                              <span>Manage</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="milestones" className="mt-6">
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Milestones</CardTitle>
                <CardDescription className="text-gray-400">
                  Project milestones and deadlines
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userDetails.milestones.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    No milestones found for this user
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userDetails.milestones.map((milestone) => (
                      <Card key={milestone.id} className="bg-gray-600 border-gray-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="text-white font-medium">{milestone.title}</h4>
                              {milestone.deliverable && (
                                <p className="text-gray-400 text-sm mt-1">Deliverable: {milestone.deliverable}</p>
                              )}
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                                {milestone.deadline && (
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    Due: {new Date(milestone.deadline).toLocaleDateString()}
                                  </div>
                                )}
                                <div className="flex items-center">
                                  Amount: ${milestone.amount}
                                </div>
                              </div>
                            </div>
                            <Badge className={getStatusColor(milestone.status)}>
                              {milestone.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requirements" className="mt-6">
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Requirements</CardTitle>
                <CardDescription className="text-gray-400">
                  Project requirements and specifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userDetails.requirements.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    No requirements found for this user
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userDetails.requirements.map((requirement) => (
                      <Card key={requirement.id} className="bg-gray-600 border-gray-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="text-white font-medium">Requirement #{requirement.id}</h4>
                              {requirement.notes && (
                                <p className="text-gray-400 text-sm mt-1">{requirement.notes}</p>
                              )}
                              {requirement.project && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Project: {requirement.project.title}
                                </div>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Badge className="bg-blue-600 text-white">
                                {requirement.files ? 'Has Files' : 'No Files'}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info" className="mt-6">
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">User Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Account details and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300">User ID</label>
                    <div className="text-white">{user.id}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Email</label>
                    <div className="text-white">{user.email}</div>
                  </div>
                  {user.username && (
                    <div>
                      <label className="text-sm font-medium text-gray-300">Username</label>
                      <div className="text-white">{user.username}</div>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-300">Role</label>
                    <div>
                      <Badge className={user.role === 'admin' ? 'bg-purple-600' : 'bg-blue-600'}>
                        {user.role.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Account Created</label>
                    <div className="text-white">{new Date(user.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Last Updated</label>
                    <div className="text-white">{new Date(user.updatedAt).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Onboarding Status</label>
                    <div>
                      <Badge className={user.isOnboardingCompleted ? 'bg-green-600' : 'bg-yellow-600'}>
                        {user.isOnboardingCompleted ? 'Completed' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>

      <ProjectEditModal
        project={selectedProject}
        isOpen={isProjectModalOpen}
        onClose={handleCloseProjectModal}
        onUpdate={handleUpdateProject}
      />
    </Dialog>
  )
}