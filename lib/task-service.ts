import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type TaskStatus =
  | 'pending'
  | 'scheduled'
  | 'in-progress'
  | 'completed'
  | 'declined'
  | 'cancelled'
  | 'acknowledged'
  | 'unreachable'
  | 'in-contact'
  | 'enrolled'
  | 'withdrawn'
  | 'todo'
  | 'no-show'

export type TaskCategory =
  | 'provider-level'
  | 'patient-level'
  | 'system-level'
  | 'community-level'

export type TaskPriority = 'high' | 'medium' | 'low'

export type TimeFilter = '1week' | '2weeks' | '1month' | '2months' | '3months'

export interface Task {
  id: string
  category: TaskCategory
  status: TaskStatus
  title: string
  description: string
  priority: TaskPriority
  due_date: string
  assignee: string
  dimension?: string
  sla_status: string
  estimated_time?: string
  blockers: string[]
  created_at: string
  updated_at: string

  // Provider Level fields
  provider_name?: string
  provider_credential?: string
  provider_email?: string
  provider_specialty?: string
  provider_license_id?: string
  provider_organization?: string
  provider_address?: string
  provider_zip?: string
  provider_state?: string
  provider_country?: string

  // Patient Level fields
  patient_id?: string
  patient_name?: string
  patient_website?: string
  patient_contact?: string

  // Community Level fields
  community_resource_name?: string
  community_website?: string
  community_email?: string
  community_location?: string
  community_contact?: string

  // System Level fields
  system_name?: string
  system_website?: string
  system_contact?: string
  system_location?: string
}

export interface TaskSummary {
  total: number
  pending: number
  completed: number
  overdue: number
  byCategory: Record<TaskCategory, number>
  byPriority: Record<TaskPriority, number>
}

export interface PatientTaskSummary {
  patientId: string
  patientName: string
  totalTasks: number
  pendingTasks: number
  completedTasks: number
  overdueTasks: number
  highPriorityTasks: number
}

export interface EntityTaskSummary {
  entityId: string
  entityName: string
  entityType: TaskCategory
  totalTasks: number
  pendingTasks: number
  completedTasks: number
  overdueTasks: number
  highPriorityTasks: number
  entityDetails?: string
}

/**
 * Get date range based on time filter
 */
export function getDateRange(timeFilter: TimeFilter): { startDate: Date; endDate: Date } {
  const endDate = new Date()
  const startDate = new Date()

  switch (timeFilter) {
    case '1week':
      startDate.setDate(startDate.getDate() - 7)
      break
    case '2weeks':
      startDate.setDate(startDate.getDate() - 14)
      break
    case '1month':
      startDate.setMonth(startDate.getMonth() - 1)
      break
    case '2months':
      startDate.setMonth(startDate.getMonth() - 2)
      break
    case '3months':
      startDate.setMonth(startDate.getMonth() - 3)
      break
  }

  return { startDate, endDate }
}

/**
 * Fetch aggregate pending tasks for all patients with time filter
 */
export async function fetchAggregatePendingTasks(
  timeFilter: TimeFilter = '1week'
): Promise<Task[]> {
  try {
    const { startDate, endDate } = getDateRange(timeFilter)

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .in('status', ['pending', 'acknowledged', 'scheduled', 'todo'])
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('due_date', { ascending: true })

    if (error) {
      console.error('Error fetching aggregate pending tasks:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in fetchAggregatePendingTasks:', error)
    return []
  }
}

/**
 * Fetch tasks for a specific patient with time filter
 */
export async function fetchPatientTasks(
  patientId: string,
  timeFilter: TimeFilter = '1week'
): Promise<Task[]> {
  try {
    const { startDate, endDate } = getDateRange(timeFilter)

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('patient_id', patientId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('due_date', { ascending: true })

    if (error) {
      console.error('Error fetching patient tasks:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in fetchPatientTasks:', error)
    return []
  }
}

/**
 * Fetch tasks for a specific entity (any category) with time filter
 */
export async function fetchEntityTasks(
  entityId: string,
  timeFilter: TimeFilter = '1week'
): Promise<Task[]> {
  try {
    const { startDate, endDate } = getDateRange(timeFilter)

    // Get all tasks in time range first
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('due_date', { ascending: true })

    if (error) {
      console.error('Error fetching entity tasks:', error)
      return []
    }

    // Filter by entity ID (which varies by category)
    const filteredTasks = (data || []).filter(task => getTaskEntityId(task) === entityId)

    return filteredTasks
  } catch (error) {
    console.error('Error in fetchEntityTasks:', error)
    return []
  }
}

/**
 * Fetch all tasks with optional filters
 */
export async function fetchTasks(filters: {
  timeFilter?: TimeFilter
  patientId?: string
  category?: TaskCategory
  status?: TaskStatus
  priority?: TaskPriority
}): Promise<Task[]> {
  try {
    const { timeFilter = '1week', patientId, category, status, priority } = filters
    const { startDate, endDate } = getDateRange(timeFilter)

    let query = supabase
      .from('tasks')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())

    if (patientId) {
      query = query.eq('patient_id', patientId)
    }

    if (category) {
      query = query.eq('category', category)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (priority) {
      query = query.eq('priority', priority)
    }

    query = query.order('due_date', { ascending: true })

    const { data, error } = await query

    if (error) {
      console.error('Error fetching tasks:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in fetchTasks:', error)
    return []
  }
}

/**
 * Calculate task summary statistics
 */
export function calculateTaskSummary(tasks: Task[]): TaskSummary {
  const now = new Date()

  const summary: TaskSummary = {
    total: tasks.length,
    pending: 0,
    completed: 0,
    overdue: 0,
    byCategory: {
      'provider-level': 0,
      'patient-level': 0,
      'system-level': 0,
      'community-level': 0,
    },
    byPriority: {
      high: 0,
      medium: 0,
      low: 0,
    },
  }

  tasks.forEach((task) => {
    // Count by status
    if (['pending', 'acknowledged', 'scheduled', 'todo'].includes(task.status)) {
      summary.pending++
    }
    if (task.status === 'completed') {
      summary.completed++
    }

    // Count overdue
    if (task.due_date && new Date(task.due_date) < now && task.status !== 'completed') {
      summary.overdue++
    }

    // Count by category
    if (task.category in summary.byCategory) {
      summary.byCategory[task.category]++
    }

    // Count by priority
    if (task.priority in summary.byPriority) {
      summary.byPriority[task.priority]++
    }
  })

  return summary
}

/**
 * Get patient task summaries for aggregate view
 */
export async function fetchPatientTaskSummaries(
  timeFilter: TimeFilter = '1week'
): Promise<PatientTaskSummary[]> {
  try {
    const tasks = await fetchAggregatePendingTasks(timeFilter)

    // Group tasks by patient
    const patientMap = new Map<string, Task[]>()

    tasks.forEach((task) => {
      if (task.patient_id && task.patient_name) {
        if (!patientMap.has(task.patient_id)) {
          patientMap.set(task.patient_id, [])
        }
        patientMap.get(task.patient_id)!.push(task)
      }
    })

    const now = new Date()
    const summaries: PatientTaskSummary[] = []

    patientMap.forEach((patientTasks, patientId) => {
      const patientName = patientTasks[0].patient_name || 'Unknown Patient'

      const summary: PatientTaskSummary = {
        patientId,
        patientName,
        totalTasks: patientTasks.length,
        pendingTasks: patientTasks.filter(t =>
          ['pending', 'acknowledged', 'scheduled', 'todo'].includes(t.status)
        ).length,
        completedTasks: patientTasks.filter(t => t.status === 'completed').length,
        overdueTasks: patientTasks.filter(t =>
          t.due_date &&
          new Date(t.due_date) < now &&
          t.status !== 'completed'
        ).length,
        highPriorityTasks: patientTasks.filter(t => t.priority === 'high').length,
      }

      summaries.push(summary)
    })

    // Sort by number of pending tasks (descending)
    return summaries.sort((a, b) => b.pendingTasks - a.pendingTasks)
  } catch (error) {
    console.error('Error in fetchPatientTaskSummaries:', error)
    return []
  }
}

/**
 * Update task status
 */
export async function updateTaskStatus(
  taskId: string,
  newStatus: TaskStatus
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('tasks')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId)

    if (error) {
      console.error('Error updating task status:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in updateTaskStatus:', error)
    return false
  }
}

/**
 * Get time filter label
 */
export function getTimeFilterLabel(filter: TimeFilter): string {
  const labels: Record<TimeFilter, string> = {
    '1week': 'Last 7 Days',
    '2weeks': 'Last 2 Weeks',
    '1month': 'Last Month',
    '2months': 'Last 2 Months',
    '3months': 'Last 3 Months',
  }
  return labels[filter]
}

/**
 * Get entity ID based on task category
 */
export function getTaskEntityId(task: Task): string {
  switch (task.category) {
    case 'provider-level':
      return task.provider_license_id || task.provider_email || task.id
    case 'patient-level':
      return task.patient_id || task.id
    case 'system-level':
      return task.system_name || task.id
    case 'community-level':
      return task.community_resource_name || task.id
    default:
      return task.id
  }
}

/**
 * Get entity name based on task category
 */
export function getTaskEntityName(task: Task): string {
  switch (task.category) {
    case 'provider-level':
      return task.provider_name || 'Provider Task'
    case 'patient-level':
      return task.patient_name || 'Patient Task'
    case 'system-level':
      return task.system_name || 'System Task'
    case 'community-level':
      return task.community_resource_name || 'Community Task'
    default:
      return 'Task'
  }
}

/**
 * Get entity contact/location info based on task category
 */
export function getTaskEntityDetails(task: Task): string | null {
  switch (task.category) {
    case 'provider-level':
      return task.provider_organization || task.provider_specialty || null
    case 'patient-level':
      return task.patient_contact || null
    case 'system-level':
      return task.system_location || null
    case 'community-level':
      return task.community_location || null
    default:
      return null
  }
}

/**
 * Get entity task summaries for aggregate view (all categories)
 */
export async function fetchEntityTaskSummaries(
  timeFilter: TimeFilter = '1week'
): Promise<EntityTaskSummary[]> {
  try {
    const tasks = await fetchAggregatePendingTasks(timeFilter)

    // Group tasks by entity
    const entityMap = new Map<string, Task[]>()

    tasks.forEach((task) => {
      const entityId = getTaskEntityId(task)
      if (!entityMap.has(entityId)) {
        entityMap.set(entityId, [])
      }
      entityMap.get(entityId)!.push(task)
    })

    const now = new Date()
    const summaries: EntityTaskSummary[] = []

    entityMap.forEach((entityTasks, entityId) => {
      const firstTask = entityTasks[0]
      const entityName = getTaskEntityName(firstTask)
      const entityDetails = getTaskEntityDetails(firstTask)

      const summary: EntityTaskSummary = {
        entityId,
        entityName,
        entityType: firstTask.category,
        totalTasks: entityTasks.length,
        pendingTasks: entityTasks.filter(t =>
          ['pending', 'acknowledged', 'scheduled', 'todo'].includes(t.status)
        ).length,
        completedTasks: entityTasks.filter(t => t.status === 'completed').length,
        overdueTasks: entityTasks.filter(t =>
          t.due_date &&
          new Date(t.due_date) < now &&
          t.status !== 'completed'
        ).length,
        highPriorityTasks: entityTasks.filter(t => t.priority === 'high').length,
        entityDetails: entityDetails || undefined,
      }

      summaries.push(summary)
    })

    // Sort by number of pending tasks (descending)
    return summaries.sort((a, b) => b.pendingTasks - a.pendingTasks)
  } catch (error) {
    console.error('Error in fetchEntityTaskSummaries:', error)
    return []
  }
}
