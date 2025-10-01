"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Search } from "lucide-react"

interface ChatSectionProps {
  chatConversations: any[]
  selectedChat: number | null
  setSelectedChat: (id: number | null) => void
  newMessage: string
  setNewMessage: (message: string) => void
  onSendMessage: () => void
}

export default function ChatSection({ chatConversations, selectedChat, setSelectedChat, newMessage, setNewMessage, onSendMessage }: ChatSectionProps) {
  const selectedConversation = chatConversations.find(c => c.id === selectedChat)
  const messages = selectedConversation?.messages || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Messages</h2>
          <p className="text-slate-400">Communicate with our team</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px] lg:h-[600px]">
        {/* Conversations List */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm lg:h-full">
          <CardHeader>
            <CardTitle className="text-white">Conversations</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search conversations..."
                className="pl-10 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px] lg:h-[500px]">
              <div className="space-y-2 p-4">
                {chatConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedChat(conversation.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedChat === conversation.id
                        ? "bg-cyan-500/20 text-white border border-cyan-500/30"
                        : "hover:bg-slate-700/50"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarFallback className="bg-slate-700 text-slate-300">
                          {conversation.sender
                            .split(" ")
                            .map((n:any) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-white truncate">{conversation.sender}</h4>
                          <span className="text-xs text-slate-400 flex-shrink-0 ml-2">{conversation.time}</span>
                        </div>
                        <p className="text-sm text-slate-400 break-words line-clamp-2">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unread > 0 && (
                        <div className="w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-white">{conversation.unread}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm lg:h-full">
          <CardHeader>
            <CardTitle className="text-white">
              {selectedChat ? chatConversations.find(c => c.id === selectedChat)?.sender : "Select a conversation"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex flex-col min-h-[400px] lg:h-[500px]">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages?.map((message:any) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[280px] sm:max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === "me"
                          ? "bg-cyan-500 text-white"
                          : "bg-slate-700/50 text-slate-300"
                      }`}
                    >
                      <p className="text-sm break-words overflow-wrap-anywhere">{message.message}</p>
                      <span className={`text-xs ${message.sender === "me" ? "text-cyan-100" : "text-slate-400"}`}>
                        {message.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-slate-700/50">
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
                  onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
                />
                <Button
                  onClick={onSendMessage}
                  className="bg-cyan-500 hover:bg-cyan-600 flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}