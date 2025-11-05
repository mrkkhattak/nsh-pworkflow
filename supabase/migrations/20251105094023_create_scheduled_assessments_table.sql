/*
  # Create Scheduled Assessments Table

  1. New Tables
    - `scheduled_assessments`
      - `id` (uuid, primary key)
      - `patient_id` (integer, not null)
      - `assessment_type` (text, not null) - Type of assessment to be conducted
      - `scheduled_date` (date, not null) - Date when assessment is scheduled
      - `scheduled_time` (time, not null) - Time when assessment is scheduled
      - `notes` (text) - Optional notes about the assessment
      - `reminder_enabled` (boolean, default true) - Whether to send reminder
      - `reminder_days` (integer, default 3) - Days before to send reminder
      - `status` (text, default 'scheduled') - Status: scheduled, completed, cancelled, missed
      - `completed_at` (timestamptz) - When the assessment was completed
      - `created_at` (timestamptz, default now())
      - `created_by` (text) - User who scheduled the assessment
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `scheduled_assessments` table
    - Add policies for authenticated users to manage scheduled assessments
*/

CREATE TABLE IF NOT EXISTS scheduled_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id integer NOT NULL,
  assessment_type text NOT NULL,
  scheduled_date date NOT NULL,
  scheduled_time time NOT NULL,
  notes text DEFAULT '',
  reminder_enabled boolean DEFAULT true,
  reminder_days integer DEFAULT 3,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'missed')),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  created_by text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE scheduled_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view scheduled assessments"
  ON scheduled_assessments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create scheduled assessments"
  ON scheduled_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update scheduled assessments"
  ON scheduled_assessments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete scheduled assessments"
  ON scheduled_assessments
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_scheduled_assessments_patient_id ON scheduled_assessments(patient_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_assessments_scheduled_date ON scheduled_assessments(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_scheduled_assessments_status ON scheduled_assessments(status);
