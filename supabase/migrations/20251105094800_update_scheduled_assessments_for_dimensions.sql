/*
  # Update Scheduled Assessments for Dimension Selection

  1. Changes
    - Add `assessment_scope` column to track 'full' or 'dimensions'
    - Add `selected_dimensions` column to store array of dimension IDs
    - Remove `assessment_type` column (no longer needed)
    - Keep existing columns and indexes

  2. Notes
    - Uses conditional logic to only add columns if they don't exist
    - Preserves existing data
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'scheduled_assessments' AND column_name = 'assessment_scope'
  ) THEN
    ALTER TABLE scheduled_assessments ADD COLUMN assessment_scope text DEFAULT 'full' CHECK (assessment_scope IN ('full', 'dimensions'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'scheduled_assessments' AND column_name = 'selected_dimensions'
  ) THEN
    ALTER TABLE scheduled_assessments ADD COLUMN selected_dimensions text[] DEFAULT ARRAY[]::text[];
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'scheduled_assessments' AND column_name = 'assessment_type'
  ) THEN
    ALTER TABLE scheduled_assessments DROP COLUMN assessment_type;
  END IF;
END $$;
