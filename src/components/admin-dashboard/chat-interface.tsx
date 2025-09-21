"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MoreVertical, Send, Paperclip, Smile } from "lucide-react"
import { cn } from "@/lib/utils"
import { getSocket } from "@/lib/socket"

interface Message {
  id: string
  content: string
  timestamp: string
  isUser: boolean
}

interface Conversation {
  id: number
  name: string
  company: string
  avatar: string
}

interface ChatInterfaceProps {
  conversation: Conversation
  currentUserId: number
  token: string // ✅ add token as prop
}

export default function ChatInterface({
  conversation,
  currentUserId,
  token,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    const socket = getSocket(token) // ✅ pass token here

    socket.on("chatMessage", (msg: any) => {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          content: msg.content,
          timestamp: new Date().toLocaleTimeString(),
          isUser: msg.senderId === currentUserId,
        },
      ])
    })

    return () => {
      socket.off("chatMessage")
    }
  }, [currentUserId, token])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const socket = getSocket(token) // ✅ again, use token
    socket.emit("chatMessage", {
      to: conversation.id,
      content: newMessage,
    })

    setNewMessage("")
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
            <AvatarFallback>
              {conversation.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{conversation.name}</h3>
            <p className="text-sm text-muted-foreground">{conversation.company}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={cn("flex", message.isUser ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                  message.isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={cn(
                    "text-xs mt-1",
                    message.isUser ? "text-primary-foreground/70" : "text-muted-foreground/70",
                  )}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t flex items-center space-x-2">
        <Button variant="ghost" size="icon">
          <Paperclip className="h-4 w-4" />
        </Button>
        <div className="flex-1 relative">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="pr-10"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage()
            }}
          />
          <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2">
            <Smile className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={handleSendMessage} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
