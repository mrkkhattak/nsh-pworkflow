import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AssessmentOutcome {
  assessmentDate: Date;
  readmissions: number;
  hospitalizations: number;
  edVisits: number;
  functionalCapacity: number;
  engagementScore: number;
  satisfactionScore: number;
  patientCount: number;
}

export interface SmokingDistribution {
  never: number;
  former: number;
  current: number;
  neverPercent: number;
  formerPercent: number;
  currentPercent: number;
}

export async function getOutcomeTrends(
  startDate: Date,
  endDate: Date,
  dimensionFilter?: string,
  riskFilter?: string,
  smokingFilter?: string
): Promise<AssessmentOutcome[]> {
  let query = supabase
    .from('patient_outcomes')
    .select('*')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .order('created_at', { ascending: true });

  if (dimensionFilter && dimensionFilter !== 'all') {
    query = query.eq('primary_dimension', dimensionFilter);
  }

  if (riskFilter && riskFilter !== 'all') {
    query = query.eq('risk_level', riskFilter);
  }

  if (smokingFilter && smokingFilter !== 'all') {
    query = query.eq('smoking_status', smokingFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching outcome trends:', error);
    return [];
  }

  const groupedByDate = new Map<string, any[]>();

  data?.forEach((outcome) => {
    const date = new Date(outcome.created_at).toISOString().split('T')[0];
    if (!groupedByDate.has(date)) {
      groupedByDate.set(date, []);
    }
    groupedByDate.get(date)!.push(outcome);
  });

  const trends: AssessmentOutcome[] = [];

  groupedByDate.forEach((outcomes, dateStr) => {
    const avgReadmissions = outcomes.reduce((sum, o) => sum + Number(o.readmissions), 0) / outcomes.length;
    const avgHospitalizations = outcomes.reduce((sum, o) => sum + Number(o.hospitalizations), 0) / outcomes.length;
    const avgEdVisits = outcomes.reduce((sum, o) => sum + Number(o.ed_visits), 0) / outcomes.length;
    const avgFunctionalCapacity = outcomes.reduce((sum, o) => sum + Number(o.functional_capacity), 0) / outcomes.length;
    const avgEngagementScore = outcomes.reduce((sum, o) => sum + Number(o.engagement_score || 0), 0) / outcomes.length;
    const avgSatisfactionScore = outcomes.reduce((sum, o) => sum + Number(o.satisfaction_score || 0), 0) / outcomes.length;

    trends.push({
      assessmentDate: new Date(dateStr),
      readmissions: Math.round(avgReadmissions * 10) / 10,
      hospitalizations: Math.round(avgHospitalizations * 10) / 10,
      edVisits: Math.round(avgEdVisits * 10) / 10,
      functionalCapacity: Math.round(avgFunctionalCapacity * 10) / 10,
      engagementScore: Math.round(avgEngagementScore * 10) / 10,
      satisfactionScore: Math.round(avgSatisfactionScore * 10) / 10,
      patientCount: outcomes.length,
    });
  });

  return trends.sort((a, b) => a.assessmentDate.getTime() - b.assessmentDate.getTime());
}

export async function getCurrentPeriodStats() {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 3);

  const { data, error } = await supabase
    .from('patient_outcomes')
    .select('*')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (error || !data || data.length === 0) {
    return null;
  }

  const avgReadmissions = data.reduce((sum, o) => sum + Number(o.readmissions), 0) / data.length;
  const avgHospitalizations = data.reduce((sum, o) => sum + Number(o.hospitalizations), 0) / data.length;
  const avgEdVisits = data.reduce((sum, o) => sum + Number(o.ed_visits), 0) / data.length;
  const avgFunctionalCapacity = data.reduce((sum, o) => sum + Number(o.functional_capacity), 0) / data.length;
  const avgEngagementScore = data.reduce((sum, o) => sum + Number(o.engagement_score || 0), 0) / data.length;
  const avgSatisfactionScore = data.reduce((sum, o) => sum + Number(o.satisfaction_score || 0), 0) / data.length;

  return {
    avgReadmissions: Math.round(avgReadmissions * 10) / 10,
    avgHospitalizations: Math.round(avgHospitalizations * 10) / 10,
    avgEdVisits: Math.round(avgEdVisits * 10) / 10,
    avgFunctionalCapacity: Math.round(avgFunctionalCapacity * 10) / 10,
    avgEngagementScore: Math.round(avgEngagementScore * 10) / 10,
    avgSatisfactionScore: Math.round(avgSatisfactionScore * 10) / 10,
    totalPatients: data.length,
    benchmark: {
      readmissions: 1.8,
      hospitalizations: 1.2,
      edVisits: 2.5,
      functionalCapacity: 70,
      engagementScore: 25,
      satisfactionScore: 20,
    },
  };
}

export async function getSmokingStatusDistribution(): Promise<SmokingDistribution> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 3);

  const { data, error } = await supabase
    .from('patient_outcomes')
    .select('smoking_status')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (error || !data || data.length === 0) {
    return {
      never: 0,
      former: 0,
      current: 0,
      neverPercent: 0,
      formerPercent: 0,
      currentPercent: 0,
    };
  }

  const total = data.length;
  const neverCount = data.filter(d => d.smoking_status === 'never').length;
  const formerCount = data.filter(d => d.smoking_status === 'former').length;
  const currentCount = data.filter(d => d.smoking_status === 'current').length;

  return {
    never: neverCount,
    former: formerCount,
    current: currentCount,
    neverPercent: Math.round((neverCount / total) * 100),
    formerPercent: Math.round((formerCount / total) * 100),
    currentPercent: Math.round((currentCount / total) * 100),
  };
}

export async function getBenchmarkComparison() {
  const currentStats = await getCurrentPeriodStats();

  if (!currentStats) {
    return [];
  }

  return [
    {
      metric: 'Readmissions',
      'Your Cohort': currentStats.avgReadmissions,
      'Benchmark': currentStats.benchmark.readmissions,
    },
    {
      metric: 'Hospitalizations',
      'Your Cohort': currentStats.avgHospitalizations,
      'Benchmark': currentStats.benchmark.hospitalizations,
    },
    {
      metric: 'ED Visits',
      'Your Cohort': currentStats.avgEdVisits,
      'Benchmark': currentStats.benchmark.edVisits,
    },
    {
      metric: 'Functional Capacity',
      'Your Cohort': currentStats.avgFunctionalCapacity,
      'Benchmark': currentStats.benchmark.functionalCapacity,
    },
    {
      metric: 'Patient Engagement',
      'Your Cohort': currentStats.avgEngagementScore,
      'Benchmark': currentStats.benchmark.engagementScore,
    },
    {
      metric: 'Patient Satisfaction',
      'Your Cohort': currentStats.avgSatisfactionScore,
      'Benchmark': currentStats.benchmark.satisfactionScore,
    },
  ];
}
