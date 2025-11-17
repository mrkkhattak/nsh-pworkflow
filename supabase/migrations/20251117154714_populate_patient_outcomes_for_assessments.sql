/*
  # Populate Patient Outcomes Data for Completed Assessments

  1. Purpose
    - Add outcome data for each completed assessment
    - Link outcomes to actual assessment completion dates
    - Enable date-based trend analysis with real data

  2. Data Strategy
    - Generate outcomes for each completed assessment
    - Show improving trends for high-risk patients
    - Maintain realistic values based on risk levels
    - Use assessment completion timestamps

  3. Coverage
    - All 8 patients with multiple assessment dates
    - Outcomes include: readmissions, hospitalizations, ED visits, functional capacity, engagement, satisfaction
    - Smoking status and risk levels assigned per patient
*/

-- Patient 1 (Sarah Chen) - High risk, improving trend
INSERT INTO patient_outcomes (patient_id, quarter, year, readmissions, hospitalizations, ed_visits, functional_capacity, engagement_score, satisfaction_score, risk_level, primary_dimension, smoking_status, created_at)
VALUES
  ('1', 'Q1', 2024, 2.8, 2.0, 3.8, 52, 38, 32, 'high', 'Physical Health', 'current', '2024-01-15 10:30:00+00'),
  ('1', 'Q2', 2024, 2.5, 1.8, 3.5, 56, 35, 28, 'high', 'Physical Health', 'current', '2024-04-10 11:15:00+00'),
  ('1', 'Q3', 2024, 2.2, 1.6, 3.2, 60, 32, 26, 'high', 'Physical Health', 'former', '2024-07-22 11:00:00+00'),
  ('1', 'Q4', 2024, 1.9, 1.4, 2.8, 64, 28, 24, 'high', 'Physical Health', 'former', '2024-10-15 11:45:00+00'),
  ('1', 'Q1', 2025, 1.6, 1.2, 2.4, 68, 25, 22, 'medium', 'Physical Health', 'former', '2025-01-20 10:30:00+00'),
  ('1', 'Q2', 2025, 1.4, 1.0, 2.1, 72, 22, 20, 'medium', 'Physical Health', 'former', '2025-04-18 12:00:00+00'),
  ('1', 'Q3', 2025, 1.2, 0.8, 1.8, 76, 20, 18, 'medium', 'Physical Health', 'former', '2025-07-25 10:45:00+00'),
  ('1', 'Q4', 2025, 1.0, 0.6, 1.5, 80, 18, 16, 'medium', 'Physical Health', 'former', '2025-10-15 11:30:00+00');

-- Patient 2 (Marcus Johnson) - Medium risk, stable to improving
INSERT INTO patient_outcomes (patient_id, quarter, year, readmissions, hospitalizations, ed_visits, functional_capacity, engagement_score, satisfaction_score, risk_level, primary_dimension, smoking_status, created_at)
VALUES
  ('2', 'Q1', 2024, 1.3, 0.9, 1.6, 66, 24, 20, 'medium', 'Mental Health', 'never', '2024-02-05 15:20:00+00'),
  ('2', 'Q2', 2024, 1.2, 0.8, 1.5, 68, 22, 19, 'medium', 'Mental Health', 'never', '2024-05-12 16:00:00+00'),
  ('2', 'Q3', 2024, 1.1, 0.8, 1.4, 70, 21, 18, 'medium', 'Mental Health', 'never', '2024-08-20 14:30:00+00'),
  ('2', 'Q4', 2024, 1.0, 0.7, 1.3, 72, 20, 17, 'medium', 'Mental Health', 'never', '2024-11-10 15:15:00+00'),
  ('2', 'Q1', 2025, 0.9, 0.6, 1.2, 74, 19, 16, 'low', 'Mental Health', 'never', '2025-02-15 14:45:00+00'),
  ('2', 'Q2', 2025, 0.8, 0.5, 1.1, 76, 18, 15, 'low', 'Mental Health', 'never', '2025-05-20 15:30:00+00'),
  ('2', 'Q3', 2025, 0.7, 0.4, 1.0, 78, 17, 14, 'low', 'Mental Health', 'never', '2025-08-18 14:20:00+00'),
  ('2', 'Q4', 2025, 0.6, 0.3, 0.9, 80, 16, 13, 'low', 'Mental Health', 'never', '2025-11-05 16:00:00+00');

-- Patient 3 (Emily Rodriguez) - High risk, improving
INSERT INTO patient_outcomes (patient_id, quarter, year, readmissions, hospitalizations, ed_visits, functional_capacity, engagement_score, satisfaction_score, risk_level, primary_dimension, smoking_status, created_at)
VALUES
  ('3', 'Q1', 2024, 2.6, 1.9, 3.6, 54, 36, 30, 'high', 'Social Determinants', 'former', '2024-01-25 12:15:00+00'),
  ('3', 'Q2', 2024, 2.4, 1.7, 3.4, 58, 33, 28, 'high', 'Social Determinants', 'former', '2024-04-22 11:45:00+00'),
  ('3', 'Q3', 2024, 2.2, 1.5, 3.1, 62, 30, 26, 'high', 'Social Determinants', 'former', '2024-07-15 12:30:00+00'),
  ('3', 'Q4', 2024, 2.0, 1.3, 2.8, 66, 27, 24, 'medium', 'Social Determinants', 'former', '2024-10-28 11:20:00+00'),
  ('3', 'Q1', 2025, 1.7, 1.1, 2.5, 70, 24, 22, 'medium', 'Social Determinants', 'former', '2025-01-30 13:00:00+00'),
  ('3', 'Q2', 2025, 1.5, 0.9, 2.2, 74, 21, 20, 'medium', 'Social Determinants', 'former', '2025-05-05 11:30:00+00'),
  ('3', 'Q3', 2025, 1.3, 0.7, 1.9, 78, 19, 18, 'medium', 'Social Determinants', 'former', '2025-08-10 12:15:00+00'),
  ('3', 'Q4', 2025, 1.1, 0.5, 1.6, 82, 17, 16, 'low', 'Social Determinants', 'former', '2025-11-12 12:00:00+00');

-- Patient 4 (David Park) - Low risk, stable
INSERT INTO patient_outcomes (patient_id, quarter, year, readmissions, hospitalizations, ed_visits, functional_capacity, engagement_score, satisfaction_score, risk_level, primary_dimension, smoking_status, created_at)
VALUES
  ('4', 'Q1', 2024, 0.4, 0.3, 0.6, 80, 16, 13, 'low', 'Physical Health', 'never', '2024-03-05 16:30:00+00'),
  ('4', 'Q2', 2024, 0.3, 0.2, 0.5, 82, 15, 12, 'low', 'Physical Health', 'never', '2024-06-18 16:00:00+00'),
  ('4', 'Q3', 2024, 0.3, 0.2, 0.5, 84, 14, 12, 'low', 'Physical Health', 'never', '2024-09-12 16:45:00+00'),
  ('4', 'Q4', 2024, 0.2, 0.2, 0.4, 85, 14, 11, 'low', 'Physical Health', 'never', '2024-12-20 15:30:00+00'),
  ('4', 'Q1', 2025, 0.2, 0.1, 0.4, 86, 13, 11, 'low', 'Physical Health', 'never', '2025-03-15 17:00:00+00'),
  ('4', 'Q2', 2025, 0.2, 0.1, 0.3, 87, 13, 10, 'low', 'Physical Health', 'never', '2025-06-22 15:45:00+00'),
  ('4', 'Q3', 2025, 0.1, 0.1, 0.3, 88, 12, 10, 'low', 'Physical Health', 'never', '2025-09-18 16:30:00+00');

-- Patient 5 (Lisa Thompson) - Medium risk, improving
INSERT INTO patient_outcomes (patient_id, quarter, year, readmissions, hospitalizations, ed_visits, functional_capacity, engagement_score, satisfaction_score, risk_level, primary_dimension, smoking_status, created_at)
VALUES
  ('5', 'Q1', 2024, 1.4, 0.9, 1.7, 65, 25, 21, 'medium', 'Mental Health', 'former', '2024-02-12 10:00:00+00'),
  ('5', 'Q2', 2024, 1.3, 0.8, 1.6, 67, 23, 20, 'medium', 'Mental Health', 'former', '2024-05-20 10:30:00+00'),
  ('5', 'Q3', 2024, 1.2, 0.7, 1.5, 69, 22, 19, 'medium', 'Mental Health', 'former', '2024-08-15 10:15:00+00'),
  ('5', 'Q4', 2024, 1.1, 0.7, 1.4, 71, 21, 18, 'medium', 'Mental Health', 'former', '2024-11-18 10:45:00+00'),
  ('5', 'Q1', 2025, 1.0, 0.6, 1.3, 73, 20, 17, 'medium', 'Mental Health', 'former', '2025-02-22 09:30:00+00'),
  ('5', 'Q2', 2025, 0.9, 0.5, 1.2, 75, 19, 16, 'low', 'Mental Health', 'former', '2025-05-28 10:20:00+00'),
  ('5', 'Q3', 2025, 0.8, 0.4, 1.1, 77, 18, 15, 'low', 'Mental Health', 'former', '2025-08-25 10:00:00+00'),
  ('5', 'Q4', 2025, 0.7, 0.3, 1.0, 79, 17, 14, 'low', 'Mental Health', 'former', '2025-11-08 10:30:00+00');

-- Patient 6 (James Wilson) - High risk, improving
INSERT INTO patient_outcomes (patient_id, quarter, year, readmissions, hospitalizations, ed_visits, functional_capacity, engagement_score, satisfaction_score, risk_level, primary_dimension, smoking_status, created_at)
VALUES
  ('6', 'Q1', 2024, 2.7, 1.9, 3.7, 53, 37, 31, 'high', 'Physical Health', 'current', '2024-01-18 14:30:00+00'),
  ('6', 'Q2', 2024, 2.4, 1.7, 3.4, 57, 34, 29, 'high', 'Physical Health', 'current', '2024-04-15 14:00:00+00'),
  ('6', 'Q3', 2024, 2.1, 1.5, 3.1, 61, 31, 27, 'high', 'Physical Health', 'former', '2024-07-28 14:45:00+00'),
  ('6', 'Q4', 2024, 1.8, 1.3, 2.7, 65, 28, 25, 'medium', 'Physical Health', 'former', '2024-10-22 13:30:00+00'),
  ('6', 'Q1', 2025, 1.5, 1.1, 2.3, 69, 25, 23, 'medium', 'Physical Health', 'former', '2025-01-25 15:00:00+00'),
  ('6', 'Q2', 2025, 1.3, 0.9, 2.0, 73, 22, 21, 'medium', 'Physical Health', 'former', '2025-04-28 14:15:00+00'),
  ('6', 'Q3', 2025, 1.1, 0.7, 1.7, 77, 20, 19, 'medium', 'Physical Health', 'former', '2025-07-30 14:30:00+00'),
  ('6', 'Q4', 2025, 0.9, 0.5, 1.4, 81, 18, 17, 'low', 'Physical Health', 'former', '2025-10-20 13:45:00+00');

-- Patient 7 (Maria Garcia) - Low risk, stable
INSERT INTO patient_outcomes (patient_id, quarter, year, readmissions, hospitalizations, ed_visits, functional_capacity, engagement_score, satisfaction_score, risk_level, primary_dimension, smoking_status, created_at)
VALUES
  ('7', 'Q1', 2024, 0.5, 0.3, 0.7, 79, 17, 14, 'low', 'Social Determinants', 'never', '2024-03-10 11:30:00+00'),
  ('7', 'Q2', 2024, 0.4, 0.3, 0.6, 81, 16, 13, 'low', 'Social Determinants', 'never', '2024-06-25 11:00:00+00'),
  ('7', 'Q3', 2024, 0.4, 0.2, 0.6, 83, 15, 13, 'low', 'Social Determinants', 'never', '2024-09-20 11:45:00+00'),
  ('7', 'Q4', 2024, 0.3, 0.2, 0.5, 84, 15, 12, 'low', 'Social Determinants', 'never', '2024-12-15 10:30:00+00'),
  ('7', 'Q1', 2025, 0.3, 0.2, 0.5, 85, 14, 12, 'low', 'Social Determinants', 'never', '2025-03-22 12:00:00+00'),
  ('7', 'Q2', 2025, 0.3, 0.1, 0.4, 86, 14, 11, 'low', 'Social Determinants', 'never', '2025-06-18 10:45:00+00'),
  ('7', 'Q3', 2025, 0.2, 0.1, 0.4, 87, 13, 11, 'low', 'Social Determinants', 'never', '2025-09-25 11:30:00+00');

-- Patient 8 (Robert Lee) - Medium risk, improving
INSERT INTO patient_outcomes (patient_id, quarter, year, readmissions, hospitalizations, ed_visits, functional_capacity, engagement_score, satisfaction_score, risk_level, primary_dimension, smoking_status, created_at)
VALUES
  ('8', 'Q1', 2024, 1.5, 1.0, 1.8, 64, 26, 22, 'medium', 'Physical Health', 'current', '2024-02-20 17:15:00+00'),
  ('8', 'Q2', 2024, 1.4, 0.9, 1.7, 66, 24, 21, 'medium', 'Physical Health', 'current', '2024-05-28 17:00:00+00'),
  ('8', 'Q3', 2024, 1.3, 0.8, 1.6, 68, 23, 20, 'medium', 'Physical Health', 'former', '2024-08-22 17:30:00+00'),
  ('8', 'Q4', 2024, 1.2, 0.7, 1.5, 70, 22, 19, 'medium', 'Physical Health', 'former', '2024-11-25 16:45:00+00'),
  ('8', 'Q1', 2025, 1.1, 0.6, 1.4, 72, 21, 18, 'medium', 'Physical Health', 'former', '2025-02-28 18:00:00+00'),
  ('8', 'Q2', 2025, 1.0, 0.5, 1.3, 74, 20, 17, 'medium', 'Physical Health', 'former', '2025-06-05 16:30:00+00'),
  ('8', 'Q3', 2025, 0.9, 0.4, 1.2, 76, 19, 16, 'low', 'Physical Health', 'former', '2025-09-10 17:15:00+00'),
  ('8', 'Q4', 2025, 0.8, 0.3, 1.1, 78, 18, 15, 'low', 'Physical Health', 'former', '2025-11-15 17:00:00+00');
