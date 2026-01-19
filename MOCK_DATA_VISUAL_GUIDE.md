# Mock Task Data - Visual Guide

## 📊 Data Overview

```
Total Tasks: 35

┌─────────────────────────────────────────────────┐
│  Category Distribution                          │
├─────────────────────────────────────────────────┤
│  🔵 Patient-level:    12 tasks (34%)           │
│  🔵 Provider-level:    7 tasks (20%)           │
│  🟣 System-level:     10 tasks (29%)           │
│  🟢 Community-level:   6 tasks (17%)           │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Status Distribution                            │
├─────────────────────────────────────────────────┤
│  ⏰ Pending:          23 tasks (66%)           │
│  🔄 In-progress:       3 tasks (9%)            │
│  📅 Scheduled:         4 tasks (11%)           │
│  ✅ Completed:         5 tasks (14%)           │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Priority Distribution                          │
├─────────────────────────────────────────────────┤
│  🔴 High:             14 tasks (40%)           │
│  🟡 Medium:           17 tasks (49%)           │
│  🟢 Low:               4 tasks (11%)           │
└─────────────────────────────────────────────────┘
```

## 👥 Patient-Level Tasks (12)

### Sarah Johnson
```
Patient ID: 550e8400-e29b-41d4-a716-446655440001
Contact: (555) 234-5678

┌──────────────────────────────────────────────────────┐
│ 🔴 Follow-up Depression Assessment                   │
│    Due: +2 days | Priority: High | Status: Pending   │
│    Assignee: Dr. Michael Anderson                    │
│    Dimension: Mental Health                          │
├──────────────────────────────────────────────────────┤
│ 🔴 Sleep Study Results Review                        │
│    Due: +1 day | Priority: High | Status: Pending    │
│    Assignee: Dr. Michael Anderson                    │
│    Dimension: Sleep                                  │
├──────────────────────────────────────────────────────┤
│ 🔴 Medication Side Effects Check                     │
│    Due: Today | Priority: High | Status: Pending     │
│    Assignee: Dr. Michael Anderson | ⚠️ AT RISK       │
│    Dimension: Medical                                │
└──────────────────────────────────────────────────────┘
```

### Michael Chen
```
Patient ID: 550e8400-e29b-41d4-a716-446655440002
Contact: (555) 345-6789

┌──────────────────────────────────────────────────────┐
│ 🟡 Nutrition Counseling Session                      │
│    Due: +5 days | Priority: Medium | Status: Pending │
│    Assignee: Jennifer Liu, RD                        │
│    Dimension: Diet                                   │
├──────────────────────────────────────────────────────┤
│ 🟡 Lab Results Follow-up                             │
│    Due: +1 day | Priority: Medium | Status: Pending  │
│    Assignee: Dr. Sarah Martinez                      │
│    Dimension: Medical                                │
└──────────────────────────────────────────────────────┘
```

### Emily Rodriguez
```
Patient ID: 550e8400-e29b-41d4-a716-446655440003
Contact: (555) 456-7890

┌──────────────────────────────────────────────────────┐
│ 🟡 Physical Therapy Follow-up                        │
│    Due: +3 days | Priority: Medium | Status: Pending │
│    Assignee: James Wilson, PT                        │
│    Dimension: Physical                               │
├──────────────────────────────────────────────────────┤
│ 🟢 Care Plan Review                                  │
│    Due: +1 day | Priority: Low | Status: In-Progress │
│    Assignee: Dr. Michael Anderson                    │
│    Dimension: Burden                                 │
├──────────────────────────────────────────────────────┤
│ 🟡 Exercise Program Review                           │
│    Due: +2 days | Priority: Medium | Status: Pending │
│    Assignee: James Wilson, PT                        │
│    Dimension: Physical                               │
└──────────────────────────────────────────────────────┘
```

### Robert Williams
```
Patient ID: 550e8400-e29b-41d4-a716-446655440004
Contact: (555) 567-8901

┌──────────────────────────────────────────────────────┐
│ ✅ Initial Assessment Consultation                   │
│    Due: -3 days | Priority: High | Status: Completed │
│    Assignee: Dr. Michael Anderson                    │
│    Dimension: Mental Health                          │
└──────────────────────────────────────────────────────┘
```

### David Martinez
```
Patient ID: 550e8400-e29b-41d4-a716-446655440005
Contact: (555) 678-9012

┌──────────────────────────────────────────────────────┐
│ 🟡 Anxiety Management Session                        │
│    Due: +2 days | Priority: Medium | Status: Pending │
│    Assignee: Lisa Chen, LCSW                         │
│    Dimension: Mental Health                          │
├──────────────────────────────────────────────────────┤
│ 🟢 Therapy Session Scheduling                        │
│    Due: +4 days | Priority: Low | Status: Pending    │
│    Assignee: Admin Staff                             │
│    Dimension: Mental Health                          │
└──────────────────────────────────────────────────────┘
```

## 👨‍⚕️ Provider-Level Tasks (7)

### Dr. Michael Anderson
```
Credential: MD, Board Certified Psychiatrist
License: CA-PSY-12345
Organization: Mental Health Integrated Care Clinic
Email: manderson@mentalhealthclinic.org
Specialty: Psychiatry

┌──────────────────────────────────────────────────────┐
│ 🔴 Review High-Risk Patient Panel | ⚠️ OVERDUE      │
│    Due: -1 day | Priority: High | Status: Pending    │
│    Weekly review of high-risk patients               │
│    Dimension: Burden                                 │
├──────────────────────────────────────────────────────┤
│ 🔴 Peer Consultation: Complex Case | ⚠️ AT RISK     │
│    Due: Today | Priority: High | Status: Pending     │
│    Treatment-resistant depression case               │
│    Dimension: Mental Health                          │
├──────────────────────────────────────────────────────┤
│ 🟡 Complete CME Training Module                      │
│    Due: +3 days | Priority: Medium | Scheduled       │
│    APA-approved course on depression management      │
│    Dimension: Mental Health                          │
└──────────────────────────────────────────────────────┘
```

### Other Provider Teams
```
┌──────────────────────────────────────────────────────┐
│ Quality Assurance Department                         │
│ License: QA-DEPT-001                                 │
│ 🔴 Quality Metrics Review                            │
│    Due: +2 days | Priority: High | Status: Pending   │
├──────────────────────────────────────────────────────┤
│ Network Development Team                             │
│ License: NET-DEV-001                                 │
│ 🟡 Provider Network Expansion                        │
│    Due: +13 days | Priority: Medium | Scheduled      │
├──────────────────────────────────────────────────────┤
│ Care Team                                            │
│ License: CARE-TEAM-001                               │
│ ✅ Monthly Team Meeting                              │
│    Due: -5 days | Priority: Medium | Completed       │
├──────────────────────────────────────────────────────┤
│ Dr. Sarah Martinez                                   │
│ License: CA-IM-67890                                 │
│ 🟡 Clinical Documentation Training                   │
│    Due: +5 days | Priority: Medium | Status: Pending │
└──────────────────────────────────────────────────────┘
```

## 🏢 System-Level Tasks (10)

### Referral and Care Coordination
```
┌──────────────────────────────────────────────────────┐
│ Mental Health Referral Network                       │
│ Location: Building A, Floor 2                        │
│ 🔴 Psychiatric Referral Processing | ⚠️ OVERDUE     │
│    Due: -1 day | Patient: Sarah Johnson             │
├──────────────────────────────────────────────────────┤
│ Pain Management Services                             │
│ Location: Medical Plaza, Suite 300                   │
│ 🔴 Pain Management Consultation Referral             │
│    Due: +6 days | Patient: Robert Williams           │
│    Status: In-Progress                               │
├──────────────────────────────────────────────────────┤
│ Insurance Processing Center                          │
│ Location: Administrative Building, Floor 1           │
│ ✅ Insurance Authorization Processed                 │
│    Due: -4 days | Patient: Robert Williams           │
│    Status: Completed                                 │
├──────────────────────────────────────────────────────┤
│ Care Coordination Services                           │
│ Location: Building B, Floor 3                        │
│ 🟡 Specialist Care Coordination                      │
│    Due: +3 days | Patient: Emily Rodriguez           │
└──────────────────────────────────────────────────────┘
```

### System Operations
```
┌──────────────────────────────────────────────────────┐
│ Electronic Health Records System                     │
│ Location: Data Center                                │
│ Contact: itsupport@mentalhealthclinic.org            │
│ 🔴 EHR System Update Rollout                         │
│    Due: +7 days | Priority: High | Status: Pending   │
│    ⚠️ Blockers:                                       │
│      - Requires downtime window                      │
│      - Staff training needed                         │
├──────────────────────────────────────────────────────┤
│ Pharmacy Management System                           │
│ Location: Pharmacy Department, Building A            │
│ Contact: pharmacy@mentalhealthclinic.org             │
│ 🟡 Medication Reconciliation Audit                   │
│    Due: +10 days | Priority: Medium | Scheduled      │
└──────────────────────────────────────────────────────┘
```

## 🏘️ Community-Level Tasks (6)

### Community Resources
```
┌──────────────────────────────────────────────────────┐
│ Community Pharmacy Services                          │
│ Location: Main Street Pharmacy, 123 Main St          │
│ Contact: (555) 777-8888                              │
│ 🟡 Medication Adherence Community Outreach           │
│    Due: Today | Patient: Michael Chen                │
│    Status: In-Progress | ⚠️ OVERDUE                  │
│    ⚠️ Blocker: Patient not responding to calls       │
├──────────────────────────────────────────────────────┤
│ Community Health Initiative                          │
│ Location: Downtown Community Center, 456 Center St   │
│ Email: events@communityhealthinitiative.org          │
│ 🟢 Community Health Fair Planning                    │
│    Due: +8 days | Priority: Low | Status: Pending    │
├──────────────────────────────────────────────────────┤
│ Mental Health Support Groups                         │
│ Location: Downtown Community Center, Room 201        │
│ Email: support@mentalhealthsupport.org               │
│ 🟡 Support Group Referral and Introduction           │
│    Due: +4 days | Patient: Sarah Johnson             │
│    Status: Scheduled                                 │
├──────────────────────────────────────────────────────┤
│ Senior Wellness Program                              │
│ Location: Community Rec Center, 789 Park Ave         │
│ Email: wellness@seniorcenter.org                     │
│ 🟡 Exercise Program Enrollment                       │
│    Due: +6 days | Patient: Emily Rodriguez           │
│    Status: Pending                                   │
├──────────────────────────────────────────────────────┤
│ Community Food Bank                                  │
│ Location: Food Distribution Center, 321 Oak St       │
│ Email: help@communityfoodbank.org                    │
│ 🔴 Food Assistance Program Referral                  │
│    Due: +2 days | Patient: Michael Chen              │
│    Status: Pending                                   │
├──────────────────────────────────────────────────────┤
│ Housing Assistance Program                           │
│ Location: Social Services Building, 555 Main St      │
│ Email: housing@socialservices.gov                    │
│ ✅ Housing Assistance Coordination                   │
│    Due: -7 days | Patient: David Martinez            │
│    Status: Completed                                 │
└──────────────────────────────────────────────────────┘
```

## 📅 Timeline View

```
Past                    Present                   Future
│                          │                          │
├─────────┬────────┬───────┼──────┬──────┬──────┬─────┤
-7d  -5d  -4d  -3d  -1d   Today  +1d  +2d  +3d  +4d  ...

-7d: 1 completed (Housing Assistance)
-5d: 1 completed (Monthly Team Meeting)
-4d: 1 completed (Insurance Authorization)
-3d: 1 completed (Initial Assessment)
-1d: 2 overdue (High-Risk Panel, Psychiatric Referral)
Today: 3 tasks (2 pending, 1 overdue with blocker)
+1d: 4 tasks (Care Plan, Sleep Study, Med Check, Labs)
+2d: 4 tasks (Depression Assessment, Anxiety, Exercise, Food)
+3d: 3 tasks (Physical Therapy, CME, Specialist Coord)
+4d: 2 tasks (Therapy Scheduling, Support Group)
+5d: 2 tasks (Nutrition, Documentation Training)
```

## 🎯 Default View Test (Last 7 Days)

What you'll see when you first open Tasks:
```
┌────────────────────────────────────────────────────────┐
│ Entity Task Summary (5 entities)                       │
├────────────────────────────────────────────────────────┤
│ 🔵 Dr. Michael Anderson [provider-level]              │
│    3 tasks | Psychiatry                                │
│    2 Pending | 0 Overdue | 1 Scheduled | 2 High ⚠️    │
├────────────────────────────────────────────────────────┤
│ 🔵 Sarah Johnson [patient-level]                      │
│    3 tasks | (555) 234-5678                            │
│    3 Pending | 0 Overdue | 0 Completed | 3 High ⚠️    │
├────────────────────────────────────────────────────────┤
│ 🔵 Michael Chen [patient-level]                       │
│    2 tasks | (555) 345-6789                            │
│    2 Pending | 0 Overdue | 0 Completed                │
├────────────────────────────────────────────────────────┤
│ 🔵 Emily Rodriguez [patient-level]                    │
│    3 tasks | (555) 456-7890                            │
│    2 Pending | 0 Overdue | 1 In-Progress              │
└────────────────────────────────────────────────────────┘

23 Pending Tasks showing in table...
```

## 🔑 Key Features Demonstrated

✅ **Category Diversity**: All 4 levels represented
✅ **Overdue Tasks**: 3 tasks for alert testing
✅ **Blockers**: 2 tasks with blockers
✅ **Time Range**: Tasks from -7 to +13 days
✅ **Provider Credentials**: Full licensing info
✅ **Contact Information**: Phones, emails, addresses
✅ **Patient Relationships**: Multiple patients with tasks
✅ **System Locations**: Building and room details
✅ **Community Resources**: Complete contact details
✅ **Status Variety**: All statuses represented
✅ **Priority Mix**: High/Medium/Low distribution
✅ **Health Dimensions**: 10+ dimensions covered

## 💡 Testing Tips

1. **Open Tasks page** → Should show 23 pending tasks by default
2. **Check Entity Summary** → Should see 5+ entities
3. **Click on Dr. Anderson** → Should drill down to 3 provider tasks
4. **Click on Sarah Johnson** → Should drill down to 3 patient tasks
5. **Change time filter to 2 weeks** → Should see all 35 tasks
6. **Search for "medication"** → Should find 3+ matching tasks
7. **Look for red rows** → Should see 3 overdue tasks highlighted
8. **Check category badges** → Should see color-coded labels
9. **View entity details** → Should see organizations, locations, contacts
10. **Test status updates** → Click dropdown to change task status

Enjoy exploring the comprehensive mock data! 🎉
