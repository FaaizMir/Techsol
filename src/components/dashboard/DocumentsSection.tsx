"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Upload, Search, FileText, Download, Eye, Trash2 } from "lucide-react"

interface DocumentsSectionProps {
  documents: any[]
}

export default function DocumentsSection({ documents }: DocumentsSectionProps) {

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Documents</h2>
          <p className="text-slate-400">Manage your project documents</p>
        </div>
        <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search documents..."
            className="pl-10 bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-400"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {documents.map((document) => (
          <Card key={document.id} className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <FileText className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-white">{document.name}</h3>
                    <p className="text-sm text-slate-400">
                      {document.type} • {document.size} • Uploaded {document.uploaded}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <Badge
                    variant="outline"
                    className={
                      document.status === "Final"
                        ? "bg-green-500/20 text-green-300 border-green-500/30"
                        : document.status === "Draft"
                          ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                          : "bg-purple-500/20 text-purple-300 border-purple-500/30"
                    }
                  >
                    {document.status}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="text-slate-300 hover:bg-slate-700/50">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-slate-300 hover:bg-slate-700/50">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}