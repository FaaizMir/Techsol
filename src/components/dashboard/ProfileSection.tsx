"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  Lock,
  Camera,
  Loader2,
} from "lucide-react"
import { useProfile, useUpdateProfile, useUpdateProfilePicture, useChangePassword } from "@/hooks/use-profile"

export default function ProfileSection() {
  const { data: profileData, isLoading } = useProfile()
  const updateProfileMutation = useUpdateProfile()
  const updatePictureMutation = useUpdateProfilePicture()
  const changePasswordMutation = useChangePassword()

  const profile = (profileData as any)?.data || {}

  // Get the server base URL for images
  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return null
    // If it's already a full URL, return as is
    if (path.startsWith('http://') || path.startsWith('https://')) return path
    // Otherwise, prepend the server base URL
    const serverUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000'
    return `${serverUrl}${path.startsWith('/') ? path : `/${path}`}`
  }

  // Profile form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    company: "",
    bio: "",
    address: "",
    city: "",
    country: "",
    timezone: "",
    emailNotifications: true,
    pushNotifications: true,
  })

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        company: profile.company || "",
        bio: profile.bio || "",
        address: profile.address || "",
        city: profile.city || "",
        country: profile.country || "",
        timezone: profile.timezone || "",
        emailNotifications: profile.emailNotifications ?? true,
        pushNotifications: profile.pushNotifications ?? true,
      })
    }
  }, [profile])

  const handleUpdateProfile = async () => {
    try {
      await updateProfileMutation.mutateAsync(formData)
      alert("Profile updated successfully")
    } catch (error) {
      alert("Failed to update profile")
    }
  }

  const handleUploadPicture = async () => {
    if (!profilePicture) return

    const formData = new FormData()
    formData.append('profilePicture', profilePicture)

    try {
      await updatePictureMutation.mutateAsync(formData)
      setProfilePicture(null)
      alert("Profile picture updated successfully")
    } catch (error) {
      alert("Failed to upload profile picture")
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setShowPasswordForm(false)
      alert("Password changed successfully")
    } catch (error) {
      alert("Failed to change password")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    )
  }
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h2 className="text-2xl font-bold text-white">Profile</h2>
          <p className="text-slate-400">Manage your account settings</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={getImageUrl(profile.profilePicture)} />
              <AvatarFallback className="bg-slate-700 text-slate-300 text-2xl">
                {profile.firstName?.[0]}{profile.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
              className="bg-slate-700/50 border-slate-600/50 text-white"
            />
            <Button
              onClick={handleUploadPicture}
              disabled={!profilePicture || updatePictureMutation.isPending}
              className="w-full bg-cyan-500 hover:bg-cyan-600"
            >
              <Camera className="h-4 w-4 mr-2" />
              {updatePictureMutation.isPending ? "Uploading..." : "Upload Picture"}
            </Button>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Personal Information</CardTitle>
            <CardDescription className="text-slate-400">Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-slate-300">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-slate-300">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  value={profile.email || ""}
                  disabled
                  className="pl-10 bg-slate-700/50 border-slate-600/50 text-slate-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-300">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-10 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-slate-300">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-slate-300">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-slate-300">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="pl-10 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-slate-300">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-slate-300">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone" className="text-slate-300">Timezone</Label>
              <select
                id="timezone"
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full bg-slate-700/50 border-slate-600/50 text-white rounded-lg px-3 py-2"
              >
                <option value="">Select Timezone</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
              </select>
            </div>
            <Button
              onClick={handleUpdateProfile}
              disabled={updateProfileMutation.isPending}
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Account Settings */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription className="text-slate-400">Manage your notification settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white">Email Notifications</h4>
              <p className="text-sm text-slate-400">Receive email updates about your projects</p>
            </div>
            <Switch
              checked={formData.emailNotifications}
              onCheckedChange={(checked) => setFormData({ ...formData, emailNotifications: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white">Push Notifications</h4>
              <p className="text-sm text-slate-400">Receive push notifications in browser</p>
            </div>
            <Switch
              checked={formData.pushNotifications}
              onCheckedChange={(checked) => setFormData({ ...formData, pushNotifications: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription className="text-slate-400">Update your account password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showPasswordForm ? (
            <Button
              onClick={() => setShowPasswordForm(true)}
              variant="outline"
              className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
            >
              Change Password
            </Button>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-slate-300">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="bg-slate-700/50 border-slate-600/50 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-slate-300">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="bg-slate-700/50 border-slate-600/50 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-300">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="bg-slate-700/50 border-slate-600/50 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleChangePassword}
                  disabled={changePasswordMutation.isPending}
                  className="bg-cyan-500 hover:bg-cyan-600"
                >
                  {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
                </Button>
                <Button
                  onClick={() => {
                    setShowPasswordForm(false)
                    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
                  }}
                  variant="outline"
                  className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}