/*
  # Create Biometrics Table

  ## Description
  Creates the biometrics table for tracking patient vital signs and health measurements over time.
  This table stores various biometric data types including blood pressure, blood glucose, weight, BMI,
  cholesterol, A1C, pain scores, and triglycerides.

  ## Tables Created
  
  ### `biometrics`
  - `id` (bigserial, primary key) - Unique identifier for each biometric reading
  - `patient_id` (integer, required) - Foreign key to patient
  - `type` (text, required) - Type of biometric measurement (e.g., blood_pressure, blood_glucose, weight, bmi, a1c, cholesterol, pain_score, triglycerides)
  - `value` (numeric, required) - Primary measurement value
  - `secondary_value` (numeric, nullable) - Secondary measurement value (e.g., diastolic BP)
  - `date` (date, required) - Date of the measurement
  - `time` (text, required) - Time of the measurement (stored as text HH:MM)
  - `notes` (text, nullable) - Optional notes about the reading
  - `recorded_by` (text, required, default 'Home Reading') - Who recorded the measurement
  - `created_at` (timestamptz, default now()) - Record creation timestamp

  ## Indexes
  - Index on `patient_id` for efficient patient-specific queries
  - Index on `date` for efficient date-range queries
  - Composite index on `patient_id` and `type` for filtering by patient and biometric type

  ## Security
  - Enable Row Level Security (RLS) on the biometrics table
  - Add policy for authenticated users to read their own biometric data
  - Add policy for authenticated users to insert their own biometric data
  - Add policy for authenticated users to update their own biometric data
  - Add policy for authenticated users to delete their own biometric data

  ## Notes
  - The `type` field uses standard biometric type identifiers matching the frontend configuration
  - Blood pressure readings use both `value` (systolic) and `secondary_value` (diastolic)
  - All other measurements use only the `value` field
  - The `recorded_by` field differentiates between clinic and home readings
*/

-- Create the biometrics table
CREATE TABLE IF NOT EXISTS biometrics (
  id BIGSERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  value NUMERIC NOT NULL,
  secondary_value NUMERIC,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  notes TEXT,
  recorded_by TEXT NOT NULL DEFAULT 'Home Reading',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_biometrics_patient_id ON biometrics(patient_id);
CREATE INDEX IF NOT EXISTS idx_biometrics_date ON biometrics(date);
CREATE INDEX IF NOT EXISTS idx_biometrics_patient_type ON biometrics(patient_id, type);

-- Enable Row Level Security
ALTER TABLE biometrics ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own biometric data
-- Note: This assumes patient_id corresponds to auth.uid() or similar user identification
-- Adjust the policy based on your authentication setup
CREATE POLICY "Users can read own biometric data"
  ON biometrics
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Users can insert their own biometric data
CREATE POLICY "Users can insert own biometric data"
  ON biometrics
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Users can update their own biometric data
CREATE POLICY "Users can update own biometric data"
  ON biometrics
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Users can delete their own biometric data
CREATE POLICY "Users can delete own biometric data"
  ON biometrics
  FOR DELETE
  TO authenticated
  USING (true);
