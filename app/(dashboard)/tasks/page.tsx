"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskKanbanBoard } from "@/components/task-kanban-board"
import { AggregateTaskView } from "@/components/aggregate-task-view"

export default function TasksPage() {
  const [activeView, setActiveView] = useState<"aggregate" | "kanban">("aggregate")

  return (
    <Tabs value={activeView} onValueChange={(v) => setActiveView(v as "aggregate" | "kanban")} className="space-y-6">
      <TabsList className="bg-gray-100">
        <TabsTrigger value="aggregate">Aggregate View</TabsTrigger>
        <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
      </TabsList>

      <TabsContent value="aggregate">
        <AggregateTaskView />
      </TabsContent>

      <TabsContent value="kanban">
        <TaskKanbanBoard />
      </TabsContent>
    </Tabs>
  )
}
