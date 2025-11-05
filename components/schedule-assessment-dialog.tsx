"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle2 } from "lucide-react"
import { healthDimensionsConfig } from "@/lib/nsh-assessment-mock"

type ScheduleAssessmentDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientId: number
  patientName: string
  defaultDimension?: string
  onScheduled?: (data: ScheduledAssessment) => void
}

export type ScheduledAssessment = {
  patientId: number
  assessmentType: "full" | "dimensions"
  selectedDimensions: string[]
  scheduledDate: string
  scheduledTime: string
  notes: string
}

export function ScheduleAssessmentDialog({
  open,
  onOpenChange,
  patientId,
  patientName,
  defaultDimension,
  onScheduled
}: ScheduleAssessmentDialogProps) {
  const [assessmentType, setAssessmentType] = useState<"full" | "dimensions">(defaultDimension ? "dimensions" : "full")
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>(defaultDimension ? [defaultDimension] : [])
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const minDate = new Date().toISOString().split("T")[0]

  useEffect(() => {
    if (open && defaultDimension) {
      setAssessmentType("dimensions")
      setSelectedDimensions([defaultDimension])
    }
  }, [open, defaultDimension])

  const toggleDimension = (dimensionId: string) => {
    setSelectedDimensions(prev =>
      prev.includes(dimensionId)
        ? prev.filter(id => id !== dimensionId)
        : [...prev, dimensionId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (assessmentType === "dimensions" && selectedDimensions.length === 0) {
      return
    }

    setIsSubmitting(true)

    try {
      const scheduledAssessment: ScheduledAssessment = {
        patientId,
        assessmentType,
        selectedDimensions: assessmentType === "full" ? [] : selectedDimensions,
        scheduledDate,
        scheduledTime,
        notes,
      }

      onScheduled?.(scheduledAssessment)

      setAssessmentType("full")
      setSelectedDimensions([])
      setScheduledDate("")
      setScheduledTime("")
      setNotes("")

      onOpenChange(false)
    } catch (error) {
      console.error("Error scheduling assessment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Assessment
          </DialogTitle>
          <DialogDescription>
            Schedule a future assessment for {patientName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="space-y-4 py-4 overflow-y-auto flex-1">
            <div className="space-y-3">
              <Label>Assessment Scope</Label>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={assessmentType === "full" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => {
                    setAssessmentType("full")
                    setSelectedDimensions([])
                  }}
                >
                  {assessmentType === "full" && <CheckCircle2 className="h-4 w-4 mr-2" />}
                  Full Assessment
                </Button>
                <Button
                  type="button"
                  variant={assessmentType === "dimensions" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setAssessmentType("dimensions")}
                >
                  {assessmentType === "dimensions" && <CheckCircle2 className="h-4 w-4 mr-2" />}
                  Specific Dimensions
                </Button>
              </div>
            </div>

            {assessmentType === "dimensions" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Select Health Dimensions ({selectedDimensions.length} selected)</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDimensions(healthDimensionsConfig.map(d => d.id))}
                      className="text-xs"
                    >
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDimensions([])}
                      className="text-xs"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg max-h-[200px] overflow-y-auto">
                  {healthDimensionsConfig.map((dimension) => {
                    const isSelected = selectedDimensions.includes(dimension.id)
                    return (
                      <Badge
                        key={dimension.id}
                        variant={isSelected ? "default" : "outline"}
                        className="cursor-pointer hover:opacity-80 transition-opacity px-3 py-1.5"
                        style={
                          isSelected
                            ? {
                                backgroundColor: dimension.color,
                                borderColor: dimension.color,
                              }
                            : {}
                        }
                        onClick={() => toggleDimension(dimension.id)}
                      >
                        {isSelected && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {dimension.name}
                      </Badge>
                    )
                  })}
                </div>
                {assessmentType === "dimensions" && selectedDimensions.length === 0 && (
                  <p className="text-sm text-red-600">Please select at least one dimension</p>
                )}
              </div>
            )}

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
            <Button
              type="submit"
              disabled={isSubmitting || (assessmentType === "dimensions" && selectedDimensions.length === 0)}
            >
              {isSubmitting ? "Scheduling..." : "Schedule Assessment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
