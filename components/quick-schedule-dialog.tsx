"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Video, CheckCircle } from "lucide-react"

interface QuickScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient?: {
    id: number
    name: string
    avatar?: string
    condition: string
    riskLevel: string
  }
  onScheduled?: () => void
}

const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
]

export function QuickScheduleDialog({ open, onOpenChange, patient, onScheduled }: QuickScheduleDialogProps) {
  const [appointmentData, setAppointmentData] = useState({
    date: "",
    time: "",
    duration: "60",
    type: "",
    location: "office",
    notes: "",
  })

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "high":
        return "destructive"
      case "moderate":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const handleSchedule = () => {
    // Here you would typically make an API call to schedule the appointment
    console.log("Scheduling appointment:", { patient, ...appointmentData })
    onScheduled?.()
    onOpenChange(false)

    // Reset form
    setAppointmentData({
      date: "",
      time: "",
      duration: "60",
      type: "",
      location: "office",
      notes: "",
    })
  }

  const getNextAvailableDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Appointment
          </DialogTitle>
        </DialogHeader>

        {patient && (
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-6">
            <Avatar className="h-12 w-12">
              <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
              <AvatarFallback>
                {patient.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-lg">{patient.name}</h4>
              <p className="text-sm text-muted-foreground">{patient.condition}</p>
              <Badge variant={getRiskBadgeVariant(patient.riskLevel)} className="text-xs mt-1">
                {patient.riskLevel} risk
              </Badge>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Appointment Date</Label>
              <Input
                id="date"
                type="date"
                value={appointmentData.date}
                onChange={(e) => setAppointmentData((prev) => ({ ...prev, date: e.target.value }))}
                min={getNextAvailableDate()}
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Select
                value={appointmentData.time}
                onValueChange={(value) => setAppointmentData((prev) => ({ ...prev, time: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Appointment Type</Label>
              <Select
                value={appointmentData.type}
                onValueChange={(value) => setAppointmentData((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="initial">Initial Consultation</SelectItem>
                  <SelectItem value="followup">Follow-up</SelectItem>
                  <SelectItem value="therapy">Therapy Session</SelectItem>
                  <SelectItem value="medication">Medication Review</SelectItem>
                  <SelectItem value="assessment">Assessment</SelectItem>
                  <SelectItem value="urgent">Urgent Consultation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Select
                value={appointmentData.duration}
                onValueChange={(value) => setAppointmentData((prev) => ({ ...prev, duration: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Select
              value={appointmentData.location}
              onValueChange={(value) => setAppointmentData((prev) => ({ ...prev, location: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="office">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Office Visit
                  </div>
                </SelectItem>
                <SelectItem value="telehealth">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Telehealth
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Appointment Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes or special instructions for this appointment..."
              value={appointmentData.notes}
              onChange={(e) => setAppointmentData((prev) => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Notifications</Label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Send email confirmation</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Send SMS reminder</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Add to patient calendar</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSchedule}
              disabled={!appointmentData.date || !appointmentData.time || !appointmentData.type}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
