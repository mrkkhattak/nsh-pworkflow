"use client"

import { useRouter } from "next/navigation"
import { ScoreCard } from "./score-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Assessment, Patient } from "@/lib/nsh-assessment-mock"
import { getRiskColor, getRiskLabel } from "@/lib/nsh-assessment-mock"
import { Activity, Brain, Heart, Zap, Users, Stethoscope, Building2, TrendingUp, ArrowLeft } from "lucide-react"

type Props = {
  patient: Patient
  assessment: Assessment
}

export function AssessmentDetail({ patient, assessment }: Props) {
  const router = useRouter()
  const ghi = assessment.globalHealthIndex
  const ghiRiskLevel = assessment.dimensions.find((d) => d.score === ghi)?.riskLevel || "green"

  const iconMap: Record<string, React.ReactNode> = {
    physical: <Activity className="h-5 w-5 text-gray-600" />,
    mental: <Brain className="h-5 w-5 text-gray-600" />,
    sdoh: <Users className="h-5 w-5 text-gray-600" />,
    engagement: <TrendingUp className="h-5 w-5 text-gray-600" />,
    burden: <Stethoscope className="h-5 w-5 text-gray-600" />,
    medical: <Heart className="h-5 w-5 text-gray-600" />,
    utilization: <Building2 className="h-5 w-5 text-gray-600" />,
    diet: <Zap className="h-5 w-5 text-gray-600" />,
    sleep: <Zap className="h-5 w-5 text-gray-600" />,
    pain: <Zap className="h-5 w-5 text-gray-600" />,
    satisfaction: <Heart className="h-5 w-5 text-gray-600" />,
    cost: <Zap className="h-5 w-5 text-gray-600" />,
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
          Back
        </Button>
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-semibold text-gray-900 text-balance">Assessment Details</h1>
        <p className="text-gray-600">
          {patient.name} • {new Date(assessment.date).toLocaleDateString()}
        </p>
      </div>

      <ScoreCard
        title="Global Health Index"
        score={ghi}
        statusText={getRiskLabel(ghiRiskLevel)}
        statusColorClass={getRiskColor(ghiRiskLevel)}
        icon={<Activity className="h-5 w-5 text-gray-600" />}
        interpretation="The Global Health Index represents the overall health status across all dimensions. Lower scores indicate better health outcomes. This comprehensive metric guides clinical prioritization and treatment planning."
        riskLevel={ghiRiskLevel}
      />

      <Tabs defaultValue="dimensions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="dimensions" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Health Dimensions
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Areas of Opportunity
          </TabsTrigger>
          <TabsTrigger value="actions" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Action Items
          </TabsTrigger>
          <TabsTrigger value="questionnaire" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Questionnaire Responses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dimensions" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              12 Health Dimensions (Lower Score = Better Health)
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {assessment.dimensions.map((dimension) => (
                <ScoreCard
                  key={dimension.id}
                  title={dimension.name}
                  score={dimension.score}
                  statusText={getRiskLabel(dimension.riskLevel)}
                  statusColorClass={getRiskColor(dimension.riskLevel)}
                  icon={iconMap[dimension.id] || <Heart className="h-5 w-5 text-gray-600" />}
                  interpretation={dimension.interpretation}
                  riskLevel={dimension.riskLevel}
                  clickable={true}
                  linkHref={`/assessments/${patient.id}/${encodeURIComponent(assessment.date)}/${dimension.id}`}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Areas of Opportunity</CardTitle>
              <CardDescription>Categorized by risk level and priority for intervention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-emerald-700 mb-3">Areas of Strength (Low Risk)</h3>
                <div className="space-y-2">
                  {assessment.opportunities.strengths.map((opp, idx) => (
                    <div key={idx} className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <div className="mb-1">
                        <span className="font-medium text-sm text-gray-900">
                          {opp.subcategoryName || opp.dimensionName}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{opp.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-yellow-700 mb-3">Areas of Moderate Opportunity</h3>
                <div className="space-y-2">
                  {assessment.opportunities.moderate.map((opp, idx) => (
                    <div key={idx} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="mb-1">
                        <span className="font-medium text-sm text-gray-900">
                          {opp.subcategoryName || opp.dimensionName}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{opp.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-orange-700 mb-3">Areas of Critical Opportunity</h3>
                <div className="space-y-2">
                  {assessment.opportunities.critical.map((opp, idx) => (
                    <div key={idx} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="mb-1">
                        <span className="font-medium text-sm text-gray-900">
                          {opp.subcategoryName || opp.dimensionName}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{opp.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
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
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              Physician-Level Actions
            </h3>
            <div className="space-y-2">
              {assessment.actionItems
                .filter((item) => item.type === "physician")
                .map((item) => (
                  <div key={item.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <span className="font-medium text-sm text-gray-900">
                          {item.providerName} - {item.designation}
                        </span>
                        <p className="text-xs text-gray-700 mt-1">{item.action}</p>
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
                ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Patient-Level Actions
            </h3>
            <div className="space-y-2">
              {assessment.actionItems
                .filter((item) => item.type === "patient")
                .map((item) => (
                  <div key={item.id} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <span className="font-medium text-sm text-gray-900">{item.actionName}</span>
                        <p className="text-xs text-gray-600">Dimension: {item.dimensionName}</p>
                        <p className="text-xs text-gray-700 mt-1">{item.description}</p>
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
                ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Community-Level Actions
            </h3>
            <div className="space-y-2">
              {assessment.actionItems
                .filter((item) => item.type === "community")
                .map((item) => (
                  <div key={item.id} className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <span className="font-medium text-sm text-gray-900">
                          {item.name} - {item.category}
                        </span>
                        <p className="text-xs text-gray-600 mt-1">Eligibility: {item.eligibility}</p>
                        <p className="text-xs text-gray-600">Hours: {item.hoursOfOperation}</p>
                        <p className="text-xs text-gray-600">Contact: {item.contactInfo}</p>
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
                ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              System-Level Actions
            </h3>
            <div className="space-y-2">
              {assessment.actionItems
                .filter((item) => item.type === "system")
                .map((item) => (
                  <div key={item.id} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <span className="font-medium text-sm text-gray-900">
                          {item.name} - {item.category}
                        </span>
                        <p className="text-xs text-gray-700 mt-1">{item.description}</p>
                        <p className="text-xs text-gray-600 mt-1">Expected Impact: {item.expectedImpact}</p>
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
                ))}
            </div>
          </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questionnaire" className="space-y-6">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Questionnaire Responses</CardTitle>
              <CardDescription>Patient responses from the assessment questionnaire</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assessment.questionnaireResponses.map((response) => (
                  <div key={response.questionId} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-900 mb-1">{response.question}</p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Response:</span> {response.responseText}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
