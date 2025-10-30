"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  AlertTriangle,
  CheckCircle,
  Filter,
  Eye,
  ArrowRight,
  Activity,
  Brain,
  Heart,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react"

// Mock data for analytics
const cohortData = {
  overview: {
    totalPatients: 156,
    highPerforming: 45,
    moderatePerforming: 78,
    lowPerforming: 33,
    newHighRisk: 8,
    improvedThisWeek: 12,
    noImprovementOver30Days: 15,
  },
  dimensions: [
    {
      id: "depression",
      name: "Mental Health - Depression",
      icon: Brain,
      highPerforming: { count: 12, percentage: 27 },
      moderatePerforming: { count: 20, percentage: 45 },
      lowPerforming: { count: 12, percentage: 27 },
      trend: "improving",
      avgScore: 8.5,
      targetScore: 5,
      completionRate: 89,
    },
    {
      id: "anxiety",
      name: "Mental Health - Anxiety",
      icon: Heart,
      highPerforming: { count: 15, percentage: 34 },
      moderatePerforming: { count: 18, percentage: 41 },
      lowPerforming: { count: 11, percentage: 25 },
      trend: "stable",
      avgScore: 6.2,
      targetScore: 4,
      completionRate: 92,
    },
    {
      id: "function",
      name: "Functional Health",
      icon: Activity,
      highPerforming: { count: 8, percentage: 20 },
      moderatePerforming: { count: 22, percentage: 55 },
      lowPerforming: { count: 10, percentage: 25 },
      trend: "declining",
      avgScore: 18.3,
      targetScore: 12,
      completionRate: 85,
    },
    {
      id: "pain",
      name: "Pain (BPI)",
      icon: Zap,
      highPerforming: { count: 10, percentage: 30 },
      moderatePerforming: { count: 18, percentage: 53 },
      lowPerforming: { count: 6, percentage: 18 },
      trend: "improving",
      avgScore: 4.1,
      targetScore: 3,
      completionRate: 88,
    },
  ],
  trendData: [
    { month: "Aug", depression: 9.2, anxiety: 7.1, function: 20.5, pain: 5.2 },
    { month: "Sep", depression: 8.9, anxiety: 6.8, function: 19.8, pain: 4.9 },
    { month: "Oct", depression: 8.7, anxiety: 6.5, function: 19.2, pain: 4.6 },
    { month: "Nov", depression: 8.4, anxiety: 6.3, function: 18.8, pain: 4.3 },
    { month: "Dec", depression: 8.1, anxiety: 6.1, function: 18.5, pain: 4.1 },
    { month: "Jan", depression: 8.5, anxiety: 6.2, function: 18.3, pain: 4.1 },
  ],
}

const qualityMeasures = [
  {
    id: "depression-screening",
    name: "Depression Screening Rate",
    current: 85,
    target: 90,
    trend: "improving",
    description: "Percentage of patients screened for depression annually",
  },
  {
    id: "medication-adherence",
    name: "Medication Adherence",
    current: 78,
    target: 85,
    trend: "stable",
    description: "Percentage of patients with good medication adherence",
  },
  {
    id: "care-plan-completion",
    name: "Care Plan Completion",
    current: 92,
    target: 90,
    trend: "improving",
    description: "Percentage of patients with completed care plans",
  },
  {
    id: "follow-up-rate",
    name: "Follow-up Rate",
    current: 88,
    target: 95,
    trend: "declining",
    description: "Percentage of patients with timely follow-up appointments",
  },
]

const riskStratificationData = [
  { name: "Low Risk", value: 45, color: "hsl(var(--chart-5))" },
  { name: "Moderate Risk", value: 78, color: "hsl(var(--chart-4))" },
  { name: "High Risk", value: 33, color: "hsl(var(--chart-3))" },
]

// Added sparkline data for metric cards per UX-037
const sparklineData = {
  totalPatients: [148, 151, 153, 154, 155, 156],
  highPerforming: [38, 40, 42, 43, 44, 45],
  newHighRisk: [5, 7, 6, 9, 7, 8],
  noImprovement: [18, 17, 16, 15, 16, 15],
}

const peerComparisonData = [
  {
    metric: "Depression Screening",
    provider: 85,
    peerAvg: 78,
    topQuartile: 92,
  },
  {
    metric: "Medication Adherence",
    provider: 78,
    peerAvg: 72,
    topQuartile: 88,
  },
  {
    metric: "Care Plan Completion",
    provider: 92,
    peerAvg: 85,
    topQuartile: 95,
  },
  {
    metric: "Follow-up Rate",
    provider: 88,
    peerAvg: 82,
    topQuartile: 94,
  },
  {
    metric: "Patient Satisfaction",
    provider: 4.6,
    peerAvg: 4.2,
    topQuartile: 4.8,
  },
]

const compositeScoreData = [
  { category: "Clinical Outcomes", provider: 87, peerAvg: 81 },
  { category: "Quality Measures", provider: 86, peerAvg: 79 },
  { category: "Patient Engagement", provider: 82, peerAvg: 76 },
  { category: "Care Coordination", provider: 90, peerAvg: 83 },
  { category: "Overall Performance", provider: 86, peerAvg: 80 },
]

export function AnalyticsCohortManagement() {
  const [selectedDimension, setSelectedDimension] = useState("depression")
  const [selectedTimeframe, setSelectedTimeframe] = useState("6months")
  const [selectedCohort, setSelectedCohort] = useState("all")
  const [comparisonView, setComparisonView] = useState<"individual" | "composite">("individual")

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-yellow-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving":
        return "text-green-600"
      case "declining":
        return "text-red-600"
      default:
        return "text-yellow-600"
    }
  }

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 70) return "bg-green-100 text-green-800 border-green-200"
    if (percentage >= 40) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  const chartConfig = {
    depression: {
      label: "Depression",
      color: "hsl(var(--chart-1))",
    },
    anxiety: {
      label: "Anxiety",
      color: "hsl(var(--chart-2))",
    },
    function: {
      label: "Function",
      color: "hsl(var(--chart-3))",
    },
    pain: {
      label: "Pain",
      color: "hsl(var(--chart-4))",
    },
  }

  const Sparkline = ({ data, color = "#3b82f6" }: { data: number[]; color?: string }) => {
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1
    const width = 80
    const height = 24
    const points = data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * width
        const y = height - ((value - min) / range) * height
        return `${x},${y}`
      })
      .join(" ")

    return (
      <svg width={width} height={height} className="inline-block">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  const MetricCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    sparklineData,
    comparison,
    trend,
  }: {
    title: string
    value: number
    subtitle: string
    icon: any
    sparklineData: number[]
    comparison?: { label: string; value: number; type: "increase" | "decrease" | "neutral" }
    trend?: "up" | "down" | "neutral"
  }) => {
    const getTrendIcon = () => {
      if (trend === "up") return <ArrowUpRight className="h-4 w-4 text-green-600" />
      if (trend === "down") return <ArrowDownRight className="h-4 w-4 text-red-600" />
      return <Minus className="h-4 w-4 text-gray-600" />
    }

    const getTrendColor = () => {
      if (trend === "up") return "text-green-600"
      if (trend === "down") return "text-red-600"
      return "text-gray-600"
    }

    return (
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between mb-2">
            <div className="text-2xl font-bold">{value}</div>
            <Sparkline data={sparklineData} />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{subtitle}</p>
            {comparison && (
              <div className={`flex items-center gap-1 text-xs font-medium ${getTrendColor()}`}>
                {getTrendIcon()}
                <span>
                  {comparison.type === "increase" ? "+" : ""}
                  {comparison.value}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleExport = (format: "pdf" | "csv") => {
    console.log(`Exporting report as ${format}`)
    // Implementation would generate and download the report
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analytics & Cohort Management</h2>
          <p className="text-muted-foreground">Population health insights and performance analytics</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedCohort} onValueChange={setSelectedCohort}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Comparison Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Patients</SelectItem>
              <SelectItem value="peer-avg">Peer Average</SelectItem>
              <SelectItem value="top-quartile">Top Quartile</SelectItem>
              <SelectItem value="regional">Regional Benchmark</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => handleExport(value as "pdf" | "csv")}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Export Report" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">Export as PDF</SelectItem>
              <SelectItem value="csv">Export as CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Patients"
          value={cohortData.overview.totalPatients}
          subtitle="Active in care"
          icon={Users}
          sparklineData={sparklineData.totalPatients}
          comparison={{ label: "vs last month", value: 3, type: "increase" }}
          trend="up"
        />
        <MetricCard
          title="High Performing"
          value={cohortData.overview.highPerforming}
          subtitle={`${Math.round((cohortData.overview.highPerforming / cohortData.overview.totalPatients) * 100)}% of total`}
          icon={CheckCircle}
          sparklineData={sparklineData.highPerforming}
          comparison={{ label: "vs peer avg", value: 7, type: "increase" }}
          trend="up"
        />
        <MetricCard
          title="New High Risk"
          value={cohortData.overview.newHighRisk}
          subtitle="This week"
          icon={AlertTriangle}
          sparklineData={sparklineData.newHighRisk}
          comparison={{ label: "vs last week", value: 1, type: "increase" }}
          trend="up"
        />
        <MetricCard
          title="No Improvement"
          value={cohortData.overview.noImprovementOver30Days}
          subtitle="Over 30 days"
          icon={TrendingDown}
          sparklineData={sparklineData.noImprovement}
          comparison={{ label: "vs last month", value: -3, type: "decrease" }}
          trend="down"
        />
      </div>

      <Tabs defaultValue="cohorts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="cohorts">Cohort Analysis</TabsTrigger>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          <TabsTrigger value="quality">Quality Measures</TabsTrigger>
          <TabsTrigger value="comparison">Peer Comparison</TabsTrigger>
          <TabsTrigger value="risk">Risk Stratification</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="cohorts">
          {/* Cohort Heatmap */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Cohort Performance Heatmap</CardTitle>
                  <CardDescription>Patient performance across different health dimensions</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Quick Filters
                  </Button>
                  <Select value={selectedCohort} onValueChange={setSelectedCohort}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Patients</SelectItem>
                      <SelectItem value="top5">Top 5% Performers</SelectItem>
                      <SelectItem value="new-high">New High Risk</SelectItem>
                      <SelectItem value="no-improvement">No Improvement 30+ Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cohortData.dimensions.map((dimension) => {
                  const Icon = dimension.icon
                  return (
                    <Card key={dimension.id} className="border-2 hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          {getTrendIcon(dimension.trend)}
                        </div>
                        <CardTitle className="text-sm font-medium">{dimension.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Performance Distribution */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span>High Performing</span>
                              <span className="font-medium">{dimension.highPerforming.count} patients</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${dimension.highPerforming.percentage}%` }}
                              />
                            </div>
                            <div className="text-xs text-muted-foreground">{dimension.highPerforming.percentage}%</div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span>Moderate Performing</span>
                              <span className="font-medium">{dimension.moderatePerforming.count} patients</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-500 h-2 rounded-full"
                                style={{ width: `${dimension.moderatePerforming.percentage}%` }}
                              />
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {dimension.moderatePerforming.percentage}%
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span>Low Performing</span>
                              <span className="font-medium">{dimension.lowPerforming.count} patients</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-red-500 h-2 rounded-full"
                                style={{ width: `${dimension.lowPerforming.percentage}%` }}
                              />
                            </div>
                            <div className="text-xs text-muted-foreground">{dimension.lowPerforming.percentage}%</div>
                          </div>

                          {/* Key Metrics */}
                          <div className="pt-2 border-t space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Avg Score:</span>
                              <span className="font-medium">{dimension.avgScore}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Target:</span>
                              <span className="font-medium">{dimension.targetScore}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Completion:</span>
                              <span className="font-medium">{dimension.completionRate}%</span>
                            </div>
                          </div>

                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            <Eye className="h-3 w-3 mr-2" />
                            View Patients
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Drill-down Actions */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-3">Quick Actions</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button variant="outline" className="justify-start bg-transparent">
                    <Target className="h-4 w-4 mr-2" />
                    Top 5% High Performers
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    New High Risk This Week
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent">
                    <TrendingDown className="h-4 w-4 mr-2" />
                    No Improvement 30+ Days
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends by Dimension</CardTitle>
              <CardDescription>Average scores across all dimensions over time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="w-full">
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={cohortData.trendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={{ stroke: "#9ca3af" }} />
                      <YAxis tick={{ fontSize: 12 }} tickLine={{ stroke: "#9ca3af" }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />
                      <Line
                        type="monotone"
                        dataKey="depression"
                        stroke={chartConfig.depression.color}
                        strokeWidth={3}
                        dot={{ r: 5, strokeWidth: 2 }}
                        name="Mental Health - Depression"
                      />
                      <Line
                        type="monotone"
                        dataKey="anxiety"
                        stroke={chartConfig.anxiety.color}
                        strokeWidth={3}
                        dot={{ r: 5, strokeWidth: 2 }}
                        name="Mental Health - Anxiety"
                      />
                      <Line
                        type="monotone"
                        dataKey="function"
                        stroke={chartConfig.function.color}
                        strokeWidth={3}
                        dot={{ r: 5, strokeWidth: 2 }}
                        name="Functional Health"
                      />
                      <Line
                        type="monotone"
                        dataKey="pain"
                        stroke={chartConfig.pain.color}
                        strokeWidth={3}
                        dot={{ r: 5, strokeWidth: 2 }}
                        name="Pain (BPI)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                {cohortData.dimensions.map((dimension) => (
                  <Card key={dimension.id} className="border-2">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-sm">{dimension.name.split(" ")[0]}</h4>
                        {getTrendIcon(dimension.trend)}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-3xl font-bold mb-1">{dimension.avgScore}</div>
                          <div className="text-xs text-muted-foreground">Current Average</div>
                        </div>
                        <div className="pt-3 border-t space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Target:</span>
                            <span className="font-medium">{dimension.targetScore}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Completion:</span>
                            <span className="font-medium">{dimension.completionRate}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality">
          {/* Quality Measures */}
          <Card>
            <CardHeader>
              <CardTitle>Clinical Quality Measures</CardTitle>
              <CardDescription>Performance against quality benchmarks and targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {qualityMeasures.map((measure) => (
                  <div key={measure.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{measure.name}</h4>
                        <p className="text-sm text-muted-foreground">{measure.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(measure.trend)}
                        <Badge variant={measure.current >= measure.target ? "default" : "secondary"}>
                          {measure.current}%
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current: {measure.current}%</span>
                        <span>Target: {measure.target}%</span>
                      </div>
                      <Progress value={measure.current} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quality Summary */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Overall Quality Score</h4>
                    <p className="text-sm text-muted-foreground">Average across all measures</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">86%</div>
                    <div className="text-sm text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +3% from last month
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Provider vs Peer Comparison</CardTitle>
                  <CardDescription>
                    Performance benchmarking against anonymized peer data and top quartile providers
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={comparisonView === "individual" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setComparisonView("individual")}
                  >
                    Individual Metrics
                  </Button>
                  <Button
                    variant={comparisonView === "composite" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setComparisonView("composite")}
                  >
                    Composite Scores
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {comparisonView === "individual" ? (
                <div className="space-y-8">
                  <div className="h-[450px]">
                    <ChartContainer
                      config={{
                        provider: { label: "Your Performance", color: "#3b82f6" },
                        peerAvg: { label: "Peer Average", color: "#94a3b8" },
                        topQuartile: { label: "Top Quartile", color: "#10b981" },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={peerComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis
                            dataKey="metric"
                            angle={-35}
                            textAnchor="end"
                            height={100}
                            interval={0}
                            tick={{ fontSize: 11 }}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend wrapperStyle={{ paddingTop: "10px" }} iconType="rect" />
                          <Bar
                            dataKey="provider"
                            fill="#3b82f6"
                            name="Your Performance"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={60}
                          />
                          <Bar
                            dataKey="peerAvg"
                            fill="#94a3b8"
                            name="Peer Average"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={60}
                          />
                          <Bar
                            dataKey="topQuartile"
                            fill="#10b981"
                            name="Top Quartile"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={60}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-base">Detailed Performance Breakdown</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {peerComparisonData.map((item, index) => {
                        const vsPeer = item.provider - item.peerAvg
                        const vsTop = item.provider - item.topQuartile
                        return (
                          <div
                            key={index}
                            className="border-2 rounded-lg p-5 space-y-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between">
                              <h5 className="font-semibold text-base">{item.metric}</h5>
                              <div className="flex items-center gap-3">
                                <Badge variant={vsPeer >= 0 ? "default" : "secondary"} className="px-3 py-1">
                                  {vsPeer >= 0 ? "+" : ""}
                                  {vsPeer.toFixed(1)} vs Peer
                                </Badge>
                                <Badge variant={vsTop >= 0 ? "default" : "outline"} className="px-3 py-1">
                                  {vsTop >= 0 ? "+" : ""}
                                  {vsTop.toFixed(1)} vs Top
                                </Badge>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                              <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-muted-foreground text-sm mb-2">Your Performance</div>
                                <div className="text-2xl font-bold text-blue-600">{item.provider}</div>
                              </div>
                              <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-muted-foreground text-sm mb-2">Peer Average</div>
                                <div className="text-2xl font-bold text-gray-600">{item.peerAvg}</div>
                              </div>
                              <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-muted-foreground text-sm mb-2">Top Quartile</div>
                                <div className="text-2xl font-bold text-green-600">{item.topQuartile}</div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="h-[450px]">
                    <ChartContainer
                      config={{
                        provider: { label: "Your Performance", color: "#3b82f6" },
                        peerAvg: { label: "Peer Average", color: "#94a3b8" },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={compositeScoreData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis
                            dataKey="category"
                            angle={-35}
                            textAnchor="end"
                            height={100}
                            interval={0}
                            tick={{ fontSize: 11 }}
                          />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend wrapperStyle={{ paddingTop: "10px" }} iconType="rect" />
                          <Bar
                            dataKey="provider"
                            fill="#3b82f6"
                            name="Your Performance"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={80}
                          />
                          <Bar
                            dataKey="peerAvg"
                            fill="#94a3b8"
                            name="Peer Average"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={80}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {compositeScoreData.map((item, index) => {
                      const difference = item.provider - item.peerAvg
                      return (
                        <Card key={index} className="border-2">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h5 className="font-semibold text-sm">{item.category}</h5>
                              <Badge variant={difference >= 0 ? "default" : "secondary"} className="px-2 py-1">
                                {difference >= 0 ? "+" : ""}
                                {difference}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-3xl font-bold text-blue-600 mb-1">{item.provider}</div>
                                <div className="text-xs text-muted-foreground">Your Score</div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-semibold text-gray-600 mb-1">{item.peerAvg}</div>
                                <div className="text-xs text-muted-foreground">Peer Avg</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>

                  {/* Overall Performance Summary */}
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-blue-900">Overall Performance Ranking</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            You are performing above peer average across all composite categories
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-4xl font-bold text-blue-600">86</div>
                          <div className="text-sm text-blue-700">Composite Score</div>
                          <Badge className="mt-2 bg-blue-600">Top 25% Nationally</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Anonymization Notice */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex items-start gap-3">
                  <Eye className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h5 className="font-medium text-sm mb-1">Anonymized Peer Data</h5>
                    <p className="text-xs text-muted-foreground">
                      All peer comparison data is anonymized and aggregated from providers with similar patient
                      populations and practice settings. Individual provider identities are not disclosed.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk">
          {/* Risk Stratification */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>Current patient risk stratification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={riskStratificationData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {riskStratificationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {riskStratificationData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value} patients</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Factors Analysis</CardTitle>
                <CardDescription>Key factors contributing to patient risk levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { factor: "Medication Non-Adherence", impact: 85, patients: 23 },
                    { factor: "Missed Appointments", impact: 72, patients: 18 },
                    { factor: "Comorbid Conditions", impact: 68, patients: 31 },
                    { factor: "Social Determinants", impact: 61, patients: 15 },
                    { factor: "Assessment Non-Completion", impact: 54, patients: 12 },
                  ].map((factor, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{factor.factor}</span>
                        <span className="text-muted-foreground">{factor.patients} patients</span>
                      </div>
                      <Progress value={factor.impact} className="h-2" />
                      <div className="text-xs text-muted-foreground">Impact Score: {factor.impact}%</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Action Required</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    23 patients with medication non-adherence need immediate intervention
                  </p>
                  <Button size="sm" className="mt-2">
                    View Patient List
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution">
          {/* Patient Distribution Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient Distribution by Health Index</CardTitle>
                <CardDescription>Counts by category for drill-down</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: "Optimal", value: 28, color: "hsl(var(--chart-2))" },
                    { name: "Low Risk", value: 46, color: "hsl(var(--chart-5))" },
                    { name: "Moderate Risk", value: 52, color: "hsl(var(--chart-1))" },
                    { name: "High Risk", value: 21, color: "hsl(var(--chart-3))" },
                    { name: "Critical", value: 9, color: "hsl(var(--chart-4))" },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center justify-between border rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button size="sm" variant="outline" className="bg-transparent">
                    Drill down to patient list
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assessment Status Distribution</CardTitle>
                <CardDescription>Completed, Pending, Not Responded, Denied</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: "Completed", value: 84 },
                    { name: "Pending", value: 32 },
                    { name: "Not Responded", value: 26 },
                    { name: "Denied", value: 14 },
                  ].map((s) => (
                    <div key={s.name} className="flex items-center justify-between border rounded-lg p-3">
                      <span className="text-sm">{s.name}</span>
                      <span className="font-medium">{s.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      {/* end Provider vs Team */}
    </div>
  )
}
