/*
  # Populate Comprehensive Task Data - Schema Compliant

  1. Purpose
    - Populate tasks table with realistic data for all four task categories
    - Provider-level: Tasks for providers, physicians, care teams
    - Patient-level: Tasks for individual patients
    - System-level: Administrative and system-wide tasks
    - Community-level: Community resource and program tasks

  2. Data Coverage
    - 30+ tasks spanning last 14 days
    - All task statuses represented
    - High, medium, and low priority tasks
    - Various health dimensions
    - Category-specific fields populated correctly

  3. Important Notes
    - Uses all schema fields appropriately per category
    - Realistic provider credentials and organizations
    - Patient IDs generated as UUIDs
    - System and community resources with proper details
*/

-- Clear existing sample data first
DELETE FROM tasks;

-- ============================================================================
-- PATIENT-LEVEL TASKS (Individual Patient Care)
-- ============================================================================

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
  blockers,
  patient_id,
  patient_name,
  patient_contact
) VALUES
-- Sarah Johnson's tasks
(
  'patient-level',
  'pending',
  'Follow-up Depression Assessment',
  'Schedule follow-up assessment after medication adjustment. Review PHQ-9 scores and discuss treatment response.',
  'high',
  CURRENT_DATE + INTERVAL '2 days',
  'Dr. Michael Anderson',
  'mental',
  'on-time',
  '30 min',
  ARRAY[]::text[],
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Sarah Johnson',
  '(555) 234-5678'
),
(
  'patient-level',
  'pending',
  'Sleep Study Results Review',
  'Discuss sleep study findings and potential CPAP therapy. Patient showing signs of sleep apnea.',
  'high',
  CURRENT_DATE + INTERVAL '1 day',
  'Dr. Michael Anderson',
  'sleep',
  'on-time',
  '30 min',
  ARRAY[]::text[],
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Sarah Johnson',
  '(555) 234-5678'
),
(
  'patient-level',
  'pending',
  'Medication Side Effects Check',
  'Review any side effects from new antidepressant medication. Patient reported mild nausea.',
  'high',
  CURRENT_DATE,
  'Dr. Michael Anderson',
  'medical',
  'at-risk',
  '20 min',
  ARRAY[]::text[],
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Sarah Johnson',
  '(555) 234-5678'
),

-- Michael Chen's tasks
(
  'patient-level',
  'pending',
  'Nutrition Counseling Session',
  'Review dietary changes and meal planning for diabetes management. Focus on carb counting.',
  'medium',
  CURRENT_DATE + INTERVAL '5 days',
  'Jennifer Liu, RD',
  'diet',
  'on-time',
  '45 min',
  ARRAY[]::text[],
  '550e8400-e29b-41d4-a716-446655440002'::uuid,
  'Michael Chen',
  '(555) 345-6789'
),
(
  'patient-level',
  'pending',
  'Lab Results Follow-up',
  'Review and discuss recent blood work results with patient. HbA1c levels need review.',
  'medium',
  CURRENT_DATE + INTERVAL '1 day',
  'Dr. Sarah Martinez',
  'medical',
  'on-time',
  '15 min',
  ARRAY[]::text[],
  '550e8400-e29b-41d4-a716-446655440002'::uuid,
  'Michael Chen',
  '(555) 345-6789'
),

-- Emily Rodriguez's tasks
(
  'patient-level',
  'pending',
  'Physical Therapy Follow-up',
  'Check progress on mobility exercises and adjust therapy plan. Focus on lower back strength.',
  'medium',
  CURRENT_DATE + INTERVAL '3 days',
  'James Wilson, PT',
  'physical',
  'on-time',
  '40 min',
  ARRAY[]::text[],
  '550e8400-e29b-41d4-a716-446655440003'::uuid,
  'Emily Rodriguez',
  '(555) 456-7890'
),
(
  'patient-level',
  'in-progress',
  'Care Plan Review',
  'Review and update care plan based on recent assessment. Update goals and interventions.',
  'low',
  CURRENT_DATE + INTERVAL '1 day',
  'Dr. Michael Anderson',
  'burden',
  'on-time',
  '25 min',
  ARRAY[]::text[],
  '550e8400-e29b-41d4-a716-446655440003'::uuid,
  'Emily Rodriguez',
  '(555) 456-7890'
),
(
  'patient-level',
  'pending',
  'Exercise Program Review',
  'Assess adherence to prescribed exercise regimen. Review home exercise log.',
  'medium',
  CURRENT_DATE + INTERVAL '2 days',
  'James Wilson, PT',
  'physical',
  'on-time',
  '30 min',
  ARRAY[]::text[],
  '550e8400-e29b-41d4-a716-446655440003'::uuid,
  'Emily Rodriguez',
  '(555) 456-7890'
),

-- Robert Williams's tasks
(
  'patient-level',
  'completed',
  'Initial Assessment Consultation',
  'Complete initial mental health assessment and baseline evaluation. PHQ-9 and GAD-7 completed.',
  'high',
  CURRENT_DATE - INTERVAL '3 days',
  'Dr. Michael Anderson',
  'mental',
  'completed',
  '60 min',
  ARRAY[]::text[],
  '550e8400-e29b-41d4-a716-446655440004'::uuid,
  'Robert Williams',
  '(555) 567-8901'
),

-- David Martinez's tasks
(
  'patient-level',
  'pending',
  'Anxiety Management Session',
  'Cognitive behavioral therapy session for anxiety management. Continue exposure therapy.',
  'medium',
  CURRENT_DATE + INTERVAL '2 days',
  'Lisa Chen, LCSW',
  'mental',
  'on-time',
  '50 min',
  ARRAY[]::text[],
  '550e8400-e29b-41d4-a716-446655440005'::uuid,
  'David Martinez',
  '(555) 678-9012'
),
(
  'patient-level',
  'pending',
  'Therapy Session Scheduling',
  'Schedule next bi-weekly therapy appointment. Coordinate with patient schedule.',
  'low',
  CURRENT_DATE + INTERVAL '4 days',
  'Admin Staff',
  'mental',
  'on-time',
  '10 min',
  ARRAY[]::text[],
  '550e8400-e29b-41d4-a716-446655440005'::uuid,
  'David Martinez',
  '(555) 678-9012'
);

-- ============================================================================
-- PROVIDER-LEVEL TASKS (Provider Network and Care Teams)
-- ============================================================================

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
  blockers,
  provider_name,
  provider_credential,
  provider_email,
  provider_specialty,
  provider_license_id,
  provider_organization
) VALUES
(
  'provider-level',
  'pending',
  'Review High-Risk Patient Panel',
  'Weekly review of all high-risk patients in panel for care coordination. Focus on patients with recent hospitalizations.',
  'high',
  CURRENT_DATE - INTERVAL '1 day',
  'Dr. Michael Anderson',
  'burden',
  'overdue',
  '60 min',
  ARRAY[]::text[],
  'Dr. Michael Anderson',
  'MD, Board Certified Psychiatrist',
  'manderson@mentalhealthclinic.org',
  'Psychiatry',
  'CA-PSY-12345',
  'Mental Health Integrated Care Clinic'
),
(
  'provider-level',
  'pending',
  'Peer Consultation: Complex Case',
  'Consult with psychiatrist regarding treatment-resistant depression case. Patient not responding to standard protocols.',
  'high',
  CURRENT_DATE,
  'Dr. Michael Anderson',
  'mental',
  'at-risk',
  '45 min',
  ARRAY[]::text[],
  'Dr. Michael Anderson',
  'MD, Board Certified Psychiatrist',
  'manderson@mentalhealthclinic.org',
  'Psychiatry',
  'CA-PSY-12345',
  'Mental Health Integrated Care Clinic'
),
(
  'provider-level',
  'scheduled',
  'Complete CME Training Module',
  'Complete required continuing medical education on depression management. APA-approved course.',
  'medium',
  CURRENT_DATE + INTERVAL '3 days',
  'Dr. Michael Anderson',
  'mental',
  'on-time',
  '120 min',
  ARRAY[]::text[],
  'Dr. Michael Anderson',
  'MD, Board Certified Psychiatrist',
  'manderson@mentalhealthclinic.org',
  'Psychiatry',
  'CA-PSY-12345',
  'Mental Health Integrated Care Clinic'
),
(
  'provider-level',
  'pending',
  'Quality Metrics Review',
  'Monthly review of provider quality metrics and outcomes. Review HEDIS measures and patient satisfaction scores.',
  'high',
  CURRENT_DATE + INTERVAL '2 days',
  'Quality Team',
  'satisfaction',
  'on-time',
  '120 min',
  ARRAY[]::text[],
  'Quality Assurance Department',
  'Healthcare Quality Specialists',
  'quality@mentalhealthclinic.org',
  'Healthcare Quality',
  'QA-DEPT-001',
  'Mental Health Integrated Care Clinic'
),
(
  'provider-level',
  'scheduled',
  'Provider Network Expansion',
  'Onboard 3 new therapists to provider network. Complete credentialing and orientation.',
  'medium',
  CURRENT_DATE + INTERVAL '13 days',
  'Network Manager',
  'utilization',
  'on-time',
  '180 min',
  ARRAY[]::text[],
  'Network Development Team',
  'Provider Relations Specialists',
  'network@mentalhealthclinic.org',
  'Network Management',
  'NET-DEV-001',
  'Mental Health Integrated Care Clinic'
),
(
  'provider-level',
  'completed',
  'Monthly Team Meeting',
  'Review patient outcomes and care coordination strategies. Discuss complex cases and best practices.',
  'medium',
  CURRENT_DATE - INTERVAL '5 days',
  'Dr. Michael Anderson',
  'burden',
  'completed',
  '90 min',
  ARRAY[]::text[],
  'Care Team',
  'Multidisciplinary Care Team',
  'careteam@mentalhealthclinic.org',
  'Multidisciplinary',
  'CARE-TEAM-001',
  'Mental Health Integrated Care Clinic'
),
(
  'provider-level',
  'pending',
  'Clinical Documentation Training',
  'Train on new EHR documentation standards and compliance requirements.',
  'medium',
  CURRENT_DATE + INTERVAL '5 days',
  'All Providers',
  'burden',
  'on-time',
  '90 min',
  ARRAY[]::text[],
  'Dr. Sarah Martinez',
  'MD, Internal Medicine',
  'smartinez@mentalhealthclinic.org',
  'Internal Medicine',
  'CA-IM-67890',
  'Mental Health Integrated Care Clinic'
);

-- ============================================================================
-- SYSTEM-LEVEL TASKS (Administrative and System-Wide)
-- ============================================================================

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
  blockers,
  patient_id,
  patient_name,
  system_name,
  system_location,
  system_contact
) VALUES
(
  'system-level',
  'pending',
  'Psychiatric Referral Processing',
  'Process referral to Dr. Smith for psychiatric evaluation. Obtain authorization and schedule appointment.',
  'high',
  CURRENT_DATE - INTERVAL '1 day',
  'Care Coordinator',
  'mental',
  'overdue',
  '15 min',
  ARRAY[]::text[],
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Sarah Johnson',
  'Mental Health Referral Network',
  'Building A, Floor 2',
  '(555) 111-2222'
),
(
  'system-level',
  'in-progress',
  'Pain Management Consultation Referral',
  'Refer to pain management specialist for chronic back pain. Coordinate with insurance.',
  'high',
  CURRENT_DATE + INTERVAL '6 days',
  'Referral Coordinator',
  'pain',
  'on-time',
  '35 min',
  ARRAY[]::text[],
  '550e8400-e29b-41d4-a716-446655440004'::uuid,
  'Robert Williams',
  'Pain Management Services',
  'Medical Plaza, Suite 300',
  '(555) 222-3333'
),
(
  'system-level',
  'completed',
  'Insurance Authorization Processed',
  'Process insurance authorization for specialist visit. Pre-authorization obtained.',
  'medium',
  CURRENT_DATE - INTERVAL '4 days',
  'Admin Staff',
  'cost',
  'completed',
  '45 min',
  ARRAY[]::text[],
  '550e8400-e29b-41d4-a716-446655440004'::uuid,
  'Robert Williams',
  'Insurance Processing Center',
  'Administrative Building, Floor 1',
  '(555) 333-4444'
),
(
  'system-level',
  'pending',
  'Specialist Care Coordination',
  'Coordinate care between primary care and psychiatrist. Ensure information exchange.',
  'medium',
  CURRENT_DATE + INTERVAL '3 days',
  'Care Coordinator',
  'utilization',
  'on-time',
  '30 min',
  ARRAY[]::text[],
  '550e8400-e29b-41d4-a716-446655440003'::uuid,
  'Emily Rodriguez',
  'Care Coordination Services',
  'Building B, Floor 3',
  '(555) 444-5555'
),
(
  'system-level',
  'pending',
  'EHR System Update Rollout',
  'Deploy new electronic health records system features. Train staff on new functionality.',
  'high',
  CURRENT_DATE + INTERVAL '7 days',
  'IT Department',
  'burden',
  'on-time',
  '240 min',
  ARRAY['Requires downtime window', 'Staff training needed']::text[],
  NULL,
  NULL,
  'Electronic Health Records System',
  'Data Center',
  'itsupport@mentalhealthclinic.org'
),
(
  'system-level',
  'scheduled',
  'Medication Reconciliation Audit',
  'Conduct quarterly audit of medication reconciliation processes. Review compliance.',
  'medium',
  CURRENT_DATE + INTERVAL '10 days',
  'Pharmacy Director',
  'medical',
  'on-time',
  '180 min',
  ARRAY[]::text[],
  NULL,
  NULL,
  'Pharmacy Management System',
  'Pharmacy Department, Building A',
  'pharmacy@mentalhealthclinic.org'
);

-- ============================================================================
-- COMMUNITY-LEVEL TASKS (Community Resources and Programs)
-- ============================================================================

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
  blockers,
  patient_id,
  patient_name,
  community_resource_name,
  community_location,
  community_email,
  community_contact
) VALUES
(
  'community-level',
  'in-progress',
  'Medication Adherence Community Outreach',
  'Contact patient about missed medication doses through community pharmacy partnership.',
  'medium',
  CURRENT_DATE,
  'Community Pharmacist',
  'medical',
  'overdue',
  '20 min',
  ARRAY['Patient not responding to calls']::text[],
  '550e8400-e29b-41d4-a716-446655440002'::uuid,
  'Michael Chen',
  'Community Pharmacy Services',
  'Main Street Pharmacy, 123 Main St',
  'info@mainstreetpharmacy.com',
  '(555) 777-8888'
),
(
  'community-level',
  'pending',
  'Community Health Fair Planning',
  'Coordinate mental health screening booth for upcoming community event. Arrange staffing and materials.',
  'low',
  CURRENT_DATE + INTERVAL '8 days',
  'Community Coordinator',
  'sdoh',
  'on-time',
  '90 min',
  ARRAY[]::text[],
  NULL,
  NULL,
  'Community Health Initiative',
  'Downtown Community Center, 456 Center St',
  'events@communityhealthinitiative.org',
  '(555) 888-9999'
),
(
  'community-level',
  'scheduled',
  'Support Group Referral and Introduction',
  'Connect patient with local depression support group. Provide meeting schedule and introduction.',
  'medium',
  CURRENT_DATE + INTERVAL '4 days',
  'Social Worker',
  'social',
  'on-time',
  '30 min',
  ARRAY[]::text[],
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Sarah Johnson',
  'Mental Health Support Groups',
  'Downtown Community Center, Room 201',
  'support@mentalhealthsupport.org',
  '(555) 999-0000'
),
(
  'community-level',
  'pending',
  'Exercise Program Enrollment',
  'Enroll patient in community-based exercise program for seniors. Coordinate transportation.',
  'medium',
  CURRENT_DATE + INTERVAL '6 days',
  'Community Health Worker',
  'physical',
  'on-time',
  '45 min',
  ARRAY[]::text[],
  '550e8400-e29b-41d4-a716-446655440003'::uuid,
  'Emily Rodriguez',
  'Senior Wellness Program',
  'Community Rec Center, 789 Park Ave',
  'wellness@seniorcenter.org',
  '(555) 000-1111'
),
(
  'community-level',
  'pending',
  'Food Assistance Program Referral',
  'Connect patient with local food bank for nutrition support. Address food insecurity.',
  'high',
  CURRENT_DATE + INTERVAL '2 days',
  'Social Worker',
  'sdoh',
  'on-time',
  '30 min',
  ARRAY[]::text[],
  '550e8400-e29b-41d4-a716-446655440002'::uuid,
  'Michael Chen',
  'Community Food Bank',
  'Food Distribution Center, 321 Oak St',
  'help@communityfoodbank.org',
  '(555) 111-0000'
),
(
  'community-level',
  'completed',
  'Housing Assistance Coordination',
  'Coordinated with housing services for stable housing placement. Application completed.',
  'high',
  CURRENT_DATE - INTERVAL '7 days',
  'Case Manager',
  'sdoh',
  'completed',
  '60 min',
  ARRAY[]::text[],
  '550e8400-e29b-41d4-a716-446655440005'::uuid,
  'David Martinez',
  'Housing Assistance Program',
  'Social Services Building, 555 Main St',
  'housing@socialservices.gov',
  '(555) 222-1111'
);
