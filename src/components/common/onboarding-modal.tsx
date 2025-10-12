"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Upload, FileText, User, CreditCard, ClipboardList, X, Loader2, Sparkles, Info } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useOnboarding } from "@/hooks/use-onboarding"
import { useAuthStore } from '@/lib/stores/auth-store'
import { validateProjectDetails, validateClientInfo, validatePaymentPlan } from "@/lib/validation/onboardingSchemas"

import StepProjectDetails from "@/components/onboarding/steps/StepProjectDetails"
import StepRequirements from "@/components/onboarding/steps/StepRequirements"
import StepPaymentPlan from "@/components/onboarding/steps/StepPaymentPlan"
import StepClientInfo from "@/components/onboarding/steps/StepClientInfo"
import StepReview from "@/components/onboarding/steps/StepReview"


interface OnboardingModalProps {
  onComplete: () => void
  onClose: () => void
  open?: boolean
}

export default function OnboardingModal({ onComplete, onClose, open = true }: OnboardingModalProps) {

  const {
    data,
    currentStep,
    setCurrentStep,
    updateData,
    showModal,
    setShowModal,
    isLoading,
    projectId,
    error,
    isResuming,
    startOnboarding,
    saveProjectDetails,
    saveRequirements,
    saveMilestones,
    saveClientInfo,
    reviewData,
    completeOnboardingProcess,
    progressData,
    handleStepChange,
    isStepValid,
    onboardingData
  } = useOnboarding()
  const { updateOnboardingStatus } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const steps = [
    { title: "Project Details", icon: ClipboardList, component: StepProjectDetails, dataKey: "project", description: "Basic info", guidance: "Tell us about your project. Choose a category that best fits your needs and set a realistic deadline." },
    { title: "Requirements & Files", icon: Upload, component: StepRequirements, dataKey: "requirements", description: "Upload docs", guidance: "Upload any documents, specifications, or reference materials. You can add notes to provide additional context." },
    { title: "Payment Plan", icon: CreditCard, component: StepPaymentPlan, dataKey: "milestones", description: "Set milestones", guidance: "Break your project into milestones with deadlines and amounts. This helps track progress and payments." },
    { title: "Client Info", icon: User, component: StepClientInfo, dataKey: "client", description: "Contact details", guidance: "Provide client contact information for seamless communication and project delivery." },
    { title: "Review & Submit", icon: FileText, component: StepReview, dataKey: null, description: "Final check", guidance: "Review all your information before submitting. You can go back to edit any section." },
  ]

  const [localStep, setLocalStep] = useState(currentStep)

  // Debug: Log data to see what's happening
  useEffect(() => {
    console.log('OnboardingModal - data:', data)
    console.log('OnboardingModal - localStep:', localStep)
  }, [data, localStep])

  useEffect(() => {
    setLocalStep(currentStep)
  }, [currentStep])

  // Load review data when entering review step
  useEffect(() => {
    if (localStep === 4 && projectId) {
      reviewData().catch(err => console.error("Failed to load review data:", err))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStep, projectId]) // Removed reviewData from deps to prevent infinite loop

  // Cleanup when modal closes
  useEffect(() => {
    if (!open) {
      // Reset local state when modal closes
      setIsSubmitting(false)
      setSubmitError(null)
      setValidationErrors({})
    }
  }, [open])

// Reset onboarding store on modal mount so every user sees a fresh modal.
// This prevents state left by a previous user from appearing for the next user.
// But don't reset if we're resuming existing onboarding.
useEffect(() => {
  if (typeof window === "undefined") return
  if (isResuming) return // Don't reset if resuming

  // For new users or completed onboarding, reset to empty state
  const emptyProject = { title: "", description: "", category: "", deadline: "" }
  const emptyRequirements = { notes: "", files: [] as File[] }
  const emptyMilestones: any[] = []
  const emptyClient = { name: "", email: "", company: "", country: "" }

  updateData("project", emptyProject)
  updateData("requirements", emptyRequirements)
  updateData("milestones", emptyMilestones)
  updateData("client", emptyClient)
  setCurrentStep(0)
  setLocalStep(0)
  // run only on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isResuming])

  // Handlers
  // Replaces the simple nextStep with an async handler that persists the current step via API,
  // then advances the step on success.
  const handleNext = async () => {
    setSubmitError(null)
    setIsSubmitting(true)
    try {
      // Review step (4) is now the last step - no need to advance
      if (localStep === 4) {
        return // Stay on review step
      }

      // Check if this step was already completed (resuming user going back and forward)
      const isStepAlreadyCompleted = localStep < currentStep

      if (isStepAlreadyCompleted) {
        // Just advance to the next step without API call
        const nextStep = Math.min(localStep + 1, steps.length - 1)
        setCurrentStep(nextStep)
        setLocalStep(nextStep)
        if (projectId) {
          await handleStepChange(nextStep)
        }
      } else {
        // Call the relevant API for the current step
        if (localStep === 0) {
          // Project details
          await saveProjectDetails(data.project)
        } else if (localStep === 1) {
          // Requirements + files
          await saveRequirements(data.requirements)
        } else if (localStep === 2) {
          // Milestones
          await saveMilestones(data.milestones)
        } else if (localStep === 3) {
          // Client info
          await saveClientInfo(data.client)
          // Generate/refresh the document preview for review step
          await reviewData()
        }
      }

    } catch (err: any) {
      setSubmitError(err?.message || "Failed to save step. Please try again.")
      console.error("Step save error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const prevStep = async () => {
    const newStep = Math.max(localStep - 1, 0)
    setLocalStep(newStep)
    setCurrentStep(newStep)
    if (projectId) {
      try {
        await handleStepChange(newStep)
      } catch (err) {
        console.error("Failed to update step:", err)
      }
    }
  }

  const handleComplete = async () => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await completeOnboardingProcess()

      // Update user onboarding status in auth store
      updateOnboardingStatus(true)

      // Show success message
      setIsSubmitted(true)

      // Call the onComplete callback
      onComplete()

      // Auto-close after 5 seconds
      setTimeout(() => {
        onClose() // Call onClose to ensure proper cleanup
      }, 5000)

    } catch (error) {
      console.error('Error completing onboarding:', error)
      setSubmitError(error instanceof Error ? error.message : 'An error occurred while completing onboarding')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStepNext = async () => {
    setValidationErrors({})
    // Frontend validation before API calls
    if (!isStepValid(localStep)) {
      setValidationErrors({ general: "Please complete all required fields." })
      return
    }

    // Review step (4) is the last step - complete onboarding
    if (localStep === 4) {
      await handleComplete()
    } else {
      await handleNext()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose} modal={true}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden bg-slate-800 border-slate-700 p-0 flex flex-col" style={{ scrollbarWidth: 'none' }}>
        <style>{`
          ::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {/* Show loading if data is not initialized */}
        {!data ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-200 font-medium">Initializing onboarding...</p>
            </div>
          </div>
        ) : (
          <>
        <DialogHeader className="p-3 pb-1 flex-shrink-0">
          <DialogTitle className="sr-only">Project Onboarding</DialogTitle>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-slate-100 leading-tight">Project Onboarding</h1>
              <p className="text-xs text-slate-400 leading-tight">Complete your project setup in just a few simple steps</p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-shrink-0 bg-slate-800 pb-6">
          <div className="w-full mb-8 px-6">
            <div className="flex justify-between items-center relative">
              {/* Progress Line */}
              <div className="absolute top-6 left-0 w-full h-0.5 bg-slate-600" />
              <div
                className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-700 ease-out"
                style={{ width: `${(localStep / (steps.length - 1)) * 100}%` }}
              />

              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={index} className="relative z-10 flex flex-col items-center group">
                    <motion.button
                      onClick={async () => {
                        // allow navigating to current or previous steps
                        if (index <= localStep) {
                          setLocalStep(index)
                          setCurrentStep(index)
                          if (projectId && index !== localStep) {
                            try {
                              await handleStepChange(index)
                            } catch (err) {
                              console.error("Failed to update step:", err)
                            }
                          }
                        }
                      }}
                      disabled={index > localStep}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 border-2
                        ${index === localStep
                          ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-110"
                          : index < localStep
                            ? "bg-green-500 text-white border-green-500 shadow-md"
                            : "bg-slate-700 text-slate-400 border-slate-600 hover:border-slate-500 cursor-pointer"
                        }
                      `}
                      whileHover={{ scale: index <= localStep ? 1.1 : 1.05 }}
                      animate={index === localStep ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      aria-label={`Step ${index + 1}: ${step.title}. ${step.description}. ${index < localStep ? 'Completed' : index === localStep ? 'Current step' : 'Not started'}`}
                      aria-current={index === localStep ? 'step' : undefined}
                    >
                      {index < localStep ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </motion.button>
                    <div className="text-center mt-2">
                      <p
                        className={`text-xs font-medium transition-colors duration-300
                        ${index <= localStep ? "text-slate-100" : "text-slate-400"}
                      `}
                      >
                        {step.title}
                      </p>
                      <p
                        className={`text-xs transition-colors duration-300
                        ${index <= localStep ? "text-slate-300" : "text-slate-500"}
                      `}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6" style={{ scrollbarWidth: 'none' }}>
          <style jsx>{`
            ::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <motion.div
            key={localStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-6 pb-6 min-h-full relative"
          >
            {/* Step Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="text-center mb-6"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <h2 className="text-xl font-bold text-slate-100">{steps[localStep]?.title}</h2>
                <button
                  className="p-1 hover:bg-slate-700 rounded-full transition-colors duration-200 group"
                  title={steps[localStep]?.guidance}
                >
                  <Info className="w-4 h-4 text-slate-400 group-hover:text-slate-200" />
                </button>
              </div>
              <motion.div
                className="w-12 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
              ></motion.div>
            </motion.div>

            {/* Validation Errors */}
            {(Object.keys(validationErrors).length > 0 || error || submitError) && (
              <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
                <h3 className="text-red-400 font-semibold mb-2">Please fix the following errors:</h3>
                <ul className="space-y-1">
                  {error && (
                    <li className="text-red-300 text-sm">• {error}</li>
                  )}
                  {submitError && (
                    <li className="text-red-300 text-sm">• {submitError}</li>
                  )}
                  {Object.entries(validationErrors).map(([field, error]) => (
                    <li key={field} className="text-red-300 text-sm">• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {(() => {
              const CurrentStepComponent = steps[localStep]?.component
              const dataKey = steps[localStep]?.dataKey
              
              // Ensure data object exists
              if (!data) {
                return <div className="text-slate-400 text-center">Loading...</div>
              }
              
              // For steps with a specific dataKey, pass that section
              // For Review step (dataKey = null), pass entire data object
              let stepData
              if (dataKey) {
                stepData = (data as any)[dataKey] || {}
              } else {
                // Review step - ensure all sections exist
                stepData = {
                  project: data.project || { title: "", description: "", category: "", deadline: "" },
                  requirements: data.requirements || { notes: "", files: [] },
                  milestones: data.milestones || [],
                  client: data.client || { name: "", email: "", company: "", country: "", phone: "", contactPerson: "" },
                }
              }
              
              return CurrentStepComponent ? (
                <CurrentStepComponent
                  data={stepData}
                  updateData={updateData as any}
                  onNext={handleStepNext}
                  isSubmitting={isSubmitting}
                  isSubmitted={isSubmitted}
                />
              ) : null
            })()}

            {/* Loading Overlay */}
            {isSubmitting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-800/50 backdrop-blur-sm flex items-center justify-center rounded-lg"
              >
                <div className="bg-slate-700 p-6 rounded-lg shadow-lg text-center">
                  <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-200 font-medium">Processing your information...</p>
                  <p className="text-slate-400 text-sm mt-1">Please wait</p>
                </div>
              </motion.div>
            )}

            {/* Resume Loading Overlay */}
            {isResuming && !isSubmitting && !onboardingData && projectId && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-800/50 backdrop-blur-sm flex items-center justify-center rounded-lg"
              >
                <div className="bg-slate-700 p-6 rounded-lg shadow-lg text-center">
                  <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-200 font-medium">Resuming your project...</p>
                  <p className="text-slate-400 text-sm mt-1">Loading your saved progress</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Fixed Footer Navigation */}
        <div className="flex-shrink-0 bg-slate-800 border-t border-slate-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              {localStep > 0 && !isSubmitted && (
                <button
                  onClick={prevStep}
                  className="px-6 py-3 bg-slate-700 text-slate-200 border border-slate-600 rounded-lg hover:bg-slate-600 transition-all duration-200 font-medium disabled:opacity-50"
                  disabled={isSubmitting || isLoading}
                  aria-label={`Go back to ${steps[localStep - 1]?.title}`}
                >
                  ← Back
                </button>
              )}
            </div>

            <div className="text-sm text-slate-400 font-medium">
              Step {localStep + 1} of {steps.length}
              <span className="sr-only">: {steps[localStep]?.title}</span>
            </div>

            <div>
              {/* Show Next button for steps 0-3, Complete Setup button for step 4 */}
              {localStep < 4 && !isSubmitted && (
                <button
                  onClick={handleStepNext}
                  disabled={isSubmitting || isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold disabled:opacity-50 flex items-center gap-2"
                  aria-label={`Continue to ${steps[localStep + 1]?.title}`}
                >
                  {isSubmitting || isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Next
                      →
                    </>
                  )}
                </button>
              )}

              {localStep === 4 && !isSubmitted && (
                <button
                  onClick={handleStepNext}
                  disabled={isSubmitting || isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold disabled:opacity-50 flex items-center gap-2"
                  aria-label="Complete project onboarding"
                >
                  {isSubmitting || isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
        </>
        )}
      </DialogContent>
    </Dialog>
  )
}
