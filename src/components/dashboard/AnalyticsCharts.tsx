"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, Users, FolderOpen, CheckCircle } from "lucide-react"

interface AnalyticsChartsProps {
  stats: {
    activeProjects: number
    completedProjects: number
    totalClients: number
    revenue: string
    revenueChange: string
  }
}

export default function AnalyticsCharts({ stats }: AnalyticsChartsProps) {
  // Use stats from props
  const totalRevenue = parseFloat(stats.revenue.replace(/[$,]/g, ''))
  const totalProjects = stats.activeProjects + stats.completedProjects
  const currentClients = stats.totalClients

  // Mock data for charts - in a real app, this would come from additional API endpoints
  const revenueData = [
    { month: 'Jan', revenue: 12000, projects: 3 },
    { month: 'Feb', revenue: 15000, projects: 4 },
    { month: 'Mar', revenue: 18000, projects: 5 },
    { month: 'Apr', revenue: 22000, projects: 6 },
    { month: 'May', revenue: 25000, projects: 7 },
    { month: 'Jun', revenue: totalRevenue / 1000, projects: totalProjects },
  ]

  const projectStatusData = [
    { status: 'Completed', count: stats.completedProjects, color: 'bg-green-500' },
    { status: 'Active', count: stats.activeProjects, color: 'bg-blue-500' },
  ]

  const clientGrowthData = [
    { month: 'Jan', clients: Math.max(0, currentClients - 5) },
    { month: 'Feb', clients: Math.max(0, currentClients - 4) },
    { month: 'Mar', clients: Math.max(0, currentClients - 3) },
    { month: 'Apr', clients: Math.max(0, currentClients - 2) },
    { month: 'May', clients: Math.max(0, currentClients - 1) },
    { month: 'Jun', clients: currentClients },
  ]

  return (
    <div className="space-y-6">
      {/* Revenue Trend */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            Revenue Trend
          </CardTitle>
          <CardDescription className="text-slate-400">
            Monthly revenue and project completion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-400 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  +12.5% from last month
                </p>
              </div>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                On Track
              </Badge>
            </div>

            {/* Simple bar chart representation */}
            <div className="space-y-2">
              {revenueData.map((item, index) => (
                <div key={item.month} className="flex items-center gap-4">
                  <div className="w-12 text-sm text-slate-400">{item.month}</div>
                  <div className="flex-1">
                    <div className="w-full bg-slate-700/50 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(item.revenue / 30000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-right text-sm text-white">${item.revenue / 1000}k</div>
                  <div className="w-8 text-center text-xs text-slate-400">{item.projects}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Status Distribution */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-blue-400" />
            Project Status Distribution
          </CardTitle>
          <CardDescription className="text-slate-400">
            Current project breakdown by status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectStatusData.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-white">{item.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{item.count}</span>
                  <span className="text-slate-400 text-sm">
                    ({Math.round((item.count / totalProjects) * 100)}%)
                  </span>
                </div>
              </div>
            ))}

            {/* Progress bars */}
            <div className="space-y-2 mt-4">
              {projectStatusData.map((item) => (
                <div key={item.status} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{item.status}</span>
                    <span>{item.count}/{totalProjects}</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${item.color} transition-all duration-500`}
                      style={{ width: `${(item.count / totalProjects) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Growth */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-400" />
            Client Growth
          </CardTitle>
          <CardDescription className="text-slate-400">
            Client acquisition over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{currentClients}</p>
                <p className="text-sm text-purple-400 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  +2 new this month
                </p>
              </div>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                Growing
              </Badge>
            </div>

            {/* Growth visualization */}
            <div className="space-y-2">
              {clientGrowthData.map((item, index) => (
                <div key={item.month} className="flex items-center gap-4">
                  <div className="w-12 text-sm text-slate-400">{item.month}</div>
                  <div className="flex-1">
                    <div className="w-full bg-slate-700/50 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(item.clients / 35) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-8 text-center text-sm text-white">{item.clients}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Completion Rate</p>
                <p className="text-lg font-bold text-white">78%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Avg Project Value</p>
                <p className="text-lg font-bold text-white">$12.5k</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Users className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Client Satisfaction</p>
                <p className="text-lg font-bold text-white">4.8/5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}