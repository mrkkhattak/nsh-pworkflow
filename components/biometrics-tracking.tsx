"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AddBiometricDialog } from "@/components/add-biometric-dialog"
import { Activity, TrendingUp, TrendingDown, Minus, Calendar, User, FileText } from "lucide-react"

interface Biometric {
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

const biometricTypeLabels: Record<string, { label: string; unit: string; hasSecondary: boolean }> = {
  blood_pressure: { label: "Blood Pressure", unit: "mmHg", hasSecondary: true },
  blood_glucose: { label: "Blood Glucose", unit: "mg/dL", hasSecondary: false },
  a1c: { label: "A1C", unit: "%", hasSecondary: false },
  pain_score: { label: "Pain Score", unit: "0-10", hasSecondary: false },
  cholesterol: { label: "Cholesterol", unit: "mg/dL", hasSecondary: false },
  bmi: { label: "BMI", unit: "kg/m²", hasSecondary: false },
  weight: { label: "Weight", unit: "lbs", hasSecondary: false },
  triglycerides: { label: "Triglycerides", unit: "mg/dL", hasSecondary: false },
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
      recorded_by: "Dr. Anderson",
      created_at: "2025-01-15T09:30:00Z",
    },
    {
      id: 2,
      patient_id: 1,
      type: "blood_glucose",
      value: 105,
      secondary_value: null,
      date: "2025-01-14",
      time: "07:00",
      notes: "Fasting glucose",
      recorded_by: "Dr. Anderson",
      created_at: "2025-01-14T07:00:00Z",
    },
    {
      id: 3,
      patient_id: 1,
      type: "weight",
      value: 165,
      secondary_value: null,
      date: "2025-01-13",
      time: "08:00",
      notes: null,
      recorded_by: "Nurse Johnson",
      created_at: "2025-01-13T08:00:00Z",
    },
    {
      id: 4,
      patient_id: 1,
      type: "pain_score",
      value: 4,
      secondary_value: null,
      date: "2025-01-12",
      time: "14:30",
      notes: "Lower back pain, improved from last week",
      recorded_by: "Dr. Anderson",
      created_at: "2025-01-12T14:30:00Z",
    },
    {
      id: 5,
      patient_id: 1,
      type: "blood_pressure",
      value: 132,
      secondary_value: 85,
      date: "2025-01-10",
      time: "10:00",
      notes: null,
      recorded_by: "Nurse Johnson",
      created_at: "2025-01-10T10:00:00Z",
    },
    {
      id: 6,
      patient_id: 1,
      type: "a1c",
      value: 5.8,
      secondary_value: null,
      date: "2025-01-08",
      time: "09:00",
      notes: "Quarterly check",
      recorded_by: "Dr. Anderson",
      created_at: "2025-01-08T09:00:00Z",
    },
    {
      id: 7,
      patient_id: 1,
      type: "cholesterol",
      value: 195,
      secondary_value: null,
      date: "2025-01-08",
      time: "09:00",
      notes: "Total cholesterol",
      recorded_by: "Dr. Anderson",
      created_at: "2025-01-08T09:00:00Z",
    },
  ],
}

interface Props {
  patientId: number
}

export function BiometricsTracking({ patientId }: Props) {
  const [biometrics, setBiometrics] = useState<Biometric[]>(mockBiometrics[patientId] || [])
  const [selectedType, setSelectedType] = useState<string>("all")

  const handleAddBiometric = (newBiometric: Biometric) => {
    setBiometrics([newBiometric, ...biometrics])
  }

  const filteredBiometrics =
    selectedType === "all" ? biometrics : biometrics.filter((b) => b.type === selectedType)

  const groupedBiometrics = filteredBiometrics.reduce((acc, biometric) => {
    if (!acc[biometric.type]) {
      acc[biometric.type] = []
    }
    acc[biometric.type].push(biometric)
    return acc
  }, {} as Record<string, Biometric[]>)

  const getTrend = (readings: Biometric[]) => {
    if (readings.length < 2) return "stable"
    const latest = readings[0].value
    const previous = readings[1].value
    const change = ((latest - previous) / previous) * 100

    if (Math.abs(change) < 5) return "stable"
    if (change > 0) return "up"
    return "down"
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-red-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-green-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const biometricTypes = Object.keys(groupedBiometrics)

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-gray-200 bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Biometric Readings
              </CardTitle>
              <CardDescription>Track and monitor vital signs and biometric measurements</CardDescription>
            </div>
            <AddBiometricDialog patientId={patientId} onAdd={handleAddBiometric} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant={selectedType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("all")}
              >
                All ({biometrics.length})
              </Button>
              {biometricTypes.map((type) => {
                const typeInfo = biometricTypeLabels[type]
                const count = groupedBiometrics[type].length
                return (
                  <Button
                    key={type}
                    variant={selectedType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                  >
                    {typeInfo.label} ({count})
                  </Button>
                )
              })}
            </div>

            <div className="space-y-4">
              {Object.entries(groupedBiometrics).map(([type, readings]) => {
                const typeInfo = biometricTypeLabels[type]
                const trend = getTrend(readings)
                const latest = readings[0]

                return (
                  <Card key={type} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-sm font-semibold text-foreground">{typeInfo.label}</h4>
                              <Badge variant="outline" className="text-xs">
                                {readings.length} readings
                              </Badge>
                              {getTrendIcon(trend)}
                            </div>
                            <div className="flex items-baseline gap-2">
                              <p className="text-2xl font-bold text-foreground">
                                {typeInfo.hasSecondary
                                  ? `${latest.value}/${latest.secondary_value}`
                                  : latest.value}
                              </p>
                              <p className="text-sm text-muted-foreground">{typeInfo.unit}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Latest reading on {new Date(latest.date).toLocaleDateString()} at {latest.time}
                            </p>
                          </div>
                        </div>

                        <div className="border-t pt-3">
                          <details className="group">
                            <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground list-none flex items-center gap-2">
                              <span className="group-open:rotate-90 transition-transform">▶</span>
                              View History ({readings.length} readings)
                            </summary>
                            <div className="mt-3 space-y-2">
                              {readings.map((reading) => (
                                <div key={reading.id} className="bg-gray-50 rounded-lg p-3 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-baseline gap-2">
                                      <p className="text-lg font-semibold text-foreground">
                                        {typeInfo.hasSecondary
                                          ? `${reading.value}/${reading.secondary_value}`
                                          : reading.value}
                                      </p>
                                      <p className="text-xs text-muted-foreground">{typeInfo.unit}</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Calendar className="h-3 w-3" />
                                      <span>
                                        {new Date(reading.date).toLocaleDateString()} {reading.time}
                                      </span>
                                    </div>
                                  </div>
                                  {reading.notes && (
                                    <div className="flex items-start gap-1 text-xs text-muted-foreground">
                                      <FileText className="h-3 w-3 mt-0.5 shrink-0" />
                                      <p>{reading.notes}</p>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <User className="h-3 w-3" />
                                    <span>Recorded by {reading.recorded_by}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </details>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredBiometrics.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No biometric readings found</p>
                <p className="text-sm mt-2">Add a new reading to start tracking biometrics</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
