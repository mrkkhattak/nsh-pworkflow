"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getPatientById } from "@/lib/nsh-assessment-mock"
import { Home, Target, Activity, Calendar, MessageSquare, Menu, X } from "lucide-react"

interface PatientPortalLayoutProps {
  children: React.ReactNode
  patientId: string
}

export function PatientPortalLayout({ children, patientId }: PatientPortalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const patient = getPatientById(Number(patientId))

  const navigation = [
    { name: "Overview", href: `/patient-portal/${patientId}`, icon: Home },
    { name: "My Goals", href: `/patient-portal/${patientId}/goals`, icon: Target },
    { name: "My Interventions", href: `/patient-portal/${patientId}/interventions`, icon: Activity },
    { name: "Appointments", href: `/patient-portal/${patientId}/appointments`, icon: Calendar },
    { name: "Messages", href: `/patient-portal/${patientId}/messages`, icon: MessageSquare },
  ]

  const isActive = (href: string) => pathname === href

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Patient Not Found</h2>
            <p className="text-gray-600">Unable to load patient information.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">My Health Portal</h1>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" alt={patient.name} />
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {patient.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                <p className="text-xs text-gray-600">Patient Portal</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <aside
            className={`${
              sidebarOpen ? "block" : "hidden"
            } lg:block fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] lg:h-auto w-64 bg-white lg:bg-transparent border-r lg:border-r-0 border-gray-200 p-4 lg:p-0 z-20`}
          >
            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={isActive(item.href) ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        isActive(item.href)
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </aside>

          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
