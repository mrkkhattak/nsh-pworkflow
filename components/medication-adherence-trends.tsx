"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, ReferenceLine } from "recharts"
import { TrendingUp, TrendingDown, Calendar, AlertCircle, CheckCircle, Pill } from "lucide-react"

interface AdherenceHistoryPoint {
  date: string
  adherence: number
  missedDoses: number
}

interface Medication {
  name: string
  dosage: string
  frequency: string
  prescriber: string
  startDate: string
  adherence: number
  adherenceHistory: AdherenceHistoryPoint[]
  lastDoseTaken: string
  refillDate: string
  adherenceGoal: number
  consecutiveDays: number
}

interface MedicationAdherenceTrendsProps {
  medications: Medication[]
}

export function MedicationAdherenceTrends({ medications }: MedicationAdherenceTrendsProps) {
  const [selectedMedications, setSelectedMedications] = useState<string[]>(
    medications.map((med) => med.name)
  )
  const [timeRange, setTimeRange] = useState<"30" | "90" | "all">("all")

  const medicationColors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
  ]

  const toggleMedication = (medName: string) => {
    setSelectedMedications((prev) => {
      if (prev.includes(medName)) {
        return prev.length > 1 ? prev.filter((name) => name !== medName) : prev
      }
      return [...prev, medName]
    })
  }

  const getAdherenceStatus = (adherence: number, goal: number) => {
    if (adherence >= goal) return { label: "Excellent", variant: "default" as const, color: "text-green-700" }
    if (adherence >= goal - 10) return { label: "Good", variant: "secondary" as const, color: "text-blue-700" }
    if (adherence >= goal - 20) return { label: "Needs Attention", variant: "secondary" as const, color: "text-yellow-700" }
    return { label: "Critical", variant: "destructive" as const, color: "text-red-700" }
  }

  const getTrendIcon = (history: AdherenceHistoryPoint[]) => {
    if (history.length < 2) return null
    const recent = history[history.length - 1].adherence
    const previous = history[history.length - 2].adherence
    if (recent > previous) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (recent < previous) return <TrendingDown className="h-4 w-4 text-red-600" />
    return null
  }

  const combinedChartData = medications.reduce((acc, med) => {
    med.adherenceHistory.forEach((point) => {
      const existing = acc.find((item) => item.date === point.date)
      if (existing) {
        existing[med.name] = point.adherence
      } else {
        acc.push({
          date: point.date,
          [med.name]: point.adherence,
        })
      }
    })
    return acc
  }, [] as any[])

  combinedChartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const filteredChartData = (() => {
    if (timeRange === "all") return combinedChartData
    const now = new Date()
    const daysAgo = timeRange === "30" ? 30 : 90
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    return combinedChartData.filter((item) => new Date(item.date) >= cutoffDate)
  })()

  const chartConfig = medications.reduce(
    (acc, med, index) => {
      acc[med.name] = {
        label: `${med.name} ${med.dosage}`,
        color: medicationColors[index % medicationColors.length],
      }
      return acc
    },
    {} as Record<string, { label: string; color: string }>
  )

  const overallAdherence = medications.reduce((sum, med) => sum + med.adherence, 0) / medications.length
  const overallGoal = medications.reduce((sum, med) => sum + med.adherenceGoal, 0) / medications.length
  const totalConsecutiveDays = Math.min(...medications.map((med) => med.consecutiveDays))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall Adherence</p>
                <p className="text-2xl font-bold text-gray-900">{overallAdherence.toFixed(0)}%</p>
                <p className="text-xs text-gray-500">Goal: {overallGoal.toFixed(0)}%</p>
              </div>
              <Pill className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Consecutive Days</p>
                <p className="text-2xl font-bold text-gray-900">{totalConsecutiveDays}</p>
                <p className="text-xs text-green-600">Current streak</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Medications</p>
                <p className="text-2xl font-bold text-gray-900">{medications.length}</p>
                <p className="text-xs text-blue-600">Currently taking</p>
              </div>
              <Pill className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Next Refill Due</p>
                <p className="text-lg font-bold text-gray-900">
                  {new Date(medications[0]?.refillDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
                <p className="text-xs text-orange-600">{medications[0]?.name}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-gray-200 bg-white">
        <CardHeader className="space-y-4">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Medication Adherence Trends Over Time
            </CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              Track medication adherence patterns and identify opportunities for improvement
            </CardDescription>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {medications.map((med, index) => {
                const isSelected = selectedMedications.includes(med.name)
                const color = medicationColors[index % medicationColors.length]
                return (
                  <Button
                    key={med.name}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleMedication(med.name)}
                    className={isSelected ? "shadow-sm" : "border-gray-200 text-gray-600 hover:bg-gray-50"}
                    style={
                      isSelected
                        ? {
                            backgroundColor: color,
                            borderColor: color,
                          }
                        : {}
                    }
                  >
                    {med.name} {med.dosage}
                  </Button>
                )
              })}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={timeRange === "30" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("30")}
                className="text-xs"
              >
                30 Days
              </Button>
              <Button
                variant={timeRange === "90" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("90")}
                className="text-xs"
              >
                90 Days
              </Button>
              <Button
                variant={timeRange === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("all")}
                className="text-xs"
              >
                All Time
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="h-96 w-full bg-white rounded-lg p-6 border border-gray-100">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={filteredChartData}
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
                  <ReferenceLine y={80} stroke="#10b981" strokeDasharray="3 3" label="Target" />

                  {selectedMedications.map((medName, index) => {
                    const color = medicationColors[medications.findIndex((m) => m.name === medName) % medicationColors.length]
                    return (
                      <Line
                        key={medName}
                        type="monotone"
                        dataKey={medName}
                        name={`${medName}`}
                        stroke={color}
                        strokeWidth={3}
                        dot={{
                          fill: color,
                          strokeWidth: 2,
                          r: 5,
                          stroke: "white",
                        }}
                        activeDot={{
                          r: 7,
                          stroke: color,
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

          <div className="space-y-3 bg-gray-50/50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900">Individual Medication Details</h4>
            <div className="space-y-3">
              {medications.map((med) => {
                const status = getAdherenceStatus(med.adherence, med.adherenceGoal)
                const trendIcon = getTrendIcon(med.adherenceHistory)
                return (
                  <div key={med.name} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <h5 className="font-medium text-gray-900">
                            {med.name} {med.dosage}
                          </h5>
                          <p className="text-xs text-gray-600">{med.frequency}</p>
                        </div>
                        <Badge variant={status.variant} className="text-xs">
                          {status.label}
                        </Badge>
                        {trendIcon}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{med.adherence}%</p>
                        <p className="text-xs text-gray-500">Current</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-600">Goal</p>
                        <p className="font-medium text-gray-900">{med.adherenceGoal}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Streak</p>
                        <p className="font-medium text-gray-900">{med.consecutiveDays} days</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Last Dose</p>
                        <p className="font-medium text-gray-900 text-xs">{med.lastDoseTaken}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Refill Due</p>
                        <p className="font-medium text-gray-900">
                          {new Date(med.refillDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                      </div>
                    </div>

                    {med.adherence < med.adherenceGoal && (
                      <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-700 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-yellow-800">
                          <p className="font-medium">Adherence below target</p>
                          <p>Consider setting medication reminders or discussing barriers with provider</p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
