"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  getPatientById,
  getAssessmentById,
  mockDimensionGoals,
  healthDimensionsConfig,
  getRiskLevel,
  getRiskColor,
  getRiskLabel
} from "@/lib/nsh-assessment-mock"
import { Target, Activity, Calendar, TrendingUp, ArrowRight, CheckCircle } from "lucide-react"

interface PatientProgressOverviewProps {
  patientId: number
}

export function PatientProgressOverview({ patientId }: PatientProgressOverviewProps) {
  const patient = getPatientById(patientId)
  const assessment = getAssessmentById(patientId)

  if (!patient || !assessment) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-600">Unable to load your health information.</p>
        </CardContent>
      </Card>
    )
  }

  const patientGoals = mockDimensionGoals.filter(goal =>
    goal.status !== "cancelled" && goal.status !== "achieved"
  )

  const achievedGoals = mockDimensionGoals.filter(goal => goal.status === "achieved")

  const allInterventions = patientGoals.flatMap(goal => goal.linkedInterventions)
  const uniqueInterventions = Array.from(new Set(allInterventions))

  const averageProgress = patientGoals.length > 0
    ? Math.round(patientGoals.reduce((sum, goal) => sum + goal.progress, 0) / patientGoals.length)
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Welcome, {patient.name.split(" ")[0]}</h1>
        <p className="text-gray-600">Track your health goals and see the care plan your provider has created for you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-gray-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Goals</p>
                <p className="text-3xl font-bold text-gray-900">{patientGoals.length}</p>
                {achievedGoals.length > 0 && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {achievedGoals.length} achieved
                  </p>
                )}
              </div>
              <Target className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Interventions</p>
                <p className="text-3xl font-bold text-gray-900">{uniqueInterventions.length}</p>
                <p className="text-xs text-gray-600 mt-1">Treatment plan items</p>
              </div>
              <Activity className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Progress</p>
                <p className="text-3xl font-bold text-gray-900">{averageProgress}%</p>
                <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Towards your goals
                </p>
              </div>
              <div className="relative">
                <svg className="h-10 w-10 transform -rotate-90">
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="4"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="4"
                    strokeDasharray={`${averageProgress} ${100 - averageProgress}`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-gray-200 bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Your Goals at a Glance</CardTitle>
              <Link href={`/patient-portal/${patientId}/goals`}>
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {patientGoals.slice(0, 3).map((goal) => (
              <div key={goal.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{goal.description}</p>
                    <p className="text-xs text-gray-600 mt-1">{goal.dimensionName}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 ml-2">
                    {goal.progress}%
                  </Badge>
                </div>
                <Progress value={goal.progress} className="h-2 mb-2" />
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Current: {goal.current}</span>
                  <span>Target: {goal.target}</span>
                  <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            {patientGoals.length === 0 && (
              <div className="text-center py-8">
                <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-sm text-gray-500">No active goals yet.</p>
                <p className="text-xs text-gray-400 mt-1">Your provider will create goals for you during your next visit.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200 bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Your Treatment Plan</CardTitle>
              <Link href={`/patient-portal/${patientId}/interventions`}>
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {uniqueInterventions.slice(0, 5).map((intervention, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <Activity className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{intervention}</p>
                  <p className="text-xs text-gray-600">Active intervention</p>
                </div>
              </div>
            ))}
            {uniqueInterventions.length === 0 && (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-sm text-gray-500">No active interventions yet.</p>
                <p className="text-xs text-gray-400 mt-1">Your provider will create a treatment plan for you.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Health Dimensions Overview</CardTitle>
          <p className="text-sm text-gray-600">See how you're doing across all areas of your health</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assessment.dimensions.map((dimension) => {
              const dimensionGoals = patientGoals.filter(g => g.dimensionId === dimension.id)
              const config = healthDimensionsConfig.find(c => c.id === dimension.id)

              return (
                <div key={dimension.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: config?.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">{dimension.name}</h4>
                      <Badge
                        variant="outline"
                        className={`${getRiskColor(dimension.riskLevel)} border-current/20 text-xs mt-1`}
                      >
                        {getRiskLabel(dimension.riskLevel)}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-center mb-2">
                    <p className="text-2xl font-bold text-gray-900">{dimension.score}</p>
                    <p className="text-xs text-gray-600">Current Score</p>
                  </div>
                  {dimensionGoals.length > 0 && (
                    <p className="text-xs text-blue-600 text-center">
                      {dimensionGoals.length} active {dimensionGoals.length === 1 ? "goal" : "goals"}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-gray-200 bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Calendar className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Need to discuss your goals?</h3>
              <p className="text-sm text-gray-700 mb-4">
                Talk to your healthcare provider about your progress, ask questions about your treatment plan, or discuss any concerns you have.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Schedule an Appointment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
