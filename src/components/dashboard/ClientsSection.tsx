"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Mail, Phone, Eye, Edit, Trash2 } from "lucide-react"

interface ClientsSectionProps {
  clients: any[]
}

export default function ClientsSection({ clients }: ClientsSectionProps) {

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Clients</h2>
          <p className="text-slate-400">Manage your client relationships</p>
        </div>
        <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search clients..."
            className="pl-10 bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-400"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {clients.map((client) => (
          <Card key={client.id} className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-slate-700 text-slate-300 text-lg">
                      {client.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-white">{client.name}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{client.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>{client.phone}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400">Projects: {client.projects}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <Badge
                    variant="outline"
                    className={
                      client.status === "Active"
                        ? "bg-green-500/20 text-green-300 border-green-500/30"
                        : "bg-red-500/20 text-red-300 border-red-500/30"
                    }
                  >
                    {client.status}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="text-slate-300 hover:bg-slate-700/50">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-slate-300 hover:bg-slate-700/50">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}