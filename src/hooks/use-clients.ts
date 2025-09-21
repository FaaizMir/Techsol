import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clientsAPI } from '@/lib/api';

// Types
interface Client {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone?: string;
  projects: number;
  totalValue: string;
  lastContact: string;
  status: string;
}

interface ClientsResponse {
  success: boolean;
  data: Client[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

interface ClientDetails {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone?: string;
  company?: string;
  country: string;
  status: string;
  projects: Array<{
    id: number;
    name: string;
    status: string;
    progress: number;
    budget: number;
    totalValue: number;
  }>;
}

interface ClientDetailsResponse {
  success: boolean;
  data: ClientDetails;
}

interface CreateClientData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country: string;
  contactPerson?: string;
  status?: string;
}

interface CreateClientResponse {
  success: boolean;
  data: Client;
}

interface UpdateClientData {
  name: string;
  email: string;
  company?: string;
  country: string;
  phone?: string;
  contactPerson?: string;
  status?: string;
}

interface UpdateClientResponse {
  success: boolean;
  data: Client;
}

// Get all clients
export const useClients = (params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery<ClientsResponse>({
    queryKey: ['clients', params],
    queryFn: () => clientsAPI.getClients(params) as Promise<ClientsResponse>,
  });
};

// Get client details
export const useClientDetails = (clientId: number) => {
  return useQuery<ClientDetailsResponse>({
    queryKey: ['clients', 'details', clientId],
    queryFn: () => clientsAPI.getClientDetails(clientId) as Promise<ClientDetailsResponse>,
    enabled: !!clientId,
  });
};

// Create client mutation
export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateClientResponse, Error, CreateClientData>({
    mutationFn: (data) => clientsAPI.createClient(data) as Promise<CreateClientResponse>,
    onSuccess: (response) => {
      if (response.success) {
        // Invalidate clients list
        queryClient.invalidateQueries({ queryKey: ['clients'] });
      }
    },
  });
};

// Update client mutation
export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateClientResponse, Error, { clientId: number; data: UpdateClientData }>({
    mutationFn: ({ clientId, data }) =>
      clientsAPI.updateClient(clientId, data) as Promise<UpdateClientResponse>,
    onSuccess: (response, { clientId }) => {
      if (response.success) {
        // Invalidate clients list and specific client details
        queryClient.invalidateQueries({ queryKey: ['clients'] });
        queryClient.invalidateQueries({ queryKey: ['clients', 'details', clientId] });
      }
    },
  });
};