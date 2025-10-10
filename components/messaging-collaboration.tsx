"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Phone, Video, Search, CheckCheck, Plus, Paperclip, Smile, MoreVertical } from "lucide-react"

const mockConversations = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Patient",
    roleType: "patient",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thank you for the medication adjustment. Feeling much better!",
    timestamp: "2m",
    unread: 0,
    online: true,
  },
  {
    id: 2,
    name: "Dr. Michael Smith",
    role: "Psychiatrist",
    roleType: "provider",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Patient shows significant improvement in PHQ-9 scores.",
    timestamp: "15m",
    unread: 2,
    online: true,
  },
  {
    id: 3,
    name: "Lisa Chen",
    role: "Clinical Social Worker",
    roleType: "provider",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I've reviewed the treatment plan. Looks good!",
    timestamp: "45m",
    unread: 0,
    online: true,
  },
  {
    id: 4,
    name: "Michael Chen",
    role: "Patient",
    roleType: "patient",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Can we reschedule my appointment?",
    timestamp: "1h",
    unread: 1,
    online: false,
  },
  {
    id: 5,
    name: "Dr. Lisa Anderson",
    role: "Primary Care Physician",
    roleType: "provider",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Lab results are ready for review",
    timestamp: "3h",
    unread: 0,
    online: true,
  },
  {
    id: 6,
    name: "James Rodriguez",
    role: "Registered Nurse",
    roleType: "provider",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Patient vitals updated in the system",
    timestamp: "5h",
    unread: 0,
    online: true,
  },
]

const mockMessages = [
  {
    id: 1,
    sender: "patient",
    content: "Hi Dr. Anderson, I wanted to update you on how I'm feeling with the new medication.",
    timestamp: "10:30 AM",
    read: true,
  },
  {
    id: 2,
    sender: "provider",
    content: "Hello Sarah! I'm glad to hear from you. How are you feeling? Any side effects?",
    timestamp: "10:45 AM",
    read: true,
  },
  {
    id: 3,
    sender: "patient",
    content: "Much better actually! The anxiety has decreased significantly and I'm sleeping better.",
    timestamp: "11:00 AM",
    read: true,
  },
  {
    id: 4,
    sender: "provider",
    content: "That's wonderful news! Let's continue with the current dosage and check in next week.",
    timestamp: "11:15 AM",
    read: true,
  },
  {
    id: 5,
    sender: "patient",
    content: "Thank you for the medication adjustment. Feeling much better!",
    timestamp: "2:30 PM",
    read: true,
  },
]

interface Conversation {
  id: number
  name: string
  role: string
  roleType: "patient" | "provider"
  avatar: string
  lastMessage: string
  timestamp: string
  unread: number
  online: boolean
}

interface MessagingCollaborationProps {
  initialConversationId?: number
}

export function MessagingCollaboration({ initialConversationId }: MessagingCollaborationProps = {}) {
  const initialConv = initialConversationId
    ? mockConversations.find((c) => c.id === initialConversationId) || mockConversations[0]
    : mockConversations[0]

  const [selectedConversation, setSelectedConversation] = useState<Conversation>(initialConv)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = mockConversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  const getRoleBadgeStyle = (roleType: "patient" | "provider") => {
    return roleType === "patient"
      ? "bg-blue-100 text-blue-700 border-blue-200"
      : "bg-purple-100 text-purple-700 border-purple-200"
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Messages</h1>
            <p className="text-sm text-muted-foreground mt-1">Secure communication with patients and care team</p>
          </div>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Message
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 border-r bg-card flex flex-col">
          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-muted/50 border-0"
              />
            </div>
          </div>

          {/* Conversations */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`w-full p-3 rounded-lg text-left transition-colors mb-1 ${
                    selectedConversation.id === conversation.id ? "bg-muted" : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-sm">
                          {conversation.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-card" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm text-foreground truncate">{conversation.name}</h4>
                        <Badge
                          variant="outline"
                          className={`text-xs px-1.5 py-0 h-5 ${getRoleBadgeStyle(conversation.roleType)}`}
                        >
                          {conversation.roleType === "patient" ? "Patient" : "Provider"}
                        </Badge>
                      </div>
                      <div className="flex items-baseline justify-between mb-1">
                        <p className="text-xs text-muted-foreground truncate flex-1">{conversation.role}</p>
                        <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                          {conversation.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <Badge className="h-5 min-w-5 flex items-center justify-center px-1.5 bg-primary text-primary-foreground text-xs">
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex-1 flex flex-col bg-muted/20">
          {/* Chat Header */}
          <div className="border-b bg-card px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedConversation.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {selectedConversation.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">{selectedConversation.name}</h3>
                    <Badge
                      variant="outline"
                      className={`text-xs px-2 py-0.5 ${getRoleBadgeStyle(selectedConversation.roleType)}`}
                    >
                      {selectedConversation.roleType === "patient" ? "Patient" : "Provider"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedConversation.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4 max-w-4xl mx-auto">
              {mockMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === "provider" ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-xs">{message.sender === "provider" ? "DA" : "SJ"}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`flex flex-col ${message.sender === "provider" ? "items-end" : "items-start"} max-w-[70%]`}
                  >
                    <div
                      className={`px-4 py-2.5 rounded-2xl ${
                        message.sender === "provider" ? "bg-primary text-primary-foreground" : "bg-card border"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-1 px-1">
                      <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                      {message.read && message.sender === "provider" && <CheckCheck className="h-3 w-3 text-primary" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t bg-card p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[44px] max-h-32 resize-none pr-20 py-3"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <div className="absolute right-2 bottom-2 flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="h-11 w-11 flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
