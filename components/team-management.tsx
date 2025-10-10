"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  UserPlus,
  Phone,
  Mail,
  MessageSquare,
  Video,
  Calendar,
  Search,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  MoreVertical,
} from "lucide-react"

const mockTeamMembers = [
  {
    id: 1,
    name: "Dr. Michael Anderson",
    role: "Lead Psychiatrist",
    specialty: "Adult Psychiatry",
    avatar: "/placeholder.svg?height=60&width=60",
    email: "m.anderson@hospital.com",
    phone: "(555) 111-2222",
    status: "Available",
    online: true,
    patientLoad: 45,
    maxPatients: 60,
    rating: 4.8,
    responseTime: "< 2 hours",
  },
  {
    id: 2,
    name: "Lisa Chen",
    role: "Clinical Social Worker",
    specialty: "Cognitive Behavioral Therapy",
    avatar: "/placeholder.svg?height=60&width=60",
    email: "l.chen@hospital.com",
    phone: "(555) 333-4444",
    status: "In Session",
    online: true,
    patientLoad: 32,
    maxPatients: 40,
    rating: 4.9,
    responseTime: "< 1 hour",
  },
  {
    id: 3,
    name: "Dr. Sarah Williams",
    role: "Primary Care Physician",
    specialty: "Family Medicine",
    avatar: "/placeholder.svg?height=60&width=60",
    email: "s.williams@hospital.com",
    phone: "(555) 555-6666",
    status: "Unavailable",
    online: false,
    patientLoad: 78,
    maxPatients: 80,
    rating: 4.7,
    responseTime: "< 4 hours",
  },
  {
    id: 4,
    name: "James Rodriguez",
    role: "Registered Nurse",
    specialty: "Psychiatric Nursing",
    avatar: "/placeholder.svg?height=60&width=60",
    email: "j.rodriguez@hospital.com",
    phone: "(555) 777-8888",
    status: "Available",
    online: true,
    patientLoad: 25,
    maxPatients: 30,
    rating: 4.6,
    responseTime: "< 30 min",
  },
]

interface TeamManagementProps {
  onMessageClick?: (memberId: number) => void
}

export function TeamManagement({ onMessageClick }: TeamManagementProps = {}) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMembers = mockTeamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.specialty.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-700 border-green-200"
      case "in session":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "unavailable":
        return "bg-gray-100 text-gray-700 border-gray-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return <CheckCircle className="h-3 w-3" />
      case "in session":
        return <AlertCircle className="h-3 w-3" />
      case "unavailable":
        return <XCircle className="h-3 w-3" />
      default:
        return <AlertCircle className="h-3 w-3" />
    }
  }

  const handleMessageClick = (memberId: number) => {
    if (onMessageClick) {
      onMessageClick(memberId)
    } else {
      // Default behavior: log to console
      console.log("[v0] Initiating message to team member:", memberId)
    }
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Team Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your healthcare team and collaboration</p>
          </div>
          <Button size="sm" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="directory" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="directory">Team Directory</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="directory" className="space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search team members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 bg-muted/50 border-0"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <Avatar className="h-14 w-14">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-base">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {member.online && (
                            <div className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-green-500 rounded-full border-2 border-card" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{member.specialty}</p>
                          <Badge variant="outline" className={`mt-2 text-xs gap-1 ${getStatusColor(member.status)}`}>
                            {getStatusIcon(member.status)}
                            {member.status}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{member.phone}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                      <div className="p-2 bg-muted/50 rounded-lg">
                        <p className="text-lg font-semibold text-foreground">{member.patientLoad}</p>
                        <p className="text-xs text-muted-foreground">Patients</p>
                      </div>
                      <div className="p-2 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <p className="text-lg font-semibold text-foreground">{member.rating}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">Rating</p>
                      </div>
                      <div className="p-2 bg-muted/50 rounded-lg">
                        <p className="text-sm font-semibold text-foreground">{member.responseTime}</p>
                        <p className="text-xs text-muted-foreground">Response</p>
                      </div>
                    </div>

                    {/* Patient Load Progress */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Patient Capacity</span>
                        <span className="font-medium text-foreground">
                          {member.patientLoad}/{member.maxPatients}
                        </span>
                      </div>
                      <Progress value={(member.patientLoad / member.maxPatients) * 100} className="h-1.5" />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 bg-transparent"
                        onClick={() => handleMessageClick(member.id)}
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                        <Video className="h-3.5 w-3.5" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                        <Calendar className="h-3.5 w-3.5" />
                        Schedule
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Team Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-foreground">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={getStatusColor(member.status)}>
                      {getStatusIcon(member.status)}
                      {member.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Members</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{mockTeamMembers.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Rating</p>
                      <p className="text-2xl font-bold text-foreground mt-1">4.75</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Patients</p>
                      <p className="text-2xl font-bold text-foreground mt-1">180</p>
                    </div>
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Response</p>
                      <p className="text-2xl font-bold text-foreground mt-1">2h</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
