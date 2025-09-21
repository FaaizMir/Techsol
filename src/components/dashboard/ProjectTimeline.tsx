"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, CheckCircle, Circle, AlertTriangle } from "lucide-react"

interface Milestone {
  id: number
  name: string
  description: string
  dueDate: string
  status: 'completed' | 'in-progress' | 'pending' | 'overdue'
  progress: number
  dependencies?: number[]
}

interface Task {
  id: number
  name: string
  completed: boolean
  assignee?: string
  dueDate: string
}

// Mock data for a project timeline
const mockMilestones: Milestone[] = [
  {
    id: 1,
    name: "Requirements Gathering",
    description: "Collect and analyze project requirements from client",
    dueDate: "2024-01-15",
    status: "completed",
    progress: 100
  },
  {
    id: 2,
    name: "UI/UX Design",
    description: "Create wireframes and mockups for the application",
    dueDate: "2024-01-30",
    status: "completed",
    progress: 100
  },
  {
    id: 3,
    name: "Frontend Development",
    description: "Build the user interface components",
    dueDate: "2024-02-15",
    status: "in-progress",
    progress: 75
  },
  {
    id: 4,
    name: "Backend API Development",
    description: "Implement server-side logic and database",
    dueDate: "2024-02-28",
    status: "in-progress",
    progress: 60
  },
  {
    id: 5,
    name: "Testing & QA",
    description: "Comprehensive testing and quality assurance",
    dueDate: "2024-03-10",
    status: "pending",
    progress: 0
  },
  {
    id: 6,
    name: "Deployment & Launch",
    description: "Deploy to production and go live",
    dueDate: "2024-03-15",
    status: "pending",
    progress: 0
  }
]

const mockTasks: Task[] = [
  { id: 1, name: "Setup project repository", completed: true, assignee: "John", dueDate: "2024-01-10" },
  { id: 2, name: "Create database schema", completed: true, assignee: "Sarah", dueDate: "2024-01-12" },
  { id: 3, name: "Design homepage layout", completed: true, assignee: "Mike", dueDate: "2024-01-18" },
  { id: 4, name: "Implement user authentication", completed: false, assignee: "John", dueDate: "2024-02-05" },
  { id: 5, name: "Build dashboard components", completed: false, assignee: "Sarah", dueDate: "2024-02-10" },
  { id: 6, name: "Setup payment integration", completed: false, assignee: "Mike", dueDate: "2024-02-20" }
]

interface ProjectTimelineProps {
  projectId?: number
}

export default function ProjectTimeline({ projectId }: ProjectTimelineProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-400" />
      case 'in-progress': return <Clock className="h-5 w-5 text-blue-400" />
      case 'overdue': return <AlertTriangle className="h-5 w-5 text-red-400" />
      default: return <Circle className="h-5 w-5 text-slate-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'in-progress': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'overdue': return 'bg-red-500/20 text-red-300 border-red-500/30'
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && !mockMilestones.find(m => m.dueDate === dueDate)?.status.includes('completed')
  }

  const overallProgress = Math.round(
    mockMilestones.reduce((sum, milestone) => sum + milestone.progress, 0) / mockMilestones.length
  )

  return (
    <div className="space-y-6">
      {/* Project Progress Overview */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-cyan-400" />
            Project Timeline
          </CardTitle>
          <CardDescription className="text-slate-400">
            Track milestones and project progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Overall Progress</p>
                <p className="text-2xl font-bold text-white">{overallProgress}%</p>
              </div>
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                On Track
              </Badge>
            </div>
            <Progress value={overallProgress} className="h-2" />
            <div className="flex justify-between text-xs text-slate-400">
              <span>{mockMilestones.filter(m => m.status === 'completed').length} of {mockMilestones.length} milestones completed</span>
              <span>Due: {formatDate(mockMilestones[mockMilestones.length - 1].dueDate)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestones Timeline */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Milestones</CardTitle>
          <CardDescription className="text-slate-400">
            Key project checkpoints and deliverables
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockMilestones.map((milestone, index) => (
              <div key={milestone.id} className="relative">
                {/* Timeline line */}
                {index < mockMilestones.length - 1 && (
                  <div className={`absolute left-6 top-12 w-0.5 h-16 ${
                    milestone.status === 'completed' ? 'bg-green-500/50' : 'bg-slate-600'
                  }`}></div>
                )}

                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full border-2 ${
                    milestone.status === 'completed'
                      ? 'bg-green-500/20 border-green-500/50'
                      : milestone.status === 'in-progress'
                        ? 'bg-blue-500/20 border-blue-500/50'
                        : 'bg-slate-700/50 border-slate-600'
                  }`}>
                    {getStatusIcon(milestone.status)}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-white">{milestone.name}</h4>
                      <Badge
                        variant="outline"
                        className={getStatusColor(milestone.status)}
                      >
                        {milestone.status.replace('-', ' ')}
                      </Badge>
                    </div>

                    <p className="text-sm text-slate-400">{milestone.description}</p>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Due: {formatDate(milestone.dueDate)}
                      </span>
                      {milestone.progress > 0 && milestone.progress < 100 && (
                        <span>{milestone.progress}% complete</span>
                      )}
                    </div>

                    {milestone.status === 'in-progress' && (
                      <Progress value={milestone.progress} className="h-1 mt-2" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Tasks */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Current Tasks</CardTitle>
          <CardDescription className="text-slate-400">
            Active tasks and assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockTasks.filter(task => !task.completed).slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 border border-slate-700/50 rounded-lg bg-slate-900/30">
                <div className="flex items-center gap-3">
                  <Circle className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-white text-sm font-medium">{task.name}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      {task.assignee && <span>Assigned to: {task.assignee}</span>}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(task.dueDate)}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-slate-300 hover:bg-slate-700/50">
                  Update
                </Button>
              </div>
            ))}

            {mockTasks.filter(task => !task.completed).length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <p className="text-slate-400">All tasks completed!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button className="bg-cyan-500 hover:bg-cyan-600 text-white flex-1">
          Add Milestone
        </Button>
        <Button variant="outline" className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50 flex-1">
          Add Task
        </Button>
        <Button variant="outline" className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50 flex-1">
          Update Progress
        </Button>
      </div>
    </div>
  )
}