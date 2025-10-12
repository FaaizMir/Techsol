"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "Admin User",
    email: "admin@example.com",
    phone: "+1 (555) 123-4567",
    company: "Tech Solutions",
    position: "Administrator",
    bio: "Experienced administrator with a passion for technology and innovation. Specializing in project management and team coordination.",
    address: "123 Tech Street, Silicon Valley, CA 94000"
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // Here you would typically save to backend
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset form data or reload from backend
    setIsEditing(false)
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
        <p className="text-gray-400 mt-2">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Profile Overview</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Avatar className="w-32 h-32 mx-auto mb-4">
                <AvatarImage src="/placeholder-user.jpg" alt="Admin User" />
                <AvatarFallback className="text-2xl">AU</AvatarFallback>
              </Avatar>
              
              <h3 className="text-xl font-semibold text-white mb-2">{formData.name}</h3>
              <p className="text-gray-400 mb-2">{formData.position}</p>
              <Badge className="bg-blue-600 mb-4">Administrator</Badge>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Member since:</span>
                  <span className="text-white">Jan 2023</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last login:</span>
                  <span className="text-white">Today</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <Badge className="bg-green-600">Active</Badge>
                </div>
              </div>

              <Button className="w-full mt-4" variant="outline">
                Change Avatar
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-gray-800 border-gray-700 mt-6">
            <CardHeader>
              <CardTitle className="text-white">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Projects Managed</span>
                  <span className="text-2xl font-bold text-white">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Active Clients</span>
                  <span className="text-2xl font-bold text-white">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Messages Sent</span>
                  <span className="text-2xl font-bold text-white">1,247</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Personal Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Update your personal details and contact information
                </CardDescription>
              </div>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave}>Save</Button>
                  <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    className="bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className="bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position" className="text-gray-300">Position</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    disabled={!isEditing}
                    className="bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-gray-300">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  disabled={!isEditing}
                  className="bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-300">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!isEditing}
                  className="bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-gray-300">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                  className="bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-gray-800 border-gray-700 mt-6">
            <CardHeader>
              <CardTitle className="text-white">Security Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your account security and password
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">Password</h4>
                  <p className="text-gray-400 text-sm">Last changed 2 months ago</p>
                </div>
                <Button variant="outline">Change Password</Button>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                  <p className="text-gray-400 text-sm">Add an extra layer of security</p>
                </div>
                <Button variant="outline">Setup 2FA</Button>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">Login Sessions</h4>
                  <p className="text-gray-400 text-sm">Manage your active sessions</p>
                </div>
                <Button variant="outline">View Sessions</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}