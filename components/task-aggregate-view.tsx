"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  fetchAggregatePendingTasks,
  fetchPatientTasks,
  fetchPatientTaskSummaries,
  calculateTaskSummary,
  updateTaskStatus,
  getTimeFilterLabel,
  type Task,
  type TimeFilter,
  type PatientTaskSummary,
  type TaskStatus,
} from "@/lib/task-service"
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  User,
  ArrowLeft,
  ListTodo,
  TrendingUp,
  Users,
  ClipboardList,
} from "lucide-react"

export function TaskAggregateView() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('1week')
  const [tasks, setTasks] = useState<Task[]>([])
  const [patientSummaries, setPatientSummaries] = useState<PatientTaskSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Load aggregate data
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        if (selectedPatient) {
          const patientTasks = await fetchPatientTasks(selectedPatient, timeFilter)
          setTasks(patientTasks)
        } else {
          const [aggregateTasks, summaries] = await Promise.all([
            fetchAggregatePendingTasks(timeFilter),
            fetchPatientTaskSummaries(timeFilter)
          ])
          setTasks(aggregateTasks)
          setPatientSummaries(summaries)
        }
      } catch (error) {
        console.error('Failed to load task data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [timeFilter, selectedPatient])

  // Calculate summary statistics
  const summary = useMemo(() => calculateTaskSummary(tasks), [tasks])

  // Filter tasks based on search and status
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = searchQuery === '' ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'all' || task.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [tasks, searchQuery, statusFilter])

  // Handle drill-down to patient
  const handlePatientSelect = (patientId: string) => {
    setSelectedPatient(patientId)
    setSearchQuery('')
    setStatusFilter('all')
  }

  // Handle back to aggregate view
  const handleBackToAggregate = () => {
    setSelectedPatient(null)
    setSearchQuery('')
    setStatusFilter('all')
  }

  // Handle status update
  const handleStatusUpdate = async (taskId: string, newStatus: TaskStatus) => {
    const success = await updateTaskStatus(taskId, newStatus)
    if (success) {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      )
    }
  }

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive'
      case 'medium':
        return 'secondary'
      case 'low':
        return 'outline'
      default:
        return 'outline'
    }
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default'
      case 'pending':
      case 'todo':
        return 'secondary'
      case 'in-progress':
      case 'scheduled':
        return 'outline'
      case 'declined':
      case 'cancelled':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  // Check if task is overdue
  const isOverdue = (task: Task) => {
    if (!task.due_date || task.status === 'completed') return false
    return new Date(task.due_date) < new Date()
  }

  const selectedPatientName = selectedPatient
    ? patientSummaries.find(p => p.patientId === selectedPatient)?.patientName || 'Patient'
    : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {selectedPatient && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToAggregate}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to All Patients
            </Button>
          )}
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {selectedPatient ? `Tasks for ${selectedPatientName}` : 'Task Management Dashboard'}
            </h2>
            <p className="text-muted-foreground">
              {selectedPatient
                ? `View and manage tasks for individual patient`
                : `Aggregate view of pending tasks across all patients`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select value={timeFilter} onValueChange={(value) => setTimeFilter(value as TimeFilter)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1week">Last 7 Days</SelectItem>
              <SelectItem value="2weeks">Last 2 Weeks</SelectItem>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="2months">Last 2 Months</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                <p className="text-3xl font-bold text-foreground">{summary.total}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <ListTodo className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-foreground">{summary.pending}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-foreground">{summary.completed}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-3xl font-bold text-foreground">{summary.overdue}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Summaries (only in aggregate view) */}
      {!selectedPatient && patientSummaries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Patient Task Summary
            </CardTitle>
            <CardDescription>
              Click on a patient to drill down into their individual tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {patientSummaries.map((patient) => (
                <div
                  key={patient.patientId}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handlePatientSelect(patient.patientId)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>
                        {patient.patientName
                          .split(' ')
                          .map(n => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{patient.patientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {patient.totalTasks} total tasks
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-600">{patient.pendingTasks}</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{patient.overdueTasks}</p>
                      <p className="text-xs text-muted-foreground">Overdue</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{patient.completedTasks}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                    {patient.highPriorityTasks > 0 && (
                      <Badge variant="destructive">
                        {patient.highPriorityTasks} High Priority
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                {selectedPatient ? `Tasks for ${selectedPatientName}` : 'All Pending Tasks'}
              </CardTitle>
              <CardDescription>
                {getTimeFilterLabel(timeFilter)} - {filteredTasks.length} tasks
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Loading tasks...</div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ListTodo className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-lg font-medium text-foreground">No tasks found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : `No tasks in the ${getTimeFilterLabel(timeFilter).toLowerCase()}`}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  {!selectedPatient && <TableHead>Patient</TableHead>}
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id} className={isOverdue(task) ? 'bg-red-50' : ''}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{task.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {task.description}
                        </p>
                      </div>
                    </TableCell>
                    {!selectedPatient && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback className="text-xs">
                              {task.patient_name
                                ?.split(' ')
                                .map(n => n[0])
                                .join('') || 'NA'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{task.patient_name || 'N/A'}</span>
                        </div>
                      </TableCell>
                    )}
                    <TableCell>
                      <Badge variant={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={task.status}
                        onValueChange={(value) => handleStatusUpdate(task.id, value as TaskStatus)}
                      >
                        <SelectTrigger className="w-[130px]">
                          <Badge variant={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="declined">Declined</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {task.due_date
                            ? new Date(task.due_date).toLocaleDateString()
                            : 'No due date'}
                        </span>
                        {isOverdue(task) && (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{task.assignee}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {task.category.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
