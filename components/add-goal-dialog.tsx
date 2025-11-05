"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddGoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dimensionId: string
  dimensionName: string
  currentScore: number
  onSave: (goal: {
    description: string
    baseline: number
    target: number
    current: number
    timeframe: string
    deadline: string
  }) => void
}

export function AddGoalDialog({
  open,
  onOpenChange,
  dimensionId,
  dimensionName,
  currentScore,
  onSave,
}: AddGoalDialogProps) {
  const [description, setDescription] = useState("")
  const [baseline, setBaseline] = useState(currentScore.toString())
  const [target, setTarget] = useState("")
  const [current, setCurrent] = useState(currentScore.toString())
  const [timeframe, setTimeframe] = useState("6 months")
  const [deadline, setDeadline] = useState("")

  useEffect(() => {
    setBaseline(currentScore.toString())
    setCurrent(currentScore.toString())
  }, [currentScore])

  useEffect(() => {
    let months: number
    if (timeframe === "1 year") {
      months = 12
    } else {
      months = parseInt(timeframe)
    }
    if (!isNaN(months)) {
      const deadlineDate = new Date()
      deadlineDate.setMonth(deadlineDate.getMonth() + months)
      setDeadline(deadlineDate.toISOString().slice(0, 10))
    }
  }, [timeframe])

  const resetForm = () => {
    setDescription("")
    setBaseline(currentScore.toString())
    setTarget("")
    setCurrent(currentScore.toString())
    setTimeframe("6 months")
    const deadlineDate = new Date()
    deadlineDate.setMonth(deadlineDate.getMonth() + 6)
    setDeadline(deadlineDate.toISOString().slice(0, 10))
  }

  const handleSave = () => {
    if (!description.trim() || !baseline || !target || !current || !deadline) return

    const baselineNum = parseFloat(baseline)
    const targetNum = parseFloat(target)
    const currentNum = parseFloat(current)

    if (isNaN(baselineNum) || isNaN(targetNum) || isNaN(currentNum)) return
    if (baselineNum < 0 || baselineNum > 100) return
    if (targetNum < 0 || targetNum > 100) return
    if (currentNum < 0 || currentNum > 100) return

    onSave({
      description: description.trim(),
      baseline: baselineNum,
      target: targetNum,
      current: currentNum,
      timeframe,
      deadline,
    })

    resetForm()
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
          <DialogTitle>Add Goal</DialogTitle>
          <DialogDescription>
            Create a new health improvement goal for {dimensionName}
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
                  <SelectItem value="1 year">1 year</SelectItem>
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
            <Label>Dimension</Label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm font-medium text-gray-900">{dimensionName}</p>
              <p className="text-xs text-gray-600">This goal will be associated with this dimension</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { resetForm(); onOpenChange(false); }}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid()}>
            Add Goal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
