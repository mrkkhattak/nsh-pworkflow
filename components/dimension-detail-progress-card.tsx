"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RiskScaleBar } from "@/components/assessment/risk-scale-bar"
import { MCIDDisplay } from "@/components/assessment/mcid-display"
import {
  ChevronDown,
  ChevronUp,
  Target,
  Calendar,
  TrendingDown,
  Activity,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  Users,
  Building2,
  TrendingUp as TrendingUpIcon,
  ExternalLink,
} from "lucide-react"
import type {
  HealthDimension,
  DimensionGoal,
  ActionItem,
  RiskLevel,
} from "@/lib/nsh-assessment-mock"
import {
  getRiskColor,
  getRiskLabel,
  getRiskBgColor,
  getRiskBorderColor,
} from "@/lib/nsh-assessment-mock"

interface DimensionDetailProgressCardProps {
  dimension: HealthDimension
  patientId: number
  assessmentDate: string
  score: number
  baseline?: number
  target?: number
  riskLevel: RiskLevel
  color: string
  goals: DimensionGoal[]
  interventions: string[]
  actionItems?: ActionItem[]
  questionnaireResponses?: Array<{
    questionId: string
    question: string
    dimensionId: string
    responseValue: number
    responseText: string
    timestamp: string
  }>
  onNavigate?: (dimensionId: string) => void
}

export function DimensionDetailProgressCard({
  dimension,
  patientId,
  assessmentDate,
  score,
  baseline,
  target,
  riskLevel,
  color,
  goals,
  interventions,
  actionItems = [],
  questionnaireResponses = [],
  onNavigate,
}: DimensionDetailProgressCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const activeGoals = goals.filter((g) => g.status !== "achieved" && g.status !== "cancelled")
  const progressPercent = baseline && target ? ((baseline - score) / (baseline - target)) * 100 : 0

  const dimensionActionItems = actionItems.filter((item) => {
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

  const dimensionQuestionnaireResponses = questionnaireResponses.filter(
    (response) => response.dimensionId === dimension.id
  )

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
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
            <div className="flex-1">
              <CardTitle className="text-base font-semibold text-gray-900">{dimension.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={`${getRiskColor(riskLevel)} border-current/20 text-xs`}>
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
            <span className="text-xs font-medium text-gray-900">
              {Math.round(Math.max(0, Math.min(100, progressPercent)))}%
            </span>
          </div>
          <Progress value={Math.max(0, Math.min(100, progressPercent))} className="h-2" />
        </CardContent>
      )}

      {isExpanded && (
        <CardContent className="pt-4 space-y-6 border-t">
          {/* Dimension Overview Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Dimension Overview</h3>
              <Link href={`/assessments/${patientId}/${encodeURIComponent(assessmentDate)}/${dimension.id}`}>
                <Button variant="outline" size="sm" className="text-xs">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Full Details
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              <RiskScaleBar
                score={score}
                riskLevel={riskLevel}
                ariaLabel={`${dimension.name} score is ${score} out of 100`}
              />

              {dimension.mcid && (
                <div className="pt-2 border-t border-gray-100">
                  <MCIDDisplay mcid={dimension.mcid} size="sm" />
                </div>
              )}

              <div className={`rounded-md ${getRiskBgColor(riskLevel)} p-3 text-sm text-gray-700`}>
                <div className="font-medium mb-1">Interpretation</div>
                <p className="text-pretty">{dimension.interpretation}</p>
              </div>
            </div>
          </div>

          {/* Tabs for detailed views */}
          <Tabs defaultValue="subcategories" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger value="subcategories" className="data-[state=active]:bg-white text-xs">
                Subcategories
              </TabsTrigger>
              <TabsTrigger value="opportunities" className="data-[state=active]:bg-white text-xs">
                Opportunities
              </TabsTrigger>
              <TabsTrigger value="actions" className="data-[state=active]:bg-white text-xs">
                Actions
              </TabsTrigger>
              <TabsTrigger value="responses" className="data-[state=active]:bg-white text-xs">
                Responses
              </TabsTrigger>
            </TabsList>

            <TabsContent value="subcategories" className="space-y-3 mt-4">
              {dimension.subcategories.map((subcategory) => (
                <Card
                  key={subcategory.id}
                  className={`border ${getRiskBorderColor(subcategory.riskLevel)} ${getRiskBgColor(subcategory.riskLevel)}`}
                >
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-gray-900">{subcategory.name}</h4>
                      <Badge
                        variant="outline"
                        className={`${getRiskColor(subcategory.riskLevel)} border-current/20 text-xs`}
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
                      <span className="text-lg font-bold">{subcategory.score}</span>
                      <span className="text-gray-500"> / 100</span>
                    </div>

                    <div className="text-xs text-gray-700">
                      <span className="font-medium">Interpretation:</span>
                      <p className="mt-1">{subcategory.interpretation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="opportunities" className="space-y-4 mt-4">
              {opportunities.strengths.length > 0 && (
                <div>
                  <h4 className="font-semibold text-emerald-700 text-sm mb-2">
                    Areas of Strength (Low Risk)
                  </h4>
                  <div className="space-y-2">
                    {opportunities.strengths.map((opp) => (
                      <div key={opp.id} className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <div className="mb-1">
                          <span className="font-medium text-xs text-gray-900">{opp.name}</span>
                        </div>
                        <p className="text-xs text-gray-600">{opp.interpretation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {opportunities.moderate.length > 0 && (
                <div>
                  <h4 className="font-semibold text-yellow-700 text-sm mb-2">
                    Areas of Moderate Opportunity
                  </h4>
                  <div className="space-y-2">
                    {opportunities.moderate.map((opp) => (
                      <div key={opp.id} className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="mb-1">
                          <span className="font-medium text-xs text-gray-900">{opp.name}</span>
                        </div>
                        <p className="text-xs text-gray-600">{opp.interpretation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {opportunities.critical.length > 0 && (
                <div>
                  <h4 className="font-semibold text-orange-700 text-sm mb-2">
                    Areas of Critical Opportunity
                  </h4>
                  <div className="space-y-2">
                    {opportunities.critical.map((opp) => (
                      <div key={opp.id} className="p-2 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="mb-1">
                          <span className="font-medium text-xs text-gray-900">{opp.name}</span>
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
                  <p className="text-xs text-gray-500 text-center py-4">
                    No specific opportunities identified for this dimension.
                  </p>
                )}
            </TabsContent>

            <TabsContent value="actions" className="space-y-4 mt-4">
              {physicianActions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-2">
                    <Stethoscope className="h-3 w-3" />
                    Physician-Level Actions
                  </h4>
                  <div className="space-y-2">
                    {physicianActions.map((item) => {
                      const physItem = item as Extract<ActionItem, { type: "physician" }>
                      return (
                        <div key={item.id} className="p-2 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <span className="font-medium text-xs text-gray-900">
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
                              className="ml-2 shrink-0 text-xs"
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
                  <h4 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    Patient-Level Actions
                  </h4>
                  <div className="space-y-2">
                    {patientActions.map((item) => {
                      const patItem = item as Extract<ActionItem, { type: "patient" }>
                      return (
                        <div key={item.id} className="p-2 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <span className="font-medium text-xs text-gray-900">{patItem.actionName}</span>
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
                              className="ml-2 shrink-0 text-xs"
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
                  <h4 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-2">
                    <Building2 className="h-3 w-3" />
                    Community-Level Actions
                  </h4>
                  <div className="space-y-2">
                    {communityActions.map((item) => {
                      const commItem = item as Extract<ActionItem, { type: "community" }>
                      return (
                        <div key={item.id} className="p-2 bg-purple-50 border border-purple-200 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <span className="font-medium text-xs text-gray-900">
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
                              className="ml-2 shrink-0 text-xs"
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
                  <h4 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-2">
                    <TrendingUpIcon className="h-3 w-3" />
                    System-Level Actions
                  </h4>
                  <div className="space-y-2">
                    {systemActions.map((item) => {
                      const sysItem = item as Extract<ActionItem, { type: "system" }>
                      return (
                        <div key={item.id} className="p-2 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <span className="font-medium text-xs text-gray-900">
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
                              className="ml-2 shrink-0 text-xs"
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
                <p className="text-xs text-gray-500 text-center py-4">
                  No action items for this dimension.
                </p>
              )}
            </TabsContent>

            <TabsContent value="responses" className="mt-4">
              {dimensionQuestionnaireResponses.length > 0 ? (
                <div className="space-y-2">
                  {dimensionQuestionnaireResponses.map((response) => (
                    <div key={response.questionId} className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs font-medium text-gray-900 mb-1">{response.question}</p>
                      <p className="text-xs text-gray-700">
                        <span className="font-medium">Response:</span> {response.responseText}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 text-center py-4">
                  No questionnaire responses for this dimension.
                </p>
              )}
            </TabsContent>
          </Tabs>

          {/* Goals Section */}
          {activeGoals.length > 0 && (
            <div className="space-y-3 pt-4 border-t">
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
            <div className="space-y-3 pt-4 border-t">
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
        </CardContent>
      )}
    </Card>
  )
}
