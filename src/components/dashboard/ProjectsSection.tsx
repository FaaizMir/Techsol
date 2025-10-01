"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react"

interface ProjectsSectionProps {
  projects: any[]
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export default function ProjectsSection({ projects, searchQuery, setSearchQuery }: ProjectsSectionProps) {

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">My Projects</h2>
          <p className="text-slate-400">Track your project progress and status</p>
        </div>
        <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-400"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {projects.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center">
                  <Plus className="h-8 w-8 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">No projects found</h3>
                  <p className="text-slate-400 mb-6">
                    Get started by creating your first project. Click the button below to begin your journey.
                  </p>
                  <Button
                    className="bg-cyan-500 hover:bg-cyan-600 text-white"
                    icon={<Plus className="h-4 w-4" />}
                    onClick={() => {
                      // Trigger onboarding modal or navigate to project creation
                      // For now, we'll just log this action
                      console.log('Create first project clicked');
                    }}
                  >
                    Create Your First Project
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <Card key={project.id} className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                    <p className="text-sm text-slate-400">{project.description}</p>
                    <p className="text-sm text-slate-400">Due: {project.dueDate || 'TBD'}</p>
                    {project.budget && <p className="text-sm text-slate-400">Budget: {project.budget}</p>}
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <Badge
                      variant={
                        project.status === "In Progress"
                          ? "default"
                          : project.status === "Review"
                            ? "secondary"
                            : "outline"
                      }
                      className={
                        project.status === "In Progress"
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                          : project.status === "Review"
                            ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                            : "bg-green-500/20 text-green-300 border-green-500/30"
                      }
                    >
                      {project.status}
                    </Badge>
                    <div className="text-sm text-slate-400">{project.progress}%</div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="text-slate-300 hover:bg-slate-700/50" icon={<Eye className="h-4 w-4" />} />
                      <Button variant="ghost" size="sm" className="text-slate-300 hover:bg-slate-700/50" icon={<Edit className="h-4 w-4" />} />
                      <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/10" icon={<Trash2 className="h-4 w-4" />} />
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className="bg-cyan-500 h-2 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}