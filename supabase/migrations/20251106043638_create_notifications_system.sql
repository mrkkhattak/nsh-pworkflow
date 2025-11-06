/*
  # Create Notifications System

  ## Overview
  This migration creates a comprehensive notification system for the healthcare platform,
  allowing providers to receive and manage alerts about patients, tasks, and system events.

  ## New Tables

  ### `notifications` table
  Stores all notifications sent to users
  - `id` (uuid, primary key) - Unique identifier for each notification
  - `user_id` (text, not null) - ID of the user receiving the notification
  - `type` (text, not null) - Type of notification (patient, task, message, system)
  - `title` (text, not null) - Notification title/subject
  - `message` (text, not null) - Notification body/content
  - `link` (text) - Optional link to related resource
  - `read` (boolean, default false) - Whether notification has been read
  - `priority` (text, not null) - Priority level (low, medium, high, urgent)
  - `metadata` (jsonb) - Additional structured data about the notification
  - `created_at` (timestamptz, default now()) - Timestamp when notification was created
  - `read_at` (timestamptz) - Timestamp when notification was read

  ### `notification_preferences` table
  Stores user preferences for notification delivery
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (text, not null, unique) - ID of the user
  - `email_enabled` (boolean, default true) - Whether to send email notifications
  - `push_enabled` (boolean, default true) - Whether to send push notifications
  - `patient_updates` (boolean, default true) - Receive patient update notifications
  - `task_reminders` (boolean, default true) - Receive task reminder notifications
  - `team_messages` (boolean, default true) - Receive team message notifications
  - `system_alerts` (boolean, default true) - Receive system alert notifications
  - `updated_at` (timestamptz, default now()) - Last preference update timestamp

  ## Indexes
  - Index on user_id and created_at for efficient notification retrieval
  - Index on user_id and read status for filtering unread notifications
  - Index on type for filtering by notification category
  - Index on priority for urgent notification queries

  ## Security
  - Enable RLS on all tables
  - Users can only read their own notifications
  - Users can only update read status on their own notifications
  - Users can only manage their own notification preferences
*/

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  type text NOT NULL CHECK (type IN ('patient', 'task', 'message', 'system')),
  title text NOT NULL,
  message text NOT NULL,
  link text,
  read boolean DEFAULT false,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  read_at timestamptz
);

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_created 
  ON notifications(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user_read 
  ON notifications(user_id, read);

CREATE INDEX IF NOT EXISTS idx_notifications_type 
  ON notifications(type);

CREATE INDEX IF NOT EXISTS idx_notifications_priority 
  ON notifications(priority);

-- Create notification preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL UNIQUE,
  email_enabled boolean DEFAULT true,
  push_enabled boolean DEFAULT true,
  patient_updates boolean DEFAULT true,
  task_reminders boolean DEFAULT true,
  team_messages boolean DEFAULT true,
  system_alerts boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

-- Create index for notification preferences
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user 
  ON notification_preferences(user_id);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id = current_user);

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = current_user)
  WITH CHECK (user_id = current_user);

CREATE POLICY "System can insert notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can delete own notifications"
  ON notifications
  FOR DELETE
  TO authenticated
  USING (user_id = current_user);

-- Notification preferences policies
CREATE POLICY "Users can read own preferences"
  ON notification_preferences
  FOR SELECT
  TO authenticated
  USING (user_id = current_user);

CREATE POLICY "Users can insert own preferences"
  ON notification_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = current_user);

CREATE POLICY "Users can update own preferences"
  ON notification_preferences
  FOR UPDATE
  TO authenticated
  USING (user_id = current_user)
  WITH CHECK (user_id = current_user);

-- Function to update notification read_at timestamp
CREATE OR REPLACE FUNCTION update_notification_read_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.read = true AND OLD.read = false THEN
    NEW.read_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically set read_at when notification is marked as read
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'notification_read_trigger'
  ) THEN
    CREATE TRIGGER notification_read_trigger
      BEFORE UPDATE ON notifications
      FOR EACH ROW
      EXECUTE FUNCTION update_notification_read_at();
  END IF;
END $$;

-- Function to update preferences updated_at timestamp
CREATE OR REPLACE FUNCTION update_notification_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'notification_preferences_updated_at_trigger'
  ) THEN
    CREATE TRIGGER notification_preferences_updated_at_trigger
      BEFORE UPDATE ON notification_preferences
      FOR EACH ROW
      EXECUTE FUNCTION update_notification_preferences_updated_at();
  END IF;
END $$;
