"use client"

import { useRouter } from "next/navigation"
import { ScoreCard } from "./score-card"
import { RiskScaleBar } from "./risk-scale-bar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import type { Assessment, Patient, HealthDimension, ActionItem, Goal, Intervention } from "@/lib/nsh-assessment-mock"
import { getRiskColor, getRiskLabel, getRiskBgColor, getRiskBorderColor, getGoalsByDimension, getInterventionsByDimension, getInterventionById } from "@/lib/nsh-assessment-mock"
import { ArrowLeft, Stethoscope, Users, Building2, TrendingUp, TrendingDown, Target, Calendar, CheckCircle, AlertTriangle, Pill, Dumbbell, Brain, Plus, StopCircle } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

type Props = {
  patient: Patient
  assessment: Assessment
  dimension: HealthDimension
}

const mockTrendData = [
  { date: "Oct 1", score: 45 },
  { date: "Nov 1", score: 40 },
  { date: "Dec 1", score: 35 },
  { date: "Jan 1", score: 32 },
]

export function DimensionDetail({ patient, assessment, dimension }: Props) {
  const router = useRouter()

  const dimensionActionItems = assessment.actionItems.filter((item) => {
    if (item.type === "physician" || item.type === "patient" || item.type === "community") {
      return item.dimensionId === dimension.id
    }
    if (item.type === "system") {
      return item.dimensionIds.includes(dimension.id)
    }
    return false
  })

  const physicianActions = dimensionActionItems.filter((item) => item.type === "physician")
  const patientActions = dimensionActionItems.filter((item) => item.type === "patient")
  const communityActions = dimensionActionItems.filter((item) => item.type === "community")
  const systemActions = dimensionActionItems.filter((item) => item.type === "system")

  const opportunities = {
    strengths: dimension.subcategories.filter((sub) => sub.riskLevel === "green"),
    moderate: dimension.subcategories.filter((sub) => sub.riskLevel === "yellow"),
    critical: dimension.subcategories.filter(
      (sub) => sub.riskLevel === "orange" || sub.riskLevel === "red"
    ),
  }

  const questionnaireResponses = assessment.questionnaireResponses.filter(
    (response) => response.dimensionId === dimension.id
  )

  const chartConfig = {
    score: {
      label: dimension.name,
      color: dimension.color,
    },
  }

  const dimensionGoals = getGoalsByDimension(assessment, dimension.id)
  const dimensionInterventions = getInterventionsByDimension(assessment, dimension.id)
  const activeGoals = dimensionGoals.filter((g) => g.status !== "achieved" && g.status !== "cancelled")
  const completedGoals = dimensionGoals.filter((g) => g.status === "achieved")
  const activeInterventions = dimensionInterventions.filter((i) => i.status === "active")
  const stoppedInterventions = dimensionInterventions.filter((i) => i.status === "stopped")

  const getStatusColor = (status: Goal["status"]) => {
    switch (status) {
      case "achieved":
        return "bg-green-100 text-green-800"
      case "on-track":
        return "bg-blue-100 text-blue-800"
      case "at-risk":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getInterventionTypeIcon = (type: Intervention["type"]) => {
    switch (type) {
      case "Medication":
        return Pill
      case "Lifestyle":
        return Dumbbell
      case "Therapy":
        return Brain
      default:
        return Plus
    }
  }

  const getInterventionTypeColor = (type: Intervention["type"]) => {
    switch (type) {
      case "Medication":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "Lifestyle":
        return "text-green-600 bg-green-50 border-green-200"
      case "Therapy":
        return "text-purple-600 bg-purple-50 border-purple-200"
      default:
        return "text-orange-600 bg-orange-50 border-orange-200"
    }
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assessment
        </Button>
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-semibold text-gray-900 text-balance">{dimension.name}</h1>
        <p className="text-gray-600">
          {patient.name} • {new Date(assessment.date).toLocaleDateString()}
        </p>
      </div>

      <ScoreCard
        title={dimension.name}
        score={dimension.score}
        statusText={getRiskLabel(dimension.riskLevel)}
        statusColorClass={getRiskColor(dimension.riskLevel)}
        interpretation={dimension.interpretation}
        riskLevel={dimension.riskLevel}
      />

      <Tabs defaultValue="subcategories" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="subcategories" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Subcategories
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Areas of Opportunity
          </TabsTrigger>
          <TabsTrigger value="actions" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Action Items
          </TabsTrigger>
          <TabsTrigger value="progress" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Progress
          </TabsTrigger>
          <TabsTrigger value="questionnaire" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Questionnaire
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subcategories" className="space-y-6">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Subcategories</CardTitle>
              <CardDescription>Detailed breakdown of {dimension.name} components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dimension.subcategories.map((subcategory) => (
                <Card
                  key={subcategory.id}
                  className={`border ${getRiskBorderColor(subcategory.riskLevel)} ${getRiskBgColor(subcategory.riskLevel)}`}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">{subcategory.name}</h4>
                      <Badge
                        variant="outline"
                        className={`${getRiskColor(subcategory.riskLevel)} border-current/20`}
                      >
                        {getRiskLabel(subcategory.riskLevel)}
                      </Badge>
                    </div>

                    <RiskScaleBar
                      score={subcategory.score}
                      riskLevel={subcategory.riskLevel}
                      ariaLabel={`${subcategory.name} score is ${subcategory.score} out of 100`}
                    />

                    <div className="text-sm text-gray-700">
                      <span className="font-medium">Score: </span>
                      <span className="text-xl font-bold">{subcategory.score}</span>
                      <span className="text-gray-500"> / 100</span>
                    </div>

                    <div className="text-sm text-gray-700">
                      <span className="font-medium">Interpretation:</span>
                      <p className="mt-1">{subcategory.interpretation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Areas of Opportunity</CardTitle>
              <CardDescription>Categorized by risk level and priority for intervention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {opportunities.strengths.length > 0 && (
                <div>
                  <h3 className="font-semibold text-emerald-700 mb-3">Areas of Strength (Low Risk)</h3>
                  <div className="space-y-2">
                    {opportunities.strengths.map((opp) => (
                      <div key={opp.id} className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <div className="mb-1">
                          <span className="font-medium text-sm text-gray-900">{opp.name}</span>
                        </div>
                        <p className="text-xs text-gray-600">{opp.interpretation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {opportunities.moderate.length > 0 && (
                <div>
                  <h3 className="font-semibold text-yellow-700 mb-3">Areas of Moderate Opportunity</h3>
                  <div className="space-y-2">
                    {opportunities.moderate.map((opp) => (
                      <div key={opp.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="mb-1">
                          <span className="font-medium text-sm text-gray-900">{opp.name}</span>
                        </div>
                        <p className="text-xs text-gray-600">{opp.interpretation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {opportunities.critical.length > 0 && (
                <div>
                  <h3 className="font-semibold text-orange-700 mb-3">Areas of Critical Opportunity</h3>
                  <div className="space-y-2">
                    {opportunities.critical.map((opp) => (
                      <div key={opp.id} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="mb-1">
                          <span className="font-medium text-sm text-gray-900">{opp.name}</span>
                        </div>
                        <p className="text-xs text-gray-600">{opp.interpretation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {opportunities.strengths.length === 0 &&
                opportunities.moderate.length === 0 &&
                opportunities.critical.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No specific opportunities identified for this dimension.
                  </p>
                )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Action Items</CardTitle>
              <CardDescription>Organized by stakeholder level</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {physicianActions.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" />
                    Physician-Level Actions
                  </h3>
                  <div className="space-y-2">
                    {physicianActions.map((item) => {
                      const physItem = item as Extract<ActionItem, { type: "physician" }>
                      return (
                        <div key={item.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <span className="font-medium text-sm text-gray-900">
                                {physItem.providerName} - {physItem.designation}
                              </span>
                              <p className="text-xs text-gray-700 mt-1">{physItem.action}</p>
                            </div>
                            <Badge
                              variant={
                                item.status === "completed"
                                  ? "default"
                                  : item.status === "in_progress"
                                    ? "secondary"
                                    : "outline"
                              }
                              className="ml-2 shrink-0"
                            >
                              {item.status.replace("_", " ")}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {patientActions.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Patient-Level Actions
                  </h3>
                  <div className="space-y-2">
                    {patientActions.map((item) => {
                      const patItem = item as Extract<ActionItem, { type: "patient" }>
                      return (
                        <div key={item.id} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <span className="font-medium text-sm text-gray-900">
                                {patItem.actionName}: {patItem.dimensionName}
                              </span>
                              <p className="text-xs text-gray-700 mt-1">{patItem.description}</p>
                            </div>
                            <Badge
                              variant={
                                item.status === "completed"
                                  ? "default"
                                  : item.status === "in_progress"
                                    ? "secondary"
                                    : "outline"
                              }
                              className="ml-2 shrink-0"
                            >
                              {item.status.replace("_", " ")}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {communityActions.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Community-Level Actions
                  </h3>
                  <div className="space-y-2">
                    {communityActions.map((item) => {
                      const commItem = item as Extract<ActionItem, { type: "community" }>
                      return (
                        <div key={item.id} className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <span className="font-medium text-sm text-gray-900">
                                {commItem.name}: {commItem.category}
                              </span>
                              <p className="text-xs text-gray-600 mt-1">
                                <span className="font-medium">Eligibility:</span> {commItem.eligibility}
                              </p>
                              <p className="text-xs text-gray-600">
                                <span className="font-medium">Hours:</span> {commItem.hoursOfOperation}
                              </p>
                            </div>
                            <Badge
                              variant={
                                item.status === "completed"
                                  ? "default"
                                  : item.status === "in_progress"
                                    ? "secondary"
                                    : "outline"
                              }
                              className="ml-2 shrink-0"
                            >
                              {item.status.replace("_", " ")}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {systemActions.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    System-Level Actions
                  </h3>
                  <div className="space-y-2">
                    {systemActions.map((item) => {
                      const sysItem = item as Extract<ActionItem, { type: "system" }>
                      return (
                        <div key={item.id} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <span className="font-medium text-sm text-gray-900">
                                {sysItem.name}: {sysItem.category}
                              </span>
                              <p className="text-xs text-gray-700 mt-1">{sysItem.description}</p>
                            </div>
                            <Badge
                              variant={
                                item.status === "completed"
                                  ? "default"
                                  : item.status === "in_progress"
                                    ? "secondary"
                                    : "outline"
                              }
                              className="ml-2 shrink-0"
                            >
                              {item.status.replace("_", " ")}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {dimensionActionItems.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No action items for this dimension.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          {/* Goals Section */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Treatment Goals
                  </CardTitle>
                  <CardDescription>Active and completed goals for {dimension.name}</CardDescription>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">{activeGoals.length}</div>
                    <div className="text-xs text-gray-600">Active</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">{completedGoals.length}</div>
                    <div className="text-xs text-gray-600">Achieved</div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {dimensionGoals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No goals have been set for this dimension yet.</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Goal
                  </Button>
                </div>
              ) : (
                <>
                  {activeGoals.map((goal) => {
                    const daysLeft = getDaysUntilDeadline(goal.deadline)
                    const isApproachingDeadline = daysLeft <= 7 && daysLeft > 0
                    const isOverdue = daysLeft < 0
                    const linkedInterventions = goal.linkedInterventionIds
                      .map((id) => getInterventionById(assessment, id))
                      .filter(Boolean) as Intervention[]

                    return (
                      <Card
                        key={goal.id}
                        className={`border-l-4 ${
                          goal.status === "on-track"
                            ? "border-l-blue-500"
                            : goal.status === "at-risk"
                              ? "border-l-red-500"
                              : "border-l-green-500"
                        }`}
                      >
                        <CardContent className="p-5">
                          <div className="space-y-4">
                            {/* Goal Header */}
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 text-base">{goal.description}</h4>
                                <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                                  <Badge variant="outline" className="text-xs">
                                    {goal.timeframe}
                                  </Badge>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Due: {new Date(goal.deadline).toLocaleDateString()}
                                  </span>
                                  {isApproachingDeadline && (
                                    <Badge variant="outline" className="text-orange-600 border-orange-300">
                                      {daysLeft} days left
                                    </Badge>
                                  )}
                                  {isOverdue && (
                                    <Badge variant="destructive" className="text-xs">
                                      Overdue
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Badge className={getStatusColor(goal.status)}>{goal.status}</Badge>
                            </div>

                            {/* Goal Progress */}
                            <div className="grid grid-cols-3 gap-4 py-3 border-y">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{goal.baseline}</div>
                                <div className="text-xs text-gray-600">Baseline</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{goal.current}</div>
                                <div className="text-xs text-gray-600">Current</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{goal.target}</div>
                                <div className="text-xs text-gray-600">Target</div>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-semibold text-gray-900">{goal.progress}%</span>
                              </div>
                              <Progress value={goal.progress} className="h-2" />
                            </div>

                            {/* Linked Interventions */}
                            {linkedInterventions.length > 0 && (
                              <div className="space-y-2">
                                <div className="text-xs font-medium text-gray-700">Linked Interventions:</div>
                                <div className="flex flex-wrap gap-2">
                                  {linkedInterventions.map((intervention) => {
                                    const Icon = getInterventionTypeIcon(intervention.type)
                                    return (
                                      <Badge
                                        key={intervention.id}
                                        variant="outline"
                                        className="text-xs border px-2 py-1"
                                      >
                                        <Icon className="h-3 w-3 mr-1" />
                                        {intervention.name}
                                      </Badge>
                                    )
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Notes */}
                            {goal.notes && (
                              <div className="text-sm bg-gray-50 p-3 rounded border border-gray-200">
                                <span className="font-medium text-gray-700">Notes:</span> {goal.notes}
                              </div>
                            )}

                            {/* Warnings */}
                            {goal.current <= goal.target && goal.status !== "achieved" && (
                              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <span className="text-sm text-green-800 font-medium">
                                  Target achieved! Consider marking as complete.
                                </span>
                              </div>
                            )}

                            {isOverdue && (
                              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                                <span className="text-sm text-red-800 font-medium">
                                  Goal is overdue. Consider extending deadline or marking as cancelled.
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}

                  {/* Completed Goals */}
                  {completedGoals.length > 0 && (
                    <div className="space-y-3 pt-4 border-t">
                      <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Completed Goals ({completedGoals.length})
                      </h4>
                      {completedGoals.map((goal) => (
                        <Card key={goal.id} className="border-l-4 border-l-green-500 bg-green-50/30">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-medium text-gray-900">{goal.description}</h5>
                                <p className="text-sm text-gray-600 mt-1">
                                  {goal.baseline} → {goal.target} • Completed:{" "}
                                  {goal.completedDate
                                    ? new Date(goal.completedDate).toLocaleDateString()
                                    : "N/A"}
                                </p>
                              </div>
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Achieved
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Interventions Section */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Interventions</CardTitle>
                  <CardDescription>Treatment interventions for {dimension.name}</CardDescription>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">{activeInterventions.length}</div>
                    <div className="text-xs text-gray-600">Active</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-600">{stoppedInterventions.length}</div>
                    <div className="text-xs text-gray-600">Stopped</div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {dimensionInterventions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Pill className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No interventions have been recorded for this dimension yet.</p>
                </div>
              ) : (
                <>
                  {/* Active Interventions */}
                  {activeInterventions.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-700">Active Interventions</h4>
                      {activeInterventions.map((intervention) => {
                        const Icon = getInterventionTypeIcon(intervention.type)
                        const colorClass = getInterventionTypeColor(intervention.type)

                        return (
                          <Card key={intervention.id} className={`border ${colorClass}`}>
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded ${colorClass}`}>
                                  <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h5 className="font-semibold text-gray-900">{intervention.name}</h5>
                                      <p className="text-sm text-gray-600 mt-1">{intervention.details}</p>
                                    </div>
                                    <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                                      Active
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-gray-600">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      Started: {new Date(intervention.date).toLocaleDateString()}
                                    </span>
                                    <span>By: {intervention.createdBy}</span>
                                  </div>
                                  {intervention.notes && (
                                    <div className="text-sm bg-white/50 p-2 rounded border border-gray-200">
                                      <span className="font-medium">Notes:</span> {intervention.notes}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}

                  {/* Stopped Interventions */}
                  {stoppedInterventions.length > 0 && (
                    <div className="space-y-3 pt-4 border-t">
                      <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <StopCircle className="h-4 w-4 text-gray-600" />
                        Stopped Interventions ({stoppedInterventions.length})
                      </h4>
                      {stoppedInterventions.map((intervention) => {
                        const Icon = getInterventionTypeIcon(intervention.type)

                        return (
                          <Card
                            key={intervention.id}
                            className="border-gray-300 bg-gray-50/50 opacity-75"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="p-2 rounded bg-gray-200 text-gray-600">
                                  <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h5 className="font-semibold text-gray-700 line-through">
                                        {intervention.name}
                                      </h5>
                                      <p className="text-sm text-gray-600">{intervention.details}</p>
                                    </div>
                                    <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">
                                      <StopCircle className="h-3 w-3 mr-1" />
                                      Stopped
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-gray-600">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(intervention.date).toLocaleDateString()} -{" "}
                                      {intervention.stoppedDate
                                        ? new Date(intervention.stoppedDate).toLocaleDateString()
                                        : "N/A"}
                                    </span>
                                  </div>
                                  {intervention.stoppedReason && (
                                    <div className="text-sm bg-red-50 p-2 rounded border border-red-200">
                                      <span className="font-medium text-red-800">Reason:</span>{" "}
                                      {intervention.stoppedReason}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questionnaire" className="space-y-6">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Questionnaire Responses</CardTitle>
              <CardDescription>Patient responses related to {dimension.name}</CardDescription>
            </CardHeader>
            <CardContent>
              {questionnaireResponses.length > 0 ? (
                <div className="space-y-3">
                  {questionnaireResponses.map((response) => (
                    <div key={response.questionId} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-900 mb-1">{response.question}</p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Response:</span> {response.responseText}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No questionnaire responses for this dimension.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
