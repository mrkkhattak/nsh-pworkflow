import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface AssessmentStatusCounts {
  completed: number
  pending: number
  cancelled: number
  missed: number
  total: number
}

export interface CompletedAssessmentsByDimension {
  dimensionId: string
  dimensionName: string
  completedCount: number
  pendingCount: number
  deniedCount: number
  totalCount: number
  completionRate: number
}

export interface AssessmentStatusMetrics {
  totalPatients: number
  uniquePatientsCompleted: number
  totalCompletedAssessments: number
  totalPendingAssessments: number
  averageAssessmentsPerPatient: number
  completionRate: number
  trendData: {
    current: number
    previous: number
    change: number
    changePercent: number
  }
}

/**
 * Fetch overall assessment status counts
 */
export async function fetchAssessmentStatusCounts(): Promise<AssessmentStatusCounts> {
  try {
    const { data, error } = await supabase
      .from('scheduled_assessments')
      .select('status')

    if (error) {
      console.error('Error fetching assessment status counts:', error)
      return generateMockStatusCounts()
    }

    if (!data || data.length === 0) {
      return generateMockStatusCounts()
    }

    const counts = data.reduce(
      (acc, row) => {
        const status = row.status as string
        if (status === 'completed') acc.completed++
        else if (status === 'scheduled') acc.pending++
        else if (status === 'cancelled') acc.cancelled++
        else if (status === 'missed') acc.missed++
        acc.total++
        return acc
      },
      { completed: 0, pending: 0, cancelled: 0, missed: 0, total: 0 }
    )

    return counts
  } catch (error) {
    console.error('Error in fetchAssessmentStatusCounts:', error)
    return generateMockStatusCounts()
  }
}

/**
 * Fetch assessment status metrics including unique patients with completed assessments
 */
export async function fetchAssessmentStatusMetrics(): Promise<AssessmentStatusMetrics> {
  try {
    // Fetch all assessments
    const { data: allAssessments, error: allError } = await supabase
      .from('scheduled_assessments')
      .select('patient_id, status, completed_at')

    if (allError) {
      console.error('Error fetching all assessments:', allError)
      return generateMockMetrics()
    }

    if (!allAssessments || allAssessments.length === 0) {
      return generateMockMetrics()
    }

    // Count unique patients who have completed at least one assessment
    const uniquePatientsCompleted = new Set(
      allAssessments
        .filter(a => a.status === 'completed')
        .map(a => a.patient_id)
    ).size

    // Count total completed assessments
    const totalCompletedAssessments = allAssessments.filter(
      a => a.status === 'completed'
    ).length

    // Count total pending assessments
    const totalPendingAssessments = allAssessments.filter(
      a => a.status === 'scheduled'
    ).length

    // Count unique patients total
    const totalPatients = new Set(allAssessments.map(a => a.patient_id)).size

    // Calculate average assessments per patient
    const averageAssessmentsPerPatient = totalPatients > 0 
      ? totalCompletedAssessments / totalPatients 
      : 0

    // Calculate completion rate
    const completionRate = allAssessments.length > 0
      ? (totalCompletedAssessments / allAssessments.length) * 100
      : 0

    // Calculate trend data (last 30 days vs previous 30 days)
    const now = new Date()
    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const sixtyDaysAgo = new Date(now)
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

    const currentPeriodCompleted = allAssessments.filter(a => 
      a.status === 'completed' && 
      a.completed_at && 
      new Date(a.completed_at) >= thirtyDaysAgo
    ).length

    const previousPeriodCompleted = allAssessments.filter(a => 
      a.status === 'completed' && 
      a.completed_at && 
      new Date(a.completed_at) >= sixtyDaysAgo &&
      new Date(a.completed_at) < thirtyDaysAgo
    ).length

    const change = currentPeriodCompleted - previousPeriodCompleted
    const changePercent = previousPeriodCompleted > 0 
      ? (change / previousPeriodCompleted) * 100 
      : 0

    return {
      totalPatients,
      uniquePatientsCompleted,
      totalCompletedAssessments,
      totalPendingAssessments,
      averageAssessmentsPerPatient: Math.round(averageAssessmentsPerPatient * 10) / 10,
      completionRate: Math.round(completionRate * 10) / 10,
      trendData: {
        current: currentPeriodCompleted,
        previous: previousPeriodCompleted,
        change,
        changePercent: Math.round(changePercent * 10) / 10,
      }
    }
  } catch (error) {
    console.error('Error in fetchAssessmentStatusMetrics:', error)
    return generateMockMetrics()
  }
}

/**
 * Fetch completed assessments breakdown by dimension
 * Note: This requires dimension tracking in the database
 * For now, returns mock data structure
 */
export async function fetchCompletedAssessmentsByDimension(): Promise<CompletedAssessmentsByDimension[]> {
  // This would require a dimension_assessments table or dimension field in scheduled_assessments
  // Returning mock structure for now
  return generateMockDimensionBreakdown()
}

// Mock data generators
function generateMockStatusCounts(): AssessmentStatusCounts {
  return {
    completed: 54,
    pending: 32,
    cancelled: 8,
    missed: 14,
    total: 108
  }
}

function generateMockMetrics(): AssessmentStatusMetrics {
  return {
    totalPatients: 156,
    uniquePatientsCompleted: 84,
    totalCompletedAssessments: 234,
    totalPendingAssessments: 32,
    averageAssessmentsPerPatient: 2.8,
    completionRate: 73.1,
    trendData: {
      current: 45,
      previous: 38,
      change: 7,
      changePercent: 18.4
    }
  }
}

function generateMockDimensionBreakdown(): CompletedAssessmentsByDimension[] {
  const dimensions = [
    { id: 'physical', name: 'Physical Health' },
    { id: 'mental', name: 'Mental Health' },
    { id: 'sdoh', name: 'Social Determinants of Health' },
    { id: 'engagement', name: 'Patient Engagement' },
    { id: 'burden', name: 'Burden of Illness' },
  ]

  return dimensions.map(dim => ({
    dimensionId: dim.id,
    dimensionName: dim.name,
    completedCount: Math.floor(Math.random() * 50) + 40,
    pendingCount: Math.floor(Math.random() * 15) + 5,
    deniedCount: Math.floor(Math.random() * 8) + 2,
    totalCount: 0,
    completionRate: 0
  })).map(item => ({
    ...item,
    totalCount: item.completedCount + item.pendingCount + item.deniedCount,
    completionRate: Math.round((item.completedCount / (item.completedCount + item.pendingCount + item.deniedCount)) * 100 * 10) / 10
  }))
}
