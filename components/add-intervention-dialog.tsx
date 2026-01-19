"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createDimensionIntervention } from "@/lib/intervention-service"
import type { DimensionGoal } from "@/lib/nsh-assessment-mock"

interface AddInterventionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dimensionId: string
  dimensionName: string
  goals: DimensionGoal[]
  patientId?: number
  onSave: (intervention: any) => void
}

export function AddInterventionDialog({
  open,
  onOpenChange,
  dimensionId,
  dimensionName,
  goals,
  patientId = 1,
  onSave,
}: AddInterventionDialogProps) {
  const [interventionType, setInterventionType] = useState<"Medication" | "Lifestyle" | "Therapy" | "Social" | "Other">("Medication")
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().slice(0, 10))
  const [endDate, setEndDate] = useState<string>("")
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

  const [socialActivity, setSocialActivity] = useState("")
  const [socialFrequency, setSocialFrequency] = useState("")
  const [socialContact, setSocialContact] = useState("")

  const [customName, setCustomName] = useState("")
  const [saving, setSaving] = useState(false)

  const resetForm = () => {
    setInterventionType("Medication")
    setStartDate(new Date().toISOString().slice(0, 10))
    setEndDate("")
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
    setSocialActivity("")
    setSocialFrequency("")
    setSocialContact("")
    setCustomName("")
  }

  const handleSave = async () => {
    if (saving) return

    const details: Record<string, string> = {}
    let interventionName = ''

    switch (interventionType) {
      case "Medication":
        if (!drugName.trim() || !dose.trim() || !frequency.trim()) return
        details.drugName = drugName.trim()
        details.dose = dose.trim()
        details.frequency = frequency.trim()
        interventionName = `${drugName.trim()} ${dose.trim()}`
        break
      case "Lifestyle":
        if (!lifestyleCategory.trim() || !specificChange.trim()) return
        details.category = lifestyleCategory.trim()
        details.specificChange = specificChange.trim()
        interventionName = lifestyleCategory.trim()
        break
      case "Therapy":
        if (!therapyType.trim() || !therapyFrequency.trim() || !provider.trim()) return
        details.type = therapyType.trim()
        details.frequency = therapyFrequency.trim()
        details.provider = provider.trim()
        interventionName = therapyType.trim()
        break
      case "Social":
        if (!socialActivity.trim() || !socialFrequency.trim()) return
        details.activity = socialActivity.trim()
        details.frequency = socialFrequency.trim()
        if (socialContact.trim()) details.contact = socialContact.trim()
        interventionName = socialActivity.trim()
        break
      case "Other":
        if (!customName.trim()) return
        details.name = customName.trim()
        interventionName = customName.trim()
        break
    }

    setSaving(true)
    try {
      const result = await createDimensionIntervention({
        patient_id: patientId,
        dimension_id: dimensionId,
        dimension_name: dimensionName,
        goal_id: selectedGoalId || null,
        intervention_type: interventionType,
        intervention_name: interventionName,
        details,
        notes: notes.trim() || null,
        start_date: startDate,
        end_date: endDate.trim() || null,
        status: 'active',
        created_by: 'Dr. Anderson',
      })

      if (result) {
        onSave(result)
        resetForm()
        onOpenChange(false)
      }
    } catch (error) {
      console.error('Error saving intervention:', error)
    } finally {
      setSaving(false)
    }
  }

  const isFormValid = () => {
    switch (interventionType) {
      case "Medication":
        return drugName.trim() && dose.trim() && frequency.trim()
      case "Lifestyle":
        return lifestyleCategory.trim() && specificChange.trim()
      case "Therapy":
        return therapyType.trim() && therapyFrequency.trim() && provider.trim()
      case "Social":
        return socialActivity.trim() && socialFrequency.trim()
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
      case "Social":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="socialActivity">Activity/Engagement</Label>
              <Input
                id="socialActivity"
                placeholder="e.g., Weekly social group, Community event, Family gathering"
                value={socialActivity}
                onChange={(e) => setSocialActivity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="socialFrequency">Frequency</Label>
              <Input
                id="socialFrequency"
                placeholder="e.g., Weekly, Twice per month"
                value={socialFrequency}
                onChange={(e) => setSocialFrequency(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="socialContact">Contact/Organization (Optional)</Label>
              <Input
                id="socialContact"
                placeholder="e.g., Community center, Family member, Support group"
                value={socialContact}
                onChange={(e) => setSocialContact(e.target.value)}
              />
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
                <SelectItem value="Social">Social</SelectItem>
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
            <p className="text-xs text-gray-500">
              Planned duration of the intervention. This is separate from stopping an intervention early.
            </p>
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
          <Button onClick={handleSave} disabled={!isFormValid() || saving}>
            {saving ? 'Adding...' : 'Add Intervention'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
