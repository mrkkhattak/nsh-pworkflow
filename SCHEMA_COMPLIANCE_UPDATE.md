# Schema Compliance Update - Task Aggregate View

## Overview
Updated the Task Aggregate View to be fully compliant with all task level schemas defined in the database, including provider-level, patient-level, system-level, and community-level tasks.

## Changes Made

### 1. Updated Task Interface (`lib/task-service.ts`)

**Added all category-specific fields:**

```typescript
export interface Task {
  // Core fields
  id, category, status, title, description, priority, due_date, assignee, dimension, sla_status, estimated_time, blockers, created_at, updated_at

  // Provider Level fields
  provider_name, provider_credential, provider_email, provider_specialty, provider_license_id, provider_organization, provider_address, provider_zip, provider_state, provider_country

  // Patient Level fields
  patient_id, patient_name, patient_website, patient_contact

  // Community Level fields
  community_resource_name, community_website, community_email, community_location, community_contact

  // System Level fields
  system_name, system_website, system_contact, system_location
}
```

### 2. New Entity Summary Interface

```typescript
export interface EntityTaskSummary {
  entityId: string
  entityName: string
  entityType: TaskCategory  // provider-level, patient-level, system-level, community-level
  totalTasks: number
  pendingTasks: number
  completedTasks: number
  overdueTasks: number
  highPriorityTasks: number
  entityDetails?: string
}
```

### 3. New Helper Functions

**`getTaskEntityId(task)`**
- Returns the appropriate ID field based on task category
- Provider: `provider_license_id` or `provider_email` or task ID
- Patient: `patient_id` or task ID
- System: `system_name` or task ID
- Community: `community_resource_name` or task ID

**`getTaskEntityName(task)`**
- Returns the appropriate name field based on task category
- Provider: `provider_name`
- Patient: `patient_name`
- System: `system_name`
- Community: `community_resource_name`

**`getTaskEntityDetails(task)`**
- Returns secondary information based on category
- Provider: `provider_organization` or `provider_specialty`
- Patient: `patient_contact`
- System: `system_location`
- Community: `community_location`

**`fetchEntityTaskSummaries(timeFilter)`**
- Fetches task summaries for ALL entity types (not just patients)
- Groups tasks by entity ID
- Returns summaries sorted by pending task count

**`fetchEntityTasks(entityId, timeFilter)`**
- Fetches tasks for a specific entity (any category)
- Uses helper function to match entity ID across different fields

### 4. Updated Aggregate View Component

**State Changes:**
- Renamed `patientSummaries` → `entitySummaries`
- Renamed `selectedPatient` → `selectedEntity`
- Added `selectedEntityName` for display

**UI Updates:**
- Changed "Patient Task Summary" → "Entity Task Summary"
- Added category badges (color-coded by task level)
  - Provider-level: Teal
  - Patient-level: Blue
  - System-level: Purple
  - Community-level: Green
- Shows entity details (organization, specialty, location, etc.)
- "Back to All Patients" → "Back to All Entities"
- Task table now shows "Entity" column instead of "Patient" column
- Displays appropriate entity name and details for all categories

**Category Badge Helper:**
```typescript
getCategoryColor(category) {
  'provider-level': 'bg-teal-100 text-teal-800'
  'patient-level': 'bg-blue-100 text-blue-800'
  'system-level': 'bg-purple-100 text-purple-800'
  'community-level': 'bg-green-100 text-green-800'
}
```

### 5. Enhanced Search Functionality
- Search now works across all entity types
- Searches by task title, entity name (any category), and description

## Visual Changes

### Entity Summary Row (New)
```
┌────────────────────────────────────────────────────────────────┐
│ 👤 Dr. Sarah Martinez  [provider-level]                       │
│    15 total tasks • Cardiology Department                      │
│    [12 Pending] [3 Overdue] [8 Completed] [🔴 2 High]        │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ 👤 John Smith  [patient-level]                                │
│    8 total tasks • (555) 123-4567                             │
│    [5 Pending] [1 Overdue] [3 Completed] [🔴 1 High]          │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ 🏢 Electronic Health Records  [system-level]                  │
│    10 total tasks • Building A, Floor 3                        │
│    [7 Pending] [2 Overdue] [5 Completed]                       │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ 🏘️ Community Health Center  [community-level]                │
│    6 total tasks • Downtown District                           │
│    [4 Pending] [0 Overdue] [2 Completed]                       │
└────────────────────────────────────────────────────────────────┘
```

### Task Table Entity Column
```
┌─────────────────────────────────────────────────────┐
│ Entity                                               │
├─────────────────────────────────────────────────────┤
│ 👤 Dr. Sarah Martinez                               │
│    Cardiology Department                             │
├─────────────────────────────────────────────────────┤
│ 👤 John Smith                                       │
│    (555) 123-4567                                    │
├─────────────────────────────────────────────────────┤
│ 🏢 Electronic Health Records                        │
│    Building A, Floor 3                               │
└─────────────────────────────────────────────────────┘
```

## Database Schema Compliance

### Provider-Level Tasks
**Fields Used:**
- `provider_name` - Display name
- `provider_license_id` - Primary identifier
- `provider_email` - Backup identifier
- `provider_organization` - Entity detail (e.g., "Mayo Clinic")
- `provider_specialty` - Entity detail (e.g., "Cardiology")

### Patient-Level Tasks
**Fields Used:**
- `patient_id` - Primary identifier
- `patient_name` - Display name
- `patient_contact` - Entity detail (e.g., phone/email)

### System-Level Tasks
**Fields Used:**
- `system_name` - Primary identifier and display name
- `system_location` - Entity detail (e.g., "Building A, Floor 3")
- `system_contact` - Contact information

### Community-Level Tasks
**Fields Used:**
- `community_resource_name` - Primary identifier and display name
- `community_location` - Entity detail (e.g., "Downtown District")
- `community_contact` - Contact information
- `community_email` - Email address

## Workflow Examples

### View Provider Tasks
1. Go to Tasks page (Aggregate View)
2. See all entities including providers
3. Find "Dr. Sarah Martinez" with [provider-level] badge
4. Click to drill down
5. View shows "Tasks for Dr. Sarah Martinez"
6. All tasks for this provider displayed
7. Shows organization/specialty info

### View System Tasks
1. Go to Tasks page (Aggregate View)
2. See "Electronic Health Records" with [system-level] badge
3. Click entity row
4. Drill down to system-specific tasks
5. Location info displayed (e.g., "Building A, Floor 3")

### View Community Tasks
1. Go to Tasks page (Aggregate View)
2. See "Community Health Center" with [community-level] badge
3. Click to drill down
4. View community resource tasks
5. Location and contact info shown

## Benefits

1. **Full Schema Compliance**: All task categories now properly supported
2. **Unified Interface**: Same workflow for all entity types
3. **Better Organization**: Color-coded badges identify task levels at a glance
4. **More Context**: Entity details (organization, location, contact) displayed
5. **Flexible Drill-Down**: Works for any entity type, not just patients
6. **Accurate Search**: Searches across all entity fields
7. **Database Alignment**: Interface matches database schema exactly

## Backward Compatibility

- `fetchPatientTasks()` still works for patient-level tasks
- `fetchPatientTaskSummaries()` still available for patient-only views
- New `fetchEntityTasks()` and `fetchEntityTaskSummaries()` handle all categories
- Existing Kanban Board view unaffected

## Testing Checklist

✅ Provider-level tasks display correctly
✅ Patient-level tasks display correctly
✅ System-level tasks display correctly
✅ Community-level tasks display correctly
✅ Entity summaries show all categories
✅ Drill-down works for all entity types
✅ Category badges display with correct colors
✅ Entity details (organization, location, contact) shown
✅ Search works across all entity names
✅ Time filters apply to all categories
✅ Build succeeds without errors

## Files Modified

**Updated:**
- `lib/task-service.ts` - Added category-specific fields to Task interface, new helper functions
- `components/task-aggregate-view.tsx` - Updated to use entity summaries instead of patient-only

**Created:**
- `SCHEMA_COMPLIANCE_UPDATE.md` - This documentation

## Summary

The Task Aggregate View is now fully compliant with the database schema and supports all four task levels:
1. ✅ Provider-level (providers, physicians, care team members)
2. ✅ Patient-level (individual patients)
3. ✅ System-level (administrative systems, EHR, etc.)
4. ✅ Community-level (community resources, programs)

All entity types can be viewed, filtered, searched, and drilled down into using the same unified interface with appropriate category-specific information displayed throughout.
