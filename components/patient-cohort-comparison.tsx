"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  getPatientDimensionScores,
  getCohortStatistics,
  type PatientDimensionScore,
} from "@/lib/cohort-patient-service"
import { healthDimensionsConfig, type RiskLevel } from "@/lib/nsh-assessment-mock"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts"
import { TrendingUp, TrendingDown, Minus, Target, Users, Award } from "lucide-react"

interface PatientCohortComparisonProps {
  patientId: number
  patientName: string
  dimensionId: string
  dimensionName: string
  dimensionColor: string
  performanceTier: string
}

export function PatientCohortComparison({
  patientId,
  patientName,
  dimensionId,
  dimensionName,
  dimensionColor,
  performanceTier,
}: PatientCohortComparisonProps) {
  const patientScores = useMemo(() => {
    return getPatientDimensionScores(patientId)
  }, [patientId])

  const cohortStats = useMemo(() => {
    return getCohortStatistics(dimensionId)
  }, [dimensionId])

  const currentDimensionScore = useMemo(() => {
    return patientScores.find((s) => s.dimensionId === dimensionId)
  }, [patientScores, dimensionId])

  const comparisonData = useMemo(() => {
    if (!currentDimensionScore) return []

    return [
      {
        metric: "Current Score",
        [patientName]: currentDimensionScore.currentScore,
        "Cohort Average": cohortStats.avgScore,
      },
    ]
  }, [currentDimensionScore, cohortStats, patientName])

  const getRiskColor = (riskLevel: RiskLevel) => {
    const colors = {
      green: "#10b981",
      yellow: "#f59e0b",
      orange: "#f97316",
      red: "#ef4444",
    }
    return colors[riskLevel]
  }

  const getRiskLabel = (riskLevel: RiskLevel) => {
    const labels = {
      green: "Low Risk",
      yellow: "Moderate",
      orange: "Elevated",
      red: "High Risk",
    }
    return labels[riskLevel]
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingDown className="h-5 w-5 text-green-600" />
      case "declining":
        return <TrendingUp className="h-5 w-5 text-red-600" />
      default:
        return <Minus className="h-5 w-5 text-gray-600" />
    }
  }

  const getTrendLabel = (trend: string) => {
    switch (trend) {
      case "improving":
        return "Improving"
      case "declining":
        return "Declining"
      default:
        return "Stable"
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving":
        return "text-green-600"
      case "declining":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const calculatePercentile = () => {
    if (!currentDimensionScore) return 50

    const score = currentDimensionScore.currentScore
    if (score <= 30) return Math.round(15 + (30 - score) * 0.5)
    if (score <= 60) return Math.round(40 + (60 - score) * 0.5)
    return Math.round(70 + (100 - score) * 0.3)
  }

  const percentile = calculatePercentile()

  const performanceDifference = currentDimensionScore
    ? Math.round((currentDimensionScore.currentScore - cohortStats.avgScore) * 10) / 10
    : 0

  if (!currentDimensionScore) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-gray-500">No cohort comparison data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-2" style={{ borderColor: dimensionColor }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Cohort Comparison: {dimensionName}</CardTitle>
              <CardDescription className="mt-2">
                Comparing {patientName}'s performance to cohort benchmarks
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="px-3 py-1 text-sm capitalize"
              style={{ borderColor: dimensionColor, color: dimensionColor }}
            >
              {performanceTier} Performing Cohort
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Patient Score</span>
                </div>
                <div className="text-3xl font-bold text-blue-700">{currentDimensionScore.currentScore.toFixed(1)}</div>
                <div className="mt-1">
                  <Badge style={{ backgroundColor: getRiskColor(currentDimensionScore.riskLevel) }} className="text-white text-xs">
                    {getRiskLabel(currentDimensionScore.riskLevel)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Cohort Average</span>
                </div>
                <div className="text-3xl font-bold text-gray-700">{cohortStats.avgScore.toFixed(1)}</div>
                <div className="mt-1 text-xs text-gray-600">
                  {cohortStats.totalPatients} patients
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Percentile</span>
                </div>
                <div className="text-3xl font-bold text-purple-700">{percentile}th</div>
                <div className="mt-1 text-xs text-gray-600">
                  vs cohort peers
                </div>
              </CardContent>
            </Card>

            <Card className={`${performanceDifference <= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {getTrendIcon(currentDimensionScore.trend)}
                  <span className="text-sm font-medium text-gray-700">Trend</span>
                </div>
                <div className={`text-2xl font-bold ${getTrendColor(currentDimensionScore.trend)}`}>
                  {getTrendLabel(currentDimensionScore.trend)}
                </div>
                <div className="mt-1 text-xs text-gray-600">
                  {currentDimensionScore.changePercent > 0 ? "+" : ""}
                  {currentDimensionScore.changePercent.toFixed(1)}% from baseline
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Performance Comparison</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey={patientName} fill="#3b82f6" />
                <Bar dataKey="Cohort Average" fill="#94a3b8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-3">Performance Analysis</h4>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">Score Difference vs Cohort</span>
                  <span className={`text-sm font-semibold ${performanceDifference <= 0 ? "text-green-600" : "text-red-600"}`}>
                    {performanceDifference > 0 ? "+" : ""}
                    {performanceDifference} points
                  </span>
                </div>
                {performanceDifference <= 0 ? (
                  <p className="text-xs text-gray-600">
                    Patient is performing {Math.abs(performanceDifference).toFixed(1)} points better than the cohort
                    average (lower scores are better).
                  </p>
                ) : (
                  <p className="text-xs text-gray-600">
                    Patient is performing {performanceDifference.toFixed(1)} points below the cohort average and may
                    benefit from additional interventions.
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">Change from Baseline</span>
                  <span className={`text-sm font-semibold ${currentDimensionScore.changePercent < 0 ? "text-green-600" : currentDimensionScore.changePercent > 0 ? "text-red-600" : "text-gray-600"}`}>
                    {currentDimensionScore.changePercent > 0 ? "+" : ""}
                    {currentDimensionScore.changePercent.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={Math.abs(currentDimensionScore.changePercent)}
                  className="h-2"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Baseline score: {currentDimensionScore.baselineScore.toFixed(1)}
                </p>
              </div>

              <div className="pt-3 border-t">
                <h5 className="text-sm font-semibold mb-2">Cohort Context</h5>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-gray-600">High Performing:</span>
                    <span className="font-semibold ml-1">{cohortStats.highPerformingCount} patients</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Moderate:</span>
                    <span className="font-semibold ml-1">{cohortStats.moderatePerformingCount} patients</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Low Performing:</span>
                    <span className="font-semibold ml-1">{cohortStats.lowPerformingCount} patients</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
