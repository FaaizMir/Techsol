"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bell,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  X,
  Settings
} from "lucide-react"

interface Notification {
  id: number
  type: 'message' | 'deadline' | 'payment' | 'update' | 'alert'
  title: string
  message: string
  time: string
  read: boolean
  priority: 'low' | 'medium' | 'high'
  actionUrl?: string
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'message',
    title: 'New message from John Smith',
    message: 'Can we schedule a call to discuss the project requirements?',
    time: '2 hours ago',
    read: false,
    priority: 'medium'
  },
  {
    id: 2,
    type: 'deadline',
    title: 'Project deadline approaching',
    message: 'E-commerce Platform project is due in 3 days',
    time: '5 hours ago',
    read: false,
    priority: 'high'
  },
  {
    id: 3,
    type: 'payment',
    title: 'Payment received',
    message: 'Received $8,500 payment from StartupXYZ',
    time: '1 day ago',
    read: true,
    priority: 'low'
  },
  {
    id: 4,
    type: 'update',
    title: 'Project status updated',
    message: 'Mobile App Redesign moved to Review phase',
    time: '2 days ago',
    read: true,
    priority: 'medium'
  },
  {
    id: 5,
    type: 'alert',
    title: 'Document review required',
    message: 'New contract agreement needs your approval',
    time: '3 days ago',
    read: false,
    priority: 'high'
  }
]

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [showAll, setShowAll] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageSquare className="h-4 w-4" />
      case 'deadline': return <Clock className="h-4 w-4" />
      case 'payment': return <DollarSign className="h-4 w-4" />
      case 'update': return <CheckCircle className="h-4 w-4" />
      case 'alert': return <AlertTriangle className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'message': return 'text-blue-400'
      case 'deadline': return 'text-red-400'
      case 'payment': return 'text-green-400'
      case 'update': return 'text-cyan-400'
      case 'alert': return 'text-yellow-400'
      default: return 'text-slate-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30'
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30'
    }
  }

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 5)

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            {unreadCount > 0 && (
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-slate-300 hover:bg-slate-700/50"
              >
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:bg-slate-700/50"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription className="text-slate-400">
          Stay updated with your projects and clients
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="space-y-1 p-4">
            {displayedNotifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No notifications</p>
              </div>
            ) : (
              displayedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    notification.read
                      ? 'bg-slate-900/30 border-slate-700/50'
                      : 'bg-cyan-500/5 border-cyan-500/20'
                  } hover:bg-slate-700/30`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-slate-700/50 ${getNotificationColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className={`font-medium ${notification.read ? 'text-slate-300' : 'text-white'}`}>
                            {notification.title}
                          </h4>
                          <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-slate-500">{notification.time}</span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getPriorityColor(notification.priority)}`}
                            >
                              {notification.priority}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-cyan-500 rounded-full flex-shrink-0"></div>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {!notification.read && (
                        <div className="mt-3 flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="bg-cyan-500 hover:bg-cyan-600 text-white text-xs h-7"
                          >
                            Mark as read
                          </Button>
                          {notification.actionUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50 text-xs h-7"
                            >
                              View
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {notifications.length > 5 && (
          <div className="p-4 border-t border-slate-700/50">
            <Button
              variant="ghost"
              onClick={() => setShowAll(!showAll)}
              className="w-full text-slate-300 hover:bg-slate-700/50"
            >
              {showAll ? 'Show less' : `Show all ${notifications.length} notifications`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}