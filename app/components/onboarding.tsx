"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Upload, Plus, FileText, User, CreditCard, ClipboardList } from "lucide-react"

export default function Onboarding() {
  const steps = [
    { title: "Project Details", icon: ClipboardList },
    { title: "Requirements & Files", icon: Upload },
    { title: "Payment Plan", icon: CreditCard },
    { title: "Client Info", icon: User },
    { title: "Review & Document", icon: FileText },
    { title: "Submit", icon: CheckCircle },
  ]

  const [currentStep, setCurrentStep] = useState(0)

  // Form states
  const [project, setProject] = useState({ title: "", description: "", category: "", deadline: "" })
  const [requirements, setRequirements] = useState({ notes: "", files: [] as File[] })
  const [milestones, setMilestones] = useState([{ title: "", deliverable: "", deadline: "", amount: "" }])
  const [client, setClient] = useState({ name: "", email: "", company: "", country: "" })

  // Handlers
  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))
  const addMilestone = () => {
    setMilestones([...milestones, { title: "", deliverable: "", deadline: "", amount: "" }])
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-12 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Project Onboarding</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Complete your project setup in just a few simple steps
        </p>
      </div>

      {/* Enhanced Stepper Header */}
      <div className="w-full max-w-5xl mb-16">
        <div className="flex justify-between items-center relative">
          {/* Progress Line */}
          <div className="absolute top-6 left-0 w-full h-0.5 bg-border" />
          <div
            className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-700 ease-out"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative z-10 flex flex-col items-center group">
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 border-2
                    ${
                      index === currentStep
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 scale-110"
                        : index < currentStep
                          ? "bg-green-500 text-white border-green-500 shadow-md"
                          : "bg-card text-muted-foreground border-border hover:border-muted-foreground"
                    }
                  `}
                  whileHover={{ scale: index <= currentStep ? 1.1 : 1.05 }}
                >
                  {index < currentStep ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </motion.div>
                <p
                  className={`text-sm mt-3 font-medium transition-colors duration-300 text-center max-w-20
                  ${index <= currentStep ? "text-foreground" : "text-muted-foreground"}
                `}
                >
                  {step.title}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Enhanced Form Card */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-4xl bg-slate-800 rounded-3xl shadow-xl border border-slate-700 overflow-hidden"
      >
        <div className="p-8 lg:p-12">
          {/* Step Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-2">{steps[currentStep].title}</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
          </div>

          {/* STEP 1: Project Details */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-200">Project Title</label>
                  <input
                    type="text"
                    placeholder="Enter your project title"
                    value={project.title}
                    onChange={(e) => setProject({ ...project, title: e.target.value })}
                    className="w-full p-4 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-400 bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-200">Category</label>
                  <input
                    type="text"
                    placeholder="e.g., Web Development, Design"
                    value={project.category}
                    onChange={(e) => setProject({ ...project, category: e.target.value })}
                    className="w-full p-4 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-400 bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-200">Project Description</label>
                <textarea
                  placeholder="Describe your project in detail..."
                  value={project.description}
                  onChange={(e) => setProject({ ...project, description: e.target.value })}
                  rows={4}
                  className="w-full p-4 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-400 bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-200">Project Deadline</label>
                <input
                  type="date"
                  value={project.deadline}
                  onChange={(e) => setProject({ ...project, deadline: e.target.value })}
                  className="w-full p-4 border border-slate-600 rounded-xl text-slate-100 bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Requirements */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-200">Special Requirements</label>
                <textarea
                  placeholder="Any specific requirements, technologies, or constraints..."
                  value={requirements.notes}
                  onChange={(e) =>
                    setRequirements({ ...requirements, notes: e.target.value, files: requirements.files })
                  }
                  rows={5}
                  className="w-full p-4 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-400 bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-200">Upload Files</label>
                <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-blue-400 transition-colors duration-200 bg-slate-700">
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <input
                    type="file"
                    multiple
                    onChange={(e) =>
                      setRequirements({ ...requirements, files: e.target.files ? Array.from(e.target.files) : [] })
                    }
                    className="w-full text-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                  <p className="text-sm text-slate-400 mt-2">Drag and drop files here or click to browse</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Plan */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <p className="text-slate-300">Define project milestones and payment schedule</p>
              </div>
              {milestones.map((ms, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 border border-slate-600 rounded-2xl bg-slate-700 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-100">Milestone {idx + 1}</h3>
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{idx + 1}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Milestone title"
                      value={ms.title}
                      onChange={(e) => {
                        const updated = [...milestones]
                        updated[idx].title = e.target.value
                        setMilestones(updated)
                      }}
                      className="w-full p-3 border border-slate-600 rounded-lg text-slate-100 bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm placeholder-slate-400"
                    />
                    <input
                      type="text"
                      placeholder="Deliverable"
                      value={ms.deliverable}
                      onChange={(e) => {
                        const updated = [...milestones]
                        updated[idx].deliverable = e.target.value
                        setMilestones(updated)
                      }}
                      className="w-full p-3 border border-slate-600 rounded-lg text-slate-100 bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm placeholder-slate-400"
                    />
                    <input
                      type="date"
                      value={ms.deadline}
                      onChange={(e) => {
                        const updated = [...milestones]
                        updated[idx].deadline = e.target.value
                        setMilestones(updated)
                      }}
                      className="w-full p-3 border border-slate-600 rounded-lg text-slate-100 bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                    />
                    <input
                      type="number"
                      placeholder="Amount ($)"
                      value={ms.amount}
                      onChange={(e) => {
                        const updated = [...milestones]
                        updated[idx].amount = e.target.value
                        setMilestones(updated)
                      }}
                      className="w-full p-3 border border-slate-600 rounded-lg text-slate-100 bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm placeholder-slate-400"
                    />
                  </div>
                </motion.div>
              ))}
              <button
                onClick={addMilestone}
                className="w-full p-4 border-2 border-dashed border-slate-600 rounded-xl text-slate-300 hover:border-blue-400 hover:text-blue-400 transition-all duration-200 flex items-center justify-center gap-2 bg-slate-700"
              >
                <Plus className="w-5 h-5" />
                Add Another Milestone
              </button>
            </div>
          )}

          {/* STEP 4: Client Info */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-200">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={client.name}
                    onChange={(e) => setClient({ ...client, name: e.target.value })}
                    className="w-full p-4 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-400 bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-200">Email Address</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={client.email}
                    onChange={(e) => setClient({ ...client, email: e.target.value })}
                    className="w-full p-4 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-400 bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-200">Company (Optional)</label>
                  <input
                    type="text"
                    placeholder="Your company name"
                    value={client.company}
                    onChange={(e) => setClient({ ...client, company: e.target.value })}
                    className="w-full p-4 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-400 bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-200">Country</label>
                  <input
                    type="text"
                    placeholder="Your country"
                    value={client.country}
                    onChange={(e) => setClient({ ...client, country: e.target.value })}
                    className="w-full p-4 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-400 bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Document Preview */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <FileText className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-100">Project Agreement Document</h3>
                <p className="text-slate-300">Review your project details before submission</p>
              </div>
              <div className="border border-slate-600 rounded-2xl bg-slate-700 shadow-sm p-8 space-y-6 text-slate-100">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-slate-100 mb-2">Project Information</h4>
                    <p>
                      <span className="font-medium">Title:</span> {project.title || "Not specified"}
                    </p>
                    <p>
                      <span className="font-medium">Category:</span> {project.category || "Not specified"}
                    </p>
                    <p>
                      <span className="font-medium">Deadline:</span> {project.deadline || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100 mb-2">Client Information</h4>
                    <p>
                      <span className="font-medium">Name:</span> {client.name || "Not specified"}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {client.email || "Not specified"}
                    </p>
                    <p>
                      <span className="font-medium">Company:</span> {client.company || "Not specified"}
                    </p>
                    <p>
                      <span className="font-medium">Country:</span> {client.country || "Not specified"}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-100 mb-2">Project Description</h4>
                  <p className="text-slate-200 bg-slate-800 p-4 rounded-lg border border-slate-600">
                    {project.description || "No description provided"}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-100 mb-2">Requirements</h4>
                  <p className="text-slate-200 bg-slate-800 p-4 rounded-lg border border-slate-600">
                    {requirements.notes || "No special requirements"}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-100 mb-3">Payment Milestones</h4>
                  <div className="space-y-3">
                    {milestones.map((ms, idx) => (
                      <div key={idx} className="bg-slate-800 p-4 rounded-lg border-l-4 border-blue-500">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-slate-100">{ms.title || `Milestone ${idx + 1}`}</p>
                            <p className="text-sm text-slate-300">{ms.deliverable || "No deliverable specified"}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-400">${ms.amount || "0"}</p>
                            <p className="text-sm text-slate-300">{ms.deadline || "No deadline"}</p>
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
          {currentStep === 5 && (
            <div className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto"
              >
                <CheckCircle className="w-12 h-12 text-green-600" />
              </motion.div>
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Order Submitted Successfully!</h2>
                <p className="text-lg text-muted-foreground">
                  Your project has been submitted and is now being reviewed.
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <p className="text-blue-800 font-medium">What happens next?</p>
                <p className="text-blue-700 text-sm mt-1">
                  You'll receive a confirmation email shortly and can track your project progress in the dashboard.
                </p>
              </div>
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold">
                Go to Dashboard
              </button>
            </div>
          )}

          {/* Enhanced Navigation */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-600">
            <div>
              {currentStep > 0 && currentStep < 5 && (
                <button
                  onClick={prevStep}
                  className="px-6 py-3 bg-slate-700 text-slate-200 border border-slate-600 rounded-xl hover:bg-slate-600 transition-all duration-200 font-medium shadow-sm"
                >
                  ← Back
                </button>
              )}
            </div>

            <div className="text-sm text-slate-400">
              Step {currentStep + 1} of {steps.length}
            </div>

            <div>
              {currentStep < 4 && (
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                >
                  Next →
                </button>
              )}
              {currentStep === 4 && (
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                >
                  Submit Order →
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
