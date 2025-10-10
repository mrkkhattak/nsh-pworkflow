export const mockPromDataByPatient = {
  1: {
    patient: {
      id: 1,
      name: "Sarah Johnson",
      age: 45,
      condition: "Major Depression",
      enrollmentDate: "2024-10-01",
      riskLevel: "moderate",
      lastAssessment: "2025-01-01",
    },
    assessments: [
      {
        date: "2024-10-01",
        burden: 75,
        medical: 85,
        utilization: 60,
        sdoh: 50,
        diet: 90,
        physical: 70,
        sleep: 80,
        pain: 30,
        satisfaction: 95,
        mental: 80,
        cost: 40,
        engagement: 85,
        interventions: ["Started Sertraline 50mg"],
      },
      {
        date: "2024-11-01",
        burden: 70,
        medical: 90,
        utilization: 65,
        sdoh: 45,
        diet: 85,
        physical: 75,
        sleep: 75,
        pain: 25,
        satisfaction: 90,
        mental: 75,
        cost: 45,
        engagement: 90,
        interventions: ["Increased Sertraline to 75mg", "Added CBT sessions"],
      },
      {
        date: "2024-12-01",
        burden: 65,
        medical: 95,
        utilization: 70,
        sdoh: 40,
        diet: 80,
        physical: 80,
        sleep: 70,
        pain: 20,
        satisfaction: 85,
        mental: 85,
        cost: 50,
        engagement: 95,
        interventions: ["Continued current regimen"],
      },
      {
        date: "2025-01-01",
        burden: 60,
        medical: 100,
        utilization: 75,
        sdoh: 35,
        diet: 75,
        physical: 85,
        sleep: 65,
        pain: 15,
        satisfaction: 80,
        mental: 95,
        cost: 55,
        engagement: 100,
        interventions: ["Added exercise program"],
      },
    ],
    goals: {
      burden: { baseline: 75, target: 25, current: 60, horizon: "6 months" },
      medical: { baseline: 85, target: 95, current: 95, horizon: "6 months" },
      utilization: { baseline: 60, target: 85, current: 75, horizon: "6 months" },
      sdoh: { baseline: 50, target: 25, current: 35, horizon: "6 months" },
      diet: { baseline: 90, target: 85, current: 80, horizon: "6 months" },
      physical: { baseline: 70, target: 85, current: 85, horizon: "6 months" },
      sleep: { baseline: 80, target: 85, current: 65, horizon: "6 months" },
      pain: { baseline: 30, target: 15, current: 15, horizon: "3 months" },
      satisfaction: { baseline: 95, target: 80, current: 80, horizon: "6 months" },
      mental: { baseline: 80, target: 95, current: 95, horizon: "6 months" },
      cost: { baseline: 40, target: 25, current: 55, horizon: "4 months" },
      engagement: { baseline: 85, target: 95, current: 100, horizon: "4 months" },
    },
  },
  2: {
    patient: {
      id: 2,
      name: "Michael Chen",
      age: 38,
      condition: "Generalized Anxiety Disorder",
      enrollmentDate: "2024-09-15",
      riskLevel: "high",
      lastAssessment: "2024-12-28",
    },
    assessments: [
      {
        date: "2024-09-15",
        burden: 80,
        medical: 80,
        utilization: 55,
        sdoh: 60,
        diet: 70,
        physical: 50,
        sleep: 60,
        pain: 20,
        satisfaction: 75,
        mental: 60,
        cost: 50,
        engagement: 70,
        interventions: ["Started Escitalopram 10mg"],
      },
      {
        date: "2024-10-15",
        burden: 75,
        medical: 85,
        utilization: 60,
        sdoh: 55,
        diet: 65,
        physical: 55,
        sleep: 55,
        pain: 15,
        satisfaction: 70,
        mental: 55,
        cost: 55,
        engagement: 75,
        interventions: ["Added mindfulness therapy"],
      },
      {
        date: "2024-11-15",
        burden: 70,
        medical: 90,
        utilization: 65,
        sdoh: 50,
        diet: 60,
        physical: 60,
        sleep: 50,
        pain: 10,
        satisfaction: 65,
        mental: 50,
        cost: 60,
        engagement: 80,
        interventions: ["Increased therapy frequency"],
      },
      {
        date: "2024-12-28",
        burden: 65,
        medical: 95,
        utilization: 70,
        sdoh: 45,
        diet: 55,
        physical: 65,
        sleep: 45,
        pain: 5,
        satisfaction: 60,
        mental: 45,
        cost: 65,
        engagement: 85,
        interventions: ["Maintained current plan"],
      },
    ],
    goals: {
      burden: { baseline: 80, target: 25, current: 65, horizon: "4 months" },
      medical: { baseline: 80, target: 95, current: 95, horizon: "6 months" },
      utilization: { baseline: 55, target: 85, current: 70, horizon: "4 months" },
      sdoh: { baseline: 60, target: 25, current: 45, horizon: "4 months" },
      diet: { baseline: 70, target: 85, current: 55, horizon: "6 months" },
      physical: { baseline: 50, target: 85, current: 65, horizon: "4 months" },
      sleep: { baseline: 60, target: 85, current: 45, horizon: "6 months" },
      pain: { baseline: 20, target: 15, current: 5, horizon: "2 months" },
      satisfaction: { baseline: 75, target: 80, current: 60, horizon: "6 months" },
      mental: { baseline: 60, target: 95, current: 45, horizon: "6 months" },
      cost: { baseline: 50, target: 25, current: 65, horizon: "4 months" },
      engagement: { baseline: 70, target: 95, current: 85, horizon: "4 months" },
    },
  },
} as const

export const promDomains = [
  { id: "burden", name: "Burden of Illness", direction: "lower-better", color: "#3b82f6" },
  { id: "medical", name: "Medical Management & Adherence", direction: "higher-better", color: "#10b981" },
  { id: "utilization", name: "Health Care Utilization", direction: "lower-better", color: "#f59e0b" },
  { id: "sdoh", name: "SDOH", direction: "lower-better", color: "#ef4444" },
  { id: "diet", name: "Diet & Nutrition", direction: "higher-better", color: "#8b5cf6" },
  { id: "physical", name: "Physical Activity Score", direction: "higher-better", color: "#06b6d4" },
  { id: "sleep", name: "Sleep Health", direction: "higher-better", color: "#ec4899" },
  { id: "pain", name: "Pain & Functional Impact", direction: "lower-better", color: "#f97316" },
  { id: "satisfaction", name: "Patient Satisfaction & Trust", direction: "higher-better", color: "#14b8a6" },
  { id: "mental", name: "Mental Health & Emotional Wellbeing", direction: "higher-better", color: "#6366f1" },
  { id: "cost", name: "Healthcare Cost & Affordability", direction: "lower-better", color: "#84cc16" },
  { id: "engagement", name: "Patient Engagement & Self Care Ability", direction: "higher-better", color: "#f43f5e" },
] as const

export type Assessment = (typeof mockPromDataByPatient)[1]["assessments"][number]

export function getPatientAssessment(patientId: number, date: string) {
  const data = mockPromDataByPatient[patientId as keyof typeof mockPromDataByPatient]
  if (!data) return null
  const found = data.assessments.find((a) => a.date === date) || data.assessments[data.assessments.length - 1]
  return { patient: data.patient, assessment: found, history: data.assessments }
}

export function computeGlobalHealthIndex(a: Assessment) {
  // Normalize so higher is better
  let total = 0
  let count = 0
  for (const d of promDomains) {
    const val = (a as any)[d.id]
    if (typeof val !== "number") continue
    const normalized = d.direction === "lower-better" ? 100 - val : val
    total += normalized
    count++
  }
  return Math.round(total / Math.max(1, count))
}

export function getRiskLabel(score: number) {
  if (score >= 81) return { label: "Excellent Health & Wellbeing", color: "text-emerald-600" }
  if (score >= 61) return { label: "Good Health & Wellbeing", color: "text-emerald-600" }
  if (score >= 41) return { label: "Moderate Health & Wellbeing", color: "text-amber-600" }
  return { label: "At Risk Health & Wellbeing", color: "text-red-600" }
}
