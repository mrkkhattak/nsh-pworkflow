import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export interface Intervention {
  id: string
  patient_id: number
  type: 'Medication' | 'Lifestyle' | 'Therapy' | 'Social' | 'Other'
  date: string
  end_date?: string | null
  details: Record<string, any>
  notes?: string | null
  goal_id?: string | null
  status: 'active' | 'stopped' | 'completed'
  stopped_date?: string | null
  stopped_reason?: string | null
  stopped_by?: string | null
  created_by: string
  created_at?: string
  updated_at?: string
}

export interface DimensionIntervention {
  id: string
  patient_id: number
  dimension_id: string
  dimension_name: string
  goal_id?: string | null
  intervention_type: 'Medication' | 'Lifestyle' | 'Therapy' | 'Social' | 'Other'
  intervention_name: string
  details: Record<string, any>
  notes?: string | null
  start_date: string
  end_date?: string | null
  status: 'active' | 'stopped' | 'completed'
  stopped_date?: string | null
  stopped_reason?: string | null
  created_date: string
  created_by: string
  updated_at: string
}

export async function getInterventionsByGoalId(goalId: string): Promise<Intervention[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('interventions')
    .select('*')
    .eq('goal_id', goalId)
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching interventions:', error)
    return []
  }

  return data || []
}

export async function getInterventionsByPatientId(patientId: number): Promise<Intervention[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('interventions')
    .select('*')
    .eq('patient_id', patientId)
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching interventions:', error)
    return []
  }

  return data || []
}

export async function getDimensionInterventionsByGoalId(goalId: string): Promise<DimensionIntervention[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('dimension_interventions')
    .select('*')
    .eq('goal_id', goalId)
    .order('start_date', { ascending: false })

  if (error) {
    console.error('Error fetching dimension interventions:', error)
    return []
  }

  return data || []
}

export async function getDimensionInterventionsByPatientId(patientId: number): Promise<DimensionIntervention[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('dimension_interventions')
    .select('*')
    .eq('patient_id', patientId)
    .order('start_date', { ascending: false })

  if (error) {
    console.error('Error fetching dimension interventions:', error)
    return []
  }

  return data || []
}

export async function createIntervention(intervention: Omit<Intervention, 'id' | 'created_at' | 'updated_at'>): Promise<Intervention | null> {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('interventions')
    .insert([intervention])
    .select()
    .maybeSingle()

  if (error) {
    console.error('Error creating intervention:', error)
    return null
  }

  return data
}

export async function createDimensionIntervention(intervention: Omit<DimensionIntervention, 'id' | 'created_date' | 'updated_at'>): Promise<DimensionIntervention | null> {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('dimension_interventions')
    .insert([intervention])
    .select()
    .maybeSingle()

  if (error) {
    console.error('Error creating dimension intervention:', error)
    return null
  }

  return data
}

export async function updateIntervention(id: string, updates: Partial<Intervention>): Promise<Intervention | null> {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('interventions')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle()

  if (error) {
    console.error('Error updating intervention:', error)
    return null
  }

  return data
}

export async function updateDimensionIntervention(id: string, updates: Partial<DimensionIntervention>): Promise<DimensionIntervention | null> {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('dimension_interventions')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle()

  if (error) {
    console.error('Error updating dimension intervention:', error)
    return null
  }

  return data
}

export async function stopIntervention(id: string, stoppedDate: string, stoppedReason: string, stoppedBy: string): Promise<Intervention | null> {
  return updateIntervention(id, {
    status: 'stopped',
    stopped_date: stoppedDate,
    stopped_reason: stoppedReason,
    stopped_by: stoppedBy,
  })
}

export async function stopDimensionIntervention(id: string, stoppedDate: string, stoppedReason: string): Promise<DimensionIntervention | null> {
  return updateDimensionIntervention(id, {
    status: 'stopped',
    stopped_date: stoppedDate,
    stopped_reason: stoppedReason,
  })
}

export async function getInterventionStats(patientId: number) {
  const interventions = await getInterventionsByPatientId(patientId)
  const dimensionInterventions = await getDimensionInterventionsByPatientId(patientId)

  const allInterventions = [...interventions, ...dimensionInterventions]

  const active = allInterventions.filter(i => i.status === 'active').length
  const stopped = allInterventions.filter(i => i.status === 'stopped').length
  const completed = allInterventions.filter(i => i.status === 'completed').length

  const byType = allInterventions.reduce((acc, intervention) => {
    const type = 'type' in intervention ? intervention.type : intervention.intervention_type
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    total: allInterventions.length,
    active,
    stopped,
    completed,
    byType,
  }
}

export function getInterventionDisplayName(intervention: Intervention | DimensionIntervention): string {
  if ('intervention_name' in intervention) {
    return intervention.intervention_name
  }

  if (intervention.type === 'Medication' && intervention.details?.drugName) {
    return `${intervention.details.drugName}${intervention.details.dose ? ' ' + intervention.details.dose : ''}`
  }

  if (intervention.type === 'Therapy' && intervention.details?.type) {
    return intervention.details.type
  }

  if (intervention.type === 'Lifestyle' && intervention.details?.category) {
    return intervention.details.category
  }

  if (intervention.type === 'Other' && intervention.details?.name) {
    return intervention.details.name
  }

  return intervention.type
}
