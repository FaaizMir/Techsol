"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StepProps } from "../types"

export default function StepClientInfo({ data, updateData, onNext, isSubmitting }: StepProps) {
  const handleInputChange = (field: string, value: string) => {
    updateData("client", { ...data, [field]: value })
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle></CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-200">Full Name <span className="text-red-400">*</span></label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={data?.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full p-3 border border-slate-600 rounded-lg text-slate-100 bg-slate-700 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-200">Email Address <span className="text-red-400">*</span></label>
            <input
              type="email"
              placeholder="your@email.com"
              value={data?.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full p-3 border border-slate-600 rounded-lg text-slate-100 bg-slate-700 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-200">Company (Optional)</label>
            <input
              type="text"
              placeholder="Your company name"
              value={data?.company || ""}
              onChange={(e) => handleInputChange("company", e.target.value)}
              className="w-full p-3 border border-slate-600 rounded-lg text-slate-100 bg-slate-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-200">Country <span className="text-red-400">*</span></label>
            <input
              type="text"
              placeholder="Your country"
              value={data?.country || ""}
              onChange={(e) => handleInputChange("country", e.target.value)}
              className="w-full p-3 border border-slate-600 rounded-lg text-slate-100 bg-slate-700 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}