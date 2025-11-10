"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

const biometricTypes = [
  { value: "blood_pressure", label: "Blood Pressure", unit: "mmHg", hasSecondary: true, secondaryLabel: "Diastolic" },
  { value: "blood_glucose", label: "Blood Glucose", unit: "mg/dL", hasSecondary: false },
  { value: "a1c", label: "A1C", unit: "%", hasSecondary: false },
  { value: "pain_score", label: "Pain Score", unit: "0-10", hasSecondary: false },
  { value: "cholesterol", label: "Cholesterol", unit: "mg/dL", hasSecondary: false },
  { value: "bmi", label: "BMI", unit: "kg/m²", hasSecondary: false },
  { value: "weight", label: "Weight", unit: "lbs", hasSecondary: false },
  { value: "triglycerides", label: "Triglycerides", unit: "mg/dL", hasSecondary: false },
]

interface Props {
  patientId: number
  onAdd?: (biometric: any) => void
}

export function AddBiometricDialog({ patientId, onAdd }: Props) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState("")
  const [value, setValue] = useState("")
  const [secondaryValue, setSecondaryValue] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5))
  const [notes, setNotes] = useState("")

  const selectedType = biometricTypes.find((t) => t.value === type)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newBiometric = {
      id: Date.now(),
      patient_id: patientId,
      type,
      value: parseFloat(value),
      secondary_value: selectedType?.hasSecondary ? parseFloat(secondaryValue) : null,
      date,
      time,
      notes: notes || null,
      recorded_by: "Dr. Anderson",
      created_at: new Date().toISOString(),
    }

    if (onAdd) {
      onAdd(newBiometric)
    }

    setOpen(false)
    setType("")
    setValue("")
    setSecondaryValue("")
    setDate(new Date().toISOString().split("T")[0])
    setTime(new Date().toTimeString().slice(0, 5))
    setNotes("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Biometric
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Biometric Reading</DialogTitle>
          <DialogDescription>Record a new biometric measurement for the patient</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Biometric Type *</Label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select biometric type" />
                </SelectTrigger>
                <SelectContent>
                  {biometricTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedType && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="value">
                      {selectedType.hasSecondary ? "Systolic" : "Value"} ({selectedType.unit}) *
                    </Label>
                    <Input
                      id="value"
                      type="number"
                      step="0.1"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder={`Enter ${selectedType.hasSecondary ? "systolic" : "value"}`}
                      required
                    />
                  </div>
                  {selectedType.hasSecondary && (
                    <div className="space-y-2">
                      <Label htmlFor="secondaryValue">
                        {selectedType.secondaryLabel} ({selectedType.unit}) *
                      </Label>
                      <Input
                        id="secondaryValue"
                        type="number"
                        step="0.1"
                        value={secondaryValue}
                        onChange={(e) => setSecondaryValue(e.target.value)}
                        placeholder={`Enter ${selectedType.secondaryLabel.toLowerCase()}`}
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any relevant notes about this reading"
                    rows={3}
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={!type || !value}>
              Add Biometric
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
