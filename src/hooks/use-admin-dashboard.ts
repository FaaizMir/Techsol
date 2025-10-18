"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  adminDashboardAPI,
  adminUserAPI,
  adminProjectAPI,
  adminMilestoneAPI,
  adminRequirementAPI,
  adminClientAPI,
  adminChatAPI,
  adminDocumentAPI,
  type User,
  type Project,
  type Client,
  type Milestone,
  type Requirement,
} from '@/lib/api/admin-api'

// Dashboard Hooks
export const useAdminDashboardStats = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: async () => {
      const response = await adminDashboardAPI.getStats()
      return response.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}

export const useAdminProjectAnalytics = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'analytics'],
    queryFn: async () => {
      const response = await adminDashboardAPI.getProjectAnalytics()
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// User Management Hooks
export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const response = await adminUserAPI.getAll()
      return response
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export const useAdminUser = (id: number | null) => {
  return useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: async () => {
      if (!id) return null
      const response = await adminUserAPI.getById(id)
      return response.data
    },
    enabled: !!id,
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) =>
      adminUserAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => adminUserAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

// Project Management Hooks
export const useAdminProjects = () => {
  return useQuery({
    queryKey: ['admin', 'projects'],
    queryFn: async () => {
      const response = await adminProjectAPI.getAll()
      return response  // Return full response object with success, count, data
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export const useAdminProject = (id: number | null) => {
  return useQuery({
    queryKey: ['admin', 'projects', id],
    queryFn: async () => {
      if (!id) return null
      const response = await adminProjectAPI.getById(id)
      return response.data
    },
    enabled: !!id,
  })
}

export const useCreateProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Parameters<typeof adminProjectAPI.create>[0]) =>
      adminProjectAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
    },
  })
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Project> }) =>
      adminProjectAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
    },
  })
}

export const useUpdateProjectStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      adminProjectAPI.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
    },
  })
}

export const useBulkUpdateProjects = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectIds, status }: { projectIds: number[]; status: string }) =>
      adminProjectAPI.bulkUpdate(projectIds, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
    },
  })
}

export const useSearchProjects = (params: Parameters<typeof adminProjectAPI.search>[0]) => {
  return useQuery({
    queryKey: ['admin', 'projects', 'search', params],
    queryFn: async () => {
      const response = await adminProjectAPI.search(params)
      return response.data
    },
    enabled: Object.keys(params).length > 0,
  })
}

export const useDeleteProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => adminProjectAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
    },
  })
}

// Milestone Management Hooks
export const useAdminMilestones = () => {
  return useQuery({
    queryKey: ['admin', 'milestones'],
    queryFn: async () => {
      const response = await adminMilestoneAPI.getAll()
      return response.data
    },
  })
}

export const useCreateMilestone = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: Parameters<typeof adminMilestoneAPI.create>[1] }) =>
      adminMilestoneAPI.create(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'milestones'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] })
    },
  })
}

export const useUpdateMilestone = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Milestone> }) =>
      adminMilestoneAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'milestones'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] })
    },
  })
}

export const useDeleteMilestone = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => adminMilestoneAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'milestones'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] })
    },
  })
}

// Requirement Management Hooks
export const useAdminRequirements = () => {
  return useQuery({
    queryKey: ['admin', 'requirements'],
    queryFn: async () => {
      const response = await adminRequirementAPI.getAll()
      return response.data
    },
  })
}

export const useCreateRequirement = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: Parameters<typeof adminRequirementAPI.create>[1] }) =>
      adminRequirementAPI.create(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'requirements'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] })
    },
  })
}

export const useUpdateRequirement = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof adminRequirementAPI.update>[1] }) =>
      adminRequirementAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'requirements'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] })
    },
  })
}

export const useDeleteRequirement = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => adminRequirementAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'requirements'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] })
    },
  })
}

// Client Management Hooks
export const useAdminClients = () => {
  return useQuery({
    queryKey: ['admin', 'clients'],
    queryFn: async () => {
      const response = await adminClientAPI.getAll()
      return response.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useCreateClient = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Parameters<typeof adminClientAPI.create>[0]) =>
      adminClientAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'clients'] })
    },
  })
}

export const useUpdateClient = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Client> }) =>
      adminClientAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'clients'] })
    },
  })
}

export const useDeleteClient = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => adminClientAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'clients'] })
    },
  })
}

// Chat/Communication Hooks
export const useAdminConversations = () => {
  return useQuery({
    queryKey: ['admin', 'conversations'],
    queryFn: async () => {
      const response = await adminChatAPI.getConversations()
      return response.data
    },
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  })
}

export const useAdminMessages = (conversationId: number | null) => {
  return useQuery({
    queryKey: ['admin', 'conversations', conversationId, 'messages'],
    queryFn: async () => {
      if (!conversationId) return []
      const response = await adminChatAPI.getMessages(conversationId)
      return response.data
    },
    enabled: !!conversationId,
    refetchInterval: 10 * 1000, // Refetch every 10 seconds
  })
}

export const useSendMessage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ conversationId, message }: { conversationId: number; message: string }) =>
      adminChatAPI.sendMessage(conversationId, message),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'conversations', variables.conversationId, 'messages'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'conversations'] })
    },
  })
}

// WebSocket Admin Chat Hook
import { useState, useEffect, useCallback, useRef } from 'react'
import { getSocket } from '@/lib/socket'
import type { Socket } from 'socket.io-client'
import type { Message, OnlineUser, NewMessageNotification, TypingStatusData, SocketError } from '@/types/chat'

interface UseAdminChatWebSocketOptions {
  conversationId?: number | null
  onNewMessage?: (notification: NewMessageNotification) => void
  onTyping?: (data: TypingStatusData) => void
  onError?: (error: SocketError) => void
  autoConnect?: boolean
}

export const useAdminChatWebSocket = (options: UseAdminChatWebSocketOptions = {}) => {
  const {
    conversationId,
    onNewMessage,
    onTyping,
    onError,
    autoConnect = true,
  } = options

  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const [typingUsers, setTypingUsers] = useState<Map<number, string>>(new Map())
  
  const typingTimerRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const queryClient = useQueryClient()

  // Use refs for callbacks to prevent re-creating socket listeners
  const onNewMessageRef = useRef(onNewMessage)
  const onTypingRef = useRef(onTyping)
  const onErrorRef = useRef(onError)

  useEffect(() => {
    onNewMessageRef.current = onNewMessage
    onTypingRef.current = onTyping
    onErrorRef.current = onError
  }, [onNewMessage, onTyping, onError])

  // Initialize socket connection - ONLY ONCE
  useEffect(() => {
    if (!autoConnect) return

    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('jwt_token') || localStorage.getItem('token')
      : null

    if (!token) {
      console.warn('No authentication token found')
      return
    }

    const socketInstance = getSocket(token)
    setSocket(socketInstance)

    // Connection handlers
    const handleConnect = () => {
      console.log('✅ Admin chat connected')
      setIsConnected(true)
    }

    const handleDisconnect = () => {
      console.log('🔴 Admin chat disconnected')
      setIsConnected(false)
    }

    const handleConnectError = (error: Error) => {
      console.error('Admin connection error:', error)
      setIsConnected(false)
      onErrorRef.current?.({ code: 'CONNECTION_ERROR', message: error.message })
    }

    const handleNewMessage = (data: NewMessageNotification) => {
      console.log('🔔 NEW MESSAGE from client:', data.clientName)
      
      queryClient.invalidateQueries({ queryKey: ['admin', 'conversations'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'conversations', data.conversationId, 'messages'] })
      
      onNewMessageRef.current?.(data)
      
      // Show browser notification
      if (typeof window !== 'undefined' && Notification.permission === 'granted') {
        new Notification(`New message from ${data.clientName}`, {
          body: data.message.content,
          icon: '/favicon.ico',
        })
      }
    }

    const handleMessageReceived = (data: Message) => {
      console.log('Message sent successfully:', data)
      
      queryClient.invalidateQueries({ queryKey: ['admin', 'conversations'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'conversations', data.conversationId, 'messages'] })
    }

    const handleChatMessage = (data: Message) => {
      console.log('📨 Message received:', data)
      
      queryClient.invalidateQueries({ queryKey: ['admin', 'conversations'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'conversations', data.conversationId, 'messages'] })
    }

    const handleTypingStatus = (data: TypingStatusData) => {
      console.log('Typing status:', data)
      
      setTypingUsers(prev => {
        const newMap = new Map(prev)
        if (data.isTyping) {
          newMap.set(data.conversationId, data.userName)
        } else {
          newMap.delete(data.conversationId)
        }
        return newMap
      })
      
      onTypingRef.current?.(data)
    }

    const handleOnlineUsers = (users: OnlineUser[]) => {
      console.log('Online users:', users.length)
      setOnlineUsers(users)
    }

    const handleUserOnline = (user: OnlineUser) => {
      console.log('User came online:', user.email)
      setOnlineUsers(prev => [...prev, user])
    }

    const handleUserOffline = (user: OnlineUser) => {
      console.log('User went offline:', user.email)
      setOnlineUsers(prev => prev.filter(u => u.userId !== user.userId))
    }

    const handleError = (error: SocketError) => {
      console.error('Socket error:', error)
      onErrorRef.current?.(error)
    }

    // Attach listeners
    socketInstance.on('connect', handleConnect)
    socketInstance.on('disconnect', handleDisconnect)
    socketInstance.on('connect_error', handleConnectError)
    socketInstance.on('newMessage', handleNewMessage)
    socketInstance.on('messageReceived', handleMessageReceived)
    socketInstance.on('chatMessage', handleChatMessage)
    socketInstance.on('typingStatus', handleTypingStatus)
    socketInstance.on('onlineUsers', handleOnlineUsers)
    socketInstance.on('userOnline', handleUserOnline)
    socketInstance.on('userOffline', handleUserOffline)
    socketInstance.on('error', handleError)

    // Update connection state
    setIsConnected(socketInstance.connected)

    // Request notification permission
    if (typeof window !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    return () => {
      socketInstance.off('connect', handleConnect)
      socketInstance.off('disconnect', handleDisconnect)
      socketInstance.off('connect_error', handleConnectError)
      socketInstance.off('newMessage', handleNewMessage)
      socketInstance.off('messageReceived', handleMessageReceived)
      socketInstance.off('chatMessage', handleChatMessage)
      socketInstance.off('typingStatus', handleTypingStatus)
      socketInstance.off('onlineUsers', handleOnlineUsers)
      socketInstance.off('userOnline', handleUserOnline)
      socketInstance.off('userOffline', handleUserOffline)
      socketInstance.off('error', handleError)
    }
  }, [autoConnect, queryClient]) // Remove callbacks from dependencies

  // Join conversation room when conversationId changes
  useEffect(() => {
    if (socket && conversationId) {
      socket.emit('joinConversation', { conversationId })
      console.log('Admin joined conversation:', conversationId)

      return () => {
        socket.emit('leaveConversation', { conversationId })
        console.log('Admin left conversation:', conversationId)
      }
    }
  }, [socket, conversationId])

  // Send message via WebSocket
  const sendMessage = useCallback((message: string, convId: number) => {
    if (!socket || !message.trim() || !convId) return

    socket.emit('chatMessage', {
      conversationId: convId,
      message: message.trim(),
    })
    console.log('Sending message:', { convId, message })
  }, [socket])

  // Send typing indicator
  const sendTyping = useCallback((isTypingNow: boolean, convId: number) => {
    if (!socket || !convId) return

    clearTimeout(typingTimerRef.current)

    socket.emit('typing', {
      conversationId: convId,
      isTyping: isTypingNow,
    })

    // Auto-stop typing after 2 seconds
    if (isTypingNow) {
      typingTimerRef.current = setTimeout(() => {
        socket.emit('typing', {
          conversationId: convId,
          isTyping: false,
        })
      }, 2000)
    }
  }, [socket])

  // Mark messages as read
  const markAsRead = useCallback((convId: number) => {
    if (!socket || !convId) return

    socket.emit('markAsRead', { conversationId: convId })
    console.log('Marking messages as read:', convId)
  }, [socket])

  // Request online users
  const getOnlineUsers = useCallback(() => {
    if (!socket) return
    socket.emit('getOnlineUsers')
  }, [socket])

  return {
    socket,
    isConnected,
    onlineUsers,
    typingUsers,
    sendMessage,
    sendTyping,
    markAsRead,
    getOnlineUsers,
  }
}

// Document Management Hooks
export const useAdminDocuments = () => {
  return useQuery({
    queryKey: ['admin', 'documents'],
    queryFn: async () => {
      const response = await adminDocumentAPI.getAll()
      return response.data
    },
  })
}

export const useUploadDocument = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, file }: { projectId: number; file: File }) =>
      adminDocumentAPI.upload(projectId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'documents'] })
    },
  })
}

export const useUpdateDocumentStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ documentId, status }: { documentId: number; status: string }) =>
      adminDocumentAPI.updateStatus(documentId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'documents'] })
    },
  })
}

export const useDeleteDocument = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (documentId: number) => adminDocumentAPI.delete(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'documents'] })
    },
  })
}
