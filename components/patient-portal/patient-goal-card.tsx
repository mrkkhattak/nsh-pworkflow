"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { type DimensionGoal, healthDimensionsConfig } from "@/lib/nsh-assessment-mock"
import { Target, Calendar, TrendingDown, CheckCircle, AlertCircle, Activity } from "lucide-react"

interface PatientGoalCardProps {
  goal: DimensionGoal
}

export function PatientGoalCard({ goal }: PatientGoalCardProps) {
  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "achieved":
        return "bg-green-100 text-green-800 border-green-300"
      case "on-track":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "at-risk":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "achieved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "at-risk":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Target className="h-4 w-4 text-blue-600" />
    }
  }

  const daysLeft = getDaysUntilDeadline(goal.deadline)
  const isApproachingDeadline = daysLeft <= 14 && daysLeft > 0
  const isOverdue = daysLeft < 0
  const dimensionConfig = healthDimensionsConfig.find(c => c.id === goal.dimensionId)

  return (
    <Card className="shadow-sm border-gray-200 bg-white hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div
            className="w-1 h-full rounded-full flex-shrink-0 min-h-[120px]"
            style={{ backgroundColor: dimensionConfig?.color }}
          />
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {getStatusIcon(goal.status)}
                  <Badge className={`${getStatusColor(goal.status)} text-xs border`}>
                    {goal.status}
                  </Badge>
                  <span className="text-xs text-gray-600">{goal.dimensionName}</span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2 leading-tight">
                  {goal.description}
                </h3>
                <p className="text-sm text-gray-600">
                  Set by your provider on {new Date(goal.createdDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">Starting Point</p>
                <p className="text-2xl font-bold text-gray-900">{goal.baseline}</p>
                <p className="text-xs text-gray-500">Baseline</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">Where You Are</p>
                <p className="text-2xl font-bold text-blue-600">{goal.current}</p>
                <p className="text-xs text-gray-500">Current</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">Your Goal</p>
                <p className="text-2xl font-bold text-green-600">{goal.target}</p>
                <p className="text-xs text-gray-500">Target</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Progress to Goal</span>
                <span className="font-semibold text-gray-900">{goal.progress}% Complete</span>
              </div>
              <Progress value={goal.progress} className="h-2.5" />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
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
                  {isApproachingDeadline && " (Coming Soon!)"}
                  {isOverdue && " (Past Due)"}
                </span>
              </div>
              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {goal.timeframe}
              </span>
            </div>

            {goal.linkedInterventions.length > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5" />
                  Your Treatment Plan for This Goal:
                </p>
                <div className="flex flex-wrap gap-2">
                  {goal.linkedInterventions.map((intervention, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs font-normal">
                      {intervention}
                    </Badge>
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
