"use client"

import { useRouter } from "next/navigation"
import { ScoreCard } from "./score-card"
import { RiskScaleBar } from "./risk-scale-bar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Assessment, Patient, HealthDimension, ActionItem } from "@/lib/nsh-assessment-mock"
import { getRiskColor, getRiskLabel, getRiskBgColor, getRiskBorderColor } from "@/lib/nsh-assessment-mock"
import { ArrowLeft, Stethoscope, Users, Building2, TrendingUp, TrendingDown } from "lucide-react"
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
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Score Trend</CardTitle>
              <CardDescription>Historical progress for {dimension.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" opacity={0.7} />
                      <XAxis
                        dataKey="date"
                        stroke="#6b7280"
                        fontSize={12}
                        tickMargin={8}
                      />
                      <YAxis stroke="#6b7280" fontSize={12} tickMargin={8} domain={[0, 100]} />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        name={dimension.name}
                        stroke={dimension.color}
                        strokeWidth={3}
                        dot={{
                          fill: dimension.color,
                          strokeWidth: 2,
                          r: 5,
                          stroke: "white",
                        }}
                        activeDot={{
                          r: 7,
                          stroke: dimension.color,
                          strokeWidth: 2,
                          fill: "white",
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-gray-900">Improving Trend</span>
                </div>
                <p className="text-sm text-gray-600">
                  Score has decreased from 45 to 32 over the past 3 months, indicating positive progress.
                  Lower scores indicate better health outcomes in this dimension.
                </p>
              </div>
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
