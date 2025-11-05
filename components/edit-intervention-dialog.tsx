"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface InterventionData {
  id: string
  name: string
  type: "Medication" | "Lifestyle" | "Therapy" | "Social" | "Other"
  startDate: string
  endDate?: string
  status: "active" | "completed"
  details: {
    details: string
    provider: string
    instructions: string
  }
  notes?: string
}

interface EditInterventionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  intervention: InterventionData
  onSave: (interventionId: string, updates: {
    name: string
    type: "Medication" | "Lifestyle" | "Therapy" | "Social" | "Other"
    startDate: string
    endDate?: string
    status: "active" | "completed"
    details: {
      details: string
      provider: string
      instructions: string
    }
    notes?: string
  }) => void
}

export function EditInterventionDialog({
  open,
  onOpenChange,
  intervention,
  onSave,
}: EditInterventionDialogProps) {
  const [name, setName] = useState(intervention.name)
  const [type, setType] = useState<"Medication" | "Lifestyle" | "Therapy" | "Other">(intervention.type)
  const [startDate, setStartDate] = useState(intervention.startDate)
  const [endDate, setEndDate] = useState(intervention.endDate || "")
  const [status, setStatus] = useState<"active" | "completed">(intervention.status)
  const [details, setDetails] = useState(intervention.details.details)
  const [provider, setProvider] = useState(intervention.details.provider)
  const [instructions, setInstructions] = useState(intervention.details.instructions)
  const [notes, setNotes] = useState(intervention.notes || "")

  useEffect(() => {
    if (open) {
      setName(intervention.name)
      setType(intervention.type)
      setStartDate(intervention.startDate)
      setEndDate(intervention.endDate || "")
      setStatus(intervention.status)
      setDetails(intervention.details.details)
      setProvider(intervention.details.provider)
      setInstructions(intervention.details.instructions)
      setNotes(intervention.notes || "")
    }
  }, [open, intervention])

  const handleSave = () => {
    if (!name.trim() || !details.trim() || !provider.trim() || !instructions.trim()) return

    onSave(intervention.id, {
      name: name.trim(),
      type,
      startDate,
      endDate: endDate.trim() || undefined,
      status,
      details: {
        details: details.trim(),
        provider: provider.trim(),
        instructions: instructions.trim(),
      },
      notes: notes.trim() || undefined,
    })

    onOpenChange(false)
  }

  const isFormValid = () => {
    return name.trim() && details.trim() && provider.trim() && instructions.trim()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Intervention</DialogTitle>
          <DialogDescription>
            Update the intervention details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Intervention Name</Label>
            <Input
              id="name"
              placeholder="e.g., Sertraline 75mg"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Intervention Type</Label>
            <Select value={type} onValueChange={(value: any) => setType(value)}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Medication">Medication</SelectItem>
                <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                <SelectItem value="Therapy">Therapy</SelectItem>
                <SelectItem value="Social">Social</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Details</Label>
            <Input
              id="details"
              placeholder="e.g., Dosage: 75mg, Frequency: Daily, oral"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="provider">Provider</Label>
            <Input
              id="provider"
              placeholder="e.g., Dr. Anderson"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              placeholder="Detailed instructions for the intervention"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                {endDate && (
                  <button
                    type="button"
                    onClick={() => setEndDate("")}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                )}
              </div>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value: any) => setStatus(value)}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes or context"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid()}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
