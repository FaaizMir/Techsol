"use client"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StepProps } from "../types"

export default function StepPaymentPlan({ data, updateData, onNext, isSubmitting }: StepProps) {

  const addMilestone = () => {
    const newMilestones = [...(data || []), { title: "", deliverable: "", deadline: "", amount: "" }]
    updateData("milestones", newMilestones)
  }

  const updateMilestone = (idx: number, field: string, value: string) => {
    const updated = [...(data || [])]
    updated[idx][field] = value
    updateData("milestones", updated)
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle></CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        {(data || []).length === 0 ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Plus className="w-6 h-6 text-slate-400" />
            </div>
            <h4 className="text-base font-medium text-slate-200 mb-1">No milestones yet</h4>
            <p className="text-slate-400 text-sm">Add your first milestone to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {(data || []).map((ms: any, idx: number) => (
              <div key={idx} className="p-3 border border-slate-600 rounded-lg bg-slate-700 space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-slate-200">Milestone {idx + 1}</h4>
                  <button
                    onClick={() => {
                      const updated = [...(data || [])];
                      updated.splice(idx, 1);
                      updateData("milestones", updated);
                    }}
                    className="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded hover:bg-red-500/10"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Milestone title"
                    value={ms.title || ""}
                    onChange={(e) => updateMilestone(idx, "title", e.target.value)}
                    className="w-full p-2 border border-slate-600 rounded-lg text-slate-100 bg-slate-800 focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Deliverable"
                    value={ms.deliverable || ""}
                    onChange={(e) => updateMilestone(idx, "deliverable", e.target.value)}
                    className="w-full p-2 border border-slate-600 rounded-lg text-slate-100 bg-slate-800 focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <input
                    type="date"
                    value={ms.deadline || ""}
                    onChange={(e) => updateMilestone(idx, "deadline", e.target.value)}
                    className="w-full p-2 border border-slate-600 rounded-lg text-slate-100 bg-slate-700 focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Amount ($)"
                    value={ms.amount || ""}
                    onChange={(e) => updateMilestone(idx, "amount", e.target.value)}
                    className="w-full p-2 border border-slate-600 rounded-lg text-slate-100 bg-slate-800 focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <Button
          onClick={addMilestone}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
          icon={<Plus className="w-4 h-4" />}
        >
          Add Milestone
        </Button>
      </CardContent>
    </Card>
  )
}