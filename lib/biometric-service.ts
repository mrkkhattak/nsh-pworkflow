import { createClient } from "@supabase/supabase-js"

export interface Biometric {
  id: number
  patient_id: number
  type: string
  value: number
  secondary_value: number | null
  date: string
  time: string
  notes: string | null
  recorded_by: string
  created_at: string
}

export interface BiometricTypeConfig {
  label: string
  unit: string
  hasSecondary: boolean
  color: string
}

export const biometricTypeConfigs: Record<string, BiometricTypeConfig> = {
  blood_pressure: {
    label: "Blood Pressure",
    unit: "mmHg",
    hasSecondary: true,
    color: "#8b5cf6",
  },
  blood_glucose: {
    label: "Blood Glucose",
    unit: "mg/dL",
    hasSecondary: false,
    color: "#3b82f6",
  },
  a1c: { label: "A1C", unit: "%", hasSecondary: false, color: "#10b981" },
  pain_score: {
    label: "Pain Score",
    unit: "0-10",
    hasSecondary: false,
    color: "#ef4444",
  },
  cholesterol: {
    label: "Cholesterol",
    unit: "mg/dL",
    hasSecondary: false,
    color: "#f59e0b",
  },
  bmi: { label: "BMI", unit: "kg/m²", hasSecondary: false, color: "#06b6d4" },
  weight: { label: "Weight", unit: "lbs", hasSecondary: false, color: "#ec4899" },
  triglycerides: {
    label: "Triglycerides",
    unit: "mg/dL",
    hasSecondary: false,
    color: "#6366f1",
  },
}

const mockBiometrics: Record<number, Biometric[]> = {
  1: [
    {
      id: 1,
      patient_id: 1,
      type: "blood_pressure",
      value: 128,
      secondary_value: 82,
      date: "2025-01-15",
      time: "09:30",
      notes: "Measured before morning medication",
      recorded_by: "PCP Clinic",
      created_at: "2025-01-15T09:30:00Z",
    },
    {
      id: 2,
      patient_id: 1,
      type: "blood_pressure",
      value: 125,
      secondary_value: 80,
      date: "2025-01-12",
      time: "08:00",
      notes: null,
      recorded_by: "Home Reading",
      created_at: "2025-01-12T08:00:00Z",
    },
    {
      id: 3,
      patient_id: 1,
      type: "blood_pressure",
      value: 130,
      secondary_value: 85,
      date: "2025-01-08",
      time: "09:00",
      notes: null,
      recorded_by: "PCP Clinic",
      created_at: "2025-01-08T09:00:00Z",
    },
    {
      id: 4,
      patient_id: 1,
      type: "blood_pressure",
      value: 132,
      secondary_value: 84,
      date: "2025-01-05",
      time: "10:30",
      notes: null,
      recorded_by: "Home Reading",
      created_at: "2025-01-05T10:30:00Z",
    },
    {
      id: 5,
      patient_id: 1,
      type: "blood_pressure",
      value: 135,
      secondary_value: 88,
      date: "2025-01-01",
      time: "07:00",
      notes: "Additional stress from substantial dental appointment.",
      recorded_by: "Home Reading",
      created_at: "2025-01-01T07:00:00Z",
    },
    {
      id: 6,
      patient_id: 1,
      type: "blood_pressure",
      value: 138,
      secondary_value: 90,
      date: "2024-12-28",
      time: "09:00",
      notes: null,
      recorded_by: "PCP Clinic",
      created_at: "2024-12-28T09:00:00Z",
    },
    {
      id: 7,
      patient_id: 1,
      type: "blood_glucose",
      value: 105,
      secondary_value: null,
      date: "2025-01-14",
      time: "07:00",
      notes: "Fasting glucose",
      recorded_by: "Home Reading",
      created_at: "2025-01-14T07:00:00Z",
    },
    {
      id: 8,
      patient_id: 1,
      type: "blood_glucose",
      value: 110,
      secondary_value: null,
      date: "2025-01-10",
      time: "07:15",
      notes: null,
      recorded_by: "Home Reading",
      created_at: "2025-01-10T07:15:00Z",
    },
    {
      id: 9,
      patient_id: 1,
      type: "blood_glucose",
      value: 108,
      secondary_value: null,
      date: "2025-01-06",
      time: "07:00",
      notes: null,
      recorded_by: "Home Reading",
      created_at: "2025-01-06T07:00:00Z",
    },
    {
      id: 10,
      patient_id: 1,
      type: "blood_glucose",
      value: 112,
      secondary_value: null,
      date: "2025-01-02",
      time: "07:30",
      notes: null,
      recorded_by: "PCP Clinic",
      created_at: "2025-01-02T07:30:00Z",
    },
    {
      id: 11,
      patient_id: 1,
      type: "weight",
      value: 165,
      secondary_value: null,
      date: "2025-01-13",
      time: "08:00",
      notes: null,
      recorded_by: "Home Reading",
      created_at: "2025-01-13T08:00:00Z",
    },
    {
      id: 12,
      patient_id: 1,
      type: "weight",
      value: 167,
      secondary_value: null,
      date: "2025-01-06",
      time: "08:00",
      notes: null,
      recorded_by: "Home Reading",
      created_at: "2025-01-06T08:00:00Z",
    },
    {
      id: 13,
      patient_id: 1,
      type: "weight",
      value: 169,
      secondary_value: null,
      date: "2024-12-30",
      time: "08:00",
      notes: null,
      recorded_by: "Home Reading",
      created_at: "2024-12-30T08:00:00Z",
    },
    {
      id: 14,
      patient_id: 1,
      type: "bmi",
      value: 24.5,
      secondary_value: null,
      date: "2025-01-13",
      time: "08:00",
      notes: null,
      recorded_by: "Home Reading",
      created_at: "2025-01-13T08:00:00Z",
    },
    {
      id: 15,
      patient_id: 1,
      type: "bmi",
      value: 24.8,
      secondary_value: null,
      date: "2025-01-06",
      time: "08:00",
      notes: null,
      recorded_by: "Home Reading",
      created_at: "2025-01-06T08:00:00Z",
    },
  ],
}

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

export async function getBiometricsByPatientId(
  patientId: number
): Promise<Biometric[]> {
  const supabase = getSupabaseClient()

  if (!supabase) {
    return mockBiometrics[patientId] || []
  }

  try {
    const { data, error } = await supabase
      .from("biometrics")
      .select("*")
      .eq("patient_id", patientId)
      .order("date", { ascending: false })
      .order("time", { ascending: false })

    if (error) {
      console.error("Error fetching biometrics:", error)
      return mockBiometrics[patientId] || []
    }

    return data || mockBiometrics[patientId] || []
  } catch (error) {
    console.error("Error fetching biometrics:", error)
    return mockBiometrics[patientId] || []
  }
}

export async function getBiometricsByType(
  patientId: number,
  type: string,
  limit?: number
): Promise<Biometric[]> {
  const allBiometrics = await getBiometricsByPatientId(patientId)
  const filtered = allBiometrics.filter((b) => b.type === type)
  return limit ? filtered.slice(0, limit) : filtered
}

export async function getBiometricsInDateRange(
  patientId: number,
  startDate: string,
  endDate: string
): Promise<Biometric[]> {
  const allBiometrics = await getBiometricsByPatientId(patientId)
  return allBiometrics.filter(
    (b) => b.date >= startDate && b.date <= endDate
  )
}

export function getDateRangeFromDays(days: number): { startDate: string; endDate: string } {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  return {
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
  }
}

export interface ChartDataPoint {
  date: string
  value: number
  secondaryValue?: number
  notes?: string
  recordedBy: string
  time: string
}

export function transformBiometricsForChart(
  biometrics: Biometric[]
): ChartDataPoint[] {
  return biometrics
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((b) => ({
      date: b.date,
      value: b.value,
      secondaryValue: b.secondary_value || undefined,
      notes: b.notes || undefined,
      recordedBy: b.recorded_by,
      time: b.time,
    }))
}

export function getTrendDirection(biometrics: Biometric[]): "up" | "down" | "stable" {
  if (biometrics.length < 2) return "stable"

  const sorted = [...biometrics].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const latest = sorted[0].value
  const previous = sorted[1].value
  const change = ((latest - previous) / previous) * 100

  if (Math.abs(change) < 5) return "stable"
  if (change > 0) return "up"
  return "down"
}
