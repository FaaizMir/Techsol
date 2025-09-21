"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface Conversation {
  id: number
  name: string
  company: string
  avatar: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  isOnline: boolean
  messages: Array<{
    id: number
    content: string
    timestamp: string
    isUser: boolean
  }>
}

interface ConversationsListProps {
  conversations: Conversation[]
  selectedConversation: Conversation
  onSelectConversation: (conversation: Conversation) => void
}

export default function ConversationsList({
  conversations,
  selectedConversation,
  onSelectConversation,
}: ConversationsListProps) {
  return (
    <div className="w-96 border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Messages</h2>

        <div className="bg-card rounded-lg p-4">
          <h3 className="text-lg font-medium text-card-foreground mb-3">Conversations</h3>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search conversations..." className="pl-10 bg-background border-input" />
          </div>
        </div>
      </div>

      {/* Conversations */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation)}
              className={cn(
                "flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                selectedConversation.id === conversation.id && "bg-accent text-accent-foreground",
              )}
            >
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {conversation.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {conversation.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground truncate">{conversation.name}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                    {conversation.unreadCount > 0 && (
                      <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{conversation.company}</p>
                <p className="text-sm text-muted-foreground truncate mt-1">{conversation.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
