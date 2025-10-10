"use client"

type Props = {
  score: number // 0-100
  ariaLabel?: string
}

export function RiskScaleBar({ score, ariaLabel }: Props) {
  const clamped = Math.max(0, Math.min(100, score))
  return (
    <div className="relative">
      <div className="h-3 rounded-md overflow-hidden flex" aria-hidden>
        <div className="bg-emerald-500 flex-1" />
        <div className="bg-amber-400 flex-1" />
        <div className="bg-red-500 flex-1" />
      </div>
      <div className="absolute -top-2" style={{ left: `${clamped}%`, transform: "translateX(-50%)" }} aria-hidden>
        <div className="w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-gray-800" />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>0</span>
        <span>100</span>
      </div>
      <span className="sr-only">{ariaLabel || `Score: ${clamped} out of 100`}</span>
    </div>
  )
}
