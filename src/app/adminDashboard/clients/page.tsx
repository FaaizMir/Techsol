"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAdminUsers, useUserStats } from "@/hooks/use-admin"
import { UserDetailsModal } from "@/components/admin-dashboard/UserDetailsModal"
import { Loader2, Search, Users, UserCheck, UserX, Shield } from "lucide-react"

interface User {
  id: number
  email: string
  username?: string
  role: 'user' | 'admin'
  isOnboardingCompleted: boolean
  createdAt: string
  updatedAt: string
}

export default function ClientsPage() {
  const { data: users, isLoading, error } = useAdminUsers()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'admin'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const stats = useUserStats(users)

  // Filter and search users
  const filteredUsers = useMemo(() => {
    if (!users) return []

    let filtered = users

    // Apply status filter
    if (filterStatus === 'completed') {
      filtered = filtered.filter(user => user.isOnboardingCompleted)
    } else if (filterStatus === 'pending') {
      filtered = filtered.filter(user => !user.isOnboardingCompleted)
    } else if (filterStatus === 'admin') {
      filtered = filtered.filter(user => user.role === 'admin')
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    return filtered
  }, [users, searchTerm, filterStatus])

  // Handle user selection and modal opening
  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  const getOnboardingStatus = (isCompleted: boolean | null) => {
    if (isCompleted === null) return { label: "Not Started", color: "bg-gray-600" }
    if (isCompleted) return { label: "Completed", color: "bg-green-600" }
    return { label: "Pending", color: "bg-yellow-600" }
  }

  const getRoleColor = (role: string) => {
    return role === 'admin' ? "bg-purple-600" : "bg-blue-600"
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
          <span className="text-white">Loading users...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="bg-red-900/20 border-red-800">
          <CardContent className="p-6">
            <div className="text-center text-red-400">
              <h3 className="font-semibold mb-2">Error loading users</h3>
              <p className="text-sm">{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Users Management</h1>
            <p className="text-gray-400 mt-2">Manage user accounts and onboarding status</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <p className="text-xs text-gray-400">Registered users</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Onboarding Completed</CardTitle>
              <UserCheck className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.completedOnboarding}</div>
              <p className="text-xs text-green-400">{stats.onboardingCompletionRate}% completion rate</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Pending Onboarding</CardTitle>
              <UserX className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.pendingOnboarding}</div>
              <p className="text-xs text-yellow-400">Need to complete setup</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Admin Users</CardTitle>
              <Shield className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.adminUsers}</div>
              <p className="text-xs text-purple-400">Administrative access</p>
            </CardContent>
          </Card>
        </div>
      )}



      {/* Search and Filter */}
      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by email or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
                size="sm"
              >
                All Users
              </Button>
              <Button
                variant={filterStatus === 'completed' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('completed')}
                size="sm"
              >
                Completed
              </Button>
              <Button
                variant={filterStatus === 'pending' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('pending')}
                size="sm"
              >
                Pending
              </Button>
              <Button
                variant={filterStatus === 'admin' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('admin')}
                size="sm"
              >
                Admins
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Users ({filteredUsers.length})</CardTitle>
          <CardDescription className="text-gray-400">
            Click on any user to view detailed information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-700/50">
                <TableHead className="text-gray-300">User</TableHead>
                <TableHead className="text-gray-300">Email</TableHead>
                <TableHead className="text-gray-300">Role</TableHead>
                <TableHead className="text-gray-300">Onboarding Status</TableHead>
                <TableHead className="text-gray-300">Joined Date</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow 
                  key={user.id}
                  className="border-gray-700 hover:bg-gray-700/50 cursor-pointer transition-colors"
                  onClick={() => handleUserSelect(user)}
                >
                  <TableCell className="text-white">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-sm">
                          {user.username ? user.username[0].toUpperCase() : user.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {user.username || user.email.split('@')[0]}
                        </div>
                        <div className="text-xs text-gray-400">ID: {user.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)}>
                      {user.role.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getOnboardingStatus(user.isOnboardingCompleted).color}>
                      {getOnboardingStatus(user.isOnboardingCompleted).label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle view action
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No users found</div>
              <p className="text-gray-500 text-sm">
                {searchTerm ? 'Try adjusting your search terms' : 'No users match the current filter'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <UserDetailsModal 
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}