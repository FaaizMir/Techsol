import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { documentsAPI } from '@/lib/api';

// Types
interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  client: string;
  uploadDate: string;
  status: string;
}

interface ProjectDocumentsResponse {
  success: boolean;
  data: Document[];
}

interface UploadDocumentResponse {
  success: boolean;
  data: {
    id: number;
    name: string;
    type: string;
    size: string;
    uploadDate: string;
    status: string;
  };
}

interface UpdateDocumentStatusResponse {
  success: boolean;
  data: {
    id: number;
    status: string;
    approvedAt: string;
  };
}

interface DeleteDocumentResponse {
  success: boolean;
  message: string;
}

// Get project documents
export const useProjectDocuments = (projectId: number) => {
  return useQuery<ProjectDocumentsResponse>({
    queryKey: ['documents', 'project', projectId],
    queryFn: () => documentsAPI.getProjectDocuments(projectId) as Promise<ProjectDocumentsResponse>,
    enabled: !!projectId,
  });
};

// Upload document mutation
export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation<UploadDocumentResponse, Error, { projectId: number; formData: FormData }>({
    mutationFn: ({ projectId, formData }) =>
      documentsAPI.uploadDocument(projectId, formData) as Promise<UploadDocumentResponse>,
    onSuccess: (response, { projectId }) => {
      if (response.success) {
        // Invalidate project documents
        queryClient.invalidateQueries({ queryKey: ['documents', 'project', projectId] });
      }
    },
  });
};

// Download document (this returns a blob, so we handle it differently)
export const useDownloadDocument = () => {
  return useMutation<Blob, Error, number>({
    mutationFn: (documentId) => documentsAPI.downloadDocument(documentId) as Promise<Blob>,
  });
};

// Update document status mutation
export const useUpdateDocumentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateDocumentStatusResponse, Error, { documentId: number; status: string }>({
    mutationFn: ({ documentId, status }) =>
      documentsAPI.updateDocumentStatus(documentId, { status }) as Promise<UpdateDocumentStatusResponse>,
    onSuccess: (response, { documentId }) => {
      if (response.success) {
        // Invalidate all document queries (we don't know which project this document belongs to)
        queryClient.invalidateQueries({ queryKey: ['documents'] });
      }
    },
  });
};

// Delete document mutation
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteDocumentResponse, Error, number>({
    mutationFn: (documentId) => documentsAPI.deleteDocument(documentId) as Promise<DeleteDocumentResponse>,
    onSuccess: (response, documentId) => {
      if (response.success) {
        // Invalidate all document queries
        queryClient.invalidateQueries({ queryKey: ['documents'] });
      }
    },
  });
};