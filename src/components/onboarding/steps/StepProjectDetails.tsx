"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StepProps } from "../types"

export default function StepProjectDetails({ data, updateData, onNext, isSubmitting }: StepProps) {

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle></CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-200">Project Title</label>
            <input
              type="text"
              placeholder="Enter your project title"
              value={data?.title || ""}
              onChange={(e) => updateData("project", { ...data, title: e.target.value })}
              className="w-full p-3 border border-slate-600 rounded-lg text-slate-100 bg-slate-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-200">Category</label>
            <select
              value={data?.category || ""}
              onChange={(e) => updateData("project", { ...data, category: e.target.value })}
              className="w-full p-3 border border-slate-600 rounded-lg text-slate-100 bg-slate-700 focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select a category</option>
              <option value="web-development">Web Development</option>
              <option value="mobile-app">Mobile App</option>
              <option value="ai-ml">AI / ML</option>
              <option value="cloud-services">Cloud Services</option>
              <option value="consulting">Consulting</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-200">Project Description</label>
          <textarea
            placeholder="Describe your project in detail..."
            value={data?.description || ""}
            onChange={(e) => updateData("project", { ...data, description: e.target.value })}
            rows={3}
            className="w-full p-3 border border-slate-600 rounded-lg text-slate-100 bg-slate-700 focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-200">Project Deadline</label>
          <input
            type="date"
            value={data?.deadline || ""}
            onChange={(e) => updateData("project", { ...data, deadline: e.target.value })}
            className="w-full p-3 border border-slate-600 rounded-lg text-slate-100 bg-slate-700 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </CardContent>
    </Card>
  )
}