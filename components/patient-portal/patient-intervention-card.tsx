"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { healthDimensionsConfig } from "@/lib/nsh-assessment-mock"
import { Activity, Pill, Heart, Users, Calendar, Info } from "lucide-react"

interface PatientInterventionCardProps {
  name: string
  type: "Medication" | "Lifestyle" | "Therapy" | "Social" | "Other"
  dimensionIds: string[]
  linkedGoals: string[]
  startDate: string
  status: "active" | "completed"
  details: {
    details: string
    provider: string
    instructions: string
  }
}

export function PatientInterventionCard({
  name,
  type,
  dimensionIds,
  linkedGoals,
  startDate,
  status,
  details
}: PatientInterventionCardProps) {
  const getTypeIcon = (interventionType: string) => {
    switch (interventionType) {
      case "Medication":
        return <Pill className="h-5 w-5 text-blue-600" />
      case "Lifestyle":
        return <Heart className="h-5 w-5 text-green-600" />
      case "Therapy":
        return <Users className="h-5 w-5 text-purple-600" />
      default:
        return <Activity className="h-5 w-5 text-orange-600" />
    }
  }

  const getTypeColor = (interventionType: string) => {
    switch (interventionType) {
      case "Medication":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "Lifestyle":
        return "bg-green-100 text-green-800 border-green-300"
      case "Therapy":
        return "bg-purple-100 text-purple-800 border-purple-300"
      default:
        return "bg-orange-100 text-orange-800 border-orange-300"
    }
  }

  const dimensions = dimensionIds.map(id =>
    healthDimensionsConfig.find(d => d.id === id)
  ).filter(Boolean)

  return (
    <Card className="shadow-sm border-gray-200 bg-white hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1" aria-hidden="true">
            {getTypeIcon(type)}
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge className={`${getTypeColor(type)} text-xs border`}>
                    {type}
                  </Badge>
                  {status === "active" && (
                    <Badge className="bg-green-100 text-green-800 border-green-300 text-xs border">
                      Active
                    </Badge>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
                <p className="text-sm text-gray-600">{details.details}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">Prescribed/Recommended By:</p>
                <p className="text-sm text-gray-900">{details.provider}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">Started:</p>
                <div className="flex items-center gap-2 text-sm text-gray-900">
                  <Calendar className="h-4 w-4 text-gray-500" aria-hidden="true" />
                  <time dateTime={startDate}>{new Date(startDate).toLocaleDateString()}</time>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" role="note" aria-label="Instructions">
              <p className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600" aria-hidden="true" />
                Instructions:
              </p>
              <p className="text-sm text-gray-700">{details.instructions}</p>
            </div>

            {dimensions.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-700 mb-2">Health Areas:</p>
                <div className="flex flex-wrap gap-2">
                  {dimensions.map((dim) => (
                    <div key={dim!.id} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: dim!.color }}
                        aria-hidden="true"
                      />
                      <span className="text-xs text-gray-700">{dim!.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {linkedGoals.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-700 mb-2">Supporting These Goals:</p>
                <div className="space-y-2">
                  {linkedGoals.map((goal, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <Activity className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{goal}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
