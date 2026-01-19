"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import {
  MessageSquare,
  Send,
  Phone,
  Video,
  Users,
  Paperclip,
  Mic,
  MoreHorizontal,
  Search,
  Bell,
  CheckCheck,
  Clock,
  Star,
  UserPlus,
  Calendar,
  FileText,
  ThumbsUp,
  Zap,
  Mail,
} from "lucide-react"

const mockConversations = [
  {
    id: 1,
    type: "patient",
    participant: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "Patient",
      status: "online",
    },
    lastMessage: {
      content: "Thank you for the medication adjustment. I'm feeling much better!",
      timestamp: "2 min ago",
      sender: "patient",
      read: true,
    },
    unreadCount: 0,
    priority: "normal",
    tags: ["medication", "follow-up"],
  },
  {
    id: 2,
    type: "provider",
    participant: {
      name: "Dr. Smith",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "Psychiatrist",
      status: "online",
    },
    lastMessage: {
      content: "Patient shows significant improvement in PHQ-9 scores. Recommend continuing current treatment.",
      timestamp: "15 min ago",
      sender: "provider",
      read: false,
    },
    unreadCount: 1,
    priority: "high",
    tags: ["consultation", "assessment"],
  },
  {
    id: 3,
    type: "group",
    participant: {
      name: "Sarah Johnson Care Team",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "Care Team",
      status: "active",
    },
    lastMessage: {
      content: "Team meeting scheduled for tomorrow at 2 PM to discuss treatment plan",
      timestamp: "1 hour ago",
      sender: "coordinator",
      read: true,
    },
    unreadCount: 0,
    priority: "normal",
    tags: ["team-meeting", "care-plan"],
    members: ["Dr. Anderson", "Dr. Smith", "Jane Doe (Pharmacist)", "Care Coordinator"],
  },
]

const mockMessages = [
  {
    id: 1,
    sender: "patient",
    senderName: "Sarah Johnson",
    content: "Hi Dr. Anderson, I wanted to update you on how I'm feeling with the new medication.",
    timestamp: "2024-01-15 10:30 AM",
    type: "text",
    read: true,
  },
  {
    id: 2,
    sender: "provider",
    senderName: "Dr. Anderson",
    content: "Hello Sarah! I'm glad to hear from you. How are you feeling? Any side effects?",
    timestamp: "2024-01-15 10:45 AM",
    type: "text",
    read: true,
  },
  {
    id: 3,
    sender: "patient",
    senderName: "Sarah Johnson",
    content:
      "Much better actually! The anxiety has decreased significantly and I'm sleeping better. No major side effects so far.",
    timestamp: "2024-01-15 11:00 AM",
    type: "text",
    read: true,
  },
  {
    id: 4,
    sender: "provider",
    senderName: "Dr. Anderson",
    content:
      "That's wonderful news! This aligns with your recent PHQ-9 improvement. Let's continue with the current dosage.",
    timestamp: "2024-01-15 11:15 AM",
    type: "text",
    read: true,
  },
  {
    id: 5,
    sender: "patient",
    senderName: "Sarah Johnson",
    content: "Thank you for the medication adjustment. I'm feeling much better!",
    timestamp: "2024-01-15 2:30 PM",
    type: "text",
    read: true,
  },
]

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
    patientLoad: 45,
    maxPatients: 60,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Lisa Chen, LCSW",
    role: "Clinical Social Worker",
    specialty: "Cognitive Behavioral Therapy",
    avatar: "/placeholder.svg?height=60&width=60",
    email: "l.chen@hospital.com",
    phone: "(555) 333-4444",
    status: "In Session",
    patientLoad: 32,
    maxPatients: 40,
    rating: 4.9,
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
    patientLoad: 78,
    maxPatients: 80,
    rating: 4.7,
  },
  {
    id: 4,
    name: "James Rodriguez, RN",
    role: "Registered Nurse",
    specialty: "Psychiatric Nursing",
    avatar: "/placeholder.svg?height=60&width=60",
    email: "j.rodriguez@hospital.com",
    phone: "(555) 777-8888",
    status: "Available",
    patientLoad: 25,
    maxPatients: 30,
    rating: 4.6,
  },
]

const messageTemplates = [
  {
    id: 1,
    category: "encouragement",
    title: "Progress Acknowledgment",
    content: "Great job on completing your assessment! Your progress shows real improvement.",
    icon: ThumbsUp,
  },
  {
    id: 2,
    category: "reminder",
    title: "Medication Reminder",
    content: "This is a friendly reminder to take your medication as prescribed. Consistency is key to your recovery.",
    icon: Clock,
  },
  {
    id: 3,
    category: "nudge",
    title: "Assessment Due",
    content: "Your weekly assessment is due. Please complete it when you have a few minutes.",
    icon: Bell,
  },
  {
    id: 4,
    category: "celebration",
    title: "Milestone Achievement",
    content: "Congratulations on reaching your treatment milestone! Your dedication is paying off.",
    icon: Star,
  },
]

export function MessagingTeamHub() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showTemplates, setShowTemplates] = useState(false)
  const [teamSearchQuery, setTeamSearchQuery] = useState("")

  const filteredConversations = mockConversations.filter((conv) =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredTeamMembers = mockTeamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(teamSearchQuery.toLowerCase()) ||
      member.specialty.toLowerCase().includes(teamSearchQuery.toLowerCase()),
  )

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  const handleTemplateSelect = (template: (typeof messageTemplates)[0]) => {
    setNewMessage(template.content)
    setShowTemplates(false)
  }

  const getConversationIcon = (type: string) => {
    switch (type) {
      case "patient":
        return MessageSquare
      case "provider":
        return Users
      case "group":
        return Users
      default:
        return MessageSquare
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-400"
      case "normal":
        return "border-l-blue-400"
      default:
        return "border-l-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-700"
      case "in session":
        return "bg-yellow-100 text-yellow-700"
      case "unavailable":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Communication Hub</h1>
        <p className="text-muted-foreground">Secure messaging and team collaboration</p>
      </div>

      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="team">Healthcare Team</TabsTrigger>
          <TabsTrigger value="collaboration">Team Collaboration</TabsTrigger>
        </TabsList>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-0">
          <div className="flex gap-6 h-[calc(100vh-280px)]">
            {/* Conversations List */}
            <div className="w-80 flex-shrink-0">
              <Card className="h-full border shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-foreground">Conversations</h3>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-9"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex-1">
                  <ScrollArea className="h-[calc(100vh-400px)]">
                    <div className="px-4 pb-4 space-y-1">
                      {filteredConversations.map((conversation) => {
                        const Icon = getConversationIcon(conversation.type)
                        return (
                          <div
                            key={conversation.id}
                            className={`p-3 rounded-lg cursor-pointer transition-all border-l-3 ${getPriorityColor(
                              conversation.priority,
                            )} ${
                              selectedConversation.id === conversation.id
                                ? "bg-accent border-primary"
                                : "hover:bg-accent/50"
                            }`}
                            onClick={() => setSelectedConversation(conversation)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="relative">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={conversation.participant.avatar || "/placeholder.svg"} />
                                  <AvatarFallback className="text-sm">
                                    {conversation.participant.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                {conversation.participant.status === "online" && (
                                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-1">
                                    <h4 className="font-medium text-foreground text-sm truncate">
                                      {conversation.participant.name}
                                    </h4>
                                    <Icon className="h-3 w-3 text-muted-foreground" />
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {conversation.unreadCount > 0 && (
                                      <Badge className="bg-destructive text-destructive-foreground text-xs h-5 px-1.5">
                                        {conversation.unreadCount}
                                      </Badge>
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                      {conversation.lastMessage.timestamp}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                  {conversation.lastMessage.content}
                                </p>
                                <div className="flex gap-1">
                                  {conversation.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs h-5 px-1.5">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Chat Area */}
            <div className="flex-1">
              <Card className="h-full border shadow-sm flex flex-col">
                {/* Chat Header */}
                <CardHeader className="pb-4 border-b flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedConversation.participant.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {selectedConversation.participant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-foreground">{selectedConversation.participant.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedConversation.participant.role}</p>
                      </div>
                      {selectedConversation.type === "group" && (
                        <Badge variant="outline" className="text-xs">
                          {selectedConversation.members?.length} members
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages Area */}
                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full p-4">
                    <div className="space-y-4">
                      {mockMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${message.sender === "provider" ? "flex-row-reverse" : ""}`}
                        >
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback className="text-xs">
                              {message.senderName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`flex-1 max-w-[70%] ${message.sender === "provider" ? "text-right" : ""}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-foreground">{message.senderName}</span>
                              <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                              {message.read && message.sender === "provider" && (
                                <CheckCheck className="h-3 w-3 text-primary" />
                              )}
                            </div>
                            <div
                              className={`p-3 rounded-xl text-sm ${
                                message.sender === "provider"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-foreground"
                              }`}
                            >
                              <p>{message.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Message Input */}
                <div className="border-t p-4 flex-shrink-0">
                  {showTemplates && (
                    <div className="mb-4 p-3 bg-muted rounded-lg border">
                      <h4 className="text-sm font-medium text-foreground mb-2">Quick Templates</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {messageTemplates.map((template) => {
                          const Icon = template.icon
                          return (
                            <Button
                              key={template.id}
                              variant="outline"
                              size="sm"
                              className="justify-start h-auto p-2 text-left bg-transparent"
                              onClick={() => handleTemplateSelect(template)}
                            >
                              <Icon className="h-3 w-3 mr-2 flex-shrink-0" />
                              <div className="min-w-0">
                                <div className="text-xs font-medium truncate">{template.title}</div>
                                <div className="text-xs text-muted-foreground truncate">{template.content}</div>
                              </div>
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="min-h-[60px] max-h-32 resize-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowTemplates(!showTemplates)}
                        className="h-8 w-8 p-0"
                      >
                        <Zap className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Mic className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={handleSendMessage} disabled={!newMessage.trim()} className="h-8 px-3">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search team members..."
                value={teamSearchQuery}
                onChange={(e) => setTeamSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTeamMembers.map((member) => (
              <Card key={member.id} className="shadow-sm border hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback className="text-lg font-semibold">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="space-y-2">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                          <p className="text-sm text-muted-foreground">{member.specialty}</p>
                        </div>

                        <Badge className={`${getStatusColor(member.status)} text-xs`}>{member.status}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Contact Info */}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {member.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {member.phone}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-foreground">{member.patientLoad}</p>
                        <p className="text-xs text-muted-foreground">Current Patients</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <p className="text-lg font-bold text-foreground">{member.rating}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">Rating</p>
                      </div>
                    </div>

                    {/* Patient Load Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Patient Load</span>
                        <span className="font-medium">
                          {member.patientLoad}/{member.maxPatients}
                        </span>
                      </div>
                      <Progress value={(member.patientLoad / member.maxPatients) * 100} className="h-2" />
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Video className="h-4 w-4 mr-2" />
                        Video
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Team Collaboration Tab */}
        <TabsContent value="collaboration" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm border">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Active Team Discussions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockConversations
                    .filter((conv) => conv.type === "group")
                    .map((group) => (
                      <div key={group.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-foreground">{group.participant.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {group.members?.length} members
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{group.lastMessage.content}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{group.lastMessage.timestamp}</span>
                          <Button size="sm" variant="outline">
                            Join Discussion
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Start Team Chat
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Video className="h-4 w-4 mr-2" />
                  Schedule Team Meeting
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Team Calendar
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <FileText className="h-4 w-4 mr-2" />
                  Share Documentation
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
