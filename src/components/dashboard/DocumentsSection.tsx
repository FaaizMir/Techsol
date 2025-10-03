"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Upload, Search, FileText, Download, Eye, Trash2, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react"
import { useProjectDocuments, useUploadDocument, useDeleteDocument, useUpdateDocumentStatus } from "@/hooks/use-documents"
import { useAllProjects } from "@/hooks/use-onboarding"

interface Document {
  id: number
  name: string
  type: string
  size: string
  client: string
  uploadDate: string
  status: "draft" | "approved" | "Under Review" | "Signed"
}

export default function DocumentsSection() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  // Fetch projects for dropdown
  const { data: projectsData } = useAllProjects({ limit: 100 })
  const projects = (projectsData as any)?.data || []

  // Fetch documents for selected project
  const { data: documentsData, isLoading } = useProjectDocuments(selectedProject || 0)
  const documents: Document[] = (documentsData as any)?.data || []

  // Mutations
  const uploadMutation = useUploadDocument()
  const deleteMutation = useDeleteDocument()
  const updateStatusMutation = useUpdateDocumentStatus()

  const handleUpload = async () => {
    if (!uploadFile || !selectedProject) return

    const formData = new FormData()
    formData.append('file', uploadFile)

    try {
      await uploadMutation.mutateAsync({ projectId: selectedProject, formData })
      setUploadFile(null)
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    } catch (error) {
      console.error("Upload failed:", error)
    }
  }

  const handleDelete = async (documentId: number) => {
    if (!confirm("Are you sure you want to delete this document?")) return

    try {
      await deleteMutation.mutateAsync(documentId)
    } catch (error) {
      console.error("Delete failed:", error)
    }
  }

  const handleStatusUpdate = async (documentId: number, status: string) => {
    try {
      await updateStatusMutation.mutateAsync({ documentId, status })
    } catch (error) {
      console.error("Status update failed:", error)
    }
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || doc.status.toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "signed":
        return <CheckCircle className="h-4 w-4" />
      case "under review":
        return <Clock className="h-4 w-4" />
      case "draft":
        return <FileText className="h-4 w-4" />
      default:
        return <XCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "signed":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "under review":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "draft":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
      default:
        return "bg-red-500/10 text-red-400 border-red-500/20"
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-white">Documents</h2>
        <p className="text-slate-400">Manage project files and documents</p>
      </motion.div>

      {/* Project Selector */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center flex-wrap">
            <label className="text-sm font-medium text-slate-300 min-w-[120px]">Select Project:</label>
            <select
              value={selectedProject || ""}
              onChange={(e) => setSelectedProject(Number(e.target.value))}
              className="bg-slate-700 border-slate-600 text-white rounded-lg px-4 py-2 flex-1 min-w-[200px]"
            >
              <option value="">-- Choose a project --</option>
              {projects.map((project: any) => (
                <option key={project.id} value={project.id}>
                  {project.name || project.title}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Upload Section */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="flex-1">
              <Input
                type="file"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="bg-slate-700 border-slate-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-cyan-500 file:text-white hover:file:bg-cyan-600"
              />
            </div>
            <Button
              onClick={handleUpload}
              disabled={!uploadFile || !selectedProject || uploadMutation.isPending}
              className="bg-cyan-500 hover:bg-cyan-600 text-white disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploadMutation.isPending ? "Uploading..." : "Upload Document"}
            </Button>
          </div>
          {!selectedProject && (
            <p className="text-xs text-yellow-400 mt-2">Please select a project first to upload documents</p>
          )}
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-800 border-slate-700 text-white rounded-lg px-4 py-2 min-w-[140px]"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="under review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="signed">Signed</option>
        </select>
      </div>

      {/* Documents List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-slate-700 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : selectedProject ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:border-cyan-500/50 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-cyan-400" />
                        <div>
                          <CardTitle className="text-white text-sm">{doc.name}</CardTitle>
                          <CardDescription className="text-xs">{doc.size}</CardDescription>
                        </div>
                      </div>
                      <Badge className={`flex items-center gap-1 ${getStatusColor(doc.status)}`}>
                        {getStatusIcon(doc.status)}
                        {doc.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Client:</span>
                        <span className="text-white">{doc.client}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Uploaded:</span>
                        <span className="text-white">{doc.uploadDate}</span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-slate-700 border-slate-600 hover:bg-slate-600"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(doc.id)}
                          disabled={deleteMutation.isPending}
                          className="bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400"
                        >
                          {deleteMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                        </Button>
                      </div>
                      {doc.status.toLowerCase() === "draft" && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(doc.id, "Under Review")}
                          disabled={updateStatusMutation.isPending}
                          className="w-full bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/20 text-yellow-400"
                        >
                          {updateStatusMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
                          Mark for Review
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-slate-400">
              No documents found. Upload your first document.
            </div>
          )}
        </div>
      ) : (
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400">Select a project to view its documents</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}