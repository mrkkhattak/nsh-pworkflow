"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { InterventionTimeline } from "@/components/intervention-timeline"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { GoalTemplatesSystem } from "@/components/goal-templates-system"
import Link from "next/link"
import {
  Calendar,
  FileText,
  CheckCircle,
  Target,
  Activity,
  Heart,
} from "lucide-react"

// Mock PROM data for demonstration
const mockPromDataByPatient = {
  1: {
    patient: {
      id: 1,
      name: "Sarah Johnson",
      age: 45,
      condition: "Major Depression",
      enrollmentDate: "2024-10-01",
      riskLevel: "moderate",
      lastAssessment: "2025-01-01",
    },
    assessments: [
      {
        date: "2024-10-01",
        burden: 75,
        medical: 85,
        utilization: 60,
        sdoh: 50,
        diet: 90,
        physical: 70,
        sleep: 80,
        pain: 30,
        satisfaction: 95,
        mental: 80,
        cost: 40,
        engagement: 85,
        interventions: ["Started Sertraline 50mg"],
      },
      {
        date: "2024-11-01",
        burden: 70,
        medical: 90,
        utilization: 65,
        sdoh: 45,
        diet: 85,
        physical: 75,
        sleep: 75,
        pain: 25,
        satisfaction: 90,
        mental: 75,
        cost: 45,
        engagement: 90,
        interventions: ["Increased Sertraline to 75mg", "Added CBT sessions"],
      },
      {
        date: "2024-12-01",
        burden: 65,
        medical: 95,
        utilization: 70,
        sdoh: 40,
        diet: 80,
        physical: 80,
        sleep: 70,
        pain: 20,
        satisfaction: 85,
        mental: 85,
        cost: 50,
        engagement: 95,
        interventions: ["Continued current regimen"],
      },
      {
        date: "2025-01-01",
        burden: 60,
        medical: 100,
        utilization: 75,
        sdoh: 35,
        diet: 75,
        physical: 85,
        sleep: 65,
        pain: 15,
        satisfaction: 80,
        mental: 95,
        cost: 55,
        engagement: 100,
        interventions: ["Added exercise program"],
      },
    ],
    goals: {
      burden: { baseline: 75, target: 25, current: 60, horizon: "6 months" },
      medical: { baseline: 85, target: 95, current: 95, horizon: "6 months" },
      utilization: { baseline: 60, target: 85, current: 75, horizon: "6 months" },
      sdoh: { baseline: 50, target: 25, current: 35, horizon: "6 months" },
      diet: { baseline: 90, target: 85, current: 80, horizon: "6 months" },
      physical: { baseline: 70, target: 85, current: 85, horizon: "6 months" },
      sleep: { baseline: 80, target: 85, current: 65, horizon: "6 months" },
      pain: { baseline: 30, target: 15, current: 15, horizon: "3 months" },
      satisfaction: { baseline: 95, target: 80, current: 80, horizon: "6 months" },
      mental: { baseline: 80, target: 95, current: 95, horizon: "6 months" },
      cost: { baseline: 40, target: 25, current: 55, horizon: "4 months" },
      engagement: { baseline: 85, target: 95, current: 100, horizon: "4 months" },
    },
  },
}

const promDomains = [
  { id: "burden", name: "Burden of Illness", color: "#3b82f6" },
  { id: "medical", name: "Medical Management & Adherence", color: "#10b981" },
  { id: "utilization", name: "Health Care Utilization", color: "#f59e0b" },
  { id: "sdoh", name: "SDOH", color: "#ef4444" },
  { id: "diet", name: "Diet & Nutrition", color: "#8b5cf6" },
  { id: "physical", name: "Physical Activity Score", color: "#06b6d4" },
  { id: "sleep", name: "Sleep Health", color: "#ec4899" },
  { id: "pain", name: "Pain & Functional Impact", color: "#f97316" },
  { id: "satisfaction", name: "Patient Satisfaction & Trust", color: "#14b8a6" },
  { id: "mental", name: "Mental Health & Emotional Wellbeing", color: "#6366f1" },
  { id: "cost", name: "Healthcare Cost & Affordability", color: "#84cc16" },
  { id: "engagement", name: "Patient Engagement & Self Care Ability", color: "#f43f5e" },
]

export function PatientAssessmentTracking() {
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>(["burden"])
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false)
  const [createGoalOpen, setCreateGoalOpen] = useState(false)
  const [goalsOptions, setGoalsOptions] = useState<{ id: string; label: string }[]>([])

  const currentPatientData = mockPromDataByPatient[1]

  // Build tracked dimensions list from chartConfig so it matches what's visualized
  const chartConfig = {
    burden: {
      label: "Burden of Illness",
      color: "#3b82f6",
    },
    medical: {
      label: "Medical Management & Adherence",
      color: "#10b981",
    },
    utilization: {
      label: "Health Care Utilization",
      color: "#f59e0b",
    },
    sdoh: {
      label: "SDOH",
      color: "#ef4444",
    },
    diet: {
      label: "Diet & Nutrition",
      color: "#8b5cf6",
    },
    physical: {
      label: "Physical Activity Score",
      color: "#06b6d4",
    },
    sleep: {
      label: "Sleep Health",
      color: "#ec4899",
    },
    pain: {
      label: "Pain & Functional Impact",
      color: "#f97316",
    },
    satisfaction: {
      label: "Patient Satisfaction & Trust",
      color: "#14b8a6",
    },
    mental: {
      label: "Mental Health & Emotional Wellbeing",
      color: "#6366f1",
    },
    cost: {
      label: "Healthcare Cost & Affordability",
      color: "#84cc16",
    },
    engagement: {
      label: "Patient Engagement & Self Care Ability",
      color: "#f43f5e",
    },
  }

  const trackedDims = Object.entries(chartConfig).map(([id, meta]) => ({
    id,
    label: (meta as { label: string }).label,
  }))

  // Latest assessment values by dimension for baseline prefill
  const latestAssessment = currentPatientData.assessments[currentPatientData.assessments.length - 1]
  const latestByDimension = trackedDims.reduce(
    (acc, d) => {
      const val = (latestAssessment as any)?.[d.id]
      if (typeof val === "number") acc[d.id] = val
      return acc
    },
    {} as Record<string, number>,
  )

  const toggleDimension = (dimensionId: string) => {
    setSelectedDimensions((prev) => {
      if (prev.includes(dimensionId)) {
        return prev.length > 1 ? prev.filter((id) => id !== dimensionId) : prev
      }
      return [...prev, dimensionId]
    })
  }

  const handleGoalCreated = (goal: { id: string; description: string }) => {
    setGoalsOptions((prev) => [{ id: goal.id, label: goal.description }, ...prev])
  }

  return (
    <div className="space-y-8 p-6 bg-gray-50/30 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Patient Assessment & Outcomes Tracking
          </h2>
          <p className="text-gray-600 text-lg">
            {currentPatientData.patient.name} • {currentPatientData.patient.age}y •{" "}
            {currentPatientData.patient.condition}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            className="shadow-sm bg-blue-600 hover:bg-blue-700 border-0"
            onClick={() => setIsGoalDialogOpen(true)}
          >
            <Target className="h-4 w-4 mr-2" />
            Create Goal
          </Button>

          <Button className="shadow-sm bg-blue-600 hover:bg-blue-700 border-0">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Assessment
          </Button>
        </div>
      </div>


      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="trends" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Outcome Trends
          </TabsTrigger>
          <TabsTrigger value="assessments" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Assessment History
          </TabsTrigger>
          <TabsTrigger value="birp" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            BIRP Documentation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          {/* PROM Trending Chart */}
          <Card className="shadow-sm border-gray-200 bg-white">
            <CardHeader className="space-y-4">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Outcome Score Trends with Interventions
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  Longitudinal tracking of patient-reported outcomes with clinical significance markers
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Domain Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Select Dimensions: ({selectedDimensions.length} selected)
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDimensions(promDomains.map((d) => d.id))}
                      className="text-xs"
                    >
                      Select All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDimensions(["burden"])}
                      className="text-xs"
                    >
                      Clear Selection
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {promDomains.map((domain) => {
                    const isSelected = selectedDimensions.includes(domain.id)
                    return (
                      <Button
                        key={domain.id}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleDimension(domain.id)}
                        className={isSelected ? "shadow-sm" : "border-gray-200 text-gray-600 hover:bg-gray-50"}
                        style={
                          isSelected
                            ? {
                                backgroundColor: domain.color,
                                borderColor: domain.color,
                              }
                            : {}
                        }
                      >
                        {domain.name}
                      </Button>
                    )
                  })}
                </div>
              </div>

              {/* Chart */}
              <div className="h-96 w-full bg-white rounded-lg p-6 border border-gray-100">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={currentPatientData.assessments}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" opacity={0.7} />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                        }
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
                      <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />

                      {selectedDimensions.map((dimensionId) => {
                        const domain = promDomains.find((d) => d.id === dimensionId)
                        if (!domain) return null

                        return (
                          <Line
                            key={dimensionId}
                            type="monotone"
                            dataKey={dimensionId}
                            name={domain.name}
                            stroke={domain.color}
                            strokeWidth={3}
                            dot={{
                              fill: domain.color,
                              strokeWidth: 2,
                              r: 5,
                              stroke: "white",
                            }}
                            activeDot={{
                              r: 7,
                              stroke: domain.color,
                              strokeWidth: 2,
                              fill: "white",
                            }}
                          />
                        )
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              {/* Intervention Markers */}
              <div className="space-y-3 bg-gray-50/50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900">Intervention Timeline</h4>
                <InterventionTimeline
                  assessments={currentPatientData.assessments}
                  canEdit={true}
                  patientId={currentPatientData.patient.id}
                  goalsOptions={goalsOptions}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments">
          {/* Assessment History */}
          <Card className="shadow-sm border-gray-200 bg-white">
            <CardHeader className="space-y-4">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">Assessment History</CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  Complete history of patient assessments and scores
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentPatientData.assessments
                .slice()
                .reverse()
                .map((assessment, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{new Date(assessment.date).toLocaleDateString()}</span>
                          <Badge
                            variant={
                              assessment.overallRisk === "high"
                                ? "destructive"
                                : assessment.overallRisk === "moderate"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {assessment.overallRisk} risk
                          </Badge>
                          <Badge variant="outline" className="bg-blue-50 border-blue-200">
                            MCID: {assessment.burden}%
                          </Badge>
                        </div>
                        <Link href={`/assessments/${currentPatientData.patient.id}/${encodeURIComponent(assessment.date)}`}>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                      </div>

                      {assessment.interventions.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Interventions: </span>
                          {assessment.interventions.map((intervention, i) => (
                            <Badge key={i} variant="outline" className="mr-1 text-xs">
                              {intervention}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="birp">
          {/* BIRP Documentation */}
          <Card className="shadow-sm border-gray-200 bg-white">
            <CardHeader className="space-y-4">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">BIRP Documentation</CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  Behavior, Intervention, Response, Plan documentation format
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Latest BIRP Entry */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Session: January 15, 2025</CardTitle>
                    <Badge variant="default">Dr. Anderson</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Behavior */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      BEHAVIOR
                    </h4>
                    <div className="bg-muted p-3 rounded-lg text-sm">
                      <p>Patient reports improved mood stability over past 2 weeks.</p>
                      <p>MCID improved from 14% → 11%. Sleep quality improved.</p>
                      <p className="flex items-center gap-2 mt-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Medication adherence at 85% (up from 65%)
                      </p>
                      <Button variant="link" className="p-0 h-auto text-xs">
                        Link to Assessment Data
                      </Button>
                    </div>
                  </div>

                  {/* Intervention */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      INTERVENTION
                    </h4>
                    <div className="bg-muted p-3 rounded-lg text-sm space-y-1">
                      <p>• Continued sertraline 50mg daily</p>
                      <p>• Reinforced medication timing strategies</p>
                      <p>• Provided psychoeducation on sleep hygiene</p>
                      <p>• Scheduled follow-up with nutritionist</p>
                    </div>
                  </div>

                  {/* Response */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      RESPONSE
                    </h4>
                    <div className="bg-muted p-3 rounded-lg text-sm">
                      <p>
                        Patient engaged well in discussion. Demonstrated good understanding of medication importance.
                        Agreed to nutritionist referral. Set phone reminder for medications.
                      </p>
                    </div>
                  </div>

                  {/* Plan */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      PLAN
                    </h4>
                    <div className="bg-muted p-3 rounded-lg text-sm space-y-1">
                      <p>• Continue current medication regimen</p>
                      <p>• Follow-up in 4 weeks or sooner if symptoms worsen</p>
                      <p>• Complete nutritionist consultation within 2 weeks</p>
                      <p>• Patient to complete assessment in 2 weeks via app</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm">
                      Set Reminders
                    </Button>
                    <Button variant="outline" size="sm">
                      Schedule Follow-up
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Previous BIRP Entries */}
              <div className="space-y-3">
                <h4 className="font-medium">Previous Sessions</h4>
                {[
                  { date: "December 15, 2024", provider: "Dr. Anderson", status: "completed" },
                  { date: "November 15, 2024", provider: "Dr. Anderson", status: "completed" },
                  { date: "October 15, 2024", provider: "Dr. Anderson", status: "completed" },
                ].map((session, index) => (
                  <Card key={index} className="border-l-4 border-l-gray-300">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{session.date}</span>
                          <Badge variant="outline">{session.provider}</Badge>
                          <Badge variant="outline" className="text-green-700">
                            {session.status}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          View BIRP
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Goal Creation Dialog */}
      <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Goal</DialogTitle>
          </DialogHeader>
          <GoalTemplatesSystem
            openCreateDefault
            trackedDimensions={trackedDims}
            defaultDimension={selectedDimensions.length === 1 ? selectedDimensions[0] : undefined}
            latestByDimension={latestByDimension}
            onGoalCreated={handleGoalCreated}
          />
        </DialogContent>
      </Dialog>

      {/* Add Goal Dialog */}
      <Dialog open={createGoalOpen} onOpenChange={setCreateGoalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Manage Treatment Goals</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <GoalTemplatesSystem
              trackedDimensions={trackedDims}
              defaultDimension={selectedDimensions.length === 1 ? selectedDimensions[0] : undefined}
              latestByDimension={latestByDimension}
              onGoalCreated={handleGoalCreated}
            />
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
