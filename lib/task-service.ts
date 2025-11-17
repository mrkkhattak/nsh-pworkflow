import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Task {
  id: string
  category: string
  status: string
  title: string
  description: string
  priority: string
  due_date: string
  assignee: string
  dimension?: string | null
  sla_status: string
  estimated_time?: string | null
  blockers: string[]

  provider_name?: string | null
  provider_credential?: string | null
  provider_email?: string | null
  provider_specialty?: string | null
  provider_license_id?: string | null
  provider_organization?: string | null
  provider_address?: string | null
  provider_zip?: string | null
  provider_state?: string | null
  provider_country?: string | null

  patient_id?: string | null
  patient_name?: string | null
  patient_website?: string | null
  patient_contact?: string | null

  community_resource_name?: string | null
  community_website?: string | null
  community_email?: string | null
  community_location?: string | null
  community_contact?: string | null

  system_name?: string | null
  system_website?: string | null
  system_contact?: string | null
  system_location?: string | null

  created_at?: string
  updated_at?: string
}

export interface TaskStats {
  total: number
  pending: number
  scheduled: number
  inProgress: number
  completed: number
  declined: number
  overdue: number
  byPriority: {
    high: number
    medium: number
    low: number
  }
  byCategory: {
    'provider-level': number
    'patient-level': number
    'system-level': number
    'community-level': number
  }
}

export interface DateRange {
  start: string
  end: string
}

export function getDefaultDateRange(): DateRange {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 7)

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0]
  }
}

export async function getAllPendingTasks(dateRange?: DateRange): Promise<Task[]> {
  const range = dateRange || getDefaultDateRange()

  let query = supabase
    .from('tasks')
    .select('*')
    .eq('status', 'pending')
    .gte('due_date', range.start)
    .lte('due_date', range.end)
    .order('due_date', { ascending: true })
    .order('priority', { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching pending tasks:', error)
    return []
  }

  return data || []
}

export async function getTasksByStatus(status: string, dateRange?: DateRange): Promise<Task[]> {
  const range = dateRange || getDefaultDateRange()

  let query = supabase
    .from('tasks')
    .select('*')
    .eq('status', status)
    .gte('due_date', range.start)
    .lte('due_date', range.end)
    .order('due_date', { ascending: true })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching tasks by status:', error)
    return []
  }

  return data || []
}

export async function getAllTasks(filters?: {
  status?: string
  patientId?: string
  category?: string
  priority?: string
  dateRange?: DateRange
  searchQuery?: string
}): Promise<Task[]> {
  const range = filters?.dateRange || getDefaultDateRange()

  let query = supabase
    .from('tasks')
    .select('*')
    .gte('due_date', range.start)
    .lte('due_date', range.end)

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }

  if (filters?.patientId && filters.patientId !== 'all') {
    query = query.eq('patient_id', filters.patientId)
  }

  if (filters?.category && filters.category !== 'all') {
    query = query.eq('category', filters.category)
  }

  if (filters?.priority && filters.priority !== 'all') {
    query = query.eq('priority', filters.priority)
  }

  if (filters?.searchQuery) {
    query = query.or(`title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`)
  }

  query = query.order('due_date', { ascending: true })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching tasks:', error)
    return []
  }

  return data || []
}

export async function getTaskStats(dateRange?: DateRange): Promise<TaskStats> {
  const range = dateRange || getDefaultDateRange()

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .gte('due_date', range.start)
    .lte('due_date', range.end)

  if (error) {
    console.error('Error fetching task stats:', error)
    return {
      total: 0,
      pending: 0,
      scheduled: 0,
      inProgress: 0,
      completed: 0,
      declined: 0,
      overdue: 0,
      byPriority: { high: 0, medium: 0, low: 0 },
      byCategory: {
        'provider-level': 0,
        'patient-level': 0,
        'system-level': 0,
        'community-level': 0
      }
    }
  }

  const tasks = data || []
  const today = new Date().toISOString().split('T')[0]

  return {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    scheduled: tasks.filter(t => t.status === 'scheduled').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    declined: tasks.filter(t => t.status === 'declined').length,
    overdue: tasks.filter(t => t.sla_status === 'overdue' || (t.due_date < today && t.status !== 'completed')).length,
    byPriority: {
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length
    },
    byCategory: {
      'provider-level': tasks.filter(t => t.category === 'provider-level').length,
      'patient-level': tasks.filter(t => t.category === 'patient-level').length,
      'system-level': tasks.filter(t => t.category === 'system-level').length,
      'community-level': tasks.filter(t => t.category === 'community-level').length
    }
  }
}

export async function getUniquePatients(): Promise<Array<{ id: string; name: string }>> {
  const { data, error } = await supabase
    .from('tasks')
    .select('patient_id, patient_name')
    .not('patient_id', 'is', null)
    .not('patient_name', 'is', null)

  if (error) {
    console.error('Error fetching patients:', error)
    return []
  }

  const uniquePatients = new Map<string, string>()
  data?.forEach(task => {
    if (task.patient_id && task.patient_name && !uniquePatients.has(task.patient_id)) {
      uniquePatients.set(task.patient_id, task.patient_name)
    }
  })

  return Array.from(uniquePatients.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export async function updateTaskStatus(taskId: string, status: string): Promise<Task | null> {
  const { data, error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', taskId)
    .select()
    .maybeSingle()

  if (error) {
    console.error('Error updating task status:', error)
    return null
  }

  return data
}

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<Task | null> {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .maybeSingle()

  if (error) {
    console.error('Error updating task:', error)
    return null
  }

  return data
}

export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task | null> {
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select()
    .maybeSingle()

  if (error) {
    console.error('Error creating task:', error)
    return null
  }

  return data
}

export async function deleteTask(taskId: string): Promise<boolean> {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)

  if (error) {
    console.error('Error deleting task:', error)
    return false
  }

  return true
}

export function isTaskOverdue(task: Task): boolean {
  const today = new Date().toISOString().split('T')[0]
  return task.due_date < today && task.status !== 'completed'
}

export function getTaskUrgency(task: Task): 'overdue' | 'due-soon' | 'normal' {
  if (isTaskOverdue(task)) return 'overdue'

  const dueDate = new Date(task.due_date)
  const today = new Date()
  const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays <= 2) return 'due-soon'
  return 'normal'
}
