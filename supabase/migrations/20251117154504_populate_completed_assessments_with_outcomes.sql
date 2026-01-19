/*
  # Populate Completed Assessments with Outcome Data

  1. Purpose
    - Add sample completed assessments with actual completion dates
    - Link outcome measures to assessment completion dates instead of quarters
    - Enable date-based trend analysis on outcomes page

  2. Changes
    - Insert completed assessments spanning the last 12 months
    - Each patient will have assessments at various dates
    - Dates will be realistic (roughly every 1-3 months per patient)

  3. Data
    - 8 patients with multiple completed assessments each
    - Dates range from January 2024 to November 2025
    - Assessment completion dates will be used as x-axis in outcomes charts
*/

-- Insert completed assessments with actual dates for patient 1 (Sarah Chen)
INSERT INTO scheduled_assessments (patient_id, scheduled_date, scheduled_time, status, completed_at, created_by)
VALUES
  (1, '2024-01-15', '09:00:00', 'completed', '2024-01-15 10:30:00+00', 'Dr. Anderson'),
  (1, '2024-04-10', '10:00:00', 'completed', '2024-04-10 11:15:00+00', 'Dr. Anderson'),
  (1, '2024-07-22', '09:30:00', 'completed', '2024-07-22 11:00:00+00', 'Dr. Anderson'),
  (1, '2024-10-15', '10:00:00', 'completed', '2024-10-15 11:45:00+00', 'Dr. Anderson'),
  (1, '2025-01-20', '09:00:00', 'completed', '2025-01-20 10:30:00+00', 'Dr. Anderson'),
  (1, '2025-04-18', '10:30:00', 'completed', '2025-04-18 12:00:00+00', 'Dr. Anderson'),
  (1, '2025-07-25', '09:00:00', 'completed', '2025-07-25 10:45:00+00', 'Dr. Anderson'),
  (1, '2025-10-15', '10:00:00', 'completed', '2025-10-15 11:30:00+00', 'Dr. Anderson');

-- Insert completed assessments for patient 2 (Marcus Johnson)
INSERT INTO scheduled_assessments (patient_id, scheduled_date, scheduled_time, status, completed_at, created_by)
VALUES
  (2, '2024-02-05', '14:00:00', 'completed', '2024-02-05 15:20:00+00', 'Dr. Martinez'),
  (2, '2024-05-12', '14:30:00', 'completed', '2024-05-12 16:00:00+00', 'Dr. Martinez'),
  (2, '2024-08-20', '13:00:00', 'completed', '2024-08-20 14:30:00+00', 'Dr. Martinez'),
  (2, '2024-11-10', '14:00:00', 'completed', '2024-11-10 15:15:00+00', 'Dr. Martinez'),
  (2, '2025-02-15', '13:30:00', 'completed', '2025-02-15 14:45:00+00', 'Dr. Martinez'),
  (2, '2025-05-20', '14:00:00', 'completed', '2025-05-20 15:30:00+00', 'Dr. Martinez'),
  (2, '2025-08-18', '13:00:00', 'completed', '2025-08-18 14:20:00+00', 'Dr. Martinez'),
  (2, '2025-11-05', '14:30:00', 'completed', '2025-11-05 16:00:00+00', 'Dr. Martinez');

-- Insert completed assessments for patient 3 (Emily Rodriguez)
INSERT INTO scheduled_assessments (patient_id, scheduled_date, scheduled_time, status, completed_at, created_by)
VALUES
  (3, '2024-01-25', '11:00:00', 'completed', '2024-01-25 12:15:00+00', 'Dr. Kim'),
  (3, '2024-04-22', '10:30:00', 'completed', '2024-04-22 11:45:00+00', 'Dr. Kim'),
  (3, '2024-07-15', '11:00:00', 'completed', '2024-07-15 12:30:00+00', 'Dr. Kim'),
  (3, '2024-10-28', '10:00:00', 'completed', '2024-10-28 11:20:00+00', 'Dr. Kim'),
  (3, '2025-01-30', '11:30:00', 'completed', '2025-01-30 13:00:00+00', 'Dr. Kim'),
  (3, '2025-05-05', '10:00:00', 'completed', '2025-05-05 11:30:00+00', 'Dr. Kim'),
  (3, '2025-08-10', '11:00:00', 'completed', '2025-08-10 12:15:00+00', 'Dr. Kim'),
  (3, '2025-11-12', '10:30:00', 'completed', '2025-11-12 12:00:00+00', 'Dr. Kim');

-- Insert completed assessments for patient 4 (David Park)
INSERT INTO scheduled_assessments (patient_id, scheduled_date, scheduled_time, status, completed_at, created_by)
VALUES
  (4, '2024-03-05', '15:00:00', 'completed', '2024-03-05 16:30:00+00', 'Dr. Patel'),
  (4, '2024-06-18', '14:30:00', 'completed', '2024-06-18 16:00:00+00', 'Dr. Patel'),
  (4, '2024-09-12', '15:00:00', 'completed', '2024-09-12 16:45:00+00', 'Dr. Patel'),
  (4, '2024-12-20', '14:00:00', 'completed', '2024-12-20 15:30:00+00', 'Dr. Patel'),
  (4, '2025-03-15', '15:30:00', 'completed', '2025-03-15 17:00:00+00', 'Dr. Patel'),
  (4, '2025-06-22', '14:00:00', 'completed', '2025-06-22 15:45:00+00', 'Dr. Patel'),
  (4, '2025-09-18', '15:00:00', 'completed', '2025-09-18 16:30:00+00', 'Dr. Patel');

-- Insert completed assessments for patient 5 (Lisa Thompson)
INSERT INTO scheduled_assessments (patient_id, scheduled_date, scheduled_time, status, completed_at, created_by)
VALUES
  (5, '2024-02-12', '08:30:00', 'completed', '2024-02-12 10:00:00+00', 'Dr. Lee'),
  (5, '2024-05-20', '09:00:00', 'completed', '2024-05-20 10:30:00+00', 'Dr. Lee'),
  (5, '2024-08-15', '08:30:00', 'completed', '2024-08-15 10:15:00+00', 'Dr. Lee'),
  (5, '2024-11-18', '09:00:00', 'completed', '2024-11-18 10:45:00+00', 'Dr. Lee'),
  (5, '2025-02-22', '08:00:00', 'completed', '2025-02-22 09:30:00+00', 'Dr. Lee'),
  (5, '2025-05-28', '09:00:00', 'completed', '2025-05-28 10:20:00+00', 'Dr. Lee'),
  (5, '2025-08-25', '08:30:00', 'completed', '2025-08-25 10:00:00+00', 'Dr. Lee'),
  (5, '2025-11-08', '09:00:00', 'completed', '2025-11-08 10:30:00+00', 'Dr. Lee');

-- Insert completed assessments for patient 6 (James Wilson)
INSERT INTO scheduled_assessments (patient_id, scheduled_date, scheduled_time, status, completed_at, created_by)
VALUES
  (6, '2024-01-18', '13:00:00', 'completed', '2024-01-18 14:30:00+00', 'Dr. Brown'),
  (6, '2024-04-15', '12:30:00', 'completed', '2024-04-15 14:00:00+00', 'Dr. Brown'),
  (6, '2024-07-28', '13:00:00', 'completed', '2024-07-28 14:45:00+00', 'Dr. Brown'),
  (6, '2024-10-22', '12:00:00', 'completed', '2024-10-22 13:30:00+00', 'Dr. Brown'),
  (6, '2025-01-25', '13:30:00', 'completed', '2025-01-25 15:00:00+00', 'Dr. Brown'),
  (6, '2025-04-28', '12:30:00', 'completed', '2025-04-28 14:15:00+00', 'Dr. Brown'),
  (6, '2025-07-30', '13:00:00', 'completed', '2025-07-30 14:30:00+00', 'Dr. Brown'),
  (6, '2025-10-20', '12:00:00', 'completed', '2025-10-20 13:45:00+00', 'Dr. Brown');

-- Insert completed assessments for patient 7 (Maria Garcia)
INSERT INTO scheduled_assessments (patient_id, scheduled_date, scheduled_time, status, completed_at, created_by)
VALUES
  (7, '2024-03-10', '10:00:00', 'completed', '2024-03-10 11:30:00+00', 'Dr. Taylor'),
  (7, '2024-06-25', '09:30:00', 'completed', '2024-06-25 11:00:00+00', 'Dr. Taylor'),
  (7, '2024-09-20', '10:00:00', 'completed', '2024-09-20 11:45:00+00', 'Dr. Taylor'),
  (7, '2024-12-15', '09:00:00', 'completed', '2024-12-15 10:30:00+00', 'Dr. Taylor'),
  (7, '2025-03-22', '10:30:00', 'completed', '2025-03-22 12:00:00+00', 'Dr. Taylor'),
  (7, '2025-06-18', '09:00:00', 'completed', '2025-06-18 10:45:00+00', 'Dr. Taylor'),
  (7, '2025-09-25', '10:00:00', 'completed', '2025-09-25 11:30:00+00', 'Dr. Taylor');

-- Insert completed assessments for patient 8 (Robert Lee)
INSERT INTO scheduled_assessments (patient_id, scheduled_date, scheduled_time, status, completed_at, created_by)
VALUES
  (8, '2024-02-20', '16:00:00', 'completed', '2024-02-20 17:15:00+00', 'Dr. Wilson'),
  (8, '2024-05-28', '15:30:00', 'completed', '2024-05-28 17:00:00+00', 'Dr. Wilson'),
  (8, '2024-08-22', '16:00:00', 'completed', '2024-08-22 17:30:00+00', 'Dr. Wilson'),
  (8, '2024-11-25', '15:00:00', 'completed', '2024-11-25 16:45:00+00', 'Dr. Wilson'),
  (8, '2025-02-28', '16:30:00', 'completed', '2025-02-28 18:00:00+00', 'Dr. Wilson'),
  (8, '2025-06-05', '15:00:00', 'completed', '2025-06-05 16:30:00+00', 'Dr. Wilson'),
  (8, '2025-09-10', '16:00:00', 'completed', '2025-09-10 17:15:00+00', 'Dr. Wilson'),
  (8, '2025-11-15', '15:30:00', 'completed', '2025-11-15 17:00:00+00', 'Dr. Wilson');
