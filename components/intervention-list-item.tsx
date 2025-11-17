"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pill, Dumbbell, Brain, Users, Plus, Calendar, StopCircle, Info } from "lucide-react"
import type { Intervention, DimensionIntervention } from "@/lib/intervention-service"
import { getInterventionDisplayName } from "@/lib/intervention-service"

interface InterventionListItemProps {
  intervention: Intervention | DimensionIntervention
  onStop?: (intervention: Intervention | DimensionIntervention) => void
  onEdit?: (intervention: Intervention | DimensionIntervention) => void
  showStopButton?: boolean
}

export function InterventionListItem({
  intervention,
  onStop,
  onEdit,
  showStopButton = true,
}: InterventionListItemProps) {
  const type = 'type' in intervention ? intervention.type : intervention.intervention_type
  const startDate = 'date' in intervention ? intervention.date : intervention.start_date

  const getTypeIcon = (t: string) => {
    switch (t) {
      case 'Medication':
        return Pill
      case 'Lifestyle':
        return Dumbbell
      case 'Therapy':
        return Brain
      case 'Social':
        return Users
      default:
        return Plus
    }
  }

  const getTypeColor = (t: string) => {
    switch (t) {
      case 'Medication':
        return 'text-blue-600 bg-blue-50'
      case 'Lifestyle':
        return 'text-green-600 bg-green-50'
      case 'Therapy':
        return 'text-purple-600 bg-purple-50'
      case 'Social':
        return 'text-pink-600 bg-pink-50'
      default:
        return 'text-orange-600 bg-orange-50'
    }
  }

  const Icon = getTypeIcon(type)
  const displayName = getInterventionDisplayName(intervention)
  const isStopped = intervention.status === 'stopped'

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${isStopped ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'}`}>
      <div className={`p-2 rounded-md ${getTypeColor(type)}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className={`text-sm font-medium ${isStopped ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {displayName}
          </p>
          <Badge
            variant={intervention.status === 'active' ? 'default' : 'secondary'}
            className={`text-xs ${
              intervention.status === 'active'
                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                : 'bg-red-100 text-red-800 hover:bg-red-100'
            }`}
          >
            {intervention.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Calendar className="h-3 w-3" />
          <span>Started: {new Date(startDate).toLocaleDateString()}</span>
          {intervention.end_date && (
            <>
              <span>•</span>
              <span>End: {new Date(intervention.end_date).toLocaleDateString()}</span>
            </>
          )}
        </div>
        {intervention.notes && (
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{intervention.notes}</p>
        )}
        {isStopped && intervention.stopped_date && intervention.stopped_reason && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
            <div className="flex items-center gap-1 font-medium text-red-800 mb-1">
              <StopCircle className="h-3 w-3" />
              <span>Stopped on {new Date(intervention.stopped_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-start gap-1 text-red-700">
              <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <span>{intervention.stopped_reason}</span>
            </div>
          </div>
        )}
      </div>
      {intervention.status === 'active' && showStopButton && onStop && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onStop(intervention)}
          className="h-8 px-2 text-xs text-red-600 hover:text-red-800 hover:bg-red-50"
        >
          <StopCircle className="h-3 w-3 mr-1" />
          Stop
        </Button>
      )}
    </div>
  )
}
