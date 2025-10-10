"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertTriangle,
  Calendar,
  User,
  FileText,
  Phone,
  MessageSquare,
  Stethoscope,
  Building,
  Users,
  CheckCircle,
  MoreHorizontal,
  Plus,
  UserCog,
} from "lucide-react"

// Mock task data
const mockTasks = [
  {
    id: 1,
    title: "Follow-up Depression Assessment",
    type: "follow-up",
    patient: "Sarah Johnson",
    patientId: 1,
    assignee: "Dr. Anderson",
    dueDate: "2025-01-15",
    priority: "high",
    category: "patient-level",
    status: "todo",
    description: "Schedule follow-up assessment after medication adjustment",
    blockers: [],
    slaStatus: "on-time",
    estimatedTime: "30 min",
  },
  {
    id: 2,
    title: "Psychiatric Referral",
    type: "referral",
    patient: "Sarah Johnson",
    patientId: 1,
    assignee: "Care Coordinator",
    dueDate: "2025-01-16",
    priority: "high",
    category: "system-level",
    status: "in-progress",
    description: "Refer to Dr. Smith for psychiatric evaluation",
    blockers: [],
    slaStatus: "at-risk",
    estimatedTime: "15 min",
  },
  {
    id: 3,
    title: "Medication Adherence Check",
    type: "follow-up",
    patient: "Michael Chen",
    patientId: 2,
    assignee: "Pharmacist",
    dueDate: "2025-01-17",
    priority: "medium",
    category: "community-level",
    status: "waiting-patient",
    description: "Contact patient about missed medication doses",
    blockers: ["Patient not responding to calls"],
    slaStatus: "overdue",
    estimatedTime: "20 min",
  },
  {
    id: 4,
    title: "Insurance Authorization",
    type: "administrative",
    patient: "Robert Williams",
    patientId: 4,
    assignee: "Admin Staff",
    dueDate: "2025-01-14",
    priority: "medium",
    category: "system-level",
    status: "done",
    description: "Process insurance authorization for specialist visit",
    blockers: [],
    slaStatus: "completed",
    estimatedTime: "45 min",
  },
  {
    id: 5,
    title: "Care Plan Review",
    type: "care-planning",
    patient: "Emily Rodriguez",
    patientId: 3,
    assignee: "Dr. Anderson",
    dueDate: "2025-01-18",
    priority: "low",
    category: "patient-level",
    status: "todo",
    description: "Review and update care plan based on recent assessment",
    blockers: [],
    slaStatus: "on-time",
    estimatedTime: "25 min",
  },
  {
    id: 6,
    title: "Outreach: Update Contact Info",
    type: "administrative",
    patient: "Robert Williams",
    patientId: 4,
    assignee: "Admin Staff",
    dueDate: "2025-01-22",
    priority: "low",
    category: "system-level",
    status: "cancelled",
    description: "Duplicate request detected; cancelling.",
    blockers: [],
    slaStatus: "completed",
    estimatedTime: "10 min",
    subtasks: [
      { id: "s1", title: "Verify phone", done: true },
      { id: "s2", title: "Verify email", done: false },
    ],
  },
  {
    id: 7,
    title: "Review High-Risk Patient Panel",
    type: "care-planning",
    patient: "Multiple Patients",
    patientId: 0,
    assignee: "Dr. Anderson",
    dueDate: "2025-01-16",
    priority: "high",
    category: "physician-level",
    status: "todo",
    description: "Weekly review of all high-risk patients in panel for care coordination",
    blockers: [],
    slaStatus: "on-time",
    estimatedTime: "60 min",
  },
  {
    id: 8,
    title: "Complete CME Training Module",
    type: "administrative",
    patient: "N/A",
    patientId: 0,
    assignee: "Dr. Anderson",
    dueDate: "2025-01-20",
    priority: "medium",
    category: "physician-level",
    status: "in-progress",
    description: "Complete required continuing medical education on depression management",
    blockers: [],
    slaStatus: "on-time",
    estimatedTime: "120 min",
  },
  {
    id: 9,
    title: "Peer Consultation: Complex Case",
    type: "care-planning",
    patient: "Sarah Johnson",
    patientId: 1,
    assignee: "Dr. Anderson",
    dueDate: "2025-01-17",
    priority: "high",
    category: "physician-level",
    status: "todo",
    description: "Consult with psychiatrist regarding treatment-resistant depression case",
    blockers: [],
    slaStatus: "on-time",
    estimatedTime: "45 min",
  },
  {
    id: 10,
    title: "Community Health Fair Planning",
    type: "administrative",
    patient: "N/A",
    patientId: 0,
    assignee: "Community Coordinator",
    dueDate: "2025-01-25",
    priority: "low",
    category: "community-level",
    status: "todo",
    description: "Coordinate mental health screening booth for upcoming community event",
    blockers: [],
    slaStatus: "on-time",
    estimatedTime: "90 min",
  },
  {
    id: 11,
    title: "Provider Network Expansion",
    type: "administrative",
    patient: "N/A",
    patientId: 0,
    assignee: "Network Manager",
    dueDate: "2025-01-30",
    priority: "medium",
    category: "provider-level",
    status: "in-progress",
    description: "Onboard 3 new therapists to provider network",
    blockers: [],
    slaStatus: "on-time",
    estimatedTime: "180 min",
  },
  {
    id: 12,
    title: "Quality Metrics Review",
    type: "administrative",
    patient: "N/A",
    patientId: 0,
    assignee: "Quality Team",
    dueDate: "2025-01-19",
    priority: "high",
    category: "provider-level",
    status: "todo",
    description: "Monthly review of provider quality metrics and outcomes",
    blockers: [],
    slaStatus: "on-time",
    estimatedTime: "120 min",
  },
]

const taskColumns = [
  { id: "todo", title: "To Do", color: "bg-blue-50 border-blue-200" },
  { id: "in-progress", title: "In Progress", color: "bg-yellow-50 border-yellow-200" },
  { id: "waiting-patient", title: "Waiting on Patient", color: "bg-orange-50 border-orange-200" },
  { id: "done", title: "Completed", color: "bg-green-50 border-green-200" },
  { id: "cancelled", title: "Cancelled", color: "bg-gray-50 border-gray-200" },
]

const taskCategories = [
  {
    id: "physician-level",
    title: "Physician Level",
    icon: UserCog,
    color: "bg-indigo-100 text-indigo-800",
    description: "Direct physician responsibilities and clinical decisions",
  },
  {
    id: "provider-level",
    title: "Provider Level",
    icon: Stethoscope,
    color: "bg-teal-100 text-teal-800",
    description: "Provider network and care team coordination",
  },
  {
    id: "patient-level",
    title: "Patient Level",
    icon: User,
    color: "bg-blue-100 text-blue-800",
    description: "Individual patient care and treatment tasks",
  },
  {
    id: "system-level",
    title: "System Level",
    icon: Building,
    color: "bg-purple-100 text-purple-800",
    description: "Administrative and system-wide processes",
  },
  {
    id: "community-level",
    title: "Community Level",
    icon: Users,
    color: "bg-green-100 text-green-800",
    description: "Community outreach and population health",
  },
]

export function TaskKanbanBoard() {
  const [tasks, setTasks] = useState(mockTasks)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [draggedTask, setDraggedTask] = useState<number | null>(null)

  const filteredTasks = selectedCategory === "all" ? tasks : tasks.filter((task) => task.category === selectedCategory)

  const getTasksByStatus = (status: string) => {
    return filteredTasks.filter((task) => task.status === status)
  }

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

  const handleDragStart = (taskId: number) => {
    setDraggedTask(taskId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    if (draggedTask) {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === draggedTask ? { ...task, status: newStatus } : task)),
      )
      setDraggedTask(null)
      // Here you would typically log the audit trail
      console.log(`Task ${draggedTask} moved to ${newStatus}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Task Status Board</h2>
          <p className="text-muted-foreground">
            Manage care tasks across physician, provider, patient, system, and community levels
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {taskCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Category Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Task Categories Overview</h3>
          <Badge variant="outline" className="text-sm">
            {tasks.length} Total Tasks
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {taskCategories.map((category) => {
            const categoryTasks = tasks.filter((task) => task.category === category.id)
            const completedTasks = categoryTasks.filter((t) => t.status === "done")
            const overdueTasks = categoryTasks.filter((t) => t.slaStatus === "overdue")
            const Icon = category.icon
            return (
              <Card
                key={category.id}
                className={`cursor-pointer transition-all hover:shadow-md ${selectedCategory === category.id ? "ring-2 ring-primary shadow-lg" : ""}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${category.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      {overdueTasks.length > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {overdueTasks.length} overdue
                        </Badge>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{category.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{category.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div>
                        <p className="text-2xl font-bold text-foreground">{categoryTasks.length}</p>
                        <p className="text-xs text-muted-foreground">tasks</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-green-600">
                          {completedTasks.length}/{categoryTasks.length}
                        </p>
                        <p className="text-xs text-muted-foreground">completed</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {taskColumns.map((column) => {
          const columnTasks = getTasksByStatus(column.id)
          return (
            <Card key={column.id} className={column.color}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-lg">
                  {column.title}
                  <Badge variant="outline">{columnTasks.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent
                className="space-y-3 min-h-[400px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {columnTasks.map((task) => {
                  const TypeIcon = getTypeIcon(task.type)
                  const taskCategory = taskCategories.find((cat) => cat.id === task.category)
                  const CategoryIcon = taskCategory?.icon || User

                  return (
                    <Card
                      key={task.id}
                      className={`cursor-move transition-all hover:shadow-md border-l-4 ${getPriorityColor(task.priority)}`}
                      draggable
                      onDragStart={() => handleDragStart(task.id)}
                    >
                      <CardContent className="p-4">
                        {/* Task Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <TypeIcon className="h-4 w-4 text-muted-foreground" />
                            <Badge variant="outline" className="text-xs">
                              {task.type}
                            </Badge>
                            <Badge variant="secondary" className="text-xs flex items-center gap-1">
                              <CategoryIcon className="h-3 w-3" />
                              {taskCategory?.title.split(" ")[0]}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Task Title */}
                        <h4 className="font-medium text-sm mb-2 line-clamp-2">{task.title}</h4>

                        {/* Patient Info */}
                        {task.patientId > 0 && (
                          <div className="flex items-center gap-2 mb-3">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback className="text-xs">
                                {task.patient
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">{task.patient}</span>
                          </div>
                        )}

                        {/* Task Details */}
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Assignee:</span>
                            <span className="font-medium">{task.assignee}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Due:</span>
                            <span className="font-medium">{new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Est. Time:</span>
                            <span className="font-medium">{task.estimatedTime}</span>
                          </div>
                        </div>

                        {/* SLA Status */}
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant={getSLABadgeVariant(task.slaStatus)} className="text-xs">
                            {task.slaStatus.replace("-", " ")}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              task.priority === "high"
                                ? "border-red-300 text-red-700"
                                : task.priority === "medium"
                                  ? "border-yellow-300 text-yellow-700"
                                  : "border-green-300 text-green-700"
                            }`}
                          >
                            {task.priority}
                          </Badge>
                        </div>

                        {/* Blockers */}
                        {task.blockers.length > 0 && (
                          <div className="mb-3">
                            <div className="flex items-center gap-1 mb-1">
                              <AlertTriangle className="h-3 w-3 text-red-500" />
                              <span className="text-xs font-medium text-red-700">Blockers:</span>
                            </div>
                            {task.blockers.map((blocker, index) => (
                              <p key={index} className="text-xs text-red-600 bg-red-50 p-1 rounded">
                                {blocker}
                              </p>
                            ))}
                          </div>
                        )}

                        {/* Subtasks */}
                        {Array.isArray((task as any).subtasks) && (task as any).subtasks.length > 0 && (
                          <div className="mb-3 space-y-1">
                            {(task as any).subtasks.map((st: any) => (
                              <div key={st.id} className="flex items-center gap-2 text-xs">
                                <input type="checkbox" checked={!!st.done} readOnly className="rounded" />
                                <span className={st.done ? "line-through text-muted-foreground" : ""}>{st.title}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Task Description */}
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            <FileText className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            <MessageSquare className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            <Phone className="h-3 w-3" />
                          </Button>
                          {task.status === "done" && <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                {/* Add Task Button */}
                <Button
                  variant="ghost"
                  className="w-full h-12 border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Task Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Task Summary & Performance Metrics</CardTitle>
          <CardDescription>Overview of task completion across all categories and status levels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Summary */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">By Status</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{getTasksByStatus("todo").length}</div>
                <div className="text-sm text-muted-foreground">To Do</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{getTasksByStatus("in-progress").length}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{getTasksByStatus("waiting-patient").length}</div>
                <div className="text-sm text-muted-foreground">Waiting on Patient</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{getTasksByStatus("done").length}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{getTasksByStatus("cancelled").length}</div>
                <div className="text-sm text-muted-foreground">Cancelled</div>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">By Category</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {taskCategories.map((category) => {
                const categoryTasks = tasks.filter((task) => task.category === category.id)
                const completionRate =
                  categoryTasks.length > 0
                    ? Math.round((categoryTasks.filter((t) => t.status === "done").length / categoryTasks.length) * 100)
                    : 0
                const Icon = category.icon

                return (
                  <div key={category.id} className="text-center p-4 bg-muted rounded-lg">
                    <div className="flex justify-center mb-2">
                      <div className={`p-2 rounded-lg ${category.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-foreground">{categoryTasks.length}</div>
                    <div className="text-xs text-muted-foreground mb-1">{category.title.split(" ")[0]}</div>
                    <Badge variant="outline" className="text-xs">
                      {completionRate}% done
                    </Badge>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
