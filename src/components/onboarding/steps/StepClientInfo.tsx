"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StepProps } from "../types"

export default function StepClientInfo({ data, updateData, onNext, isSubmitting }: StepProps) {

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle></CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-200">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={data?.name || ""}
              onChange={(e) => updateData("client", { ...data, name: e.target.value })}
              className="w-full p-3 border border-slate-600 rounded-lg text-slate-100 bg-slate-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-200">Email Address</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={data?.email || ""}
              onChange={(e) => updateData("client", { ...data, email: e.target.value })}
              className="w-full p-3 border border-slate-600 rounded-lg text-slate-100 bg-slate-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-200">Company (Optional)</label>
            <input
              type="text"
              placeholder="Your company name"
              value={data?.company || ""}
              onChange={(e) => updateData("client", { ...data, company: e.target.value })}
              className="w-full p-3 border border-slate-600 rounded-lg text-slate-100 bg-slate-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-200">Country</label>
            <input
              type="text"
              placeholder="Your country"
              value={data?.country || ""}
              onChange={(e) => updateData("client", { ...data, country: e.target.value })}
              className="w-full p-3 border border-slate-600 rounded-lg text-slate-100 bg-slate-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}