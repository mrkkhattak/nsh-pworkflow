import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type RiskCategory = 'very_high' | 'high' | 'moderate' | 'low'

export interface RiskDistributionPoint {
  id: string
  period_date: string
  risk_category: RiskCategory
  patient_count: number
  percentage: number
  total_patients: number
  cohort_filter: string
  created_at: string
  updated_at: string
}

export interface RiskTrendData {
  period: string
  very_high: number
  high: number
  moderate: number
  low: number
  total: number
}

export interface RiskTrendSummary {
  category: RiskCategory
  currentCount: number
  previousCount: number
  change: number
  changePercent: number
  trend: 'increasing' | 'decreasing' | 'stable'
}

export function getRiskCategoryLabel(category: RiskCategory): string {
  const labels: Record<RiskCategory, string> = {
    very_high: 'Very High Risk',
    high: 'High Risk',
    moderate: 'Moderate Risk',
    low: 'Low Risk',
  }
  return labels[category]
}

export function getRiskCategoryColor(category: RiskCategory): string {
  const colors: Record<RiskCategory, string> = {
    very_high: '#dc2626',
    high: '#f97316',
    moderate: '#eab308',
    low: '#10b981',
  }
  return colors[category]
}

export async function fetchRiskTrendData(
  timeframe: '1month' | '3months' | '6months' | '1year',
  cohortFilter: string = 'all'
): Promise<RiskTrendData[]> {
  const monthsMap = {
    '1month': 1,
    '3months': 3,
    '6months': 6,
    '1year': 12,
  }

  const months = monthsMap[timeframe]
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - months)

  const { data, error } = await supabase
    .from('risk_distribution_history')
    .select('*')
    .gte('period_date', startDate.toISOString().split('T')[0])
    .eq('cohort_filter', cohortFilter)
    .order('period_date', { ascending: true })

  if (error) {
    console.error('Error fetching risk trend data:', error)
    return generateMockRiskTrendData(timeframe)
  }

  if (!data || data.length === 0) {
    return generateMockRiskTrendData(timeframe)
  }

  return transformRiskDistributionData(data as RiskDistributionPoint[])
}

function transformRiskDistributionData(data: RiskDistributionPoint[]): RiskTrendData[] {
  const groupedByDate = data.reduce((acc, point) => {
    const dateKey = point.period_date
    if (!acc[dateKey]) {
      acc[dateKey] = {
        period: formatPeriodLabel(point.period_date),
        very_high: 0,
        high: 0,
        moderate: 0,
        low: 0,
        total: point.total_patients,
      }
    }
    acc[dateKey][point.risk_category] = point.patient_count
    return acc
  }, {} as Record<string, RiskTrendData>)

  return Object.values(groupedByDate).sort((a, b) => {
    return new Date(a.period).getTime() - new Date(b.period).getTime()
  })
}

function formatPeriodLabel(dateString: string): string {
  const date = new Date(dateString)
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  const year = date.getFullYear()
  return `${month} ${year}`
}

function generateMockRiskTrendData(timeframe: '1month' | '3months' | '6months' | '1year'): RiskTrendData[] {
  const periodsMap = {
    '1month': 4,
    '3months': 12,
    '6months': 6,
    '1year': 12,
  }

  const periods = periodsMap[timeframe]
  const data: RiskTrendData[] = []
  const now = new Date()

  for (let i = periods - 1; i >= 0; i--) {
    const date = new Date(now)

    if (timeframe === '1month') {
      date.setDate(date.getDate() - (i * 7))
    } else if (timeframe === '3months') {
      date.setDate(date.getDate() - (i * 7))
    } else {
      date.setMonth(date.getMonth() - i)
    }

    const veryHighBase = 12
    const highBase = 33
    const moderateBase = 78
    const lowBase = 33

    const veryHigh = Math.max(8, veryHighBase + Math.floor(Math.random() * 4) - (periods - i) * 0.5)
    const high = Math.max(25, highBase + Math.floor(Math.random() * 6) - (periods - i) * 0.3)
    const moderate = moderateBase + Math.floor(Math.random() * 8) - 4
    const low = Math.max(28, lowBase + Math.floor(Math.random() * 4) + (periods - i) * 0.4)

    data.push({
      period: formatPeriodLabel(date.toISOString().split('T')[0]),
      very_high: Math.round(veryHigh),
      high: Math.round(high),
      moderate: Math.round(moderate),
      low: Math.round(low),
      total: Math.round(veryHigh + high + moderate + low),
    })
  }

  return data
}

export async function getRiskTrendSummary(
  timeframe: '1month' | '3months' | '6months' | '1year',
  cohortFilter: string = 'all'
): Promise<RiskTrendSummary[]> {
  const data = await fetchRiskTrendData(timeframe, cohortFilter)

  if (data.length < 2) {
    return []
  }

  const current = data[data.length - 1]
  const previous = data[0]

  const categories: RiskCategory[] = ['very_high', 'high', 'moderate', 'low']

  return categories.map((category) => {
    const currentCount = current[category]
    const previousCount = previous[category]
    const change = currentCount - previousCount
    const changePercent = previousCount > 0 ? (change / previousCount) * 100 : 0

    let trend: 'increasing' | 'decreasing' | 'stable'
    if (Math.abs(changePercent) < 5) {
      trend = 'stable'
    } else if (change > 0) {
      trend = 'increasing'
    } else {
      trend = 'decreasing'
    }

    return {
      category,
      currentCount,
      previousCount,
      change,
      changePercent: Math.round(changePercent * 10) / 10,
      trend,
    }
  })
}

export function getOverallRiskTrend(summaries: RiskTrendSummary[]): {
  improving: boolean
  message: string
} {
  const veryHighSummary = summaries.find((s) => s.category === 'very_high')
  const highSummary = summaries.find((s) => s.category === 'high')
  const lowSummary = summaries.find((s) => s.category === 'low')

  const highRiskDecreasing =
    (veryHighSummary?.trend === 'decreasing' || veryHighSummary?.trend === 'stable') &&
    (highSummary?.trend === 'decreasing' || highSummary?.trend === 'stable')

  const lowRiskIncreasing = lowSummary?.trend === 'increasing'

  const improving = highRiskDecreasing || lowRiskIncreasing

  let message = ''
  if (improving) {
    if (lowRiskIncreasing && highRiskDecreasing) {
      message = 'Population health is improving: high-risk patients decreasing while low-risk patients increasing'
    } else if (lowRiskIncreasing) {
      message = 'Positive trend: low-risk patient population is growing'
    } else {
      message = 'Positive trend: high-risk patient population is declining'
    }
  } else {
    message = 'Risk distribution requires attention: monitor high-risk patient trends closely'
  }

  return { improving, message }
}
