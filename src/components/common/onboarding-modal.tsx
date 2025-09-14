"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Upload, Plus, FileText, User, CreditCard, ClipboardList, X, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useOnboarding } from "@/hooks/use-onboarding"
import { useAuthStore } from '@/lib/stores/auth-store'

interface OnboardingModalProps {
  onComplete: () => void
  onClose: () => void
}

export default function OnboardingModal({ onComplete, onClose }: OnboardingModalProps) {
  const { data, currentStep, setCurrentStep, updateData } = useOnboarding()
  const { updateOnboardingStatus } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const steps = [
    { title: "Project Details", icon: ClipboardList },
    { title: "Requirements & Files", icon: Upload },
    { title: "Payment Plan", icon: CreditCard },
    { title: "Client Info", icon: User },
    { title: "Review & Document", icon: FileText },
    { title: "Submit", icon: CheckCircle },
  ]

  const [localStep, setLocalStep] = useState(currentStep)

  useEffect(() => {
    setLocalStep(currentStep)
  }, [currentStep])

  // Handlers
  const nextStep = () => {
    const newStep = Math.min(localStep + 1, steps.length - 1)
    setLocalStep(newStep)
    setCurrentStep(newStep)
  }

  const prevStep = () => {
    const newStep = Math.max(localStep - 1, 0)
    setLocalStep(newStep)
    setCurrentStep(newStep)
  }

  const addMilestone = () => {
    const newMilestones = [...data.milestones, { title: "", deliverable: "", deadline: "", amount: "" }]
    updateData("milestones", newMilestones)
  }

const handleSubmit = async () => {
  setIsSubmitting(true)
  setSubmitError(null)

  try {
    // Prepare the data for submission
    const formData = new FormData()

    // Add project data
    formData.append('projectTitle', data.project?.title || '')
    formData.append('projectCategory', data.project?.category || '')
    formData.append('projectDescription', data.project?.description || '')
    formData.append('projectDeadline', data.project?.deadline || '')

    // Add client data
    formData.append('clientName', data.client?.name || '')
    formData.append('clientEmail', data.client?.email || '')
    formData.append('clientCompany', data.client?.company || '')
    formData.append('clientCountry', data.client?.country || '')

    // Add requirements
    formData.append('requirementsNotes', data.requirements?.notes || '')

    // Add files if any
    if (data.requirements?.files && data.requirements.files.length > 0) {
      data.requirements.files.forEach((file: File, index: number) => {
        formData.append(`files[${index}]`, file)
      })
    }

    // Add milestones as JSON string
    formData.append('milestones', JSON.stringify(data.milestones || []))

    // Get token from localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : ""

    // Send request to backend
    const response = await fetch('http://localhost:4000/api/onboarding/onboardingdata', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}` // <-- send token for auth middleware
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to submit onboarding data')
    }

    const result = await response.json()
    console.log('Onboarding data submitted successfully:', result)

    // Update user onboarding status in auth store
    updateOnboardingStatus(true)

    // Call the onComplete callback
    onComplete()
  } catch (error) {
    console.error('Error submitting onboarding data:', error)
    setSubmitError(error instanceof Error ? error.message : 'An error occurred while submitting')
  } finally {
    setIsSubmitting(false)
  }
}



  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-card border-border p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="sr-only">Project Onboarding</DialogTitle>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-card-foreground">Project Onboarding</h1>
              <p className="text-muted-foreground">Complete your project setup in just a few simple steps</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
            </button>
          </div>
        </DialogHeader>

        <div className="p-6">
          <div className="w-full mb-8">
            <div className="flex justify-between items-center relative">
              {/* Progress Line */}
              <div className="absolute top-6 left-0 w-full h-0.5 bg-border" />
              <div
                className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-700 ease-out"
                style={{ width: `${(localStep / (steps.length - 1)) * 100}%` }}
              />

              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={index} className="relative z-10 flex flex-col items-center group">
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 border-2
                        ${
                          index === localStep
                            ? "bg-primary text-primary-foreground border-primary shadow-lg scale-110"
                            : index < localStep
                              ? "bg-green-500 text-white border-green-500 shadow-md"
                              : "bg-card text-muted-foreground border-border hover:border-muted-foreground"
                        }
                      `}
                      whileHover={{ scale: index <= localStep ? 1.1 : 1.05 }}
                    >
                      {index < localStep ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </motion.div>
                    <p
                      className={`text-xs mt-2 font-medium transition-colors duration-300 text-center max-w-16
                      ${index <= localStep ? "text-card-foreground" : "text-muted-foreground"}
                    `}
                    >
                      {step.title}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          <motion.div
            key={localStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Step Header */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-card-foreground mb-2">{steps[localStep].title}</h2>
              <div className="w-12 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
            </div>

            {/* STEP 1: Project Details */}
            {localStep === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-card-foreground">Project Title</label>
                    <input
                      type="text"
                      placeholder="Enter your project title"
                      value={data.project?.title || ""}
                      onChange={(e) => updateData("project", { ...data.project, title: e.target.value })}
                      className="w-full p-3 border border-border rounded-lg text-card-foreground placeholder-muted-foreground bg-input focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-card-foreground">Category</label>
                    <input
                      type="text"
                      placeholder="e.g., Web Development, Design"
                      value={data.project?.category || ""}
                      onChange={(e) => updateData("project", { ...data.project, category: e.target.value })}
                      className="w-full p-3 border border-border rounded-lg text-card-foreground placeholder-muted-foreground bg-input focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-card-foreground">Project Description</label>
                  <textarea
                    placeholder="Describe your project in detail..."
                    value={data.project?.description || ""}
                    onChange={(e) => updateData("project", { ...data.project, description: e.target.value })}
                    rows={3}
                    className="w-full p-3 border border-border rounded-lg text-card-foreground placeholder-muted-foreground bg-input focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-card-foreground">Project Deadline</label>
                  <input
                    type="date"
                    value={data.project?.deadline || ""}
                    onChange={(e) => updateData("project", { ...data.project, deadline: e.target.value })}
                    className="w-full p-3 border border-border rounded-lg text-card-foreground bg-input focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Requirements */}
            {localStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-card-foreground">Special Requirements</label>
                  <textarea
                    placeholder="Any specific requirements, technologies, or constraints..."
                    value={data.requirements?.notes || ""}
                    onChange={(e) => updateData("requirements", { ...data.requirements, notes: e.target.value })}
                    rows={4}
                    className="w-full p-3 border border-border rounded-lg text-card-foreground placeholder-muted-foreground bg-input focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-card-foreground">Upload Files</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors duration-200 bg-muted/50">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <input
                      type="file"
                      multiple
                      onChange={(e) =>
                        updateData("requirements", {
                          ...data.requirements,
                          files: e.target.files ? Array.from(e.target.files) : [],
                        })
                      }
                      className="w-full text-card-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                    <p className="text-sm text-muted-foreground mt-1">Drag and drop files here or click to browse</p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Payment Plan */}
            {localStep === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-muted-foreground">Define project milestones and payment schedule</p>
                </div>
                {data.milestones?.map((ms: any, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border border-border rounded-lg bg-muted/50 space-y-3"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-card-foreground">Milestone {idx + 1}</h3>
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-semibold text-xs">{idx + 1}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Milestone title"
                        value={ms.title}
                        onChange={(e) => {
                          const updated = [...data.milestones]
                          updated[idx].title = e.target.value
                          updateData("milestones", updated)
                        }}
                        className="w-full p-2 border border-border rounded-lg text-card-foreground bg-input focus:ring-2 focus:ring-ring focus:border-transparent placeholder-muted-foreground"
                      />
                      <input
                        type="text"
                        placeholder="Deliverable"
                        value={ms.deliverable}
                        onChange={(e) => {
                          const updated = [...data.milestones]
                          updated[idx].deliverable = e.target.value
                          updateData("milestones", updated)
                        }}
                        className="w-full p-2 border border-border rounded-lg text-card-foreground bg-input focus:ring-2 focus:ring-ring focus:border-transparent placeholder-muted-foreground"
                      />
                      <input
                        type="date"
                        value={ms.deadline}
                        onChange={(e) => {
                          const updated = [...data.milestones]
                          updated[idx].deadline = e.target.value
                          updateData("milestones", updated)
                        }}
                        className="w-full p-2 border border-border rounded-lg text-card-foreground bg-input focus:ring-2 focus:ring-ring focus:border-transparent"
                      />
                      <input
                        type="number"
                        placeholder="Amount ($)"
                        value={ms.amount}
                        onChange={(e) => {
                          const updated = [...data.milestones]
                          updated[idx].amount = e.target.value
                          updateData("milestones", updated)
                        }}
                        className="w-full p-2 border border-border rounded-lg text-card-foreground bg-input focus:ring-2 focus:ring-ring focus:border-transparent placeholder-muted-foreground"
                      />
                    </div>
                  </motion.div>
                ))}
                <button
                  onClick={addMilestone}
                  className="w-full p-3 border-2 border-dashed border-primary/30 rounded-lg text-primary hover:border-primary hover:bg-primary/5 transition-all duration-200 flex items-center justify-center gap-2 bg-primary/5"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Milestone
                </button>
              </div>
            )}

            {/* STEP 4: Client Info */}
            {localStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-card-foreground">Full Name</label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={data.client?.name || ""}
                      onChange={(e) => updateData("client", { ...data.client, name: e.target.value })}
                      className="w-full p-3 border border-border rounded-lg text-card-foreground placeholder-muted-foreground bg-input focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-card-foreground">Email Address</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={data.client?.email || ""}
                      onChange={(e) => updateData("client", { ...data.client, email: e.target.value })}
                      className="w-full p-3 border border-border rounded-lg text-card-foreground placeholder-muted-foreground bg-input focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-card-foreground">Company (Optional)</label>
                    <input
                      type="text"
                      placeholder="Your company name"
                      value={data.client?.company || ""}
                      onChange={(e) => updateData("client", { ...data.client, company: e.target.value })}
                      className="w-full p-3 border border-border rounded-lg text-card-foreground placeholder-muted-foreground bg-input focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-card-foreground">Country</label>
                    <input
                      type="text"
                      placeholder="Your country"
                      value={data.client?.country || ""}
                      onChange={(e) => updateData("client", { ...data.client, country: e.target.value })}
                      className="w-full p-3 border border-border rounded-lg text-card-foreground placeholder-muted-foreground bg-input focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Document Preview */}
            {localStep === 4 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <FileText className="w-12 h-12 text-primary mx-auto mb-2" />
                  <h3 className="text-lg font-bold text-card-foreground">Project Agreement Document</h3>
                  <p className="text-muted-foreground">Review your project details before submission</p>
                </div>
                <div className="border border-border rounded-lg bg-muted/50 p-6 space-y-4 text-card-foreground max-h-64 overflow-y-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-card-foreground mb-2">Project Information</h4>
                      <p>
                        <span className="font-medium">Title:</span> {data.project?.title || "Not specified"}
                      </p>
                      <p>
                        <span className="font-medium">Category:</span> {data.project?.category || "Not specified"}
                      </p>
                      <p>
                        <span className="font-medium">Deadline:</span> {data.project?.deadline || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground mb-2">Client Information</h4>
                      <p>
                        <span className="font-medium">Name:</span> {data.client?.name || "Not specified"}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span> {data.client?.email || "Not specified"}
                      </p>
                      <p>
                        <span className="font-medium">Company:</span> {data.client?.company || "Not specified"}
                      </p>
                      <p>
                        <span className="font-medium">Country:</span> {data.client?.country || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Project Description</h4>
                    <p className="text-muted-foreground bg-background p-3 rounded-lg border border-border">
                      {data.project?.description || "No description provided"}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Requirements</h4>
                    <p className="text-muted-foreground bg-background p-3 rounded-lg border border-border">
                      {data.requirements?.notes || "No special requirements"}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Payment Milestones</h4>
                    <div className="space-y-2">
                      {data.milestones?.map((ms: any, idx: number) => (
                        <div key={idx} className="bg-background p-3 rounded-lg border-l-4 border-primary">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-card-foreground">{ms.title || `Milestone ${idx + 1}`}</p>
                              <p className="text-sm text-muted-foreground">
                                {ms.deliverable || "No deliverable specified"}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-green-600">${ms.amount || "0"}</p>
                              <p className="text-sm text-muted-foreground">{ms.deadline || "No deadline"}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: Submit */}
            {localStep === 5 && (
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                >
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-card-foreground mb-2">Order Submitted Successfully!</h2>
                  <p className="text-muted-foreground">Your project has been submitted and is now being reviewed.</p>
                </div>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <p className="text-primary font-medium">What happens next?</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    You'll receive a confirmation email shortly and can track your project progress in the dashboard.
                  </p>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? 'Submitting...' : 'Go to Dashboard'}
                </button>
                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                    {submitError}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
              <div>
                {localStep > 0 && localStep < 5 && (
                  <button
                    onClick={prevStep}
                    className="px-6 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                  >
                    ← Back
                  </button>
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                Step {localStep + 1} of {steps.length}
              </div>

              <div>
                {localStep < 4 && (
                  <button
                    onClick={nextStep}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200 font-semibold"
                  >
                    Next →
                  </button>
                )}
                {localStep === 4 && (
                  <button
                    onClick={nextStep}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-all duration-200 font-semibold"
                  >
                    Submit Order →
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}