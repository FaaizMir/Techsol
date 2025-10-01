"use client"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StepProps } from "../types"

export default function StepRequirements({ data, updateData, onNext, isSubmitting }: StepProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData("requirements", {
      ...data,
      files: e.target.files ? Array.from(e.target.files) : [],
    })
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle></CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div>
          <label className="text-sm font-semibold text-slate-200">Special Requirements</label>
          <textarea
            placeholder="Any specific requirements..."
            value={data?.notes || ""}
            onChange={(e) => updateData("requirements", { ...data, notes: e.target.value })}
            rows={4}
            className="w-full p-3 border border-slate-600 rounded-lg text-slate-100 bg-slate-700 focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-200">Upload Files</label>
          {data?.files && data.files.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-slate-400 mb-2">Existing files:</p>
              <div className="space-y-2">
                {data.files.map((file: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-slate-600 rounded flex items-center justify-center">
                        <span className="text-xs text-slate-300">📄</span>
                      </div>
                      <div>
                        <p className="text-sm text-slate-200">{file.originalName || file.filename}</p>
                        <p className="text-xs text-slate-400">{file.size ? `${(file.size / 1024).toFixed(1)} KB` : ''}</p>
                      </div>
                    </div>
                    {file.url && (
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        View
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center bg-slate-700 hover:border-slate-500 transition-colors duration-200">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-4 rounded-full bg-slate-600/50">
                <Upload className="w-8 h-8 text-slate-400" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-200">Drop files here or click to browse</p>
                <p className="text-xs text-slate-400">Supports multiple files</p>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="text-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer file:transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}