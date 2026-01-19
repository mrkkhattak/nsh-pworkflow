/*
  # Create Tasks Management System

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key) - Unique task identifier
      - `category` (text) - Task category: provider-level, patient-level, system-level, community-level
      - `status` (text) - Task status based on category schema
      - `title` (text) - Task title
      - `description` (text) - Task description
      - `priority` (text) - Task priority: high, medium, low
      - `due_date` (date) - Task due date
      - `assignee` (text) - Person assigned to the task
      - `dimension` (text) - Health dimension if applicable
      - `sla_status` (text) - SLA tracking status
      - `estimated_time` (text) - Estimated completion time
      - `blockers` (text[]) - Array of blocker descriptions
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp
      
      Provider Level specific fields:
      - `provider_name` (text) - Provider name
      - `provider_credential` (text) - Provider credential
      - `provider_email` (text) - Provider email
      - `provider_specialty` (text) - Provider specialty
      - `provider_license_id` (text) - Registration or License ID
      - `provider_organization` (text) - Affiliated organization
      - `provider_address` (text) - Location address
      - `provider_zip` (text) - ZIP code
      - `provider_state` (text) - State
      - `provider_country` (text) - Country
      
      Patient Level specific fields:
      - `patient_id` (uuid) - Reference to patient
      - `patient_name` (text) - Patient name
      - `patient_website` (text) - Website URL
      - `patient_contact` (text) - Contact information
      
      Community Level specific fields:
      - `community_resource_name` (text) - Resource name
      - `community_website` (text) - Website URL
      - `community_email` (text) - Email address
      - `community_location` (text) - Location
      - `community_contact` (text) - Contact information
      
      System Level specific fields:
      - `system_name` (text) - System/Organization name
      - `system_website` (text) - Website URL
      - `system_contact` (text) - Contact information
      - `system_location` (text) - Location
      
  2. Security
    - Enable RLS on `tasks` table
    - Add policies for authenticated users to manage tasks
    
  3. Important Notes
    - All category-specific fields are nullable as they only apply to their respective categories
    - The status field uses category-specific values as defined in the application
    - Blockers stored as text array for flexibility
*/

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  title text NOT NULL,
  description text DEFAULT '',
  priority text DEFAULT 'medium',
  due_date date,
  assignee text,
  dimension text,
  sla_status text DEFAULT 'on-time',
  estimated_time text,
  blockers text[] DEFAULT '{}',
  
  -- Provider Level fields
  provider_name text,
  provider_credential text,
  provider_email text,
  provider_specialty text,
  provider_license_id text,
  provider_organization text,
  provider_address text,
  provider_zip text,
  provider_state text,
  provider_country text,
  
  -- Patient Level fields
  patient_id uuid,
  patient_name text,
  patient_website text,
  patient_contact text,
  
  -- Community Level fields
  community_resource_name text,
  community_website text,
  community_email text,
  community_location text,
  community_contact text,
  
  -- System Level fields
  system_name text,
  system_website text,
  system_contact text,
  system_location text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_patient_id ON tasks(patient_id);
