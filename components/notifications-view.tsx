'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, BellOff, Settings, Filter, Inbox } from 'lucide-react';

export function NotificationsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your patient activities and system alerts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <EmptyNotifications />
        </TabsContent>

        <TabsContent value="unread" className="mt-6">
          <EmptyNotifications type="unread" />
        </TabsContent>

        <TabsContent value="patients" className="mt-6">
          <EmptyNotifications type="patients" />
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <EmptyNotifications type="tasks" />
        </TabsContent>

        <TabsContent value="system" className="mt-6">
          <EmptyNotifications type="system" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface EmptyNotificationsProps {
  type?: 'all' | 'unread' | 'patients' | 'tasks' | 'system';
}

function EmptyNotifications({ type = 'all' }: EmptyNotificationsProps) {
  const messages = {
    all: {
      icon: Inbox,
      title: 'No notifications yet',
      description: "You're all caught up! Notifications about patients, tasks, and system updates will appear here.",
    },
    unread: {
      icon: BellOff,
      title: 'No unread notifications',
      description: "You've read all your notifications. Great work staying on top of things!",
    },
    patients: {
      icon: Bell,
      title: 'No patient notifications',
      description: 'Patient-related notifications such as assessment updates, outcome changes, and care plan modifications will appear here.',
    },
    tasks: {
      icon: Bell,
      title: 'No task notifications',
      description: 'Task assignments, completions, and due date reminders will be shown here.',
    },
    system: {
      icon: Bell,
      title: 'No system notifications',
      description: 'System alerts, maintenance notices, and platform updates will be displayed here.',
    },
  };

  const message = messages[type];
  const Icon = message.icon;

  return (
    <Card>
      <CardContent className="py-24">
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="mb-6 p-4 rounded-full bg-muted">
            <Icon className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{message.title}</h3>
          <p className="text-muted-foreground mb-6">{message.description}</p>
          {type === 'all' && (
            <div className="flex flex-col gap-3 w-full max-w-sm">
              <div className="text-sm text-muted-foreground">
                When you receive notifications, you'll see them organized by:
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border rounded-lg text-left">
                  <div className="font-medium text-sm mb-1">Patient Updates</div>
                  <div className="text-xs text-muted-foreground">Care events & assessments</div>
                </div>
                <div className="p-3 border rounded-lg text-left">
                  <div className="font-medium text-sm mb-1">Task Alerts</div>
                  <div className="text-xs text-muted-foreground">Assignments & reminders</div>
                </div>
                <div className="p-3 border rounded-lg text-left">
                  <div className="font-medium text-sm mb-1">Team Messages</div>
                  <div className="text-xs text-muted-foreground">Collaboration updates</div>
                </div>
                <div className="p-3 border rounded-lg text-left">
                  <div className="font-medium text-sm mb-1">System Alerts</div>
                  <div className="text-xs text-muted-foreground">Platform notifications</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
