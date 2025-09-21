import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '@/lib/api';

// Types
interface DashboardStats {
  success: boolean;
  data: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalSpent: string;
  };
}

interface RecentProject {
  id: number;
  name: string;
  description: string;
  status: string;
  progress: number;
  budget?: string;
  dueDate?: string;
}

interface RecentProjectsResponse {
  success: boolean;
  data: RecentProject[];
}

interface RecentMessage {
  id: number;
  sender: string;
  role: string;
  lastMessage: string;
  time: string;
  unread: number;
}

interface RecentMessagesResponse {
  success: boolean;
  data: RecentMessage[];
}

// Get dashboard statistics
export const useDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardAPI.getStats() as Promise<DashboardStats>,
  });
};

// Get recent projects
export const useRecentProjects = (limit?: number) => {
  return useQuery<RecentProjectsResponse>({
    queryKey: ['dashboard', 'recentProjects', limit],
    queryFn: () => dashboardAPI.getRecentProjects(limit) as Promise<RecentProjectsResponse>,
  });
};

// Get recent messages
export const useRecentMessages = (limit?: number) => {
  return useQuery<RecentMessagesResponse>({
    queryKey: ['dashboard', 'recentMessages', limit],
    queryFn: () => dashboardAPI.getRecentMessages(limit) as Promise<RecentMessagesResponse>,
  });
};