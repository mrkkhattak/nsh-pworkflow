"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { OutcomeMetricCard } from "@/components/outcome-metric-card"
import { getOutcomeMetricsByPatient } from "@/lib/outcome-metrics-mock"
import {
  Activity,
  Users,
  Shield,
  BarChart3,
  TrendingUp,
  Target,
  Heart,
  AlertCircle
} from "lucide-react"

interface PatientOutcomesTrackingProps {
  patientId: number
}

export function PatientOutcomesTracking({ patientId }: PatientOutcomesTrackingProps) {
  const [activeTab, setActiveTab] = useState("quality-economic")
  const outcomeCategories = getOutcomeMetricsByPatient(patientId)

  const primaryOutcomes = outcomeCategories.find((cat) => cat.categoryId === "outcome_metrics")
  const personalizedMetrics = outcomeCategories.find((cat) => cat.categoryId === "personalized_report_metrics")

  const qualityEconomicDomains = primaryOutcomes?.domains.filter(
    (d) => d.domainId === "quality_economic_outcomes" || d.domainId === "substance_use_cessation"
  ) || []

  const engagementDomains = primaryOutcomes?.domains.filter(
    (d) => d.domainId === "patient_engagement" || d.domainId === "resource_utilization"
  ) || []

  const safetyDomains = primaryOutcomes?.domains.filter(
    (d) => d.domainId === "patient_satisfaction" || d.domainId === "safety_outcomes"
  ) || []

  const getTabIcon = (tabId: string) => {
    switch (tabId) {
      case "quality-economic":
        return <Activity className="h-4 w-4" />
      case "engagement":
        return <Users className="h-4 w-4" />
      case "safety":
        return <Shield className="h-4 w-4" />
      case "comprehensive":
        return <BarChart3 className="h-4 w-4" />
      default:
        return null
    }
  }

  const renderSummaryStats = () => {
    const allMetrics = primaryOutcomes?.domains.flatMap((d) => d.metrics) || []
    const excellentCount = allMetrics.filter((m) => m.status === "excellent").length
    const goodCount = allMetrics.filter((m) => m.status === "good").length
    const needsAttentionCount = allMetrics.filter((m) => m.status === "needs-attention").length
    const improvingCount = allMetrics.filter((m) => m.trend === "improving").length

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Excellent Performance</p>
                <p className="text-2xl font-bold text-green-900">{excellentCount}</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Good Performance</p>
                <p className="text-2xl font-bold text-blue-900">{goodCount}</p>
              </div>
              <Heart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 font-medium">Needs Attention</p>
                <p className="text-2xl font-bold text-yellow-900">{needsAttentionCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 font-medium">Improving Trends</p>
                <p className="text-2xl font-bold text-gray-900">{improvingCount}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card className="shadow-sm border-gray-200 bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Patient Assessment & Outcomes Tracking
        </CardTitle>
        <CardDescription className="text-gray-600">
          Comprehensive tracking of clinical outcomes, engagement metrics, and health indicators
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderSummaryStats()}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger
              value="quality-economic"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2"
            >
              {getTabIcon("quality-economic")}
              <span className="hidden sm:inline">Quality & Economic</span>
              <span className="sm:hidden">Quality</span>
            </TabsTrigger>
            <TabsTrigger
              value="engagement"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2"
            >
              {getTabIcon("engagement")}
              <span>Engagement</span>
            </TabsTrigger>
            <TabsTrigger
              value="safety"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2"
            >
              {getTabIcon("safety")}
              <span>Safety</span>
            </TabsTrigger>
            <TabsTrigger
              value="comprehensive"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2"
            >
              {getTabIcon("comprehensive")}
              <span className="hidden sm:inline">Comprehensive</span>
              <span className="sm:hidden">All</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quality-economic" className="space-y-6">
            {qualityEconomicDomains.map((domain) => (
              <div key={domain.domainId} className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">{domain.domainName}</h3>
                  <Badge variant="outline" className="text-xs">
                    {domain.metrics.length} metrics
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {domain.metrics.map((metric) => (
                    <OutcomeMetricCard key={metric.metricId} metric={metric} />
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            {engagementDomains.map((domain) => (
              <div key={domain.domainId} className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">{domain.domainName}</h3>
                  <Badge variant="outline" className="text-xs">
                    {domain.metrics.length} metrics
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {domain.metrics.map((metric) => (
                    <OutcomeMetricCard key={metric.metricId} metric={metric} />
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="safety" className="space-y-6">
            {safetyDomains.map((domain) => (
              <div key={domain.domainId} className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">{domain.domainName}</h3>
                  <Badge variant="outline" className="text-xs">
                    {domain.metrics.length} metrics
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {domain.metrics.map((metric) => (
                    <OutcomeMetricCard key={metric.metricId} metric={metric} />
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="comprehensive" className="space-y-6">
            {personalizedMetrics?.domains.map((domain) => (
              <div key={domain.domainId} className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Comprehensive Health Profile
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {domain.metrics.length} metrics
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {domain.metrics.slice(0, 10).map((metric) => (
                    <OutcomeMetricCard key={metric.metricId} metric={metric} />
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
