"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BiometricTrendChart } from "./biometric-trend-chart"
import { BiometricComparisonChart, prepareComparisonData } from "./biometric-comparison-chart"
import { AddBiometricDialog } from "@/components/add-biometric-dialog"
import {
  getBiometricsByPatientId,
  biometricTypeConfigs,
  transformBiometricsForChart,
  getTrendDirection,
  getDateRangeFromDays,
  Biometric,
  ChartDataPoint,
} from "@/lib/biometric-service"
import { TrendingUp, TrendingDown, Minus, Calendar, Plus } from "lucide-react"

interface BiometricsDashboardProps {
  patientId: number
}

export function BiometricsDashboard({ patientId }: BiometricsDashboardProps) {
  const [biometrics, setBiometrics] = useState<Biometric[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["blood_pressure"])
  const [timeRange, setTimeRange] = useState<number>(30)
  const [showAddDialog, setShowAddDialog] = useState(false)

  useEffect(() => {
    loadBiometrics()
  }, [patientId])

  const loadBiometrics = async () => {
    setLoading(true)
    try {
      const data = await getBiometricsByPatientId(patientId)
      setBiometrics(data)
    } catch (error) {
      console.error("Error loading biometrics:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBiometric = (newBiometric: Biometric) => {
    setBiometrics([newBiometric, ...biometrics])
  }

  const { startDate, endDate } = getDateRangeFromDays(timeRange)

  const filteredBiometrics = biometrics.filter(
    (b) => b.date >= startDate && b.date <= endDate
  )

  const groupedByType = filteredBiometrics.reduce((acc, b) => {
    if (!acc[b.type]) {
      acc[b.type] = []
    }
    acc[b.type].push(b)
    return acc
  }, {} as Record<string, Biometric[]>)

  const availableTypes = Object.keys(groupedByType)

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type))
    } else {
      setSelectedTypes([...selectedTypes, type])
    }
  }

  const comparisonData = prepareComparisonData(filteredBiometrics, selectedTypes)

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-orange-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-green-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Biometrics</h1>
            <p className="text-gray-600 mt-1">Loading your health data...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Biometrics</h1>
          <p className="text-gray-600 mt-1">Track your vital signs and measurements over time</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Reading
        </Button>
      </div>

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-lg">Time Range</CardTitle>
              <CardDescription>Select the time period to view</CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant={timeRange === 7 ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(7)}
              >
                1 Week
              </Button>
              <Button
                variant={timeRange === 30 ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(30)}
              >
                1 Month
              </Button>
              <Button
                variant={timeRange === 90 ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(90)}
              >
                3 Months
              </Button>
              <Button
                variant={timeRange === 180 ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(180)}
              >
                6 Months
              </Button>
              <Button
                variant={timeRange === 365 ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(365)}
              >
                1 Year
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Biometric Types</CardTitle>
          <CardDescription>Select which measurements to display</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 flex-wrap">
            {availableTypes.map((type) => {
              const config = biometricTypeConfigs[type]
              const isSelected = selectedTypes.includes(type)
              return (
                <Button
                  key={type}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleType(type)}
                  className={isSelected ? "" : ""}
                  style={
                    isSelected
                      ? { backgroundColor: config?.color, borderColor: config?.color }
                      : {}
                  }
                >
                  {config?.label || type}
                  <Badge variant="secondary" className="ml-2 bg-white/20">
                    {groupedByType[type]?.length || 0}
                  </Badge>
                </Button>
              )
            })}
          </div>
          {availableTypes.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No biometric data available for the selected time range
            </p>
          )}
        </CardContent>
      </Card>

      {selectedTypes.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedTypes.map((type) => {
              const readings = groupedByType[type] || []
              if (readings.length === 0) return null

              const config = biometricTypeConfigs[type]
              const trend = getTrendDirection(readings)
              const latest = readings[0]

              return (
                <Card key={type} className="border-l-4" style={{ borderLeftColor: config?.color }}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-700">
                          {config?.label}
                        </h4>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(trend)}
                          <Badge variant="outline" className="text-xs">
                            {readings.length} readings
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-gray-900">
                          {config?.hasSecondary
                            ? `${latest.value}/${latest.secondary_value}`
                            : latest.value}
                        </p>
                        <p className="text-sm text-gray-500">{config?.unit}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Latest: {new Date(latest.date).toLocaleDateString()} at{" "}
                          {latest.time}
                        </span>
                      </div>
                      {latest.notes && (
                        <p className="text-xs text-gray-600 italic mt-2 p-2 bg-gray-50 rounded">
                          {latest.notes}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="grid grid-cols-1 gap-6">
            {selectedTypes.map((type) => {
              const readings = groupedByType[type] || []
              if (readings.length === 0) return null

              const config = biometricTypeConfigs[type]
              const chartData: ChartDataPoint[] = transformBiometricsForChart(readings)

              return (
                <BiometricTrendChart
                  key={type}
                  data={chartData}
                  typeConfig={config}
                  title={config?.label || type}
                />
              )
            })}
          </div>

          {selectedTypes.length > 1 && (
            <BiometricComparisonChart
              data={comparisonData}
              selectedTypes={selectedTypes}
              typeConfigs={biometricTypeConfigs}
            />
          )}
        </>
      )}

      {selectedTypes.length === 0 && availableTypes.length > 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">
              Select one or more biometric types above to view trend charts
            </p>
          </CardContent>
        </Card>
      )}

      <AddBiometricDialog
        patientId={patientId}
        onAdd={handleAddBiometric}
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  )
}
