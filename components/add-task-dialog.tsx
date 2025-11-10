"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface AddTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCategory: string
  onTaskAdded?: () => void
}

const categoryStatusMap: Record<string, string[]> = {
  "provider-level": ["pending", "scheduled", "completed", "declined", "no-show", "canceled"],
  "patient-level": ["acknowledged", "declined", "pending"],
  "system-level": ["completed", "unreachable", "declined", "pending", "in-contact"],
  "community-level": ["enrolled", "in-progress", "completed", "withdrawn", "declined", "pending"],
}

export function AddTaskDialog({ open, onOpenChange, selectedCategory, onTaskAdded }: AddTaskDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    due_date: "",
    assignee: "",
    estimated_time: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const taskData = {
        category: selectedCategory,
        ...formData,
      }

      const { data, error } = await supabase.from("tasks").insert([taskData]).select()

      if (error) throw error

      toast({
        title: "Task created",
        description: "The task has been successfully created.",
      })

      onOpenChange(false)
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        status: "pending",
        due_date: "",
        assignee: "",
        estimated_time: "",
      })

      if (onTaskAdded) {
        onTaskAdded()
      }
    } catch (error) {
      console.error("Error creating task:", error)
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const availableStatuses = categoryStatusMap[selectedCategory] || ["pending"]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a new task for {selectedCategory.replace("-", " ")} category
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Common Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => updateFormData("title", e.target.value)}
                  placeholder="Enter task title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => updateFormData("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                placeholder="Enter task description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => updateFormData("priority", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => updateFormData("due_date", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimated_time">Estimated Time</Label>
                <Input
                  id="estimated_time"
                  value={formData.estimated_time}
                  onChange={(e) => updateFormData("estimated_time", e.target.value)}
                  placeholder="e.g., 30 min"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Input
                id="assignee"
                value={formData.assignee}
                onChange={(e) => updateFormData("assignee", e.target.value)}
                placeholder="Enter assignee name"
              />
            </div>
          </div>

          {/* Provider Level Fields */}
          {selectedCategory === "provider-level" && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-sm">Provider Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="provider_name">Name</Label>
                  <Input
                    id="provider_name"
                    value={formData.provider_name || ""}
                    onChange={(e) => updateFormData("provider_name", e.target.value)}
                    placeholder="Provider name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider_credential">Credential</Label>
                  <Input
                    id="provider_credential"
                    value={formData.provider_credential || ""}
                    onChange={(e) => updateFormData("provider_credential", e.target.value)}
                    placeholder="e.g., MD, PhD"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider_email">Email</Label>
                  <Input
                    id="provider_email"
                    type="email"
                    value={formData.provider_email || ""}
                    onChange={(e) => updateFormData("provider_email", e.target.value)}
                    placeholder="provider@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider_specialty">Specialty</Label>
                  <Input
                    id="provider_specialty"
                    value={formData.provider_specialty || ""}
                    onChange={(e) => updateFormData("provider_specialty", e.target.value)}
                    placeholder="e.g., Psychiatry"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider_license_id">License ID</Label>
                  <Input
                    id="provider_license_id"
                    value={formData.provider_license_id || ""}
                    onChange={(e) => updateFormData("provider_license_id", e.target.value)}
                    placeholder="Registration or License ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider_organization">Affiliated Organization</Label>
                  <Input
                    id="provider_organization"
                    value={formData.provider_organization || ""}
                    onChange={(e) => updateFormData("provider_organization", e.target.value)}
                    placeholder="Organization name"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="provider_address">Address</Label>
                  <Input
                    id="provider_address"
                    value={formData.provider_address || ""}
                    onChange={(e) => updateFormData("provider_address", e.target.value)}
                    placeholder="Street address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider_zip">ZIP Code</Label>
                  <Input
                    id="provider_zip"
                    value={formData.provider_zip || ""}
                    onChange={(e) => updateFormData("provider_zip", e.target.value)}
                    placeholder="ZIP code"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider_state">State</Label>
                  <Input
                    id="provider_state"
                    value={formData.provider_state || ""}
                    onChange={(e) => updateFormData("provider_state", e.target.value)}
                    placeholder="State"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider_country">Country</Label>
                  <Input
                    id="provider_country"
                    value={formData.provider_country || ""}
                    onChange={(e) => updateFormData("provider_country", e.target.value)}
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Patient Level Fields */}
          {selectedCategory === "patient-level" && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-sm">Patient Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patient_name">Name</Label>
                  <Input
                    id="patient_name"
                    value={formData.patient_name || ""}
                    onChange={(e) => updateFormData("patient_name", e.target.value)}
                    placeholder="Patient name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patient_contact">Contact</Label>
                  <Input
                    id="patient_contact"
                    value={formData.patient_contact || ""}
                    onChange={(e) => updateFormData("patient_contact", e.target.value)}
                    placeholder="Phone or contact info"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="patient_website">Website</Label>
                  <Input
                    id="patient_website"
                    value={formData.patient_website || ""}
                    onChange={(e) => updateFormData("patient_website", e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Community Level Fields */}
          {selectedCategory === "community-level" && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-sm">Community Resource Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="community_resource_name">Resource Name</Label>
                  <Input
                    id="community_resource_name"
                    value={formData.community_resource_name || ""}
                    onChange={(e) => updateFormData("community_resource_name", e.target.value)}
                    placeholder="Resource name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="community_email">Email</Label>
                  <Input
                    id="community_email"
                    type="email"
                    value={formData.community_email || ""}
                    onChange={(e) => updateFormData("community_email", e.target.value)}
                    placeholder="contact@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="community_website">Website</Label>
                  <Input
                    id="community_website"
                    value={formData.community_website || ""}
                    onChange={(e) => updateFormData("community_website", e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="community_contact">Contact</Label>
                  <Input
                    id="community_contact"
                    value={formData.community_contact || ""}
                    onChange={(e) => updateFormData("community_contact", e.target.value)}
                    placeholder="Phone or contact info"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="community_location">Location</Label>
                  <Input
                    id="community_location"
                    value={formData.community_location || ""}
                    onChange={(e) => updateFormData("community_location", e.target.value)}
                    placeholder="Location address"
                  />
                </div>
              </div>
            </div>
          )}

          {/* System Level Fields */}
          {selectedCategory === "system-level" && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-sm">System Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="system_name">Name</Label>
                  <Input
                    id="system_name"
                    value={formData.system_name || ""}
                    onChange={(e) => updateFormData("system_name", e.target.value)}
                    placeholder="System or organization name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="system_contact">Contact</Label>
                  <Input
                    id="system_contact"
                    value={formData.system_contact || ""}
                    onChange={(e) => updateFormData("system_contact", e.target.value)}
                    placeholder="Phone or contact info"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="system_website">Website</Label>
                  <Input
                    id="system_website"
                    value={formData.system_website || ""}
                    onChange={(e) => updateFormData("system_website", e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="system_location">Location</Label>
                  <Input
                    id="system_location"
                    value={formData.system_location || ""}
                    onChange={(e) => updateFormData("system_location", e.target.value)}
                    placeholder="Location address"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
