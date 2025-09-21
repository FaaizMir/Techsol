"use client"

import { useState,useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import OnboardingChecker from "@/components/common/OnboardingChecker"
import { useOnboarding } from "@/hooks/use-onboarding"
import { onboardingAPI } from "@/lib/api"


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

interface ProjectFull {
  id: number;
  name: string;
  status: string;
  progress: number;
  dueDate: string;
  client: string;
  priority: string;
  budget: string;
  description: string;
  tasks: { name: string; completed: boolean }[];
  requirements: any;
  milestones: any[];
  clientInfo: any;
}
export default function Dashboard() {
    const { showModal, setShowModal } = useOnboarding()

  const [activeSection, setActiveSection] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [selectedChat, setSelectedChat] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)


  //new onboardingAPI functions
  const [projects, setProjects] = useState<ProjectFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1️⃣ Get all projects
        const projectsRes = await onboardingAPI.getProjects(); // returns array of project objects
        console.log('Projects fetched:', projectsRes);
        const projectsData = projectsRes.data.projects; 

        // 2️⃣ For each project, fetch requirements, milestones, client info in parallel
        // const fullProjects = await Promise.all(
        //   projectsData.map(async (proj: any) => {
        //     const [reqRes, milestonesRes, clientRes] = await Promise.all([
        //       onboardingAPI.getRequirements(proj.id),
        //       onboardingAPI.getMilestones(proj.id),
        //       onboardingAPI.getClient(proj.id),
        //     ]);

        //     return {
        //       ...proj,
        //       requirements: reqRes.data.requirements,
        //       milestones: milestonesRes.data.milestones,
        //       clientInfo: clientRes.data.client,
        //       tasks: proj.tasks || [], // ensure tasks exist for UI
        //     };
        //   })
        // );

        setProjects(projectsData);
        console.log('Full projects with details:', projectsData);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [projects]);

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  }

  const pageTransition = {
    duration: 0.4
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        stiffness: 100,
        damping: 12
      }
    }
  }

  const cardHoverVariants = {
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        stiffness: 400,
        damping: 17
      }
    }
  }

  const skeletonVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const skeletonItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        stiffness: 100,
        damping: 12
      }
    }
  }

  const handleSectionChange = (sectionId: string) => {
    if (sectionId !== activeSection) {
      setIsLoading(true)
      setTimeout(() => {
        setActiveSection(sectionId)
        setIsLoading(false)
      }, 300)
    }
  }

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      // Add message logic here
      setNewMessage("")
    }
  }

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "chat", label: "Chat", icon: MessageSquare },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "clients", label: "Clients", icon: Users },
    { id: "profile", label: "Profile", icon: User },
  ]

  // const projects = [
  //   {
  //     id: 1,
  //     name: "E-commerce Platform",
  //     status: "In Progress",
  //     progress: 65,
  //     dueDate: "Dec 15, 2024",
  //     client: "TechCorp Inc.",
  //     priority: "High",
  //     budget: "$15,000",
  //     description: "Complete e-commerce solution with payment integration",
  //     tasks: [
  //       { name: "Frontend Development", completed: true },
  //       { name: "Backend API", completed: true },
  //       { name: "Payment Integration", completed: false },
  //       { name: "Testing & Deployment", completed: false },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     name: "Mobile App Redesign",
  //     status: "Review",
  //     progress: 90,
  //     dueDate: "Nov 30, 2024",
  //     client: "StartupXYZ",
  //     priority: "Medium",
  //     budget: "$8,500",
  //     description: "Complete UI/UX redesign for mobile application",
  //     tasks: [
  //       { name: "User Research", completed: true },
  //       { name: "Wireframing", completed: true },
  //       { name: "UI Design", completed: true },
  //       { name: "Client Review", completed: false },
  //     ],
  //   },
  //   {
  //     id: 3,
  //     name: "API Integration",
  //     status: "Planning",
  //     progress: 25,
  //     dueDate: "Jan 10, 2025",
  //     client: "Enterprise Ltd.",
  //     priority: "Low",
  //     budget: "$5,200",
  //     description: "Third-party API integration and documentation",
  //     tasks: [
  //       { name: "Requirements Analysis", completed: true },
  //       { name: "API Documentation", completed: false },
  //       { name: "Integration Development", completed: false },
  //       { name: "Testing", completed: false },
  //     ],
  //   },
  // ]

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

  const LoadingSkeleton = () => (
    <motion.div
      className="space-y-8"
      variants={skeletonVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={skeletonItemVariants} className="flex justify-between items-center">
        <div className="h-8 bg-gray-700 rounded-lg w-48 animate-pulse"></div>
        <div className="flex space-x-3">
          <div className="h-10 bg-gray-700 rounded-lg w-64 animate-pulse"></div>
          <div className="h-10 bg-gray-700 rounded-lg w-20 animate-pulse"></div>
          <div className="h-10 bg-gray-700 rounded-lg w-32 animate-pulse"></div>
        </div>
      </motion.div>

      <motion.div variants={skeletonItemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            variants={skeletonItemVariants}
            className="bg-gray-800 rounded-lg p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-2/3"></div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )

  const handleShowOnboarding = () => {
    // This will trigger the onboarding modal through the OnboardingChecker
    console.log("Show onboarding modal")
    setShowModal(true)
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <motion.div
            className="space-y-8 bg-[#0a0f1c] bg-[radial-gradient(circle_at_50%_50%,#0a0f2c,#0d1117)]"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 border border-primary/30 shadow-2xl shadow-primary/10"
            >
              {/* <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div> */}
              <Card className="bg-transparent border-0 shadow-none">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-2"
                    >
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        Welcome to TechCraft Solutions!
                      </h2>
                      <p className="text-gray-400 text-lg">
                        Manage your projects, communicate with clients, and track your progress all in one place.
                      </p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex space-x-3"
                    >
                      <Button
                        onClick={handleShowOnboarding}
                        variant="outline"
                        className="border-primary/50 hover:border-primary hover:bg-primary/10 transition-all duration-300"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Project
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-white/10 transition-all duration-300"
                      >
                        <Bell className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
            >
              {[
                { title: "Active Projects", value: "12", change: "+2 from last month", icon: FolderOpen, color: "text-blue-400" },
                { title: "Completed", value: "48", change: "+12% from last month", icon: CheckCircle, color: "text-green-400" },
                { title: "Total Clients", value: "24", change: "+3 new this month", icon: Users, color: "text-purple-400" },
                { title: "Revenue", value: "$45,231", change: "+20.1% from last month", icon: TrendingUp, color: "text-yellow-400" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  variants={itemVariants}
                  whileHover={cardHoverVariants.hover}
                  className="group"
                >
                  <Card className="bg-[#0a0f1c] border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-white">{stat.title}</CardTitle>
                      <stat.icon className={`h-5 w-5 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                      <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{stat.change}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Recent Projects */}
            <motion.div variants={itemVariants}>
              <Card className="bg-[#0a0f1c] border-gray-800 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Recent Projects</CardTitle>
                  <CardDescription className="text-gray-400">Your latest project updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="space-y-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {projects.slice(0, 3).map((project, index) => (
                      <motion.div
                        key={project.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.01, x: 5 }}
                        className="flex items-center justify-between p-4 border border-gray-700 rounded-lg hover:border-gray-600 transition-all duration-300 cursor-pointer group"
                      >
                        <div className="space-y-1">
                          <h4 className="font-medium text-white group-hover:text-blue-300 transition-colors duration-300">{project.name}</h4>
                          <p className="text-sm text-gray-400">{project.client}</p>
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
                            className="group-hover:scale-105 transition-transform duration-300"
                          >
                            {project.status}
                          </Badge>
                          <div className="text-sm text-gray-400">{project.progress}%</div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Messages */}
            <motion.div variants={itemVariants}>
              <Card className="bg-[#0a0f1c] border-gray-800 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Recent Messages</CardTitle>
                  <CardDescription className="text-gray-400">Latest client communications</CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="space-y-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {chatConversations.slice(0, 3).map((conversation, index) => (
                      <motion.div
                        key={conversation.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.01, x: 5 }}
                        className="flex items-start space-x-4 p-4 border border-gray-700 rounded-lg hover:border-gray-600 transition-all duration-300 cursor-pointer group"
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="relative"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gray-700 text-gray-300">
                              {conversation.client
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.online && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800 animate-pulse"></div>
                          )}
                        </motion.div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors duration-300">{conversation.client}</h4>
                            <span className="text-xs text-gray-400">{conversation.time}</span>
                          </div>
                          <p className="text-sm text-gray-400">{conversation.lastMessage}</p>
                        </div>
                        {conversation.unread > 0 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                          >
                            <span className="text-xs text-white">{conversation.unread}</span>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )

      case "projects":
        return (
           <motion.div className="space-y-8" initial="hidden" animate="visible">
      <motion.div className="flex justify-between items-center">
        <motion.h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Projects
        </motion.h2>
        <motion.div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 border-gray-700 focus:border-primary/50 transition-colors duration-300"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-gradient-to-r from-primary to-accent">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </motion.div>
      </motion.div>

      <motion.div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div key={project.id} className="group">
            <Card className="bg-[#0a0f1c] border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/10 h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white group-hover:text-blue-300 transition-colors duration-300">
                    {project.name}
                  </CardTitle>
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
                <CardDescription className="text-gray-400">{project.client}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">{project.description}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white font-medium">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-primary to-accent h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                  />
                </div>

                <div className="space-y-3 mt-4">
                  <h4 className="text-sm font-medium text-white">Tasks</h4>
                  {project.tasks.map((task, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle
                        className={`h-4 w-4 ${task.completed ? "text-green-500" : "text-gray-400"}`}
                      />
                      <span className={`text-sm ${task.completed ? "text-gray-400 line-through" : "text-white"}`}>
                        {task.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Milestones, requirements, client info can be rendered here */}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
        )

      case "chat":
        return (
          <motion.div
            className="space-y-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h2
              className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Messages
            </motion.h2>
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]"
              variants={containerVariants}
            >
              {/* Chat List */}
              <motion.div variants={itemVariants}>
                <Card className="bg-[#0a0f1c] border-gray-800 shadow-xl h-full">
                  <CardHeader>
                    <CardTitle className="text-white text-xl">Conversations</CardTitle>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search conversations..."
                        className="pl-10 border-gray-700 focus:border-primary/50 transition-colors duration-300"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <motion.div
                      className="space-y-1"
                      variants={containerVariants}
                    >
                      {chatConversations.map((conversation, index) => (
                        <motion.div
                          key={conversation.id}
                          variants={itemVariants}
                          whileHover={{ scale: 1.02, backgroundColor: "rgba(55, 65, 81, 0.5)" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedChat(conversation.id)}
                          className={`p-4 cursor-pointer transition-all duration-300 border-b border-gray-700 ${
                            selectedChat === conversation.id ? "bg-gray-700 shadow-lg" : "hover:bg-gray-800/50"
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <motion.div
                              className="relative"
                              whileHover={{ scale: 1.1 }}
                            >
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-gray-700 text-gray-300">
                                  {conversation.client
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              {conversation.online && (
                                <motion.div
                                  className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ repeat: Infinity, duration: 2 }}
                                ></motion.div>
                              )}
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center mb-1">
                                <h4 className="font-medium text-white truncate">{conversation.client}</h4>
                                <span className="text-xs text-gray-400">{conversation.time}</span>
                              </div>
                              <p className="text-sm text-gray-400 truncate">{conversation.company}</p>
                              <p className="text-sm text-gray-400 truncate">{conversation.lastMessage}</p>
                            </div>
                            {conversation.unread > 0 && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-lg"
                              >
                                <span className="text-xs text-white">{conversation.unread}</span>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Chat Window */}
              <motion.div
                className="lg:col-span-2"
                variants={itemVariants}
              >
                {selectedChat ? (
                  <Card className="bg-[#0a0f1c] border-gray-800 shadow-xl h-full flex flex-col">
                    <CardHeader className="border-b border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <motion.div whileHover={{ scale: 1.1 }}>
                            <Avatar>
                              <AvatarFallback className="bg-gray-700 text-gray-300">
                                {chatConversations
                                  .find((c) => c.id === selectedChat)
                                  ?.client.split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          </motion.div>
                          <div>
                            <h3 className="font-medium text-white">
                              {chatConversations.find((c) => c.id === selectedChat)?.client}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {chatConversations.find((c) => c.id === selectedChat)?.company}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="ghost" size="sm" className="hover:bg-blue-500/10 hover:text-blue-400 transition-colors duration-300">
                              <Phone className="h-4 w-4" />
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="ghost" size="sm" className="hover:bg-green-500/10 hover:text-green-400 transition-colors duration-300">
                              <Video className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-4 overflow-y-auto">
                      <motion.div
                        className="space-y-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {chatConversations
                          .find((c) => c.id === selectedChat)
                          ?.messages.map((message, index) => (
                            <motion.div
                              key={message.id}
                              variants={itemVariants}
                              className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                            >
                              <motion.div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-md ${
                                  message.sender === "me"
                                    ? "bg-gradient-to-r from-primary to-accent text-white"
                                    : "bg-gray-700 text-white"
                                }`}
                                whileHover={{ scale: 1.02 }}
                                transition={{ stiffness: 400, damping: 17 }}
                              >
                                <p className="text-sm">{message.message}</p>
                                <p className="text-xs opacity-70 mt-1">{message.time}</p>
                              </motion.div>
                            </motion.div>
                          ))}
                      </motion.div>
                    </CardContent>
                    <motion.div
                      className="p-4 border-t border-gray-700"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="flex space-x-2">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="ghost" size="sm" className="hover:bg-gray-600 transition-colors duration-300">
                            <Paperclip className="h-4 w-4" />
                          </Button>
                        </motion.div>
                        <Input
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                          className="flex-1 border-gray-700 focus:border-primary/50 transition-colors duration-300"
                        />
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={handleSendMessage}
                            size="sm"
                            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/25"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  </Card>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="bg-[#0a0f1c] border-gray-800 shadow-xl h-full flex items-center justify-center">
                      <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        </motion.div>
                        <h3 className="text-xl font-medium text-white mb-2">Select a conversation</h3>
                        <p className="text-gray-400">Choose a conversation from the list to start chatting.</p>
                      </motion.div>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )

      case "documents":
        return (
          <motion.div
            className="space-y-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div
              variants={itemVariants}
              className="flex justify-between items-center"
            >
              <motion.h2
                className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Documents
              </motion.h2>
              <motion.div
                className="flex space-x-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search documents..."
                    className="pl-10 w-64 border-gray-700 focus:border-primary/50 transition-colors duration-300"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700 hover:border-primary/50 transition-colors duration-300"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/25">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
            >
              {documents.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  variants={itemVariants}
                  whileHover={cardHoverVariants.hover}
                  className="group"
                >
                  <Card className="bg-[#0a0f1c] border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/10 h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <motion.div
                            className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center border border-primary/30"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ stiffness: 400, damping: 17 }}
                          >
                            <FileText className="h-6 w-6 text-primary group-hover:text-accent transition-colors duration-300" />
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-white truncate group-hover:text-blue-300 transition-colors duration-300">{doc.name}</h3>
                            <p className="text-sm text-gray-400">{doc.client}</p>
                          </div>
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
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
                            className="group-hover:scale-105 transition-transform duration-300"
                          >
                            {doc.status}
                          </Badge>
                        </motion.div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-1">
                            <span className="text-gray-400">Type</span>
                            <div className="text-white font-medium">{doc.type}</div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-gray-400">Size</span>
                            <div className="text-white font-medium">{doc.size}</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Uploaded</span>
                            <span className="text-white">{doc.uploadDate}</span>
                          </div>
                        </div>

                        <div className="flex space-x-2 pt-4">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full border-gray-600 text-gray-300 hover:border-green-500 hover:text-green-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )

      case "clients":
        return (
          <motion.div
            className="space-y-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div
              variants={itemVariants}
              className="flex justify-between items-center"
            >
              <motion.h2
                className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Clients
              </motion.h2>
              <motion.div
                className="flex space-x-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search clients..."
                    className="pl-10 w-64 border-gray-700 focus:border-primary/50 transition-colors duration-300"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700 hover:border-primary/50 transition-colors duration-300"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/25">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Client
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
            >
              {clients.map((client, index) => (
                <motion.div
                  key={client.id}
                  variants={itemVariants}
                  whileHover={cardHoverVariants.hover}
                  className="group"
                >
                  <Card className="bg-[#0a0f1c] border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/10 h-full">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ stiffness: 400, damping: 17 }}
                        >
                          <Avatar className="h-14 w-14 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-white font-semibold text-lg">
                              {client.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        </motion.div>
                        <div className="flex-1">
                          <CardTitle className="text-white group-hover:text-blue-300 transition-colors duration-300">{client.name}</CardTitle>
                          <CardDescription className="text-gray-400">{client.contact}</CardDescription>
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Badge
                            variant="outline"
                            className="group-hover:border-green-500 group-hover:text-green-400 transition-colors duration-300"
                          >
                            {client.status}
                          </Badge>
                        </motion.div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-400">
                            <MessageSquare className="h-4 w-4 mr-2 text-blue-400" />
                            {client.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <Phone className="h-4 w-4 mr-2 text-green-400" />
                            {client.phone}
                          </div>
                        </div>

                        <motion.div
                          className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-700"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                        >
                          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                            <div className="text-2xl font-bold text-white mb-1">{client.projects}</div>
                            <div className="text-xs text-gray-400">Projects</div>
                          </div>
                          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                            <div className="text-2xl font-bold text-white mb-1">{client.totalValue}</div>
                            <div className="text-xs text-gray-400">Total Value</div>
                          </div>
                        </motion.div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                          <div className="flex items-center text-sm text-gray-400">
                            <Clock className="h-4 w-4 mr-1" />
                            {client.lastContact}
                          </div>
                          <div className="flex space-x-2">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-blue-500/10 hover:text-blue-400 transition-colors duration-300"
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-green-500/10 hover:text-green-400 transition-colors duration-300"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )

      case "profile":
        return (
          <motion.div
            className="space-y-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h2
              className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Profile
            </motion.h2>
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <Card className="bg-[#0a0f1c] border-gray-800 shadow-xl hover:border-gray-700 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-white text-xl">Account Information</CardTitle>
                    <CardDescription className="text-gray-400">Manage your account details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      className="space-y-6"
                      variants={containerVariants}
                    >
                      <motion.div
                        className="flex items-center space-x-4"
                        variants={itemVariants}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ stiffness: 400, damping: 17 }}
                        >
                          <Avatar className="h-20 w-20 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300">
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-white font-semibold text-xl">TC</AvatarFallback>
                          </Avatar>
                        </motion.div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-medium text-white">TechCraft Client</h3>
                          <p className="text-gray-400">client@techcraft.com</p>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-700 hover:border-primary/50 transition-colors duration-300"
                            >
                              Change Avatar
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="space-y-4"
                        variants={containerVariants}
                      >
                        {[
                          { label: "Full Name", value: "TechCraft Client" },
                          { label: "Email", value: "client@techcraft.com" },
                          { label: "Phone", value: "+1 (555) 123-4567" },
                          { label: "Company", value: "TechCraft Solutions" }
                        ].map((field, index) => (
                          <motion.div
                            key={field.label}
                            className="space-y-2"
                            variants={itemVariants}
                          >
                            <label className="text-sm font-medium text-white">{field.label}</label>
                            <Input
                              defaultValue={field.value}
                              className="border-gray-700 focus:border-primary/50 transition-colors duration-300"
                            />
                          </motion.div>
                        ))}
                      </motion.div>

                      <motion.div
                        className="pt-6 border-t border-gray-700 flex space-x-3"
                        variants={itemVariants}
                      >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/25">
                            Save Changes
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="outline"
                            className="border-gray-700 hover:border-gray-600 transition-colors duration-300"
                          >
                            Cancel
                          </Button>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="bg-[#0a0f1c] border-gray-800 shadow-xl hover:border-gray-700 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-white text-xl">Security Settings</CardTitle>
                    <CardDescription className="text-gray-400">Manage your security preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      className="space-y-6"
                      variants={containerVariants}
                    >
                      {[
                        { label: "Current Password", type: "password", placeholder: "Enter current password" },
                        { label: "New Password", type: "password", placeholder: "Enter new password" },
                        { label: "Confirm Password", type: "password", placeholder: "Confirm new password" }
                      ].map((field, index) => (
                        <motion.div
                          key={field.label}
                          className="space-y-2"
                          variants={itemVariants}
                        >
                          <label className="text-sm font-medium text-white">{field.label}</label>
                          <Input
                            type={field.type}
                            placeholder={field.placeholder}
                            className="border-gray-700 focus:border-primary/50 transition-colors duration-300"
                          />
                        </motion.div>
                      ))}

                      <motion.div
                        className="pt-6 border-t border-gray-700"
                        variants={itemVariants}
                      >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/25">
                            Update Password
                          </Button>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-[#0a0f1c] bg-[radial-gradient(circle_at_50%_50%,#0a0f2c,#0d1117)]">
      {/* Onboarding Checker */}
      <OnboardingChecker />

      {/* Sidebar */}
      <motion.div
        className="w-64 bg-[#0a0f1c] border-r border-gray-800 flex flex-col shadow-2xl"
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ stiffness: 100, damping: 20 }}
      >
        <motion.div
          className="p-6 border-b border-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h1
            className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
            transition={{ stiffness: 400, damping: 17 }}
          >
            TechCraft Solutions
          </motion.h1>
        </motion.div>

        <nav className="flex-1 p-4">
          <motion.ul
            className="space-y-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {navigationItems.map((item, index) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              return (
                <motion.li
                  key={item.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.button
                    onClick={() => handleSectionChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-primary/20 to-accent/20 text-white shadow-lg border border-primary/30"
                        : "text-gray-300 hover:bg-gray-700/50 hover:text-white hover:shadow-md"
                    }`}
                    whileHover={{
                      backgroundColor: isActive ? undefined : "rgba(55, 65, 81, 0.5)",
                      x: 5
                    }}
                    transition={{ stiffness: 400, damping: 17 }}
                  >
                    <motion.div
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ stiffness: 400, damping: 17 }}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
                    </motion.div>
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        className="w-2 h-2 bg-primary rounded-full ml-auto"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ stiffness: 400, damping: 17 }}
                      />
                    )}
                  </motion.button>
                </motion.li>
              )
            })}
          </motion.ul>
        </nav>

        <motion.div
          className="p-4 border-t border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 border border-transparent hover:border-red-500/20"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <motion.div
          className="p-8"
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={pageTransition}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              {isLoading ? <LoadingSkeleton /> : renderContent()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}