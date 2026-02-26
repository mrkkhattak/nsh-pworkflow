"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  Mail,
  FileText,
  AlertTriangle,
  CheckCircle,
  Edit,
  XCircle,
  Activity,
} from "lucide-react"

interface AppointmentDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: any
  patientData?: any
}

export function AppointmentDetailDialog({
  open,
  onOpenChange,
  appointment,
  patientData,
}: AppointmentDetailDialogProps) {
  if (!appointment) return null

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "pending":
        return "secondary"
      case "completed":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
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

  const getRiskBadgeVariant = (riskLevel: string) => {
    if (riskLevel === "Critical" || riskLevel === "High Risk") return "destructive"
    if (riskLevel === "Moderate Risk") return "secondary"
    return "outline"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const isWithinStartWindow = () => {
    const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`)
    const now = new Date()
    const diffMinutes = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60)
    return diffMinutes <= 15 && diffMinutes >= -5
  }

  const hasRecentReminder = () => {
    if (!appointment.lastReminderSent) return false
    const lastReminder = new Date(appointment.lastReminderSent)
    const hoursSince = (new Date().getTime() - lastReminder.getTime()) / (1000 * 60 * 60)
    return hoursSince < 24
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl">{appointment.type}</DialogTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={getStatusBadgeVariant(appointment.status)}>{appointment.status}</Badge>
                {appointment.priority && (
                  <Badge variant={getPriorityBadgeVariant(appointment.priority)}>
                    {appointment.priority} priority
                  </Badge>
                )}
                {appointment.location === "telehealth" && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Video className="h-3 w-3 mr-1" />
                    Telehealth
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-5 w-5" />
            <span className="font-medium">{formatDate(appointment.date)}</span>
            <Clock className="h-5 w-5 ml-3" />
            <span className="font-medium">
              {formatTime(appointment.time)} ({appointment.duration} min)
            </span>
          </div>

          <Separator />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Patient Information
                </h3>
                <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg border">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={appointment.patientAvatar || "/placeholder.svg"} alt={appointment.patientName} />
                    <AvatarFallback className="text-lg">
                      {appointment.patientName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <h4 className="font-semibold text-lg">{appointment.patientName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {patientData?.age || appointment.patientAge}y • {patientData?.condition || appointment.condition}
                    </p>
                    {patientData && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-medium">Health Index:</span>
                          <Badge variant={getRiskBadgeVariant(patientData.riskLevel || "")}>
                            {patientData.healthIndexScore}
                          </Badge>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span className="text-xs">{appointment.patientPhone || "(555) 123-4567"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span className="text-xs">{appointment.patientEmail || "patient@email.com"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <FileText className="h-4 w-4 mr-2" />
                  View Full Patient Chart
                </Button>
              </div>

              {patientData && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Clinical Summary
                  </h3>
                  <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">PHQ-9 Score:</span>
                      <span className="font-medium">{patientData.phq9Score || "N/A"}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Risk Level:</span>
                      <Badge variant={getRiskBadgeVariant(patientData.riskLevel || "")}>
                        {patientData.riskLevel || "Unknown"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Open Tasks:</span>
                      <span className="font-medium">{patientData.tasksOpen || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Active Goals:</span>
                      <span className="font-medium">{patientData.goalsOpen || 0}</span>
                    </div>
                    {patientData.flagsSummary && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-2">Critical Flags:</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Strengths: {patientData.flagsSummary.strength}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Moderate: {patientData.flagsSummary.moderate}
                          </Badge>
                          <Badge variant="destructive" className="text-xs">
                            Critical: {patientData.flagsSummary.critical}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Appointment Details
                </h3>
                <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
                  <div className="flex items-start gap-3">
                    {appointment.location === "telehealth" ? (
                      <Video className="h-5 w-5 text-blue-600 mt-0.5" />
                    ) : (
                      <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {appointment.location === "telehealth" ? "Telehealth Video Call" : "Office Visit"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {appointment.location === "telehealth"
                          ? "Video link will be available 15 minutes before appointment"
                          : appointment.locationAddress || "123 Medical Center Dr, Suite 400, City, ST 12345"}
                      </p>
                    </div>
                  </div>

                  {appointment.reason && (
                    <div className="pt-3 border-t">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Reason for Visit:</p>
                      <p className="text-sm">{appointment.reason}</p>
                    </div>
                  )}

                  {appointment.notes && (
                    <div className="pt-3 border-t">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Provider Notes:</p>
                      <p className="text-sm">{appointment.notes}</p>
                    </div>
                  )}

                  {patientData?.lastAppointment && (
                    <div className="pt-3 border-t">
                      <p className="text-xs text-muted-foreground">
                        Last Appointment:{" "}
                        <span className="font-medium">
                          {new Date(patientData.lastAppointment).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Communication History
                </h3>
                <div className="space-y-2 p-4 bg-muted/30 rounded-lg border">
                  <div className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">Appointment Request Received</p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.requestedAt
                          ? new Date(appointment.requestedAt).toLocaleDateString()
                          : "3 days ago"}
                      </p>
                    </div>
                  </div>

                  {appointment.status === "confirmed" && (
                    <>
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium">Email Confirmation Sent</p>
                          <p className="text-xs text-muted-foreground">
                            {appointment.confirmationSentAt
                              ? new Date(appointment.confirmationSentAt).toLocaleDateString()
                              : "2 days ago"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium">Calendar Invite Sent</p>
                          <p className="text-xs text-muted-foreground">
                            {appointment.calendarSentAt
                              ? new Date(appointment.calendarSentAt).toLocaleDateString()
                              : "2 days ago"}
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {appointment.lastReminderSent && (
                    <div className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">24-Hour Reminder Sent</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(appointment.lastReminderSent).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {!hasRecentReminder() && appointment.status === "confirmed" && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Activity className="h-4 w-4 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">2-Hour Reminder Pending</p>
                        <p className="text-xs">Will be sent automatically</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-end gap-3 flex-wrap">
            {isWithinStartWindow() && appointment.status === "confirmed" && (
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Start Appointment
              </Button>
            )}

            {appointment.location === "telehealth" && appointment.status === "confirmed" && (
              <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                <Video className="h-4 w-4 mr-2" />
                Join Telehealth Call
              </Button>
            )}

            {!hasRecentReminder() && appointment.status === "confirmed" && (
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Send Reminder
              </Button>
            )}

            {appointment.status === "pending" && (
              <Button variant="default">
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Appointment
              </Button>
            )}

            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Reschedule
            </Button>

            {appointment.status !== "completed" && appointment.status !== "cancelled" && (
              <>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Add Pre-Visit Notes
                </Button>

                {new Date(`${appointment.date}T${appointment.time}`) < new Date() && (
                  <Button variant="default">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Completed
                  </Button>
                )}

                <Button variant="destructive">
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Appointment
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
