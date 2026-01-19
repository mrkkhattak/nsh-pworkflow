"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  mockDimensionGoals,
  healthDimensionsConfig
} from "@/lib/nsh-assessment-mock"
import { Activity, Pill, Heart, Users, Calendar, ArrowLeft, Filter, Info } from "lucide-react"

interface AllInterventionsAggregatedViewProps {
  patientId: number
}

interface InterventionWithDetails {
  name: string
  type: "Medication" | "Lifestyle" | "Therapy" | "Social" | "Other"
  dimensionIds: string[]
  linkedGoals: string[]
  startDate: string
  status: "active" | "completed"
}

export function AllInterventionsAggregatedView({ patientId }: AllInterventionsAggregatedViewProps) {
  const [filterType, setFilterType] = useState<string>("all")
  const [filterDimension, setFilterDimension] = useState<string>("all")

  const interventionsData: InterventionWithDetails[] = [
    {
      name: "Sertraline 75mg",
      type: "Medication",
      dimensionIds: ["mental"],
      linkedGoals: ["Reduce depression score by 50%"],
      startDate: "2025-01-01",
      status: "active"
    },
    {
      name: "CBT Sessions",
      type: "Therapy",
      dimensionIds: ["mental"],
      linkedGoals: ["Reduce depression score by 50%"],
      startDate: "2025-01-01",
      status: "active"
    },
    {
      name: "Mindfulness Meditation",
      type: "Lifestyle",
      dimensionIds: ["mental"],
      linkedGoals: ["Improve coping skills score to below 30"],
      startDate: "2025-01-01",
      status: "active"
    },
    {
      name: "Sleep Hygiene Practice",
      type: "Lifestyle",
      dimensionIds: ["sleep"],
      linkedGoals: ["Increase sleep duration to 7+ hours nightly"],
      startDate: "2025-01-01",
      status: "active"
    },
    {
      name: "Community Food Bank Access",
      type: "Other",
      dimensionIds: ["sdoh"],
      linkedGoals: ["Reduce food insecurity score by 40%"],
      startDate: "2025-01-01",
      status: "active"
    },
    {
      name: "30-Minute Daily Walks",
      type: "Lifestyle",
      dimensionIds: ["physical"],
      linkedGoals: ["Improve strength deficit score to below 20"],
      startDate: "2025-01-01",
      status: "active"
    },
    {
      name: "Meal Planning and Prep",
      type: "Lifestyle",
      dimensionIds: ["diet"],
      linkedGoals: ["Reduce diet quality issues score by 30%"],
      startDate: "2025-01-01",
      status: "active"
    },
    {
      name: "Pain Tracking Log",
      type: "Other",
      dimensionIds: ["pain"],
      linkedGoals: ["Achieve pain severity below 20"],
      startDate: "2025-01-01",
      status: "active"
    },
    {
      name: "Multimodal pain management",
      type: "Therapy",
      dimensionIds: ["pain"],
      linkedGoals: ["Achieve pain severity below 20"],
      startDate: "2025-01-01",
      status: "active"
    },
    {
      name: "Financial Counseling Services",
      type: "Other",
      dimensionIds: ["cost"],
      linkedGoals: ["Reduce out-of-pocket cost burden to under 40"],
      startDate: "2025-01-01",
      status: "active"
    }
  ]

  let filteredInterventions = [...interventionsData]

  if (filterType !== "all") {
    filteredInterventions = filteredInterventions.filter(i => i.type === filterType)
  }

  if (filterDimension !== "all") {
    filteredInterventions = filteredInterventions.filter(i => i.dimensionIds.includes(filterDimension))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
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

  const getTypeColor = (type: string) => {
    switch (type) {
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

  const getInterventionDetails = (intervention: InterventionWithDetails) => {
    switch (intervention.name) {
      case "Sertraline 75mg":
        return {
          details: "Dosage: 75mg, Frequency: Daily, oral",
          provider: "Dr. Anderson",
          instructions: "Take once daily in the morning with food. May take 4-6 weeks to see full effects."
        }
      case "CBT Sessions":
        return {
          details: "Frequency: Weekly sessions",
          provider: "Lisa Chen, LCSW",
          instructions: "Weekly 50-minute sessions focused on cognitive behavioral therapy techniques."
        }
      case "Mindfulness Meditation":
        return {
          details: "Duration: 10 minutes daily",
          provider: "Lisa Chen, LCSW",
          instructions: "Practice daily mindfulness meditation using guided app or online resources."
        }
      case "Sleep Hygiene Practice":
        return {
          details: "Daily routine establishment",
          provider: "Dr. Anderson",
          instructions: "Lights off by 10pm, no screens 1 hour before bed, maintain cool room temperature."
        }
      case "Community Food Bank Access":
        return {
          details: "Community resource connection",
          provider: "Care Coordinator",
          instructions: "Access community food bank services. Contact info and hours provided separately."
        }
      case "30-Minute Daily Walks":
        return {
          details: "Exercise: 30 minutes, 5 days/week",
          provider: "Dr. Williams",
          instructions: "Moderate-intensity walking for at least 30 minutes per day, 5 days per week."
        }
      case "Meal Planning and Prep":
        return {
          details: "Weekly meal planning",
          provider: "Nutritionist",
          instructions: "Plan and prepare healthy meals each Sunday. Focus on whole foods, reduce processed items."
        }
      case "Pain Tracking Log":
        return {
          details: "Daily pain documentation",
          provider: "Dr. Rodriguez",
          instructions: "Document pain levels (1-10), location, duration, and activities affecting pain."
        }
      case "Multimodal pain management":
        return {
          details: "Comprehensive pain treatment",
          provider: "Dr. Rodriguez",
          instructions: "Combined approach including physical therapy, medication, and lifestyle modifications."
        }
      case "Financial Counseling Services":
        return {
          details: "Financial assistance support",
          provider: "Patient Advocate",
          instructions: "Work with financial counselor to explore payment assistance and hardship options."
        }
      default:
        return {
          details: "Active intervention",
          provider: "Healthcare Team",
          instructions: "Follow provider guidance for this intervention."
        }
    }
  }

  const InterventionCard = ({ intervention }: { intervention: InterventionWithDetails }) => {
    const details = getInterventionDetails(intervention)
    const dimensions = intervention.dimensionIds.map(id =>
      healthDimensionsConfig.find(d => d.id === id)
    ).filter(Boolean)

    return (
      <Card className="shadow-sm border-gray-200 bg-white hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              {getTypeIcon(intervention.type)}
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`${getTypeColor(intervention.type)} text-xs border`}>
                      {intervention.type}
                    </Badge>
                    {intervention.status === "active" && (
                      <Badge className="bg-green-100 text-green-800 border-green-300 text-xs border">
                        Active
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{intervention.name}</h3>
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
                    <Calendar className="h-4 w-4 text-gray-500" />
                    {new Date(intervention.startDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-600" />
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
                        />
                        <span className="text-xs text-gray-700">{dim!.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {intervention.linkedGoals.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-2">Supporting These Goals:</p>
                  <div className="space-y-2">
                    {intervention.linkedGoals.map((goal, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <Activity className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
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

  const activeInterventions = filteredInterventions.filter(i => i.status === "active")
  const medicationCount = activeInterventions.filter(i => i.type === "Medication").length
  const lifestyleCount = activeInterventions.filter(i => i.type === "Lifestyle").length
  const therapyCount = activeInterventions.filter(i => i.type === "Therapy").length
  const otherCount = activeInterventions.filter(i => i.type === "Other").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href={`/patient-portal/${patientId}`}>
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Overview
            </Button>
          </Link>
          <h1 className="text-3xl font-semibold text-gray-900">My Treatment Plan</h1>
          <p className="text-gray-600 mt-1">All interventions and treatments your provider has prescribed or recommended</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-sm border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Medications</p>
                <p className="text-2xl font-bold text-gray-900">{medicationCount}</p>
              </div>
              <Pill className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Lifestyle</p>
                <p className="text-2xl font-bold text-gray-900">{lifestyleCount}</p>
              </div>
              <Heart className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Therapy</p>
                <p className="text-2xl font-bold text-gray-900">{therapyCount}</p>
              </div>
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Other</p>
                <p className="text-2xl font-bold text-gray-900">{otherCount}</p>
              </div>
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Interventions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Medication">Medication</SelectItem>
                  <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="Therapy">Therapy</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Health Area</label>
              <Select value={filterDimension} onValueChange={setFilterDimension}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  {healthDimensionsConfig.map(dim => (
                    <SelectItem key={dim.id} value={dim.id}>
                      {dim.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredInterventions.length > 0 ? (
          filteredInterventions.map((intervention, idx) => (
            <InterventionCard key={idx} intervention={intervention} />
          ))
        ) : (
          <Card className="shadow-sm border-gray-200 bg-white">
            <CardContent className="p-12 text-center">
              <Activity className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No interventions found</h3>
              <p className="text-gray-600">Try adjusting your filters or check back later.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="shadow-sm border-gray-200 bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-2">Important Reminders</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Follow all instructions exactly as prescribed by your healthcare provider</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>If you have questions or concerns about any intervention, contact your provider before making changes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Track your progress and report any side effects or difficulties to your care team</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>These interventions work together to help you achieve your health goals</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
