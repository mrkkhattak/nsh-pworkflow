export type OutcomeMeasureType = 'readmissions' | 'hospitalizations' | 'ed_visits' | 'functional_capacity';

export interface QuarterlyOutcome {
  patientId: string;
  patientName: string;
  quarter: string;
  year: number;
  readmissions: number;
  hospitalizations: number;
  edVisits: number;
  functionalCapacity: number;
  engagementScore: number;
  satisfactionScore: number;
  smokingStatus: 'never' | 'former' | 'current';
  riskLevel: 'low' | 'medium' | 'high';
  primaryDimension: string;
}

export interface CohortStatistics {
  quarter: string;
  year: number;
  avgReadmissions: number;
  avgHospitalizations: number;
  avgEdVisits: number;
  avgFunctionalCapacity: number;
  avgEngagementScore: number;
  avgSatisfactionScore: number;
  totalPatients: number;
  benchmark: {
    readmissions: number;
    hospitalizations: number;
    edVisits: number;
    functionalCapacity: number;
    engagementScore: number;
    satisfactionScore: number;
  };
}

export interface QuarterlyTrend {
  quarter: string;
  year: number;
  date: string; // Assessment completion date
  readmissions: number;
  hospitalizations: number;
  edVisits: number;
  functionalCapacity: number;
  engagementScore: number;
  satisfactionScore: number;
}

const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
const currentYear = 2025;
const years = [2023, 2024, 2025];

const patients = [
  { id: '1', name: 'Sarah Chen', riskLevel: 'high' as const, primaryDimension: 'Physical Health' },
  { id: '2', name: 'Marcus Johnson', riskLevel: 'medium' as const, primaryDimension: 'Mental Health' },
  { id: '3', name: 'Emily Rodriguez', riskLevel: 'high' as const, primaryDimension: 'Social Determinants' },
  { id: '4', name: 'David Park', riskLevel: 'low' as const, primaryDimension: 'Physical Health' },
  { id: '5', name: 'Lisa Thompson', riskLevel: 'medium' as const, primaryDimension: 'Mental Health' },
  { id: '6', name: 'James Wilson', riskLevel: 'high' as const, primaryDimension: 'Physical Health' },
  { id: '7', name: 'Maria Garcia', riskLevel: 'low' as const, primaryDimension: 'Social Determinants' },
  { id: '8', name: 'Robert Lee', riskLevel: 'medium' as const, primaryDimension: 'Physical Health' },
];

function generateOutcomeValue(
  baseValue: number,
  trendDirection: 'improving' | 'stable' | 'declining',
  quarterIndex: number,
  randomness: number = 0.2
): number {
  let value = baseValue;

  if (trendDirection === 'improving') {
    value = baseValue * (1 - (quarterIndex * 0.15));
  } else if (trendDirection === 'declining') {
    value = baseValue * (1 + (quarterIndex * 0.12));
  }

  const randomFactor = 1 + (Math.random() - 0.5) * randomness;
  return Math.max(0, Math.round(value * randomFactor * 10) / 10);
}

function generateQuarterlyData(): QuarterlyOutcome[] {
  const data: QuarterlyOutcome[] = [];

  patients.forEach(patient => {
    let readmissionsTrend: 'improving' | 'stable' | 'declining';
    let hospitalizationsTrend: 'improving' | 'stable' | 'declining';
    let edVisitsTrend: 'improving' | 'stable' | 'declining';
    let functionalCapacityTrend: 'improving' | 'stable' | 'declining';
    let engagementTrend: 'improving' | 'stable' | 'declining';
    let satisfactionTrend: 'improving' | 'stable' | 'declining';

    if (patient.riskLevel === 'high') {
      readmissionsTrend = Math.random() > 0.3 ? 'improving' : 'stable';
      hospitalizationsTrend = Math.random() > 0.3 ? 'improving' : 'stable';
      edVisitsTrend = Math.random() > 0.4 ? 'improving' : 'declining';
      functionalCapacityTrend = Math.random() > 0.3 ? 'improving' : 'stable';
      engagementTrend = Math.random() > 0.3 ? 'improving' : 'stable';
      satisfactionTrend = Math.random() > 0.3 ? 'improving' : 'stable';
    } else if (patient.riskLevel === 'medium') {
      readmissionsTrend = Math.random() > 0.5 ? 'improving' : 'stable';
      hospitalizationsTrend = Math.random() > 0.5 ? 'improving' : 'stable';
      edVisitsTrend = Math.random() > 0.5 ? 'improving' : 'stable';
      functionalCapacityTrend = Math.random() > 0.4 ? 'improving' : 'stable';
      engagementTrend = Math.random() > 0.5 ? 'improving' : 'stable';
      satisfactionTrend = Math.random() > 0.5 ? 'improving' : 'stable';
    } else {
      readmissionsTrend = 'stable';
      hospitalizationsTrend = 'stable';
      edVisitsTrend = 'stable';
      functionalCapacityTrend = Math.random() > 0.6 ? 'improving' : 'stable';
      engagementTrend = 'stable';
      satisfactionTrend = 'stable';
    }

    const baseReadmissions = patient.riskLevel === 'high' ? 2.5 : patient.riskLevel === 'medium' ? 1.2 : 0.3;
    const baseHospitalizations = patient.riskLevel === 'high' ? 1.8 : patient.riskLevel === 'medium' ? 0.8 : 0.2;
    const baseEdVisits = patient.riskLevel === 'high' ? 3.5 : patient.riskLevel === 'medium' ? 1.5 : 0.5;
    const baseFunctionalCapacity = patient.riskLevel === 'high' ? 55 : patient.riskLevel === 'medium' ? 68 : 82;
    const baseEngagementScore = patient.riskLevel === 'high' ? 35 : patient.riskLevel === 'medium' ? 22 : 15;
    const baseSatisfactionScore = patient.riskLevel === 'high' ? 28 : patient.riskLevel === 'medium' ? 18 : 12;

    const smokingStatus: 'never' | 'former' | 'current' =
      patient.riskLevel === 'high'
        ? (Math.random() > 0.5 ? 'current' : 'former')
        : patient.riskLevel === 'medium'
        ? (Math.random() > 0.7 ? 'current' : Math.random() > 0.5 ? 'former' : 'never')
        : (Math.random() > 0.8 ? 'former' : 'never');

    let quarterIndex = 0;
    years.forEach(year => {
      quarters.forEach(quarter => {
        if (year === currentYear && quarters.indexOf(quarter) > 2) {
          return;
        }

        data.push({
          patientId: patient.id,
          patientName: patient.name,
          quarter,
          year,
          readmissions: generateOutcomeValue(baseReadmissions, readmissionsTrend, quarterIndex),
          hospitalizations: generateOutcomeValue(baseHospitalizations, hospitalizationsTrend, quarterIndex),
          edVisits: generateOutcomeValue(baseEdVisits, edVisitsTrend, quarterIndex),
          functionalCapacity: generateOutcomeValue(baseFunctionalCapacity, functionalCapacityTrend, quarterIndex, 0.1),
          engagementScore: generateOutcomeValue(baseEngagementScore, engagementTrend, quarterIndex, 0.15),
          satisfactionScore: generateOutcomeValue(baseSatisfactionScore, satisfactionTrend, quarterIndex, 0.15),
          smokingStatus,
          riskLevel: patient.riskLevel,
          primaryDimension: patient.primaryDimension,
        });

        quarterIndex++;
      });
    });
  });

  return data;
}

function generateCohortStatistics(): CohortStatistics[] {
  const quarterlyData = generateQuarterlyData();
  const stats: CohortStatistics[] = [];

  years.forEach(year => {
    quarters.forEach((quarter, qIndex) => {
      if (year === currentYear && qIndex > 2) {
        return;
      }

      const quarterData = quarterlyData.filter(d => d.quarter === quarter && d.year === year);

      if (quarterData.length > 0) {
        const avgReadmissions = quarterData.reduce((sum, d) => sum + d.readmissions, 0) / quarterData.length;
        const avgHospitalizations = quarterData.reduce((sum, d) => sum + d.hospitalizations, 0) / quarterData.length;
        const avgEdVisits = quarterData.reduce((sum, d) => sum + d.edVisits, 0) / quarterData.length;
        const avgFunctionalCapacity = quarterData.reduce((sum, d) => sum + d.functionalCapacity, 0) / quarterData.length;
        const avgEngagementScore = quarterData.reduce((sum, d) => sum + d.engagementScore, 0) / quarterData.length;
        const avgSatisfactionScore = quarterData.reduce((sum, d) => sum + d.satisfactionScore, 0) / quarterData.length;

        stats.push({
          quarter,
          year,
          avgReadmissions: Math.round(avgReadmissions * 10) / 10,
          avgHospitalizations: Math.round(avgHospitalizations * 10) / 10,
          avgEdVisits: Math.round(avgEdVisits * 10) / 10,
          avgFunctionalCapacity: Math.round(avgFunctionalCapacity * 10) / 10,
          avgEngagementScore: Math.round(avgEngagementScore * 10) / 10,
          avgSatisfactionScore: Math.round(avgSatisfactionScore * 10) / 10,
          totalPatients: quarterData.length,
          benchmark: {
            readmissions: 1.8,
            hospitalizations: 1.2,
            edVisits: 2.5,
            functionalCapacity: 70,
            engagementScore: 25,
            satisfactionScore: 20,
          },
        });
      }
    });
  });

  return stats;
}

export const quarterlyOutcomeData = generateQuarterlyData();
export const cohortStatistics = generateCohortStatistics();

// Assessment completion dates for the 8 patients (matching the migration data)
const assessmentDates = [
  '2024-01-15', '2024-01-18', '2024-01-25', '2024-02-05', '2024-02-12', '2024-02-20',
  '2024-03-05', '2024-03-10', '2024-04-10', '2024-04-15', '2024-04-22', '2024-05-12',
  '2024-05-20', '2024-05-28', '2024-06-18', '2024-06-25', '2024-07-15', '2024-07-22',
  '2024-07-28', '2024-08-15', '2024-08-20', '2024-08-22', '2024-09-12', '2024-09-20',
  '2024-10-15', '2024-10-22', '2024-10-28', '2024-11-10', '2024-11-18', '2024-11-25',
  '2024-12-15', '2024-12-20', '2025-01-20', '2025-01-25', '2025-01-30', '2025-02-15',
  '2025-02-22', '2025-02-28', '2025-03-15', '2025-03-22', '2025-04-18', '2025-04-28',
  '2025-05-05', '2025-05-20', '2025-05-28', '2025-06-05', '2025-06-18', '2025-06-22',
  '2025-07-25', '2025-07-30', '2025-08-10', '2025-08-18', '2025-08-25', '2025-09-10',
  '2025-09-18', '2025-09-25', '2025-10-15', '2025-10-20', '2025-11-05', '2025-11-08',
  '2025-11-12', '2025-11-15'
];

export function getQuarterlyTrends(startYear: number, startQuarter: string, endYear: number, endQuarter: string): QuarterlyTrend[] {
  const stats = cohortStatistics.filter(stat => {
    const startQIndex = years.indexOf(startYear) * 4 + quarters.indexOf(startQuarter);
    const endQIndex = years.indexOf(endYear) * 4 + quarters.indexOf(endQuarter);
    const currentQIndex = years.indexOf(stat.year) * 4 + quarters.indexOf(stat.quarter);

    return currentQIndex >= startQIndex && currentQIndex <= endQIndex;
  });

  // Map each quarter to actual assessment dates
  return stats.map((stat, index) => {
    // Use actual assessment dates from our list, cycling through if needed
    const dateIndex = index % assessmentDates.length;
    const date = assessmentDates[dateIndex];

    return {
      quarter: `${stat.quarter} ${stat.year}`,
      year: stat.year,
      date: date,
      readmissions: stat.avgReadmissions,
      hospitalizations: stat.avgHospitalizations,
      edVisits: stat.avgEdVisits,
      functionalCapacity: stat.avgFunctionalCapacity,
      engagementScore: stat.avgEngagementScore,
      satisfactionScore: stat.avgSatisfactionScore,
    };
  });
}

export function getPatientOutcomes(patientId: string): QuarterlyOutcome[] {
  return quarterlyOutcomeData.filter(d => d.patientId === patientId);
}

export function getCurrentQuarterStats(): CohortStatistics | undefined {
  return cohortStatistics.find(stat => stat.year === currentYear && stat.quarter === 'Q3');
}

export function getPreviousQuarterStats(): CohortStatistics | undefined {
  return cohortStatistics.find(stat => stat.year === currentYear && stat.quarter === 'Q2');
}

export function getQuarterOverQuarterChange(current: number, previous: number): { value: number; percentage: number; direction: 'up' | 'down' | 'stable' } {
  const change = current - previous;
  const percentage = previous !== 0 ? (change / previous) * 100 : 0;

  return {
    value: Math.round(change * 10) / 10,
    percentage: Math.round(percentage * 10) / 10,
    direction: change > 0.1 ? 'up' : change < -0.1 ? 'down' : 'stable',
  };
}

export function filterOutcomesByDimension(dimension: string): QuarterlyOutcome[] {
  if (dimension === 'all') return quarterlyOutcomeData;
  return quarterlyOutcomeData.filter(d => d.primaryDimension === dimension);
}

export function filterOutcomesByRiskLevel(riskLevel: string): QuarterlyOutcome[] {
  if (riskLevel === 'all') return quarterlyOutcomeData;
  return quarterlyOutcomeData.filter(d => d.riskLevel === riskLevel);
}

export interface PatientOutcomeStats {
  latest: QuarterlyOutcome;
  previous?: QuarterlyOutcome;
  readmissionsChange?: { value: number; percentage: number; direction: 'up' | 'down' | 'stable' };
  hospitalizationsChange?: { value: number; percentage: number; direction: 'up' | 'down' | 'stable' };
  edVisitsChange?: { value: number; percentage: number; direction: 'up' | 'down' | 'stable' };
  functionalCapacityChange?: { value: number; percentage: number; direction: 'up' | 'down' | 'stable' };
  engagementScoreChange?: { value: number; percentage: number; direction: 'up' | 'down' | 'stable' };
  satisfactionScoreChange?: { value: number; percentage: number; direction: 'up' | 'down' | 'stable' };
}

export function getPatientOutcomeStats(patientId: string): PatientOutcomeStats | null {
  const outcomes = getPatientOutcomes(patientId);
  if (outcomes.length === 0) return null;

  outcomes.sort((a, b) => {
    const aIndex = years.indexOf(a.year) * 4 + quarters.indexOf(a.quarter);
    const bIndex = years.indexOf(b.year) * 4 + quarters.indexOf(b.quarter);
    return bIndex - aIndex;
  });

  const latest = outcomes[0];
  const previous = outcomes[1];

  const result: PatientOutcomeStats = { latest };

  if (previous) {
    result.previous = previous;
    result.readmissionsChange = getQuarterOverQuarterChange(latest.readmissions, previous.readmissions);
    result.hospitalizationsChange = getQuarterOverQuarterChange(latest.hospitalizations, previous.hospitalizations);
    result.edVisitsChange = getQuarterOverQuarterChange(latest.edVisits, previous.edVisits);
    result.functionalCapacityChange = getQuarterOverQuarterChange(latest.functionalCapacity, previous.functionalCapacity);
    result.engagementScoreChange = getQuarterOverQuarterChange(latest.engagementScore, previous.engagementScore);
    result.satisfactionScoreChange = getQuarterOverQuarterChange(latest.satisfactionScore, previous.satisfactionScore);
  }

  return result;
}

export function getPatientOutcomeTrends(patientId: string, startYear: number, startQuarter: string, endYear: number, endQuarter: string): QuarterlyTrend[] {
  const outcomes = getPatientOutcomes(patientId).filter(outcome => {
    const startQIndex = years.indexOf(startYear) * 4 + quarters.indexOf(startQuarter);
    const endQIndex = years.indexOf(endYear) * 4 + quarters.indexOf(endQuarter);
    const currentQIndex = years.indexOf(outcome.year) * 4 + quarters.indexOf(outcome.quarter);

    return currentQIndex >= startQIndex && currentQIndex <= endQIndex;
  });

  outcomes.sort((a, b) => {
    const aIndex = years.indexOf(a.year) * 4 + quarters.indexOf(a.quarter);
    const bIndex = years.indexOf(b.year) * 4 + quarters.indexOf(b.quarter);
    return aIndex - bIndex;
  });

  return outcomes.map((outcome, index) => {
    // Use actual assessment dates from our list, cycling through if needed
    const dateIndex = index % assessmentDates.length;
    const date = assessmentDates[dateIndex];

    return {
      quarter: `${outcome.quarter} ${outcome.year}`,
      year: outcome.year,
      date: date,
      readmissions: outcome.readmissions,
      hospitalizations: outcome.hospitalizations,
      edVisits: outcome.edVisits,
      functionalCapacity: outcome.functionalCapacity,
      engagementScore: outcome.engagementScore,
      satisfactionScore: outcome.satisfactionScore,
    };
  });
}

export function filterOutcomesBySmokingStatus(smokingStatus: string): QuarterlyOutcome[] {
  if (smokingStatus === 'all') return quarterlyOutcomeData;
  return quarterlyOutcomeData.filter(d => d.smokingStatus === smokingStatus);
}

export interface SmokingStatusDistribution {
  never: number;
  former: number;
  current: number;
  neverPercent: number;
  formerPercent: number;
  currentPercent: number;
}

export function getSmokingStatusDistribution(quarter: string, year: number): SmokingStatusDistribution {
  const quarterData = quarterlyOutcomeData.filter(d => d.quarter === quarter && d.year === year);
  const total = quarterData.length;

  if (total === 0) {
    return {
      never: 0,
      former: 0,
      current: 0,
      neverPercent: 0,
      formerPercent: 0,
      currentPercent: 0,
    };
  }

  const neverCount = quarterData.filter(d => d.smokingStatus === 'never').length;
  const formerCount = quarterData.filter(d => d.smokingStatus === 'former').length;
  const currentCount = quarterData.filter(d => d.smokingStatus === 'current').length;

  return {
    never: neverCount,
    former: formerCount,
    current: currentCount,
    neverPercent: Math.round((neverCount / total) * 100),
    formerPercent: Math.round((formerCount / total) * 100),
    currentPercent: Math.round((currentCount / total) * 100),
  };
}

export function getSmokingStatusLabel(status: 'never' | 'former' | 'current'): string {
  const labels = {
    never: 'Never Smoked',
    former: 'Former Smoker',
    current: 'Current Smoker',
  };
  return labels[status];
}
