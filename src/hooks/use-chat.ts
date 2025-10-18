import { useState, useEffect, useCallback, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatAPI } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import type { Socket } from 'socket.io-client';
import type {
  Message,
  Conversation,
  OnlineUser,
  MessageReceivedData,
  NewMessageNotification,
  TypingStatusData,
  MessagesReadData,
  SocketError,
} from '@/types/chat';

// Types for React Query
interface ConversationsResponse {
  success: boolean;
  data: Conversation[];
}

interface ConversationMessagesResponse {
  success: boolean;
  data: Message[];
}

interface SendMessageData {
  message: string;
}

interface SendMessageResponse {
  success: boolean;
  data: Message;
}

interface MarkAsReadResponse {
  success: boolean;
  message: string;
}

// Get all conversations
export const useConversations = () => {
  return useQuery<ConversationsResponse>({
    queryKey: ['chat', 'conversations'],
    queryFn: () => chatAPI.getConversations() as Promise<ConversationsResponse>,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

// Get conversation messages
export const useConversationMessages = (conversationId: number | null) => {
  return useQuery<ConversationMessagesResponse>({
    queryKey: ['chat', 'messages', conversationId],
    queryFn: () => chatAPI.getConversationMessages(conversationId!) as Promise<ConversationMessagesResponse>,
    enabled: !!conversationId,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
};

// Send message mutation
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<SendMessageResponse, Error, { conversationId: number; data: SendMessageData }>({
    mutationFn: ({ conversationId, data }: { conversationId: number; data: SendMessageData }) =>
      chatAPI.sendMessage(conversationId, data) as Promise<SendMessageResponse>,
    onSuccess: (response: SendMessageResponse, { conversationId }: { conversationId: number }) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
        queryClient.invalidateQueries({ queryKey: ['chat', 'messages', conversationId] });
      }
    },
  });
};

// Mark messages as read mutation
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<MarkAsReadResponse, Error, number>({
    mutationFn: (conversationId: number) => chatAPI.markAsRead(conversationId) as Promise<MarkAsReadResponse>,
    onSuccess: (response: MarkAsReadResponse, conversationId: number) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
      }
    },
  });
};

// Real-time WebSocket Chat Hook
interface UseChatWebSocketOptions {
  conversationId?: number | null;
  onNewMessage?: (message: Message) => void;
  onTyping?: (data: TypingStatusData) => void;
  onError?: (error: SocketError) => void;
  autoConnect?: boolean;
}

export const useChatWebSocket = (options: UseChatWebSocketOptions = {}) => {
  const {
    conversationId,
    onNewMessage,
    onTyping,
    onError,
    autoConnect = true,
  } = options;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  
  const typingTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const queryClient = useQueryClient();
  
  // Use refs for callbacks to prevent re-creating socket listeners
  const onNewMessageRef = useRef(onNewMessage);
  const onTypingRef = useRef(onTyping);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onNewMessageRef.current = onNewMessage;
    onTypingRef.current = onTyping;
    onErrorRef.current = onError;
  }, [onNewMessage, onTyping, onError]);

  // Initialize socket connection - ONLY ONCE
  useEffect(() => {
    if (!autoConnect) return;

    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('token') || localStorage.getItem('jwt_token')
      : null;

    if (!token) {
      console.warn('No authentication token found for chat');
      return;
    }

    const socketInstance = getSocket(token);
    setSocket(socketInstance);

    // Connection handlers
    const handleConnect = () => {
      console.log('✅ Chat connected');
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log('🔴 Chat disconnected');
      setIsConnected(false);
    };

    const handleConnectError = (error: Error) => {
      console.error('Connection error:', error);
      setIsConnected(false);
      onErrorRef.current?.({ code: 'CONNECTION_ERROR', message: error.message });
    };

    const handleMessageReceived = (data: MessageReceivedData) => {
      console.log('Message sent successfully:', data);
      
      if (data.conversationId && !conversationId) {
        localStorage.setItem('current_conversation_id', data.conversationId.toString());
      }

      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages', data.conversationId] });
      
      onNewMessageRef.current?.(data);
    };

    const handleChatMessage = (data: Message) => {
      console.log('📨 New message received:', data);
      
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages', data.conversationId] });
      
      onNewMessageRef.current?.(data);
    };

    const handleTypingStatus = (data: TypingStatusData) => {
      console.log('Typing status:', data);
      setIsTyping(data.isTyping);
      
      if (data.isTyping) {
        setTypingUsers(prev => {
          if (!prev.includes(data.userName)) {
            return [...prev, data.userName];
          }
          return prev;
        });
      } else {
        setTypingUsers(prev => prev.filter(name => name !== data.userName));
      }
      
      onTypingRef.current?.(data);
    };

    const handleOnlineUsers = (users: OnlineUser[]) => {
      console.log('Online users:', users.length);
      setOnlineUsers(users);
    };

    const handleUserOnline = (user: OnlineUser) => {
      console.log('User came online:', user.email);
      setOnlineUsers(prev => [...prev, user]);
    };

    const handleUserOffline = (user: OnlineUser) => {
      console.log('User went offline:', user.email);
      setOnlineUsers(prev => prev.filter(u => u.userId !== user.userId));
    };

    const handleMessagesRead = (data: MessagesReadData) => {
      console.log('Messages read:', data);
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages', data.conversationId] });
    };

    const handleMessagesMarkedRead = (data: { count: number; conversationId: number }) => {
      console.log(`${data.count} messages marked as read`);
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
    };

    const handleError = (error: SocketError) => {
      console.error('Socket error:', error);
      onErrorRef.current?.(error);
    };

    // Attach listeners
    socketInstance.on('connect', handleConnect);
    socketInstance.on('disconnect', handleDisconnect);
    socketInstance.on('connect_error', handleConnectError);
    socketInstance.on('messageReceived', handleMessageReceived);
    socketInstance.on('chatMessage', handleChatMessage);
    socketInstance.on('typingStatus', handleTypingStatus);
    socketInstance.on('onlineUsers', handleOnlineUsers);
    socketInstance.on('userOnline', handleUserOnline);
    socketInstance.on('userOffline', handleUserOffline);
    socketInstance.on('messagesRead', handleMessagesRead);
    socketInstance.on('messagesMarkedRead', handleMessagesMarkedRead);
    socketInstance.on('error', handleError);

    // Update connection state
    setIsConnected(socketInstance.connected);

    return () => {
      socketInstance.off('connect', handleConnect);
      socketInstance.off('disconnect', handleDisconnect);
      socketInstance.off('connect_error', handleConnectError);
      socketInstance.off('messageReceived', handleMessageReceived);
      socketInstance.off('chatMessage', handleChatMessage);
      socketInstance.off('typingStatus', handleTypingStatus);
      socketInstance.off('onlineUsers', handleOnlineUsers);
      socketInstance.off('userOnline', handleUserOnline);
      socketInstance.off('userOffline', handleUserOffline);
      socketInstance.off('messagesRead', handleMessagesRead);
      socketInstance.off('messagesMarkedRead', handleMessagesMarkedRead);
      socketInstance.off('error', handleError);
    };
  }, [autoConnect, queryClient]); // Remove callbacks from dependencies

  // Join conversation room when conversationId changes
  useEffect(() => {
    if (socket && conversationId) {
      socket.emit('joinConversation', { conversationId });
      console.log('Joined conversation:', conversationId);

      return () => {
        socket.emit('leaveConversation', { conversationId });
        console.log('Left conversation:', conversationId);
      };
    }
  }, [socket, conversationId]);

  // Send message via WebSocket
  const sendMessage = useCallback((message: string, convId?: number) => {
    if (!socket || !message.trim()) return;

    const payload: { message: string; conversationId?: number } = {
      message: message.trim(),
    };

    // Include conversationId if provided or if we have one
    if (convId || conversationId) {
      payload.conversationId = convId || conversationId!;
    }

    socket.emit('chatMessage', payload);
    console.log('Sending message:', payload);
  }, [socket, conversationId]);

  // Send typing indicator
  const sendTyping = useCallback((isTypingNow: boolean, convId?: number) => {
    if (!socket) return;

    const targetConvId = convId || conversationId;
    if (!targetConvId) return;

    clearTimeout(typingTimerRef.current);

    socket.emit('typing', {
      conversationId: targetConvId,
      isTyping: isTypingNow,
    });

    // Auto-stop typing after 2 seconds
    if (isTypingNow) {
      typingTimerRef.current = setTimeout(() => {
        socket.emit('typing', {
          conversationId: targetConvId,
          isTyping: false,
        });
      }, 2000);
    }
  }, [socket, conversationId]);

  // Mark messages as read
  const markAsRead = useCallback((convId?: number) => {
    if (!socket) return;

    const targetConvId = convId || conversationId;
    if (!targetConvId) return;

    socket.emit('markAsRead', { conversationId: targetConvId });
    console.log('Marking messages as read:', targetConvId);
  }, [socket, conversationId]);

  // Request online users
  const getOnlineUsers = useCallback(() => {
    if (!socket) return;
    socket.emit('getOnlineUsers');
  }, [socket]);

  return {
    socket,
    isConnected,
    onlineUsers,
    isTyping,
    typingUsers,
    sendMessage,
    sendTyping,
    markAsRead,
    getOnlineUsers,
  };
};