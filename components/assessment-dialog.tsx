"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { AssessmentDetail } from "@/components/assessment/assessment-detail"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Assessment, Patient } from "@/lib/nsh-assessment-mock"

type AssessmentDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient: Patient | null
  assessment: Assessment | null
}

export function AssessmentDialog({ open, onOpenChange, patient, assessment }: AssessmentDialogProps) {
  if (!patient || !assessment) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 gap-0">
        <ScrollArea className="h-full w-full">
          <AssessmentDetail patient={patient} assessment={assessment} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
