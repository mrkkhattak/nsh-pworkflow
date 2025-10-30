"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, AlertTriangle, Bell } from "lucide-react"

type Schedule = {
  id: string
  dimensions: string[]
  dueDate: string
  interval?: string
  status: "Scheduled" | "Completed" | "Overdue" | "Contact Failed"
  reminders: { when: string; status: "pending" | "sent" | "failed" }[]
  lastCompletedAt?: string
}

export function ReassessmentScheduler({ patientId }: { patientId: number }) {
  const [dimensions, setDimensions] = useState<string[]>([])
  const [interval, setInterval] = useState<string>("1m")
  const [customDate, setCustomDate] = useState<string>("")
  const [channelEmail, setChannelEmail] = useState(true)
  const [channelSMS, setChannelSMS] = useState(true)
  const [channelPortal, setChannelPortal] = useState(true)
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [lastRefreshAt, setLastRefreshAt] = useState<number>(0)

  const canRefresh = Date.now() - lastRefreshAt > 15 * 60 * 1000

  const addSchedule = () => {
    const due = customDate || computeDueDate(interval)
    const id = `sch-${Date.now()}`
    const reminders = buildReminders(due)
    setSchedules((prev) => [
      ...prev,
      {
        id,
        dimensions: dimensions.length ? dimensions : ["All"],
        dueDate: due,
        interval,
        status: isOverdue(due) ? "Overdue" : "Scheduled",
        reminders,
      },
    ])
  }

  const computeDueDate = (code: string) => {
    const d = new Date()
    const map: Record<string, () => void> = {
      "2w": () => d.setDate(d.getDate() + 14),
      "1m": () => d.setMonth(d.getMonth() + 1),
      "3m": () => d.setMonth(d.getMonth() + 3),
      "6m": () => d.setMonth(d.getMonth() + 6),
      "12m": () => d.setFullYear(d.getFullYear() + 1),
    }
    map[code]?.()
    return d.toISOString().slice(0, 10)
  }

  const buildReminders = (due: string) => {
    const d = new Date(due)
    const d7 = new Date(d)
    d7.setDate(d.getDate() - 7)
    const d1 = new Date(d)
    d1.setDate(d.getDate() - 1)
    return [
      { when: d7.toISOString(), status: "pending" as const },
      { when: d1.toISOString(), status: "pending" as const },
      { when: d.toISOString(), status: "pending" as const },
    ]
  }

  const isOverdue = (dateISO: string) => {
    const due = new Date(dateISO).getTime()
    return Date.now() - due > 7 * 24 * 60 * 60 * 1000 // grace period 7 days
  }

  const refreshStatuses = () => {
    if (!canRefresh) return
    setLastRefreshAt(Date.now())
    setSchedules((prev) =>
      prev.map((s) => {
        const overdue = isOverdue(s.dueDate)
        return { ...s, status: overdue ? "Overdue" : s.status }
      }),
    )
  }

  const dimensionOptions = ["All", "Mental Health", "Physical Health", "SDOH", "Patient Engagement"]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Schedule Reassessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Dimensions</Label>
              <Select onValueChange={(v) => setDimensions(v === "All" ? [] : [v])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select dimensions" />
                </SelectTrigger>
                <SelectContent>
                  {dimensionOptions.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Standard Interval</Label>
              <Select value={interval} onValueChange={setInterval}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2w">2 weeks</SelectItem>
                  <SelectItem value="1m">1 month</SelectItem>
                  <SelectItem value="3m">3 months</SelectItem>
                  <SelectItem value="6m">6 months</SelectItem>
                  <SelectItem value="12m">12 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Custom Date (optional)</Label>
              <Input type="date" value={customDate} onChange={(e) => setCustomDate(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={channelEmail}
                onChange={(e) => setChannelEmail(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Email</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={channelSMS}
                onChange={(e) => setChannelSMS(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">SMS</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={channelPortal}
                onChange={(e) => setChannelPortal(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Portal Notification</span>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={refreshStatuses} disabled={!canRefresh}>
              Refresh Status
            </Button>
            <Button size="sm" onClick={addSchedule}>
              <Calendar className="h-4 w-4 mr-2" />
              Create Schedule
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Planned Reassessments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {schedules.length === 0 ? (
            <div className="text-sm text-muted-foreground">No reassessments scheduled yet.</div>
          ) : (
            schedules.map((s) => (
              <div key={s.id} className="flex items-center justify-between border rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{s.dimensions.join(", ")}</Badge>
                  <div className="text-sm">Due: {new Date(s.dueDate).toLocaleDateString()}</div>
                  <Badge
                    variant={
                      s.status === "Overdue"
                        ? "destructive"
                        : s.status === "Completed"
                          ? "default"
                          : s.status === "Contact Failed"
                            ? "secondary"
                            : "outline"
                    }
                    className={s.status === "Overdue" ? "text-red-700" : ""}
                  >
                    {s.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {s.reminders.map((r, i) => (
                    <Badge
                      key={i}
                      variant={r.status === "sent" ? "default" : r.status === "failed" ? "destructive" : "outline"}
                      className="text-xxs"
                    >
                      <Bell className="h-3 w-3 mr-1" />
                      {new Date(r.when).toLocaleDateString()}
                    </Badge>
                  ))}
                </div>
              </div>
            ))
          )}
          <div className="mt-2 text-xs text-amber-700 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Reminders may fail if contact info is invalid. Update patient contact details and retry.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
