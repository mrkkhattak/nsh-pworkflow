"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { QuickScheduleDialog } from "@/components/quick-schedule-dialog"
import { PatientAssessmentTracking } from "@/components/patient-assessment-tracking"
import { MessagingTeamHub } from "@/components/messaging-team-hub"
import { DimensionProgressCard } from "@/components/dimension-progress-card"
import { MedicationAdherenceTrends } from "@/components/medication-adherence-trends"
import { PatientOutcomeMeasures } from "@/components/patient-outcome-measures"
import { getPatientById, getAssessmentById, healthDimensionsConfig, getGoalsByDimension, getActiveInterventionsByDimension, getRiskLevel } from "@/lib/nsh-assessment-mock"
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  Activity,
  Heart,
  AlertTriangle,
  MessageSquare,
  UserCheck,
  Pill,
  TrendingUp,
  TrendingDown,
  Edit,
  Plus,
  ExternalLink,
  Clock,
  Video,
  Target,
  CheckCircle,
} from "lucide-react"

// Mock patient data
const mockPatientDetail = {
  id: 1,
  name: "Sarah Johnson",
  avatar: "/placeholder.svg?height=80&width=80",
  age: 45,
  dateOfBirth: "1979-03-15",
  gender: "Female",
  phone: "(555) 123-4567",
  email: "sarah.johnson@email.com",
  address: "123 Main St, Anytown, ST 12345",
  emergencyContact: {
    name: "John Johnson",
    relationship: "Spouse",
    phone: "(555) 987-6543",
  },
  insurance: {
    provider: "Blue Cross Blue Shield",
    policyNumber: "BC123456789",
    groupNumber: "GRP001",
  },
  primaryConditions: [
    { name: "Major Depressive Disorder", icd10: "F33.1", severity: "Moderate", dateOnset: "2024-08-15" },
    { name: "Generalized Anxiety Disorder", icd10: "F41.1", severity: "Mild", dateOnset: "2024-09-01" },
  ],
  riskFactors: [
    { factor: "Family History of Depression", level: "High", description: "Mother and sister with MDD" },
    { factor: "Work-related Stress", level: "Moderate", description: "Recent job transition" },
    { factor: "Sleep Disturbance", level: "Moderate", description: "Difficulty maintaining sleep" },
  ],
  currentMedications: [
    {
      name: "Sertraline",
      dosage: "75mg",
      frequency: "Daily",
      prescriber: "Dr. Anderson",
      startDate: "2024-10-01",
      adherence: 85,
      adherenceHistory: [
        { date: "2024-10-01", adherence: 60, missedDoses: 12 },
        { date: "2024-10-15", adherence: 65, missedDoses: 10 },
        { date: "2024-11-01", adherence: 70, missedDoses: 9 },
        { date: "2024-11-15", adherence: 75, missedDoses: 7 },
        { date: "2024-12-01", adherence: 80, missedDoses: 6 },
        { date: "2024-12-15", adherence: 82, missedDoses: 5 },
        { date: "2025-01-01", adherence: 85, missedDoses: 4 },
        { date: "2025-01-15", adherence: 85, missedDoses: 4 },
      ],
      lastDoseTaken: "2025-01-17 08:30 AM",
      refillDate: "2025-02-01",
      adherenceGoal: 90,
      consecutiveDays: 12,
    },
    {
      name: "Lorazepam",
      dosage: "0.5mg",
      frequency: "As needed",
      prescriber: "Dr. Anderson",
      startDate: "2024-11-15",
      adherence: 90,
      adherenceHistory: [
        { date: "2024-11-15", adherence: 85, missedDoses: 2 },
        { date: "2024-12-01", adherence: 87, missedDoses: 2 },
        { date: "2024-12-15", adherence: 88, missedDoses: 1 },
        { date: "2025-01-01", adherence: 90, missedDoses: 1 },
        { date: "2025-01-15", adherence: 90, missedDoses: 1 },
      ],
      lastDoseTaken: "2025-01-16 10:15 PM",
      refillDate: "2025-02-15",
      adherenceGoal: 95,
      consecutiveDays: 8,
    },
  ],
  vitalSigns: {
    lastUpdated: "2025-01-15",
    bloodPressure: "118/76",
    heartRate: 72,
    weight: "145 lbs",
    height: "5'6\"",
    bmi: 23.4,
  },
  careTeam: [
    {
      name: "Dr. Michael Anderson",
      role: "Primary Psychiatrist",
      specialty: "Psychiatry",
      phone: "(555) 111-2222",
      lastContact: "2025-01-15",
    },
    {
      name: "Lisa Chen, LCSW",
      role: "Therapist",
      specialty: "Clinical Social Work",
      phone: "(555) 333-4444",
      lastContact: "2025-01-12",
    },
    {
      name: "Dr. Sarah Williams",
      role: "Primary Care Physician",
      specialty: "Family Medicine",
      phone: "(555) 555-6666",
      lastContact: "2024-12-20",
    },
  ],
  recentAssessments: [
    {
      date: "2025-01-01",
      type: "Mental Health - Depression",
      score: 11,
      interpretation: "Moderate Depression",
      change: "Improved",
      provider: "Dr. Anderson",
    },
    {
      date: "2025-01-01",
      type: "Mental Health - Anxiety",
      score: 6,
      interpretation: "Mild Anxiety",
      change: "Improved",
      provider: "Dr. Anderson",
    },
    {
      date: "2024-12-15",
      type: "Functional Health",
      score: 18,
      interpretation: "Moderate Disability",
      change: "Improved",
      provider: "Lisa Chen",
    },
  ],
  upcomingAppointments: [
    {
      date: "2025-01-22",
      time: "10:00 AM",
      provider: "Dr. Anderson",
      type: "Follow-up",
      location: "Office",
      status: "Confirmed",
    },
    {
      date: "2025-01-25",
      time: "2:00 PM",
      provider: "Lisa Chen",
      type: "Therapy Session",
      location: "Telehealth",
      status: "Confirmed",
    },
  ],
  recentMessages: [
    {
      date: "2025-01-16",
      from: "Sarah Johnson",
      to: "Dr. Anderson",
      subject: "Side effects question",
      preview: "I've been experiencing some mild nausea...",
      status: "Unread",
    },
    {
      date: "2025-01-14",
      from: "Dr. Anderson",
      to: "Sarah Johnson",
      subject: "Lab results available",
      preview: "Your recent lab work shows...",
      status: "Read",
    },
  ],
}

export function PatientDetailView() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showQuickSchedule, setShowQuickSchedule] = useState(false)
  const [responsesOpenFor, setResponsesOpenFor] = useState<string | null>(null)

  const latestAssessment = getAssessmentById(mockPatientDetail.id)

  // Persist view state and scroll per ERR-PDV-004
  useState(() => {
    if (typeof window !== "undefined") {
      const savedTab = window.sessionStorage.getItem("pdv.activeTab")
      if (savedTab) setActiveTab(savedTab)
      const savedScroll = window.sessionStorage.getItem("pdv.scrollY")
      if (savedScroll) window.scrollTo(0, Number(savedScroll))
      window.addEventListener("beforeunload", () => {
        window.sessionStorage.setItem("pdv.scrollY", String(window.scrollY))
      })
    }
    return undefined
  })

  const getRiskBadgeVariant = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return "destructive"
      case "moderate":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const getChangeIcon = (change: string) => {
    switch (change.toLowerCase()) {
      case "improved":
        return <TrendingDown className="h-4 w-4 text-green-600" />
      case "worsened":
        return <TrendingUp className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const patientForScheduling = {
    id: mockPatientDetail.id,
    name: mockPatientDetail.name,
    avatar: mockPatientDetail.avatar,
    condition: mockPatientDetail.primaryConditions[0]?.name || "General Care",
    riskLevel: mockPatientDetail.primaryConditions[0]?.severity.toLowerCase() || "moderate",
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50/30 min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/patients">
          <Button variant="outline" className="bg-white hover:bg-gray-50">
            ← Back to Patients
          </Button>
        </Link>
      </div>

      {/* Patient Header */}
      <Card className="shadow-sm border-gray-200 bg-white">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={mockPatientDetail.avatar || "/placeholder.svg"} alt={mockPatientDetail.name} />
                <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-700">
                  {mockPatientDetail.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-semibold text-gray-900">{mockPatientDetail.name}</h1>
                  <p className="text-gray-600 text-lg">
                    {mockPatientDetail.age} years old • {mockPatientDetail.gender} • DOB:{" "}
                    {new Date(mockPatientDetail.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {mockPatientDetail.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {mockPatientDetail.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {mockPatientDetail.address}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {mockPatientDetail.primaryConditions.map((condition, index) => (
                    <Badge key={index} variant={getRiskBadgeVariant(condition.severity)} className="text-xs">
                      {condition.name} ({condition.severity})
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setShowQuickSchedule(true)}>
                <Calendar className="h-4 w-4 mr-2" />
                Quick Schedule
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-sm border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Last Assessment</p>
                <p className="text-2xl font-bold text-gray-900">Jan 1</p>
                {latestAssessment?.mcid && (
                  <p className={`text-xs ${
                    latestAssessment.mcid.status === "improved"
                      ? "text-emerald-600"
                      : latestAssessment.mcid.status === "worsened"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}>
                    MCID: {latestAssessment.mcid.description}
                  </p>
                )}
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Medication Adherence</p>
                <p className="text-2xl font-bold text-gray-900">85%</p>
                <p className="text-xs text-yellow-600">Needs attention</p>
              </div>
              <Pill className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="shadow-sm border-gray-200 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setShowQuickSchedule(true)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Next Appointment</p>
                <p className="text-2xl font-bold text-gray-900">Jan 22</p>
                <p className="text-xs text-blue-600">Dr. Anderson</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread Messages</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
                <p className="text-xs text-red-600">Requires response</p>
              </div>
              <MessageSquare className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => {
          setActiveTab(v)
          if (typeof window !== "undefined") window.sessionStorage.setItem("pdv.activeTab", v)
        }}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-7 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="assessments" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Assessments
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Areas of Opportunity
          </TabsTrigger>
          <TabsTrigger value="goals" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Goals
          </TabsTrigger>
          <TabsTrigger value="medications" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Medications
          </TabsTrigger>
          <TabsTrigger value="outcomes" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Outcome Measures
          </TabsTrigger>
          <TabsTrigger value="progress" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Medical History */}
            <Card className="shadow-sm border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Medical History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockPatientDetail.primaryConditions.map((condition, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{condition.name}</h4>
                      <Badge variant={getRiskBadgeVariant(condition.severity)} className="text-xs">
                        {condition.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">ICD-10: {condition.icd10}</p>
                    <p className="text-sm text-gray-600">Onset: {new Date(condition.dateOnset).toLocaleDateString()}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Risk Factors */}
            <Card className="shadow-sm border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Risk Factors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockPatientDetail.riskFactors.map((risk, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{risk.factor}</h4>
                      <Badge variant={getRiskBadgeVariant(risk.level)} className="text-xs">
                        {risk.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{risk.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Care Team */}
            <Card className="shadow-sm border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Care Team
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockPatientDetail.careTeam.map((member, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{member.name}</h4>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">{member.role}</p>
                    <p className="text-sm text-gray-600">{member.specialty}</p>
                    <p className="text-xs text-gray-500">
                      Last contact: {new Date(member.lastContact).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Vital Signs */}
          <Card className="shadow-sm border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Vital Signs
                <Badge variant="outline" className="ml-2 text-xs">
                  Last updated: {new Date(mockPatientDetail.vitalSigns.lastUpdated).toLocaleDateString()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Blood Pressure</p>
                  <p className="text-2xl font-bold text-gray-900">{mockPatientDetail.vitalSigns.bloodPressure}</p>
                  <p className="text-xs text-green-600">Normal</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Heart Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{mockPatientDetail.vitalSigns.heartRate}</p>
                  <p className="text-xs text-green-600">Normal</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Weight</p>
                  <p className="text-2xl font-bold text-gray-900">{mockPatientDetail.vitalSigns.weight}</p>
                  <p className="text-xs text-gray-600">Stable</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Height</p>
                  <p className="text-2xl font-bold text-gray-900">{mockPatientDetail.vitalSigns.height}</p>
                  <p className="text-xs text-gray-600">-</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">BMI</p>
                  <p className="text-2xl font-bold text-gray-900">{mockPatientDetail.vitalSigns.bmi}</p>
                  <p className="text-xs text-green-600">Normal</p>
                </div>
                <div className="text-center">
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Reading
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-6">
          <Card className="shadow-sm border-gray-200 bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Recent Assessments</CardTitle>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Assessment
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockPatientDetail.recentAssessments.map((assessment, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900">{assessment.type}</h4>
                          <p className="text-sm text-gray-600">{new Date(assessment.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{assessment.score}</p>
                          <p className="text-xs text-gray-600">Score</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{assessment.interpretation}</p>
                          <div className="flex items-center gap-1">
                            {getChangeIcon(assessment.change)}
                            <p className="text-sm text-gray-600">{assessment.change}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{assessment.provider}</Badge>
                        <Link href={`/assessments/${mockPatientDetail.id}/${encodeURIComponent(assessment.date)}`}>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          {latestAssessment ? (
            <Card className="shadow-sm border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Areas of Opportunity</CardTitle>
                <p className="text-sm text-gray-600">
                  All opportunities identified across health dimensions from latest assessment (
                  {new Date(latestAssessment.date).toLocaleDateString()})
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {latestAssessment.opportunities.strengths.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-emerald-700 mb-3">
                      Areas of Strength (Low Risk) • {latestAssessment.opportunities.strengths.length}
                    </h3>
                    <div className="space-y-2">
                      {latestAssessment.opportunities.strengths.map((opp, idx) => (
                        <div key={idx} className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                          <div className="mb-1">
                            <span className="font-medium text-sm text-gray-900">
                              {opp.dimensionName}
                              {opp.subcategoryName && ` - ${opp.subcategoryName}`}
                            </span>
                            <Badge variant="outline" className="ml-2 text-emerald-700 border-emerald-300 text-xs">
                              Score: {opp.score}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">{opp.recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {latestAssessment.opportunities.moderate.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-yellow-700 mb-3">
                      Areas of Moderate Opportunity • {latestAssessment.opportunities.moderate.length}
                    </h3>
                    <div className="space-y-2">
                      {latestAssessment.opportunities.moderate.map((opp, idx) => (
                        <div key={idx} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="mb-1">
                            <span className="font-medium text-sm text-gray-900">
                              {opp.dimensionName}
                              {opp.subcategoryName && ` - ${opp.subcategoryName}`}
                            </span>
                            <Badge variant="outline" className="ml-2 text-yellow-700 border-yellow-300 text-xs">
                              Score: {opp.score}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">{opp.recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {latestAssessment.opportunities.critical.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-orange-700 mb-3">
                      Areas of Critical Opportunity • {latestAssessment.opportunities.critical.length}
                    </h3>
                    <div className="space-y-2">
                      {latestAssessment.opportunities.critical.map((opp, idx) => (
                        <div key={idx} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <div className="mb-1">
                            <span className="font-medium text-sm text-gray-900">
                              {opp.dimensionName}
                              {opp.subcategoryName && ` - ${opp.subcategoryName}`}
                            </span>
                            <Badge variant="outline" className="ml-2 text-orange-700 border-orange-300 text-xs">
                              Score: {opp.score}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">{opp.recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {latestAssessment.opportunities.strengths.length === 0 &&
                  latestAssessment.opportunities.moderate.length === 0 &&
                  latestAssessment.opportunities.critical.length === 0 && (
                    <div className="text-center py-8">
                      <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-sm text-gray-500">No opportunities identified in the latest assessment.</p>
                    </div>
                  )}
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-sm border-gray-200 bg-white">
              <CardContent className="py-12">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm text-gray-500 mb-2">No assessment data available for this patient.</p>
                  <p className="text-xs text-gray-400">Complete an assessment to see areas of opportunity.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="medications" className="space-y-6">
          <MedicationAdherenceTrends medications={mockPatientDetail.currentMedications} />

          <Card className="shadow-sm border-gray-200 bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Current Medications</CardTitle>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Medication
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockPatientDetail.currentMedications.map((medication, index) => (
                <Card key={index} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900">{medication.name}</h4>
                          <p className="text-sm text-gray-600">
                            {medication.dosage} • {medication.frequency}
                          </p>
                          <p className="text-xs text-gray-500">Prescribed by {medication.prescriber}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Adherence</p>
                          <p className="text-2xl font-bold text-gray-900">{medication.adherence}%</p>
                          <Progress value={medication.adherence} className="w-20 h-2 mt-1" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Started</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(medication.startDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card className="shadow-sm border-gray-200 bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Patient Goals</CardTitle>
                  <p className="text-sm text-gray-600">View and manage all health goals for this patient</p>
                </div>
                <Link href={`/patients/${mockPatientDetail.id}/goals`}>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Target className="h-4 w-4 mr-2" />
                    View All Goals
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="shadow-sm border-gray-200 bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Active Goals</p>
                        <p className="text-2xl font-bold text-gray-900">8</p>
                      </div>
                      <Target className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200 bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">At Risk</p>
                        <p className="text-2xl font-bold text-gray-900">2</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200 bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Achieved</p>
                        <p className="text-2xl font-bold text-gray-900">3</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">Recent Goals</h3>
                <div className="space-y-3">
                  {healthDimensionsConfig.slice(0, 4).map((dimension) => {
                    const goals = getGoalsByDimension(dimension.id)
                    if (goals.length === 0) return null
                    const goal = goals[0]

                    return (
                      <Card key={dimension.id} className="border-l-4" style={{ borderLeftColor: dimension.color }}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-blue-100 text-blue-800 text-xs">
                                  {dimension.name}
                                </Badge>
                                <Badge className={`${goal.status === "achieved" ? "bg-green-100 text-green-800" : goal.status === "at-risk" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"} text-xs`}>
                                  {goal.status}
                                </Badge>
                              </div>
                              <h4 className="font-medium text-gray-900 text-sm mb-1">{goal.description}</h4>
                              <div className="flex items-center gap-4 text-xs text-gray-600">
                                <span>Baseline: {goal.baseline}</span>
                                <TrendingDown className="h-3 w-3" />
                                <span>Current: {goal.current}</span>
                                <TrendingDown className="h-3 w-3" />
                                <span>Target: {goal.target}</span>
                              </div>
                              <div className="mt-2">
                                <Progress value={goal.progress} className="h-1.5" />
                                <p className="text-xs text-gray-500 mt-1">{goal.progress}% progress</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outcomes" className="space-y-6">
          <PatientOutcomeMeasures patientId={mockPatientDetail.id.toString()} />
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card className="shadow-sm border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Health Dimensions Overview</CardTitle>
              <p className="text-sm text-gray-600">Track progress, goals, and interventions across all health dimensions (Lower score = Better health)</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {healthDimensionsConfig.map((dimension) => {
                const mockScore = Math.floor(Math.random() * 60) + 15
                const mockBaseline = mockScore + Math.floor(Math.random() * 15) + 5
                const mockTarget = Math.max(mockScore - Math.floor(Math.random() * 20) - 10, 10)
                const riskLevel = getRiskLevel(mockScore)
                const goals = getGoalsByDimension(dimension.id)
                const interventions = getActiveInterventionsByDimension(dimension.id)

                return (
                  <DimensionProgressCard
                    key={dimension.id}
                    dimensionId={dimension.id}
                    dimensionName={dimension.name}
                    score={mockScore}
                    baseline={mockBaseline}
                    target={mockTarget}
                    riskLevel={riskLevel}
                    color={dimension.color}
                    goals={goals}
                    interventions={interventions}
                    onNavigate={(dimId) => {
                      console.log("Navigate to dimension:", dimId)
                    }}
                  />
                )
              })}
            </CardContent>
          </Card>

          <PatientAssessmentTracking />
        </TabsContent>
      </Tabs>

      {/* QuickScheduleDialog component */}
      <QuickScheduleDialog
        open={showQuickSchedule}
        onOpenChange={setShowQuickSchedule}
        patient={patientForScheduling}
        onScheduled={() => {
          // Handle successful scheduling
          console.log("Appointment scheduled successfully")
        }}
      />

    </div>
  )
}
