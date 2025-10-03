"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, CheckCircle, Circle, AlertTriangle, FileText, Loader2, DollarSign } from "lucide-react"
import { useAllProjects } from "@/hooks/use-onboarding"
import { format } from "date-fns"

export default function ProjectTimeline() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const { data: projectsData, isLoading } = useAllProjects({ limit: 100 })
  const projects = (projectsData as any)?.data || []

  const selectedProjectData = projects.find((p: any) => p.id === selectedProject)
  const milestones = selectedProjectData?.milestones || []

  const getMilestoneStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return { icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" }
      case "in progress":
      case "pending":
        return { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" }
      default:
        return { icon: Circle, color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20" }
    }
  }

  const calculateProjectProgress = () => {
    if (!milestones.length) return 0
    const completed = milestones.filter((m: any) => m.status?.toLowerCase() === "completed").length
    return Math.round((completed / milestones.length) * 100)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    try {
      return format(new Date(dateString), "MMM dd, yyyy")
    } catch {
      return dateString
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-700 rounded w-64 animate-pulse"></div>
        <div className="grid grid-cols-1 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-800/50 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-white">Project Timeline</h2>
        <p className="text-slate-400">Track milestones and project progress</p>
      </motion.div>

      {/* Project Selector */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center flex-wrap">
            <label className="text-sm font-medium text-slate-300">Select Project:</label>
            <select
              value={selectedProject || ""}
              onChange={(e) => setSelectedProject(Number(e.target.value))}
              className="bg-slate-700 border-slate-600 text-white rounded-lg px-4 py-2 flex-1 min-w-[200px]"
            >
              <option value="">-- Choose a project --</option>
              {projects.map((project: any) => (
                <option key={project.id} value={project.id}>
                  {project.name || project.title}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {selectedProject ? (
        <>
          {/* Project Overview */}
                          <Card className=" bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 hover:border-cyan-500/50 transition-all">
            <CardHeader>
              <CardTitle className="text-white">{selectedProjectData.name || selectedProjectData.title}</CardTitle>
              <CardDescription className="text-slate-300">{selectedProjectData.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-slate-400">Status</p>
                  <Badge className="mt-1 bg-blue-500/10 text-blue-400 border-blue-500/20">
                    {selectedProjectData.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Progress</p>
                  <p className="text-lg font-semibold text-white mt-1">{calculateProjectProgress()}%</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Due Date</p>
                  <p className="text-lg font-semibold text-white mt-1">
                    {formatDate(selectedProjectData.dueDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Budget</p>
                  <p className="text-lg font-semibold text-white mt-1">
                    ${selectedProjectData.budget?.toLocaleString() || "N/A"}
                  </p>
                </div>
              </div>
              <Progress value={calculateProjectProgress()} className="h-2" />
            </CardContent>
          </Card>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Milestones</h3>
            {milestones.length > 0 ? (
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 to-purple-500"></div>

                <div className="space-y-6">
                  {milestones
                    .sort((a: any, b: any) => a.order - b.order)
                    .map((milestone: any, index: number) => {
                      const status = getMilestoneStatus(milestone.status)
                      const Icon = status.icon

                      return (
                        <motion.div
                          key={milestone.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative"
                        >
                          <Card className="ml-16 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 hover:border-cyan-500/50 transition-all">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                                    <h4 className="text-lg font-semibold text-white">{milestone.title}</h4>
                                    <Badge className={`${status.bg} ${status.color} ${status.border}`}>
                                      {milestone.status}
                                    </Badge>
                                  </div>
                                  <p className="text-slate-400 mb-4">{milestone.deliverable}</p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 text-sm">
                                      <Calendar className="h-4 w-4 text-slate-400" />
                                      <span className="text-slate-300">
                                        {formatDate(milestone.deadline)}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                      <DollarSign className="h-4 w-4 text-slate-400" />
                                      <span className="text-slate-300">
                                        ${Number(milestone.amount || 0).toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Timeline Dot */}
                          <div className="absolute left-0 top-6 w-12 h-12 flex items-center justify-center">
                            <div className={`w-12 h-12 rounded-full ${status.bg} ${status.border} border-2 flex items-center justify-center`}>
                              <Icon className={`h-6 w-6 ${status.color}`} />
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                </div>
              </div>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-slate-600" />
                  <p className="text-slate-400">No milestones found for this project</p>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      ) : (
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400">Select a project to view its timeline</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}