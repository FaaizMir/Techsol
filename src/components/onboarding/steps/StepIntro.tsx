"use client"

import { motion } from "framer-motion"
import { CheckCircle, FileText, User, CreditCard, Upload, Sparkles } from "lucide-react"

interface StepIntroProps {
  onNext: () => void
  isSubmitting: boolean
}

export default function StepIntro({ onNext, isSubmitting }: StepIntroProps) {
  const features = [
    {
      icon: FileText,
      title: "Project Setup",
      description: "Define your project details and requirements"
    },
    {
      icon: Upload,
      title: "File Management",
      description: "Upload documents and project assets"
    },
    {
      icon: CreditCard,
      title: "Payment Planning",
      description: "Set up milestones and payment schedules"
    },
    {
      icon: User,
      title: "Client Information",
      description: "Add client details for seamless collaboration"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
        </div>
        <h2 className="text-2xl font-bold text-slate-100">
          Welcome to TechSol Onboarding
        </h2>
        <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
          Let's get your project started right. We'll guide you through setting up your project,
          gathering requirements, and preparing everything for a successful launch.
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
              className="flex items-start space-x-3 p-4 bg-slate-700/50 rounded-lg border border-slate-600/50"
            >
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Icon className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-100 mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Process Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="bg-slate-700/30 rounded-lg p-6 border border-slate-600/50"
      >
        <h3 className="text-lg font-semibold text-slate-100 mb-4 text-center">
          What to Expect
        </h3>
        <div className="space-y-3">
          {[
            "Step-by-step project configuration",
            "Secure file upload and management",
            "Flexible payment milestone setup",
            "Client information collection",
            "Final review and project activation"
          ].map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
              className="flex items-center space-x-3"
            >
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-slate-300">{item}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="text-center"
      >
        <button
          onClick={onNext}
          disabled={isSubmitting}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold disabled:opacity-50 flex items-center gap-2 mx-auto"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Starting...
            </>
          ) : (
            <>
              Get Started
              <Sparkles className="w-4 h-4" />
            </>
          )}
        </button>
        <p className="text-xs text-slate-500 mt-2">
          Takes about 5-10 minutes to complete
        </p>
      </motion.div>
    </div>
  )
}