"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Search, 
  Edit, 
  Trash2, 
  Plus, 
  Calendar,
  DollarSign,
  User,
  Building,
  Eye,
  Filter,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from "lucide-react"
import { 
  useAdminProjects, 
  useAdminUsers,
  useAdminClients,
  useCreateProject,
  useUpdateProject,
  useUpdateProjectStatus,
  useDeleteProject,
  useBulkUpdateProjects
} from "@/hooks/use-admin-dashboard"
import { motion } from "framer-motion"
import type { Project } from "@/lib/api/admin-api"
import { useToast } from "@/hooks/use-toast"

type ProjectFormData = {
  title: string
  description: string
  category: string
  deadline: string
  budget: string
  priority: string
  status: string
  progress: number | string
  userId: string
  clientId: string
}

export default function AdminProjectsSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedProjects, setSelectedProjects] = useState<number[]>([])
  const [projectForm, setProjectForm] = useState<ProjectFormData>({
    title: "",
    description: "",
    category: "web-development",
    deadline: "",
    budget: "",
    priority: "medium",
    status: "pending",
    progress: 0,
    userId: "",
    clientId: "none"
  })

  const { data: projectsResponse, isLoading } = useAdminProjects()
  const projects = projectsResponse?.data || []
  const totalCount = projectsResponse?.count || 0
  const { data: users } = useAdminUsers()
  const { data: clients } = useAdminClients()
  const createProject = useCreateProject()
  const updateProject = useUpdateProject()
  const updateStatus = useUpdateProjectStatus()
  const deleteProject = useDeleteProject()
  const bulkUpdate = useBulkUpdateProjects()
  const { toast } = useToast()

  const categories = [
    { value: "web-development", label: "Web Development" },
    { value: "mobile-app", label: "Mobile App" },
    { value: "ai-ml", label: "AI/ML" },
    { value: "cloud-services", label: "Cloud Services" },
    { value: "consulting", label: "Consulting" },
    { value: "other", label: "Other" }
  ]

  const statuses = [
    { value: "pending", label: "Pending", color: "yellow" },
    { value: "active", label: "Active", color: "blue" },
    { value: "completed", label: "Completed", color: "green" },
    { value: "cancelled", label: "Cancelled", color: "red" }
  ]

  const priorities = [
    { value: "low", label: "Low", color: "gray" },
    { value: "medium", label: "Medium", color: "blue" },
    { value: "high", label: "High", color: "orange" },
    { value: "urgent", label: "Urgent", color: "red" }
  ]

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusColor = (status: string) => {
    const statusObj = statuses.find(s => s.value === status)
    const colors: Record<string, string> = {
      yellow: "bg-yellow-500/10 border-yellow-500/30 text-yellow-300",
      blue: "bg-blue-500/10 border-blue-500/30 text-blue-300",
      green: "bg-green-500/10 border-green-500/30 text-green-300",
      red: "bg-red-500/10 border-red-500/30 text-red-300"
    }
    return colors[statusObj?.color || "gray"]
  }

  const getPriorityColor = (priority: string) => {
    const priorityObj = priorities.find(p => p.value === priority)
    const colors: Record<string, string> = {
      gray: "bg-gray-500/10 border-gray-500/30 text-gray-300",
      blue: "bg-blue-500/10 border-blue-500/30 text-blue-300",
      orange: "bg-orange-500/10 border-orange-500/30 text-orange-300",
      red: "bg-red-500/10 border-red-500/30 text-red-300"
    }
    return colors[priorityObj?.color || "gray"]
  }

  const handleCreate = async () => {
    if (!projectForm.title || !projectForm.userId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      await createProject.mutateAsync({
        ...projectForm,
        userId: parseInt(projectForm.userId),
        clientId: projectForm.clientId && projectForm.clientId !== "none" ? parseInt(projectForm.clientId) : undefined,
        budget: projectForm.budget ? parseFloat(projectForm.budget) : undefined
      })
      toast({
        title: "Success",
        description: "Project created successfully",
      })
      setIsCreateModalOpen(false)
      setProjectForm({
        title: "",
        description: "",
        category: "web-development",
        deadline: "",
        budget: "",
        priority: "medium",
        status: "pending",
        progress: 0,
        userId: "",
        clientId: "none"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (project: Project) => {
    setSelectedProject(project)
    setProjectForm({
      title: project.title,
      description: project.description || "",
      category: project.category,
      deadline: project.deadline.split('T')[0],
      budget: project.budget?.toString() || "",
      priority: project.priority,
      status: project.status,
      progress: project.progress,
      userId: project.userId.toString(),
      clientId: project.clientId?.toString() || "none"
    })
    setIsEditModalOpen(true)
  }

  const handleUpdate = async () => {
    if (!selectedProject) return

    try {
      await updateProject.mutateAsync({
        id: selectedProject.id,
        data: {
          ...projectForm,
          budget: projectForm.budget ? parseFloat(projectForm.budget) : undefined,
          progress: parseInt(projectForm.progress.toString()),
          clientId: projectForm.clientId && projectForm.clientId !== "none" ? parseInt(projectForm.clientId) : undefined
        }
      })
      toast({
        title: "Success",
        description: "Project updated successfully",
      })
      setIsEditModalOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async (projectId: number, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ id: projectId, status: newStatus })
      toast({
        title: "Success",
        description: "Project status updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (projectId: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      await deleteProject.mutateAsync(projectId)
      toast({
        title: "Success",
        description: "Project deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      })
    }
  }

  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (selectedProjects.length === 0) {
      toast({
        title: "Error",
        description: "Please select projects first",
        variant: "destructive",
      })
      return
    }

    try {
      await bulkUpdate.mutateAsync({ projectIds: selectedProjects, status: newStatus })
      toast({
        title: "Success",
        description: `${selectedProjects.length} projects updated`,
      })
      setSelectedProjects([])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update projects",
        variant: "destructive",
      })
    }
  }

  const toggleProjectSelection = (projectId: number) => {
    setSelectedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
        <div className="bg-gray-800 rounded-lg p-6 animate-pulse h-96"></div>
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-2xl">Project Management</CardTitle>
              <p className="text-slate-400 text-sm mt-1">Manage all projects in the system</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-cyan-500/10 border-cyan-500/30 text-cyan-300">
                {totalCount} Total Projects
              </Badge>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters and Search */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-gray-500"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] bg-slate-900/50 border-slate-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px] bg-slate-900/50 border-slate-700 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedProjects.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">{selectedProjects.length} selected</span>
                <Select onValueChange={handleBulkStatusUpdate}>
                  <SelectTrigger className="w-[150px] bg-slate-900/50 border-slate-700 text-white">
                    <SelectValue placeholder="Bulk Action" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    {statuses.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        Set to {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Projects Table */}
          <div className="rounded-lg border border-slate-700 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-900/50">
                <TableRow className="border-slate-700 hover:bg-slate-800/50">
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedProjects.length === filteredProjects.length && filteredProjects.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProjects(filteredProjects.map(p => p.id))
                        } else {
                          setSelectedProjects([])
                        }
                      }}
                      className="rounded border-slate-600"
                    />
                  </TableHead>
                  <TableHead className="text-slate-300">Project</TableHead>
                  <TableHead className="text-slate-300">Client</TableHead>
                  <TableHead className="text-slate-300">User</TableHead>
                  <TableHead className="text-slate-300">Category</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Priority</TableHead>
                  <TableHead className="text-slate-300">Progress</TableHead>
                  <TableHead className="text-slate-300">Budget</TableHead>
                  <TableHead className="text-slate-300">Deadline</TableHead>
                  <TableHead className="text-slate-300 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow 
                    key={project.id}
                    className="border-slate-700 hover:bg-slate-800/50 transition-colors"
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedProjects.includes(project.id)}
                        onChange={() => toggleProjectSelection(project.id)}
                        className="rounded border-slate-600"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{project.title}</div>
                        {project.description && (
                          <div className="text-sm text-slate-400 truncate max-w-[200px]">
                            {project.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {project.client ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Building className="h-3 w-3" />
                          {project.client.name}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-sm">No client</span>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {project.user ? (
                        <div className="flex items-center gap-1 text-sm">
                          <User className="h-3 w-3" />
                          {project.user.email.split('@')[0]}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-slate-700/50 border-slate-600 text-slate-300">
                        {categories.find(c => c.value === project.category)?.label || project.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={project.status}
                        onValueChange={(value) => handleStatusChange(project.id, value)}
                      >
                        <SelectTrigger className={`w-[110px] border-0 ${getStatusColor(project.status)}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700">
                          {statuses.map(status => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getPriorityColor(project.priority)}>
                        {priorities.find(p => p.value === project.priority)?.label || project.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400">{project.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {project.budget ? (
                        <div className="flex items-center gap-1 text-sm">
                          <DollarSign className="h-3 w-3" />
                          {project.budget.toLocaleString()}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {new Date(project.deadline).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedProject(project)
                            setIsViewModalOpen(true)
                          }}
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(project)}
                          className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(project.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400">No projects found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Project Modal */}
      <Dialog open={isCreateModalOpen || isEditModalOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateModalOpen(false)
          setIsEditModalOpen(false)
        }
      }}>
        <DialogContent 
          className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <DialogHeader>
            <DialogTitle>{isCreateModalOpen ? 'Create New Project' : 'Edit Project'}</DialogTitle>
            <DialogDescription className="text-slate-400">
              {isCreateModalOpen ? 'Add a new project to the system' : 'Update project information'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-300">Project Title *</Label>
              <Input
                id="title"
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="Enter project title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-300">Description</Label>
              <Textarea
                id="description"
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                placeholder="Enter project description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userId" className="text-slate-300">Assign to User *</Label>
                <Select
                  value={projectForm.userId}
                  onValueChange={(value) => setProjectForm({ ...projectForm, userId: value })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    {users?.data?.map(user => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientId" className="text-slate-300">Client</Label>
                <Select
                  value={projectForm.clientId}
                  onValueChange={(value) => setProjectForm({ ...projectForm, clientId: value })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select client (optional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="none">No client</SelectItem>
                    {clients?.data?.map(client => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.name} - {client.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-slate-300">Category *</Label>
                <Select
                  value={projectForm.category}
                  onValueChange={(value) => setProjectForm({ ...projectForm, category: value })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-slate-300">Priority</Label>
                <Select
                  value={projectForm.priority}
                  onValueChange={(value) => setProjectForm({ ...projectForm, priority: value })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    {priorities.map(priority => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deadline" className="text-slate-300">Deadline *</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={projectForm.deadline}
                  onChange={(e) => setProjectForm({ ...projectForm, deadline: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget" className="text-slate-300">Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={projectForm.budget}
                  onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="0"
                />
              </div>
            </div>
            {isEditModalOpen && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-slate-300">Status</Label>
                  <Select
                    value={projectForm.status}
                    onValueChange={(value) => setProjectForm({ ...projectForm, status: value })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      {statuses.map(status => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="progress" className="text-slate-300">Progress (%)</Label>
                  <Input
                    id="progress"
                    type="number"
                    min="0"
                    max="100"
                    value={projectForm.progress}
                    onChange={(e) => setProjectForm({ ...projectForm, progress: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false)
                setIsEditModalOpen(false)
              }}
              className="bg-slate-700 text-white hover:bg-slate-600 hover:text-white border-slate-600"
            >
              Cancel
            </Button>
            <Button
              onClick={isCreateModalOpen ? handleCreate : handleUpdate}
              disabled={createProject.isPending || updateProject.isPending}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {(createProject.isPending || updateProject.isPending) ? 'Saving...' : isCreateModalOpen ? 'Create Project' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Project Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">{selectedProject.title}</h3>
                <p className="text-slate-400 text-sm">{selectedProject.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-400 text-xs">Status</Label>
                  <Badge variant="outline" className={`mt-1 ${getStatusColor(selectedProject.status)}`}>
                    {statuses.find(s => s.value === selectedProject.status)?.label}
                  </Badge>
                </div>
                <div>
                  <Label className="text-slate-400 text-xs">Priority</Label>
                  <Badge variant="outline" className={`mt-1 ${getPriorityColor(selectedProject.priority)}`}>
                    {priorities.find(p => p.value === selectedProject.priority)?.label}
                  </Badge>
                </div>
                <div>
                  <Label className="text-slate-400 text-xs">Category</Label>
                  <p className="text-white text-sm mt-1">{categories.find(c => c.value === selectedProject.category)?.label}</p>
                </div>
                <div>
                  <Label className="text-slate-400 text-xs">Progress</Label>
                  <p className="text-white text-sm mt-1">{selectedProject.progress}%</p>
                </div>
                <div>
                  <Label className="text-slate-400 text-xs">Budget</Label>
                  <p className="text-white text-sm mt-1">${selectedProject.budget?.toLocaleString() || 'Not set'}</p>
                </div>
                <div>
                  <Label className="text-slate-400 text-xs">Deadline</Label>
                  <p className="text-white text-sm mt-1">{new Date(selectedProject.deadline).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-slate-400 text-xs">User</Label>
                  <p className="text-white text-sm mt-1">{selectedProject.user?.email || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-slate-400 text-xs">Client</Label>
                  <p className="text-white text-sm mt-1">{selectedProject.client?.name || 'No client'}</p>
                </div>
              </div>
              {selectedProject.milestones && selectedProject.milestones.length > 0 && (
                <div>
                  <Label className="text-slate-400 text-xs mb-2 block">Milestones</Label>
                  <div className="space-y-2">
                    {selectedProject.milestones.map(milestone => (
                      <div key={milestone.id} className="bg-slate-800 p-3 rounded-lg">
                        <p className="text-white text-sm font-medium">{milestone.title}</p>
                        <p className="text-slate-400 text-xs">{milestone.deliverable}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewModalOpen(false)}
              className="bg-slate-700 text-white hover:bg-slate-600 hover:text-white border-slate-600"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
