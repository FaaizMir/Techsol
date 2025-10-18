"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  FolderOpen,
  Building2,
  DollarSign,
  FileText,
  MessageSquare,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import { useAdminDashboardStats } from "@/hooks/use-admin-dashboard"
import { motion } from "framer-motion"

export default function AdminDashboardOverview() {
  const { data: stats, isLoading: statsLoading } = useAdminDashboardStats()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-6 animate-pulse h-32"></div>
          ))}
        </div>
      </div>
    )
  }

  const statsCards = [
    {
      title: "Total Users",
      value: stats?.users.total || 0,
      subtitle: `${stats?.users.onboarded || 0} onboarded`,
      icon: Users,
      color: "cyan",
      trend: null
    },
    {
      title: "Active Projects",
      value: stats?.projects.active || 0,
      subtitle: `${stats?.projects.total || 0} total`,
      icon: FolderOpen,
      color: "blue",
      trend: null
    },
    {
      title: "Total Clients",
      value: stats?.clients.total || 0,
      subtitle: `${stats?.clients.active || 0} active`,
      icon: Building2,
      color: "purple",
      trend: null
    },
    {
      title: "Total Revenue",
      value: `$${(parseFloat(stats?.finance.totalRevenue || '0')).toLocaleString()}`,
      subtitle: `${stats?.finance.completedMilestones || 0} milestones completed`,
      icon: DollarSign,
      color: "green",
      trend: null
    },
    {
      title: "Documents",
      value: stats?.documents.total || 0,
      subtitle: `${stats?.documents.pending || 0} pending approval`,
      icon: FileText,
      color: "yellow",
      trend: null
    },
    {
      title: "Conversations",
      value: stats?.chat.totalConversations || 0,
      subtitle: `${stats?.chat.unreadMessages || 0} unread messages`,
      icon: MessageSquare,
      color: "pink",
      trend: null
    },
    {
      title: "Completed Projects",
      value: stats?.projects.completed || 0,
      subtitle: "Successfully delivered",
      icon: CheckCircle,
      color: "emerald",
      trend: null
    },
    {
      title: "Pending Milestones",
      value: stats?.finance.pendingMilestones || 0,
      subtitle: `${stats?.finance.overdueMilestones || 0} overdue`,
      icon: Clock,
      color: "orange",
      trend: null
    },
    {
      title: "Pending Users",
      value: stats?.users.pending || 0,
      subtitle: "Awaiting onboarding",
      icon: Users,
      color: "amber",
      trend: null
    },
    {
      title: "Cancelled Projects",
      value: stats?.projects.cancelled || 0,
      subtitle: "Terminated projects",
      icon: XCircle,
      color: "red",
      trend: null
    },
    {
      title: "Recent Activity",
      value: stats?.users.recent || 0,
      subtitle: "New users this month",
      icon: Activity,
      color: "indigo",
      trend: null
    },
    {
      title: "Approved Documents",
      value: stats?.documents.approved || 0,
      subtitle: "Verified documents",
      icon: CheckCircle,
      color: "teal",
      trend: null
    },
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, { icon: string; bg: string; border: string }> = {
      cyan: { icon: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
      blue: { icon: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
      purple: { icon: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
      green: { icon: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
      yellow: { icon: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
      pink: { icon: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
      emerald: { icon: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
      orange: { icon: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
      amber: { icon: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
      red: { icon: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
      indigo: { icon: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
      teal: { icon: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20" },
    }
    return colors[color] || colors.cyan
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h2>
                <p className="text-slate-300">
                  Complete overview of your platform metrics and activities
                </p>
              </div>
              <Activity className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          const colorClasses = getColorClasses(stat.color)
          
          return (
            <motion.div key={index} variants={itemVariants}>
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:border-slate-600/50 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-200">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${colorClasses.bg}`}>
                    <Icon className={`h-4 w-4 ${colorClasses.icon}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{stat.subtitle}</p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Trends and Analytics Section */}
      {stats && (
        <motion.div variants={itemVariants}>
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-cyan-400" />
                Trends & Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-200">Monthly Projects</h4>
                    <Badge variant="outline" className="bg-cyan-500/10 border-cyan-500/30 text-cyan-300">
                      {stats.trends.monthlyProjects.reduce((sum, item) => sum + item.count, 0)} total
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {stats.trends.monthlyProjects.map((item) => (
                      <div key={item.month} className="flex items-center justify-between py-2 px-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-white">{item.month}</span>
                          <span className="text-xs text-slate-400">Projects created</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-cyan-400">{item.count}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-200">Monthly Users</h4>
                    <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-300">
                      {stats.trends.monthlyUsers.reduce((sum, item) => sum + item.count, 0)} total
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {stats.trends.monthlyUsers.map((item) => (
                      <div key={item.month} className="flex items-center justify-between py-2 px-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-white">{item.month}</span>
                          <span className="text-xs text-slate-400">New registrations</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-400">{item.count}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-200">Project Status</h4>
                    <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30 text-purple-300">
                      {stats.trends.projectsByStatus.reduce((sum, item) => sum + item.count, 0)} total
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {stats.trends.projectsByStatus.map((item) => (
                      <div key={item.status} className="flex items-center justify-between py-2 px-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-white capitalize">{item.status}</span>
                          <span className="text-xs text-slate-400">Status</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-purple-400">{item.count}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Top Clients Section */}
      {stats?.clients.topClients && stats.clients.topClients.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Top Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.clients.topClients.map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-white">{client.name}</p>
                      <p className="text-xs text-slate-400">{client.company}</p>
                    </div>
                    <Badge variant="outline" className="bg-slate-700/50 border-slate-600 text-white">
                      {client.projectCount} projects
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
