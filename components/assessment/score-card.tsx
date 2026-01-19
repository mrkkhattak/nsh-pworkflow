"use client"

import type React from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RiskScaleBar } from "./risk-scale-bar"
import { Info } from "lucide-react"
import type { RiskLevel } from "@/lib/nsh-assessment-mock"
import { getRiskBgColor, getRiskBorderColor } from "@/lib/nsh-assessment-mock"

type ScoreCardProps = {
  title: string
  score: number
  statusText: string
  statusColorClass: string
  icon?: React.ReactNode
  interpretation: string
  riskLevel: RiskLevel
  clickable?: boolean
  linkHref?: string
}

export function ScoreCard({
  title,
  score,
  statusText,
  statusColorClass,
  icon,
  interpretation,
  riskLevel,
  clickable = false,
  linkHref,
}: ScoreCardProps) {
  const cardContent = (
    <Card className={`bg-white border ${getRiskBorderColor(riskLevel)} shadow-sm ${
      clickable ? "cursor-pointer hover:shadow-md transition-shadow" : ""
    }`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 text-pretty">{title}</CardTitle>
          {clickable && (
            <Badge variant="outline" className="text-xs text-gray-600">
              <Info className="h-3.5 w-3.5 mr-1" />
              View Details
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          {icon ? <div className="p-2 rounded-md bg-gray-50">{icon}</div> : null}
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900">{score}</span>
          </div>
        </div>

        <RiskScaleBar score={score} riskLevel={riskLevel} ariaLabel={`${title} score is ${score} out of 100`} />

        <div className={`text-sm font-semibold ${statusColorClass}`}>{statusText}</div>

        <div className={`rounded-md ${getRiskBgColor(riskLevel)} p-3 text-sm text-gray-700`}>
          <div className="font-medium mb-1">Interpretation</div>
          <p className="text-pretty">{interpretation}</p>
        </div>
      </CardContent>
    </Card>
  )

  if (clickable && linkHref) {
    return <Link href={linkHref}>{cardContent}</Link>
  }

  return cardContent
}
