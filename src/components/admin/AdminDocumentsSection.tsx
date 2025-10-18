"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search, 
  Upload, 
  Trash2, 
  FileText,
  Download,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from "lucide-react"
import { 
  useAdminDocuments,
  useAdminProjects,
  useUploadDocument,
  useUpdateDocumentStatus,
  useDeleteDocument
} from "@/hooks/use-admin-dashboard"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

export default function AdminDocumentsSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")

  const { data: documents, isLoading } = useAdminDocuments()
  const { data: projects } = useAdminProjects()
  const uploadDocument = useUploadDocument()
  const updateStatus = useUpdateDocumentStatus()
  const deleteDocument = useDeleteDocument()
  const { toast } = useToast()

  const statuses = [
    { value: "draft", label: "Draft", color: "gray", icon: FileText },
    { value: "under-review", label: "Under Review", color: "yellow", icon: Clock },
    { value: "approved", label: "Approved", color: "green", icon: CheckCircle },
    { value: "signed", label: "Signed", color: "blue", icon: CheckCircle }
  ]

  const filteredDocuments = documents?.filter(doc => {
    const matchesSearch = doc.originalFilename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.project?.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter
    return matchesSearch && matchesStatus
  }) || []

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-gray-500/10 border-gray-500/30 text-gray-300",
      "under-review": "bg-yellow-500/10 border-yellow-500/30 text-yellow-300",
      approved: "bg-green-500/10 border-green-500/30 text-green-300",
      signed: "bg-blue-500/10 border-blue-500/30 text-blue-300"
    }
    return colors[status] || colors.draft
  }

  const getStatusIcon = (status: string) => {
    const statusObj = statuses.find(s => s.value === status)
    const Icon = statusObj?.icon || FileText
    return <Icon className="h-3 w-3" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !selectedProjectId) {
      toast({
        title: "Error",
        description: "Please select a file and project",
        variant: "destructive",
      })
      return
    }

    try {
      await uploadDocument.mutateAsync({
        projectId: parseInt(selectedProjectId),
        file: selectedFile
      })
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      })
      setIsUploadModalOpen(false)
      setSelectedFile(null)
      setSelectedProjectId("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async (documentId: number, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ documentId, status: newStatus })
      toast({
        title: "Success",
        description: "Document status updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (documentId: number) => {
    if (!confirm("Are you sure you want to delete this document?")) return

    try {
      await deleteDocument.mutateAsync(documentId)
      toast({
        title: "Success",
        description: "Document deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
        <div className="bg-gray-800 rounded-lg p-6 animate-pulse h-96"></div>
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-2xl">Document Management</CardTitle>
              <p className="text-slate-400 text-sm mt-1">Manage all project documents</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-cyan-500/10 border-cyan-500/30 text-cyan-300">
                {documents?.length || 0} Total Documents
              </Badge>
              <Button
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-gray-500"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] bg-slate-900/50 border-slate-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Documents Table */}
          <div className="rounded-lg border border-slate-700 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-900/50">
                <TableRow className="border-slate-700 hover:bg-slate-800/50">
                  <TableHead className="text-slate-300">Document</TableHead>
                  <TableHead className="text-slate-300">Project</TableHead>
                  <TableHead className="text-slate-300">Type</TableHead>
                  <TableHead className="text-slate-300">Size</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Uploaded</TableHead>
                  <TableHead className="text-slate-300 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((document) => (
                  <TableRow 
                    key={document.id}
                    className="border-slate-700 hover:bg-slate-800/50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-cyan-400" />
                        <div>
                          <div className="font-medium text-white">{document.originalFilename}</div>
                          <div className="text-xs text-slate-500">{document.filename}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {document.project?.title || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-slate-700/50 border-slate-600 text-slate-300">
                        {document.mimeType.split('/')[1].toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {formatFileSize(document.size)}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={document.status}
                        onValueChange={(value) => handleStatusChange(document.id, value)}
                      >
                        <SelectTrigger className={`w-[140px] border-0 ${getStatusColor(document.status)}`}>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(document.status)}
                            <SelectValue />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700">
                          {statuses.map(status => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-slate-300 text-sm">
                      {new Date(document.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(document.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400">No documents found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Document Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription className="text-slate-400">
              Upload a new document to a project
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Select Project *</label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Choose a project" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  {projects?.data?.map(project => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Select File *</label>
              <Input
                type="file"
                onChange={handleFileSelect}
                className="bg-slate-800 border-slate-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700"
              />
              {selectedFile && (
                <p className="text-sm text-slate-400">
                  Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsUploadModalOpen(false)
                setSelectedFile(null)
                setSelectedProjectId("")
              }}
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !selectedProjectId || uploadDocument.isPending}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {uploadDocument.isPending ? 'Uploading...' : 'Upload Document'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
