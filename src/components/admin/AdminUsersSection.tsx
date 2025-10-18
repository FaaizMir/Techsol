"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Edit, Trash2, UserPlus, Mail, Phone, Building, MapPin, User as UserIcon } from "lucide-react"
import { useAdminUsers, useUpdateUser, useDeleteUser } from "@/hooks/use-admin-dashboard"
import { motion } from "framer-motion"
import type { User } from "@/lib/api/admin-api"
import { useToast } from "@/hooks/use-toast"

export default function AdminUsersSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState<Partial<User>>({})

  const { data: usersResponse, isLoading } = useAdminUsers()
  const users = usersResponse?.data || []
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()
  const { toast } = useToast()

  const filteredUsers = usersResponse?.data?.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const handleEdit = (user: User) => {

    console.log("Editing user:", user)
    setSelectedUser(user)
    setEditForm(user)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedUser) return

    try {
      await updateUser.mutateAsync({
        id: selectedUser.id,
        data: editForm
      })
      toast({
        title: "Success",
        description: "User updated successfully",
      })
      setIsEditModalOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      await deleteUser.mutateAsync(userId)
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
        <div className="bg-gray-800 rounded-lg p-6 animate-pulse h-96"></div>
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-2xl">User Management</CardTitle>
              <p className="text-slate-400 text-sm mt-1">Manage all users in the system</p>
            </div>
            <Badge variant="outline" className="bg-cyan-500/10 border-cyan-500/30 text-cyan-300">
              {usersResponse?.count || 0} Total Users
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by email or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="rounded-lg border border-slate-700 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-900/50">
                <TableRow className="border-slate-700 hover:bg-slate-800/50">
                  <TableHead className="text-slate-300">User</TableHead>
                  <TableHead className="text-slate-300">Contact</TableHead>
                  <TableHead className="text-slate-300">Company</TableHead>
                  <TableHead className="text-slate-300">Location</TableHead>
                  <TableHead className="text-slate-300">Role</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Notifications</TableHead>
                  <TableHead className="text-slate-300 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow 
                    key={user.id}
                    className="border-slate-700 hover:bg-slate-800/50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt="Profile"
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center">
                            <UserIcon className="h-4 w-4 text-slate-300" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-white">
                            {user.firstName && user.lastName
                              ? `${user.firstName} ${user.lastName}`
                              : user.email.split('@')[0]}
                          </div>
                          <div className="text-sm text-slate-400 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {user.phone ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-sm">No phone</span>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {user.company ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Building className="h-3 w-3" />
                          {user.company}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {user.city || user.country ? (
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          {[user.city, user.country].filter(Boolean).join(', ')}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.role === 'admin'
                            ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                            : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.isOnboardingCompleted
                            ? 'bg-green-500/10 border-green-500/30 text-green-300'
                            : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
                        }
                      >
                        {user.isOnboardingCompleted ? 'Active' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Badge
                          variant="outline"
                          className={
                            user.emailNotifications
                              ? 'bg-blue-500/10 border-blue-500/30 text-blue-300 text-xs'
                              : 'bg-gray-500/10 border-gray-500/30 text-gray-400 text-xs'
                          }
                        >
                          Email
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            user.pushNotifications
                              ? 'bg-purple-500/10 border-purple-500/30 text-purple-300 text-xs'
                              : 'bg-gray-500/10 border-gray-500/30 text-gray-400 text-xs'
                          }
                        >
                          Push
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(user)}
                          className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400">No users found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent 
          className="bg-slate-900 border-slate-700 text-white max-w-5xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <DialogHeader className="pb-6">
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Edit className="h-6 w-6 text-cyan-400" />
              </div>
              Edit User Profile
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-base">
              Update user information, permissions, and preferences
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8 py-2">
            {/* Personal Information Card */}
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <UserIcon className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Personal Information</h3>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300 font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    value={editForm.email || ''}
                    disabled
                    className="bg-slate-700/50 border-slate-600 text-slate-400 cursor-not-allowed h-11"
                  />
                  <p className="text-xs text-slate-500">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-300 font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white h-11 focus:border-cyan-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-slate-300 font-medium">First Name</Label>
                  <Input
                    id="firstName"
                    value={editForm.firstName || ''}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white h-11 focus:border-cyan-500"
                    placeholder="Enter first name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-slate-300 font-medium">Last Name</Label>
                  <Input
                    id="lastName"
                    value={editForm.lastName || ''}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white h-11 focus:border-cyan-500"
                    placeholder="Enter last name"
                  />
                </div>
              </div>
            </div>

            {/* Company & Location Card */}
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Building className="h-5 w-5 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Company & Location</h3>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-slate-300 font-medium flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Company
                  </Label>
                  <Input
                    id="company"
                    value={editForm.company || ''}
                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white h-11 focus:border-cyan-500"
                    placeholder="Company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-slate-300 font-medium">Timezone</Label>
                  <Input
                    id="timezone"
                    value={editForm.timezone || 'UTC'}
                    onChange={(e) => setEditForm({ ...editForm, timezone: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white h-11 focus:border-cyan-500"
                    placeholder="UTC"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-slate-300 font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    City
                  </Label>
                  <Input
                    id="city"
                    value={editForm.city || ''}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white h-11 focus:border-cyan-500"
                    placeholder="City name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="text-slate-300 font-medium">Country</Label>
                  <Input
                    id="country"
                    value={editForm.country || ''}
                    onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white h-11 focus:border-cyan-500"
                    placeholder="Country name"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Label htmlFor="address" className="text-slate-300 font-medium">Full Address</Label>
                <Input
                  id="address"
                  value={editForm.address || ''}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white h-11 focus:border-cyan-500"
                  placeholder="Complete address including street, building, etc."
                />
              </div>
            </div>

            {/* Profile & Bio Card */}
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <UserIcon className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Profile & Bio</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="profilePicture" className="text-slate-300 font-medium">Profile Picture URL</Label>
                  <Input
                    id="profilePicture"
                    value={editForm.profilePicture || ''}
                    onChange={(e) => setEditForm({ ...editForm, profilePicture: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white h-11 focus:border-cyan-500"
                    placeholder="https://example.com/profile-picture.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-slate-300 font-medium">Bio</Label>
                  <Input
                    id="bio"
                    value={editForm.bio || ''}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white h-11 focus:border-cyan-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>

            {/* Permissions & Settings Card */}
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Edit className="h-5 w-5 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Permissions & Settings</h3>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-slate-300 font-medium">User Role</Label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors">
                        <input
                          type="radio"
                          name="role"
                          value="user"
                          checked={editForm.role === 'user'}
                          onChange={(e) => setEditForm({ ...editForm, role: e.target.value as 'user' | 'admin' })}
                          className="text-cyan-600 focus:ring-cyan-600"
                        />
                        <div>
                          <span className="text-slate-300 font-medium">Regular User</span>
                          <p className="text-xs text-slate-500">Standard user permissions</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors">
                        <input
                          type="radio"
                          name="role"
                          value="admin"
                          checked={editForm.role === 'admin'}
                          onChange={(e) => setEditForm({ ...editForm, role: e.target.value as 'user' | 'admin' })}
                          className="text-cyan-600 focus:ring-cyan-600"
                        />
                        <div>
                          <span className="text-slate-300 font-medium">Administrator</span>
                          <p className="text-xs text-slate-500">Full system access</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-slate-300 font-medium">Account Status</Label>
                    <label className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors">
                      <input
                        type="checkbox"
                        id="isOnboardingCompleted"
                        checked={editForm.isOnboardingCompleted ?? false}
                        onChange={(e) => setEditForm({ ...editForm, isOnboardingCompleted: e.target.checked })}
                        className="rounded border-slate-600 bg-slate-800 text-cyan-600 focus:ring-cyan-600"
                      />
                      <div>
                        <span className="text-slate-300 font-medium">Onboarding Completed</span>
                        <p className="text-xs text-slate-500">User has finished setup process</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-slate-300 font-medium">Notification Preferences</Label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors">
                        <input
                          type="checkbox"
                          id="emailNotifications"
                          checked={editForm.emailNotifications ?? true}
                          onChange={(e) => setEditForm({ ...editForm, emailNotifications: e.target.checked })}
                          className="rounded border-slate-600 bg-slate-800 text-cyan-600 focus:ring-cyan-600"
                        />
                        <div>
                          <span className="text-slate-300 font-medium">Email Notifications</span>
                          <p className="text-xs text-slate-500">Receive updates via email</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors">
                        <input
                          type="checkbox"
                          id="pushNotifications"
                          checked={editForm.pushNotifications ?? true}
                          onChange={(e) => setEditForm({ ...editForm, pushNotifications: e.target.checked })}
                          className="rounded border-slate-600 bg-slate-800 text-cyan-600 focus:ring-cyan-600"
                        />
                        <div>
                          <span className="text-slate-300 font-medium">Push Notifications</span>
                          <p className="text-xs text-slate-500">Receive push notifications</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-6 border-t border-slate-700/50">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="border-slate-600 bg-slate-800 text-white px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={updateUser.isPending}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-8"
            >
              {updateUser.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
