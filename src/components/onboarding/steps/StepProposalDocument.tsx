"use client"
import { useState } from "react"
import { FileText, Download, Eye, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StepProps } from "../types"
import { useAuthStore } from "@/lib/stores/auth-store"

export default function StepProposalDocument({ data, updateData, onNext, isSubmitting }: StepProps) {
  const { user } = useAuthStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const [documentGenerated, setDocumentGenerated] = useState(false)
  const [documentUrl, setDocumentUrl] = useState<string | null>(null)

  const generateProposalDocument = async () => {
    if (!user || !data.project) return

    setIsGenerating(true)
    try {
      // Create a comprehensive document with all project data
      const documentData = {
        projectId: data.project.id,
        userId: user.id,
        clientId: data.client?.id,
        documentContent: {
          project: data.project,
          client: data.client,
          milestones: data.milestones || [],
          requirements: data.requirements || [],
          generatedAt: new Date().toISOString(),
          user: {
            email: user.email,
            username: user.username
          }
        }
      }

      // TODO: Replace with new admin API when available
      console.warn('Admin API for proposal documents not implemented yet')
      
      // For now, simulate document generation
      setTimeout(() => {
        setDocumentGenerated(true)
        updateData('proposalDocument', {
          id: Date.now(),
          projectId: data.project?.id,
          userId: user.id,
          content: JSON.stringify(documentData),
          createdAt: new Date().toISOString()
        })
        setIsGenerating(false)
      }, 2000)
      return
    } catch (error) {
      console.error('Error generating proposal document:', error)
      alert('Failed to generate proposal document. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const viewDocument = () => {
    if (documentUrl) {
      window.open(documentUrl, '_blank')
    }
  }

  const downloadDocument = () => {
    if (documentUrl) {
      const link = document.createElement('a')
      link.href = documentUrl
      link.download = `Proposal-${data.project?.title || 'Document'}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-400" />
          Proposal Document
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-100 mb-2">
            Generate Your Project Proposal
          </h3>
          <p className="text-slate-400 text-sm">
            This will create a comprehensive document containing all your project details,
            client information, milestones, and requirements.
          </p>
        </div>

        {/* Document Preview */}
        <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-6">
          <h4 className="text-slate-100 font-medium mb-4">Document Contents:</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Project Title:</span>
              <span className="text-slate-100">{data.project?.title || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Category:</span>
              <span className="text-slate-100">{data.project?.category || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Client:</span>
              <span className="text-slate-100">{data.client?.name || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Milestones:</span>
              <span className="text-slate-100">{data.milestones?.length || 0} items</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Requirements:</span>
              <span className="text-slate-100">{data.requirements ? 'Included' : 'Not provided'}</span>
            </div>
          </div>
        </div>

        {/* Document Actions */}
        {!documentGenerated ? (
          <div className="text-center">
            <Button
              onClick={generateProposalDocument}
              disabled={isGenerating || !data.project}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Generating Document...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Proposal Document
                </>
              )}
            </Button>
            {!data.project && (
              <p className="text-red-400 text-sm mt-2">
                Please complete project details first
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Document Generated Successfully!</span>
            </div>

            <div className="flex gap-3 justify-center">
              <Button
                onClick={viewDocument}
                variant="outline"
                className="border-slate-600 text-slate-100 hover:bg-slate-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Document
              </Button>
              <Button
                onClick={downloadDocument}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        )}

        {/* Continue Button */}
        {documentGenerated && (
          <div className="pt-4 border-t border-slate-600">
            <Button
              onClick={onNext}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                'Continue to Final Submission'
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}