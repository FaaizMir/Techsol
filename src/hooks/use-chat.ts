import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatAPI } from '@/lib/api';

// Types
interface Conversation {
  id: number;
  client: string;
  company: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface ConversationsResponse {
  success: boolean;
  data: Conversation[];
}

interface Message {
  id: number;
  sender: 'client' | 'me';
  message: string;
  time: string;
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
  data: {
    id: number;
    sender: 'me';
    message: string;
    time: string;
  };
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
  });
};

// Get conversation messages
export const useConversationMessages = (conversationId: number) => {
  return useQuery<ConversationMessagesResponse>({
    queryKey: ['chat', 'messages', conversationId],
    queryFn: () => chatAPI.getConversationMessages(conversationId) as Promise<ConversationMessagesResponse>,
    enabled: !!conversationId,
  });
};

// Send message mutation
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<SendMessageResponse, Error, { conversationId: number; data: SendMessageData }>({
    mutationFn: ({ conversationId, data }) =>
      chatAPI.sendMessage(conversationId, data) as Promise<SendMessageResponse>,
    onSuccess: (response, { conversationId }) => {
      if (response.success) {
        // Invalidate conversations and messages
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
    mutationFn: (conversationId) => chatAPI.markAsRead(conversationId) as Promise<MarkAsReadResponse>,
    onSuccess: (response, conversationId) => {
      if (response.success) {
        // Invalidate conversations to update unread count
        queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
      }
    },
  });
};