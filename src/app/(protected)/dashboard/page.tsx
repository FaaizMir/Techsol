"use client"

import { useState,useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useOnboarding } from "@/hooks/use-onboarding"
import { onboardingAPI } from "@/lib/api"

// Import dashboard hooks
import { useDashboardStats, useRecentProjects, useRecentMessages } from "@/hooks/use-dashboard"
import { useAllProjects } from "@/hooks/use-onboarding"
import { useConversations } from "@/hooks/use-chat"

// Import dashboard sub-components
import DashboardOverview from "@/components/dashboard/DashboardOverview"
import ProjectsSection from "@/components/dashboard/ProjectsSection"
import ChatSection from "@/components/dashboard/ChatSection"
import DocumentsSection from "@/components/dashboard/DocumentsSection"
import ProfileSection from "@/components/dashboard/ProfileSection"

// Import new enhanced components
import ProjectTimeline from "@/components/dashboard/ProjectTimeline"


import {
  LayoutDashboard,
  MessageSquare,
  FolderOpen,
  FileText,
  User,
  LogOut,
  Plus,
  CheckCircle,
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
  Activity,
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

  // API hooks
  const { data: dashboardStats, isLoading: statsLoading } = useDashboardStats()
  const { data: recentProjectsData, isLoading: recentProjectsLoading } = useRecentProjects(5)
  const { data: recentMessagesData, isLoading: recentMessagesLoading } = useRecentMessages(5)
  const { data: allProjectsData, isLoading: allProjectsLoading } = useAllProjects({ limit: 10 })
  const { data: conversationsData, isLoading: conversationsLoading } = useConversations()

  // Transform API data to match component expectations
  const projects = (allProjectsData as any)?.data || []
  const chatConversations = (conversationsData as any)?.data || []
  const recentProjects = (recentProjectsData as any)?.data || []
  const recentMessages = (recentMessagesData as any)?.data || []
  const stats = (dashboardStats as any)?.data || {
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalSpent: "$0.00"
  }



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
      scale: 1.01,
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
    { id: "projects", label: "My Projects", icon: FolderOpen },
    { id: "timeline", label: "Project Timeline", icon: Activity },
    { id: "chat", label: "Messages", icon: MessageSquare },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "profile", label: "Profile", icon: User },
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
    const isAnyLoading = statsLoading || recentProjectsLoading || recentMessagesLoading ||
                        allProjectsLoading || conversationsLoading

    if (isAnyLoading) {
      return <LoadingSkeleton />
    }

    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview
          projects={projects}
          chatConversations={chatConversations}
          stats={stats}
          recentProjects={recentProjects}
          recentMessages={recentMessages}
          onShowOnboarding={handleShowOnboarding}
        />
      case "projects":
        return <ProjectsSection projects={projects} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      case "timeline":
        return <ProjectTimeline />
      case "chat":
        return <ChatSection
          chatConversations={chatConversations}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onSendMessage={handleSendMessage}
        />
      case "documents":
        return <DocumentsSection documents={[]} />
      case "profile":
        return <ProfileSection />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-[#0a0f1c] bg-[radial-gradient(circle_at_50%_50%,#0a0f2c,#0d1117)]">
      {/* Onboarding Checker is handled in the layout */}

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
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.button
                    onClick={() => handleSectionChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-300 ${
                      isActive
                        ? "text-white border-2 border-white bg-primary/5"
                        : "text-gray-300 hover:bg-gray-700/50 hover:text-white hover:shadow-md"
                    }`}
                    whileHover={{
                      backgroundColor: isActive ? undefined : "rgba(55, 65, 81, 0.5)",
                      x: 2
                    }}
                    transition={{ stiffness: 400, damping: 17 }}
                  >
                    <motion.div
                      whileHover={{ rotate: 5 }}
                      transition={{ stiffness: 400, damping: 17 }}
                    >
                      <Icon className={`h-5 w-5`} />
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