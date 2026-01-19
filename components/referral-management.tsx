"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Search, Plus, CheckCircle, Clock, Send, Calendar, FileText, MapPin, Globe, Star } from "lucide-react"

// Mock data for referrals and providers
const mockReferrals = [
  {
    id: "REF-001",
    patient: "Sarah Johnson",
    patientId: "P-12345",
    type: "Mental Health",
    specialty: "Psychiatrist",
    status: "proposed",
    priority: "high",
    reason: "Severe depression (PHQ-9: 18), medication management needed",
    autoMatched: true,
    provider: {
      name: "Dr. Emily Chen",
      specialty: "Psychiatrist",
      rating: 4.8,
      nextAvailable: "2025-01-15",
      location: "Downtown Medical Center",
      telehealth: true,
      languages: ["English", "Spanish"],
      insurance: ["Blue Cross", "Aetna", "Medicare"],
    },
    createdDate: "2025-01-10",
    dueDate: "2025-01-17",
    documents: [],
  },
  {
    id: "REF-002",
    patient: "Michael Davis",
    patientId: "P-67890",
    type: "Nutrition",
    specialty: "Dietitian",
    status: "approved",
    priority: "medium",
    reason: "Diabetes management, weight loss support",
    autoMatched: true,
    provider: {
      name: "Lisa Rodriguez, RD",
      specialty: "Registered Dietitian",
      rating: 4.9,
      nextAvailable: "2025-01-12",
      location: "Wellness Center",
      telehealth: true,
      languages: ["English", "Spanish"],
      insurance: ["Blue Cross", "United Healthcare"],
    },
    createdDate: "2025-01-08",
    dueDate: "2025-01-15",
    documents: ["care_plan.pdf"],
  },
  {
    id: "REF-003",
    patient: "Jennifer Wilson",
    patientId: "P-11111",
    type: "Physical Therapy",
    specialty: "Physical Therapist",
    status: "sent",
    priority: "medium",
    reason: "Chronic back pain, mobility improvement",
    autoMatched: false,
    provider: {
      name: "Mark Thompson, PT",
      specialty: "Physical Therapist",
      rating: 4.7,
      nextAvailable: "2025-01-20",
      location: "Rehabilitation Center",
      telehealth: false,
      languages: ["English"],
      insurance: ["Medicare", "Medicaid", "Blue Cross"],
    },
    createdDate: "2025-01-05",
    dueDate: "2025-01-12",
    documents: ["assessment_results.pdf", "imaging_report.pdf"],
  },
]

const mockProviderDirectory = [
  {
    id: "PROV-001",
    name: "Dr. Emily Chen",
    specialty: "Psychiatrist",
    subSpecialty: "Adult Depression & Anxiety",
    rating: 4.8,
    reviewCount: 127,
    nextAvailable: "2025-01-15",
    location: "Downtown Medical Center",
    address: "123 Medical Plaza, Suite 400",
    phone: "(555) 123-4567",
    telehealth: true,
    languages: ["English", "Spanish", "Mandarin"],
    insurance: ["Blue Cross", "Aetna", "Medicare", "United Healthcare"],
    credentials: ["MD", "Board Certified Psychiatrist"],
    experience: "15 years",
    specialties: ["Depression", "Anxiety", "PTSD", "Medication Management"],
  },
  {
    id: "PROV-002",
    name: "Lisa Rodriguez, RD",
    specialty: "Registered Dietitian",
    subSpecialty: "Diabetes & Weight Management",
    rating: 4.9,
    reviewCount: 89,
    nextAvailable: "2025-01-12",
    location: "Wellness Center",
    address: "456 Health Ave, Building B",
    phone: "(555) 234-5678",
    telehealth: true,
    languages: ["English", "Spanish"],
    insurance: ["Blue Cross", "United Healthcare", "Aetna"],
    credentials: ["RD", "CDE", "MS Nutrition"],
    experience: "12 years",
    specialties: ["Diabetes Management", "Weight Loss", "Heart Health", "Sports Nutrition"],
  },
  {
    id: "PROV-003",
    name: "Dr. James Wilson",
    specialty: "Cardiologist",
    subSpecialty: "Interventional Cardiology",
    rating: 4.6,
    reviewCount: 203,
    nextAvailable: "2025-01-25",
    location: "Heart Institute",
    address: "789 Cardiac Way, Floor 3",
    phone: "(555) 345-6789",
    telehealth: false,
    languages: ["English"],
    insurance: ["Medicare", "Blue Cross", "Aetna", "Cigna"],
    credentials: ["MD", "FACC", "Board Certified Cardiologist"],
    experience: "20 years",
    specialties: ["Heart Disease", "Cardiac Catheterization", "Stent Placement", "Heart Attack Care"],
  },
]

const statusColors = {
  proposed: "bg-blue-100 text-blue-800 border-blue-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  sent: "bg-yellow-100 text-yellow-800 border-yellow-200",
  scheduled: "bg-purple-100 text-purple-800 border-purple-200",
  completed: "bg-gray-100 text-gray-800 border-gray-200",
  closed: "bg-slate-100 text-slate-800 border-slate-200",
}

const priorityColors = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-green-100 text-green-800 border-green-200",
}

export default function ReferralManagement() {
  const [selectedReferral, setSelectedReferral] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [showProviderDirectory, setShowProviderDirectory] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState(null)

  const filteredReferrals = mockReferrals.filter((referral) => {
    const matchesSearch =
      referral.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.provider.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || referral.status === statusFilter
    const matchesPriority = priorityFilter === "all" || referral.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case "proposed":
        return <Clock className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "sent":
        return <Send className="h-4 w-4" />
      case "scheduled":
        return <Calendar className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "closed":
        return <FileText className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusProgress = (status) => {
    const statusOrder = ["proposed", "approved", "sent", "scheduled", "completed", "closed"]
    const currentIndex = statusOrder.indexOf(status)
    return ((currentIndex + 1) / statusOrder.length) * 100
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Referral Management</h2>
          <p className="text-muted-foreground">Manage patient referrals and provider directory</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowProviderDirectory(true)} variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Provider Directory
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Referral
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="search">Search Referrals</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by patient, type, or provider..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="min-w-[150px]">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="proposed">Proposed</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[150px]">
              <Label htmlFor="priority-filter">Priority</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referrals List */}
      <div className="grid gap-4">
        {filteredReferrals.map((referral) => (
          <Card key={referral.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{referral.patient}</h3>
                    <Badge className={`${priorityColors[referral.priority]} border`}>
                      {referral.priority.toUpperCase()}
                    </Badge>
                    <Badge className={`${statusColors[referral.status]} border`}>
                      {getStatusIcon(referral.status)}
                      <span className="ml-1 capitalize">{referral.status}</span>
                    </Badge>
                    {referral.autoMatched && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Auto-Matched
                      </Badge>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Referral Type</p>
                      <p className="font-medium">
                        {referral.type} - {referral.specialty}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Provider</p>
                      <p className="font-medium">{referral.provider.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Reason</p>
                      <p className="text-sm">{referral.reason}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Next Available</p>
                      <p className="text-sm">{referral.provider.nextAvailable}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                      <span>Progress</span>
                      <span>{Math.round(getStatusProgress(referral.status))}%</span>
                    </div>
                    <Progress value={getStatusProgress(referral.status)} className="h-2" />
                  </div>

                  {/* Provider Details */}
                  <div className="bg-muted/50 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Provider Details</h4>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{referral.provider.rating}</span>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{referral.provider.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3 text-muted-foreground" />
                        <span>{referral.provider.telehealth ? "Telehealth Available" : "In-Person Only"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Languages:</span>
                        <span>{referral.provider.languages.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {referral.status === "proposed" && (
                    <>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </>
                  )}
                  {referral.status === "approved" && (
                    <Button size="sm">
                      <Send className="h-4 w-4 mr-1" />
                      Send Referral
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  {referral.documents.length > 0 && (
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      Documents ({referral.documents.length})
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Provider Directory Dialog */}
      <Dialog open={showProviderDirectory} onOpenChange={setShowProviderDirectory}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Provider Directory</DialogTitle>
            <DialogDescription>Search and select providers for referrals</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Directory Search */}
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search providers by name, specialty, or location..." className="pl-10" />
                </div>
              </div>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  <SelectItem value="psychiatrist">Psychiatrist</SelectItem>
                  <SelectItem value="dietitian">Dietitian</SelectItem>
                  <SelectItem value="cardiologist">Cardiologist</SelectItem>
                  <SelectItem value="physical-therapy">Physical Therapy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Provider List */}
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {mockProviderDirectory.map((provider) => (
                  <Card key={provider.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{provider.name}</h3>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{provider.rating}</span>
                              <span className="text-sm text-muted-foreground">({provider.reviewCount} reviews)</span>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">Specialty:</span>
                              <span className="ml-1 font-medium">{provider.specialty}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Next Available:</span>
                              <span className="ml-1">{provider.nextAvailable}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Location:</span>
                              <span className="ml-1">{provider.location}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Languages:</span>
                              <span className="ml-1">{provider.languages.join(", ")}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mt-2">
                            {provider.specialties.slice(0, 3).map((specialty) => (
                              <Badge key={specialty} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                            {provider.specialties.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{provider.specialties.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          <Button size="sm">Select Provider</Button>
                          <Button size="sm" variant="outline">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
