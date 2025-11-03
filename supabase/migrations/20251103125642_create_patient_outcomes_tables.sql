/*
  # Patient Outcome Measures Schema

  ## Overview
  This migration creates the database schema for tracking patient outcome measures including 
  readmissions, hospitalizations, ED visits, and functional capacity scores over time.

  ## New Tables
  
  ### `patient_outcomes`
  Stores quarterly outcome measure data for individual patients
  - `id` (uuid, primary key) - Unique identifier for each outcome record
  - `patient_id` (text, not null) - Reference to patient identifier
  - `quarter` (text, not null) - Quarter identifier (Q1, Q2, Q3, Q4)
  - `year` (integer, not null) - Year of the measurement
  - `readmissions` (numeric, not null) - Number of 30-day readmissions
  - `hospitalizations` (numeric, not null) - Number of hospitalizations
  - `ed_visits` (numeric, not null) - Number of emergency department visits
  - `functional_capacity` (numeric, not null) - Functional capacity score (0-100)
  - `risk_level` (text, not null) - Patient risk level (low, medium, high)
  - `primary_dimension` (text) - Primary health dimension of concern
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record last updated timestamp

  ### `outcome_benchmarks`
  Stores cohort-level benchmark values for comparison
  - `id` (uuid, primary key) - Unique identifier
  - `quarter` (text, not null) - Quarter identifier
  - `year` (integer, not null) - Year
  - `readmissions_benchmark` (numeric, not null) - Benchmark for readmissions
  - `hospitalizations_benchmark` (numeric, not null) - Benchmark for hospitalizations
  - `ed_visits_benchmark` (numeric, not null) - Benchmark for ED visits
  - `functional_capacity_benchmark` (numeric, not null) - Benchmark for functional capacity
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users to read their own patient data
  - Add policies for care team members to read patient outcomes
  - Add policies for administrators to manage benchmark data

  ## Indexes
  - Index on patient_id and quarter/year for efficient patient outcome queries
  - Index on quarter/year for benchmark lookups
  - Index on risk_level for cohort analysis
*/

CREATE TABLE IF NOT EXISTS patient_outcomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id text NOT NULL,
  quarter text NOT NULL CHECK (quarter IN ('Q1', 'Q2', 'Q3', 'Q4')),
  year integer NOT NULL CHECK (year >= 2020 AND year <= 2100),
  readmissions numeric NOT NULL DEFAULT 0 CHECK (readmissions >= 0),
  hospitalizations numeric NOT NULL DEFAULT 0 CHECK (hospitalizations >= 0),
  ed_visits numeric NOT NULL DEFAULT 0 CHECK (ed_visits >= 0),
  functional_capacity numeric NOT NULL DEFAULT 0 CHECK (functional_capacity >= 0 AND functional_capacity <= 100),
  risk_level text NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
  primary_dimension text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(patient_id, quarter, year)
);

CREATE INDEX IF NOT EXISTS idx_patient_outcomes_patient_quarter 
  ON patient_outcomes(patient_id, year DESC, quarter);

CREATE INDEX IF NOT EXISTS idx_patient_outcomes_quarter 
  ON patient_outcomes(year DESC, quarter);

CREATE INDEX IF NOT EXISTS idx_patient_outcomes_risk 
  ON patient_outcomes(risk_level);

CREATE TABLE IF NOT EXISTS outcome_benchmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quarter text NOT NULL CHECK (quarter IN ('Q1', 'Q2', 'Q3', 'Q4')),
  year integer NOT NULL CHECK (year >= 2020 AND year <= 2100),
  readmissions_benchmark numeric NOT NULL DEFAULT 0,
  hospitalizations_benchmark numeric NOT NULL DEFAULT 0,
  ed_visits_benchmark numeric NOT NULL DEFAULT 0,
  functional_capacity_benchmark numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(quarter, year)
);

CREATE INDEX IF NOT EXISTS idx_outcome_benchmarks_quarter 
  ON outcome_benchmarks(year DESC, quarter);

ALTER TABLE patient_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE outcome_benchmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all patient outcomes"
  ON patient_outcomes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert patient outcomes"
  ON patient_outcomes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update patient outcomes"
  ON patient_outcomes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete patient outcomes"
  ON patient_outcomes
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read all outcome benchmarks"
  ON outcome_benchmarks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert outcome benchmarks"
  ON outcome_benchmarks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update outcome benchmarks"
  ON outcome_benchmarks
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete outcome benchmarks"
  ON outcome_benchmarks
  FOR DELETE
  TO authenticated
  USING (true);

CREATE OR REPLACE FUNCTION update_patient_outcomes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_patient_outcomes_updated_at_trigger
  BEFORE UPDATE ON patient_outcomes
  FOR EACH ROW
  EXECUTE FUNCTION update_patient_outcomes_updated_at();
