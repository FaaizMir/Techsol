"use client"
import { CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StepProps } from "../types"
import { useState, useEffect } from "react"

export default function StepSubmit({ data, updateData, onNext, isSubmitting, isSubmitted }: StepProps) {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (isSubmitted && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [isSubmitted, countdown])

  if (isSubmitted) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle></CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4 text-center">
          <h3 className="text-lg font-bold text-slate-100">🎉 Order Submitted Successfully!</h3>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-slate-200 text-sm">Your project has been submitted and is now being reviewed.</p>
            <p className="text-slate-400 text-xs mt-2">This window will close automatically in {countdown} seconds...</p>
          </div>
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
            <p className="text-primary font-medium text-sm">What happens next?</p>
            <p className="text-slate-400 text-xs mt-1">
              You'll receive a confirmation email shortly and can track your project progress in the dashboard.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle></CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-4 text-center">
        <h3 className="text-lg font-bold text-slate-100">Ready to Submit Your Order?</h3>
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <p className="text-slate-200 text-sm">Please review all information before submitting.</p>
        </div>
        <Button
          onClick={onNext}
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Submitting...
            </>
          ) : (
            'Submit Order'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}