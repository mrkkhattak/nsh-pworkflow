"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Pill, Dumbbell, Brain, StopCircle, Calendar, Info, Filter, Plus as PlusIcon } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

type Assessment = {
  date: string
  interventions: string[]
}

type InterventionStatus = "active" | "stopped" | "completed"

type Intervention = {
  id: string
  type: "Medication" | "Lifestyle" | "Therapy" | "Other"
  date: string
  details: Record<string, string>
  notes?: string
  parentId?: string
  createdBy: string
  goalId?: string
  status: InterventionStatus
  stoppedDate?: string
  stoppedReason?: string
  stoppedBy?: string
}

export function InterventionTimeline({
  assessments,
  patientId,
  canEdit = false,
  goalsOptions,
}: {
  assessments: Assessment[]
  patientId: number
  canEdit?: boolean
  goalsOptions?: { id: string; label: string }[]
}) {
  const [items, setItems] = useState<Intervention[]>([])
  const [newType, setNewType] = useState<"Medication" | "Lifestyle" | "Therapy" | "Other">("Medication")
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState("")
  const [selectedGoalId, setSelectedGoalId] = useState<string | undefined>(undefined)
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "stopped">("all")
  const [stopDialogOpen, setStopDialogOpen] = useState(false)
  const [interventionToStop, setInterventionToStop] = useState<Intervention | null>(null)
  const [stopDate, setStopDate] = useState<string>(new Date().toISOString().slice(0, 10))
  const [stopReason, setStopReason] = useState("")
  const [customInterventionName, setCustomInterventionName] = useState("")

  const typeIcon = (t: Intervention["type"]) => (t === "Medication" ? Pill : t === "Lifestyle" ? Dumbbell : t === "Therapy" ? Brain : PlusIcon)

  const colorClass = (t: Intervention["type"]) =>
    t === "Medication" ? "text-blue-600" : t === "Lifestyle" ? "text-green-600" : t === "Therapy" ? "text-purple-600" : "text-orange-600"

  const renderFields = () => {
    switch (newType) {
      case "Medication":
        return (
          <div className="grid grid-cols-3 gap-2">
            <Input placeholder="Drug name" />
            <Input placeholder="Dose" />
            <Input placeholder="Frequency/Route" />
          </div>
        )
      case "Lifestyle":
        return (
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Category (diet/exercise/sleep/stress)" />
            <Input placeholder="Specific change" />
          </div>
        )
      case "Therapy":
        return (
          <div className="grid grid-cols-3 gap-2">
            <Input placeholder="Type (CBT/DBT/other)" />
            <Input placeholder="Frequency" />
            <Input placeholder="Provider" />
          </div>
        )
      case "Other":
        return (
          <div className="grid grid-cols-1 gap-2">
            <Input
              placeholder="Intervention name (e.g., Acupuncture, Support Group)"
              value={customInterventionName}
              onChange={(e) => setCustomInterventionName(e.target.value)}
            />
          </div>
        )
    }
  }

  const addIntervention = () => {
    if (!canEdit) return
    if (!selectedGoalId) {
      return
    }
    if (newType === "Other" && !customInterventionName.trim()) {
      return
    }

    const details: Record<string, string> = {}
    if (newType === "Other") {
      details.name = customInterventionName.trim()
    }

    const id = `i-${Date.now()}`
    setItems((prev) => [
      ...prev,
      {
        id,
        type: newType,
        date: newDate,
        details,
        notes,
        createdBy: "Dr. Anderson",
        goalId: selectedGoalId,
        status: "active",
      },
    ])
    setNotes("")
    setSelectedGoalId(undefined)
    setCustomInterventionName("")
  }

  const openStopDialog = (intervention: Intervention) => {
    setInterventionToStop(intervention)
    setStopDate(new Date().toISOString().slice(0, 10))
    setStopReason("")
    setStopDialogOpen(true)
  }

  const confirmStopIntervention = () => {
    if (!interventionToStop || !stopReason.trim()) return

    setItems((prev) =>
      prev.map((item) =>
        item.id === interventionToStop.id
          ? {
              ...item,
              status: "stopped",
              stoppedDate: stopDate,
              stoppedReason: stopReason,
              stoppedBy: "Dr. Anderson",
            }
          : item
      )
    )

    setStopDialogOpen(false)
    setInterventionToStop(null)
    setStopReason("")
  }

  const filteredItems = useMemo(() => {
    if (filterStatus === "all") return items
    return items.filter((item) => item.status === filterStatus)
  }, [items, filterStatus])

  const activeCount = items.filter((i) => i.status === "active").length
  const stoppedCount = items.filter((i) => i.status === "stopped").length

  const timeline = useMemo(() => {
    const entries = assessments.map((a) => ({ date: a.date, interventions: a.interventions, isManual: false, item: null }))
    const manual = filteredItems.map((i) => {
      const interventionLabel = i.type === "Other" && i.details?.name
        ? i.details.name
        : i.type
      return {
        date: i.date,
        interventions: [
          `${interventionLabel} (manual${
            i.goalId && goalsOptions?.length
              ? ` • Goal: ${goalsOptions.find((g) => g.id === i.goalId)?.label ?? i.goalId}`
              : ""
          })`,
        ],
        isManual: true,
        item: i,
      }
    })
    return [...entries, ...manual].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [assessments, filteredItems, goalsOptions])

  return (
    <div className="space-y-4">
      {/* creation form */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Add Intervention</span>
            {!canEdit && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <AlertTriangle className="h-3 w-3" /> Read-only
              </div>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <Select value={newType} onValueChange={(v: any) => setNewType(v)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Medication">Medication</SelectItem>
                <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                <SelectItem value="Therapy">Therapy</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-44" />
            <div className="flex-1">{renderFields()}</div>
          </div>
          {Array.isArray(goalsOptions) && goalsOptions.length > 0 && (
            <div className="flex gap-2">
              <Select value={selectedGoalId} onValueChange={(v: any) => setSelectedGoalId(v)}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select Goal" />
                </SelectTrigger>
                <SelectContent>
                  {goalsOptions.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional, max 1000 chars)"
            className="min-h-16"
            maxLength={1000}
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={addIntervention}
              disabled={!canEdit || !(Array.isArray(goalsOptions) && goalsOptions.length > 0 && selectedGoalId)}
            >
              Save Intervention
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filter Controls */}
      <div className="flex items-center gap-2 pb-2 border-b">
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filter:</span>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("all")}
            className="text-xs"
          >
            All ({items.length})
          </Button>
          <Button
            variant={filterStatus === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("active")}
            className="text-xs"
          >
            Active ({activeCount})
          </Button>
          <Button
            variant={filterStatus === "stopped" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("stopped")}
            className="text-xs"
          >
            Stopped ({stoppedCount})
          </Button>
        </div>
      </div>

      {/* timeline */}
      <div className="space-y-3">
        {timeline.map((entry, idx) => (
          <div key={idx} className="flex items-start gap-4 text-sm">
            <div className="w-24 text-gray-500 font-medium">{new Date(entry.date).toLocaleDateString()}</div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap gap-2 items-center">
                {entry.interventions.map((label, i) => {
                  const t = label.startsWith("Medication")
                    ? "Medication"
                    : label.startsWith("Lifestyle")
                      ? "Lifestyle"
                      : label.startsWith("Therapy")
                        ? "Therapy"
                        : label.startsWith("Other")
                          ? "Other"
                          : ("Other" as const)
                  const Icon = typeIcon(t)
                  const isStopped = entry.item?.status === "stopped"
                  return (
                    <div key={`${label}-${i}`} className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs bg-white ${colorClass(t)} ${isStopped ? "opacity-60 line-through" : ""}`}
                      >
                        <Icon className="h-3 w-3 mr-1" />
                        {label}
                      </Badge>
                      {entry.item && (
                        <>
                          <Badge
                            variant={entry.item.status === "active" ? "default" : "secondary"}
                            className={`text-xs ${
                              entry.item.status === "active"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                            }`}
                          >
                            {entry.item.status === "active" ? "Active" : "Stopped"}
                          </Badge>
                          {entry.item.status === "active" && canEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openStopDialog(entry.item!)}
                              className="h-6 px-2 text-xs text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              <StopCircle className="h-3 w-3 mr-1" />
                              Stop
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
              {entry.item?.status === "stopped" && entry.item.stoppedDate && (
                <div className="flex flex-col gap-1 text-xs text-gray-600 bg-red-50 p-3 rounded border border-red-200">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">
                      <StopCircle className="h-3 w-3 mr-1" />
                      Stopped
                    </Badge>
                    <div className="flex items-center gap-1 text-gray-700">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(entry.item.stoppedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {entry.item.stoppedReason && (
                    <div className="flex items-start gap-1 mt-1">
                      <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span className="font-medium">Reason:</span>
                      <span className="flex-1">{entry.item.stoppedReason}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Stop Intervention Dialog */}
      <Dialog open={stopDialogOpen} onOpenChange={setStopDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Stop Intervention</DialogTitle>
            <DialogDescription>
              Please provide the date and reason for stopping this intervention.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="stop-date">Stop Date</Label>
              <Input
                id="stop-date"
                type="date"
                value={stopDate}
                onChange={(e) => setStopDate(e.target.value)}
                min={interventionToStop?.date}
                max={new Date().toISOString().slice(0, 10)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stop-reason">Reason for Stopping</Label>
              <Textarea
                id="stop-reason"
                value={stopReason}
                onChange={(e) => setStopReason(e.target.value)}
                placeholder="Enter reason (e.g., side effects, patient request, treatment completed, etc.)"
                className="min-h-24"
                maxLength={500}
              />
              <p className="text-xs text-gray-500">{stopReason.length}/500 characters</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStopDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmStopIntervention}
              disabled={!stopReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              <StopCircle className="h-4 w-4 mr-2" />
              Stop Intervention
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
