"use client"

import { useMemo } from "react"
import { ScoreCard } from "./score-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { promDomains, computeGlobalHealthIndex, getRiskLabel, type Assessment } from "@/lib/prom-mock"
import { Activity, Brain, Heart, Zap } from "lucide-react"

type Props = {
  patient: { id: number; name: string }
  assessment: Assessment
  history: Assessment[]
}

export function AssessmentDetail({ patient, assessment, history }: Props) {
  const ghi = computeGlobalHealthIndex(assessment)
  const risk = getRiskLabel(ghi)

  const chartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {}
    for (const d of promDomains) config[d.id] = { label: d.name, color: d.color }
    return config
  }, [])

  return (
    <div className="space-y-8 p-6 bg-gray-50/30 min-h-screen">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold text-gray-900 text-balance">Assessment Details</h1>
        <p className="text-gray-600">
          {patient.name} • {new Date(assessment.date).toLocaleDateString()}
        </p>
      </div>

      {/* Overall Health */}
      <ScoreCard
        title="My Overall Health"
        score={ghi}
        statusText={risk.label}
        statusColorClass={risk.color}
        icon={<Activity className="h-5 w-5 text-gray-600" />}
        interpretation="The Global Health Index summarizes contributory dimensions into a single indicator of current health status. Use this to guide clinical prioritization alongside dimension-level scores and clinical judgment."
        accent="emerald"
      />

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mt-4 mb-3">Contributory Health Dimensions</h2>
        <div className="grid grid-cols-1 gap-6">
          {promDomains.map((d) => {
            const val = (assessment as any)[d.id] as number
            const label = getRiskLabel(d.direction === "lower-better" ? 100 - val : val)
            return (
              <ScoreCard
                key={d.id}
                title={d.name}
                score={val}
                statusText={label.label}
                statusColorClass={label.color}
                icon={
                  d.id === "physical" ? (
                    <Activity className="h-5 w-5 text-gray-600" />
                  ) : d.id === "mental" ? (
                    <Brain className="h-5 w-5 text-gray-600" />
                  ) : d.id === "sdoh" || d.id === "pain" || d.id === "utilization" || d.id === "cost" ? (
                    <Zap className="h-5 w-5 text-gray-600" />
                  ) : (
                    <Heart className="h-5 w-5 text-gray-600" />
                  )
                }
                interpretation="This score contributes to overall health; consider targeted interventions and context from the patient encounter."
                accent="cyan"
              />
            )
          })}
        </div>
      </div>

      {/* Trend Chart */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Score Trend</CardTitle>
          <CardDescription>Recent values with approximate direction of change</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 16, right: 24, left: 12, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis domain={[0, 100]} stroke="#6b7280" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                {/* Show GHI as a derived series */}
                <Line
                  type="monotone"
                  dataKey={(d: any) => computeGlobalHealthIndex(d as Assessment)}
                  name="Global Health Index"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#10b981", stroke: "white", strokeWidth: 2 }}
                  activeDot={{ r: 7, stroke: "#10b981", strokeWidth: 2, fill: "white" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span className="text-emerald-600">Better</span>
            <span className="text-rose-600">Worse</span>
          </div>
        </CardContent>
      </Card>

      {/* Reference image (for designers/devs) */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Reference Layout</CardTitle>
          <CardDescription>For visual alignment only (not patient data)</CardDescription>
        </CardHeader>
        <CardContent>
          <img
            src="/reference/assessment-detail.png"
            alt="Assessment detail visual reference"
            className="w-full rounded-md border"
          />
          <Badge variant="outline" className="mt-2">
            Internal Reference
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}
