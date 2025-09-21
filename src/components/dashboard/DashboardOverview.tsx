"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  FolderOpen,
  CheckCircle,
  Users,
  TrendingUp,
  Plus,
  Bell,
} from "lucide-react"

interface DashboardOverviewProps {
  projects: any[]
  chatConversations: any[]
  stats: {
    totalProjects: number
    activeProjects: number
    completedProjects: number
    totalSpent: string
  }
  recentProjects: any[]
  recentMessages: any[]
  onShowOnboarding: () => void
}

export default function DashboardOverview({
  projects,
  chatConversations,
  stats,
  recentProjects,
  recentMessages,
  onShowOnboarding
}: DashboardOverviewProps) {

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Welcome back!</h2>
              <p className="text-slate-300">
                Track your projects, view progress, and communicate with our team.
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={onShowOnboarding}
                variant="outline"
                className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 bg-transparent"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-300 hover:bg-slate-700/50">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalProjects}</div>
            <p className="text-xs text-slate-400">All your projects</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Active Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.activeProjects}</div>
            <p className="text-xs text-slate-400">Currently in progress</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.completedProjects}</div>
            <p className="text-xs text-slate-400">Successfully delivered</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-pink-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalSpent}</div>
            <p className="text-xs text-slate-400">Across all projects</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">My Projects</CardTitle>
          <CardDescription className="text-slate-400">Your recent project updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 border border-slate-700/50 rounded-lg bg-slate-900/30"
              >
                <div className="space-y-1">
                  <h4 className="font-medium text-white">{project.name}</h4>
                  <p className="text-sm text-slate-400">{project.description}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge
                    variant={
                      project.status === "active"
                        ? "default"
                        : project.status === "completed"
                          ? "secondary"
                          : "outline"
                    }
                    className={
                      project.status === "active"
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                        : project.status === "completed"
                          ? "bg-green-500/20 text-green-300 border-green-500/30"
                          : "bg-slate-700/50 text-slate-300 border-slate-600/50"
                    }
                  >
                    {project.status}
                  </Badge>
                  <div className="text-sm text-slate-400">{project.progress}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Recent Messages</CardTitle>
          <CardDescription className="text-slate-400">Latest communications with our team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentMessages.map((conversation) => (
              <div
                key={conversation.id}
                className="flex items-start space-x-4 p-3 border border-slate-700/50 rounded-lg bg-slate-900/30"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-slate-700 text-slate-300">
                    {conversation.sender
                      .split(" ")
                      .map((n:any) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-white">{conversation.sender}</h4>
                    <span className="text-xs text-slate-400">{conversation.time}</span>
                  </div>
                  <p className="text-sm text-slate-400">{conversation.lastMessage}</p>
                </div>
                {conversation.unread > 0 && (
                  <div className="w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">{conversation.unread}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription className="text-slate-400">Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={onShowOnboarding}
              variant="outline"
              className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 bg-transparent h-20 flex-col"
            >
              <Plus className="h-6 w-6 mb-2" />
              Start New Project
            </Button>
            <Button
              variant="outline"
              className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10 bg-transparent h-20 flex-col"
            >
              <FolderOpen className="h-6 w-6 mb-2" />
              View All Projects
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}