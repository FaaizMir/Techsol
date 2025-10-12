"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Save } from "lucide-react"
import { type Project } from "@/hooks/use-admin"
import { adminAPI } from "@/lib/api"
import { useAdminProjectMilestones, useAdminProjectRequirements } from "@/hooks/use-admin"

interface Milestone {
  id: number
  title: string
  deliverable: string
  deadline: string
  amount: string
  status: string
  order: number
  projectId: number
  createdAt: string
  updatedAt: string
}

interface Requirement {
  id: number
  notes: string
  files: string
  projectId: number
  createdAt: string
  updatedAt: string
}

interface MilestoneEditCardProps {
  milestone: Milestone
  onUpdate: () => void
}

function MilestoneEditCard({ milestone, onUpdate }: MilestoneEditCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    title: milestone.title,
    deliverable: milestone.deliverable,
    deadline: milestone.deadline ? new Date(milestone.deadline).toISOString().split('T')[0] : '',
    amount: milestone.amount,
    status: milestone.status,
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await adminAPI.updateMilestone(milestone.id, formData)
      onUpdate()
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating milestone:', error)
      alert('Failed to update milestone. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="bg-gray-600 border-gray-500">
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Milestone title"
              className="bg-gray-500 border-gray-400 text-white"
            />
            <Textarea
              value={formData.deliverable}
              onChange={(e) => setFormData(prev => ({ ...prev, deliverable: e.target.value }))}
              placeholder="Deliverable description"
              rows={2}
              className="bg-gray-500 border-gray-400 text-white"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                className="bg-gray-500 border-gray-400 text-white"
              />
              <Input
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="Amount"
                className="bg-gray-500 border-gray-400 text-white"
              />
            </div>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="bg-gray-500 border-gray-400 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-600 border-gray-500">
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-end space-x-2">
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="text-white font-medium">{milestone.title}</h4>
              <p className="text-gray-300 text-sm">{milestone.deliverable}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                <span>Deadline: {milestone.deadline ? new Date(milestone.deadline).toLocaleDateString() : 'N/A'}</span>
                <span>Amount: ${milestone.amount}</span>
                <span>Status: {milestone.status}</span>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface RequirementEditCardProps {
  requirement: Requirement
  onUpdate: () => void
}

function RequirementEditCard({ requirement, onUpdate }: RequirementEditCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [notes, setNotes] = useState(requirement.notes)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await adminAPI.updateRequirement(requirement.id, { notes })
      onUpdate()
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating requirement:', error)
      alert('Failed to update requirement. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="bg-gray-600 border-gray-500">
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Requirement notes"
              rows={3}
              className="bg-gray-500 border-gray-400 text-white"
            />
            <div className="flex justify-end space-x-2">
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-gray-300">{requirement.notes}</p>
              <div className="mt-2 text-xs text-gray-400">
                Created: {new Date(requirement.createdAt).toLocaleDateString()}
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface ProjectEditModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function ProjectEditModal({ project, isOpen, onClose, onUpdate }: ProjectEditModalProps) {
  const [formData, setFormData] = useState<Partial<Project>>({})
  const [isSaving, setIsSaving] = useState(false)

  const { data: milestones, isLoading: milestonesLoading } = useAdminProjectMilestones(project?.id || null)
  const { data: requirements, isLoading: requirementsLoading } = useAdminProjectRequirements(project?.id || null)

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description || '',
        category: project.category,
        deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : '',
        status: project.status,
        priority: project.priority,
        budget: project.budget || 0,
        progress: project.progress || 0,
      })
    }
  }, [project])

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!project) return

    setIsSaving(true)
    try {
      await adminAPI.updateProject(project.id, formData)
      onUpdate()
      onClose()
    } catch (error) {
      console.error('Error updating project:', error)
      alert('Failed to update project. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (!project) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Project</DialogTitle>
          <DialogDescription className="text-gray-400">
            Modify the project details, milestones, and requirements
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="project" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-700">
            <TabsTrigger value="project" className="data-[state=active]:bg-gray-600">
              Project Details
            </TabsTrigger>
            <TabsTrigger value="milestones" className="data-[state=active]:bg-gray-600">
              Milestones ({milestones?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="requirements" className="data-[state=active]:bg-gray-600">
              Requirements ({requirements?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="project" className="mt-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title" className="text-gray-300">Project Title</Label>
                      <Input
                        id="title"
                        value={formData.title || ''}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="bg-gray-600 border-gray-500 text-white"
                        placeholder="Enter project title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category" className="text-gray-300">Category</Label>
                      <Select value={formData.category || ''} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="web-development">Web Development</SelectItem>
                          <SelectItem value="mobile-app">Mobile App</SelectItem>
                          <SelectItem value="ai-ml">AI / ML</SelectItem>
                          <SelectItem value="cloud-services">Cloud Services</SelectItem>
                          <SelectItem value="consulting">Consulting</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-gray-300">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="bg-gray-600 border-gray-500 text-white"
                      placeholder="Enter project description"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Project Details */}
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="deadline" className="text-gray-300">Deadline</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.deadline || ''}
                        onChange={(e) => handleInputChange('deadline', e.target.value)}
                        className="bg-gray-600 border-gray-500 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="budget" className="text-gray-300">Budget ($)</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={formData.budget || ''}
                        onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || 0)}
                        className="bg-gray-600 border-gray-500 text-white"
                        placeholder="Enter budget"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status" className="text-gray-300">Status</Label>
                      <Select value={formData.status || ''} onValueChange={(value) => handleInputChange('status', value)}>
                        <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="planning">Planning</SelectItem>
                          <SelectItem value="in progress">In Progress</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="on hold">On Hold</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority" className="text-gray-300">Priority</Label>
                      <Select value={formData.priority || ''} onValueChange={(value) => handleInputChange('priority', value)}>
                        <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="progress" className="text-gray-300">Progress (%)</Label>
                    <Input
                      id="progress"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.progress || ''}
                      onChange={(e) => handleInputChange('progress', parseInt(e.target.value) || 0)}
                      className="bg-gray-600 border-gray-500 text-white"
                      placeholder="Enter progress percentage"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4">
                    <Button variant="outline" onClick={onClose} disabled={isSaving}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving} className="flex items-center space-x-2">
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="milestones" className="mt-6">
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Milestones</CardTitle>
                <p className="text-gray-400 text-sm">
                  Edit project milestones
                </p>
              </CardHeader>
              <CardContent>
                {milestonesLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-white" />
                    <p className="text-gray-400 mt-2">Loading milestones...</p>
                  </div>
                ) : milestones && milestones.length > 0 ? (
                  <div className="space-y-4">
                    {milestones.map((milestone, index) => (
                      <MilestoneEditCard
                        key={milestone.id}
                        milestone={milestone}
                        onUpdate={onUpdate}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No milestones found for this project
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requirements" className="mt-6">
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Requirements</CardTitle>
                <p className="text-gray-400 text-sm">
                  Edit project requirements
                </p>
              </CardHeader>
              <CardContent>
                {requirementsLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-white" />
                    <p className="text-gray-400 mt-2">Loading requirements...</p>
                  </div>
                ) : requirements && requirements.length > 0 ? (
                  <div className="space-y-4">
                    {requirements.map((requirement, index) => (
                      <RequirementEditCard
                        key={requirement.id}
                        requirement={requirement}
                        onUpdate={onUpdate}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No requirements found for this project
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
