"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  getPatientsByDimensionTier,
  getCohortStatistics,
  type CohortPatient,
  type PerformanceTier,
} from "@/lib/cohort-patient-service"
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  Users,
  Filter,
  X,
} from "lucide-react"
import type { RiskLevel } from "@/lib/nsh-assessment-mock"

interface CohortPatientListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dimensionId: string
  dimensionName: string
  dimensionColor: string
  performanceTier: PerformanceTier
}

type SortField = "name" | "age" | "gender" | "employmentStatus" | "location" | "dimensionScore" | "riskLevel"
type SortOrder = "asc" | "desc"

export function CohortPatientListDialog({
  open,
  onOpenChange,
  dimensionId,
  dimensionName,
  dimensionColor,
  performanceTier,
}: CohortPatientListDialogProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [riskLevelFilter, setRiskLevelFilter] = useState<string>("all")
  const [genderFilter, setGenderFilter] = useState<string>("all")
  const [employmentFilter, setEmploymentFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")

  const patients = useMemo(() => {
    return getPatientsByDimensionTier(dimensionId, performanceTier)
  }, [dimensionId, performanceTier])

  const cohortStats = useMemo(() => {
    return getCohortStatistics(dimensionId)
  }, [dimensionId])

  const filteredPatients = useMemo(() => {
    let filtered = [...patients]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.city.toLowerCase().includes(query) ||
          p.state.toLowerCase().includes(query)
      )
    }

    if (riskLevelFilter !== "all") {
      filtered = filtered.filter((p) => p.riskLevel === riskLevelFilter)
    }

    if (genderFilter !== "all") {
      filtered = filtered.filter((p) => p.gender === genderFilter)
    }

    if (employmentFilter !== "all") {
      filtered = filtered.filter((p) => p.employmentStatus === employmentFilter)
    }

    return filtered
  }, [patients, searchQuery, riskLevelFilter, genderFilter, employmentFilter])

  const sortedPatients = useMemo(() => {
    const sorted = [...filteredPatients]

    sorted.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case "name":
          aValue = a.name
          bValue = b.name
          break
        case "age":
          aValue = a.age
          bValue = b.age
          break
        case "gender":
          aValue = a.gender
          bValue = b.gender
          break
        case "employmentStatus":
          aValue = a.employmentStatus
          bValue = b.employmentStatus
          break
        case "location":
          aValue = `${a.city}, ${a.state}`
          bValue = `${b.city}, ${b.state}`
          break
        case "dimensionScore":
          aValue = a.dimensionScore
          bValue = b.dimensionScore
          break
        case "riskLevel":
          const riskOrder = { green: 1, yellow: 2, orange: 3, red: 4 }
          aValue = riskOrder[a.riskLevel as RiskLevel]
          bValue = riskOrder[b.riskLevel as RiskLevel]
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return sorted
  }, [filteredPatients, sortField, sortOrder])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    )
  }

  const getRiskBadgeVariant = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case "green":
        return "default"
      case "yellow":
        return "secondary"
      case "orange":
        return "secondary"
      case "red":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getRiskLabel = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case "green":
        return "Low Risk"
      case "yellow":
        return "Moderate"
      case "orange":
        return "Elevated"
      case "red":
        return "High Risk"
      default:
        return "Unknown"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingDown className="h-4 w-4 text-green-600" />
      case "declining":
        return <TrendingUp className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getPerformanceTierLabel = () => {
    switch (performanceTier) {
      case "high":
        return "High Performing"
      case "moderate":
        return "Moderate Performing"
      case "low":
        return "Low Performing"
    }
  }

  const getPerformanceTierColor = () => {
    switch (performanceTier) {
      case "high":
        return "bg-green-100 text-green-800 border-green-300"
      case "moderate":
        return "bg-amber-100 text-amber-800 border-amber-300"
      case "low":
        return "bg-red-100 text-red-800 border-red-300"
    }
  }

  const handlePatientClick = (patientId: number) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "cohort-context",
        JSON.stringify({
          dimensionId,
          dimensionName,
          dimensionColor,
          performanceTier,
          filters: {
            riskLevel: riskLevelFilter,
            gender: genderFilter,
            employment: employmentFilter,
            search: searchQuery,
          },
          sort: {
            field: sortField,
            order: sortOrder,
          },
        })
      )
    }
    router.push(`/patients/${patientId}?from=cohort&dimension=${dimensionId}&tier=${performanceTier}`)
  }

  const handleExportCSV = () => {
    const headers = ["Name", "Age", "Gender", "Employment Status", "City", "State", "Score", "Risk Level", "Trend"]
    const rows = sortedPatients.map((p) => [
      p.name,
      p.age.toString(),
      p.gender,
      p.employmentStatus,
      p.city,
      p.state,
      p.dimensionScore.toFixed(1),
      getRiskLabel(p.riskLevel),
      p.trend,
    ])

    const csvContent = [
      `"${dimensionName} - ${getPerformanceTierLabel()} Patients"`,
      `"Total Patients: ${sortedPatients.length}"`,
      `"Cohort Average Score: ${cohortStats.avgScore}"`,
      "",
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${dimensionId}-${performanceTier}-patients.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setRiskLevelFilter("all")
    setGenderFilter("all")
    setEmploymentFilter("all")
  }

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (riskLevelFilter !== "all") count++
    if (genderFilter !== "all") count++
    if (employmentFilter !== "all") count++
    if (searchQuery) count++
    return count
  }, [riskLevelFilter, genderFilter, employmentFilter, searchQuery])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[98vw] w-full max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">
                {dimensionName} - {getPerformanceTierLabel()}
              </DialogTitle>
              <DialogDescription className="mt-2">
                Viewing {sortedPatients.length} of {patients.length} patients in this cohort
              </DialogDescription>
            </div>
            <Badge className={`px-3 py-1 ${getPerformanceTierColor()}`}>
              {getPerformanceTierLabel()}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Total Patients</span>
              </div>
              <div className="text-2xl font-bold">{sortedPatients.length}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-600">Average Score</span>
              </div>
              <div className="text-2xl font-bold">{cohortStats.avgScore}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-600">Score Range</span>
              </div>
              <div className="text-2xl font-bold">
                {performanceTier === "high"
                  ? "0-30"
                  : performanceTier === "moderate"
                  ? "31-60"
                  : "61-100"}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={riskLevelFilter} onValueChange={setRiskLevelFilter}>
              <SelectTrigger className="w-[160px] min-w-[140px]">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="green">Low Risk</SelectItem>
                <SelectItem value="yellow">Moderate</SelectItem>
                <SelectItem value="orange">Elevated</SelectItem>
                <SelectItem value="red">High Risk</SelectItem>
              </SelectContent>
            </Select>
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger className="w-[140px] min-w-[120px]">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Non-binary">Non-binary</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={employmentFilter} onValueChange={setEmploymentFilter}>
              <SelectTrigger className="w-[160px] min-w-[140px]">
                <SelectValue placeholder="Employment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employment</SelectItem>
                <SelectItem value="Employed Full-Time">Employed Full-Time</SelectItem>
                <SelectItem value="Employed Part-Time">Employed Part-Time</SelectItem>
                <SelectItem value="Unemployed">Unemployed</SelectItem>
                <SelectItem value="Retired">Retired</SelectItem>
                <SelectItem value="Disabled">Disabled</SelectItem>
                <SelectItem value="Student">Student</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleExportCSV} className="whitespace-nowrap">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">{activeFilterCount} filter(s) active</span>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 px-2">
                <X className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            </div>
          )}
        </div>

        <ScrollArea className="h-[500px]">
          <div className="px-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("name")}
                      className="hover:bg-transparent p-0 h-auto font-semibold"
                    >
                      Name
                      {getSortIcon("name")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("age")}
                      className="hover:bg-transparent p-0 h-auto font-semibold"
                    >
                      Age
                      {getSortIcon("age")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("gender")}
                      className="hover:bg-transparent p-0 h-auto font-semibold"
                    >
                      Gender
                      {getSortIcon("gender")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("employmentStatus")}
                      className="hover:bg-transparent p-0 h-auto font-semibold"
                    >
                      Employment
                      {getSortIcon("employmentStatus")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("location")}
                      className="hover:bg-transparent p-0 h-auto font-semibold"
                    >
                      Location
                      {getSortIcon("location")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("dimensionScore")}
                      className="hover:bg-transparent p-0 h-auto font-semibold"
                    >
                      Score
                      {getSortIcon("dimensionScore")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("riskLevel")}
                      className="hover:bg-transparent p-0 h-auto font-semibold"
                    >
                      Risk Level
                      {getSortIcon("riskLevel")}
                    </Button>
                  </TableHead>
                  <TableHead>Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                      No patients match the current filters
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedPatients.map((patient) => (
                    <TableRow
                      key={patient.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handlePatientClick(patient.id)}
                    >
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell>{patient.employmentStatus}</TableCell>
                      <TableCell>
                        {patient.city}, {patient.state}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">{patient.dimensionScore.toFixed(1)}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRiskBadgeVariant(patient.riskLevel)}>
                          {getRiskLabel(patient.riskLevel)}
                        </Badge>
                      </TableCell>
                      <TableCell>{getTrendIcon(patient.trend)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
