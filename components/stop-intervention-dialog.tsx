"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StopCircle } from "lucide-react"
import type { Intervention, DimensionIntervention } from "@/lib/intervention-service"
import { getInterventionDisplayName } from "@/lib/intervention-service"

interface StopInterventionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  intervention: Intervention | DimensionIntervention | null
  onConfirm: (stoppedDate: string, stoppedReason: string) => void
}

export function StopInterventionDialog({
  open,
  onOpenChange,
  intervention,
  onConfirm,
}: StopInterventionDialogProps) {
  const [stoppedDate, setStoppedDate] = useState<string>(new Date().toISOString().slice(0, 10))
  const [stoppedReason, setStoppedReason] = useState("")

  const handleConfirm = () => {
    if (!stoppedReason.trim() || !intervention) return
    onConfirm(stoppedDate, stoppedReason.trim())
    setStoppedReason("")
    setStoppedDate(new Date().toISOString().slice(0, 10))
  }

  const handleClose = () => {
    setStoppedReason("")
    setStoppedDate(new Date().toISOString().slice(0, 10))
    onOpenChange(false)
  }

  if (!intervention) return null

  const startDate = 'date' in intervention ? intervention.date : intervention.start_date
  const displayName = getInterventionDisplayName(intervention)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Stop Intervention</DialogTitle>
          <DialogDescription>
            Stop the intervention: <strong>{displayName}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="stop-date">Stop Date</Label>
            <Input
              id="stop-date"
              type="date"
              value={stoppedDate}
              onChange={(e) => setStoppedDate(e.target.value)}
              min={startDate}
              max={new Date().toISOString().slice(0, 10)}
            />
            <p className="text-xs text-gray-500">
              Date must be between start date and today
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="stop-reason">Reason for Stopping</Label>
            <Textarea
              id="stop-reason"
              value={stoppedReason}
              onChange={(e) => setStoppedReason(e.target.value)}
              placeholder="Enter reason (e.g., side effects, patient request, treatment completed, etc.)"
              className="min-h-24"
              maxLength={500}
            />
            <p className="text-xs text-gray-500">{stoppedReason.length}/500 characters</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!stoppedReason.trim()}
            className="bg-red-600 hover:bg-red-700"
          >
            <StopCircle className="h-4 w-4 mr-2" />
            Stop Intervention
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
