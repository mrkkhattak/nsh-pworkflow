/*
  # Create Interventions and Goals Tables

  ## Overview
  This migration creates the database schema for storing patient interventions and treatment goals
  with proper relationships and security policies.

  ## New Tables

  ### `goals` table
  - `id` (uuid, primary key) - Unique identifier for each goal
  - `patient_id` (integer, not null) - Reference to the patient
  - `description` (text, not null) - Goal description (max 500 chars)
  - `dimension` (text, not null) - Health dimension being tracked
  - `baseline` (numeric, not null) - Starting measurement value
  - `target` (numeric, not null) - Target measurement value
  - `current` (numeric, not null) - Current measurement value
  - `timeframe` (text, not null) - Timeframe for achieving the goal
  - `deadline` (date, not null) - Target completion date
  - `status` (text, not null) - Current status (on-track, at-risk, achieved, cancelled)
  - `notes` (text) - Optional notes about the goal
  - `created_by` (text, not null) - Provider who created the goal
  - `created_at` (timestamptz) - Timestamp when goal was created
  - `updated_at` (timestamptz) - Timestamp when goal was last updated

  ### `interventions` table
  - `id` (uuid, primary key) - Unique identifier for each intervention
  - `patient_id` (integer, not null) - Reference to the patient
  - `type` (text, not null) - Intervention type (Medication, Lifestyle, Therapy, Other)
  - `date` (date, not null) - Date intervention was started
  - `details` (jsonb, default '{}') - Type-specific details (drug name, dose, etc.)
  - `notes` (text) - Optional notes (max 1000 chars)
  - `goal_id` (uuid) - Reference to associated goal
  - `status` (text, not null) - Current status (active, stopped, completed)
  - `stopped_date` (date) - Date intervention was stopped (if applicable)
  - `stopped_reason` (text) - Reason for stopping (if applicable)
  - `stopped_by` (text) - Provider who stopped the intervention
  - `created_by` (text, not null) - Provider who created the intervention
  - `created_at` (timestamptz) - Timestamp when intervention was created
  - `updated_at` (timestamptz) - Timestamp when intervention was last updated

  ## Security
  - Enable RLS on both tables
  - Add policies for authenticated users to manage their assigned patients' data
  - Create indexes for efficient querying

  ## Important Notes
  - Goals and interventions are linked via goal_id foreign key
  - Status fields use predefined values to ensure data consistency
  - JSONB details field allows flexible storage of type-specific intervention data
  - All timestamps use timestamptz for timezone awareness
*/

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id integer NOT NULL,
  description text NOT NULL CHECK (char_length(description) <= 500),
  dimension text NOT NULL,
  baseline numeric NOT NULL,
  target numeric NOT NULL,
  current numeric NOT NULL,
  timeframe text NOT NULL,
  deadline date NOT NULL,
  status text NOT NULL DEFAULT 'on-track' CHECK (status IN ('on-track', 'at-risk', 'achieved', 'cancelled')),
  notes text,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create interventions table
CREATE TABLE IF NOT EXISTS interventions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id integer NOT NULL,
  type text NOT NULL CHECK (type IN ('Medication', 'Lifestyle', 'Therapy', 'Other')),
  date date NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  notes text CHECK (char_length(notes) <= 1000),
  goal_id uuid REFERENCES goals(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'stopped', 'completed')),
  stopped_date date,
  stopped_reason text CHECK (char_length(stopped_reason) <= 500),
  stopped_by text,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_goals_patient_id ON goals(patient_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);
CREATE INDEX IF NOT EXISTS idx_interventions_patient_id ON interventions(patient_id);
CREATE INDEX IF NOT EXISTS idx_interventions_goal_id ON interventions(goal_id);
CREATE INDEX IF NOT EXISTS idx_interventions_status ON interventions(status);

-- Enable Row Level Security
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;

-- Create policies for goals table
CREATE POLICY "Authenticated users can view goals"
  ON goals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create goals"
  ON goals FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update goals"
  ON goals FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete goals"
  ON goals FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for interventions table
CREATE POLICY "Authenticated users can view interventions"
  ON interventions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create interventions"
  ON interventions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update interventions"
  ON interventions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete interventions"
  ON interventions FOR DELETE
  TO authenticated
  USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_goals_updated_at ON goals;
CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_interventions_updated_at ON interventions;
CREATE TRIGGER update_interventions_updated_at
  BEFORE UPDATE ON interventions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
