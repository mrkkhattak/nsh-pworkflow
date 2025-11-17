/*
  # Populate Sample Tasks Data

  1. Purpose
    - Populate the tasks table with realistic sample data
    - Cover all task categories: provider-level, patient-level, system-level, community-level
    - Include tasks with various statuses, priorities, and due dates
    - Provide tasks spanning different time periods for testing the aggregate view

  2. Data Coverage
    - Tasks for multiple patients across the last 14 days
    - Mix of pending, scheduled, in-progress, completed, and declined statuses
    - High, medium, and low priority tasks
    - Tasks with different SLA statuses (on-time, at-risk, overdue)
    - Various health dimensions represented
    - Different assignees and task types

  3. Important Notes
    - Sample data is for demonstration and testing purposes
    - Patient IDs are generated as UUIDs
    - Due dates span from 7 days ago to 7 days in the future
    - Task categories align with the application's task management system
*/

-- Insert patient-level tasks
INSERT INTO tasks (
  category,
  status,
  title,
  description,
  priority,
  due_date,
  assignee,
  dimension,
  sla_status,
  estimated_time,
  patient_id,
  patient_name,
  blockers
) VALUES
(
  'patient-level',
  'pending',
  'Follow-up Depression Assessment',
  'Schedule follow-up assessment after medication adjustment',
  'high',
  CURRENT_DATE + INTERVAL '2 days',
  'Dr. Anderson',
  'mental',
  'on-time',
  '30 min',
  gen_random_uuid(),
  'Sarah Johnson',
  ARRAY[]::text[]
),
(
  'patient-level',
  'pending',
  'Sleep Study Results Review',
  'Discuss sleep study findings and potential CPAP therapy',
  'high',
  CURRENT_DATE + INTERVAL '1 day',
  'Dr. Anderson',
  'sleep',
  'on-time',
  '30 min',
  gen_random_uuid(),
  'Sarah Johnson',
  ARRAY[]::text[]
),
(
  'patient-level',
  'pending',
  'Physical Therapy Follow-up',
  'Check progress on mobility exercises and adjust therapy plan',
  'medium',
  CURRENT_DATE + INTERVAL '3 days',
  'Physical Therapist',
  'physical',
  'on-time',
  '40 min',
  gen_random_uuid(),
  'Emily Rodriguez',
  ARRAY[]::text[]
),
(
  'patient-level',
  'pending',
  'Nutrition Counseling Session',
  'Review dietary changes and meal planning for diabetes management',
  'medium',
  CURRENT_DATE + INTERVAL '5 days',
  'Dietitian',
  'diet',
  'on-time',
  '45 min',
  gen_random_uuid(),
  'Michael Chen',
  ARRAY[]::text[]
),
(
  'patient-level',
  'in-progress',
  'Care Plan Review',
  'Review and update care plan based on recent assessment',
  'low',
  CURRENT_DATE + INTERVAL '1 day',
  'Dr. Anderson',
  'burden',
  'on-time',
  '25 min',
  gen_random_uuid(),
  'Emily Rodriguez',
  ARRAY[]::text[]
),
(
  'patient-level',
  'completed',
  'Initial Assessment Consultation',
  'Complete initial mental health assessment and baseline evaluation',
  'high',
  CURRENT_DATE - INTERVAL '3 days',
  'Dr. Anderson',
  'mental',
  'completed',
  '60 min',
  gen_random_uuid(),
  'Robert Williams',
  ARRAY[]::text[]
),
(
  'patient-level',
  'pending',
  'Medication Side Effects Check',
  'Review any side effects from new antidepressant medication',
  'high',
  CURRENT_DATE,
  'Dr. Anderson',
  'medical',
  'at-risk',
  '20 min',
  gen_random_uuid(),
  'Sarah Johnson',
  ARRAY[]::text[]
),
(
  'patient-level',
  'pending',
  'Anxiety Management Session',
  'Cognitive behavioral therapy session for anxiety management',
  'medium',
  CURRENT_DATE + INTERVAL '2 days',
  'Lisa Chen, LCSW',
  'mental',
  'on-time',
  '50 min',
  gen_random_uuid(),
  'David Martinez',
  ARRAY[]::text[]
);

-- Insert system-level tasks
INSERT INTO tasks (
  category,
  status,
  title,
  description,
  priority,
  due_date,
  assignee,
  dimension,
  sla_status,
  estimated_time,
  patient_id,
  patient_name,
  system_name,
  blockers
) VALUES
(
  'system-level',
  'pending',
  'Psychiatric Referral',
  'Refer to Dr. Smith for psychiatric evaluation',
  'high',
  CURRENT_DATE - INTERVAL '1 day',
  'Care Coordinator',
  'mental',
  'overdue',
  '15 min',
  gen_random_uuid(),
  'Sarah Johnson',
  'Mental Health Referral Network',
  ARRAY[]::text[]
),
(
  'system-level',
  'in-progress',
  'Pain Management Consultation',
  'Refer to pain management specialist for chronic back pain',
  'high',
  CURRENT_DATE + INTERVAL '6 days',
  'Pain Specialist',
  'pain',
  'on-time',
  '35 min',
  gen_random_uuid(),
  'Robert Williams',
  'Pain Management Services',
  ARRAY[]::text[]
),
(
  'system-level',
  'completed',
  'Insurance Authorization',
  'Process insurance authorization for specialist visit',
  'medium',
  CURRENT_DATE - INTERVAL '4 days',
  'Admin Staff',
  'cost',
  'completed',
  '45 min',
  gen_random_uuid(),
  'Robert Williams',
  'Insurance Processing Center',
  ARRAY[]::text[]
),
(
  'system-level',
  'pending',
  'Specialist Coordination',
  'Coordinate care between primary care and psychiatrist',
  'medium',
  CURRENT_DATE + INTERVAL '3 days',
  'Care Coordinator',
  'utilization',
  'on-time',
  '30 min',
  gen_random_uuid(),
  'Emily Rodriguez',
  'Care Coordination Services',
  ARRAY[]::text[]
);

-- Insert community-level tasks
INSERT INTO tasks (
  category,
  status,
  title,
  description,
  priority,
  due_date,
  assignee,
  dimension,
  sla_status,
  estimated_time,
  patient_id,
  patient_name,
  community_resource_name,
  community_location,
  blockers
) VALUES
(
  'community-level',
  'in-progress',
  'Medication Adherence Check',
  'Contact patient about missed medication doses',
  'medium',
  CURRENT_DATE,
  'Pharmacist',
  'medical',
  'overdue',
  '20 min',
  gen_random_uuid(),
  'Michael Chen',
  'Community Pharmacy Services',
  'Main Street Pharmacy',
  ARRAY['Patient not responding to calls']::text[]
),
(
  'community-level',
  'pending',
  'Community Health Fair Planning',
  'Coordinate mental health screening booth for upcoming community event',
  'low',
  CURRENT_DATE + INTERVAL '8 days',
  'Community Coordinator',
  'sdoh',
  'on-time',
  '90 min',
  NULL,
  NULL,
  'Community Health Initiative',
  'Community Center',
  ARRAY[]::text[]
),
(
  'community-level',
  'scheduled',
  'Support Group Referral',
  'Connect patient with local depression support group',
  'medium',
  CURRENT_DATE + INTERVAL '4 days',
  'Social Worker',
  'social',
  'on-time',
  '30 min',
  gen_random_uuid(),
  'Sarah Johnson',
  'Mental Health Support Groups',
  'Downtown Community Center',
  ARRAY[]::text[]
);

-- Insert provider-level tasks
INSERT INTO tasks (
  category,
  status,
  title,
  description,
  priority,
  due_date,
  assignee,
  dimension,
  sla_status,
  estimated_time,
  provider_name,
  provider_specialty,
  blockers
) VALUES
(
  'provider-level',
  'pending',
  'Review High-Risk Patient Panel',
  'Weekly review of all high-risk patients in panel for care coordination',
  'high',
  CURRENT_DATE - INTERVAL '1 day',
  'Dr. Anderson',
  'burden',
  'overdue',
  '60 min',
  'Dr. Michael Anderson',
  'Psychiatry',
  ARRAY[]::text[]
),
(
  'provider-level',
  'pending',
  'Peer Consultation: Complex Case',
  'Consult with psychiatrist regarding treatment-resistant depression case',
  'high',
  CURRENT_DATE,
  'Dr. Anderson',
  'mental',
  'at-risk',
  '45 min',
  'Dr. Michael Anderson',
  'Psychiatry',
  ARRAY[]::text[]
),
(
  'provider-level',
  'scheduled',
  'Complete CME Training Module',
  'Complete required continuing medical education on depression management',
  'medium',
  CURRENT_DATE + INTERVAL '3 days',
  'Dr. Anderson',
  'mental',
  'on-time',
  '120 min',
  'Dr. Michael Anderson',
  'Psychiatry',
  ARRAY[]::text[]
),
(
  'provider-level',
  'pending',
  'Quality Metrics Review',
  'Monthly review of provider quality metrics and outcomes',
  'high',
  CURRENT_DATE + INTERVAL '2 days',
  'Quality Team',
  'satisfaction',
  'on-time',
  '120 min',
  'Quality Assurance Department',
  'Healthcare Quality',
  ARRAY[]::text[]
),
(
  'provider-level',
  'scheduled',
  'Provider Network Expansion',
  'Onboard 3 new therapists to provider network',
  'medium',
  CURRENT_DATE + INTERVAL '13 days',
  'Network Manager',
  'utilization',
  'on-time',
  '180 min',
  'Network Development Team',
  'Network Management',
  ARRAY[]::text[]
),
(
  'provider-level',
  'completed',
  'Monthly Team Meeting',
  'Review patient outcomes and care coordination strategies',
  'medium',
  CURRENT_DATE - INTERVAL '5 days',
  'Dr. Anderson',
  'burden',
  'completed',
  '90 min',
  'Care Team',
  'Multidisciplinary',
  ARRAY[]::text[]
);

-- Add some additional pending tasks from the last 7 days for default view
INSERT INTO tasks (
  category,
  status,
  title,
  description,
  priority,
  due_date,
  assignee,
  dimension,
  sla_status,
  estimated_time,
  patient_id,
  patient_name,
  blockers
) VALUES
(
  'patient-level',
  'pending',
  'Lab Results Follow-up',
  'Review and discuss recent blood work results with patient',
  'medium',
  CURRENT_DATE + INTERVAL '1 day',
  'Dr. Anderson',
  'medical',
  'on-time',
  '15 min',
  gen_random_uuid(),
  'Michael Chen',
  ARRAY[]::text[]
),
(
  'patient-level',
  'pending',
  'Therapy Session Scheduling',
  'Schedule next bi-weekly therapy appointment',
  'low',
  CURRENT_DATE + INTERVAL '4 days',
  'Admin Staff',
  'mental',
  'on-time',
  '10 min',
  gen_random_uuid(),
  'David Martinez',
  ARRAY[]::text[]
),
(
  'patient-level',
  'pending',
  'Exercise Program Review',
  'Assess adherence to prescribed exercise regimen',
  'medium',
  CURRENT_DATE + INTERVAL '2 days',
  'Physical Therapist',
  'physical',
  'on-time',
  '30 min',
  gen_random_uuid(),
  'Emily Rodriguez',
  ARRAY[]::text[]
);
