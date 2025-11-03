"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DimensionGoal } from "@/lib/nsh-assessment-mock"

interface EditGoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goal: DimensionGoal
  onSave: (goalId: string, updates: {
    description: string
    baseline: number
    target: number
    current: number
    timeframe: string
    deadline: string
    status: string
  }) => void
}

export function EditGoalDialog({
  open,
  onOpenChange,
  goal,
  onSave,
}: EditGoalDialogProps) {
  const [description, setDescription] = useState(goal.description)
  const [baseline, setBaseline] = useState(goal.baseline.toString())
  const [target, setTarget] = useState(goal.target.toString())
  const [current, setCurrent] = useState(goal.current.toString())
  const [timeframe, setTimeframe] = useState(goal.timeframe)
  const [deadline, setDeadline] = useState(goal.deadline)
  const [status, setStatus] = useState(goal.status)

  useEffect(() => {
    if (open) {
      setDescription(goal.description)
      setBaseline(goal.baseline.toString())
      setTarget(goal.target.toString())
      setCurrent(goal.current.toString())
      setTimeframe(goal.timeframe)
      setDeadline(goal.deadline)
      setStatus(goal.status)
    }
  }, [open, goal])

  const handleSave = () => {
    if (!description.trim() || !baseline || !target || !current || !deadline) return

    const baselineNum = parseFloat(baseline)
    const targetNum = parseFloat(target)
    const currentNum = parseFloat(current)

    if (isNaN(baselineNum) || isNaN(targetNum) || isNaN(currentNum)) return
    if (baselineNum < 0 || baselineNum > 100) return
    if (targetNum < 0 || targetNum > 100) return
    if (currentNum < 0 || currentNum > 100) return

    onSave(goal.id, {
      description: description.trim(),
      baseline: baselineNum,
      target: targetNum,
      current: currentNum,
      timeframe,
      deadline,
      status,
    })

    onOpenChange(false)
  }

  const isFormValid = () => {
    if (!description.trim() || !baseline || !target || !current || !deadline) return false

    const baselineNum = parseFloat(baseline)
    const targetNum = parseFloat(target)
    const currentNum = parseFloat(current)

    if (isNaN(baselineNum) || isNaN(targetNum) || isNaN(currentNum)) return false
    if (baselineNum < 0 || baselineNum > 100) return false
    if (targetNum < 0 || targetNum > 100) return false
    if (currentNum < 0 || currentNum > 100) return false

    return true
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Goal</DialogTitle>
          <DialogDescription>
            Update the health improvement goal for {goal.dimensionName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="description">Goal Description</Label>
            <Textarea
              id="description"
              placeholder="e.g., Reduce depression score by 50%"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="baseline">Baseline Score</Label>
              <Input
                id="baseline"
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="0-100"
                value={baseline}
                onChange={(e) => setBaseline(e.target.value)}
              />
              <p className="text-xs text-gray-500">Starting point</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="current">Current Score</Label>
              <Input
                id="current"
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="0-100"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
              />
              <p className="text-xs text-gray-500">Current status</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="target">Target Score</Label>
              <Input
                id="target"
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="0-100"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
              <p className="text-xs text-gray-500">Goal to achieve</p>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Note:</span> Lower scores indicate better health. Set your target score below the baseline to show improvement.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeframe">Timeframe</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger id="timeframe">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3 months">3 months</SelectItem>
                  <SelectItem value="4 months">4 months</SelectItem>
                  <SelectItem value="6 months">6 months</SelectItem>
                  <SelectItem value="9 months">9 months</SelectItem>
                  <SelectItem value="12 months">12 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="on-track">On Track</SelectItem>
                <SelectItem value="at-risk">At Risk</SelectItem>
                <SelectItem value="achieved">Achieved</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Dimension</Label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm font-medium text-gray-900">{goal.dimensionName}</p>
              <p className="text-xs text-gray-600">This goal is associated with this dimension</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid()}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
