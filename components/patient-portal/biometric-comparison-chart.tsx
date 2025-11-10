"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BiometricTypeConfig } from "@/lib/biometric-service"

interface ComparisonDataPoint {
  date: string
  [key: string]: any
}

interface BiometricComparisonChartProps {
  data: ComparisonDataPoint[]
  selectedTypes: string[]
  typeConfigs: Record<string, BiometricTypeConfig>
}

export function BiometricComparisonChart({
  data,
  selectedTypes,
  typeConfigs,
}: BiometricComparisonChartProps) {
  if (data.length === 0 || selectedTypes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Comparison Chart</CardTitle>
          <CardDescription>
            Select biometric types to compare them side by side
          </CardDescription>
        </CardHeader>
        <CardContent className="py-12 text-center text-gray-500">
          <p>No data available for comparison</p>
        </CardContent>
      </Card>
    )
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const normalizeValue = (value: number, type: string): number => {
    if (!value) return 0

    const ranges: Record<string, { min: number; max: number }> = {
      blood_pressure: { min: 80, max: 160 },
      blood_glucose: { min: 70, max: 140 },
      a1c: { min: 4, max: 8 },
      pain_score: { min: 0, max: 10 },
      cholesterol: { min: 120, max: 240 },
      bmi: { min: 18, max: 35 },
      weight: { min: 100, max: 250 },
      triglycerides: { min: 50, max: 200 },
    }

    const range = ranges[type] || { min: 0, max: 100 }
    return ((value - range.min) / (range.max - range.min)) * 100
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg max-w-xs">
          <p className="font-semibold text-sm mb-2">
            {new Date(dataPoint.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          {payload.map((entry: any, index: number) => {
            const type = entry.dataKey.replace("_normalized", "")
            const config = typeConfigs[type]
            const actualValue = dataPoint[type]

            if (!actualValue && actualValue !== 0) return null

            return (
              <div key={index} className="flex items-center gap-2 text-sm mb-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-700">
                  {config?.label}: <span className="font-medium">{actualValue}</span>{" "}
                  {config?.unit}
                </span>
              </div>
            )
          })}
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Biometric Comparison</CardTitle>
        <CardDescription>
          Normalized view of multiple biometrics over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#6b7280"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: "12px" }}
              label={{ value: "Normalized Scale", angle: -90, position: "insideLeft", style: { fontSize: "12px" } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: "12px" }}
              formatter={(value) => {
                const type = value.replace("_normalized", "")
                return typeConfigs[type]?.label || type
              }}
            />
            {selectedTypes.map((type) => {
              const config = typeConfigs[type]
              return (
                <Line
                  key={type}
                  type="monotone"
                  dataKey={`${type}_normalized`}
                  stroke={config?.color || "#666"}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  name={type}
                />
              )
            })}
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-700">
            <span className="font-semibold">Note:</span> Values are normalized on a 0-100 scale to allow comparison between different measurement types.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function prepareComparisonData(
  biometrics: any[],
  selectedTypes: string[]
): ComparisonDataPoint[] {
  const dateMap = new Map<string, ComparisonDataPoint>()

  biometrics.forEach((biometric) => {
    if (!selectedTypes.includes(biometric.type)) return

    const date = biometric.date
    if (!dateMap.has(date)) {
      dateMap.set(date, { date })
    }

    const dataPoint = dateMap.get(date)!
    dataPoint[biometric.type] = biometric.value

    const normalized = normalizeValueForComparison(biometric.value, biometric.type)
    dataPoint[`${biometric.type}_normalized`] = normalized
  })

  return Array.from(dateMap.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
}

function normalizeValueForComparison(value: number, type: string): number {
  if (!value && value !== 0) return 0

  const ranges: Record<string, { min: number; max: number }> = {
    blood_pressure: { min: 80, max: 160 },
    blood_glucose: { min: 70, max: 140 },
    a1c: { min: 4, max: 8 },
    pain_score: { min: 0, max: 10 },
    cholesterol: { min: 120, max: 240 },
    bmi: { min: 18, max: 35 },
    weight: { min: 100, max: 250 },
    triglycerides: { min: 50, max: 200 },
  }

  const range = ranges[type] || { min: 0, max: 100 }
  const normalized = ((value - range.min) / (range.max - range.min)) * 100
  return Math.max(0, Math.min(100, normalized))
}
