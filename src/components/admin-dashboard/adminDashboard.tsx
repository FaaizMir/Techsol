"use client"

import { useState } from "react"
import Sidebar from "./admin-sidebar"
import ConversationsList from "./conversations-list"
import ChatInterface from "./chat-interface"

// Mock data for conversations
export const conversations = [
  {
    id: 1,
    name: "John Smith",
    company: "TechCorp Inc.",
    avatar: "/professional-man.png",
    lastMessage: "Can we schedule a call to discuss...",
    timestamp: "2 hours ago",
    unreadCount: 3,
    isOnline: true,
    messages: [
      {
        id: 1,
        content: "Hi! How's the project coming along?",
        timestamp: "10:30 AM",
        isUser: false,
      },
      {
        id: 2,
        content: "Great progress! We're 65% complete.",
        timestamp: "10:32 AM",
        isUser: true,
      },
      {
        id: 3,
        content: "Can we schedule a call to discuss the project requirements?",
        timestamp: "10:35 AM",
        isUser: false,
      },
    ],
  },
  {
    id: 2,
    name: "Sarah Johnson",
    company: "StartupXYZ",
    avatar: "/professional-woman-diverse.png",
    lastMessage: "The latest mockups look great! Whe...",
    timestamp: "5 hours ago",
    unreadCount: 0,
    isOnline: false,
    messages: [
      {
        id: 1,
        content: "The latest mockups look great! When can we proceed to development?",
        timestamp: "2:15 PM",
        isUser: false,
      },
      {
        id: 2,
        content: "Thank you! We can start development next week.",
        timestamp: "2:18 PM",
        isUser: true,
      },
    ],
  },
  {
    id: 3,
    name: "Mike Wilson",
    company: "Enterprise Ltd.",
    avatar: "/confident-businessman.png",
    lastMessage: "I've uploaded the brand assets to th...",
    timestamp: "1 day ago",
    unreadCount: 0,
    isOnline: true,
    messages: [
      {
        id: 1,
        content: "I've uploaded the brand assets to the shared folder.",
        timestamp: "Yesterday",
        isUser: false,
      },
      {
        id: 2,
        content: "Perfect! I'll review them and get back to you.",
        timestamp: "Yesterday",
        isUser: true,
      },
    ],
  },
]

export default function AdminDashboard() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])

  return (
    <div className="flex h-screen bg-background dark">
      <Sidebar />
      <div className="flex-1 flex">
        <ConversationsList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
        />
       <ChatInterface
  conversation={selectedConversation}
  currentUserId={123}
  token="your-jwt-token"
/>

      </div>
    </div>
  )
}
