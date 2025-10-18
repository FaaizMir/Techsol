// Chat Types
export interface User {
  id: number;
  email: string;
  role: 'user' | 'admin';
  firstName?: string;
  lastName?: string;
}

export interface Message {
  id: number;
  conversationId: number;
  content: string;
  senderId: number;
  senderName?: string;
  sender?: 'me' | 'other' | 'admin' | User;
  timestamp: string;
  time?: string;
  message?: string;
  isRead: boolean;
  createdAt?: string;
}

export interface Conversation {
  id: number;
  userId?: number;
  client?: string;
  company?: string;
  email?: string;
  lastMessage?: string;
  time?: string;
  timestamp?: string;
  unread?: number;
  unreadCount?: number;
  online?: boolean;
  user?: User;
  lastMessageAt?: string;
}

export interface OnlineUser {
  userId: number;
  email: string;
  role: 'user' | 'admin';
}

export interface ChatStats {
  totalConversations: number;
  unreadMessages: number;
  onlineUsers: number;
}

export interface SocketError {
  code: string;
  message: string;
}

export interface MessageReceivedData extends Message {
  conversationId: number;
}

export interface NewMessageNotification {
  conversationId: number;
  clientId: number;
  clientName: string;
  message: Message;
}

export interface TypingStatusData {
  conversationId: number;
  userId: number;
  userName: string;
  isTyping: boolean;
}

export interface MessagesReadData {
  conversationId: number;
  readBy: number;
  readAt: string;
}
