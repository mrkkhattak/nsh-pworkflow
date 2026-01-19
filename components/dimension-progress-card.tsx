"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronDown, ChevronUp, Target, Calendar, TrendingDown, TrendingUp, Activity, CheckCircle, AlertCircle } from "lucide-react"
import type { DimensionGoal } from "@/lib/nsh-assessment-mock"
import { getRiskColor, getRiskLabel, type RiskLevel } from "@/lib/nsh-assessment-mock"

interface DimensionProgressCardProps {
  dimensionId: string
  dimensionName: string
  score: number
  baseline?: number
  target?: number
  riskLevel: RiskLevel
  color: string
  goals: DimensionGoal[]
  interventions: string[]
  onNavigate?: (dimensionId: string) => void
}

export function DimensionProgressCard({
  dimensionId,
  dimensionName,
  score,
  baseline,
  target,
  riskLevel,
  color,
  goals,
  interventions,
  onNavigate,
}: DimensionProgressCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const activeGoals = goals.filter((g) => g.status !== "achieved" && g.status !== "cancelled")
  const progressPercent = baseline && target ? ((baseline - score) / (baseline - target)) * 100 : 0

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "achieved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "at-risk":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-blue-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "achieved":
        return "bg-green-100 text-green-800"
      case "on-track":
        return "bg-blue-100 text-blue-800"
      case "at-risk":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="border-gray-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: color }}
            />
            <div className="flex-1">
              <CardTitle className="text-base font-semibold text-gray-900">{dimensionName}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className={`${getRiskColor(riskLevel)} border-current/20 text-xs`}
                >
                  {getRiskLabel(riskLevel)}
                </Badge>
                {activeGoals.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {activeGoals.length} {activeGoals.length === 1 ? "Goal" : "Goals"}
                  </Badge>
                )}
                {interventions.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {interventions.length} {interventions.length === 1 ? "Intervention" : "Interventions"}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{score}</p>
              <p className="text-xs text-gray-600">Current</p>
            </div>
            {baseline && target && (
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-700">{target}</p>
                <p className="text-xs text-gray-600">Target</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-2"
            >
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-600" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {baseline && target && (
        <CardContent className="pt-0 pb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Progress to Target</span>
            <span className="text-xs font-medium text-gray-900">{Math.round(Math.max(0, Math.min(100, progressPercent)))}%</span>
          </div>
          <Progress
            value={Math.max(0, Math.min(100, progressPercent))}
            className="h-2"
          />
        </CardContent>
      )}

      {isExpanded && (
        <CardContent className="pt-0 space-y-4 border-t">
          {/* Goals Section */}
          {activeGoals.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-gray-700" />
                <h4 className="text-sm font-semibold text-gray-900">Active Goals</h4>
              </div>
              <div className="space-y-2">
                {activeGoals.map((goal) => {
                  const daysLeft = getDaysUntilDeadline(goal.deadline)
                  const isApproachingDeadline = daysLeft <= 7 && daysLeft > 0
                  const isOverdue = daysLeft < 0

                  return (
                    <div key={goal.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{goal.description}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                            <span>Baseline: {goal.baseline}</span>
                            <TrendingDown className="h-3 w-3" />
                            <span>Current: {goal.current}</span>
                            <TrendingDown className="h-3 w-3" />
                            <span>Target: {goal.target}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(goal.status)}
                          <Badge className={`${getStatusColor(goal.status)} text-xs`}>
                            {goal.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium text-gray-900">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-1.5" />
                        <div className="flex items-center gap-1 text-xs">
                          <Calendar className="h-3 w-3 text-gray-500" />
                          <span
                            className={
                              isOverdue
                                ? "text-red-600 font-medium"
                                : isApproachingDeadline
                                  ? "text-orange-600 font-medium"
                                  : "text-gray-600"
                            }
                          >
                            Due: {new Date(goal.deadline).toLocaleDateString()}
                            {isApproachingDeadline && " (Soon!)"}
                            {isOverdue && " (Overdue)"}
                          </span>
                        </div>
                      </div>
                      {goal.linkedInterventions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {goal.linkedInterventions.map((intervention, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {intervention}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Interventions Section */}
          {interventions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-gray-700" />
                <h4 className="text-sm font-semibold text-gray-900">Active Interventions</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {interventions.map((intervention, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {intervention}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {activeGoals.length === 0 && interventions.length === 0 && (
            <div className="text-center py-4 text-sm text-gray-500">
              No active goals or interventions for this dimension
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate?.(dimensionId)}
              className="text-xs"
            >
              View Details
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              Add Goal
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              Add Intervention
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
