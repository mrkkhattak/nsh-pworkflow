import { healthDimensionsConfig, getRiskLevel, type RiskLevel, type Patient } from "./nsh-assessment-mock"

export type PerformanceTier = "high" | "moderate" | "low"

export interface PatientDemographics {
  id: number
  name: string
  age: number
  gender: "Male" | "Female" | "Non-binary" | "Other"
  employmentStatus: "Employed Full-Time" | "Employed Part-Time" | "Unemployed" | "Retired" | "Disabled" | "Student"
  city: string
  state: string
}

export interface PatientDimensionScore {
  patientId: number
  dimensionId: string
  dimensionName: string
  currentScore: number
  riskLevel: RiskLevel
  trend: "improving" | "stable" | "declining"
  baselineScore: number
  changePercent: number
}

export interface CohortPatient extends PatientDemographics {
  dimensionScore: number
  riskLevel: RiskLevel
  trend: "improving" | "stable" | "declining"
  primaryCondition: string
  lastAssessmentDate: string
}

export interface CohortStatistics {
  totalPatients: number
  avgScore: number
  highPerformingCount: number
  moderatePerformingCount: number
  lowPerformingCount: number
}

const mockPatients: PatientDemographics[] = [
  { id: 1, name: "Sarah Johnson", age: 45, gender: "Female", employmentStatus: "Employed Full-Time", city: "Boston", state: "MA" },
  { id: 2, name: "Michael Chen", age: 52, gender: "Male", employmentStatus: "Employed Full-Time", city: "San Francisco", state: "CA" },
  { id: 3, name: "Emily Rodriguez", age: 38, gender: "Female", employmentStatus: "Employed Part-Time", city: "Austin", state: "TX" },
  { id: 4, name: "David Park", age: 67, gender: "Male", employmentStatus: "Retired", city: "Seattle", state: "WA" },
  { id: 5, name: "Lisa Thompson", age: 29, gender: "Female", employmentStatus: "Employed Full-Time", city: "Chicago", state: "IL" },
  { id: 6, name: "James Wilson", age: 44, gender: "Male", employmentStatus: "Unemployed", city: "Miami", state: "FL" },
  { id: 7, name: "Maria Garcia", age: 56, gender: "Female", employmentStatus: "Employed Part-Time", city: "Denver", state: "CO" },
  { id: 8, name: "Robert Lee", age: 41, gender: "Male", employmentStatus: "Employed Full-Time", city: "Portland", state: "OR" },
  { id: 9, name: "Jennifer Martinez", age: 33, gender: "Female", employmentStatus: "Employed Full-Time", city: "Atlanta", state: "GA" },
  { id: 10, name: "William Brown", age: 71, gender: "Male", employmentStatus: "Retired", city: "Phoenix", state: "AZ" },
  { id: 11, name: "Patricia Davis", age: 48, gender: "Female", employmentStatus: "Disabled", city: "Philadelphia", state: "PA" },
  { id: 12, name: "Christopher Taylor", age: 35, gender: "Male", employmentStatus: "Employed Full-Time", city: "San Diego", state: "CA" },
  { id: 13, name: "Linda Anderson", age: 62, gender: "Female", employmentStatus: "Retired", city: "Dallas", state: "TX" },
  { id: 14, name: "Daniel Thomas", age: 27, gender: "Male", employmentStatus: "Student", city: "New York", state: "NY" },
  { id: 15, name: "Barbara Jackson", age: 54, gender: "Female", employmentStatus: "Employed Full-Time", city: "Houston", state: "TX" },
  { id: 16, name: "Joseph White", age: 39, gender: "Male", employmentStatus: "Employed Part-Time", city: "Minneapolis", state: "MN" },
  { id: 17, name: "Susan Harris", age: 46, gender: "Female", employmentStatus: "Employed Full-Time", city: "Boston", state: "MA" },
  { id: 18, name: "Thomas Martin", age: 58, gender: "Male", employmentStatus: "Employed Full-Time", city: "Detroit", state: "MI" },
  { id: 19, name: "Karen Thompson", age: 42, gender: "Female", employmentStatus: "Unemployed", city: "Nashville", state: "TN" },
  { id: 20, name: "Charles Garcia", age: 65, gender: "Male", employmentStatus: "Retired", city: "Las Vegas", state: "NV" },
  { id: 21, name: "Nancy Martinez", age: 36, gender: "Female", employmentStatus: "Employed Full-Time", city: "Charlotte", state: "NC" },
  { id: 22, name: "Steven Robinson", age: 49, gender: "Male", employmentStatus: "Employed Full-Time", city: "Indianapolis", state: "IN" },
  { id: 23, name: "Betty Clark", age: 68, gender: "Female", employmentStatus: "Retired", city: "Columbus", state: "OH" },
  { id: 24, name: "Paul Rodriguez", age: 31, gender: "Male", employmentStatus: "Employed Full-Time", city: "San Antonio", state: "TX" },
  { id: 25, name: "Sandra Lewis", age: 53, gender: "Female", employmentStatus: "Employed Part-Time", city: "Fort Worth", state: "TX" },
  { id: 26, name: "Mark Lee", age: 44, gender: "Male", employmentStatus: "Employed Full-Time", city: "San Jose", state: "CA" },
  { id: 27, name: "Donna Walker", age: 57, gender: "Female", employmentStatus: "Disabled", city: "Jacksonville", state: "FL" },
  { id: 28, name: "Kenneth Hall", age: 40, gender: "Male", employmentStatus: "Employed Full-Time", city: "Austin", state: "TX" },
  { id: 29, name: "Carol Allen", age: 47, gender: "Female", employmentStatus: "Employed Full-Time", city: "Memphis", state: "TN" },
  { id: 30, name: "Edward Young", age: 61, gender: "Male", employmentStatus: "Retired", city: "Baltimore", state: "MD" },
]

const conditions = [
  "Major Depressive Disorder",
  "Generalized Anxiety Disorder",
  "Type 2 Diabetes",
  "Hypertension",
  "Chronic Pain Syndrome",
  "PTSD",
  "Bipolar Disorder",
  "Heart Disease",
  "Asthma",
  "Arthritis",
]

function generatePatientDimensionScore(
  patientId: number,
  dimensionId: string,
  seed: number
): PatientDimensionScore {
  const dimension = healthDimensionsConfig.find((d) => d.id === dimensionId)
  if (!dimension) {
    throw new Error(`Dimension ${dimensionId} not found`)
  }

  const randomSeed = (patientId * 7 + seed) % 100
  const baseScore = 20 + randomSeed * 0.6
  const currentScore = Math.round(baseScore + (Math.random() - 0.5) * 15)
  const riskLevel = getRiskLevel(currentScore)

  const baselineScore = currentScore + Math.floor(Math.random() * 20) - 10
  const changePercent = baselineScore !== 0 ? ((currentScore - baselineScore) / baselineScore) * 100 : 0

  let trend: "improving" | "stable" | "declining"
  if (changePercent < -10) trend = "improving"
  else if (changePercent > 10) trend = "declining"
  else trend = "stable"

  return {
    patientId,
    dimensionId,
    dimensionName: dimension.name,
    currentScore: Math.max(0, Math.min(100, currentScore)),
    riskLevel,
    trend,
    baselineScore: Math.max(0, Math.min(100, baselineScore)),
    changePercent: Math.round(changePercent * 10) / 10,
  }
}

function classifyPerformanceTier(score: number): PerformanceTier {
  if (score <= 30) return "high"
  if (score <= 60) return "moderate"
  return "low"
}

export function getPatientsByDimensionTier(
  dimensionId: string,
  performanceTier: PerformanceTier
): CohortPatient[] {
  const patients: CohortPatient[] = mockPatients.map((patient, index) => {
    const dimensionScore = generatePatientDimensionScore(patient.id, dimensionId, index)
    const conditionIndex = patient.id % conditions.length

    return {
      ...patient,
      dimensionScore: dimensionScore.currentScore,
      riskLevel: dimensionScore.riskLevel,
      trend: dimensionScore.trend,
      primaryCondition: conditions[conditionIndex],
      lastAssessmentDate: "2025-01-15",
    }
  })

  return patients.filter((patient) => classifyPerformanceTier(patient.dimensionScore) === performanceTier)
}

export function getAllPatientsForDimension(dimensionId: string): CohortPatient[] {
  return mockPatients.map((patient, index) => {
    const dimensionScore = generatePatientDimensionScore(patient.id, dimensionId, index)
    const conditionIndex = patient.id % conditions.length

    return {
      ...patient,
      dimensionScore: dimensionScore.currentScore,
      riskLevel: dimensionScore.riskLevel,
      trend: dimensionScore.trend,
      primaryCondition: conditions[conditionIndex],
      lastAssessmentDate: "2025-01-15",
    }
  })
}

export function getCohortStatistics(dimensionId: string): CohortStatistics {
  const allPatients = getAllPatientsForDimension(dimensionId)

  const totalPatients = allPatients.length
  const avgScore = allPatients.reduce((sum, p) => sum + p.dimensionScore, 0) / totalPatients

  const highPerformingCount = allPatients.filter((p) => classifyPerformanceTier(p.dimensionScore) === "high").length
  const moderatePerformingCount = allPatients.filter(
    (p) => classifyPerformanceTier(p.dimensionScore) === "moderate"
  ).length
  const lowPerformingCount = allPatients.filter((p) => classifyPerformanceTier(p.dimensionScore) === "low").length

  return {
    totalPatients,
    avgScore: Math.round(avgScore * 10) / 10,
    highPerformingCount,
    moderatePerformingCount,
    lowPerformingCount,
  }
}

export function getPatientDimensionScores(patientId: number): PatientDimensionScore[] {
  return healthDimensionsConfig.map((dimension, index) => {
    return generatePatientDimensionScore(patientId, dimension.id, index)
  })
}

export function getPatientById(patientId: number): PatientDemographics | undefined {
  return mockPatients.find((p) => p.id === patientId)
}
