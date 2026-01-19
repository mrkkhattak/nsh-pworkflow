"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  KanbanSquare,
  TrendingUp,
  ArrowRightLeft,
  MessageCircle,
  BarChart3,
  Settings,
  Search,
  Home,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  UserCog,
} from "lucide-react"

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, href: "/" },
  { id: "patients", label: "Patient Pipeline", icon: Users, badge: "4", href: "/patients" },
  { id: "tasks", label: "Task Management", icon: KanbanSquare, badge: "12", href: "/tasks" },
  { id: "assessments", label: "Outcomes Tracking", icon: TrendingUp, href: "/outcomes" },
  { id: "referrals", label: "Referrals", icon: ArrowRightLeft, badge: "2", href: "/referrals" },
  { id: "messaging", label: "Messaging", icon: MessageCircle, badge: "7", href: "/messaging" },
  { id: "team", label: "Healthcare Team", icon: UserCog, href: "/team" },
  { id: "analytics", label: "Analytics", icon: BarChart3, href: "/analytics" },
]

export function SideNavigation() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <div
      className={`notion-sidebar flex flex-col h-screen transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-sm">NS</span>
              </div>
              <div>
                <h2 className="font-semibold text-sidebar-foreground">NexSight</h2>
                <p className="text-xs text-muted-foreground">Provider Portal</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0 hover:bg-sidebar-accent"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="p-4 border-b border-sidebar-border/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-sidebar-accent rounded-lg border border-sidebar-border/50 focus:outline-none focus:ring-2 focus:ring-sidebar-ring"
            />
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <div className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link key={item.id} href={item.href}>
              <Button
                variant="ghost"
                className={`w-full justify-start h-10 px-3 transition-colors ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                    : "hover:bg-sidebar-accent text-sidebar-foreground"
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="ml-3 flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </Link>
          )
        })}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border/50">
        {!isCollapsed ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Dr. Anderson" />
                <AvatarFallback>DA</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">Dr. Anderson</p>
                <p className="text-xs text-muted-foreground truncate">Internal Medicine</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1 h-8 hover:bg-sidebar-accent">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-sidebar-accent">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-sidebar-accent">
              <User className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-sidebar-accent">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-sidebar-accent">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
