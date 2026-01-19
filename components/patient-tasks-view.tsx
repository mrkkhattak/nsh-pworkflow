"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { healthDimensionsConfig } from "@/lib/nsh-assessment-mock"
import {
  User,
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Stethoscope,
  Users,
} from "lucide-react"

interface PatientTask {
  id: number
  title: string
  type: string
  assignee: string
  dueDate: string
  priority: string
  status: string
  description: string
  slaStatus: string
  estimatedTime: string
  dimension: string
}

const mockPatientTasks: Record<number, PatientTask[]> = {
  1: [
    {
      id: 1,
      title: "Follow-up Depression Assessment",
      type: "follow-up",
      assignee: "Dr. Anderson",
      dueDate: "2025-01-15",
      priority: "high",
      status: "todo",
      description: "Schedule follow-up assessment after medication adjustment",
      slaStatus: "on-time",
      estimatedTime: "30 min",
      dimension: "mental",
    },
    {
      id: 2,
      title: "Psychiatric Referral",
      type: "referral",
      assignee: "Care Coordinator",
      dueDate: "2025-01-16",
      priority: "high",
      status: "in-progress",
      description: "Refer to Dr. Smith for psychiatric evaluation",
      slaStatus: "at-risk",
      estimatedTime: "15 min",
      dimension: "mental",
    },
    {
      id: 9,
      title: "Peer Consultation: Complex Case",
      type: "care-planning",
      assignee: "Dr. Anderson",
      dueDate: "2025-01-17",
      priority: "high",
      status: "todo",
      description: "Consult with psychiatrist regarding treatment-resistant depression case",
      slaStatus: "on-time",
      estimatedTime: "45 min",
      dimension: "mental",
    },
    {
      id: 15,
      title: "Sleep Study Results Review",
      type: "follow-up",
      assignee: "Dr. Anderson",
      dueDate: "2025-01-19",
      priority: "high",
      status: "todo",
      description: "Discuss sleep study findings and potential CPAP therapy",
      slaStatus: "on-time",
      estimatedTime: "30 min",
      dimension: "sleep",
    },
  ],
  2: [
    {
      id: 3,
      title: "Medication Adherence Check",
      type: "follow-up",
      assignee: "Pharmacist",
      dueDate: "2025-01-17",
      priority: "medium",
      status: "waiting-patient",
      description: "Contact patient about missed medication doses",
      slaStatus: "overdue",
      estimatedTime: "20 min",
      dimension: "medical",
    },
    {
      id: 14,
      title: "Nutrition Counseling Session",
      type: "follow-up",
      assignee: "Dietitian",
      dueDate: "2025-01-22",
      priority: "medium",
      status: "in-progress",
      description: "Review dietary changes and meal planning for diabetes management",
      slaStatus: "on-time",
      estimatedTime: "45 min",
      dimension: "diet",
    },
  ],
  3: [
    {
      id: 5,
      title: "Care Plan Review",
      type: "care-planning",
      assignee: "Dr. Anderson",
      dueDate: "2025-01-18",
      priority: "low",
      status: "todo",
      description: "Review and update care plan based on recent assessment",
      slaStatus: "on-time",
      estimatedTime: "25 min",
      dimension: "burden",
    },
    {
      id: 13,
      title: "Physical Therapy Follow-up",
      type: "follow-up",
      assignee: "Physical Therapist",
      dueDate: "2025-01-21",
      priority: "medium",
      status: "todo",
      description: "Check progress on mobility exercises and adjust therapy plan",
      slaStatus: "on-time",
      estimatedTime: "40 min",
      dimension: "physical",
    },
  ],
  4: [
    {
      id: 4,
      title: "Insurance Authorization",
      type: "administrative",
      assignee: "Admin Staff",
      dueDate: "2025-01-14",
      priority: "medium",
      status: "done",
      description: "Process insurance authorization for specialist visit",
      slaStatus: "completed",
      estimatedTime: "45 min",
      dimension: "cost",
    },
    {
      id: 16,
      title: "Pain Management Consultation",
      type: "referral",
      assignee: "Pain Specialist",
      dueDate: "2025-01-23",
      priority: "high",
      status: "in-progress",
      description: "Refer to pain management specialist for chronic back pain",
      slaStatus: "on-time",
      estimatedTime: "35 min",
      dimension: "pain",
    },
  ],
}

const taskStatuses = [
  { id: "all", title: "All Tasks" },
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "waiting-patient", title: "Waiting on Patient" },
  { id: "done", title: "Completed" },
]

interface Props {
  patientId: number
}

export function PatientTasksView({ patientId }: Props) {
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedDimension, setSelectedDimension] = useState("all")
  const [viewMode, setViewMode] = useState<"status" | "dimension">("status")

  const tasks = mockPatientTasks[patientId] || []

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = selectedStatus === "all" || task.status === selectedStatus
    const dimensionMatch = selectedDimension === "all" || task.dimension === selectedDimension
    return viewMode === "status" ? statusMatch : dimensionMatch
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50"
      case "medium":
        return "border-l-yellow-500 bg-yellow-50"
      case "low":
        return "border-l-green-500 bg-green-50"
      default:
        return "border-l-gray-500 bg-gray-50"
    }
  }

  const getSLABadgeVariant = (slaStatus: string) => {
    switch (slaStatus) {
      case "overdue":
        return "destructive"
      case "at-risk":
        return "secondary"
      case "on-time":
        return "outline"
      case "completed":
        return "default"
      default:
        return "outline"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "referral":
        return Stethoscope
      case "follow-up":
        return Calendar
      case "administrative":
        return FileText
      case "care-planning":
        return Users
      default:
        return FileText
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return CheckCircle
      case "in-progress":
        return Clock
      case "waiting-patient":
        return AlertTriangle
      default:
        return Activity
    }
  }

  const getTasksByStatus = (status: string) => {
    if (status === "all") return tasks
    return tasks.filter((task) => task.status === status)
  }

  const getTasksByDimension = (dimensionId: string) => {
    if (dimensionId === "all") return tasks
    return tasks.filter((task) => task.dimension === dimensionId)
  }

  return (
    <div className="space-y-6">
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "status" | "dimension")} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="status">By Status</TabsTrigger>
            <TabsTrigger value="dimension">By Health Dimension</TabsTrigger>
          </TabsList>
          <Badge variant="outline" className="text-sm">
            {tasks.length} Total Tasks
          </Badge>
        </div>

        <TabsContent value="status" className="space-y-6">
          <div className="flex items-center gap-4">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {taskStatuses.map((status) => (
                  <SelectItem key={status.id} value={status.id}>
                    {status.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {taskStatuses.slice(1).map((status) => {
              const statusTasks = getTasksByStatus(status.id)
              const StatusIcon = getStatusIcon(status.id)
              return (
                <Card
                  key={status.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${selectedStatus === status.id ? "ring-2 ring-primary shadow-lg" : ""}`}
                  onClick={() => setSelectedStatus(status.id)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <StatusIcon className="h-5 w-5 text-muted-foreground" />
                        {statusTasks.filter((t) => t.slaStatus === "overdue").length > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {statusTasks.filter((t) => t.slaStatus === "overdue").length} overdue
                          </Badge>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{status.title}</p>
                        <p className="text-2xl font-bold text-foreground mt-2">{statusTasks.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tasks - {selectedStatus === "all" ? "All" : taskStatuses.find((s) => s.id === selectedStatus)?.title}</CardTitle>
              <CardDescription>Track care tasks and action items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredTasks.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No tasks found</p>
                ) : (
                  filteredTasks.map((task) => {
                    const TypeIcon = getTypeIcon(task.type)
                    const taskDimension = healthDimensionsConfig.find((d) => d.id === task.dimension)
                    return (
                      <Card key={task.id} className={`border-l-4 ${getPriorityColor(task.priority)}`}>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-start gap-2 mb-2">
                                  <TypeIcon className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                  <h4 className="text-sm font-semibold text-foreground">{task.title}</h4>
                                </div>
                                <p className="text-xs text-muted-foreground mb-3">{task.description}</p>
                                <div className="flex items-center gap-2 flex-wrap">
                                  {taskDimension && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                      style={{ borderColor: taskDimension.color, color: taskDimension.color }}
                                    >
                                      {taskDimension.name}
                                    </Badge>
                                  )}
                                  <Badge variant={getSLABadgeVariant(task.slaStatus)} className="text-xs">
                                    {task.slaStatus}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {task.priority} priority
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>{task.assignee}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{task.estimatedTime}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dimension" className="space-y-6">
          <div className="flex items-center gap-4">
            <Select value={selectedDimension} onValueChange={setSelectedDimension}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Filter by dimension" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Health Dimensions</SelectItem>
                {healthDimensionsConfig.map((dimension) => (
                  <SelectItem key={dimension.id} value={dimension.id}>
                    {dimension.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {healthDimensionsConfig
              .filter((dimension) => getTasksByDimension(dimension.id).length > 0)
              .map((dimension) => {
                const dimensionTasks = getTasksByDimension(dimension.id)
                const completedTasks = dimensionTasks.filter((t) => t.status === "done")
                return (
                  <Card
                    key={dimension.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${selectedDimension === dimension.id ? "ring-2 ring-primary shadow-lg" : ""}`}
                    onClick={() => setSelectedDimension(dimension.id)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${dimension.color}20`, color: dimension.color }}
                          >
                            <Activity className="h-5 w-5" />
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{dimension.name}</p>
                          <div className="flex items-baseline gap-2 mt-2">
                            <p className="text-2xl font-bold text-foreground">{dimensionTasks.length}</p>
                            <p className="text-xs text-muted-foreground">
                              {completedTasks.length}/{dimensionTasks.length} completed
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                Tasks -{" "}
                {selectedDimension === "all"
                  ? "All Health Dimensions"
                  : healthDimensionsConfig.find((d) => d.id === selectedDimension)?.name}
              </CardTitle>
              <CardDescription>Track care tasks organized by health dimension</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredTasks.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No tasks found for this dimension</p>
                ) : (
                  filteredTasks.map((task) => {
                    const TypeIcon = getTypeIcon(task.type)
                    const taskDimension = healthDimensionsConfig.find((d) => d.id === task.dimension)
                    return (
                      <Card key={task.id} className={`border-l-4 ${getPriorityColor(task.priority)}`}>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-start gap-2 mb-2">
                                  <TypeIcon className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                  <h4 className="text-sm font-semibold text-foreground">{task.title}</h4>
                                </div>
                                <p className="text-xs text-muted-foreground mb-3">{task.description}</p>
                                <div className="flex items-center gap-2 flex-wrap">
                                  {taskDimension && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                      style={{ borderColor: taskDimension.color, color: taskDimension.color }}
                                    >
                                      {taskDimension.name}
                                    </Badge>
                                  )}
                                  <Badge variant={getSLABadgeVariant(task.slaStatus)} className="text-xs">
                                    {task.slaStatus}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {task.priority} priority
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    {task.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>{task.assignee}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{task.estimatedTime}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
