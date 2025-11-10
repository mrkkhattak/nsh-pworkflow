"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BiometricTypeConfig, ChartDataPoint } from "@/lib/biometric-service"

interface BiometricTrendChartProps {
  data: ChartDataPoint[]
  typeConfig: BiometricTypeConfig
  title: string
}

export function BiometricTrendChart({ data, typeConfig, title }: BiometricTrendChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>No data available for this time period</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-sm mb-1">
            {new Date(data.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">
              {typeConfig.hasSecondary
                ? `${data.value}/${data.secondaryValue}`
                : data.value}{" "}
              {typeConfig.unit}
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {data.recordedBy} at {data.time}
          </p>
          {data.notes && (
            <p className="text-xs text-gray-600 mt-2 italic border-t pt-1">
              {data.notes}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>Trend over selected time period</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#6b7280"
              style={{ fontSize: "12px" }}
            />
            <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: "12px" }}
              formatter={(value) => {
                if (value === "value") {
                  return typeConfig.hasSecondary ? "Systolic BP" : typeConfig.label
                }
                if (value === "secondaryValue") {
                  return "Diastolic BP"
                }
                return value
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={typeConfig.color}
              strokeWidth={2}
              dot={(props: any) => {
                const isClinic = props.payload.recordedBy.includes("Clinic")
                return (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={4}
                    fill={isClinic ? typeConfig.color : "#fff"}
                    stroke={typeConfig.color}
                    strokeWidth={2}
                  />
                )
              }}
              activeDot={{ r: 6 }}
            />
            {typeConfig.hasSecondary && (
              <Line
                type="monotone"
                dataKey="secondaryValue"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={(props: any) => {
                  const isClinic = props.payload.recordedBy.includes("Clinic")
                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={4}
                      fill={isClinic ? "#3b82f6" : "#fff"}
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                  )
                }}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: typeConfig.color, backgroundColor: typeConfig.color }} />
            <span>PCP Clinic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 bg-white" style={{ borderColor: typeConfig.color }} />
            <span>Home Reading</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
