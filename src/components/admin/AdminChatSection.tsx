"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Search, User, MoreVertical, Loader2 } from "lucide-react"
import { useAdminConversations, useAdminMessages, useAdminChatWebSocket } from "@/hooks/use-admin-dashboard"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import type { NewMessageNotification } from "@/types/chat"

export default function AdminChatSection() {
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null)
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const notificationSound = useRef<HTMLAudioElement | null>(null)

  const { data: conversations, isLoading: conversationsLoading } = useAdminConversations()
  const { data: messages, isLoading: messagesLoading } = useAdminMessages(selectedConversationId)
  const { toast } = useToast()

  // WebSocket connection with admin-specific handlers
  const {
    isConnected,
    sendMessage,
    sendTyping,
    markAsRead,
    onlineUsers,
    typingUsers,
    getOnlineUsers,
  } = useAdminChatWebSocket({
    conversationId: selectedConversationId,
    onNewMessage: (notification: NewMessageNotification) => {
      console.log('New message notification:', notification)
      
      // Show toast notification
      toast({
        title: `New message from ${notification.clientName}`,
        description: notification.message.content,
      })
      
      // Play sound
      playNotificationSound()
      
      // Auto-scroll if viewing the conversation
      if (selectedConversationId === notification.conversationId) {
        scrollToBottom()
        markAsRead(notification.conversationId)
      }
    },
    onError: (error) => {
      toast({
        title: "Connection Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  // Initialize notification sound
  useEffect(() => {
    if (typeof window !== 'undefined') {
      notificationSound.current = new Audio('/notification.mp3')
    }
  }, [])

  const filteredConversations = conversations?.filter((conv: any) => {
    const clientName = conv.client || conv.user?.email || ''
    const agency = conv.agency || ''
    const company = conv.company || ''
    return clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
           company.toLowerCase().includes(searchQuery.toLowerCase())
  }) || []

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (selectedConversationId) {
      markAsRead(selectedConversationId)
    }
  }, [selectedConversationId, markAsRead])

  // Request online users on mount
  useEffect(() => {
    if (isConnected) {
      getOnlineUsers()
    }
  }, [isConnected, getOnlineUsers])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const playNotificationSound = () => {
    notificationSound.current?.play().catch(e => console.log('Could not play sound:', e))
  }

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversationId) return

    sendMessage(messageText, selectedConversationId)
    setMessageText("")
  }

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value)
    
    if (selectedConversationId) {
      sendTyping(e.target.value.length > 0, selectedConversationId)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const isUserOnline = (userId?: number) => {
    return onlineUsers.some(u => u.userId === userId)
  }

  const getCurrentUserId = () => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('user_id') || '0')
    }
    return 0
  }

  const getTotalUnread = () => {
    return conversations?.reduce((acc: number, conv: any) => 
      acc + (conv.unreadCount || conv.unread || 0), 0
    ) || 0
  }

  // Connection Status Component
  const ConnectionStatus = () => (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
      <span className="text-xs text-slate-400">
        {isConnected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  )

  if (conversationsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
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
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <CardTitle className="text-white text-2xl">Admin Chat</CardTitle>
                <ConnectionStatus />
              </div>
              <p className="text-slate-400 text-sm mt-1">Communicate with users</p>
            </div>
            <div className="flex items-center gap-4">
              {getTotalUnread() > 0 && (
                <Badge variant="outline" className="bg-cyan-500/10 border-cyan-500/30 text-cyan-300">
                  {getTotalUnread()} Unread
                </Badge>
              )}
              <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-300">
                {onlineUsers.filter(u => u.role === 'user').length} Online
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-12 gap-4 h-[600px]">
            {/* Conversations List */}
            <div className="col-span-4 border-r border-slate-700 pr-4 flex flex-col">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2">
                <AnimatePresence>
                  {filteredConversations.map((conversation: any) => {
                    const isTyping = typingUsers.has(conversation.id)
                    const userOnline = isUserOnline(conversation.userId)
                    const clientName = conversation.client || conversation.user?.email || 'Unknown Client'
                    const clientInitial = clientName.charAt(0).toUpperCase()
                    
                    return (
                      <motion.div
                        key={conversation.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <button
                          onClick={() => setSelectedConversationId(conversation.id)}
                          className={`w-full p-3 rounded-lg text-left transition-all ${
                            selectedConversationId === conversation.id
                              ? 'bg-cyan-500/20 border-2 border-cyan-500/50'
                              : 'bg-slate-900/50 border-2 border-transparent hover:bg-slate-800/50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-cyan-600 text-white">
                                  {clientInitial}
                                </AvatarFallback>
                              </Avatar>
                              {userOnline && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-medium text-white truncate">
                                  {clientName}
                                </p>
                                {(conversation.unreadCount || conversation.unread) > 0 && (
                                  <Badge className="bg-cyan-600 text-white text-xs ml-2">
                                    {conversation.unreadCount || conversation.unread}
                                  </Badge>
                                )}
                              </div>
                              {conversation.agency && (
                                <p className="text-xs text-slate-500 truncate">
                                  {conversation.agency}
                                </p>
                              )}
                              <p className="text-xs text-slate-400 truncate">
                                {isTyping ? (
                                  <span className="italic text-cyan-400">typing...</span>
                                ) : (
                                  conversation.lastMessage || "No messages yet"
                                )}
                              </p>
                              {(conversation.lastMessageAt || conversation.time) && (
                                <p className="text-xs text-slate-500 mt-1">
                                  {(() => {
                                    const date = new Date(conversation.lastMessageAt || conversation.time)
                                    const now = new Date()
                                    const diffMs = now.getTime() - date.getTime()
                                    const diffMins = Math.floor(diffMs / 60000)
                                    const diffHours = Math.floor(diffMs / 3600000)
                                    const diffDays = Math.floor(diffMs / 86400000)
                                    
                                    if (diffMins < 1) return 'Just now'
                                    if (diffMins < 60) return `${diffMins}m ago`
                                    if (diffHours < 24) return `${diffHours}h ago`
                                    if (diffDays < 7) return `${diffDays}d ago`
                                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                  })()}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>

                {filteredConversations.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <User className="h-12 w-12 text-slate-600 mb-2" />
                    <p className="text-slate-400">
                      {searchQuery ? 'No conversations found' : 'No conversations yet'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {searchQuery ? 'Try a different search' : 'Waiting for users to message'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="col-span-8 flex flex-col">
              {selectedConversationId ? (
                <>
                  {/* Chat Header */}
                  <div className="pb-4 border-b border-slate-700 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-cyan-600 text-white">
                            {(() => {
                              const conv = conversations?.find((c: any) => c.id === selectedConversationId)
                              const name = conv?.client || conv?.user?.email || 'U'
                              return name.charAt(0).toUpperCase()
                            })()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">
                            {(() => {
                              const conv = conversations?.find((c: any) => c.id === selectedConversationId)
                              return conv?.client || conv?.user?.email || 'Unknown User'
                            })()}
                          </p>
                          <p className="text-xs text-slate-400">
                            {(() => {
                              const conv = conversations?.find((c: any) => c.id === selectedConversationId)
                              return isUserOnline(conv?.userId)
                                ? 'Online'
                                : 'Offline'
                            })()}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-slate-400">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {messagesLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-6 w-6 animate-spin text-cyan-500" />
                      </div>
                    ) : messages && messages.length > 0 ? (
                      <>
                        <AnimatePresence>
                          {messages.map((message: any, index: number) => {
                            // Check if message is from admin (current user in admin panel)
                            // Use senderType first, then check role
                            const isAdmin = message.senderType === 'admin' || 
                                          message.sender?.role === 'admin' || 
                                          message.role === 'admin' ||
                                          message.senderName === 'Admin User'
                            const messageDate = new Date(message.createdAt || message.timestamp || message.time)
                            
                            return (
                              <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                              >
                                <div className={`flex gap-3 max-w-[70%] ${isAdmin ? 'flex-row-reverse' : 'flex-row'}`}>
                                  <Avatar className="h-8 w-8 flex-shrink-0">
                                    <AvatarFallback className={isAdmin ? 'bg-purple-600 text-white' : 'bg-cyan-600 text-white'}>
                                      {isAdmin ? 'A' : (message.sender?.email?.charAt(0).toUpperCase() || 'U')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                                    <div
                                      className={`px-4 py-2.5 rounded-2xl shadow-sm ${
                                        isAdmin
                                          ? 'bg-gradient-to-br from-cyan-600 to-cyan-700 text-white rounded-br-sm'
                                          : 'bg-slate-700/90 text-white rounded-bl-sm'
                                      }`}
                                    >
                                      <p className="text-sm leading-relaxed break-words">{message.message || message.content}</p>
                                    </div>
                                    <div className={`flex items-center gap-2 mt-1 px-1 ${isAdmin ? 'flex-row-reverse' : 'flex-row'}`}>
                                      <p className="text-xs text-slate-500">
                                        {messageDate.toLocaleTimeString('en-US', { 
                                          hour: 'numeric', 
                                          minute: '2-digit',
                                          hour12: true 
                                        })}
                                      </p>
                                      {isAdmin && (
                                        <span className="text-xs text-cyan-400">✓</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )
                          })}
                        </AnimatePresence>
                        
                        {/* Typing Indicator */}
                        {typingUsers.has(selectedConversationId) && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                          >
                            <div className="flex gap-3">
                              <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarFallback className="bg-cyan-600 text-white">
                                  U
                                </AvatarFallback>
                              </Avatar>
                              <div className="bg-slate-700/90 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        <div ref={messagesEndRef} />
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-slate-400">No messages yet</p>
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
                    <Input
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={handleTyping}
                      onKeyPress={handleKeyPress}
                      className="flex-1 bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500 transition-colors rounded-xl py-5"
                      disabled={!isConnected}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim() || !isConnected}
                      className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white h-11 w-11 p-0 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <User className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Select a conversation to start chatting</p>
                    <p className="text-xs text-slate-500 mt-2">
                      {conversations?.length || 0} total conversations
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
