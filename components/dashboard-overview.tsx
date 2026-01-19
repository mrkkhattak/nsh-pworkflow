"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Users, MessageSquare, FileText } from "lucide-react"

const mockPatients = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  healthIndexScore: Math.floor(Math.random() * 100),
  unreadMessages: Math.floor(Math.random() * 5),
}))

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
                    <Link href={`/assessments/${alert.patientId}/${encodeURIComponent(alert.assessmentDate)}`}>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white text-xs">
                        {alert.action}
                      </Button>
                    </Link>
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
    </div>
  )
}
