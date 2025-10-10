"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Pill, Dumbbell, Brain } from "lucide-react"

type Assessment = {
  date: string
  interventions: string[]
}

type Intervention = {
  id: string
  type: "Medication" | "Lifestyle" | "Therapy"
  date: string
  details: Record<string, string>
  notes?: string
  parentId?: string // for continuation chains
  createdBy: string
  goalId?: string // link to a goal
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
  const [newType, setNewType] = useState<"Medication" | "Lifestyle" | "Therapy">("Medication")
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState("")
  const [selectedGoalId, setSelectedGoalId] = useState<string | undefined>(undefined)

  const typeIcon = (t: Intervention["type"]) => (t === "Medication" ? Pill : t === "Lifestyle" ? Dumbbell : Brain)

  const colorClass = (t: Intervention["type"]) =>
    t === "Medication" ? "text-blue-600" : t === "Lifestyle" ? "text-green-600" : "text-purple-600"

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
    }
  }

  const addIntervention = () => {
    if (!canEdit) return
    if (!selectedGoalId) {
      // Optionally, add a toast in your system; minimal guard for now.
      return
    }
    const id = `i-${Date.now()}`
    setItems((prev) => [
      ...prev,
      {
        id,
        type: newType,
        date: newDate,
        details: {}, // simplified for demo
        notes,
        createdBy: "Dr. Anderson",
        goalId: selectedGoalId,
      },
    ])
    setNotes("")
    setSelectedGoalId(undefined)
  }

  const timeline = useMemo(() => {
    const entries = assessments.map((a) => ({ date: a.date, interventions: a.interventions }))
    const manual = items.map((i) => ({
      date: i.date,
      interventions: [
        `${i.type} (manual${
          i.goalId && goalsOptions?.length
            ? ` • Goal: ${goalsOptions.find((g) => g.id === i.goalId)?.label ?? i.goalId}`
            : ""
        })`,
      ],
    }))
    return [...entries, ...manual].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [assessments, items, goalsOptions])

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

      {/* timeline */}
      <div className="space-y-3">
        {timeline.map((entry, idx) => (
          <div key={idx} className="flex items-start gap-4 text-sm">
            <div className="w-24 text-gray-500 font-medium">{new Date(entry.date).toLocaleDateString()}</div>
            <div className="flex-1 flex flex-wrap gap-2">
              {entry.interventions.map((label, i) => {
                const t = label.startsWith("Medication")
                  ? "Medication"
                  : label.startsWith("Lifestyle")
                    ? "Lifestyle"
                    : label.startsWith("Therapy")
                      ? "Therapy"
                      : ("Therapy" as const)
                const Icon = typeIcon(t)
                return (
                  <Badge key={`${label}-${i}`} variant="outline" className={`text-xs bg-white ${colorClass(t)}`}>
                    <Icon className="h-3 w-3 mr-1" />
                    {label}
                  </Badge>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
