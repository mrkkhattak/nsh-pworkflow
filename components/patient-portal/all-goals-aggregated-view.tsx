"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  mockDimensionGoals,
  healthDimensionsConfig,
  type DimensionGoal
} from "@/lib/nsh-assessment-mock"
import { Target, Calendar, TrendingDown, CheckCircle, AlertCircle, Activity, ArrowLeft, Filter, ChevronDown, ChevronUp } from "lucide-react"
import { PatientInterventionCard } from "@/components/patient-portal/patient-intervention-card"
import { getInterventionDetailsForGoal } from "@/lib/intervention-data"

interface AllGoalsAggregatedViewProps {
  patientId: number
}

export function AllGoalsAggregatedView({ patientId }: AllGoalsAggregatedViewProps) {
  const [filterDimension, setFilterDimension] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("deadline")
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set())

  const toggleGoalExpansion = (goalId: string) => {
    setExpandedGoals(prev => {
      const newSet = new Set(prev)
      if (newSet.has(goalId)) {
        newSet.delete(goalId)
      } else {
        newSet.add(goalId)
      }
      return newSet
    })
  }

  let filteredGoals = [...mockDimensionGoals]

  if (filterDimension !== "all") {
    filteredGoals = filteredGoals.filter(goal => goal.dimensionId === filterDimension)
  }

  if (filterStatus !== "all") {
    filteredGoals = filteredGoals.filter(goal => goal.status === filterStatus)
  }

  filteredGoals.sort((a, b) => {
    if (sortBy === "deadline") {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    } else if (sortBy === "progress") {
      return b.progress - a.progress
    } else if (sortBy === "dimension") {
      return a.dimensionName.localeCompare(b.dimensionName)
    }
    return 0
  })

  const activeGoals = filteredGoals.filter(g => g.status !== "achieved" && g.status !== "cancelled")
  const achievedGoals = filteredGoals.filter(g => g.status === "achieved")

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

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const GoalCard = ({ goal }: { goal: DimensionGoal }) => {
    const daysLeft = getDaysUntilDeadline(goal.deadline)
    const isApproachingDeadline = daysLeft <= 14 && daysLeft > 0
    const isOverdue = daysLeft < 0
    const dimensionConfig = healthDimensionsConfig.find(c => c.id === goal.dimensionId)
    const isExpanded = expandedGoals.has(goal.id)
    const interventionDetails = getInterventionDetailsForGoal(goal.linkedInterventions, goal.description)

    return (
      <Card className="shadow-sm border-gray-200 bg-white hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div
              className="w-1 h-full rounded-full flex-shrink-0"
              style={{ backgroundColor: dimensionConfig?.color }}
            />
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(goal.status)}
                    <Badge className={`${getStatusColor(goal.status)} text-xs border`}>
                      {goal.status}
                    </Badge>
                    <span className="text-xs text-gray-600">{goal.dimensionName}</span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{goal.description}</h3>
                  <p className="text-sm text-gray-600">
                    Your healthcare provider created this goal on {new Date(goal.createdDate).toLocaleDateString()}
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
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold text-gray-900">{goal.progress}% Complete</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
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
                    {isApproachingDeadline && " (Soon!)"}
                    {isOverdue && " (Overdue)"}
                  </span>
                </div>
                <span className="text-xs text-gray-600">{goal.timeframe}</span>
              </div>

              {goal.linkedInterventions.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => toggleGoalExpansion(goal.id)}
                    className="w-full text-left group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-gray-700 flex items-center gap-2">
                        <Activity className="h-3 w-3" />
                        Your Treatment Plan for This Goal ({goal.linkedInterventions.length})
                      </p>
                      <div className="flex items-center gap-2 text-xs text-blue-600 font-medium group-hover:text-blue-700">
                        {isExpanded ? "Hide Details" : "Show Details"}
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </button>

                  {!isExpanded && (
                    <div className="flex flex-wrap gap-2">
                      {goal.linkedInterventions.map((intervention, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {intervention}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {isExpanded && interventionDetails.length > 0 && (
                    <div className="mt-4 space-y-4">
                      {interventionDetails.map((intervention, idx) => (
                        <PatientInterventionCard
                          key={idx}
                          name={intervention.name}
                          type={intervention.type}
                          dimensionIds={intervention.dimensionIds}
                          linkedGoals={intervention.linkedGoals}
                          startDate={intervention.startDate}
                          status={intervention.status}
                          details={intervention.details}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

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
          <h1 className="text-3xl font-semibold text-gray-900">My Health Goals</h1>
          <p className="text-gray-600 mt-1">All goals set by your healthcare provider to help you improve your health</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Goals</p>
                <p className="text-2xl font-bold text-gray-900">{activeGoals.length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Achieved Goals</p>
                <p className="text-2xl font-bold text-gray-900">{achievedGoals.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeGoals.length > 0
                    ? Math.round(activeGoals.reduce((sum, g) => sum + g.progress, 0) / activeGoals.length)
                    : 0}%
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-gray-200 bg-white">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Sort Goals
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="on-track">On Track</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                  <SelectItem value="achieved">Achieved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                  <SelectItem value="dimension">Health Area</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredGoals.length > 0 ? (
          filteredGoals.map(goal => <GoalCard key={goal.id} goal={goal} />)
        ) : (
          <Card className="shadow-sm border-gray-200 bg-white">
            <CardContent className="p-12 text-center">
              <Target className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No goals found</h3>
              <p className="text-gray-600">Try adjusting your filters or check back later.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="shadow-sm border-gray-200 bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-2">Understanding Your Scores</h3>
          <p className="text-sm text-gray-700 mb-2">
            Lower scores mean better health in most areas. Your provider sets goals to help you move from your baseline (starting point) toward your target score.
          </p>
          <p className="text-sm text-gray-700">
            The treatments and activities in your care plan are designed to help you reach these targets. If you have questions about your goals, talk to your healthcare provider during your next visit.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
