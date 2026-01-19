"use client"

import { SideNavigation } from "@/components/side-navigation"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <SideNavigation />

      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex justify-end">
              <Link href="/notifications">
                <Button variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
              </Link>
            </div>

            {children}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
