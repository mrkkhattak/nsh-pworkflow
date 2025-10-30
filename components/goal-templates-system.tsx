"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, Plus, CheckCircle, AlertCircle, Calendar, Edit, LinkIcon, AlertTriangle } from "lucide-react"
import { getGoals, createGoal, updateGoal, type Goal as DBGoal } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"

const goalTemplates = [
  // Depression Goals
  {
    id: "dep-1",
    category: "Depression",
    template: "Reduce depression score by 50%",
    dimension: "phq9",
    targetType: "percentage",
    defaultTimeframe: "6 months",
  },
  {
    id: "dep-2",
    category: "Depression",
    template: "Achieve depression score below 9 (mild threshold)",
    dimension: "phq9",
    targetType: "absolute",
    defaultTimeframe: "6 months",
  },
  {
    id: "dep-3",
    category: "Depression",
    template: "Reduce depression score to minimal range (0-4)",
    dimension: "phq9",
    targetType: "absolute",
    defaultTimeframe: "12 months",
  },
  {
    id: "dep-4",
    category: "Depression",
    template: "Improve mood stability for 4 consecutive weeks",
    dimension: "phq9",
    targetType: "duration",
    defaultTimeframe: "3 months",
  },

  // Anxiety Goals
  {
    id: "anx-1",
    category: "Anxiety",
    template: "Maintain anxiety score below 7",
    dimension: "gad7",
    targetType: "absolute",
    defaultTimeframe: "6 months",
  },
  {
    id: "anx-2",
    category: "Anxiety",
    template: "Reduce anxiety score by 40%",
    dimension: "gad7",
    targetType: "percentage",
    defaultTimeframe: "6 months",
  },
  {
    id: "anx-3",
    category: "Anxiety",
    template: "Achieve minimal anxiety symptoms (score < 5)",
    dimension: "gad7",
    targetType: "absolute",
    defaultTimeframe: "9 months",
  },
  {
    id: "anx-4",
    category: "Anxiety",
    template: "Reduce panic attack frequency by 75%",
    dimension: "gad7",
    targetType: "percentage",
    defaultTimeframe: "4 months",
  },

  // Function/Disability Goals
  {
    id: "func-1",
    category: "Function",
    template: "Improve functional health score by 30%",
    dimension: "whodas",
    targetType: "percentage",
    defaultTimeframe: "6 months",
  },
  {
    id: "func-2",
    category: "Function",
    template: "Reduce functional disability to mild range (5-9)",
    dimension: "whodas",
    targetType: "absolute",
    defaultTimeframe: "9 months",
  },
  {
    id: "func-3",
    category: "Function",
    template: "Return to work/school full-time",
    dimension: "whodas",
    targetType: "functional",
    defaultTimeframe: "6 months",
  },
  {
    id: "func-4",
    category: "Function",
    template: "Improve work productivity to 90%",
    dimension: "whodas",
    targetType: "percentage",
    defaultTimeframe: "4 months",
  },

  // Pain Goals
  {
    id: "pain-1",
    category: "Pain",
    template: "Reduce BPI pain severity to mild range (1-3)",
    dimension: "bpi",
    targetType: "absolute",
    defaultTimeframe: "3 months",
  },
  {
    id: "pain-2",
    category: "Pain",
    template: "Decrease pain interference by 50%",
    dimension: "bpi",
    targetType: "percentage",
    defaultTimeframe: "6 months",
  },
  {
    id: "pain-3",
    category: "Pain",
    template: "Achieve pain-free days 5 out of 7 days per week",
    dimension: "bpi",
    targetType: "frequency",
    defaultTimeframe: "4 months",
  },

  // Lifestyle & Behavioral Goals
  {
    id: "life-1",
    category: "Lifestyle",
    template: "Improve sleep efficiency to 85%",
    dimension: "custom",
    targetType: "percentage",
    defaultTimeframe: "3 months",
  },
  {
    id: "life-2",
    category: "Lifestyle",
    template: "Increase weekly physical activity to 150 minutes",
    dimension: "custom",
    targetType: "absolute",
    defaultTimeframe: "3 months",
  },
  {
    id: "life-3",
    category: "Lifestyle",
    template: "Establish consistent sleep schedule (7-8 hours nightly)",
    dimension: "custom",
    targetType: "duration",
    defaultTimeframe: "2 months",
  },
  {
    id: "life-4",
    category: "Lifestyle",
    template: "Reduce alcohol consumption by 75%",
    dimension: "custom",
    targetType: "percentage",
    defaultTimeframe: "6 months",
  },
  {
    id: "life-5",
    category: "Lifestyle",
    template: "Practice mindfulness meditation 5 days per week",
    dimension: "custom",
    targetType: "frequency",
    defaultTimeframe: "3 months",
  },

  // Medication Adherence Goals
  {
    id: "med-1",
    category: "Medication",
    template: "Achieve 90% medication adherence",
    dimension: "custom",
    targetType: "percentage",
    defaultTimeframe: "3 months",
  },
  {
    id: "med-2",
    category: "Medication",
    template: "Reduce missed medication doses to <2 per month",
    dimension: "custom",
    targetType: "frequency",
    defaultTimeframe: "2 months",
  },

  // Social & Relationship Goals
  {
    id: "soc-1",
    category: "Social",
    template: "Engage in social activities 2-3 times per week",
    dimension: "custom",
    targetType: "frequency",
    defaultTimeframe: "4 months",
  },
  {
    id: "soc-2",
    category: "Social",
    template: "Improve family relationship satisfaction by 40%",
    dimension: "custom",
    targetType: "percentage",
    defaultTimeframe: "6 months",
  },
  {
    id: "soc-3",
    category: "Social",
    template: "Attend support group meetings weekly",
    dimension: "custom",
    targetType: "frequency",
    defaultTimeframe: "6 months",
  },
]

const validationRules = {
  phq9: { min: 0, max: 27, clinicallySignificant: 5 },
  gad7: { min: 0, max: 21, clinicallySignificant: 4 },
  whodas: { min: 0, max: 48, clinicallySignificant: 5 },
  bpi: { min: 0, max: 10, clinicallySignificant: 2 },
  custom: { min: 0, max: 100, clinicallySignificant: 10 },
}

const timeframeOptions = [
  { value: "2weeks", label: "2 Weeks", days: 14 },
  { value: "1month", label: "1 Month", days: 30 },
  { value: "2months", label: "2 Months", days: 60 },
  { value: "3months", label: "3 Months", days: 90 },
  { value: "6months", label: "6 Months", days: 180 },
  { value: "9months", label: "9 Months", days: 270 },
  { value: "12months", label: "12 Months", days: 365 },
]

interface Goal {
  id: string
  description: string
  dimension: string
  baseline: number
  target: number
  current: number
  timeframe: string
  deadline: string
  progress: number
  status: "on-track" | "at-risk" | "achieved" | "cancelled"
  interventions: string[]
  createdDate: string
  completedDate?: string
  notes?: string
  linkedInterventions?: string[]
}

type TrackedDimension = { id: string; label: string }

const defaultTrackedDimensions: TrackedDimension[] = [
  { id: "burden", label: "Burden of Illness" },
  { id: "medical", label: "Medical Management & Adherence" },
  { id: "utilization", label: "Health Care Utilization" },
  { id: "sdoh", label: "SDOH" },
  { id: "diet", label: "Diet & Nutrition" },
  { id: "physical", label: "Physical Activity Score" },
  { id: "sleep", label: "Sleep Health" },
  { id: "pain", label: "Pain & Functional Impact" },
  { id: "satisfaction", label: "Patient Satisfaction & Trust" },
  { id: "mental", label: "Mental Health & Emotional Wellbeing" },
  { id: "cost", label: "Healthcare Cost & Affordability" },
  { id: "engagement", label: "Patient Engagement & Self Care Ability" },
]

export function GoalTemplatesSystem({
  patientId,
  trackedDimensions = defaultTrackedDimensions,
  defaultDimension,
  latestByDimension = {},
  openCreateDefault = false,
  onGoalCreated,
}: {
  patientId?: number
  trackedDimensions?: { id: string; label: string }[]
  defaultDimension?: string
  latestByDimension?: Record<string, number>
  openCreateDefault?: boolean
  onGoalCreated?: (goal: { id: string; description: string }) => void
}) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [customGoal, setCustomGoal] = useState("")
  const [selectedDimension, setSelectedDimension] = useState(defaultDimension || trackedDimensions[0]?.id || "burden")
  const [baseline, setBaseline] = useState<number | "">("")
  const [target, setTarget] = useState<number | "">("")
  const [timeframe, setTimeframe] = useState("3months")
  const [supervisorReason, setSupervisorReason] = useState("")
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedInterventions, setSelectedInterventions] = useState<string[]>([])
  const [newIntervention, setNewIntervention] = useState<string>("")
  const [current, setCurrent] = useState<number | "">("")
  const [reassessmentDate, setReassessmentDate] = useState<string>("")
  const [newInterventionType, setNewInterventionType] = useState<"Medication" | "Lifestyle" | "Therapy">("Medication")
  const [newInterventionDate, setNewInterventionDate] = useState<string>(new Date().toISOString().slice(0, 10))
  const [newInterventionNotes, setNewInterventionNotes] = useState<string>("")

  useEffect(() => {
    if (patientId) {
      loadGoals()
    }
  }, [patientId])

  const loadGoals = async () => {
    if (!patientId) return
    try {
      setIsLoading(true)
      const data = await getGoals(patientId)
      const mapped = data.map((d) => {
        const progressValue = d.baseline !== d.target
          ? Math.round(((d.baseline - d.current) / (d.baseline - d.target)) * 100)
          : 0
        return {
          id: d.id,
          description: d.description,
          dimension: d.dimension,
          baseline: d.baseline,
          target: d.target,
          current: d.current,
          timeframe: d.timeframe,
          deadline: d.deadline,
          progress: Math.min(Math.max(progressValue, 0), 100),
          status: d.status,
          interventions: [],
          createdDate: new Date(d.created_at).toISOString().split('T')[0],
          notes: d.notes,
          linkedInterventions: [],
        }
      })
      setGoals(mapped)
    } catch (error) {
      console.error('Error loading goals:', error)
      toast({
        title: "Error",
        description: "Failed to load goals",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const latest = latestByDimension[selectedDimension]
    if (typeof latest === "number") {
      setBaseline(latest)
      setCurrent(latest)
    }
  }, [selectedDimension, latestByDimension])

  useEffect(() => {
    if (openCreateDefault && selectedDimension && latestByDimension && latestByDimension[selectedDimension] != null) {
      setBaseline(Number(latestByDimension[selectedDimension]))
    }
  }, [openCreateDefault, selectedDimension, latestByDimension])

  const validateGoal = () => {
    const errors: string[] = []

    if (!customGoal.trim()) {
      errors.push("Please enter a goal description")
    }

    if (customGoal.trim() && customGoal.length > 500) {
      errors.push("Custom goal must be 500 characters or less")
    }

    if (baseline === "" || target === "") {
      errors.push("Baseline and target values are required")
    }

    const rules = validationRules[selectedDimension as keyof typeof validationRules] || validationRules.custom
    if (typeof baseline === "number" && (baseline < rules.min || baseline > rules.max)) {
      errors.push(`Baseline must be between ${rules.min} and ${rules.max}`)
    }

    if (typeof target === "number" && (target < rules.min || target > rules.max)) {
      errors.push(`Target must be between ${rules.min} and ${rules.max}`)
    }

    if (typeof baseline === "number" && typeof target === "number") {
      const change = Math.abs(baseline - target)
      if (change < rules.clinicallySignificant) {
        errors.push(`Change must be clinically significant (at least ${rules.clinicallySignificant} points)`)
      }

      if (["phq9", "gad7", "whodas", "bpi"].includes(selectedDimension) && target >= baseline) {
        errors.push("Target should represent improvement (lower score)")
      }

      const percentChange = baseline !== 0 ? (change / baseline) * 100 : 0
      if (percentChange > 75 && !supervisorReason.trim()) {
        errors.push("Goals with >75% change require supervisor approval reason")
      }
    }

    setValidationErrors(errors)
    return errors.length === 0
  }

  const handleCreateGoal = async () => {
    if (!validateGoal()) return
    if (!patientId) {
      toast({
        title: "Error",
        description: "Patient ID is required",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      const timeframeData = timeframeOptions.find((t) => t.value === timeframe)
      const deadline = new Date()
      deadline.setDate(deadline.getDate() + (timeframeData?.days || 90))

      const newGoalData = await createGoal({
        patient_id: patientId,
        description: customGoal.trim(),
        dimension: selectedDimension,
        baseline: baseline as number,
        target: target as number,
        current: current as number,
        timeframe: timeframeData?.label || "3 Months",
        deadline: deadline.toISOString().split("T")[0],
        status: "on-track",
        notes: supervisorReason || undefined,
        created_by: "Dr. Anderson",
      })

      const progressValue = newGoalData.baseline !== newGoalData.target
        ? Math.round(((newGoalData.baseline - newGoalData.current) / (newGoalData.baseline - newGoalData.target)) * 100)
        : 0

      const newGoal: Goal = {
        id: newGoalData.id,
        description: newGoalData.description,
        dimension: newGoalData.dimension,
        baseline: newGoalData.baseline,
        target: newGoalData.target,
        current: newGoalData.current,
        timeframe: newGoalData.timeframe,
        deadline: newGoalData.deadline,
        progress: Math.min(Math.max(progressValue, 0), 100),
        status: newGoalData.status,
        interventions: selectedInterventions,
        createdDate: new Date(newGoalData.created_at).toISOString().split("T")[0],
        notes: newGoalData.notes,
        linkedInterventions: selectedInterventions,
      }

      setGoals([...goals, newGoal])
      onGoalCreated?.({ id: newGoal.id, description: newGoal.description })

      toast({
        title: "Success",
        description: "Goal created successfully",
      })

      resetForm()
      setCreateDialogOpen(false)
    } catch (error) {
      console.error('Error creating goal:', error)
      toast({
        title: "Error",
        description: "Failed to create goal",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setCustomGoal("")
    setBaseline("")
    setTarget("")
    setCurrent("")
    setTimeframe("3months")
    setSupervisorReason("")
    setSelectedInterventions([])
    setNewIntervention("")
    setValidationErrors([])
    setNewInterventionType("Medication")
    setNewInterventionDate(new Date().toISOString().slice(0, 10))
    setNewInterventionNotes("")
  }

  const checkAutoCompletion = (goal: Goal) => {
    if (goal.current <= goal.target && goal.status !== "achieved") {
      return true
    }
    return false
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "achieved":
        return "bg-green-100 text-green-800"
      case "on-track":
        return "bg-blue-100 text-blue-800"
      case "at-risk":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredTemplates =
    selectedCategory === "all" ? goalTemplates : goalTemplates.filter((t) => t.category === selectedCategory)

  const activeGoals = goals.filter((g) => g.status !== "achieved" && g.status !== "cancelled")
  const completedGoals = goals.filter((g) => g.status === "achieved")
  const successRate = goals.length > 0 ? (completedGoals.length / goals.length) * 100 : 0

  if (openCreateDefault) {
    return (
      <div className="space-y-6">
        {/* Guidance */}
        <div className="rounded-lg border p-3 bg-muted/50 text-sm text-muted-foreground">
          Enter a measurable goal for the chosen dimension (e.g., {'"Reduce depression score from 20 to 11 in 1 month"'}).
        </div>

        {/* Goal Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Goal Description</label>
          <Textarea
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
            placeholder="Describe a measurable goal (max 500 characters)"
            maxLength={500}
            className="min-h-20"
          />
          <div className="text-xs text-muted-foreground text-right">{customGoal.length}/500</div>
        </div>

        {/* Goal Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Dimension</label>
            <Select value={selectedDimension} onValueChange={setSelectedDimension}>
              <SelectTrigger>
                <SelectValue placeholder="Select dimension" />
              </SelectTrigger>
              <SelectContent>
                {(trackedDimensions ?? []).map((dim) => (
                  <SelectItem key={dim.id} value={dim.id}>
                    {dim.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Baseline</label>
            <Input
              type="number"
              value={baseline}
              onChange={(e) => setBaseline(Number(e.target.value))}
              placeholder="e.g., 20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Target</label>
            <Input
              type="number"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              placeholder="e.g., 11"
            />
          </div>
        </div>

        {/* Timeframe and Reassessment */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Timeframe</label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2weeks">2 Weeks</SelectItem>
                <SelectItem value="1month">1 Month</SelectItem>
                <SelectItem value="6weeks">6 Weeks</SelectItem>
                <SelectItem value="3months">3 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Reassessment Date</label>
            <Input type="date" value={reassessmentDate} onChange={(e) => setReassessmentDate(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Current Value</label>
            <Input
              type="number"
              value={current}
              onChange={(e) => setCurrent(Number(e.target.value))}
              placeholder="Auto-updated from latest"
            />
          </div>
        </div>

        {/* Interventions */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Interventions</label>

          <div className="flex flex-col md:flex-row gap-2">
            <Select value={newInterventionType} onValueChange={(v: any) => setNewInterventionType(v)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Medication">Medication</SelectItem>
                <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                <SelectItem value="Therapy">Therapy</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={newInterventionDate}
              onChange={(e) => setNewInterventionDate(e.target.value)}
              className="w-44"
            />

            {/* Dynamic fields placeholder to mirror InterventionTimeline; values not persisted beyond label for demo */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-2">
              {newInterventionType === "Medication" && (
                <>
                  <Input placeholder="Drug name" />
                  <Input placeholder="Dose" />
                  <Input placeholder="Frequency/Route" />
                </>
              )}
              {newInterventionType === "Lifestyle" && (
                <>
                  <Input placeholder="Category (diet/exercise/sleep/stress)" />
                  <Input placeholder="Specific change" />
                </>
              )}
              {newInterventionType === "Therapy" && (
                <>
                  <Input placeholder="Type (CBT/DBT/other)" />
                  <Input placeholder="Frequency" />
                  <Input placeholder="Provider" />
                </>
              )}
            </div>
          </div>

          <Textarea
            value={newInterventionNotes}
            onChange={(e) => setNewInterventionNotes(e.target.value)}
            placeholder="Notes (optional, max 1000 chars)"
            className="min-h-16"
            maxLength={1000}
          />

          <div className="flex justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                const label = `${newInterventionType} • ${new Date(newInterventionDate).toLocaleDateString()}${
                  newInterventionNotes.trim() ? ` — ${newInterventionNotes.trim()}` : ""
                }`
                if (label.trim() && !selectedInterventions.includes(label)) {
                  setSelectedInterventions((prev) => [...prev, label])
                  setNewInterventionNotes("")
                }
              }}
            >
              Add Intervention
            </Button>
          </div>

          {!!selectedInterventions.length && (
            <div className="flex flex-wrap gap-2">
              {selectedInterventions.map((iv) => (
                <Badge key={iv} variant="secondary" className="flex items-center gap-1">
                  {iv}
                  <button
                    type="button"
                    aria-label={`Remove ${iv}`}
                    className="ml-1 text-xs"
                    onClick={() => setSelectedInterventions((prev) => prev.filter((x) => x !== iv))}
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              resetForm()
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleCreateGoal} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Goal"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Treatment Goals</h2>
          <p className="text-muted-foreground">Track patient progress toward measurable outcomes</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">{activeGoals.length}</div>
            <div className="text-sm text-muted-foreground">Active Goals</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{successRate.toFixed(0)}%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Goal
          </Button>
        </div>
      </div>

      {/* Goals Display */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="active">Active Goals ({activeGoals.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedGoals.length})</TabsTrigger>
          <TabsTrigger value="all">All Goals ({goals.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeGoals.map((goal) => {
            const daysLeft = getDaysUntilDeadline(goal.deadline)
            const isApproachingDeadline = daysLeft <= 7 && daysLeft > 0
            const isOverdue = daysLeft < 0

            return (
              <Card
                key={goal.id}
                className={`border-l-4 ${goal.status === "on-track" ? "border-l-blue-500" : "border-l-red-500"}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Target className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-semibold text-foreground">{goal.description}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Badge variant="outline">{goal.dimension.toUpperCase()}</Badge>
                        <span>Created: {new Date(goal.createdDate).toLocaleDateString()}</span>
                        <span
                          className={
                            isOverdue
                              ? "text-red-600 font-medium"
                              : isApproachingDeadline
                                ? "text-orange-600 font-medium"
                                : ""
                          }
                        >
                          <Calendar className="h-3 w-3 inline mr-1" />
                          Due: {new Date(goal.deadline).toLocaleDateString()}
                          {isApproachingDeadline && " (Soon!)"}
                          {isOverdue && " (Overdue)"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(goal.status)}>{goal.status}</Badge>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Interventions */}
                  <div className="mt-2">
                    {Array.isArray(goal.interventions) && goal.interventions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {goal.interventions.map((iv: string) => (
                          <Badge key={iv} variant="secondary">
                            {iv}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Progress Section */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-foreground">{goal.baseline}</div>
                        <div className="text-xs text-muted-foreground">Baseline</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">{goal.current}</div>
                        <div className="text-xs text-muted-foreground">Current</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{goal.target}</div>
                        <div className="text-xs text-muted-foreground">Target</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress to Target</span>
                        <span className="font-medium">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>

                    {/* Linked Interventions */}
                    {goal.linkedInterventions && goal.linkedInterventions.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Linked:</span>
                        {goal.linkedInterventions.map((intervention, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {intervention}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Notes */}
                    {goal.notes && (
                      <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                        <strong>Notes:</strong> {goal.notes}
                      </div>
                    )}

                    {/* Auto-completion check */}
                    {checkAutoCompletion(goal) && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm text-green-800 font-medium">Target achieved! Mark as complete?</span>
                        <Button size="sm" variant="outline" className="ml-auto bg-transparent">
                          Complete Goal
                        </Button>
                      </div>
                    )}

                    {/* Deadline warning */}
                    {(isApproachingDeadline || isOverdue) && (
                      <div
                        className={`flex items-center gap-2 p-3 rounded-lg ${isOverdue ? "bg-red-50 border border-red-200" : "bg-orange-50 border border-orange-200"}`}
                      >
                        <AlertTriangle className={`h-5 w-5 ${isOverdue ? "text-red-600" : "text-orange-600"}`} />
                        <span className={`text-sm font-medium ${isOverdue ? "text-red-800" : "text-orange-800"}`}>
                          {isOverdue
                            ? "Goal is overdue. Consider extending deadline or marking as cancelled."
                            : `Deadline approaching in ${daysLeft} days`}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedGoals.map((goal) => (
            <Card key={goal.id} className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h3 className="text-lg font-semibold text-foreground">{goal.description}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Badge variant="outline">{goal.dimension.toUpperCase()}</Badge>
                      <span>
                        Completed: {goal.completedDate ? new Date(goal.completedDate).toLocaleDateString() : "N/A"}
                      </span>
                      <span>Duration: {goal.timeframe}</span>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Achieved</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {goals.map((goal) => (
            <Card key={goal.id} className="border-l-4 border-l-gray-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">{goal.description}</h4>
                    <p className="text-sm text-muted-foreground">
                      {goal.baseline} → {goal.current} → {goal.target} • {goal.timeframe}
                    </p>
                  </div>
                  <Badge className={getStatusColor(goal.status)}>{goal.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Create Goal Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Treatment Goal</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Template Selection */}
            <div className="rounded-lg border p-3 bg-muted/50 text-sm text-muted-foreground">
              Enter a measurable goal for the chosen dimension (e.g., “Reduce Burden from 75 to 50 in 1 month”).
            </div>

            {/* Custom Goal */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Goal Description</label>
              <Textarea
                value={customGoal}
                onChange={(e) => {
                  setCustomGoal(e.target.value)
                }}
                placeholder="Describe a measurable goal (max 500 characters)"
                maxLength={500}
                className="min-h-20"
              />
              <div className="text-xs text-muted-foreground text-right">{customGoal.length}/500</div>
            </div>

            {/* Goal Parameters */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Dimension</label>
                <Select value={selectedDimension} onValueChange={setSelectedDimension}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {trackedDimensions.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Baseline Value</label>
                <Input
                  type="number"
                  value={baseline}
                  onChange={(e) => setBaseline(e.target.value ? Number(e.target.value) : "")}
                  placeholder="Current score"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Target Value</label>
                <Input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(e.target.value ? Number(e.target.value) : "")}
                  placeholder="Goal score"
                />
              </div>
            </div>

            {/* Timeframe */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Timeframe</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeframeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Supervisor Reason */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Supervisor Approval Reason (if out-of-range)</label>
              <Input
                value={supervisorReason}
                onChange={(e) => setSupervisorReason(e.target.value)}
                placeholder="Required for goals with >75% change"
              />
            </div>

            {/* Interventions */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Interventions</label>

              <div className="flex flex-col md:flex-row gap-2">
                <Select value={newInterventionType} onValueChange={(v: any) => setNewInterventionType(v)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Medication">Medication</SelectItem>
                    <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="Therapy">Therapy</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="date"
                  value={newInterventionDate}
                  onChange={(e) => setNewInterventionDate(e.target.value)}
                  className="w-44"
                />

                {/* Dynamic fields placeholder to mirror InterventionTimeline; values not persisted beyond label for demo */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {newInterventionType === "Medication" && (
                    <>
                      <Input placeholder="Drug name" />
                      <Input placeholder="Dose" />
                      <Input placeholder="Frequency/Route" />
                    </>
                  )}
                  {newInterventionType === "Lifestyle" && (
                    <>
                      <Input placeholder="Category (diet/exercise/sleep/stress)" />
                      <Input placeholder="Specific change" />
                    </>
                  )}
                  {newInterventionType === "Therapy" && (
                    <>
                      <Input placeholder="Type (CBT/DBT/other)" />
                      <Input placeholder="Frequency" />
                      <Input placeholder="Provider" />
                    </>
                  )}
                </div>
              </div>

              <Textarea
                value={newInterventionNotes}
                onChange={(e) => setNewInterventionNotes(e.target.value)}
                placeholder="Notes (optional, max 1000 chars)"
                className="min-h-16"
                maxLength={1000}
              />

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    const label = `${newInterventionType} • ${new Date(newInterventionDate).toLocaleDateString()}${
                      newInterventionNotes.trim() ? ` — ${newInterventionNotes.trim()}` : ""
                    }`
                    if (label.trim() && !selectedInterventions.includes(label)) {
                      setSelectedInterventions((prev) => [...prev, label])
                      setNewInterventionNotes("")
                    }
                  }}
                >
                  Add Intervention
                </Button>
              </div>

              {!!selectedInterventions.length && (
                <div className="flex flex-wrap gap-2">
                  {selectedInterventions.map((iv) => (
                    <Badge key={iv} variant="secondary" className="flex items-center gap-1">
                      {iv}
                      <button
                        type="button"
                        aria-label={`Remove ${iv}`}
                        className="ml-1 text-xs"
                        onClick={() => setSelectedInterventions((prev) => prev.filter((x) => x !== iv))}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="space-y-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800 font-medium">
                  <AlertCircle className="h-5 w-5" />
                  <span>Validation Errors:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                  {validationErrors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm()
                setCreateDialogOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateGoal} disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Goal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
