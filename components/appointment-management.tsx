"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  Clock,
  Phone,
  Mail,
  Bell,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Edit,
  Plus,
  Search,
  Download,
  User,
  FileText,
} from "lucide-react"

// Mock data for appointment management
const mockAppointmentRequests = [
  {
    id: 1,
    patientId: 1,
    patientName: "Sarah Johnson",
    patientAvatar: "/placeholder.svg?height=32&width=32",
    requestedDate: "2025-01-30",
    requestedTime: "14:00",
    alternativeDate: "2025-01-31",
    alternativeTime: "10:00",
    appointmentType: "Follow-up",
    reason: "Depression follow-up, medication adjustment needed",
    priority: "high",
    status: "pending",
    requestedAt: "2025-01-20T10:30:00Z",
    condition: "Major Depression",
    lastAppointment: "2025-01-15",
  },
  {
    id: 2,
    patientId: 2,
    patientName: "Michael Chen",
    patientAvatar: "/placeholder.svg?height=32&width=32",
    requestedDate: "2025-02-01",
    requestedTime: "09:00",
    appointmentType: "Initial Consultation",
    reason: "New patient intake for anxiety management",
    priority: "moderate",
    status: "pending",
    requestedAt: "2025-01-19T14:15:00Z",
    condition: "Anxiety",
    lastAppointment: null,
  },
]

const mockAppointmentHistory = [
  {
    id: 1,
    patientId: 1,
    patientName: "Sarah Johnson",
    date: "2025-01-15",
    time: "10:00",
    duration: 60,
    type: "Follow-up",
    status: "completed",
    notes: "Patient showing improvement, medication working well",
    outcome: "Positive response to treatment",
    nextAppointment: "2025-01-30",
  },
  {
    id: 2,
    patientId: 3,
    patientName: "Emily Rodriguez",
    date: "2025-01-12",
    time: "14:30",
    duration: 45,
    type: "Therapy Session",
    status: "completed",
    notes: "CBT techniques discussed, homework assigned",
    outcome: "Good engagement, progress noted",
    nextAppointment: "2025-01-26",
  },
  {
    id: 3,
    patientId: 4,
    patientName: "Robert Williams",
    date: "2025-01-10",
    time: "11:00",
    duration: 30,
    type: "Medication Review",
    status: "no-show",
    notes: "Patient did not attend, attempted contact",
    outcome: "Rescheduling required",
    nextAppointment: null,
  },
]

const mockReminders = [
  {
    id: 1,
    appointmentId: 1,
    patientName: "Sarah Johnson",
    appointmentDate: "2025-01-27",
    appointmentTime: "09:00",
    reminderType: "24-hour",
    status: "sent",
    sentAt: "2025-01-26T09:00:00Z",
    method: "email",
  },
  {
    id: 2,
    appointmentId: 2,
    patientName: "Michael Chen",
    appointmentDate: "2025-01-27",
    appointmentTime: "10:30",
    reminderType: "2-hour",
    status: "pending",
    scheduledFor: "2025-01-27T08:30:00Z",
    method: "sms",
  },
]

export function AppointmentManagement() {
  const [activeTab, setActiveTab] = useState("requests")
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")

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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "pending":
        return "secondary"
      case "cancelled":
        return "destructive"
      case "completed":
        return "outline"
      case "no-show":
        return "destructive"
      default:
        return "outline"
    }
  }

  const renderAppointmentRequests = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Appointment Requests</h3>
          <p className="text-sm text-muted-foreground">
            {mockAppointmentRequests.length} pending requests require your attention
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48"
            />
          </div>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {mockAppointmentRequests.map((request) => (
          <Card key={request.id} className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={request.patientAvatar || "/placeholder.svg"} alt={request.patientName} />
                    <AvatarFallback>
                      {request.patientName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-lg">{request.patientName}</h4>
                      <p className="text-sm text-muted-foreground">{request.condition}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={getPriorityBadgeVariant(request.priority)} className="text-xs">
                          {request.priority} priority
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {request.appointmentType}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-900">Requested Date & Time</p>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(request.requestedDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {request.requestedTime}
                        </div>
                      </div>
                      {request.alternativeDate && (
                        <div>
                          <p className="font-medium text-gray-900">Alternative Option</p>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(request.alternativeDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {request.alternativeTime}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="font-medium text-gray-900 mb-1">Reason for Visit</p>
                      <p className="text-sm text-muted-foreground">{request.reason}</p>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Requested {new Date(request.requestedAt).toLocaleDateString()} at{" "}
                      {new Date(request.requestedAt).toLocaleTimeString()}
                      {request.lastAppointment && (
                        <span> • Last appointment: {new Date(request.lastAppointment).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedRequest(request)
                      setShowScheduleDialog(true)
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Modify
                  </Button>
                  <Button variant="outline" size="sm">
                    <XCircle className="h-4 w-4 mr-2" />
                    Decline
                  </Button>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    View Patient
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderAppointmentHistory = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Appointment History</h3>
          <p className="text-sm text-muted-foreground">Recent appointment records and outcomes</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="no-show">No Show</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAppointmentHistory.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {appointment.patientName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{appointment.patientName}</div>
                        <div className="text-sm text-muted-foreground">ID: {appointment.patientId}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{new Date(appointment.date).toLocaleDateString()}</div>
                      <div className="text-sm text-muted-foreground">{appointment.time}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {appointment.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{appointment.duration} min</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(appointment.status)} className="text-xs">
                      {appointment.status.replace("-", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-48">
                      <p className="text-sm truncate">{appointment.outcome}</p>
                      {appointment.nextAppointment && (
                        <p className="text-xs text-muted-foreground">
                          Next: {new Date(appointment.nextAppointment).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderRemindersNotifications = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Reminders & Notifications</h3>
          <p className="text-sm text-muted-foreground">Manage appointment reminders and patient communications</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Reminder
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Reminder Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm">Default Reminder Times</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">24 hours before</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">2 hours before</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">30 minutes before</span>
                  <input type="checkbox" className="rounded" />
                </div>
              </div>
            </div>
            <div>
              <Label className="text-sm">Preferred Methods</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">SMS</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Phone Call</span>
                  <input type="checkbox" className="rounded" />
                </div>
              </div>
            </div>
            <Button size="sm" className="w-full">
              Save Settings
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Recent Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockReminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {reminder.method === "email" ? (
                        <Mail className="h-4 w-4 text-blue-600" />
                      ) : reminder.method === "sms" ? (
                        <Phone className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Bell className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{reminder.patientName}</p>
                      <p className="text-xs text-muted-foreground">
                        {reminder.reminderType} reminder for {new Date(reminder.appointmentDate).toLocaleDateString()}{" "}
                        at {reminder.appointmentTime}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {reminder.status === "sent"
                          ? `Sent ${new Date(reminder.sentAt!).toLocaleDateString()}`
                          : `Scheduled for ${new Date(reminder.scheduledFor!).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  <Badge variant={reminder.status === "sent" ? "default" : "secondary"} className="text-xs">
                    {reminder.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Appointment Analytics</h3>
        <p className="text-sm text-muted-foreground">Track appointment patterns and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">24</p>
                <p className="text-xs text-green-600">+12% from last week</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Show Rate</p>
                <p className="text-2xl font-bold">92%</p>
                <p className="text-xs text-green-600">+3% improvement</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Duration</p>
                <p className="text-2xl font-bold">52min</p>
                <p className="text-xs text-muted-foreground">Within target</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Utilization</p>
                <p className="text-2xl font-bold">87%</p>
                <p className="text-xs text-yellow-600">Near capacity</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Appointment Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Follow-up</span>
                <div className="flex items-center gap-2">
                  <Progress value={45} className="w-20 h-2" />
                  <span className="text-sm text-muted-foreground">45%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Initial Consultation</span>
                <div className="flex items-center gap-2">
                  <Progress value={25} className="w-20 h-2" />
                  <span className="text-sm text-muted-foreground">25%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Therapy Session</span>
                <div className="flex items-center gap-2">
                  <Progress value={20} className="w-20 h-2" />
                  <span className="text-sm text-muted-foreground">20%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Medication Review</span>
                <div className="flex items-center gap-2">
                  <Progress value={10} className="w-20 h-2" />
                  <span className="text-sm text-muted-foreground">10%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Peak Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">9:00 - 11:00 AM</span>
                <div className="flex items-center gap-2">
                  <Progress value={85} className="w-20 h-2" />
                  <span className="text-sm text-muted-foreground">85%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">2:00 - 4:00 PM</span>
                <div className="flex items-center gap-2">
                  <Progress value={75} className="w-20 h-2" />
                  <span className="text-sm text-muted-foreground">75%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">11:00 AM - 1:00 PM</span>
                <div className="flex items-center gap-2">
                  <Progress value={60} className="w-20 h-2" />
                  <span className="text-sm text-muted-foreground">60%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">4:00 - 6:00 PM</span>
                <div className="flex items-center gap-2">
                  <Progress value={45} className="w-20 h-2" />
                  <span className="text-sm text-muted-foreground">45%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="requests">Requests ({mockAppointmentRequests.length})</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">{renderAppointmentRequests()}</TabsContent>
        <TabsContent value="history">{renderAppointmentHistory()}</TabsContent>
        <TabsContent value="reminders">{renderRemindersNotifications()}</TabsContent>
        <TabsContent value="analytics">{renderAnalytics()}</TabsContent>
      </Tabs>

      {/* Schedule Appointment Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Appointment</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={selectedRequest.patientAvatar || "/placeholder.svg"}
                    alt={selectedRequest.patientName}
                  />
                  <AvatarFallback>
                    {selectedRequest.patientName
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{selectedRequest.patientName}</h4>
                  <p className="text-sm text-muted-foreground">{selectedRequest.condition}</p>
                  <Badge variant={getPriorityBadgeVariant(selectedRequest.priority)} className="text-xs mt-1">
                    {selectedRequest.priority} priority
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Appointment Date</Label>
                  <Input type="date" defaultValue={selectedRequest.requestedDate} />
                </div>
                <div>
                  <Label>Appointment Time</Label>
                  <Select defaultValue={selectedRequest.requestedTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="14:00">2:00 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                      <SelectItem value="16:00">4:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Duration</Label>
                  <Select defaultValue="60">
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
                <div>
                  <Label>Location</Label>
                  <Select defaultValue="office">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="telehealth">Telehealth</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Appointment Notes</Label>
                <Textarea placeholder="Add any notes for this appointment..." defaultValue={selectedRequest.reason} />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Send Confirmation</Label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Email confirmation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">SMS confirmation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Calendar invite</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowScheduleDialog(false)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Appointment
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
