"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { TrendingDown, TrendingUp, Minus, AlertCircle } from "lucide-react"
import {
  fetchRiskTrendData,
  getRiskTrendSummary,
  getOverallRiskTrend,
  getRiskCategoryLabel,
  getRiskCategoryColor,
  type RiskTrendData,
  type RiskTrendSummary,
  type RiskCategory,
} from "@/lib/risk-trend-service"

interface RiskDistributionTrendsProps {
  timeframe: '1month' | '3months' | '6months' | '1year'
  cohortFilter?: string
}

export function RiskDistributionTrends({ timeframe, cohortFilter = 'all' }: RiskDistributionTrendsProps) {
  const [trendData, setTrendData] = useState<RiskTrendData[]>([])
  const [summaries, setSummaries] = useState<RiskTrendSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [data, summaryData] = await Promise.all([
          fetchRiskTrendData(timeframe, cohortFilter),
          getRiskTrendSummary(timeframe, cohortFilter),
        ])
        setTrendData(data)
        setSummaries(summaryData)
      } catch (error) {
        console.error('Error loading risk trend data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [timeframe, cohortFilter])

  const chartConfig = {
    very_high: {
      label: 'Very High Risk',
      color: getRiskCategoryColor('very_high'),
    },
    high: {
      label: 'High Risk',
      color: getRiskCategoryColor('high'),
    },
    moderate: {
      label: 'Moderate Risk',
      color: getRiskCategoryColor('moderate'),
    },
    low: {
      label: 'Low Risk',
      color: getRiskCategoryColor('low'),
    },
  }

  const getTrendIcon = (trend: 'increasing' | 'decreasing' | 'stable') => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4" />
      case 'decreasing':
        return <TrendingDown className="h-4 w-4" />
      default:
        return <Minus className="h-4 w-4" />
    }
  }

  const getTrendColor = (category: RiskCategory, trend: 'increasing' | 'decreasing' | 'stable') => {
    if (trend === 'stable') return 'text-gray-600'

    if (category === 'very_high' || category === 'high') {
      return trend === 'decreasing' ? 'text-green-600' : 'text-red-600'
    } else {
      return trend === 'increasing' ? 'text-green-600' : 'text-red-600'
    }
  }

  const overallTrend = summaries.length > 0 ? getOverallRiskTrend(summaries) : null

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Risk Distribution Trends Over Time</CardTitle>
          <CardDescription>Loading trend data...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Risk Distribution Trends Over Time</CardTitle>
            <CardDescription>
              Track how patient distribution across risk categories changes over time
            </CardDescription>
          </div>
          {overallTrend && (
            <Badge
              variant={overallTrend.improving ? "default" : "secondary"}
              className="flex items-center gap-2"
            >
              {overallTrend.improving ? (
                <TrendingDown className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {overallTrend.improving ? 'Improving' : 'Needs Attention'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {overallTrend && (
          <div className={`p-4 rounded-lg border-2 ${
            overallTrend.improving
              ? 'bg-green-50 border-green-200'
              : 'bg-amber-50 border-amber-200'
          }`}>
            <p className={`text-sm font-medium ${
              overallTrend.improving ? 'text-green-900' : 'text-amber-900'
            }`}>
              {overallTrend.message}
            </p>
          </div>
        )}

        <div className="h-[400px]">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: "#9ca3af" }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: "#9ca3af" }}
                  label={{ value: 'Number of Patients', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                  formatter={(value) => {
                    const config = chartConfig[value as keyof typeof chartConfig]
                    return config?.label || value
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="very_high"
                  stroke={chartConfig.very_high.color}
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  name="Very High Risk"
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="high"
                  stroke={chartConfig.high.color}
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  name="High Risk"
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="moderate"
                  stroke={chartConfig.moderate.color}
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  name="Moderate Risk"
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="low"
                  stroke={chartConfig.low.color}
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  name="Low Risk"
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {summaries.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-4">Trend Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {summaries.map((summary) => (
                <Card key={summary.category} className="border-2">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-medium">
                        {getRiskCategoryLabel(summary.category)}
                      </h5>
                      <div className={`flex items-center gap-1 ${getTrendColor(summary.category, summary.trend)}`}>
                        {getTrendIcon(summary.trend)}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold">
                        {summary.currentCount}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Current patients
                      </div>
                      <div className={`text-sm font-medium ${getTrendColor(summary.category, summary.trend)}`}>
                        {summary.change > 0 ? '+' : ''}{summary.change} ({summary.changePercent > 0 ? '+' : ''}{summary.changePercent}%)
                      </div>
                      <div className="text-xs text-muted-foreground">
                        vs {summary.previousCount} previously
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium text-sm mb-2">Understanding Risk Trends</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Each line represents patient count in a specific risk category over time</li>
            <li>• Positive trends show decreasing high-risk and increasing low-risk populations</li>
            <li>• Use this data to assess the effectiveness of population health interventions</li>
            <li>• Sudden changes may indicate need for targeted intervention strategies</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
