export type RiskLevel = "green" | "yellow" | "orange" | "red"

export type ActionItemStatus = "pending" | "in_progress" | "completed"

export interface Subcategory {
  id: string
  name: string
  score: number
  riskLevel: RiskLevel
  interpretation: string
}

export interface HealthDimension {
  id: string
  name: string
  score: number
  riskLevel: RiskLevel
  interpretation: string
  color: string
  subcategories: Subcategory[]
}

export interface PhysicianActionItem {
  id: string
  type: "physician"
  providerName: string
  designation: string
  action: string
  dimensionId: string
  status: ActionItemStatus
  dueDate?: string
}

export interface PatientActionItem {
  id: string
  type: "patient"
  actionName: string
  dimensionName: string
  dimensionId: string
  description: string
  status: ActionItemStatus
  dueDate?: string
}

export interface CommunityActionItem {
  id: string
  type: "community"
  name: string
  category: string
  dimensionId: string
  eligibility: string
  hoursOfOperation: string
  contactInfo: string
  status: ActionItemStatus
}

export interface SystemActionItem {
  id: string
  type: "system"
  name: string
  category: string
  dimensionIds: string[]
  description: string
  status: ActionItemStatus
  expectedImpact: string
}

export type ActionItem = PhysicianActionItem | PatientActionItem | CommunityActionItem | SystemActionItem

export interface OpportunityArea {
  dimensionId: string
  dimensionName: string
  subcategoryId?: string
  subcategoryName?: string
  score: number
  riskLevel: RiskLevel
  recommendation: string
}

export interface QuestionResponse {
  questionId: string
  question: string
  dimensionId: string
  responseValue: number
  responseText: string
  timestamp: string
}

export interface Assessment {
  id: string
  date: string
  patientId: number
  globalHealthIndex: number
  dimensions: HealthDimension[]
  actionItems: ActionItem[]
  opportunities: {
    strengths: OpportunityArea[]
    moderate: OpportunityArea[]
    critical: OpportunityArea[]
  }
  questionnaireResponses: QuestionResponse[]
  interventions: string[]
}

export interface Patient {
  id: number
  name: string
  age: number
  condition: string
  enrollmentDate: string
  riskLevel: string
  lastAssessment: string
}

export const healthDimensionsConfig = [
  { id: "physical", name: "Physical Health", color: "#10b981" },
  { id: "mental", name: "Mental Health", color: "#6366f1" },
  { id: "sdoh", name: "Social Determinants of Health", color: "#ef4444" },
  { id: "engagement", name: "Patient Engagement", color: "#f43f5e" },
  { id: "burden", name: "Burden of Illness", color: "#3b82f6" },
  { id: "medical", name: "Medical Management & Adherence", color: "#8b5cf6" },
  { id: "utilization", name: "Healthcare Utilization", color: "#f59e0b" },
  { id: "diet", name: "Diet & Nutrition", color: "#84cc16" },
  { id: "sleep", name: "Sleep Health", color: "#ec4899" },
  { id: "pain", name: "Pain & Functional Impact", color: "#f97316" },
  { id: "satisfaction", name: "Patient Satisfaction & Trust", color: "#14b8a6" },
  { id: "cost", name: "Healthcare Cost & Affordability", color: "#06b6d4" },
] as const

export function getRiskLevel(score: number): RiskLevel {
  if (score <= 25) return "green"
  if (score <= 50) return "yellow"
  if (score <= 75) return "orange"
  return "red"
}

export function getRiskColor(riskLevel: RiskLevel): string {
  const colors = {
    green: "text-emerald-600",
    yellow: "text-yellow-600",
    orange: "text-orange-600",
    red: "text-red-600",
  }
  return colors[riskLevel]
}

export function getRiskBgColor(riskLevel: RiskLevel): string {
  const colors = {
    green: "bg-emerald-50",
    yellow: "bg-yellow-50",
    orange: "bg-orange-50",
    red: "bg-red-50",
  }
  return colors[riskLevel]
}

export function getRiskBorderColor(riskLevel: RiskLevel): string {
  const colors = {
    green: "border-emerald-200",
    yellow: "border-yellow-200",
    orange: "border-orange-200",
    red: "border-red-200",
  }
  return colors[riskLevel]
}

export function getRiskLabel(riskLevel: RiskLevel): string {
  const labels = {
    green: "Low Risk - Excellent",
    yellow: "Moderate Risk",
    orange: "Elevated Risk",
    red: "High Risk - Critical",
  }
  return labels[riskLevel]
}

export function computeGlobalHealthIndex(dimensions: HealthDimension[]): number {
  const total = dimensions.reduce((sum, dim) => sum + dim.score, 0)
  return Math.round(total / dimensions.length)
}

const physicalSubcategories: Subcategory[] = [
  {
    id: "physical-cardio",
    name: "Cardiovascular Risk",
    score: 15,
    riskLevel: "green",
    interpretation: "Excellent cardiovascular health indicators. Blood pressure and heart rate within optimal ranges.",
  },
  {
    id: "physical-mobility",
    name: "Mobility Limitations",
    score: 22,
    riskLevel: "green",
    interpretation: "Good mobility with minimal limitations. Able to perform daily activities independently.",
  },
  {
    id: "physical-strength",
    name: "Strength Deficits",
    score: 28,
    riskLevel: "yellow",
    interpretation: "Mild strength deficits noted. Consider resistance training to improve functional capacity.",
  },
  {
    id: "physical-endurance",
    name: "Endurance Issues",
    score: 18,
    riskLevel: "green",
    interpretation: "Good endurance levels. Patient able to sustain moderate physical activity.",
  },
]

const mentalSubcategories: Subcategory[] = [
  {
    id: "mental-depression",
    name: "Depression Severity",
    score: 35,
    riskLevel: "yellow",
    interpretation: "Moderate depressive symptoms present. Continue current treatment and monitor closely.",
  },
  {
    id: "mental-anxiety",
    name: "Anxiety Levels",
    score: 42,
    riskLevel: "yellow",
    interpretation: "Moderate anxiety levels affecting daily functioning. Therapeutic interventions showing progress.",
  },
  {
    id: "mental-cognitive",
    name: "Cognitive Function",
    score: 12,
    riskLevel: "green",
    interpretation: "Excellent cognitive function. No impairments in memory, attention, or executive function.",
  },
  {
    id: "mental-emotional",
    name: "Emotional Regulation",
    score: 38,
    riskLevel: "yellow",
    interpretation: "Some difficulty with emotional regulation. Coping strategies being developed in therapy.",
  },
]

const sdohSubcategories: Subcategory[] = [
  {
    id: "sdoh-housing",
    name: "Housing Instability",
    score: 8,
    riskLevel: "green",
    interpretation: "Stable housing situation with no immediate concerns.",
  },
  {
    id: "sdoh-food",
    name: "Food Insecurity",
    score: 45,
    riskLevel: "yellow",
    interpretation: "Moderate food insecurity. Patient occasionally struggles to afford nutritious meals. Community resources recommended.",
  },
  {
    id: "sdoh-transport",
    name: "Transportation Barriers",
    score: 32,
    riskLevel: "yellow",
    interpretation: "Some transportation challenges affecting healthcare access. Exploring ride-sharing services.",
  },
  {
    id: "sdoh-financial",
    name: "Financial Stress",
    score: 58,
    riskLevel: "orange",
    interpretation: "Significant financial stress impacting health decisions. Financial counseling referral recommended.",
  },
]

const engagementSubcategories: Subcategory[] = [
  {
    id: "engagement-monitoring",
    name: "Self-Monitoring Gaps",
    score: 15,
    riskLevel: "green",
    interpretation: "Excellent self-monitoring practices. Patient consistently tracks symptoms and vitals.",
  },
  {
    id: "engagement-medication",
    name: "Medication Non-Adherence",
    score: 20,
    riskLevel: "green",
    interpretation: "Good medication adherence. Occasional missed doses but overall compliance is strong.",
  },
  {
    id: "engagement-appointments",
    name: "Missed Appointments",
    score: 10,
    riskLevel: "green",
    interpretation: "Excellent appointment attendance. Patient rarely misses scheduled visits.",
  },
  {
    id: "engagement-literacy",
    name: "Health Literacy Barriers",
    score: 25,
    riskLevel: "yellow",
    interpretation: "Adequate health literacy. Some concepts require additional explanation.",
  },
]

const burdenSubcategories: Subcategory[] = [
  {
    id: "burden-symptom",
    name: "Symptom Severity",
    score: 40,
    riskLevel: "yellow",
    interpretation: "Moderate symptom burden affecting quality of life. Treatment adjustments showing improvement.",
  },
  {
    id: "burden-functional",
    name: "Functional Limitations",
    score: 35,
    riskLevel: "yellow",
    interpretation: "Some functional limitations in daily activities. Rehabilitation services may be beneficial.",
  },
  {
    id: "burden-comorbid",
    name: "Comorbidity Impact",
    score: 28,
    riskLevel: "yellow",
    interpretation: "Multiple conditions managed with coordinated care approach.",
  },
]

const medicalSubcategories: Subcategory[] = [
  {
    id: "medical-adherence",
    name: "Treatment Adherence",
    score: 18,
    riskLevel: "green",
    interpretation: "Excellent adherence to treatment plan. Patient demonstrates strong commitment.",
  },
  {
    id: "medical-knowledge",
    name: "Condition Knowledge",
    score: 22,
    riskLevel: "green",
    interpretation: "Good understanding of medical conditions and treatment rationale.",
  },
  {
    id: "medical-coordination",
    name: "Care Coordination Gaps",
    score: 30,
    riskLevel: "yellow",
    interpretation: "Some coordination challenges between multiple providers. Improving with care management.",
  },
]

const utilizationSubcategories: Subcategory[] = [
  {
    id: "utilization-er",
    name: "Emergency Room Visits",
    score: 15,
    riskLevel: "green",
    interpretation: "Minimal ER utilization. Appropriate use of urgent care and primary care.",
  },
  {
    id: "utilization-hospital",
    name: "Hospitalizations",
    score: 12,
    riskLevel: "green",
    interpretation: "Low hospitalization rate. Effective outpatient management preventing admissions.",
  },
  {
    id: "utilization-specialist",
    name: "Specialist Overutilization",
    score: 25,
    riskLevel: "yellow",
    interpretation: "Moderate specialist visits. Ensuring appropriate referrals and follow-up.",
  },
]

const dietSubcategories: Subcategory[] = [
  {
    id: "diet-quality",
    name: "Diet Quality Issues",
    score: 38,
    riskLevel: "yellow",
    interpretation: "Diet quality could be improved. High processed food intake. Nutrition counseling recommended.",
  },
  {
    id: "diet-hydration",
    name: "Hydration Deficits",
    score: 20,
    riskLevel: "green",
    interpretation: "Adequate hydration maintained throughout the day.",
  },
  {
    id: "diet-habits",
    name: "Eating Pattern Irregularity",
    score: 42,
    riskLevel: "yellow",
    interpretation: "Irregular eating patterns affecting energy and metabolism. Working on structured meal times.",
  },
]

const sleepSubcategories: Subcategory[] = [
  {
    id: "sleep-quality",
    name: "Sleep Quality Issues",
    score: 45,
    riskLevel: "yellow",
    interpretation: "Moderate sleep quality issues. Frequent nighttime awakenings. Sleep hygiene education provided.",
  },
  {
    id: "sleep-duration",
    name: "Insufficient Sleep Duration",
    score: 52,
    riskLevel: "orange",
    interpretation: "Consistently getting less than 6 hours per night. Addressing sleep barriers.",
  },
  {
    id: "sleep-disorders",
    name: "Sleep Disorder Symptoms",
    score: 35,
    riskLevel: "yellow",
    interpretation: "Some symptoms suggestive of sleep disorder. Sleep study may be warranted.",
  },
]

const painSubcategories: Subcategory[] = [
  {
    id: "pain-severity",
    name: "Pain Severity",
    score: 30,
    riskLevel: "yellow",
    interpretation: "Moderate pain levels. Pain management plan showing some effectiveness.",
  },
  {
    id: "pain-functional",
    name: "Pain Functional Impact",
    score: 25,
    riskLevel: "yellow",
    interpretation: "Pain causing some functional limitations. Physical therapy helping with mobility.",
  },
  {
    id: "pain-chronic",
    name: "Chronic Pain Indicators",
    score: 28,
    riskLevel: "yellow",
    interpretation: "Chronic pain patterns present. Multidisciplinary pain management approach recommended.",
  },
]

const satisfactionSubcategories: Subcategory[] = [
  {
    id: "satisfaction-provider",
    name: "Provider Relationship Issues",
    score: 12,
    riskLevel: "green",
    interpretation: "Strong therapeutic relationship with care team. High level of trust.",
  },
  {
    id: "satisfaction-communication",
    name: "Communication Barriers",
    score: 15,
    riskLevel: "green",
    interpretation: "Effective communication between patient and providers.",
  },
  {
    id: "satisfaction-access",
    name: "Access Dissatisfaction",
    score: 22,
    riskLevel: "green",
    interpretation: "Generally satisfied with access to care. Some wait time concerns.",
  },
]

const costSubcategories: Subcategory[] = [
  {
    id: "cost-burden",
    name: "Out-of-Pocket Cost Burden",
    score: 55,
    riskLevel: "orange",
    interpretation: "Significant out-of-pocket costs affecting treatment decisions. Financial assistance programs explored.",
  },
  {
    id: "cost-medication",
    name: "Medication Affordability",
    score: 48,
    riskLevel: "yellow",
    interpretation: "Medication costs creating some financial strain. Generic alternatives being considered.",
  },
  {
    id: "cost-insurance",
    name: "Insurance Coverage Gaps",
    score: 35,
    riskLevel: "yellow",
    interpretation: "Some insurance coverage limitations. Working with patient advocate.",
  },
]

const physicianActionItems: PhysicianActionItem[] = [
  {
    id: "phy-001",
    type: "physician",
    providerName: "Dr. Sarah Martinez",
    designation: "Primary Care Physician",
    action: "Review and adjust antidepressant medication dosage based on recent symptom assessment",
    dimensionId: "mental",
    status: "in_progress",
    dueDate: "2025-01-20",
  },
  {
    id: "phy-002",
    type: "physician",
    providerName: "Dr. James Wilson",
    designation: "Psychiatrist",
    action: "Conduct comprehensive psychiatric evaluation for anxiety management optimization",
    dimensionId: "mental",
    status: "pending",
    dueDate: "2025-01-25",
  },
  {
    id: "phy-003",
    type: "physician",
    providerName: "Dr. Emily Chen",
    designation: "Cardiologist",
    action: "Order cardiac stress test to establish baseline cardiovascular fitness",
    dimensionId: "physical",
    status: "completed",
  },
  {
    id: "phy-004",
    type: "physician",
    providerName: "Dr. Sarah Martinez",
    designation: "Primary Care Physician",
    action: "Refer to sleep medicine specialist for evaluation of sleep disorders",
    dimensionId: "sleep",
    status: "pending",
    dueDate: "2025-01-18",
  },
  {
    id: "phy-005",
    type: "physician",
    providerName: "Dr. Michael Rodriguez",
    designation: "Pain Management Specialist",
    action: "Develop multimodal pain management strategy to reduce opioid reliance",
    dimensionId: "pain",
    status: "in_progress",
    dueDate: "2025-01-22",
  },
]

const patientActionItems: PatientActionItem[] = [
  {
    id: "pat-001",
    type: "patient",
    actionName: "Daily Mood Journaling",
    dimensionName: "Mental Health",
    dimensionId: "mental",
    description: "Track mood, anxiety levels, and triggering events in a daily journal. Note any patterns or improvements.",
    status: "in_progress",
    dueDate: "2025-01-31",
  },
  {
    id: "pat-002",
    type: "patient",
    actionName: "30-Minute Daily Walks",
    dimensionName: "Physical Health",
    dimensionId: "physical",
    description: "Engage in moderate-intensity walking for at least 30 minutes per day, 5 days per week.",
    status: "in_progress",
  },
  {
    id: "pat-003",
    type: "patient",
    actionName: "Medication Adherence Tracking",
    dimensionName: "Patient Engagement",
    dimensionId: "engagement",
    description: "Use medication tracking app to log all medication doses and set daily reminders.",
    status: "completed",
  },
  {
    id: "pat-004",
    type: "patient",
    actionName: "Sleep Hygiene Practice",
    dimensionName: "Sleep Health",
    dimensionId: "sleep",
    description: "Establish consistent bedtime routine: lights off by 10pm, no screens 1 hour before bed, cool room temperature.",
    status: "pending",
  },
  {
    id: "pat-005",
    type: "patient",
    actionName: "Meal Planning and Prep",
    dimensionName: "Diet & Nutrition",
    dimensionId: "diet",
    description: "Plan and prepare healthy meals for the week each Sunday. Focus on whole foods and reduce processed items.",
    status: "in_progress",
  },
  {
    id: "pat-006",
    type: "patient",
    actionName: "Mindfulness Meditation",
    dimensionName: "Mental Health",
    dimensionId: "mental",
    description: "Practice 10-minute guided mindfulness meditation daily using app or online resources.",
    status: "in_progress",
  },
  {
    id: "pat-007",
    type: "patient",
    actionName: "Pain Tracking Log",
    dimensionName: "Pain & Functional Impact",
    dimensionId: "pain",
    description: "Document pain levels (1-10 scale), location, duration, and activities that worsen or improve pain.",
    status: "pending",
  },
]

const communityActionItems: CommunityActionItem[] = [
  {
    id: "com-001",
    type: "community",
    name: "Community Food Bank Access",
    category: "Food Security",
    dimensionId: "sdoh",
    eligibility: "Household income below 185% of federal poverty level",
    hoursOfOperation: "Monday-Friday 9am-5pm, Saturday 10am-2pm",
    contactInfo: "555-FOOD-HELP | foodbank@community.org",
    status: "in_progress",
  },
  {
    id: "com-002",
    type: "community",
    name: "Medical Transportation Services",
    category: "Transportation Access",
    dimensionId: "sdoh",
    eligibility: "Medicare/Medicaid recipients, 24-hour advance booking required",
    hoursOfOperation: "Monday-Friday 6am-6pm",
    contactInfo: "555-RIDE-MED | transport@healthaccess.org",
    status: "completed",
  },
  {
    id: "com-003",
    type: "community",
    name: "Depression Support Group",
    category: "Mental Health Support",
    dimensionId: "mental",
    eligibility: "Adults 18+ with depression diagnosis, free of charge",
    hoursOfOperation: "Every Tuesday 6:30pm-8pm",
    contactInfo: "Community Mental Health Center | 555-SUPPORT",
    status: "in_progress",
  },
  {
    id: "com-004",
    type: "community",
    name: "Financial Counseling Services",
    category: "Financial Assistance",
    dimensionId: "cost",
    eligibility: "Open to all community members, sliding scale fees",
    hoursOfOperation: "Monday-Thursday 10am-7pm",
    contactInfo: "555-FIN-HELP | counseling@communityfin.org",
    status: "pending",
  },
  {
    id: "com-005",
    type: "community",
    name: "Senior Fitness Program",
    category: "Physical Activity",
    dimensionId: "physical",
    eligibility: "Adults 50+, $5 per session or free with Medicare Silver Sneakers",
    hoursOfOperation: "Monday/Wednesday/Friday 9am-10am",
    contactInfo: "Community Recreation Center | 555-FIT-SENIOR",
    status: "pending",
  },
]

const systemActionItems: SystemActionItem[] = [
  {
    id: "sys-001",
    type: "system",
    name: "Care Coordination Protocol Enhancement",
    category: "Care Management",
    dimensionIds: ["medical", "engagement"],
    description: "Implement enhanced care coordination protocols between primary care, psychiatry, and specialty providers to ensure seamless information flow and treatment alignment.",
    status: "in_progress",
    expectedImpact: "Reduce care coordination gaps by 40%, improve treatment adherence",
  },
  {
    id: "sys-002",
    type: "system",
    name: "Automated Medication Reminder System",
    category: "Patient Engagement Technology",
    dimensionIds: ["engagement", "medical"],
    description: "Deploy automated SMS and app-based medication reminders with two-way confirmation to improve adherence rates.",
    status: "completed",
    expectedImpact: "Increase medication adherence by 25-30%",
  },
  {
    id: "sys-003",
    type: "system",
    name: "Population Health Risk Stratification",
    category: "Risk Management",
    dimensionIds: ["burden", "utilization", "cost"],
    description: "Implement AI-driven risk stratification model to identify patients at high risk for adverse events and target preventive interventions.",
    status: "in_progress",
    expectedImpact: "Reduce ER visits by 20%, decrease hospitalizations by 15%",
  },
  {
    id: "sys-004",
    type: "system",
    name: "Social Determinants Screening Integration",
    category: "SDOH Assessment",
    dimensionIds: ["sdoh", "engagement"],
    description: "Integrate standardized SDOH screening into all intake appointments with automated referrals to community resources.",
    status: "pending",
    expectedImpact: "Identify and address SDOH barriers for 80% of patients",
  },
  {
    id: "sys-005",
    type: "system",
    name: "Preventive Care Outreach Campaign",
    category: "Preventive Services",
    dimensionIds: ["physical", "utilization"],
    description: "Automated outreach system for preventive screenings, vaccinations, and wellness visits based on evidence-based guidelines.",
    status: "pending",
    expectedImpact: "Increase preventive care completion by 35%",
  },
]

const questionnaireResponses: QuestionResponse[] = [
  {
    questionId: "q-mental-001",
    question: "Over the past 2 weeks, how often have you felt down, depressed, or hopeless?",
    dimensionId: "mental",
    responseValue: 2,
    responseText: "Several days",
    timestamp: "2025-01-01T10:30:00Z",
  },
  {
    questionId: "q-mental-002",
    question: "How often do you feel nervous, anxious, or on edge?",
    dimensionId: "mental",
    responseValue: 3,
    responseText: "More than half the days",
    timestamp: "2025-01-01T10:31:00Z",
  },
  {
    questionId: "q-physical-001",
    question: "How would you rate your overall physical health?",
    dimensionId: "physical",
    responseValue: 2,
    responseText: "Good",
    timestamp: "2025-01-01T10:32:00Z",
  },
  {
    questionId: "q-physical-002",
    question: "How many days per week do you engage in moderate physical activity for at least 30 minutes?",
    dimensionId: "physical",
    responseValue: 3,
    responseText: "3-4 days",
    timestamp: "2025-01-01T10:33:00Z",
  },
  {
    questionId: "q-sdoh-001",
    question: "In the past 12 months, have you worried that your food would run out before you got money to buy more?",
    dimensionId: "sdoh",
    responseValue: 2,
    responseText: "Sometimes",
    timestamp: "2025-01-01T10:34:00Z",
  },
  {
    questionId: "q-sdoh-002",
    question: "How often do transportation issues prevent you from attending medical appointments?",
    dimensionId: "sdoh",
    responseValue: 2,
    responseText: "Occasionally",
    timestamp: "2025-01-01T10:35:00Z",
  },
  {
    questionId: "q-sdoh-003",
    question: "How often do you worry about having enough money to pay for healthcare costs?",
    dimensionId: "sdoh",
    responseValue: 3,
    responseText: "Often",
    timestamp: "2025-01-01T10:36:00Z",
  },
  {
    questionId: "q-engagement-001",
    question: "How often do you take your medications exactly as prescribed?",
    dimensionId: "engagement",
    responseValue: 1,
    responseText: "Almost always",
    timestamp: "2025-01-01T10:37:00Z",
  },
  {
    questionId: "q-engagement-002",
    question: "How confident are you in managing your health conditions?",
    dimensionId: "engagement",
    responseValue: 2,
    responseText: "Somewhat confident",
    timestamp: "2025-01-01T10:38:00Z",
  },
  {
    questionId: "q-sleep-001",
    question: "How many hours of sleep do you typically get per night?",
    dimensionId: "sleep",
    responseValue: 3,
    responseText: "5-6 hours",
    timestamp: "2025-01-01T10:39:00Z",
  },
  {
    questionId: "q-sleep-002",
    question: "How often do you have trouble falling or staying asleep?",
    dimensionId: "sleep",
    responseValue: 3,
    responseText: "More than half the nights",
    timestamp: "2025-01-01T10:40:00Z",
  },
  {
    questionId: "q-pain-001",
    question: "On a scale of 0-10, how would you rate your average pain level?",
    dimensionId: "pain",
    responseValue: 4,
    responseText: "4 - Moderate pain",
    timestamp: "2025-01-01T10:41:00Z",
  },
  {
    questionId: "q-pain-002",
    question: "How often does pain interfere with your daily activities?",
    dimensionId: "pain",
    responseValue: 2,
    responseText: "Sometimes",
    timestamp: "2025-01-01T10:42:00Z",
  },
  {
    questionId: "q-diet-001",
    question: "How many servings of fruits and vegetables do you eat per day?",
    dimensionId: "diet",
    responseValue: 2,
    responseText: "2-3 servings",
    timestamp: "2025-01-01T10:43:00Z",
  },
  {
    questionId: "q-diet-002",
    question: "How often do you eat fast food or highly processed meals?",
    dimensionId: "diet",
    responseValue: 3,
    responseText: "4-5 times per week",
    timestamp: "2025-01-01T10:44:00Z",
  },
]

export const mockAssessmentData: Record<number, { patient: Patient; assessments: Assessment[] }> = {
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
        id: "assess-001",
        date: "2025-01-01",
        patientId: 1,
        globalHealthIndex: 31,
        dimensions: [
          {
            id: "physical",
            name: "Physical Health",
            score: 21,
            riskLevel: "green",
            interpretation:
              "Overall physical health is in good standing with excellent cardiovascular indicators and mobility. Minor strength deficits noted but not concerning. Continue current activity level.",
            color: "#10b981",
            subcategories: physicalSubcategories,
          },
          {
            id: "mental",
            name: "Mental Health",
            score: 32,
            riskLevel: "yellow",
            interpretation:
              "Moderate mental health symptoms present. Depressive and anxiety symptoms are responding to treatment but require continued monitoring. Cognitive function remains excellent.",
            color: "#6366f1",
            subcategories: mentalSubcategories,
          },
          {
            id: "sdoh",
            name: "Social Determinants of Health",
            score: 36,
            riskLevel: "yellow",
            interpretation:
              "Some social determinant challenges identified, particularly food insecurity and financial stress. Housing stable. Community resources have been connected.",
            color: "#ef4444",
            subcategories: sdohSubcategories,
          },
          {
            id: "engagement",
            name: "Patient Engagement",
            score: 18,
            riskLevel: "green",
            interpretation:
              "Excellent patient engagement across all measures. Strong medication adherence, appointment attendance, and self-monitoring practices. Patient is an active participant in care.",
            color: "#f43f5e",
            subcategories: engagementSubcategories,
          },
          {
            id: "burden",
            name: "Burden of Illness",
            score: 34,
            riskLevel: "yellow",
            interpretation:
              "Moderate illness burden affecting quality of life. Symptoms and functional limitations present but improving with current treatment plan.",
            color: "#3b82f6",
            subcategories: burdenSubcategories,
          },
          {
            id: "medical",
            name: "Medical Management & Adherence",
            score: 23,
            riskLevel: "green",
            interpretation:
              "Strong medical management with excellent treatment adherence and good understanding of conditions. Minor care coordination gaps being addressed.",
            color: "#8b5cf6",
            subcategories: medicalSubcategories,
          },
          {
            id: "utilization",
            name: "Healthcare Utilization",
            score: 17,
            riskLevel: "green",
            interpretation:
              "Appropriate healthcare utilization patterns. Low ER and hospitalization rates indicate effective outpatient management.",
            color: "#f59e0b",
            subcategories: utilizationSubcategories,
          },
          {
            id: "diet",
            name: "Diet & Nutrition",
            score: 33,
            riskLevel: "yellow",
            interpretation:
              "Diet quality needs improvement. High processed food intake and irregular eating patterns. Nutrition counseling has been initiated.",
            color: "#84cc16",
            subcategories: dietSubcategories,
          },
          {
            id: "sleep",
            name: "Sleep Health",
            score: 44,
            riskLevel: "yellow",
            interpretation:
              "Sleep health is a significant concern. Quality and duration issues affecting daytime functioning. Sleep hygiene education provided and sleep study being considered.",
            color: "#ec4899",
            subcategories: sleepSubcategories,
          },
          {
            id: "pain",
            name: "Pain & Functional Impact",
            score: 28,
            riskLevel: "yellow",
            interpretation:
              "Moderate chronic pain affecting function. Multimodal pain management approach showing some benefit. Physical therapy ongoing.",
            color: "#f97316",
            subcategories: painSubcategories,
          },
          {
            id: "satisfaction",
            name: "Patient Satisfaction & Trust",
            score: 16,
            riskLevel: "green",
            interpretation:
              "High satisfaction with care team and services. Strong therapeutic relationships established. Minor wait time concerns noted.",
            color: "#14b8a6",
            subcategories: satisfactionSubcategories,
          },
          {
            id: "cost",
            name: "Healthcare Cost & Affordability",
            score: 46,
            riskLevel: "yellow",
            interpretation:
              "Healthcare costs creating moderate financial burden. Out-of-pocket expenses affecting some treatment decisions. Financial assistance programs being explored.",
            color: "#06b6d4",
            subcategories: costSubcategories,
          },
        ],
        actionItems: [
          ...physicianActionItems,
          ...patientActionItems,
          ...communityActionItems,
          ...systemActionItems,
        ],
        opportunities: {
          strengths: [
            {
              dimensionId: "physical",
              dimensionName: "Physical Health",
              subcategoryId: "physical-cardio",
              subcategoryName: "Cardiovascular Risk",
              score: 15,
              riskLevel: "green",
              recommendation: "Maintain current cardiovascular health through regular activity and monitoring.",
            },
            {
              dimensionId: "engagement",
              dimensionName: "Patient Engagement",
              subcategoryId: "engagement-medication",
              subcategoryName: "Medication Non-Adherence",
              score: 20,
              riskLevel: "green",
              recommendation: "Continue excellent medication adherence practices. Share strategies with other patients.",
            },
            {
              dimensionId: "utilization",
              dimensionName: "Healthcare Utilization",
              subcategoryId: "utilization-hospital",
              subcategoryName: "Hospitalizations",
              score: 12,
              riskLevel: "green",
              recommendation: "Effective outpatient management preventing hospitalizations. Maintain current care approach.",
            },
            {
              dimensionId: "satisfaction",
              dimensionName: "Patient Satisfaction & Trust",
              subcategoryId: "satisfaction-provider",
              subcategoryName: "Provider Relationship Issues",
              score: 12,
              riskLevel: "green",
              recommendation: "Strong therapeutic alliance is a protective factor. Continue fostering open communication.",
            },
          ],
          moderate: [
            {
              dimensionId: "mental",
              dimensionName: "Mental Health",
              subcategoryId: "mental-depression",
              subcategoryName: "Depression Severity",
              score: 35,
              riskLevel: "yellow",
              recommendation:
                "Continue current antidepressant therapy. Consider increasing therapy frequency or adding group therapy.",
            },
            {
              dimensionId: "sdoh",
              dimensionName: "Social Determinants of Health",
              subcategoryId: "sdoh-food",
              subcategoryName: "Food Insecurity",
              score: 45,
              riskLevel: "yellow",
              recommendation: "Connect with community food bank and explore SNAP benefits eligibility.",
            },
            {
              dimensionId: "sleep",
              dimensionName: "Sleep Health",
              subcategoryId: "sleep-quality",
              subcategoryName: "Sleep Quality Issues",
              score: 45,
              riskLevel: "yellow",
              recommendation:
                "Implement comprehensive sleep hygiene program. Consider cognitive behavioral therapy for insomnia (CBT-I).",
            },
            {
              dimensionId: "diet",
              dimensionName: "Diet & Nutrition",
              subcategoryId: "diet-habits",
              subcategoryName: "Eating Pattern Irregularity",
              score: 42,
              riskLevel: "yellow",
              recommendation: "Work with nutritionist to establish regular meal schedule. Meal planning and prep support.",
            },
          ],
          critical: [
            {
              dimensionId: "sleep",
              dimensionName: "Sleep Health",
              subcategoryId: "sleep-duration",
              subcategoryName: "Insufficient Sleep Duration",
              score: 52,
              riskLevel: "orange",
              recommendation:
                "Priority intervention needed. Sleep study referral to rule out sleep disorders. Assess for sleep apnea.",
            },
            {
              dimensionId: "sdoh",
              dimensionName: "Social Determinants of Health",
              subcategoryId: "sdoh-financial",
              subcategoryName: "Financial Stress",
              score: 58,
              riskLevel: "orange",
              recommendation:
                "Urgent financial counseling referral. Explore bill payment assistance programs and financial hardship options.",
            },
            {
              dimensionId: "cost",
              dimensionName: "Healthcare Cost & Affordability",
              subcategoryId: "cost-burden",
              subcategoryName: "Out-of-Pocket Cost Burden",
              score: 55,
              riskLevel: "orange",
              recommendation:
                "Review medication costs and explore generic alternatives. Connect with pharmaceutical assistance programs.",
            },
          ],
        },
        questionnaireResponses,
        interventions: [
          "Initiated comprehensive mental health treatment plan",
          "Connected to community food bank services",
          "Started sleep hygiene education program",
        ],
      },
    ],
  },
}

export function getAssessmentById(patientId: number, assessmentDate?: string): Assessment | null {
  const patientData = mockAssessmentData[patientId]
  if (!patientData) return null

  if (assessmentDate) {
    return patientData.assessments.find((a) => a.date === assessmentDate) || null
  }

  return patientData.assessments[patientData.assessments.length - 1]
}

export function getPatientById(patientId: number): Patient | null {
  const patientData = mockAssessmentData[patientId]
  return patientData ? patientData.patient : null
}

export function getDimensionById(assessment: Assessment, dimensionId: string): HealthDimension | null {
  return assessment.dimensions.find((d) => d.id === dimensionId) || null
}

export function getActionItemsByDimension(assessment: Assessment, dimensionId: string): ActionItem[] {
  return assessment.actionItems.filter((item) => {
    if (item.type === "physician" || item.type === "patient" || item.type === "community") {
      return item.dimensionId === dimensionId
    }
    if (item.type === "system") {
      return item.dimensionIds.includes(dimensionId)
    }
    return false
  })
}

export function getActionItemsByType<T extends ActionItem["type"]>(
  assessment: Assessment,
  type: T
): Extract<ActionItem, { type: T }>[] {
  return assessment.actionItems.filter((item) => item.type === type) as Extract<ActionItem, { type: T }>[]
}

export function getActionItemsByStatus(assessment: Assessment, status: ActionItemStatus): ActionItem[] {
  return assessment.actionItems.filter((item) => item.status === status)
}
