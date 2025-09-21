"use client"
import { useState } from "react"
import { FileText, CheckCircle, User, Calendar, DollarSign, Upload, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { StepProps } from "../types"

export default function StepReview({ data, updateData, onNext, isSubmitting }: StepProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["project", "client", "milestones"])

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-100 mb-2">Review Your Project</h3>
        <p className="text-slate-400 text-sm">Please review all information before submitting. Click on sections to expand/collapse details.</p>
      </div>

      <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections} className="space-y-4">
        {/* Project Details */}
        <AccordionItem value="project" className="border border-slate-600 rounded-lg bg-slate-800">
          <AccordionTrigger className="px-6 py-4 hover:bg-slate-700 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-slate-100">Project Details</h4>
                <p className="text-sm text-slate-400">Basic project information and requirements</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-400">Title</label>
                  <p className="text-slate-100 bg-slate-700 p-3 rounded-lg">{data.project?.title || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-400">Category</label>
                  <p className="text-slate-100 bg-slate-700 p-3 rounded-lg">{data.project?.category || "Not provided"}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-400">Description</label>
                  <p className="text-slate-100 bg-slate-700 p-3 rounded-lg min-h-[60px]">{data.project?.description || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-400">Deadline</label>
                  <p className="text-slate-100 bg-slate-700 p-3 rounded-lg">{data.project?.deadline || "Not provided"}</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Requirements */}
        <AccordionItem value="requirements" className="border border-slate-600 rounded-lg bg-slate-800">
          <AccordionTrigger className="px-6 py-4 hover:bg-slate-700 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600/20 rounded-lg">
                <Upload className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-slate-100">Requirements & Files</h4>
                <p className="text-sm text-slate-400">Uploaded documents and project notes</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="pt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-400">Notes</label>
                <p className="text-slate-100 bg-slate-700 p-3 rounded-lg min-h-[60px]">{data.requirements?.notes || "No notes provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-400">Files ({data.requirements?.files?.length || 0})</label>
                {data.requirements?.files?.length > 0 ? (
                  <div className="space-y-2 mt-2">
                    {data.requirements.files.map((file: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <div className="flex-1">
                          <p className="text-slate-100 text-sm font-medium">{file.originalName || file.filename}</p>
                          <p className="text-slate-400 text-xs">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm italic bg-slate-700 p-3 rounded-lg">No files uploaded</p>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Payment Plan */}
        <AccordionItem value="milestones" className="border border-slate-600 rounded-lg bg-slate-800">
          <AccordionTrigger className="px-6 py-4 hover:bg-slate-700 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-600/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-slate-100">Payment Plan</h4>
                <p className="text-sm text-slate-400">Project milestones and payment schedule</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="pt-4">
              {data.milestones?.length > 0 ? (
                <div className="space-y-3">
                  {data.milestones.map((ms: any, idx: number) => (
                    <div key={idx} className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                      <div className="flex justify-between items-start mb-3">
                        <h5 className="font-medium text-slate-100">{ms.title || `Milestone ${idx + 1}`}</h5>
                        <span className="text-lg font-bold text-green-400">${ms.amount || "0"}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Deliverable:</span>
                          <p className="text-slate-100 mt-1">{ms.deliverable || "Not specified"}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Deadline:</span>
                          <p className="text-slate-100 mt-1">{ms.deadline || "Not set"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 p-3 bg-slate-700 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-100">Total Amount:</span>
                      <span className="text-xl font-bold text-green-400">
                        ${data.milestones.reduce((sum: number, ms: any) => sum + (parseFloat(ms.amount) || 0), 0)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 text-sm italic bg-slate-700 p-4 rounded-lg">No milestones defined</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Client Info */}
        <AccordionItem value="client" className="border border-slate-600 rounded-lg bg-slate-800">
          <AccordionTrigger className="px-6 py-4 hover:bg-slate-700 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <User className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-slate-100">Client Information</h4>
                <p className="text-sm text-slate-400">Contact details and company information</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-400">Name</label>
                  <p className="text-slate-100 bg-slate-700 p-3 rounded-lg">{data.client?.name || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-400">Email</label>
                  <p className="text-slate-100 bg-slate-700 p-3 rounded-lg">{data.client?.email || "Not provided"}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-400">Company</label>
                  <p className="text-slate-100 bg-slate-700 p-3 rounded-lg">{data.client?.company || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-400">Country</label>
                  <p className="text-slate-100 bg-slate-700 p-3 rounded-lg">{data.client?.country || "Not provided"}</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="text-center pt-4">
        <Button
          onClick={onNext}
          disabled={isSubmitting}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Submit Project
            </>
          )}
        </Button>
      </div>
    </div>
  )
}