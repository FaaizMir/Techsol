"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  MessageSquare,
  FolderOpen,
  FileText,
  User,
  LogOut,
  Plus,
  CheckCircle,
  Users,
  TrendingUp,
  Bell,
} from "lucide-react"

interface DashboardProps {
  onShowOnboarding: () => void
}

export default function Dashboard({ onShowOnboarding }: DashboardProps) {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [selectedChat, setSelectedChat] = useState<number | null>(null)

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "chat", label: "Chat", icon: MessageSquare },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "clients", label: "Clients", icon: Users },
    { id: "profile", label: "Profile", icon: User },
  ]

  const projects = [
    { id: 1, name: "Project Alpha", client: "Client A", status: "In Progress", progress: 75 },
    { id: 2, name: "Project Beta", client: "Client B", status: "Review", progress: 50 },
    { id: 3, name: "Project Gamma", client: "Client C", status: "Completed", progress: 100 },
  ]

  const chatConversations = [
    { id: 1, client: "Client A", time: "10:30 AM", lastMessage: "Hello, how are you?", unread: 2 },
    { id: 2, client: "Client B", time: "11:15 AM", lastMessage: "Just a reminder about the deadline.", unread: 0 },
    { id: 3, client: "Client C", time: "12:45 PM", lastMessage: "Great work on the project!", unread: 1 },
  ]

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      // Add message logic here
      setNewMessage("")
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6 mt-10">
            <Card className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border-cyan-500/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">Welcome to TechCraft Solutions!</h2>
                    <p className="text-slate-300">
                      Manage your projects, communicate with clients, and track your progress all in one place.
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
                  <CardTitle className="text-sm font-medium text-slate-200">Active Projects</CardTitle>
                  <FolderOpen className="h-4 w-4 text-cyan-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">12</div>
                  <p className="text-xs text-slate-400">+2 from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-200">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">48</div>
                  <p className="text-xs text-slate-400">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-200">Total Clients</CardTitle>
                  <Users className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">24</div>
                  <p className="text-xs text-slate-400">+3 new this month</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-200">Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-pink-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">$45,231</div>
                  <p className="text-xs text-slate-400">+20.1% from last month</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Recent Projects</CardTitle>
                <CardDescription className="text-slate-400">Your latest project updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.slice(0, 3).map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 border border-slate-700/50 rounded-lg bg-slate-900/30"
                    >
                      <div className="space-y-1">
                        <h4 className="font-medium text-white">{project.name}</h4>
                        <p className="text-sm text-slate-400">{project.client}</p>
                      </div>
                      <div className="flex items-center space-x-4">
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
                <CardDescription className="text-slate-400">Latest client communications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chatConversations.slice(0, 3).map((conversation) => (
                    <div
                      key={conversation.id}
                      className="flex items-start space-x-4 p-3 border border-slate-700/50 rounded-lg bg-slate-900/30"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-slate-700 text-slate-300">
                          {conversation.client
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-white">{conversation.client}</h4>
                          <span className="text-xs text-slate-400">{conversation.time}</span>
                        </div>
                        <p className="text-sm text-slate-400">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unread > 0 && (
                        <div className="w-5 h-5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white">{conversation.unread}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      // ... existing code for other cases ...

      default:
        return null
    }
  }

  return (
    <div
      className="flex h-screen bg-slate-900"
      style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                       radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
                       radial-gradient(1px 1px at 20px 30px, rgba(255, 255, 255, 0.1), transparent),
                       radial-gradient(1px 1px at 40px 70px, rgba(255, 255, 255, 0.1), transparent),
                       radial-gradient(1px 1px at 90px 40px, rgba(255, 255, 255, 0.1), transparent),
                       radial-gradient(1px 1px at 130px 80px, rgba(255, 255, 255, 0.1), transparent),
                       radial-gradient(1px 1px at 160px 30px, rgba(255, 255, 255, 0.1), transparent)`,
      }}
    >
      <div className="w-64 bg-slate-800/80 border-r border-slate-700/50 flex flex-col backdrop-blur-sm">
        <div className="p-6 border-b border-slate-700/50">
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            TechCraft Solutions
          </h1>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30"
                        : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:bg-slate-700/50 hover:text-white"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{renderContent()}</div>
      </div>
    </div>
  )
}
