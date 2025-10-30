"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { OutcomeMetric, getMetricStatusColor, getTrendIcon, getTrendColor } from "@/lib/outcome-metrics-mock"
import { TrendingUp, TrendingDown, Minus, Target, Calendar } from "lucide-react"

interface OutcomeMetricCardProps {
  metric: OutcomeMetric
  showTrend?: boolean
}

export function OutcomeMetricCard({ metric, showTrend = true }: OutcomeMetricCardProps) {
  const statusColor = getMetricStatusColor(metric.status)
  const trendIcon = getTrendIcon(metric.trend)
  const trendColor = getTrendColor(metric.trend)

  const renderTrendIcon = () => {
    switch (metric.trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4" />
      case "declining":
        return <TrendingDown className="h-4 w-4" />
      case "stable":
        return <Minus className="h-4 w-4" />
      default:
        return null
    }
  }

  const renderValue = () => {
    if (typeof metric.currentValue === "number") {
      if (metric.measurementUnit === "%") {
        return `${metric.currentValue}%`
      }
      return metric.currentValue
    }
    return metric.currentValue
  }

  const calculateProgress = (): number | undefined => {
    if (typeof metric.currentValue === "number" && typeof metric.target === "number") {
      if (metric.metricId.startsWith("QEO") || metric.metricId.startsWith("SO")) {
        return Math.min((metric.currentValue / metric.target) * 100, 100)
      }
      return Math.min((metric.currentValue / metric.target) * 100, 100)
    }
    return undefined
  }

  const progress = calculateProgress()

  return (
    <Card className={`border-l-4 ${statusColor}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-sm font-semibold text-gray-900">{metric.metricName}</CardTitle>
            <p className="text-xs text-gray-600">{metric.description}</p>
          </div>
          <Badge variant="outline" className={`ml-2 ${statusColor} border text-xs`}>
            {metric.status.replace("-", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">{renderValue()}</span>
              {metric.measurementUnit && metric.measurementUnit !== "%" && (
                <span className="text-sm text-gray-600">{metric.measurementUnit}</span>
              )}
            </div>
            <p className="text-xs text-gray-500">Current Value</p>
          </div>

          {showTrend && (
            <div className={`flex items-center gap-1 ${trendColor}`}>
              {renderTrendIcon()}
              <span className="text-sm font-medium capitalize">{metric.trend}</span>
            </div>
          )}
        </div>

        {progress !== undefined && (
          <div className="space-y-1">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-gray-500">Progress toward target</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          {metric.baseline !== undefined && (
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Baseline</p>
              <p className="text-sm font-medium text-gray-900">
                {typeof metric.baseline === "number" && metric.measurementUnit === "%"
                  ? `${metric.baseline}%`
                  : metric.baseline}
              </p>
            </div>
          )}
          {metric.target !== undefined && (
            <div className="space-y-1 flex items-start gap-1">
              <Target className="h-3 w-3 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Target</p>
                <p className="text-sm font-medium text-gray-900">{metric.target}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 pt-2 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Updated: {new Date(metric.lastUpdated).toLocaleDateString()}</span>
          </div>
          <div>
            <span>Frequency: {metric.frequency}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
