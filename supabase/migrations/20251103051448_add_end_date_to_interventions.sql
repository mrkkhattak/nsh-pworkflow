/*
  # Add End Date to Interventions

  This migration adds an optional end_date field to intervention tables. The end date represents 
  the planned duration of an intervention and is separate from the stop functionality.

  ## Changes Made

  1. **interventions table**
    - Add `end_date` column (DATE, nullable)
    - Add check constraint to ensure end_date is after or equal to start date

  2. **dimension_interventions table**
    - Add `end_date` column (TIMESTAMPTZ, nullable)
    - Add check constraint to ensure end_date is after or equal to start_date

  ## Important Notes
  - End date is optional and can be NULL
  - End date is separate from stopped_date (which is used when an intervention is terminated early)
  - Validation ensures end_date >= start date when end_date is provided
  - Existing interventions will have NULL end_date by default
*/

-- Add end_date to interventions table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'interventions' AND column_name = 'end_date'
  ) THEN
    ALTER TABLE interventions ADD COLUMN end_date DATE;
  END IF;
END $$;

-- Add check constraint for interventions end_date
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'interventions_end_date_check'
  ) THEN
    ALTER TABLE interventions 
    ADD CONSTRAINT interventions_end_date_check 
    CHECK (end_date IS NULL OR end_date >= date);
  END IF;
END $$;

-- Add end_date to dimension_interventions table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dimension_interventions' AND column_name = 'end_date'
  ) THEN
    ALTER TABLE dimension_interventions ADD COLUMN end_date TIMESTAMPTZ;
  END IF;
END $$;

-- Add check constraint for dimension_interventions end_date
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'dimension_interventions_end_date_check'
  ) THEN
    ALTER TABLE dimension_interventions 
    ADD CONSTRAINT dimension_interventions_end_date_check 
    CHECK (end_date IS NULL OR end_date >= start_date);
  END IF;
END $$;