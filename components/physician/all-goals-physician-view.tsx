"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  mockDimensionGoals,
  healthDimensionsConfig,
  type DimensionGoal
} from "@/lib/nsh-assessment-mock"
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)
import { Target, Calendar, TrendingDown, CheckCircle, AlertCircle, Activity, ArrowLeft, Filter, Edit, Plus, Pill, ChevronDown, ChevronUp } from "lucide-react"
import { EditGoalDialog } from "@/components/edit-goal-dialog"
import { AddInterventionDialog } from "@/components/add-intervention-dialog"
import { InterventionListItem } from "@/components/intervention-list-item"
import { StopInterventionDialog } from "@/components/stop-intervention-dialog"
import { useToast } from "@/hooks/use-toast"
import {
  getInterventionsByGoalId,
  getDimensionInterventionsByGoalId,
  stopIntervention,
  stopDimensionIntervention,
  getInterventionStats,
  type Intervention,
  type DimensionIntervention,
} from "@/lib/intervention-service"

interface AllGoalsPhysicianViewProps {
  patientId: number
  patientName?: string
}

export function AllGoalsPhysicianView({ patientId, patientName }: AllGoalsPhysicianViewProps) {
  const { toast } = useToast()
  const [filterDimension, setFilterDimension] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterInterventions, setFilterInterventions] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("deadline")
  const [editingGoal, setEditingGoal] = useState<DimensionGoal | null>(null)
  const [addingInterventionForGoal, setAddingInterventionForGoal] = useState<DimensionGoal | null>(null)
  const [expandedGoalIds, setExpandedGoalIds] = useState<Set<string>>(new Set())
  const [goalInterventions, setGoalInterventions] = useState<Record<string, (Intervention | DimensionIntervention)[]>>({})
  const [stoppingIntervention, setStoppingIntervention] = useState<Intervention | DimensionIntervention | null>(null)
  const [interventionStats, setInterventionStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [loadingGoalId, setLoadingGoalId] = useState<string | null>(null)
  const [dbGoals, setDbGoals] = useState<DimensionGoal[]>([])
  const [loadingGoals, setLoadingGoals] = useState(true)

  const goalsToUse = dbGoals.length > 0 ? dbGoals : mockDimensionGoals
  let filteredGoals = [...goalsToUse]

  if (filterDimension !== "all") {
    filteredGoals = filteredGoals.filter(goal => goal.dimensionId === filterDimension)
  }

  if (filterStatus !== "all") {
    filteredGoals = filteredGoals.filter(goal => goal.status === filterStatus)
  }

  if (filterInterventions !== "all") {
    filteredGoals = filteredGoals.filter(goal => {
      const interventions = goalInterventions[goal.id] || []
      if (filterInterventions === "with-interventions") {
        return interventions.length > 0
      } else if (filterInterventions === "without-interventions") {
        return interventions.length === 0
      } else if (filterInterventions === "active-interventions") {
        return interventions.some(i => i.status === 'active')
      }
      return true
    })
  }

  filteredGoals.sort((a, b) => {
    if (sortBy === "deadline") {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    } else if (sortBy === "progress") {
      return b.progress - a.progress
    } else if (sortBy === "dimension") {
      return a.dimensionName.localeCompare(b.dimensionName)
    }
    return 0
  })

  const activeGoals = filteredGoals.filter(g => g.status !== "achieved" && g.status !== "cancelled")
  const achievedGoals = filteredGoals.filter(g => g.status === "achieved")
  const atRiskGoals = filteredGoals.filter(g => g.status === "at-risk")
  const overdueGoals = filteredGoals.filter(g => {
    const daysLeft = getDaysUntilDeadline(g.deadline)
    return daysLeft < 0 && g.status !== "achieved" && g.status !== "cancelled"
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "achieved":
        return "bg-green-100 text-green-800 border-green-300"
      case "on-track":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "at-risk":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "achieved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "at-risk":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Target className="h-4 w-4 text-blue-600" />
    }
  }

  function getDaysUntilDeadline(deadline: string) {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleSaveGoal = (goalId: string, updates: any) => {
    toast({
      title: "Goal Updated",
      description: "The goal has been successfully updated.",
    })
  }

  useEffect(() => {
    loadGoalsFromDatabase()
    loadInterventionStats()
  }, [])

  const loadGoalsFromDatabase = async () => {
    setLoadingGoals(true)
    try {
      const { data, error } = await supabase
        .from('dimension_goals')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_date', { ascending: false })

      if (data && data.length > 0) {
        const formattedGoals: DimensionGoal[] = data.map(goal => ({
          id: goal.id,
          dimensionId: goal.dimension_id,
          dimensionName: goal.dimension_name,
          description: goal.description,
          baseline: Number(goal.baseline),
          target: Number(goal.target),
          current: Number(goal.current),
          timeframe: goal.timeframe,
          deadline: new Date(goal.deadline).toISOString(),
          progress: Number(goal.progress),
          status: goal.status,
          createdDate: new Date(goal.created_date).toISOString(),
          linkedInterventions: [],
        }))
        setDbGoals(formattedGoals)
      }
    } catch (error) {
      console.error('Error loading goals:', error)
    } finally {
      setLoadingGoals(false)
    }
  }

  const loadInterventionStats = async () => {
    const stats = await getInterventionStats(patientId)
    setInterventionStats(stats)
  }

  const loadGoalInterventions = async (goalId: string) => {
    if (goalInterventions[goalId]) {
      return
    }

    setLoadingGoalId(goalId)
    try {
      const [regularInterventions, dimensionInterventions] = await Promise.all([
        getInterventionsByGoalId(goalId),
        getDimensionInterventionsByGoalId(goalId),
      ])

      setGoalInterventions(prev => ({
        ...prev,
        [goalId]: [...regularInterventions, ...dimensionInterventions],
      }))
    } finally {
      setLoadingGoalId(null)
    }
  }

  const toggleGoalExpanded = async (goalId: string) => {
    const newExpanded = new Set(expandedGoalIds)
    if (newExpanded.has(goalId)) {
      newExpanded.delete(goalId)
    } else {
      newExpanded.add(goalId)
      await loadGoalInterventions(goalId)
    }
    setExpandedGoalIds(newExpanded)
  }

  const handleSaveIntervention = async (intervention: any) => {
    toast({
      title: "Intervention Added",
      description: "The intervention has been successfully added to the goal.",
    })
    if (addingInterventionForGoal) {
      setGoalInterventions(prev => {
        const updated = { ...prev }
        delete updated[addingInterventionForGoal.id]
        return updated
      })
      if (expandedGoalIds.has(addingInterventionForGoal.id)) {
        await loadGoalInterventions(addingInterventionForGoal.id)
      }
    }
    await loadInterventionStats()
  }

  const handleStopIntervention = async (stoppedDate: string, stoppedReason: string) => {
    if (!stoppingIntervention) return

    setLoading(true)
    try {
      let result
      if ('type' in stoppingIntervention) {
        result = await stopIntervention(
          stoppingIntervention.id,
          stoppedDate,
          stoppedReason,
          'Dr. Anderson'
        )
      } else {
        result = await stopDimensionIntervention(
          stoppingIntervention.id,
          stoppedDate,
          stoppedReason
        )
      }

      if (result) {
        toast({
          title: "Intervention Stopped",
          description: "The intervention has been successfully stopped.",
        })

        const goalId = stoppingIntervention.goal_id
        if (goalId) {
          setGoalInterventions(prev => {
            const updated = { ...prev }
            delete updated[goalId]
            return updated
          })
          await loadGoalInterventions(goalId)
        }
        await loadInterventionStats()
      } else {
        toast({
          title: "Error",
          description: "Failed to stop intervention. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while stopping the intervention.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setStoppingIntervention(null)
    }
  }

  const GoalCard = ({ goal }: { goal: DimensionGoal }) => {
    const daysLeft = getDaysUntilDeadline(goal.deadline)
    const isApproachingDeadline = daysLeft <= 14 && daysLeft > 0
    const isOverdue = daysLeft < 0
    const dimensionConfig = healthDimensionsConfig.find(c => c.id === goal.dimensionId)
    const isExpanded = expandedGoalIds.has(goal.id)
    const interventions = goalInterventions[goal.id] || []
    const activeInterventionsCount = interventions.filter(i => i.status === 'active').length

    return (
      <Card className="shadow-sm border-gray-200 bg-white hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div
              className="w-1 h-full rounded-full flex-shrink-0"
              style={{ backgroundColor: dimensionConfig?.color }}
            />
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(goal.status)}
                    <Badge className={`${getStatusColor(goal.status)} text-xs border`}>
                      {goal.status}
                    </Badge>
                    <span className="text-xs text-gray-600">{goal.dimensionName}</span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{goal.description}</h3>
                  <p className="text-sm text-gray-600">
                    Created on {new Date(goal.createdDate).toLocaleDateString()} • {goal.timeframe}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingGoal(goal)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setAddingInterventionForGoal(goal)}>
                    <Pill className="h-4 w-4 mr-1" />
                    Add Intervention
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-200">
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Baseline</p>
                  <p className="text-2xl font-bold text-gray-900">{goal.baseline}</p>
                  <p className="text-xs text-gray-500">Starting Point</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Current Score</p>
                  <p className="text-2xl font-bold text-blue-600">{goal.current}</p>
                  <p className="text-xs text-gray-500">Latest Reading</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Target</p>
                  <p className="text-2xl font-bold text-green-600">{goal.target}</p>
                  <p className="text-xs text-gray-500">Goal</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress to Target</span>
                  <span className="font-semibold text-gray-900">{goal.progress}% Complete</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span
                    className={
                      isOverdue
                        ? "text-red-600 font-medium"
                        : isApproachingDeadline
                          ? "text-orange-600 font-medium"
                          : "text-gray-600"
                    }
                  >
                    Due: {new Date(goal.deadline).toLocaleDateString()}
                    {isApproachingDeadline && " (Approaching)"}
                    {isOverdue && " (Overdue)"}
                  </span>
                </div>
                {isOverdue && (
                  <Badge variant="destructive" className="text-xs">
                    {Math.abs(daysLeft)} days overdue
                  </Badge>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleGoalExpanded(goal.id)}
                  className="w-full justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Interventions ({activeInterventionsCount} active)
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>

                {isExpanded && (
                  <div className="mt-3 space-y-2">
                    {loadingGoalId === goal.id ? (
                      <div className="text-center py-8 text-gray-500">
                        <div className="animate-spin h-8 w-8 mx-auto mb-2 border-4 border-gray-300 border-t-blue-600 rounded-full" />
                        <p className="text-sm">Loading interventions...</p>
                      </div>
                    ) : interventions.length > 0 ? (
                      interventions.map((intervention) => (
                        <InterventionListItem
                          key={intervention.id}
                          intervention={intervention}
                          onStop={setStoppingIntervention}
                          showStopButton={true}
                        />
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Pill className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">No interventions yet</p>
                        <p className="text-xs mt-1">Click "Add Intervention" above to create one</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href={`/patients/${patientId}`}>
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Patient Detail
            </Button>
          </Link>
          <h1 className="text-3xl font-semibold text-gray-900">
            {patientName ? `${patientName}'s Health Goals` : "Patient Health Goals"}
          </h1>
          <p className="text-gray-600 mt-1">Monitor and manage all treatment goals for this patient</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add New Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="shadow-sm border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Goals</p>
                <p className="text-2xl font-bold text-gray-900">{activeGoals.length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">At Risk</p>
                <p className="text-2xl font-bold text-gray-900">{atRiskGoals.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Achieved</p>
                <p className="text-2xl font-bold text-gray-900">{achievedGoals.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Interventions</p>
                <p className="text-2xl font-bold text-gray-900">{interventionStats?.active || 0}</p>
              </div>
              <Activity className="h-8 w-8 text-teal-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Interventions</p>
                <p className="text-2xl font-bold text-gray-900">{interventionStats?.total || 0}</p>
              </div>
              <Pill className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-gray-200 bg-white">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Sort Goals
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Health Dimension</label>
              <Select value={filterDimension} onValueChange={setFilterDimension}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dimensions</SelectItem>
                  {healthDimensionsConfig.map(dim => (
                    <SelectItem key={dim.id} value={dim.id}>
                      {dim.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="on-track">On Track</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                  <SelectItem value="achieved">Achieved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Interventions</label>
              <Select value={filterInterventions} onValueChange={setFilterInterventions}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Goals</SelectItem>
                  <SelectItem value="with-interventions">With Interventions</SelectItem>
                  <SelectItem value="without-interventions">Without Interventions</SelectItem>
                  <SelectItem value="active-interventions">With Active Interventions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                  <SelectItem value="dimension">Health Dimension</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredGoals.length > 0 ? (
          filteredGoals.map(goal => <GoalCard key={goal.id} goal={goal} />)
        ) : (
          <Card className="shadow-sm border-gray-200 bg-white">
            <CardContent className="p-12 text-center">
              <Target className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No goals found</h3>
              <p className="text-gray-600">Try adjusting your filters or create a new goal for this patient.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="shadow-sm border-gray-200 bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-2">Clinical Notes</h3>
          <p className="text-sm text-gray-700 mb-2">
            Lower scores indicate better health outcomes in most dimensions. Goals should be set with consideration for:
          </p>
          <ul className="space-y-1 text-sm text-gray-700 ml-4">
            <li>• Patient's baseline health status and comorbidities</li>
            <li>• Realistic timeframes based on intervention effectiveness</li>
            <li>• MCID (Minimal Clinically Important Difference) thresholds</li>
            <li>• Patient engagement and adherence capacity</li>
          </ul>
        </CardContent>
      </Card>

      {editingGoal && (
        <EditGoalDialog
          open={!!editingGoal}
          onOpenChange={(open) => !open && setEditingGoal(null)}
          goal={editingGoal}
          onSave={handleSaveGoal}
        />
      )}

      {addingInterventionForGoal && (
        <AddInterventionDialog
          open={!!addingInterventionForGoal}
          onOpenChange={(open) => !open && setAddingInterventionForGoal(null)}
          dimensionId={addingInterventionForGoal.dimensionId}
          dimensionName={addingInterventionForGoal.dimensionName}
          goals={goalsToUse}
          patientId={patientId}
          onSave={handleSaveIntervention}
        />
      )}

      <StopInterventionDialog
        open={!!stoppingIntervention}
        onOpenChange={(open) => !open && setStoppingIntervention(null)}
        intervention={stoppingIntervention}
        onConfirm={handleStopIntervention}
      />
    </div>
  )
}
