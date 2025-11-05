"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "lucide-react"

type ScheduleAssessmentDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientId: number
  patientName: string
  onScheduled?: (data: ScheduledAssessment) => void
}

export type ScheduledAssessment = {
  patientId: number
  assessmentType: string
  scheduledDate: string
  scheduledTime: string
  notes: string
  reminderEnabled: boolean
  reminderDays: number
}

const assessmentTypes = [
  { value: "nsh-full", label: "NSH Full Assessment" },
  { value: "mental-health", label: "Mental Health Assessment" },
  { value: "functional-health", label: "Functional Health Assessment" },
  { value: "pain-assessment", label: "Pain Assessment" },
  { value: "medication-review", label: "Medication Review" },
  { value: "follow-up", label: "Follow-up Assessment" },
]

export function ScheduleAssessmentDialog({
  open,
  onOpenChange,
  patientId,
  patientName,
  onScheduled
}: ScheduleAssessmentDialogProps) {
  const [assessmentType, setAssessmentType] = useState("")
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [notes, setNotes] = useState("")
  const [reminderEnabled, setReminderEnabled] = useState(true)
  const [reminderDays, setReminderDays] = useState(3)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const minDate = new Date().toISOString().split("T")[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const scheduledAssessment: ScheduledAssessment = {
        patientId,
        assessmentType,
        scheduledDate,
        scheduledTime,
        notes,
        reminderEnabled,
        reminderDays,
      }

      onScheduled?.(scheduledAssessment)

      setAssessmentType("")
      setScheduledDate("")
      setScheduledTime("")
      setNotes("")
      setReminderEnabled(true)
      setReminderDays(3)

      onOpenChange(false)
    } catch (error) {
      console.error("Error scheduling assessment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Assessment
          </DialogTitle>
          <DialogDescription>
            Schedule a future assessment for {patientName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="assessmentType">Assessment Type</Label>
              <Select value={assessmentType} onValueChange={setAssessmentType} required>
                <SelectTrigger id="assessmentType">
                  <SelectValue placeholder="Select assessment type" />
                </SelectTrigger>
                <SelectContent>
                  {assessmentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Date</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={minDate}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledTime">Time</Label>
                <Input
                  id="scheduledTime"
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this assessment..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <Label htmlFor="reminderEnabled" className="text-sm font-medium">
                  Send Reminder
                </Label>
                <input
                  id="reminderEnabled"
                  type="checkbox"
                  checked={reminderEnabled}
                  onChange={(e) => setReminderEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </div>

              {reminderEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="reminderDays" className="text-sm">
                    Remind patient how many days before?
                  </Label>
                  <Select
                    value={reminderDays.toString()}
                    onValueChange={(value) => setReminderDays(parseInt(value))}
                  >
                    <SelectTrigger id="reminderDays">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day before</SelectItem>
                      <SelectItem value="2">2 days before</SelectItem>
                      <SelectItem value="3">3 days before</SelectItem>
                      <SelectItem value="5">5 days before</SelectItem>
                      <SelectItem value="7">7 days before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Scheduling..." : "Schedule Assessment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
