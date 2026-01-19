# Mock Task Data Summary

## Overview
Comprehensive mock data has been added to the tasks table covering all four task categories with realistic, schema-compliant information.

## Migration File
**`supabase/migrations/20251118055217_populate_comprehensive_task_data.sql`**

## Data Statistics

### Total Tasks: 35

**By Category:**
- 🔵 Patient-level: 12 tasks
- 🔵 Provider-level: 7 tasks
- 🟣 System-level: 10 tasks
- 🟢 Community-level: 6 tasks

**By Status:**
- Pending: 23 tasks
- In-progress: 3 tasks
- Scheduled: 4 tasks
- Completed: 5 tasks

**By Priority:**
- High: 14 tasks
- Medium: 17 tasks
- Low: 4 tasks

**By SLA Status:**
- On-time: 27 tasks
- At-risk: 3 tasks
- Overdue: 3 tasks
- Completed: 2 tasks

## Patient-Level Tasks (12 tasks)

### Patients Represented:
1. **Sarah Johnson** (UUID: 550e8400-e29b-41d4-a716-446655440001)
   - Contact: (555) 234-5678
   - 3 pending tasks (depression assessment, sleep study, medication check)
   - Focus: Mental health, sleep, medication management

2. **Michael Chen** (UUID: 550e8400-e29b-41d4-a716-446655440002)
   - Contact: (555) 345-6789
   - 2 pending tasks (nutrition counseling, lab results)
   - Focus: Diabetes management, diet, medical follow-up

3. **Emily Rodriguez** (UUID: 550e8400-e29b-41d4-a716-446655440003)
   - Contact: (555) 456-7890
   - 3 tasks (physical therapy, care plan, exercise program)
   - Focus: Physical therapy, mobility, care coordination

4. **Robert Williams** (UUID: 550e8400-e29b-41d4-a716-446655440004)
   - Contact: (555) 567-8901
   - 1 completed task (initial assessment)
   - Focus: Mental health assessment

5. **David Martinez** (UUID: 550e8400-e29b-41d4-a716-446655440005)
   - Contact: (555) 678-9012
   - 2 pending tasks (anxiety therapy, session scheduling)
   - Focus: Anxiety management, therapy

### Task Types:
- Follow-up assessments
- Therapy sessions
- Medication management
- Physical therapy
- Nutrition counseling
- Lab result reviews
- Care plan updates

### Health Dimensions Covered:
- Mental health
- Sleep
- Medical
- Physical
- Diet
- Burden (care coordination)

## Provider-Level Tasks (7 tasks)

### Providers Represented:

1. **Dr. Michael Anderson**
   - Credential: MD, Board Certified Psychiatrist
   - License: CA-PSY-12345
   - Email: manderson@mentalhealthclinic.org
   - Specialty: Psychiatry
   - Organization: Mental Health Integrated Care Clinic
   - Tasks: 3 (high-risk panel review, peer consultation, CME training)

2. **Quality Assurance Department**
   - Credential: Healthcare Quality Specialists
   - License: QA-DEPT-001
   - Email: quality@mentalhealthclinic.org
   - Specialty: Healthcare Quality
   - Organization: Mental Health Integrated Care Clinic
   - Tasks: 1 (quality metrics review)

3. **Network Development Team**
   - Credential: Provider Relations Specialists
   - License: NET-DEV-001
   - Email: network@mentalhealthclinic.org
   - Specialty: Network Management
   - Organization: Mental Health Integrated Care Clinic
   - Tasks: 1 (provider network expansion)

4. **Care Team**
   - Credential: Multidisciplinary Care Team
   - License: CARE-TEAM-001
   - Email: careteam@mentalhealthclinic.org
   - Specialty: Multidisciplinary
   - Organization: Mental Health Integrated Care Clinic
   - Tasks: 1 completed (monthly team meeting)

5. **Dr. Sarah Martinez**
   - Credential: MD, Internal Medicine
   - License: CA-IM-67890
   - Email: smartinez@mentalhealthclinic.org
   - Specialty: Internal Medicine
   - Organization: Mental Health Integrated Care Clinic
   - Tasks: 1 (clinical documentation training)

### Task Types:
- High-risk patient panel reviews
- Peer consultations
- CME training
- Quality metrics reviews
- Network expansion
- Team meetings
- Clinical documentation training

### Focus Areas:
- Care coordination
- Professional development
- Quality improvement
- Network management
- Team collaboration

## System-Level Tasks (10 tasks)

### Systems Represented:

1. **Mental Health Referral Network**
   - Location: Building A, Floor 2
   - Contact: (555) 111-2222
   - Tasks: 1 overdue (psychiatric referral)
   - Patient: Sarah Johnson

2. **Pain Management Services**
   - Location: Medical Plaza, Suite 300
   - Contact: (555) 222-3333
   - Tasks: 1 in-progress (pain consultation)
   - Patient: Robert Williams

3. **Insurance Processing Center**
   - Location: Administrative Building, Floor 1
   - Contact: (555) 333-4444
   - Tasks: 1 completed (insurance authorization)
   - Patient: Robert Williams

4. **Care Coordination Services**
   - Location: Building B, Floor 3
   - Contact: (555) 444-5555
   - Tasks: 1 pending (specialist coordination)
   - Patient: Emily Rodriguez

5. **Electronic Health Records System**
   - Location: Data Center
   - Contact: itsupport@mentalhealthclinic.org
   - Tasks: 1 pending (EHR system update)
   - Blockers: Downtime window, staff training

6. **Pharmacy Management System**
   - Location: Pharmacy Department, Building A
   - Contact: pharmacy@mentalhealthclinic.org
   - Tasks: 1 scheduled (medication reconciliation audit)

### Task Types:
- Referral processing
- Insurance authorizations
- Care coordination
- System updates
- Audits and compliance

### Focus Areas:
- Administrative efficiency
- System-wide processes
- Compliance
- Technology upgrades
- Inter-departmental coordination

## Community-Level Tasks (6 tasks)

### Community Resources Represented:

1. **Community Pharmacy Services**
   - Location: Main Street Pharmacy, 123 Main St
   - Email: info@mainstreetpharmacy.com
   - Contact: (555) 777-8888
   - Tasks: 1 in-progress with blocker (medication adherence)
   - Patient: Michael Chen
   - Blocker: Patient not responding to calls

2. **Community Health Initiative**
   - Location: Downtown Community Center, 456 Center St
   - Email: events@communityhealthinitiative.org
   - Contact: (555) 888-9999
   - Tasks: 1 pending (health fair planning)

3. **Mental Health Support Groups**
   - Location: Downtown Community Center, Room 201
   - Email: support@mentalhealthsupport.org
   - Contact: (555) 999-0000
   - Tasks: 1 scheduled (support group referral)
   - Patient: Sarah Johnson

4. **Senior Wellness Program**
   - Location: Community Rec Center, 789 Park Ave
   - Email: wellness@seniorcenter.org
   - Contact: (555) 000-1111
   - Tasks: 1 pending (exercise program enrollment)
   - Patient: Emily Rodriguez

5. **Community Food Bank**
   - Location: Food Distribution Center, 321 Oak St
   - Email: help@communityfoodbank.org
   - Contact: (555) 111-0000
   - Tasks: 1 pending (food assistance referral)
   - Patient: Michael Chen

6. **Housing Assistance Program**
   - Location: Social Services Building, 555 Main St
   - Email: housing@socialservices.gov
   - Contact: (555) 222-1111
   - Tasks: 1 completed (housing coordination)
   - Patient: David Martinez

### Task Types:
- Medication adherence outreach
- Community health events
- Support group referrals
- Exercise program enrollment
- Food assistance
- Housing coordination

### Focus Areas:
- Social determinants of health (SDOH)
- Community engagement
- Resource connection
- Population health
- Social support

## Timeline Distribution

**Past (Overdue/Completed):**
- 7 days ago: 1 completed
- 5 days ago: 1 completed
- 4 days ago: 1 completed
- 3 days ago: 1 completed
- 1 day ago: 2 overdue

**Present:**
- Today: 3 tasks (1 at-risk, 1 overdue, 1 in-progress)

**Future:**
- +1 day: 4 tasks
- +2 days: 4 tasks
- +3 days: 3 tasks
- +4 days: 2 tasks
- +5 days: 2 tasks
- +6 days: 2 tasks
- +7 days: 1 task
- +8 days: 1 task
- +10 days: 1 task
- +13 days: 1 task

## Default View (Last 7 Days)

When users first open the Task Management page, they'll see:
- **23 pending tasks** across all categories
- **3 overdue tasks** highlighted in red
- **5 entities** in the Entity Task Summary:
  - Dr. Michael Anderson (Provider-level)
  - Sarah Johnson (Patient-level)
  - Michael Chen (Patient-level)
  - Emily Rodriguez (Patient-level)
  - Multiple system/community entities

## Testing Scenarios Covered

✅ **All 4 task categories** represented with proper fields
✅ **Multiple patients** for drill-down testing
✅ **Provider tasks** with credentials and organizations
✅ **System tasks** with locations and contacts
✅ **Community tasks** with resource details
✅ **Overdue tasks** for alert testing
✅ **Blockers** on some tasks
✅ **Various statuses** for Kanban board
✅ **Different priorities** for filtering
✅ **Multiple health dimensions**
✅ **Time range spanning** 14 days (past and future)

## Schema Compliance

### Patient-Level Fields Used:
- ✅ patient_id (UUID)
- ✅ patient_name
- ✅ patient_contact

### Provider-Level Fields Used:
- ✅ provider_name
- ✅ provider_credential
- ✅ provider_email
- ✅ provider_specialty
- ✅ provider_license_id
- ✅ provider_organization

### System-Level Fields Used:
- ✅ system_name
- ✅ system_location
- ✅ system_contact

### Community-Level Fields Used:
- ✅ community_resource_name
- ✅ community_location
- ✅ community_email
- ✅ community_contact

## How to Apply

The migration will be automatically applied when you:
1. Start the Supabase local development environment, or
2. Push migrations to your hosted Supabase instance

You can also manually apply it using:
```bash
supabase migration up
```

## Summary

The mock data provides a **comprehensive, realistic dataset** for testing all task management features:
- ✅ All 4 task categories fully represented
- ✅ Schema-compliant with proper category-specific fields
- ✅ Realistic provider credentials and organizations
- ✅ Multiple patients with contact information
- ✅ System and community resources with locations
- ✅ Various task statuses, priorities, and timelines
- ✅ Tasks spanning past, present, and future
- ✅ Overdue tasks for testing alerts
- ✅ Blockers on relevant tasks
- ✅ 35 total tasks for robust testing

This data enables full testing of:
- Aggregate view with time filters
- Entity summaries (all categories)
- Drill-down to specific entities
- Search and filter functionality
- Status updates
- Overdue task highlighting
- Category badges and colors
- Entity-specific details display
