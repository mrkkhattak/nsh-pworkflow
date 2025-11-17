"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Combobox } from "@/components/ui/combobox"
import { healthDimensionsConfig } from "@/lib/nsh-assessment-mock"
import {
  getAllTasks,
  getTaskStats,
  getUniquePatients,
  updateTaskStatus,
  getDefaultDateRange,
  getTaskUrgency,
  type Task,
  type TaskStats,
  type DateRange
} from "@/lib/task-service"
import {
  User,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Stethoscope,
  Users,
  Building,
  Search,
  Filter,
  X,
  TrendingUp,
  ListTodo,
  Target,
  BarChart3
} from "lucide-react"

const taskStatuses = [
  { id: "all", title: "All Statuses" },
  { id: "pending", title: "Pending" },
  { id: "scheduled", title: "Scheduled" },
  { id: "in-progress", title: "In Progress" },
  { id: "completed", title: "Completed" },
  { id: "declined", title: "Declined" },
]

const taskCategories = [
  { id: "all", title: "All Categories" },
  { id: "provider-level", title: "Provider Level", icon: Stethoscope, color: "bg-teal-100 text-teal-800" },
  { id: "patient-level", title: "Patient Level", icon: User, color: "bg-blue-100 text-blue-800" },
  { id: "system-level", title: "System Level", icon: Building, color: "bg-purple-100 text-purple-800" },
  { id: "community-level", title: "Community Level", icon: Users, color: "bg-green-100 text-green-800" },
]

const priorityOptions = [
  { id: "all", title: "All Priorities" },
  { id: "high", title: "High" },
  { id: "medium", title: "Medium" },
  { id: "low", title: "Low" },
]

export function AggregateTaskView() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState<TaskStats | null>(null)
  const [patients, setPatients] = useState<Array<{ id: string; name: string }>>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange())

  const [filters, setFilters] = useState({
    status: 'pending',
    patientId: 'all',
    category: 'all',
    priority: 'all',
    searchQuery: ''
  })

  useEffect(() => {
    loadData()
    loadPatients()
  }, [])

  useEffect(() => {
    loadTasks()
  }, [filters, dateRange])

  const loadData = async () => {
    await Promise.all([loadTasks(), loadStats(), loadPatients()])
  }

  const loadTasks = async () => {
    setLoading(true)
    const data = await getAllTasks({
      ...filters,
      dateRange
    })
    setTasks(data)
    setLoading(false)
  }

  const loadStats = async () => {
    const data = await getTaskStats(dateRange)
    setStats(data)
  }

  const loadPatients = async () => {
    const data = await getUniquePatients()
    setPatients(data)
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({
      status: 'pending',
      patientId: 'all',
      category: 'all',
      priority: 'all',
      searchQuery: ''
    })
    setDateRange(getDefaultDateRange())
  }

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    const result = await updateTaskStatus(taskId, newStatus)
    if (result) {
      await loadData()
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

  const getUrgencyColor = (task: Task) => {
    const urgency = getTaskUrgency(task)
    switch (urgency) {
      case "overdue":
        return "text-red-600 bg-red-100"
      case "due-soon":
        return "text-orange-600 bg-orange-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getCategoryIcon = (category: string) => {
    const cat = taskCategories.find(c => c.id === category)
    return cat?.icon || FileText
  }

  const hasActiveFilters =
    filters.status !== 'pending' ||
    filters.patientId !== 'all' ||
    filters.category !== 'all' ||
    filters.priority !== 'all' ||
    filters.searchQuery !== '' ||
    dateRange.start !== getDefaultDateRange().start ||
    dateRange.end !== getDefaultDateRange().end

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Task Management</h2>
          <p className="text-muted-foreground">
            {filters.status === 'pending' && !hasActiveFilters
              ? "All pending tasks from the last 7 days across all patients (default view)"
              : "Manage and track tasks across all patients"}
          </p>
        </div>
        <Button>
          <Target className="h-4 w-4 mr-2" />
          Create Task
        </Button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-sm border-gray-200 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-500">Last 7 days</p>
                </div>
                <ListTodo className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-gray-200 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  <p className="text-xs text-yellow-600">Needs attention</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-gray-200 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
                  <p className="text-xs text-red-600">Immediate action</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-gray-200 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                  <p className="text-xs text-green-600">
                    {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% completion rate
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="shadow-sm border-gray-200 bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear All Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tasks..."
                  value={filters.searchQuery}
                  onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-1 block">Status</label>
              <Select value={filters.status} onValueChange={(v) => handleFilterChange('status', v)}>
                <SelectTrigger>
                  <SelectValue />
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

            <div>
              <label className="text-xs text-gray-600 mb-1 block">Patient</label>
              <Combobox
                options={[
                  { value: "all", label: "All Patients" },
                  ...patients.map((patient) => ({
                    value: patient.id,
                    label: patient.name,
                  }))
                ]}
                value={filters.patientId}
                onValueChange={(v) => handleFilterChange('patientId', v)}
                placeholder="Select patient..."
                searchPlaceholder="Search patients..."
                emptyText="No patients found."
              />
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-1 block">Category</label>
              <Select value={filters.category} onValueChange={(v) => handleFilterChange('category', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {taskCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-1 block">Priority</label>
              <Select value={filters.priority} onValueChange={(v) => handleFilterChange('priority', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((priority) => (
                    <SelectItem key={priority.id} value={priority.id}>
                      {priority.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Start Date</label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-1 block">End Date</label>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-gray-200 bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">
                Tasks
                <Badge variant="outline" className="ml-2">
                  {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                </Badge>
              </CardTitle>
              <CardDescription>
                Showing tasks from {new Date(dateRange.start).toLocaleDateString()} to {new Date(dateRange.end).toLocaleDateString()}
              </CardDescription>
            </div>
            {stats && stats.byPriority.high > 0 && (
              <Badge variant="destructive" className="text-sm">
                {stats.byPriority.high} high priority
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 mx-auto mb-4 border-2 border-gray-300 border-t-blue-600 rounded-full" />
              <p className="text-sm text-gray-500">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12">
              <ListTodo className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-sm text-gray-500 mb-2">No tasks found</p>
              <p className="text-xs text-gray-400">
                {hasActiveFilters
                  ? "Try adjusting your filters to see more tasks"
                  : "No pending tasks in the last 7 days"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => {
                const CategoryIcon = getCategoryIcon(task.category)
                const taskDimension = healthDimensionsConfig.find((d) => d.id === task.dimension)

                return (
                  <Card key={task.id} className={`border-l-4 ${getPriorityColor(task.priority)}`}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-2 mb-2">
                              <CategoryIcon className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold text-foreground">{task.title}</h4>
                                {task.patient_name && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <Avatar className="h-5 w-5">
                                      <AvatarImage src="/placeholder.svg" />
                                      <AvatarFallback className="text-xs">
                                        {task.patient_name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs text-muted-foreground">{task.patient_name}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">{task.description}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge
                                variant="outline"
                                className={`text-xs ${getUrgencyColor(task)}`}
                              >
                                Due: {new Date(task.due_date).toLocaleDateString()}
                              </Badge>
                              {taskDimension && (
                                <Badge
                                  variant="outline"
                                  className="text-xs"
                                  style={{ borderColor: taskDimension.color, color: taskDimension.color }}
                                >
                                  {taskDimension.name}
                                </Badge>
                              )}
                              <Badge variant={getSLABadgeVariant(task.sla_status)} className="text-xs">
                                {task.sla_status}
                              </Badge>
                              <Badge variant="outline" className="text-xs capitalize">
                                {task.priority} priority
                              </Badge>
                              <Badge variant="secondary" className="text-xs capitalize">
                                {task.category.replace('-level', '')}
                              </Badge>
                              <Badge variant="outline" className="text-xs capitalize">
                                {task.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t text-xs text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{task.assignee}</span>
                            </div>
                            {task.estimated_time && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{task.estimated_time}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Select
                              value={task.status}
                              onValueChange={(newStatus) => handleStatusChange(task.id, newStatus)}
                            >
                              <SelectTrigger className="h-7 text-xs w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {taskStatuses.slice(1).map((status) => (
                                  <SelectItem key={status.id} value={status.id} className="text-xs">
                                    {status.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button variant="outline" size="sm" className="h-7 text-xs">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {stats && stats.byCategory && (
        <Card className="shadow-sm border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Task Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {taskCategories.slice(1).map((category) => {
                const count = stats.byCategory[category.id as keyof typeof stats.byCategory] || 0
                const Icon = category.icon
                return (
                  <Card key={category.id} className="shadow-sm border-gray-200 bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-2 rounded-lg ${category.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{category.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{count}</p>
                      <p className="text-xs text-gray-500">
                        {stats.total > 0 ? Math.round((count / stats.total) * 100) : 0}% of total
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
