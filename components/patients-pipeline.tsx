"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Download,
  Filter,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  Activity,
  MessageSquare,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
]

export function PatientsPipeline() {
  const [selectedStatus, setSelectedStatus] = useState<PatientStatus | "all">("all")
  const [selectedCardStatus, setSelectedCardStatus] = useState<PatientStatus | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPatients, setSelectedPatients] = useState<number[]>([])
  const [classificationFilter, setClassificationFilter] = useState<"all" | PatientClassification>("all")
  const [dateRange, setDateRange] = useState<DateRange>("last5d")
  const [remindersSent, setRemindersSent] = useState<Record<number, number>>({})

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

  const handleCardClick = (status: PatientStatus | "all") => {
    setSelectedCardStatus(status)
  }

  return (
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
                    (patient.status === "pending" || patient.status === "not-responded") &&
                    canSendReminder(patient.id)
                  const lastReminderAt = remindersSent[patient.id]

                  return (
                    <TableRow key={patient.id} className="hover:bg-muted/50 transition-colors">
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
                        <Link href={`/patients/${patient.id}`} className="flex items-center gap-3 hover:underline">
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
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatRelative(patient.lastAssessmentDate)}</div>
                        {patient.phq9Score && (
                          <div className="text-xs text-muted-foreground">MCID: {patient.phq9Score}%</div>
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
}
