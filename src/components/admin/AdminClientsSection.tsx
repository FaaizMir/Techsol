"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Edit, Trash2, Plus, Mail, Phone, Building, MapPin, User } from "lucide-react"
import { useAdminClients, useCreateClient, useUpdateClient, useDeleteClient } from "@/hooks/use-admin-dashboard"
import { motion } from "framer-motion"
import type { Client } from "@/lib/api/admin-api"
import { useToast } from "@/hooks/use-toast"

export default function AdminClientsSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [clientForm, setClientForm] = useState({
    name: "",
    email: "",
    company: "",
    country: "",
    phone: "",
    contactPerson: "",
    status: "active"
  })

  const { data: clients, isLoading } = useAdminClients()
  const createClient = useCreateClient()
  const updateClient = useUpdateClient()
  const deleteClient = useDeleteClient()
  const { toast } = useToast()

  const filteredClients = clients?.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.company.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const handleCreate = async () => {
    if (!clientForm.name || !clientForm.email || !clientForm.company || !clientForm.country) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      await createClient.mutateAsync(clientForm)
      toast({
        title: "Success",
        description: "Client created successfully",
      })
      setIsCreateModalOpen(false)
      setClientForm({
        name: "",
        email: "",
        company: "",
        country: "",
        phone: "",
        contactPerson: "",
        status: "active"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create client",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (client: Client) => {
    setSelectedClient(client)
    setClientForm({
      name: client.name,
      email: client.email,
      company: client.company,
      country: client.country,
      phone: client.phone || "",
      contactPerson: client.contactPerson || "",
      status: client.status
    })
    setIsEditModalOpen(true)
  }

  const handleUpdate = async () => {
    if (!selectedClient) return

    try {
      await updateClient.mutateAsync({
        id: selectedClient.id,
        data: clientForm
      })
      toast({
        title: "Success",
        description: "Client updated successfully",
      })
      setIsEditModalOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update client",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (clientId: number) => {
    if (!confirm("Are you sure you want to delete this client?")) return

    try {
      await deleteClient.mutateAsync(clientId)
      toast({
        title: "Success",
        description: "Client deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete client",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
        <div className="bg-gray-800 rounded-lg p-6 animate-pulse h-96"></div>
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-2xl">Client Management</CardTitle>
              <p className="text-slate-400 text-sm mt-1">Manage all clients and their information</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-cyan-500/10 border-cyan-500/30 text-cyan-300">
                {clients?.length || 0} Total Clients
              </Badge>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Client
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search clients by name, email, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="rounded-lg border border-slate-700 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-900/50">
                <TableRow className="border-slate-700 hover:bg-slate-800/50">
                  <TableHead className="text-slate-300">Client</TableHead>
                  <TableHead className="text-slate-300">Contact</TableHead>
                  <TableHead className="text-slate-300">Company</TableHead>
                  <TableHead className="text-slate-300">Location</TableHead>
                  <TableHead className="text-slate-300">Contact Person</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow 
                    key={client.id}
                    className="border-slate-700 hover:bg-slate-800/50 transition-colors"
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{client.name}</div>
                        <div className="text-sm text-slate-400 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {client.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {client.phone ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {client.phone}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-sm">No phone</span>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      <div className="flex items-center gap-1 text-sm">
                        <Building className="h-3 w-3" />
                        {client.company}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        {client.country}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {client.contactPerson ? (
                        <div className="flex items-center gap-1 text-sm">
                          <User className="h-3 w-3" />
                          {client.contactPerson}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          client.status === 'active'
                            ? 'bg-green-500/10 border-green-500/30 text-green-300'
                            : 'bg-gray-500/10 border-gray-500/30 text-gray-300'
                        }
                      >
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(client)}
                          className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(client.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400">No clients found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Client Modal */}
      <Dialog open={isCreateModalOpen || isEditModalOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateModalOpen(false)
          setIsEditModalOpen(false)
        }
      }}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isCreateModalOpen ? 'Create New Client' : 'Edit Client'}</DialogTitle>
            <DialogDescription className="text-slate-400">
              {isCreateModalOpen ? 'Add a new client to the system' : 'Update client information'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">Client Name *</Label>
                <Input
                  id="name"
                  value={clientForm.name}
                  onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={clientForm.email}
                  onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-slate-300">Company *</Label>
                <Input
                  id="company"
                  value={clientForm.company}
                  onChange={(e) => setClientForm({ ...clientForm, company: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="Company Name Inc"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-slate-300">Country *</Label>
                <Input
                  id="country"
                  value={clientForm.country}
                  onChange={(e) => setClientForm({ ...clientForm, country: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="United States"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-300">Phone</Label>
                <Input
                  id="phone"
                  value={clientForm.phone}
                  onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson" className="text-slate-300">Contact Person</Label>
                <Input
                  id="contactPerson"
                  value={clientForm.contactPerson}
                  onChange={(e) => setClientForm({ ...clientForm, contactPerson: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="John Smith"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false)
                setIsEditModalOpen(false)
              }}
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              onClick={isCreateModalOpen ? handleCreate : handleUpdate}
              disabled={createClient.isPending || updateClient.isPending}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {(createClient.isPending || updateClient.isPending) ? 'Saving...' : isCreateModalOpen ? 'Create Client' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
