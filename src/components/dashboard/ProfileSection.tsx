"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, User, Mail, Phone, MapPin } from "lucide-react"

export default function ProfileSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Profile</h2>
          <p className="text-slate-400">Manage your account settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-slate-700 text-slate-300 text-2xl">
                TC
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50">
              Change Picture
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
                  defaultValue="TechCraft"
                  className="bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-slate-300">Last Name</Label>
                <Input
                  id="lastName"
                  defaultValue="Solutions"
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
                  defaultValue="contact@techcraft.com"
                  className="pl-10 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-300">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="phone"
                  defaultValue="+1 234 567 8900"
                  className="pl-10 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-slate-300">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="location"
                  defaultValue="New York, NY"
                  className="pl-10 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-slate-300">Bio</Label>
              <Textarea
                id="bio"
                defaultValue="Leading technology solutions provider specializing in web development, cloud services, and digital transformation."
                className="bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 min-h-[100px]"
              />
            </div>
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Account Settings */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Account Settings</CardTitle>
          <CardDescription className="text-slate-400">Manage your account preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white">Email Notifications</h4>
              <p className="text-sm text-slate-400">Receive email updates about your projects</p>
            </div>
            <Button variant="outline" className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50">
              Configure
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white">Two-Factor Authentication</h4>
              <p className="text-sm text-slate-400">Add an extra layer of security to your account</p>
            </div>
            <Button variant="outline" className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50">
              Enable
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white">Change Password</h4>
              <p className="text-sm text-slate-400">Update your account password</p>
            </div>
            <Button variant="outline" className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50">
              Change
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}