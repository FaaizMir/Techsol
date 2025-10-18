"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  MessageSquare,
  FileText,
  Building2,
  LogOut,
  User,
  TrendingUp,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth-store"

// Import admin sections
import AdminDashboardOverview from "@/components/admin/AdminDashboardOverview"
import AdminUsersSection from "@/components/admin/AdminUsersSection"
import AdminProjectsSection from "@/components/admin/AdminProjectsSection"
import AdminClientsSection from "@/components/admin/AdminClientsSection"
import AdminChatSection from "@/components/admin/AdminChatSection"
import AdminDocumentsSection from "@/components/admin/AdminDocumentsSection"


export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { clearAuth } = useAuthStore()

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", label: "User Management", icon: Users },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "clients", label: "Clients", icon: Building2 },
    { id: "chat", label: "Messages", icon: MessageSquare },
    { id: "documents", label: "Documents", icon: FileText },
  ]

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

  const handleSectionChange = (sectionId: string) => {
    if (sectionId !== activeSection) {
      setIsLoading(true)
      setTimeout(() => {
        setActiveSection(sectionId)
        setIsLoading(false)
      }, 300)
    }
  }

  const handleLogout = () => {
    clearAuth()
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('authToken')
      localStorage.removeItem('auth-storage')
    }
    router.push('/login')
  }

  const LoadingSkeleton = () => (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-700 rounded-lg w-48 animate-pulse"></div>
        <div className="flex space-x-3">
          <div className="h-10 bg-gray-700 rounded-lg w-32 animate-pulse"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-800 rounded-lg p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    </motion.div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <AdminDashboardOverview />
      case "users":
        return <AdminUsersSection />
      case "projects":
        return <AdminProjectsSection />
      case "clients":
        return <AdminClientsSection />
      case "chat":
        return <AdminChatSection />
      case "documents":
        return <AdminDocumentsSection />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-[#0a0f1c] bg-[radial-gradient(circle_at_50%_50%,#0a0f2c,#0d1117)]">
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
            className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
            transition={{ stiffness: 400, damping: 17 }}
          >
            Admin Dashboard
          </motion.h1>
          <p className="text-xs text-gray-400 mt-1">TechCraft Solutions</p>
        </motion.div>

        <nav className="flex-1 p-4">
          <motion.ul
            className="space-y-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {navigationItems.map((item) => {
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
                        ? "text-white border-2 border-cyan-500 bg-cyan-500/10"
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
                      <Icon className="h-5 w-5" />
                    </motion.div>
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        className="w-2 h-2 bg-cyan-400 rounded-full ml-auto"
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
          <motion.div whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleLogout}
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
