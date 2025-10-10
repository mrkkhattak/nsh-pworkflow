"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { TaskKanbanBoard } from "@/components/task-kanban-board"
import { PatientAssessmentTracking } from "@/components/patient-assessment-tracking"
import { MessagingCollaboration } from "@/components/messaging-collaboration"
import { TeamManagement } from "@/components/team-management"
import { AnalyticsCohortManagement } from "@/components/analytics-cohort-management"
import ReferralManagement from "@/components/referral-management"
import { SideNavigation } from "@/components/side-navigation"
import { PatientDetailView } from "@/components/patient-detail-view"
import { QuickScheduleDialog } from "@/components/quick-schedule-dialog"
import { useToast } from "@/hooks/use-toast"
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  Download,
  Filter,
  MessageSquare,
  Search,
  Users,
  XCircle,
  Activity,
  FileText,
} from "lucide-react"

type PatientStatus = "completed" | "pending" | "not-responded" | "denied"
type PatientClassification = "new" | "recurrent"
type DateRange = "last5d" | "1w" | "1m" | "3m" | "6m" | "12m"

interface Patient {
  id: number
  name: string
  avatar: string
  lastAssessmentDate: string
  classification: PatientClassification
  status: PatientStatus
  healthIndexScore: number
  flagsSummary: { strength: number; moderate: number; critical: number }
  tasksOpen: number
  tasksClosed: number
  goalsOpen: number
  goalsClosed: number
  actionItemsOpen: number
  actionItemsClosed: number
  unreadMessages: number
  age: number
  condition: string
  phq9Score: number
  nextAppointment: string
  riskLevel?: string
}

interface RiskAlert {
  id: number
  patient: string
  type: string
  description: string
  action: string
}

const mockPatients: Patient[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=32&width=32",
    lastAssessmentDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    classification: "recurrent",
    status: "completed",
    healthIndexScore: 72,
    flagsSummary: { strength: 2, moderate: 1, critical: 0 },
    tasksOpen: 3,
    tasksClosed: 7,
    goalsOpen: 1,
    goalsClosed: 3,
    actionItemsOpen: 2,
    actionItemsClosed: 5,
    unreadMessages: 2,
    age: 45,
    condition: "Major Depression",
    phq9Score: 18,
    nextAppointment: "Tomorrow 2:00 PM",
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=32&width=32",
    lastAssessmentDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    classification: "new",
    status: "pending",
    healthIndexScore: 48,
    flagsSummary: { strength: 1, moderate: 2, critical: 1 },
    tasksOpen: 1,
    tasksClosed: 12,
    goalsOpen: 2,
    goalsClosed: 1,
    actionItemsOpen: 3,
    actionItemsClosed: 6,
    unreadMessages: 0,
    age: 52,
    condition: "Hypertension",
    phq9Score: 8,
    nextAppointment: "Friday 10:00 AM",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    avatar: "/placeholder.svg?height=32&width=32",
    lastAssessmentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    classification: "new",
    status: "not-responded",
    healthIndexScore: 83,
    flagsSummary: { strength: 3, moderate: 0, critical: 0 },
    tasksOpen: 0,
    tasksClosed: 5,
    goalsOpen: 0,
    goalsClosed: 4,
    actionItemsOpen: 1,
    actionItemsClosed: 3,
    unreadMessages: 1,
    age: 34,
    condition: "Anxiety",
    phq9Score: 5,
    nextAppointment: "Next week",
  },
  {
    id: 4,
    name: "Robert Williams",
    avatar: "/placeholder.svg?height=32&width=32",
    lastAssessmentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    classification: "recurrent",
    status: "denied",
    healthIndexScore: 29,
    flagsSummary: { strength: 0, moderate: 1, critical: 3 },
    tasksOpen: 2,
    tasksClosed: 3,
    goalsOpen: 3,
    goalsClosed: 0,
    actionItemsOpen: 4,
    actionItemsClosed: 1,
    unreadMessages: 4,
    age: 67,
    condition: "Diabetes + Depression",
    phq9Score: 16,
    nextAppointment: "Today 4:00 PM",
  },
  {
    id: 5,
    name: "Jennifer Martinez",
    avatar: "/placeholder.svg?height=32&width=32",
    lastAssessmentDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    classification: "new",
    status: "completed",
    healthIndexScore: 88,
    flagsSummary: { strength: 4, moderate: 0, critical: 0 },
    tasksOpen: 1,
    tasksClosed: 8,
    goalsOpen: 0,
    goalsClosed: 5,
    actionItemsOpen: 0,
    actionItemsClosed: 7,
    unreadMessages: 0,
    age: 29,
    condition: "Mild Anxiety",
    phq9Score: 3,
    nextAppointment: "Next Monday",
  },
  {
    id: 6,
    name: "David Thompson",
    avatar: "/placeholder.svg?height=32&width=32",
    lastAssessmentDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    classification: "recurrent",
    status: "pending",
    healthIndexScore: 55,
    flagsSummary: { strength: 1, moderate: 3, critical: 1 },
    tasksOpen: 4,
    tasksClosed: 6,
    goalsOpen: 3,
    goalsClosed: 2,
    actionItemsOpen: 5,
    actionItemsClosed: 4,
    unreadMessages: 1,
    age: 58,
    condition: "Chronic Pain",
    phq9Score: 12,
    nextAppointment: "Thursday 3:00 PM",
  },
  {
    id: 7,
    name: "Lisa Anderson",
    avatar: "/placeholder.svg?height=32&width=32",
    lastAssessmentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    classification: "new",
    status: "not-responded",
    healthIndexScore: 62,
    flagsSummary: { strength: 2, moderate: 1, critical: 0 },
    tasksOpen: 2,
    tasksClosed: 4,
    goalsOpen: 1,
    goalsClosed: 2,
    actionItemsOpen: 3,
    actionItemsClosed: 2,
    unreadMessages: 0,
    age: 41,
    condition: "Depression",
    phq9Score: 14,
    nextAppointment: "Not scheduled",
  },
  {
    id: 8,
    name: "James Wilson",
    avatar: "/placeholder.svg?height=32&width=32",
    lastAssessmentDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    classification: "recurrent",
    status: "completed",
    healthIndexScore: 76,
    flagsSummary: { strength: 3, moderate: 1, critical: 0 },
    tasksOpen: 2,
    tasksClosed: 9,
    goalsOpen: 1,
    goalsClosed: 4,
    actionItemsOpen: 1,
    actionItemsClosed: 6,
    unreadMessages: 1,
    age: 63,
    condition: "PTSD",
    phq9Score: 9,
    nextAppointment: "Next Tuesday",
  },
  {
    id: 9,
    name: "Maria Garcia",
    avatar: "/placeholder.svg?height=32&width=32",
    lastAssessmentDate: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    classification: "new",
    status: "pending",
    healthIndexScore: 41,
    flagsSummary: { strength: 0, moderate: 2, critical: 2 },
    tasksOpen: 5,
    tasksClosed: 3,
    goalsOpen: 4,
    goalsClosed: 1,
    actionItemsOpen: 6,
    actionItemsClosed: 2,
    unreadMessages: 3,
    age: 38,
    condition: "Bipolar Disorder",
    phq9Score: 19,
    nextAppointment: "Tomorrow 11:00 AM",
  },
  {
    id: 10,
    name: "Christopher Lee",
    avatar: "/placeholder.svg?height=32&width=32",
    lastAssessmentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    classification: "recurrent",
    status: "denied",
    healthIndexScore: 35,
    flagsSummary: { strength: 0, moderate: 2, critical: 2 },
    tasksOpen: 3,
    tasksClosed: 2,
    goalsOpen: 2,
    goalsClosed: 1,
    actionItemsOpen: 4,
    actionItemsClosed: 1,
    unreadMessages: 2,
    age: 55,
    condition: "Substance Abuse",
    phq9Score: 20,
    nextAppointment: "Declined",
  },
  {
    id: 11,
    name: "Amanda Brown",
    avatar: "/placeholder.svg?height=32&width=32",
    lastAssessmentDate: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    classification: "new",
    status: "completed",
    healthIndexScore: 91,
    flagsSummary: { strength: 5, moderate: 0, critical: 0 },
    tasksOpen: 0,
    tasksClosed: 10,
    goalsOpen: 0,
    goalsClosed: 6,
    actionItemsOpen: 0,
    actionItemsClosed: 8,
    unreadMessages: 0,
    age: 27,
    condition: "Stress Management",
    phq9Score: 2,
    nextAppointment: "Next month",
  },
  {
    id: 12,
    name: "Daniel Taylor",
    avatar: "/placeholder.svg?height=32&width=32",
    lastAssessmentDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    classification: "recurrent",
    status: "not-responded",
    healthIndexScore: 58,
    flagsSummary: { strength: 1, moderate: 2, critical: 1 },
    tasksOpen: 3,
    tasksClosed: 5,
    goalsOpen: 2,
    goalsClosed: 2,
    actionItemsOpen: 4,
    actionItemsClosed: 3,
    unreadMessages: 0,
    age: 49,
    condition: "GAD",
    phq9Score: 11,
    nextAppointment: "Not scheduled",
  },
  {
    id: 13,
    name: "Patricia Moore",
    avatar: "/placeholder.svg?height=32&width=32",
    lastAssessmentDate: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    classification: "new",
    status: "pending",
    healthIndexScore: 67,
    flagsSummary: { strength: 2, moderate: 1, critical: 0 },
    tasksOpen: 2,
    tasksClosed: 7,
    goalsOpen: 1,
    goalsClosed: 3,
    actionItemsOpen: 2,
    actionItemsClosed: 5,
    unreadMessages: 1,
    age: 44,
    condition: "Social Anxiety",
    phq9Score: 10,
    nextAppointment: "Friday 2:00 PM",
  },
  {
    id: 14,
    name: "Kevin Jackson",
    avatar: "/placeholder.svg?height=32&width=32",
    lastAssessmentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    classification: "recurrent",
    status: "denied",
    healthIndexScore: 32,
    flagsSummary: { strength: 0, moderate: 1, critical: 3 },
    tasksOpen: 4,
    tasksClosed: 1,
    goalsOpen: 3,
    goalsClosed: 0,
    actionItemsOpen: 5,
    actionItemsClosed: 0,
    unreadMessages: 5,
    age: 61,
    condition: "Severe Depression",
    phq9Score: 22,
    nextAppointment: "Refused",
  },
  {
    id: 15,
    name: "Nancy White",
    avatar: "/placeholder.svg?height=32&width=32",
    lastAssessmentDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    classification: "new",
    status: "completed",
    healthIndexScore: 79,
    flagsSummary: { strength: 3, moderate: 1, critical: 0 },
    tasksOpen: 1,
    tasksClosed: 6,
    goalsOpen: 0,
    goalsClosed: 3,
    actionItemsOpen: 1,
    actionItemsClosed: 4,
    unreadMessages: 0,
    age: 36,
    condition: "Panic Disorder",
    phq9Score: 7,
    nextAppointment: "Next Wednesday",
  },
]

const riskAlerts: RiskAlert[] = [
  {
    id: 1,
    patient: "Sarah Johnson",
    type: "High Health Index",
    description: "Health Index Score is above 70.",
    action: "Review Assessment",
  },
  {
    id: 2,
    patient: "Robert Williams",
    type: "Critical Flags",
    description: "Patient has 3 critical flags.",
    action: "Immediate Follow-up",
  },
]

export function ProviderDashboard() {
  const [selectedStatus, setSelectedStatus] = useState<PatientStatus | "all">("all")
  const [selectedCardStatus, setSelectedCardStatus] = useState<PatientStatus | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPatients, setSelectedPatients] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showPatientDetail, setShowPatientDetail] = useState(false)
  const [detailPatientId, setDetailPatientId] = useState<number | null>(null)
  const [showQuickSchedule, setShowQuickSchedule] = useState(false)
  const [selectedPatientForScheduling, setSelectedPatientForScheduling] = useState<Patient | null>(null)
  const [classificationFilter, setClassificationFilter] = useState<"all" | PatientClassification>("all")
  const [dateRange, setDateRange] = useState<DateRange>("last5d")
  const [remindersSent, setRemindersSent] = useState<Record<number, number>>({})
  const [selectedConversationId, setSelectedConversationId] = useState<number | undefined>(undefined)

  const { toast } = useToast()

  const interpretHealthIndex = (score: number): string => {
    if (score < 30) return "Critical"
    if (score < 60) return "High Risk"
    if (score < 75) return "Moderate Risk"
    if (score < 90) return "Low Risk"
    return "Optimal"
  }

  const formatRelative = (iso: string): string => {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins} min ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`
    const days = Math.floor(hrs / 24)
    return `${days} day${days > 1 ? "s" : ""} ago`
  }

  const getRangeStart = (key: DateRange): Date => {
    const now = new Date()
    switch (key) {
      case "last5d": {
        const d = new Date(now)
        d.setDate(d.getDate() - 4)
        d.setHours(0, 1, 0, 0)
        return d
      }
      case "1w": {
        const d = new Date(now)
        d.setDate(d.getDate() - 7)
        return d
      }
      case "1m": {
        const d = new Date(now)
        d.setMonth(d.getMonth() - 1)
        return d
      }
      case "3m": {
        const d = new Date(now)
        d.setMonth(d.getMonth() - 3)
        return d
      }
      case "6m": {
        const d = new Date(now)
        d.setMonth(d.getMonth() - 6)
        return d
      }
      case "12m": {
        const d = new Date(now)
        d.setFullYear(d.getFullYear() - 1)
        return d
      }
    }
  }

  const getStatusBadgeVariant = (status: PatientStatus) => {
    switch (status) {
      case "completed":
        return "default"
      case "pending":
        return "secondary"
      case "not-responded":
        return "outline"
      case "denied":
        return "destructive"
      default:
        return "outline"
    }
  }

  const canSendReminder = (patientId: number): boolean => {
    const last = remindersSent[patientId]
    if (!last) return true
    return Date.now() - last > 24 * 60 * 60 * 1000
  }

  const handleSendReminder = (patientId: number, patientName: string) => {
    if (!canSendReminder(patientId)) {
      const last = remindersSent[patientId]
      toast({
        title: "Reminder throttled",
        description: `A reminder was already sent ${formatRelative(new Date(last).toISOString())}. Try again later.`,
        variant: "default",
      })
      return
    }
    setRemindersSent((prev) => ({ ...prev, [patientId]: Date.now() }))
    toast({
      title: "Reminder sent",
      description: `Reminder sent to ${patientName} via preferred channel.`,
    })
  }

  const safeWindowStart = (() => {
    try {
      const d = getRangeStart(dateRange)
      if (!d || isNaN(d.getTime())) throw new Error("invalid date")
      return d
    } catch {
      toast({ title: "Using default time range", description: "Using 7-day window (UTC)." })
      const f = new Date()
      f.setDate(f.getDate() - 7)
      f.setHours(0, 0, 0, 0)
      return f
    }
  })()

  const filteredPatients = mockPatients.filter((patient) => {
    const matchesStatus = selectedCardStatus === "all" || patient.status === selectedCardStatus
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesClass = classificationFilter === "all" || patient.classification === classificationFilter
    const withinRange = new Date(patient.lastAssessmentDate) >= safeWindowStart
    return matchesStatus && matchesSearch && matchesClass && withinRange
  })

  const statusCounts = {
    completed: mockPatients.filter((p) => p.status === "completed").length,
    pending: mockPatients.filter((p) => p.status === "pending").length,
    "not-responded": mockPatients.filter((p) => p.status === "not-responded").length,
    denied: mockPatients.filter((p) => p.status === "denied").length,
  }

  const handleViewPatientDetail = (patientId: number) => {
    setDetailPatientId(patientId)
    setShowPatientDetail(true)
  }

  const handleBackToPatients = () => {
    setShowPatientDetail(false)
    setDetailPatientId(null)
  }

  const handleQuickSchedule = (patient: Patient) => {
    setSelectedPatientForScheduling(patient)
    setShowQuickSchedule(true)
  }

  const handleTeamMemberMessage = (memberId: number) => {
    const conversationMap: Record<number, number> = {
      1: 2,
      2: 3,
      3: 5,
      4: 6,
    }

    const conversationId = conversationMap[memberId]
    if (conversationId) {
      setSelectedConversationId(conversationId)
      setActiveTab("messaging")
    }
  }

  const handleCardClick = (status: PatientStatus | "all") => {
    setSelectedCardStatus(status)
  }

  const renderDashboardOverview = () => (
    <div className="space-y-8">
      {riskAlerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-red-700 text-lg font-semibold">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5" />
              </div>
              High Priority Alerts ({riskAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {riskAlerts.map((alert) => (
              <div key={alert.id} className="p-4 bg-white rounded-lg border border-red-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <h4 className="font-medium text-red-900">
                      {alert.patient} - {alert.type}
                    </h4>
                    <p className="text-sm text-red-700">{alert.description}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" className="text-xs bg-transparent">
                      View Details
                    </Button>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white text-xs">
                      {alert.action}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                <p className="text-3xl font-semibold text-foreground">{mockPatients.length}</p>
                <p className="text-xs text-muted-foreground">Active in care</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Assessments Due</p>
                <p className="text-3xl font-semibold text-foreground">{statusCounts.pending}</p>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">High Risk</p>
                <p className="text-3xl font-semibold text-red-600">
                  {mockPatients.filter((p) => p.healthIndexScore < 60).length}
                </p>
                <p className="text-xs text-muted-foreground">Need immediate attention</p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Unread Messages</p>
                <p className="text-3xl font-semibold text-foreground">
                  {mockPatients.reduce((sum, p) => sum + p.unreadMessages, 0)}
                </p>
                <p className="text-xs text-muted-foreground">From patients</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderPatientsView = () => (
    <Card className="border-border">
      <CardHeader className="pb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <CardTitle className="text-2xl lg:text-4xl font-semibold text-foreground tracking-tight">
              Patient Assessment Pipeline
            </CardTitle>
            <CardDescription className="text-base">
              Manage patient assessments and track completion status
            </CardDescription>
            <div className="text-xs text-muted-foreground">Last updated: today • Default window: last 5 days</div>
          </div>
          <Button variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-3 p-4 bg-muted/30 rounded-lg border border-border">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={dateRange} onValueChange={(v: DateRange) => setDateRange(v)}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last5d">Last 5 days (default)</SelectItem>
                <SelectItem value="1w">Last 1 week</SelectItem>
                <SelectItem value="1m">Last 1 month</SelectItem>
                <SelectItem value="3m">Last 3 months</SelectItem>
                <SelectItem value="6m">Last 6 months</SelectItem>
                <SelectItem value="12m">Last 12 months</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={classificationFilter}
              onValueChange={(v: "all" | PatientClassification) => setClassificationFilter(v)}
            >
              <SelectTrigger className="w-full lg:w-[160px]">
                <SelectValue placeholder="Patient type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patients</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="recurrent">Recurrent</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" className="w-full lg:w-auto bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            className={`cursor-pointer transition-all ${
              selectedCardStatus === "completed"
                ? "bg-green-100 border-green-400 border-2 shadow-md"
                : "bg-green-50 border-green-200 hover:border-green-300"
            }`}
            onClick={() => handleCardClick("completed")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-green-800">Completed</p>
                  <p className="text-2xl font-semibold text-green-900">{statusCounts.completed}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              selectedCardStatus === "pending"
                ? "bg-amber-100 border-amber-400 border-2 shadow-md"
                : "bg-amber-50 border-amber-200 hover:border-amber-300"
            }`}
            onClick={() => handleCardClick("pending")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-amber-800">Pending</p>
                  <p className="text-2xl font-semibold text-amber-900">{statusCounts.pending}</p>
                </div>
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              selectedCardStatus === "not-responded"
                ? "bg-blue-100 border-blue-400 border-2 shadow-md"
                : "bg-blue-50 border-blue-200 hover:border-blue-300"
            }`}
            onClick={() => handleCardClick("not-responded")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-800">Not Responded</p>
                  <p className="text-2xl font-semibold text-blue-900">{statusCounts["not-responded"]}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              selectedCardStatus === "denied"
                ? "bg-red-100 border-red-400 border-2 shadow-md"
                : "bg-red-50 border-red-200 hover:border-red-300"
            }`}
            onClick={() => handleCardClick("denied")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-red-800">Denied</p>
                  <p className="text-2xl font-semibold text-red-900">{statusCounts.denied}</p>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedCardStatus !== "all" && (
          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
            <span className="text-sm font-medium">
              Showing {filteredPatients.length} {selectedCardStatus.replace("-", " ")} patient(s)
            </span>
            <Button variant="outline" size="sm" onClick={() => handleCardClick("all")}>
              Clear Filter
            </Button>
          </div>
        )}

        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12 font-semibold">
                    <input type="checkbox" className="rounded border-border" />
                  </TableHead>
                  <TableHead className="font-semibold">Patient</TableHead>
                  <TableHead className="font-semibold">Last Assessment</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Health Index</TableHead>
                  <TableHead className="font-semibold">Tasks</TableHead>
                  <TableHead className="font-semibold">Goals</TableHead>
                  <TableHead className="font-semibold">Action Items</TableHead>
                  <TableHead className="font-semibold">Flags</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => {
                  const healthScore = patient.healthIndexScore
                  const healthLabel = interpretHealthIndex(healthScore)
                  const reminderAllowed =
                    (patient.status === "pending" || patient.status === "not-responded") && canSendReminder(patient.id)
                  const lastReminderAt = remindersSent[patient.id]

                  return (
                    <TableRow
                      key={patient.id}
                      className="hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleViewPatientDetail(patient.id)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="rounded border-border"
                          checked={selectedPatients.includes(patient.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPatients([...selectedPatients, patient.id])
                            } else {
                              setSelectedPatients(selectedPatients.filter((id) => id !== patient.id))
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                            <AvatarFallback className="text-xs">
                              {patient.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{patient.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {patient.age}y • {patient.condition}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatRelative(patient.lastAssessmentDate)}</div>
                        {patient.phq9Score && (
                          <div className="text-xs text-muted-foreground">PHQ-9: {patient.phq9Score}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(patient.status)} className="capitalize">
                          {patient.status.replace("-", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="min-w-[42px]">
                            <div className="text-sm font-medium">{healthScore}</div>
                            <div className="text-xs text-muted-foreground">{healthLabel}</div>
                          </div>
                          <Progress value={healthScore} className="w-20 h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {patient.tasksOpen}/{patient.tasksOpen + patient.tasksClosed}
                          </span>
                          <Progress
                            value={(patient.tasksClosed / (patient.tasksOpen + patient.tasksClosed)) * 100}
                            className="w-16 h-2"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {patient.goalsOpen}/{patient.goalsOpen + patient.goalsClosed}
                          </span>
                          <Progress
                            value={(patient.goalsClosed / (patient.goalsOpen + patient.goalsClosed)) * 100}
                            className="w-16 h-2"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {patient.actionItemsOpen}/{patient.actionItemsOpen + patient.actionItemsClosed}
                          </span>
                          <Progress
                            value={
                              (patient.actionItemsClosed / (patient.actionItemsOpen + patient.actionItemsClosed)) * 100
                            }
                            className="w-16 h-2"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            S: {patient.flagsSummary.strength}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            M: {patient.flagsSummary.moderate}
                          </Badge>
                          <Badge variant="destructive" className="text-xs">
                            C: {patient.flagsSummary.critical}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          {(patient.status === "pending" || patient.status === "not-responded") && (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={!reminderAllowed}
                              onClick={() => handleSendReminder(patient.id, patient.name)}
                              className="h-8 w-8 p-0"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          )}
                          {lastReminderAt && (
                            <span className="text-xs text-muted-foreground">
                              {formatRelative(new Date(lastReminderAt).toISOString())}
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {selectedPatients.length > 0 && (
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-sm font-medium">{selectedPatients.length} patient(s) selected</span>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm">
                Assign Assessment
              </Button>
              <Button variant="outline" size="sm">
                Send Nudge
              </Button>
              <Button variant="outline" size="sm">
                Export Selected
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderContent = () => {
    if (showPatientDetail && detailPatientId) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleBackToPatients}>
              ← Back to Patients
            </Button>
            <h1 className="text-2xl font-semibold text-foreground">Patient Details</h1>
          </div>
          <PatientDetailView onBack={handleBackToPatients} />
        </div>
      )
    }

    switch (activeTab) {
      case "dashboard":
        return renderDashboardOverview()
      case "patients":
        return renderPatientsView()
      case "tasks":
        return <TaskKanbanBoard />
      case "assessments":
        return <PatientAssessmentTracking />
      case "referrals":
        return <ReferralManagement />
      case "messaging":
        return <MessagingCollaboration initialConversationId={selectedConversationId} />
      case "team":
        return <TeamManagement onMessageClick={handleTeamMemberMessage} />
      case "analytics":
        return <AnalyticsCohortManagement />
      default:
        return renderDashboardOverview()
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <SideNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">
                  {activeTab === "dashboard"
                    ? "Provider Dashboard"
                    : activeTab === "patients"
                      ? "Patient Pipeline"
                      : activeTab === "tasks"
                        ? "Task Management"
                        : activeTab === "assessments"
                          ? "Outcomes Tracking"
                          : activeTab === "referrals"
                            ? "Referrals"
                            : activeTab === "messaging"
                              ? "Messaging"
                              : activeTab === "team"
                                ? "Healthcare Team"
                                : activeTab === "analytics"
                                  ? "Analytics"
                                  : "Provider Dashboard"}
                </h1>
                <p className="text-base lg:text-lg text-muted-foreground">Dr. Anderson's Patient Panel</p>
              </div>
              <Button variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
                <Bell className="h-4 w-4 mr-2" />
                Notifications (3)
              </Button>
            </div>

            {renderContent()}
          </div>
        </div>
      </div>

      <QuickScheduleDialog
        open={showQuickSchedule}
        onOpenChange={setShowQuickSchedule}
        patient={selectedPatientForScheduling}
        onScheduled={() => setSelectedPatientForScheduling(null)}
      />
    </div>
  )
}
