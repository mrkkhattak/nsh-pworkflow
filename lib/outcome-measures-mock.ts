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
  totalPatients: number;
  benchmark: {
    readmissions: number;
    hospitalizations: number;
    edVisits: number;
    functionalCapacity: number;
  };
}

export interface QuarterlyTrend {
  quarter: string;
  year: number;
  readmissions: number;
  hospitalizations: number;
  edVisits: number;
  functionalCapacity: number;
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

    if (patient.riskLevel === 'high') {
      readmissionsTrend = Math.random() > 0.3 ? 'improving' : 'stable';
      hospitalizationsTrend = Math.random() > 0.3 ? 'improving' : 'stable';
      edVisitsTrend = Math.random() > 0.4 ? 'improving' : 'declining';
      functionalCapacityTrend = Math.random() > 0.3 ? 'improving' : 'stable';
    } else if (patient.riskLevel === 'medium') {
      readmissionsTrend = Math.random() > 0.5 ? 'improving' : 'stable';
      hospitalizationsTrend = Math.random() > 0.5 ? 'improving' : 'stable';
      edVisitsTrend = Math.random() > 0.5 ? 'improving' : 'stable';
      functionalCapacityTrend = Math.random() > 0.4 ? 'improving' : 'stable';
    } else {
      readmissionsTrend = 'stable';
      hospitalizationsTrend = 'stable';
      edVisitsTrend = 'stable';
      functionalCapacityTrend = Math.random() > 0.6 ? 'improving' : 'stable';
    }

    const baseReadmissions = patient.riskLevel === 'high' ? 2.5 : patient.riskLevel === 'medium' ? 1.2 : 0.3;
    const baseHospitalizations = patient.riskLevel === 'high' ? 1.8 : patient.riskLevel === 'medium' ? 0.8 : 0.2;
    const baseEdVisits = patient.riskLevel === 'high' ? 3.5 : patient.riskLevel === 'medium' ? 1.5 : 0.5;
    const baseFunctionalCapacity = patient.riskLevel === 'high' ? 55 : patient.riskLevel === 'medium' ? 68 : 82;

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

        stats.push({
          quarter,
          year,
          avgReadmissions: Math.round(avgReadmissions * 10) / 10,
          avgHospitalizations: Math.round(avgHospitalizations * 10) / 10,
          avgEdVisits: Math.round(avgEdVisits * 10) / 10,
          avgFunctionalCapacity: Math.round(avgFunctionalCapacity * 10) / 10,
          totalPatients: quarterData.length,
          benchmark: {
            readmissions: 1.8,
            hospitalizations: 1.2,
            edVisits: 2.5,
            functionalCapacity: 70,
          },
        });
      }
    });
  });

  return stats;
}

export const quarterlyOutcomeData = generateQuarterlyData();
export const cohortStatistics = generateCohortStatistics();

export function getQuarterlyTrends(startYear: number, startQuarter: string, endYear: number, endQuarter: string): QuarterlyTrend[] {
  const stats = cohortStatistics.filter(stat => {
    const startQIndex = years.indexOf(startYear) * 4 + quarters.indexOf(startQuarter);
    const endQIndex = years.indexOf(endYear) * 4 + quarters.indexOf(endQuarter);
    const currentQIndex = years.indexOf(stat.year) * 4 + quarters.indexOf(stat.quarter);

    return currentQIndex >= startQIndex && currentQIndex <= endQIndex;
  });

  return stats.map(stat => ({
    quarter: `${stat.quarter} ${stat.year}`,
    year: stat.year,
    readmissions: stat.avgReadmissions,
    hospitalizations: stat.avgHospitalizations,
    edVisits: stat.avgEdVisits,
    functionalCapacity: stat.avgFunctionalCapacity,
  }));
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
