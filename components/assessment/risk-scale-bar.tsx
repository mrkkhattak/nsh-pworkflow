"use client"

import type { RiskLevel } from "@/lib/nsh-assessment-mock"

type Props = {
  score: number
  riskLevel: RiskLevel
  ariaLabel?: string
}

export function RiskScaleBar({ score, riskLevel, ariaLabel }: Props) {
  const clamped = Math.max(0, Math.min(100, score))

  return (
    <div className="relative">
      <div className="h-3 rounded-md overflow-hidden flex" aria-hidden>
        <div className="bg-emerald-500 flex-1" />
        <div className="bg-yellow-400 flex-1" />
        <div className="bg-orange-500 flex-1" />
        <div className="bg-red-500 flex-1" />
      </div>
      <div className="absolute -top-2" style={{ left: `${clamped}%`, transform: "translateX(-50%)" }} aria-hidden>
        <div className="w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-gray-800" />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span className="text-emerald-600 font-medium">0 (Best)</span>
        <span className="text-red-600 font-medium">100 (Worst)</span>
      </div>
      <span className="sr-only">{ariaLabel || `Score: ${clamped} out of 100. Risk level: ${riskLevel}`}</span>
    </div>
  )
}
