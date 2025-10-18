"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, Search, Loader2 } from "lucide-react"
import { useConversations, useConversationMessages, useChatWebSocket } from "@/hooks/use-chat"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import type { Message } from "@/types/chat"

export default function ChatSection() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Fetch conversations and messages
  const { data: conversationsData, isLoading: conversationsLoading } = useConversations()
  const { data: messagesData, isLoading: messagesLoading } = useConversationMessages(selectedChat)

  // WebSocket connection
  const {
    isConnected,
    sendMessage,
    sendTyping,
    markAsRead,
    typingUsers,
    onlineUsers,
  } = useChatWebSocket({
    conversationId: selectedChat,
    onNewMessage: (message: Message) => {
      // Auto-scroll to bottom when new message arrives
      scrollToBottom()
      
      // Show notification if message is from admin and not currently viewing
      if (message.senderId !== getCurrentUserId() && selectedChat === message.conversationId) {
        markAsRead(message.conversationId)
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

  const conversations = conversationsData?.data || []
  const messages = messagesData?.data || []

  // Filter conversations based on search
  const filteredConversations = conversations.filter((conv) =>
    searchQuery ? 
      (conv.client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       conv.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase()))
      : true
  )

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedChat) {
      markAsRead(selectedChat)
    }
  }, [selectedChat, markAsRead])

  // Auto-select first conversation if none selected
  useEffect(() => {
    if (!selectedChat && conversations.length > 0) {
      setSelectedChat(conversations[0].id)
    }
  }, [conversations, selectedChat])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    if (!selectedChat) {
      // For new users without conversations, send first message
      sendMessage(newMessage)
      setNewMessage("")
      
      toast({
        title: "Message Sent",
        description: "Your message has been sent to the admin.",
      })
    } else {
      // Send message to existing conversation
      sendMessage(newMessage, selectedChat)
      setNewMessage("")
    }
  }

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
    
    // Send typing indicator
    if (selectedChat) {
      sendTyping(e.target.value.length > 0, selectedChat)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getCurrentUserId = () => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('user_id') || '0')
    }
    return 0
  }

  const isOnline = (userId?: number) => {
    return onlineUsers.some(u => u.userId === userId)
  }

  // Render connection status
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
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  // New user with no conversations
  if (conversations.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Messages</h2>
            <p className="text-slate-400">Start a conversation with our team</p>
          </div>
          <ConnectionStatus />
        </div>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Send Your First Message</CardTitle>
            <CardDescription className="text-slate-400">
              We're here to help! Send us a message and we'll get back to you shortly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-3">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="flex-1 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-cyan-500 transition-colors rounded-xl py-5"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white h-11 w-11 p-0 rounded-xl shadow-lg transition-all disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const selectedConversation = conversations.find(c => c.id === selectedChat)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Messages</h2>
          <p className="text-slate-400">Communicate with our team</p>
        </div>
        <ConnectionStatus />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px] lg:h-[600px]">
        {/* Conversations List */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm lg:h-full">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-white">Conversations</CardTitle>
              {conversations.some(c => (c.unread || c.unreadCount || 0) > 0) && (
                <Badge variant="outline" className="bg-cyan-500/10 border-cyan-500/30 text-cyan-300">
                  {conversations.reduce((acc, c) => acc + (c.unread || c.unreadCount || 0), 0)} Unread
                </Badge>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px] lg:h-[500px]">
              <div className="space-y-2 p-4">
                <AnimatePresence>
                  {filteredConversations.map((conversation) => (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onClick={() => setSelectedChat(conversation.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedChat === conversation.id
                          ? "bg-cyan-500/20 text-white border border-cyan-500/30"
                          : "hover:bg-slate-700/50"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarFallback className="bg-slate-700 text-slate-300">
                              AD
                            </AvatarFallback>
                          </Avatar>
                          {isOnline(conversation.userId) && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-white truncate">
                              {conversation.client || 'Admin Support'}
                            </h4>
                            <span className="text-xs text-slate-400 flex-shrink-0 ml-2">
                              {(() => {
                                const date = new Date(conversation.time || conversation.lastMessageAt || '')
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
                            </span>
                          </div>
                          <p className="text-sm text-slate-400 break-words line-clamp-2">
                            {conversation.lastMessage || 'No messages yet'}
                          </p>
                        </div>
                        {(conversation.unread || conversation.unreadCount || 0) > 0 && (
                          <div className="w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-white">{conversation.unread || conversation.unreadCount}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm lg:h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">
                {selectedChat ? selectedConversation?.client || 'Admin Support' : "Select a conversation"}
              </CardTitle>
              {selectedConversation && isOnline(selectedConversation.userId) && (
                <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-300">
                  Online
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0 flex flex-col min-h-[400px] lg:h-[500px]">
            <ScrollArea className="flex-1 p-4">
              {messagesLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-cyan-500" />
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {messages?.map((message, index) => {
                      // Debug: Log message structure
                      if (index === 0) console.log('Message structure:', message)
                      
                      // Check if message is from client (current user)
                      // Use senderType first, fallback to checking if sender is 'admin' or role is 'admin'
                      const isAdmin = message.senderType === 'admin' || 
                                     message.sender?.role === 'admin' || 
                                     message.role === 'admin' ||
                                     message.senderName === 'Admin User'
                      const isMe = !isAdmin // If not admin, then it's the client (me)
                      const messageDate = new Date(message.time || message.timestamp || message.createdAt || '')
                      
                      console.log(`Message ${message.id}: senderType=${message.senderType}, senderName=${message.senderName}, isAdmin=${isAdmin}, isMe=${isMe}`)
                      
                      return (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`flex gap-3 max-w-[280px] sm:max-w-xs lg:max-w-md ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarFallback className={isMe ? 'bg-cyan-600 text-white' : 'bg-purple-600 text-white'}>
                                {isMe ? 'Y' : 'A'}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                              <div
                                className={`px-4 py-2.5 rounded-2xl shadow-sm ${
                                  isMe
                                    ? "bg-gradient-to-br from-cyan-600 to-cyan-700 text-white rounded-br-sm"
                                    : "bg-slate-700/90 text-slate-300 rounded-bl-sm"
                                }`}
                              >
                                <p className="text-sm leading-relaxed break-words overflow-wrap-anywhere">
                                  {message.content || message.message}
                                </p>
                              </div>
                              <div className={`flex items-center gap-2 mt-1 px-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                <span className="text-xs text-slate-500">
                                  {messageDate.toLocaleTimeString('en-US', { 
                                    hour: 'numeric', 
                                    minute: '2-digit',
                                    hour12: true 
                                  })}
                                </span>
                                {isMe && (
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
                  {typingUsers.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className="bg-purple-600 text-white">
                            A
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
                </div>
              )}
            </ScrollArea>
            <div className="p-4 border-t border-slate-700/50">
              <div className="flex space-x-3">
                <Input
                  value={newMessage}
                  onChange={handleTyping}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-cyan-500 transition-colors rounded-xl py-5"
                  disabled={!isConnected}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || !isConnected}
                  className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white h-11 w-11 p-0 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}