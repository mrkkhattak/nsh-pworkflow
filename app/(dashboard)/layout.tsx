import { SideNavigation } from "@/components/side-navigation"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

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
              <Button variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
                <Bell className="h-4 w-4 mr-2" />
                Notifications (3)
              </Button>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
