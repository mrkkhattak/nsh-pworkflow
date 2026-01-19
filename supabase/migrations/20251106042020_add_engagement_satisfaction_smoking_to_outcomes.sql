/*
  # Add Engagement, Satisfaction, and Smoking Status to Patient Outcomes

  ## Overview
  This migration extends the patient_outcomes table to include patient engagement scores,
  patient satisfaction scores, and smoking status. These metrics provide additional insights
  into patient health outcomes and behavioral factors.

  ## Changes to Tables

  ### `patient_outcomes` table modifications
  - Add `engagement_score` (numeric, 0-100) - Patient engagement score from health dimension assessment
    - Lower scores indicate better engagement (consistent with risk scoring system)
    - Measures self-monitoring, medication adherence, appointment attendance, and health literacy
  - Add `satisfaction_score` (numeric, 0-100) - Patient satisfaction score from health dimension assessment  
    - Lower scores indicate higher satisfaction (consistent with risk scoring system)
    - Measures provider relationship, communication quality, and access satisfaction
  - Add `smoking_status` (text) - Current smoking status indicator
    - Allowed values: 'never', 'former', 'current'
    - Important behavioral health indicator for risk stratification

  ## Data Integrity
  - Check constraints ensure scores remain within valid 0-100 range
  - Check constraint ensures smoking_status only contains valid values
  - Default values prevent null issues in existing records
  - All constraints use IF NOT EXISTS to ensure idempotency

  ## Indexes
  - Index on engagement_score for performance analysis queries
  - Index on satisfaction_score for quality metrics queries  
  - Index on smoking_status for behavioral health cohort analysis

  ## Security
  - Existing RLS policies on patient_outcomes table continue to apply
  - No additional security changes required
*/

-- Add engagement_score column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'patient_outcomes' AND column_name = 'engagement_score'
  ) THEN
    ALTER TABLE patient_outcomes ADD COLUMN engagement_score numeric DEFAULT 0;
  END IF;
END $$;

-- Add satisfaction_score column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'patient_outcomes' AND column_name = 'satisfaction_score'
  ) THEN
    ALTER TABLE patient_outcomes ADD COLUMN satisfaction_score numeric DEFAULT 0;
  END IF;
END $$;

-- Add smoking_status column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'patient_outcomes' AND column_name = 'smoking_status'
  ) THEN
    ALTER TABLE patient_outcomes ADD COLUMN smoking_status text DEFAULT 'never';
  END IF;
END $$;

-- Add check constraint for engagement_score range
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'patient_outcomes' AND constraint_name = 'patient_outcomes_engagement_score_check'
  ) THEN
    ALTER TABLE patient_outcomes ADD CONSTRAINT patient_outcomes_engagement_score_check 
      CHECK (engagement_score >= 0 AND engagement_score <= 100);
  END IF;
END $$;

-- Add check constraint for satisfaction_score range
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'patient_outcomes' AND constraint_name = 'patient_outcomes_satisfaction_score_check'
  ) THEN
    ALTER TABLE patient_outcomes ADD CONSTRAINT patient_outcomes_satisfaction_score_check 
      CHECK (satisfaction_score >= 0 AND satisfaction_score <= 100);
  END IF;
END $$;

-- Add check constraint for smoking_status values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'patient_outcomes' AND constraint_name = 'patient_outcomes_smoking_status_check'
  ) THEN
    ALTER TABLE patient_outcomes ADD CONSTRAINT patient_outcomes_smoking_status_check 
      CHECK (smoking_status IN ('never', 'former', 'current'));
  END IF;
END $$;

-- Create index on engagement_score for performance queries
CREATE INDEX IF NOT EXISTS idx_patient_outcomes_engagement 
  ON patient_outcomes(engagement_score);

-- Create index on satisfaction_score for quality metrics
CREATE INDEX IF NOT EXISTS idx_patient_outcomes_satisfaction 
  ON patient_outcomes(satisfaction_score);

-- Create index on smoking_status for behavioral health analysis
CREATE INDEX IF NOT EXISTS idx_patient_outcomes_smoking 
  ON patient_outcomes(smoking_status);
