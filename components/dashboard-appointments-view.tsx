"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AppointmentDetailDialog } from "@/components/appointment-detail-dialog"
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

const mockTodayAppointments = [
  {
    id: 1,
    patientId: 1,
    patientName: "Sarah Johnson",
    patientAvatar: "/placeholder.svg?height=32&width=32",
    patientAge: 45,
    date: new Date().toISOString().split("T")[0],
    time: "09:00",
    duration: 60,
    type: "Follow-up",
    status: "confirmed",
    location: "office",
    locationAddress: "123 Medical Center Dr, Suite 400",
    condition: "Major Depression",
    reason: "Depression follow-up, medication adjustment needed",
    priority: "high",
    requestedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    confirmationSentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    calendarSentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastReminderSent: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    patientId: 2,
    patientName: "Michael Chen",
    patientAvatar: "/placeholder.svg?height=32&width=32",
    patientAge: 52,
    date: new Date().toISOString().split("T")[0],
    time: "10:30",
    duration: 45,
    type: "Initial Consultation",
    status: "confirmed",
    location: "telehealth",
    condition: "Anxiety",
    reason: "New patient intake for anxiety management",
    priority: "moderate",
    requestedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    confirmationSentAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    lastReminderSent: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    patientId: 4,
    patientName: "Robert Williams",
    patientAvatar: "/placeholder.svg?height=32&width=32",
    patientAge: 67,
    date: new Date().toISOString().split("T")[0],
    time: "14:00",
    duration: 30,
    type: "Medication Review",
    status: "confirmed",
    location: "office",
    locationAddress: "123 Medical Center Dr, Suite 400",
    condition: "Diabetes + Depression",
    reason: "Quarterly medication review and adjustment",
    priority: "high",
    requestedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    confirmationSentAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    patientId: 9,
    patientName: "Maria Garcia",
    patientAvatar: "/placeholder.svg?height=32&width=32",
    patientAge: 38,
    date: new Date().toISOString().split("T")[0],
    time: "15:30",
    duration: 60,
    type: "Therapy Session",
    status: "pending",
    location: "office",
    locationAddress: "123 Medical Center Dr, Suite 400",
    condition: "Bipolar Disorder",
    reason: "Regular therapy session",
    priority: "moderate",
    requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const mockWeekAppointments = [
  {
    date: new Date().toISOString().split("T")[0],
    dayName: "Today",
    appointments: mockTodayAppointments,
  },
  {
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    dayName: "Tomorrow",
    appointments: [
      {
        id: 5,
        patientId: 1,
        patientName: "Sarah Johnson",
        patientAvatar: "/placeholder.svg?height=32&width=32",
        patientAge: 45,
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        time: "10:00",
        duration: 45,
        type: "Follow-up",
        status: "confirmed",
        location: "telehealth",
        condition: "Major Depression",
      },
      {
        id: 6,
        patientId: 6,
        patientName: "David Thompson",
        patientAvatar: "/placeholder.svg?height=32&width=32",
        patientAge: 58,
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        time: "14:30",
        duration: 60,
        type: "Initial Consultation",
        status: "pending",
        location: "office",
        condition: "Chronic Pain",
      },
    ],
  },
  {
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    dayName: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { weekday: "long" }),
    appointments: [
      {
        id: 7,
        patientId: 13,
        patientName: "Patricia Moore",
        patientAvatar: "/placeholder.svg?height=32&width=32",
        patientAge: 44,
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        time: "11:00",
        duration: 45,
        type: "Therapy Session",
        status: "confirmed",
        location: "office",
        condition: "Social Anxiety",
      },
    ],
  },
  {
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    dayName: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { weekday: "long" }),
    appointments: [
      {
        id: 8,
        patientId: 8,
        patientName: "James Wilson",
        patientAvatar: "/placeholder.svg?height=32&width=32",
        patientAge: 63,
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        time: "09:30",
        duration: 60,
        type: "Follow-up",
        status: "confirmed",
        location: "telehealth",
        condition: "PTSD",
      },
    ],
  },
]

export function DashboardAppointmentsView({ mockPatients }: { mockPatients?: any[] }) {
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [expandedWeekView, setExpandedWeekView] = useState(false)
  const [expandedDay, setExpandedDay] = useState<string | null>(null)

  const handleAppointmentClick = (appointment: any) => {
    setSelectedAppointment(appointment)
    setShowDetailDialog(true)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "pending":
        return "secondary"
      case "completed":
        return "outline"
      default:
        return "outline"
    }
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getCurrentTime = () => {
    const now = new Date()
    return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
  }

  const isCurrentTime = (time: string) => {
    const currentTime = getCurrentTime()
    return time === currentTime.substring(0, 5)
  }

  const isPastAppointment = (date: string, time: string) => {
    const appointmentDateTime = new Date(`${date}T${time}`)
    return appointmentDateTime < new Date()
  }

  const findPatientData = (patientId: number) => {
    if (!mockPatients) return null
    return mockPatients.find((p) => p.id === patientId)
  }

  const totalAppointmentsToday = mockTodayAppointments.length
  const nextAppointment = mockTodayAppointments.find(
    (apt) => !isPastAppointment(apt.date, apt.time)
  ) || mockTodayAppointments[0]

  return (
    <>
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">My Schedule</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {totalAppointmentsToday} appointments today
                  {nextAppointment && ` • Next: ${formatTime(nextAppointment.time)} - ${nextAppointment.patientName}`}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              View Full Calendar
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Today's Appointments</h3>
              <Badge variant="outline">{mockTodayAppointments.length} scheduled</Badge>
            </div>

            {mockTodayAppointments.length === 0 ? (
              <div className="text-center py-12 px-4 bg-muted/30 rounded-lg border border-dashed">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No appointments scheduled for today</p>
                <p className="text-sm text-muted-foreground mt-1">Time to catch up on patient notes!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {mockTodayAppointments.map((appointment) => {
                  const isPast = isPastAppointment(appointment.date, appointment.time)
                  const isCompleted = appointment.status === "completed" || isPast
                  const patientData = findPatientData(appointment.patientId)

                  return (
                    <div
                      key={appointment.id}
                      onClick={() => handleAppointmentClick(appointment)}
                      className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                        appointment.status === "confirmed"
                          ? "border-l-4 border-l-green-500 bg-white"
                          : appointment.status === "pending"
                            ? "border-l-4 border-l-yellow-500 bg-yellow-50"
                            : isCompleted
                              ? "border-l-4 border-l-gray-400 bg-gray-50 opacity-60"
                              : "border-l-4 border-l-blue-500 bg-white"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center min-w-[80px] pt-1">
                        <div className="text-2xl font-bold text-foreground">{formatTime(appointment.time)}</div>
                        <div className="text-xs text-muted-foreground">{appointment.duration} min</div>
                      </div>

                      <div className="h-16 w-1 bg-green-200 rounded-full"></div>

                      <Avatar className="h-12 w-12 mt-1">
                        <AvatarImage src={appointment.patientAvatar || "/placeholder.svg"} alt={appointment.patientName} />
                        <AvatarFallback>
                          {appointment.patientName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className={`font-semibold ${isCompleted ? "line-through" : ""}`}>
                              {appointment.patientName}
                            </h4>
                            <p className="text-sm text-muted-foreground">{appointment.condition}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getStatusBadgeVariant(appointment.status)} className="text-xs">
                              {isCompleted ? "Completed" : appointment.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {appointment.type}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          {appointment.location === "telehealth" ? (
                            <div className="flex items-center gap-1">
                              <Video className="h-4 w-4 text-blue-600" />
                              <span>Telehealth</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-green-600" />
                              <span>Office</span>
                            </div>
                          )}
                          {appointment.priority === "high" && (
                            <div className="flex items-center gap-1 text-red-600">
                              <AlertCircle className="h-4 w-4" />
                              <span className="text-xs font-medium">High Priority</span>
                            </div>
                          )}
                          {isCompleted && (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-xs font-medium">Completed</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div>
            <div
              className="flex items-center justify-between mb-4 cursor-pointer"
              onClick={() => setExpandedWeekView(!expandedWeekView)}
            >
              <h3 className="text-lg font-semibold">This Week Overview</h3>
              <Button variant="ghost" size="sm">
                {expandedWeekView ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Collapse
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Expand
                  </>
                )}
              </Button>
            </div>

            {expandedWeekView && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockWeekAppointments.map((day) => (
                  <Card
                    key={day.date}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      day.dayName === "Today" ? "border-2 border-primary" : ""
                    }`}
                    onClick={() => setExpandedDay(expandedDay === day.date ? null : day.date)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-sm font-semibold">{day.dayName}</CardTitle>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </p>
                        </div>
                        <Badge variant="secondary">{day.appointments.length}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {day.appointments.slice(0, 2).map((apt) => (
                          <div key={apt.id} className="flex items-center gap-2 text-sm">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={apt.patientAvatar || "/placeholder.svg"} alt={apt.patientName} />
                              <AvatarFallback className="text-xs">
                                {apt.patientName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs truncate">{formatTime(apt.time)}</span>
                          </div>
                        ))}
                        {day.appointments.length > 2 && (
                          <p className="text-xs text-muted-foreground">+{day.appointments.length - 2} more</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AppointmentDetailDialog
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        appointment={selectedAppointment}
        patientData={selectedAppointment ? findPatientData(selectedAppointment.patientId) : null}
      />
    </>
  )
}
