"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RiskScaleBar } from "./risk-scale-bar"
import { Info } from "lucide-react"

type ScoreCardProps = {
  title: string
  score: number
  statusText: string
  statusColorClass: string
  icon?: React.ReactNode
  interpretation: string
  accent?: "emerald" | "cyan" | "amber" | "rose"
}

export function ScoreCard({
  title,
  score,
  statusText,
  statusColorClass,
  icon,
  interpretation,
  accent = "emerald",
}: ScoreCardProps) {
  const accentMap: Record<string, string> = {
    emerald: "border-emerald-200",
    cyan: "border-cyan-200",
    amber: "border-amber-200",
    rose: "border-rose-200",
  }

  return (
    <Card className={`bg-white border ${accentMap[accent]} shadow-sm`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 text-pretty">{title}</CardTitle>
          <Badge variant="outline" className="text-xs text-gray-600">
            <Info className="h-3.5 w-3.5 mr-1" />
            Details
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          {icon ? <div className="p-2 rounded-md bg-gray-50">{icon}</div> : null}
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900">{score}</span>
            <span className="text-gray-400">▼</span>
          </div>
        </div>

        <RiskScaleBar score={score} ariaLabel={`${title} score is ${score} out of 100`} />

        <div className={`text-sm font-semibold ${statusColorClass}`}>{statusText}</div>

        <div className="rounded-md bg-emerald-50/40 p-3 text-sm text-gray-700">
          <div className="font-medium mb-1">Interpretation</div>
          <p className="text-pretty">{interpretation}</p>
        </div>
      </CardContent>
    </Card>
  )
}
