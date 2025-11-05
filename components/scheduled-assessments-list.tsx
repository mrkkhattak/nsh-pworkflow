"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, FileText, AlertCircle } from "lucide-react"
import { healthDimensionsConfig } from "@/lib/nsh-assessment-mock"
import { createClient } from "@supabase/supabase-js"

type ScheduledAssessment = {
  id: string
  patient_id: number
  scheduled_date: string
  scheduled_time: string
  notes: string | null
  status: string
  assessment_scope: "full" | "dimensions"
  selected_dimensions: string[]
  created_at: string
}

type Props = {
  patientId: number
  refreshKey?: number
}

const mockScheduledAssessments: Record<number, ScheduledAssessment[]> = {
  1: [
    {
      id: "mock-1",
      patient_id: 1,
      scheduled_date: "2025-11-10",
      scheduled_time: "09:00:00",
      notes: "Follow-up on medication adherence and mental health progress",
      status: "pending",
      assessment_scope: "full",
      selected_dimensions: [],
      created_at: "2025-11-05T10:00:00Z",
    },
    {
      id: "mock-2",
      patient_id: 1,
      scheduled_date: "2025-11-15",
      scheduled_time: "09:00:00",
      notes: "Check sleep patterns after intervention",
      status: "pending",
      assessment_scope: "dimensions",
      selected_dimensions: ["sleep"],
      created_at: "2025-11-05T11:00:00Z",
    },
    {
      id: "mock-3",
      patient_id: 1,
      scheduled_date: "2025-11-20",
      scheduled_time: "09:00:00",
      notes: null,
      status: "pending",
      assessment_scope: "dimensions",
      selected_dimensions: ["mental", "pain", "sleep"],
      created_at: "2025-11-05T12:00:00Z",
    },
  ],
}

export function ScheduledAssessmentsList({ patientId, refreshKey }: Props) {
  const [scheduledAssessments, setScheduledAssessments] = useState<ScheduledAssessment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchScheduledAssessments()
  }, [patientId, refreshKey])

  const fetchScheduledAssessments = async () => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data, error } = await supabase
        .from("scheduled_assessments")
        .select("*")
        .eq("patient_id", patientId)
        .eq("status", "pending")
        .order("scheduled_date", { ascending: true })
        .order("scheduled_time", { ascending: true })

      if (error) {
        console.error("Error fetching scheduled assessments:", error)
        const mockData = mockScheduledAssessments[patientId] || []
        setScheduledAssessments(mockData)
      } else {
        const allAssessments = [...(mockScheduledAssessments[patientId] || []), ...(data || [])]
        setScheduledAssessments(allAssessments)
      }
    } catch (error) {
      console.error("Error fetching scheduled assessments:", error)
      const mockData = mockScheduledAssessments[patientId] || []
      setScheduledAssessments(mockData)
    } finally {
      setLoading(false)
    }
  }

  const getDimensionName = (dimensionId: string) => {
    return healthDimensionsConfig.find(d => d.id === dimensionId)?.name || dimensionId
  }

  const getDimensionColor = (dimensionId: string) => {
    return healthDimensionsConfig.find(d => d.id === dimensionId)?.color || "#6b7280"
  }

  const isUpcoming = (date: string) => {
    const scheduledDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    scheduledDate.setHours(0, 0, 0, 0)
    const daysUntil = Math.ceil((scheduledDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntil <= 7 && daysUntil >= 0
  }

  const isPast = (date: string) => {
    const scheduledDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    scheduledDate.setHours(0, 0, 0, 0)
    return scheduledDate < today
  }

  if (loading) {
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Scheduled Assessments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  if (scheduledAssessments.length === 0) {
    return null
  }

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Scheduled Assessments
        </CardTitle>
        <CardDescription>
          {scheduledAssessments.length} pending assessment{scheduledAssessments.length !== 1 ? "s" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {scheduledAssessments.map((assessment) => {
            const upcoming = isUpcoming(assessment.scheduled_date)
            const past = isPast(assessment.scheduled_date)
            const scheduledDate = new Date(assessment.scheduled_date)

            return (
              <Card
                key={assessment.id}
                className={`border-l-4 ${
                  past
                    ? "border-l-red-500 bg-red-50"
                    : upcoming
                      ? "border-l-orange-500 bg-orange-50"
                      : "border-l-blue-500"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">
                          {assessment.assessment_scope === "full"
                            ? "Full NSH Assessment"
                            : `${assessment.selected_dimensions.length} Health Dimension${
                                assessment.selected_dimensions.length !== 1 ? "s" : ""
                              }`}
                        </h4>
                        {past && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Overdue
                          </Badge>
                        )}
                        {upcoming && !past && (
                          <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                            <Clock className="h-3 w-3 mr-1" />
                            Upcoming
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{scheduledDate.toLocaleDateString()}</span>
                      </div>

                      {assessment.assessment_scope === "dimensions" && assessment.selected_dimensions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {assessment.selected_dimensions.map((dimId) => (
                            <Badge
                              key={dimId}
                              variant="outline"
                              className="text-xs px-2 py-0.5"
                              style={{
                                borderColor: getDimensionColor(dimId),
                                color: getDimensionColor(dimId),
                              }}
                            >
                              {getDimensionName(dimId)}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {assessment.notes && (
                        <div className="flex items-start gap-1 text-sm text-gray-600 mt-2">
                          <FileText className="h-4 w-4 mt-0.5 shrink-0" />
                          <p className="text-xs">{assessment.notes}</p>
                        </div>
                      )}
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-4"
                      onClick={() => {
                        // TODO: Implement start assessment functionality
                        console.log("Start assessment:", assessment.id)
                      }}
                    >
                      Start
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
