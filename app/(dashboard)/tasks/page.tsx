import { TaskAggregateView } from "@/components/task-aggregate-view"
import { TaskKanbanBoard } from "@/components/task-kanban-board"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TasksPage() {
  return (
    <Tabs defaultValue="aggregate" className="space-y-6">
      <TabsList>
        <TabsTrigger value="aggregate">Aggregate View</TabsTrigger>
        <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
      </TabsList>

      <TabsContent value="aggregate">
        <TaskAggregateView />
      </TabsContent>

      <TabsContent value="kanban">
        <TaskKanbanBoard />
      </TabsContent>
    </Tabs>
  )
}
