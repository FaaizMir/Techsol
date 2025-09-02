"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
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
  Search,
  Filter,
  Download,
  Send,
  Clock,
  Calendar,
  DollarSign,
  Eye,
  Edit,
  MessageCircle,
  Phone,
  Video,
  Paperclip,
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
    {
      id: 1,
      name: "E-commerce Platform",
      status: "In Progress",
      progress: 65,
      dueDate: "Dec 15, 2024",
      client: "TechCorp Inc.",
      priority: "High",
      budget: "$15,000",
      description: "Complete e-commerce solution with payment integration",
      tasks: [
        { name: "Frontend Development", completed: true },
        { name: "Backend API", completed: true },
        { name: "Payment Integration", completed: false },
        { name: "Testing & Deployment", completed: false },
      ],
    },
    {
      id: 2,
      name: "Mobile App Redesign",
      status: "Review",
      progress: 90,
      dueDate: "Nov 30, 2024",
      client: "StartupXYZ",
      priority: "Medium",
      budget: "$8,500",
      description: "Complete UI/UX redesign for mobile application",
      tasks: [
        { name: "User Research", completed: true },
        { name: "Wireframing", completed: true },
        { name: "UI Design", completed: true },
        { name: "Client Review", completed: false },
      ],
    },
    {
      id: 3,
      name: "API Integration",
      status: "Planning",
      progress: 25,
      dueDate: "Jan 10, 2025",
      client: "Enterprise Ltd.",
      priority: "Low",
      budget: "$5,200",
      description: "Third-party API integration and documentation",
      tasks: [
        { name: "Requirements Analysis", completed: true },
        { name: "API Documentation", completed: false },
        { name: "Integration Development", completed: false },
        { name: "Testing", completed: false },
      ],
    },
  ]

  const chatConversations = [
    {
      id: 1,
      client: "John Smith",
      company: "TechCorp Inc.",
      lastMessage: "Can we schedule a call to discuss the project requirements?",
      time: "2 hours ago",
      unread: 3,
      online: true,
      messages: [
        { id: 1, sender: "client", message: "Hi! How's the project coming along?", time: "10:30 AM" },
        { id: 2, sender: "me", message: "Great progress! We're 65% complete.", time: "10:32 AM" },
        {
          id: 3,
          sender: "client",
          message: "Can we schedule a call to discuss the project requirements?",
          time: "10:35 AM",
        },
      ],
    },
    {
      id: 2,
      client: "Sarah Johnson",
      company: "StartupXYZ",
      lastMessage: "The latest mockups look great! When can we proceed?",
      time: "5 hours ago",
      unread: 0,
      online: false,
      messages: [
        { id: 1, sender: "client", message: "I've reviewed the designs", time: "2:15 PM" },
        { id: 2, sender: "client", message: "The latest mockups look great! When can we proceed?", time: "2:16 PM" },
        { id: 3, sender: "me", message: "Thank you! We can start development next week.", time: "2:20 PM" },
      ],
    },
    {
      id: 3,
      client: "Mike Wilson",
      company: "Enterprise Ltd.",
      lastMessage: "I've uploaded the brand assets to the shared folder.",
      time: "1 day ago",
      unread: 0,
      online: true,
      messages: [
        { id: 1, sender: "client", message: "Here are the brand guidelines", time: "Yesterday" },
        { id: 2, sender: "client", message: "I've uploaded the brand assets to the shared folder.", time: "Yesterday" },
      ],
    },
  ]

  const documents = [
    {
      id: 1,
      name: "Project Proposal - E-commerce Platform",
      type: "PDF",
      size: "2.4 MB",
      client: "TechCorp Inc.",
      uploadDate: "Nov 15, 2024",
      status: "Approved",
    },
    {
      id: 2,
      name: "Design Mockups - Mobile App",
      type: "Figma",
      size: "15.2 MB",
      client: "StartupXYZ",
      uploadDate: "Nov 12, 2024",
      status: "Under Review",
    },
    {
      id: 3,
      name: "API Documentation",
      type: "DOC",
      size: "1.8 MB",
      client: "Enterprise Ltd.",
      uploadDate: "Nov 10, 2024",
      status: "Draft",
    },
    {
      id: 4,
      name: "Contract Agreement",
      type: "PDF",
      size: "890 KB",
      client: "TechCorp Inc.",
      uploadDate: "Nov 8, 2024",
      status: "Signed",
    },
  ]

  const clients = [
    {
      id: 1,
      name: "TechCorp Inc.",
      contact: "John Smith",
      email: "john@techcorp.com",
      phone: "+1 (555) 123-4567",
      projects: 2,
      totalValue: "$25,000",
      lastContact: "2 hours ago",
      status: "Active",
    },
    {
      id: 2,
      name: "StartupXYZ",
      contact: "Sarah Johnson",
      email: "sarah@startupxyz.com",
      phone: "+1 (555) 987-6543",
      projects: 1,
      totalValue: "$8,500",
      lastContact: "5 hours ago",
      status: "Active",
    },
    {
      id: 3,
      name: "Enterprise Ltd.",
      contact: "Mike Wilson",
      email: "mike@enterprise.com",
      phone: "+1 (555) 456-7890",
      projects: 1,
      totalValue: "$5,200",
      lastContact: "1 day ago",
      status: "Active",
    },
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
          <div className="space-y-6 mt-20 bg-[#0a0f1c] bg-[radial-gradient(circle_at_50%_50%,#0a0f2c,#0d1117)]">
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-6 bg-[#0a0f1c] bg-[radial-gradient(circle_at_50%_50%,#0a0f2c,#0d1117)]">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-card-foreground mb-2">Welcome to TechCraft Solutions!</h2>
                    <p className="text-muted-foreground">
                      Manage your projects, communicate with clients, and track your progress all in one place.
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={onShowOnboarding} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      New Project
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Bell className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-[#0a0f1c] bg-[radial-gradient(circle_at_50%_50%,#0a0f2c,#0d1117)]">
              <Card className="bg-card border-border bg-[#0a0f1c] bg-[radial-gradient(circle_at_50%_50%,#0a0f2c,#0d1117)]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Active Projects</CardTitle>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">12</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border bg-[#0a0f1c] bg-[radial-gradient(circle_at_50%_50%,#0a0f2c,#0d1117)]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">48</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border bg-[#0a0f1c] bg-[radial-gradient(circle_at_50%_50%,#0a0f2c,#0d1117)]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Total Clients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">24</div>
                  <p className="text-xs text-muted-foreground">+3 new this month</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border bg-[#0a0f1c] bg-[radial-gradient(circle_at_50%_50%,#0a0f2c,#0d1117)]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">$45,231</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Projects */}
            <Card className="bg-card border-border bg-[#0a0f1c] bg-[radial-gradient(circle_at_50%_50%,#0a0f2c,#0d1117)]">
              <CardHeader>
                <CardTitle className="text-card-foreground">Recent Projects</CardTitle>
                <CardDescription className="text-muted-foreground">Your latest project updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.slice(0, 3).map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="space-y-1">
                        <h4 className="font-medium text-card-foreground">{project.name}</h4>
                        <p className="text-sm text-muted-foreground">{project.client}</p>
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
                        >
                          {project.status}
                        </Badge>
                        <div className="text-sm text-muted-foreground">{project.progress}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Messages */}
            <Card className="bg-card border-border bg-[#0a0f1c] bg-[radial-gradient(circle_at_50%_50%,#0a0f2c,#0d1117)]">
              <CardHeader>
                <CardTitle className="text-card-foreground">Recent Messages</CardTitle>
                <CardDescription className="text-muted-foreground">Latest client communications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chatConversations.slice(0, 3).map((conversation) => (
                    <div
                      key={conversation.id}
                      className="flex items-start space-x-4 p-3 border border-border rounded-lg"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-muted text-muted-foreground">
                          {conversation.client
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-card-foreground">{conversation.client}</h4>
                          <span className="text-xs text-muted-foreground">{conversation.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unread > 0 && (
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-xs text-primary-foreground">{conversation.unread}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "projects":
        return (
          <div className="space-y-6 mt-20 ">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Projects</h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -y-1/2 h-4 w-4 text-muted-foreground bg-[#0a0f1c] bg-[radial-gradient(circle_at_50%_50%,#0a0f2c,#0d1117)]" />
                  <Input
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button onClick={onShowOnboarding} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 ">
              {projects.map((project) => (
                <Card key={project.id} className="bg-card border-border bg-[#0a0f1c] bg-[radial-gradient(circle_at_50%_50%,#0a0f2c,#0d1117)]">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-card-foreground">{project.name}</CardTitle>
                      <Badge
                        variant={
                          project.priority === "High"
                            ? "destructive"
                            : project.priority === "Medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {project.priority}
                      </Badge>
                    </div>
                    <CardDescription className="text-muted-foreground">{project.client}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">{project.description}</p>

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-card-foreground">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-card-foreground">Tasks</h4>
                        {project.tasks.map((task, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <CheckCircle
                              className={`h-4 w-4 ${task.completed ? "text-green-500" : "text-muted-foreground"}`}
                            />
                            <span
                              className={`text-sm ${task.completed ? "text-muted-foreground line-through" : "text-card-foreground"}`}
                            >
                              {task.name}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-border">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            {project.dueDate}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {project.budget}
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <Badge variant="outline" className="w-fit">
                        {project.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "chat":
        return (
          <div className="space-y-6 mt-20">
            <h2 className="text-2xl font-bold text-foreground">Messages</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
              {/* Chat List */}
              <Card className="bg-card border-border bg-[#0a0f1c] bg-[radial-gradient(circle_at_50%_50%,#0a0f2c,#0d1117)]">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Conversations</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search conversations..." className="pl-10" />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {chatConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => setSelectedChat(conversation.id)}
                        className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b border-border ${
                          selectedChat === conversation.id ? "bg-muted" : ""
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-muted text-muted-foreground">
                                {conversation.client
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            {conversation.online && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-medium text-card-foreground truncate">{conversation.client}</h4>
                              <span className="text-xs text-muted-foreground">{conversation.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{conversation.company}</p>
                            <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                          </div>
                          {conversation.unread > 0 && (
                            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-xs text-primary-foreground">{conversation.unread}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Chat Window */}
              <div className="lg:col-span-2">
                {selectedChat ? (
                  <Card className="bg-card border-border h-full flex flex-col">
                    <CardHeader className="border-b border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback className="bg-muted text-muted-foreground">
                              {chatConversations
                                .find((c) => c.id === selectedChat)
                                ?.client.split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-card-foreground">
                              {chatConversations.find((c) => c.id === selectedChat)?.client}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {chatConversations.find((c) => c.id === selectedChat)?.company}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Video className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-4 overflow-y-auto">
                      <div className="space-y-4">
                        {chatConversations
                          .find((c) => c.id === selectedChat)
                          ?.messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  message.sender === "me"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-card-foreground"
                                }`}
                              >
                                <p className="text-sm">{message.message}</p>
                                <p className="text-xs opacity-70 mt-1">{message.time}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                    <div className="p-4 border-t border-border">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Input
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                          className="flex-1"
                        />
                        <Button onClick={handleSendMessage} size="sm">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="bg-card border-border h-full flex items-center justify-center bg-[#0a0f1c] bg-[radial-gradient(circle_at_50%_50%,#0a0f2c,#0d1117)]">
                    <div className="text-center">
                      <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-card-foreground mb-2">Select a conversation</h3>
                      <p className="text-muted-foreground">Choose a conversation from the list to start chatting.</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )

      case "documents":
        return (
          <div className="space-y-6 mt-20">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Documents</h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search documents..." className="pl-10 w-64" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <Card key={doc.id} className="bg-card border-border bg-[#0a0f1c] bg-[radial-gradient(circle_at_50%_50%,#0a0f2c,#0d1117)]">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-card-foreground truncate">{doc.name}</h3>
                          <p className="text-sm text-muted-foreground">{doc.client}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          doc.status === "Approved"
                            ? "default"
                            : doc.status === "Signed"
                              ? "default"
                              : doc.status === "Under Review"
                                ? "secondary"
                                : "outline"
                        }
                      >
                        {doc.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Type</span>
                        <span className="text-card-foreground">{doc.type}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Size</span>
                        <span className="text-card-foreground">{doc.size}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Uploaded</span>
                        <span className="text-card-foreground">{doc.uploadDate}</span>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "clients":
        return (
          <div className="space-y-6 mt-20">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Clients</h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search clients..." className="pl-10 w-64" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Client
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clients.map((client) => (
                <Card key={client.id} className="bg-card border-border bg-[#0a0f1c] bg-[radial-gradient(circle_at_50%_50%,#0a0f2c,#0d1117)]">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-muted text-muted-foreground">
                          {client.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-card-foreground">{client.name}</CardTitle>
                        <CardDescription className="text-muted-foreground">{client.contact}</CardDescription>
                      </div>
                      <Badge variant="outline">{client.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          {client.email}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="h-4 w-4 mr-2" />
                          {client.phone}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-card-foreground">{client.projects}</div>
                          <div className="text-xs text-muted-foreground">Projects</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-card-foreground">{client.totalValue}</div>
                          <div className="text-xs text-muted-foreground">Total Value</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-border">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          {client.lastContact}
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "profile":
        return (
          <div className="space-y-6 mt-20">
            <h2 className="text-2xl font-bold text-foreground">Profile</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border bg-[#0a0f1c] bg-[radial-gradient(circle_at_50%_50%,#0a0f2c,#0d1117)]">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Account Information</CardTitle>
                  <CardDescription className="text-muted-foreground">Manage your account details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-muted text-muted-foreground text-lg">TC</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium text-card-foreground">TechCraft Client</h3>
                        <p className="text-muted-foreground">client@techcraft.com</p>
                        <Button variant="outline" size="sm">
                          Change Avatar
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-card-foreground">Full Name</label>
                        <Input defaultValue="TechCraft Client" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-card-foreground">Email</label>
                        <Input defaultValue="client@techcraft.com" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-card-foreground">Phone</label>
                        <Input defaultValue="+1 (555) 123-4567" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-card-foreground">Company</label>
                        <Input defaultValue="TechCraft Solutions" />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <Button className="mr-4">Save Changes</Button>
                      <Button variant="outline">Cancel</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border bg-[#0a0f1c] bg-[radial-gradient(circle_at_50%_50%,#0a0f2c,#0d1117)]">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Security Settings</CardTitle>
                  <CardDescription className="text-muted-foreground">Manage your security preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-card-foreground">Current Password</label>
                      <Input type="password" placeholder="Enter current password" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-card-foreground">New Password</label>
                      <Input type="password" placeholder="Enter new password" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-card-foreground">Confirm Password</label>
                      <Input type="password" placeholder="Confirm new password" />
                    </div>

                    <div className="pt-4 border-t border-border">
                      <Button>Update Password</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-[#0a0f1c] bg-[radial-gradient(circle_at_50%_50%,#0a0f2c,#0d1117)]">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col bg-[#0a0f1c] bg-[radial-gradient(circle_at_50%_50%,#0a0f2c,#0d1117)]">
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-foreground">TechCraft Solutions</h1>
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
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
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

        <div className="p-4 border-t border-sidebar-border">
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50">
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
