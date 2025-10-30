import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Intervention = {
  id: string
  patient_id: number
  type: 'Medication' | 'Lifestyle' | 'Therapy' | 'Other'
  date: string
  details: Record<string, string>
  notes?: string
  goal_id?: string
  status: 'active' | 'stopped' | 'completed'
  stopped_date?: string
  stopped_reason?: string
  stopped_by?: string
  created_by: string
  created_at: string
  updated_at: string
}

export type Goal = {
  id: string
  patient_id: number
  description: string
  dimension: string
  baseline: number
  target: number
  current: number
  timeframe: string
  deadline: string
  status: 'on-track' | 'at-risk' | 'achieved' | 'cancelled'
  notes?: string
  created_by: string
  created_at: string
  updated_at: string
}

export async function getInterventions(patientId: number) {
  const { data, error } = await supabase
    .from('interventions')
    .select('*')
    .eq('patient_id', patientId)
    .order('date', { ascending: false })

  if (error) throw error
  return data as Intervention[]
}

export async function createIntervention(intervention: Omit<Intervention, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('interventions')
    .insert(intervention)
    .select()
    .single()

  if (error) throw error
  return data as Intervention
}

export async function updateIntervention(id: string, updates: Partial<Intervention>) {
  const { data, error } = await supabase
    .from('interventions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Intervention
}

export async function getGoals(patientId: number) {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Goal[]
}

export async function createGoal(goal: Omit<Goal, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('goals')
    .insert(goal)
    .select()
    .single()

  if (error) throw error
  return data as Goal
}

export async function updateGoal(id: string, updates: Partial<Goal>) {
  const { data, error } = await supabase
    .from('goals')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Goal
}
