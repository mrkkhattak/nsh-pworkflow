"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DimensionGoal } from "@/lib/nsh-assessment-mock"

interface AddInterventionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dimensionId: string
  dimensionName: string
  goals: DimensionGoal[]
  onSave: (intervention: {
    type: "Medication" | "Lifestyle" | "Therapy" | "Other"
    date: string
    details: Record<string, string>
    notes?: string
    goalId?: string
  }) => void
}

export function AddInterventionDialog({
  open,
  onOpenChange,
  dimensionId,
  dimensionName,
  goals,
  onSave,
}: AddInterventionDialogProps) {
  const [interventionType, setInterventionType] = useState<"Medication" | "Lifestyle" | "Therapy" | "Other">("Medication")
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState("")
  const [selectedGoalId, setSelectedGoalId] = useState<string | undefined>(undefined)

  const [drugName, setDrugName] = useState("")
  const [dose, setDose] = useState("")
  const [frequency, setFrequency] = useState("")

  const [lifestyleCategory, setLifestyleCategory] = useState("")
  const [specificChange, setSpecificChange] = useState("")

  const [therapyType, setTherapyType] = useState("")
  const [therapyFrequency, setTherapyFrequency] = useState("")
  const [provider, setProvider] = useState("")

  const [customName, setCustomName] = useState("")

  const resetForm = () => {
    setInterventionType("Medication")
    setStartDate(new Date().toISOString().slice(0, 10))
    setNotes("")
    setSelectedGoalId(undefined)
    setDrugName("")
    setDose("")
    setFrequency("")
    setLifestyleCategory("")
    setSpecificChange("")
    setTherapyType("")
    setTherapyFrequency("")
    setProvider("")
    setCustomName("")
  }

  const handleSave = () => {
    const details: Record<string, string> = {}

    switch (interventionType) {
      case "Medication":
        if (!drugName.trim() || !dose.trim() || !frequency.trim()) return
        details.drugName = drugName.trim()
        details.dose = dose.trim()
        details.frequency = frequency.trim()
        break
      case "Lifestyle":
        if (!lifestyleCategory.trim() || !specificChange.trim()) return
        details.category = lifestyleCategory.trim()
        details.specificChange = specificChange.trim()
        break
      case "Therapy":
        if (!therapyType.trim() || !therapyFrequency.trim() || !provider.trim()) return
        details.type = therapyType.trim()
        details.frequency = therapyFrequency.trim()
        details.provider = provider.trim()
        break
      case "Other":
        if (!customName.trim()) return
        details.name = customName.trim()
        break
    }

    onSave({
      type: interventionType,
      date: startDate,
      details,
      notes: notes.trim() || undefined,
      goalId: selectedGoalId,
    })

    resetForm()
    onOpenChange(false)
  }

  const isFormValid = () => {
    switch (interventionType) {
      case "Medication":
        return drugName.trim() && dose.trim() && frequency.trim()
      case "Lifestyle":
        return lifestyleCategory.trim() && specificChange.trim()
      case "Therapy":
        return therapyType.trim() && therapyFrequency.trim() && provider.trim()
      case "Other":
        return customName.trim()
      default:
        return false
    }
  }

  const renderTypeSpecificFields = () => {
    switch (interventionType) {
      case "Medication":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="drugName">Drug Name</Label>
              <Input
                id="drugName"
                placeholder="e.g., Sertraline"
                value={drugName}
                onChange={(e) => setDrugName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dose">Dose</Label>
                <Input
                  id="dose"
                  placeholder="e.g., 75mg"
                  value={dose}
                  onChange={(e) => setDose(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency/Route</Label>
                <Input
                  id="frequency"
                  placeholder="e.g., Daily, oral"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                />
              </div>
            </div>
          </div>
        )
      case "Lifestyle":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lifestyleCategory">Category</Label>
              <Input
                id="lifestyleCategory"
                placeholder="e.g., diet, exercise, sleep, stress"
                value={lifestyleCategory}
                onChange={(e) => setLifestyleCategory(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specificChange">Specific Change</Label>
              <Input
                id="specificChange"
                placeholder="e.g., 30-minute daily walks"
                value={specificChange}
                onChange={(e) => setSpecificChange(e.target.value)}
              />
            </div>
          </div>
        )
      case "Therapy":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="therapyType">Type</Label>
              <Input
                id="therapyType"
                placeholder="e.g., CBT, DBT, Psychotherapy"
                value={therapyType}
                onChange={(e) => setTherapyType(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="therapyFrequency">Frequency</Label>
                <Input
                  id="therapyFrequency"
                  placeholder="e.g., Weekly"
                  value={therapyFrequency}
                  onChange={(e) => setTherapyFrequency(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                <Input
                  id="provider"
                  placeholder="e.g., Dr. Smith"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                />
              </div>
            </div>
          </div>
        )
      case "Other":
        return (
          <div className="space-y-2">
            <Label htmlFor="customName">Intervention Name</Label>
            <Input
              id="customName"
              placeholder="e.g., Acupuncture, Support Group"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
          </div>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Intervention</DialogTitle>
          <DialogDescription>
            Add a new intervention for {dimensionName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="interventionType">Intervention Type</Label>
            <Select value={interventionType} onValueChange={(value: any) => setInterventionType(value)}>
              <SelectTrigger id="interventionType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Medication">Medication</SelectItem>
                <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                <SelectItem value="Therapy">Therapy</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {renderTypeSpecificFields()}

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {goals.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="goalId">Link to Goal (Optional)</Label>
              <Select value={selectedGoalId} onValueChange={setSelectedGoalId}>
                <SelectTrigger id="goalId">
                  <SelectValue placeholder="Select a goal to link" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No goal selected</SelectItem>
                  {goals.map((goal) => (
                    <SelectItem key={goal.id} value={goal.id}>
                      {goal.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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
          <Button variant="outline" onClick={() => { resetForm(); onOpenChange(false); }}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid()}>
            Add Intervention
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
