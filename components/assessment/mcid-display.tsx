"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingDown, TrendingUp, Minus, Info } from "lucide-react"
import type { MCIDData, MCIDStatus } from "@/lib/nsh-assessment-mock"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface MCIDDisplayProps {
  mcid?: MCIDData
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  variant?: "inline" | "card" | "badge"
}

export function MCIDDisplay({ mcid, size = "md", showLabel = true, variant = "inline" }: MCIDDisplayProps) {
  if (!mcid) {
    return null
  }

  const getStatusColor = (status: MCIDStatus) => {
    switch (status) {
      case "improved":
        return "text-emerald-600"
      case "worsened":
        return "text-red-600"
      case "stable":
        return "text-gray-600"
      default:
        return "text-gray-500"
    }
  }

  const getStatusBgColor = (status: MCIDStatus) => {
    switch (status) {
      case "improved":
        return "bg-emerald-50 border-emerald-200"
      case "worsened":
        return "bg-red-50 border-red-200"
      case "stable":
        return "bg-gray-50 border-gray-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const getStatusIcon = (status: MCIDStatus) => {
    const iconClass = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-6 w-6" : "h-4 w-4"

    switch (status) {
      case "improved":
        return <TrendingDown className={`${iconClass} text-emerald-600`} />
      case "worsened":
        return <TrendingUp className={`${iconClass} text-red-600`} />
      case "stable":
        return <Minus className={`${iconClass} text-gray-600`} />
      default:
        return null
    }
  }

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  if (variant === "badge") {
    return (
      <Badge variant="outline" className={`${getStatusBgColor(mcid.status)} border ${sizeClasses[size]}`}>
        <span className="flex items-center gap-1">
          {getStatusIcon(mcid.status)}
          <span className={getStatusColor(mcid.status)}>MCID: {mcid.description}</span>
        </span>
      </Badge>
    )
  }

  if (variant === "card") {
    return (
      <Card className={`${getStatusBgColor(mcid.status)} border`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(mcid.status)}
              <div>
                <div className="flex items-center gap-2">
                  <p className={`font-semibold ${sizeClasses[size]} text-gray-900`}>
                    MCID
                  </p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">
                          Minimally Clinically Important Difference - The smallest change in score that represents a meaningful improvement or decline in patient health
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className={`${getStatusColor(mcid.status)} font-medium ${sizeClasses[size]}`}>
                  {mcid.description}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Baseline: {mcid.baseline} → Current: {mcid.current} ({mcid.changePercent > 0 ? "+" : ""}{mcid.changePercent}%)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {showLabel && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span className={`font-medium text-gray-700 ${sizeClasses[size]} flex items-center gap-1`}>
                MCID
                <Info className="h-3 w-3 text-gray-500" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">
                Minimally Clinically Important Difference - The smallest change in score that represents a meaningful improvement or decline in patient health
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <div className="flex items-center gap-1">
        {getStatusIcon(mcid.status)}
        <span className={`${getStatusColor(mcid.status)} font-medium ${sizeClasses[size]}`}>
          {mcid.description}
        </span>
      </div>
    </div>
  )
}

interface MCIDIndicatorProps {
  mcid?: MCIDData
  compact?: boolean
}

export function MCIDIndicator({ mcid, compact = false }: MCIDIndicatorProps) {
  if (!mcid) {
    return <span className="text-xs text-gray-500">No baseline</span>
  }

  const getStatusColor = (status: MCIDStatus) => {
    switch (status) {
      case "improved":
        return "text-emerald-600"
      case "worsened":
        return "text-red-600"
      case "stable":
        return "text-gray-600"
      default:
        return "text-gray-500"
    }
  }

  const getStatusIcon = (status: MCIDStatus) => {
    switch (status) {
      case "improved":
        return <TrendingDown className="h-3 w-3" />
      case "worsened":
        return <TrendingUp className="h-3 w-3" />
      case "stable":
        return <Minus className="h-3 w-3" />
      default:
        return null
    }
  }

  if (compact) {
    return (
      <span className={`flex items-center gap-1 text-xs ${getStatusColor(mcid.status)}`}>
        {getStatusIcon(mcid.status)}
        {Math.abs(mcid.change)} pts
      </span>
    )
  }

  return (
    <div className={`flex items-center gap-1 text-sm ${getStatusColor(mcid.status)}`}>
      {getStatusIcon(mcid.status)}
      <span className="font-medium">{mcid.description}</span>
    </div>
  )
}
