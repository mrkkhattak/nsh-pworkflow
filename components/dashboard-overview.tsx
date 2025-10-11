"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Users, MessageSquare, FileText } from "lucide-react"
import { AssessmentDialog } from "@/components/assessment-dialog"
import { getPatientById, getAssessmentById } from "@/lib/nsh-assessment-mock"

const mockPatients = [
  { id: 1, healthIndexScore: 75, unreadMessages: 2 },
  { id: 2, healthIndexScore: 42, unreadMessages: 3 },
  { id: 3, healthIndexScore: 68, unreadMessages: 0 },
  { id: 4, healthIndexScore: 55, unreadMessages: 1 },
  { id: 5, healthIndexScore: 82, unreadMessages: 4 },
  { id: 6, healthIndexScore: 38, unreadMessages: 2 },
  { id: 7, healthIndexScore: 91, unreadMessages: 0 },
  { id: 8, healthIndexScore: 47, unreadMessages: 3 },
  { id: 9, healthIndexScore: 73, unreadMessages: 1 },
  { id: 10, healthIndexScore: 29, unreadMessages: 2 },
  { id: 11, healthIndexScore: 64, unreadMessages: 0 },
  { id: 12, healthIndexScore: 51, unreadMessages: 1 },
  { id: 13, healthIndexScore: 88, unreadMessages: 2 },
  { id: 14, healthIndexScore: 35, unreadMessages: 4 },
  { id: 15, healthIndexScore: 70, unreadMessages: 1 },
]

const riskAlerts = [
  {
    id: 1,
    patientId: 1,
    patient: "Sarah Johnson",
    type: "High Health Index",
    description: "Health Index Score is above 70.",
    action: "Review Assessment",
    assessmentDate: "2025-01-01",
  },
  {
    id: 2,
    patientId: 2,
    patient: "Robert Williams",
    type: "Critical Flags",
    description: "Patient has 3 critical flags.",
    action: "Immediate Follow-up",
    assessmentDate: "2024-12-28",
  },
]

const statusCounts = {
  pending: 4,
}

export function DashboardOverview() {
  const [assessmentDialogOpen, setAssessmentDialogOpen] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null)
  const [selectedAssessmentDate, setSelectedAssessmentDate] = useState<string | null>(null)

  return (
    <div className="space-y-8">
      {riskAlerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-red-700 text-lg font-semibold">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5" />
              </div>
              High Priority Alerts ({riskAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {riskAlerts.map((alert) => (
              <div key={alert.id} className="p-4 bg-white rounded-lg border border-red-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <h4 className="font-medium text-red-900">
                      {alert.patient} - {alert.type}
                    </h4>
                    <p className="text-sm text-red-700">{alert.description}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link href={`/patients/${alert.patientId}`}>
                      <Button size="sm" variant="outline" className="text-xs bg-transparent">
                        View Details
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white text-xs"
                      onClick={() => {
                        setSelectedPatientId(alert.patientId)
                        setSelectedAssessmentDate(alert.assessmentDate)
                        setAssessmentDialogOpen(true)
                      }}
                    >
                      {alert.action}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                <p className="text-3xl font-semibold text-foreground">{mockPatients.length}</p>
                <p className="text-xs text-muted-foreground">Active in care</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Assessments Due</p>
                <p className="text-3xl font-semibold text-foreground">{statusCounts.pending}</p>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">High Risk</p>
                <p className="text-3xl font-semibold text-red-600">
                  {mockPatients.filter((p) => p.healthIndexScore < 60).length}
                </p>
                <p className="text-xs text-muted-foreground">Need immediate attention</p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Unread Messages</p>
                <p className="text-3xl font-semibold text-foreground">
                  {mockPatients.reduce((sum, p) => sum + p.unreadMessages, 0)}
                </p>
                <p className="text-xs text-muted-foreground">From patients</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assessment Dialog */}
      <AssessmentDialog
        open={assessmentDialogOpen}
        onOpenChange={setAssessmentDialogOpen}
        patient={selectedPatientId ? getPatientById(selectedPatientId) : null}
        assessment={selectedPatientId && selectedAssessmentDate ? getAssessmentById(selectedPatientId, selectedAssessmentDate) : null}
      />
    </div>
  )
}
