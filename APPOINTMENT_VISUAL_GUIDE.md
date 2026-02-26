# Appointment Feature Visual Guide

## What You'll See on the Dashboard

### 1. My Schedule Card (Appears after High Priority Alerts)

```
┌─────────────────────────────────────────────────────────────┐
│  📅 My Schedule                        [View Full Calendar] │
│  4 appointments today • Next: 9:00 AM - Sarah Johnson       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Today's Appointments                              4 scheduled│
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  9:00 AM    ║  👤  Sarah Johnson                       │ │
│  │  60 min     ║      Major Depression                    │ │
│  │             ║      ✅ Confirmed  📋 Follow-up          │ │
│  │             ║      📍 Office  🔴 High Priority          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  10:30 AM   ║  👤  Michael Chen                        │ │
│  │  45 min     ║      Anxiety                             │ │
│  │             ║      ✅ Confirmed  📋 Initial Consult    │ │
│  │             ║      📹 Telehealth                         │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  [More appointments...]                                      │
│                                                              │
│  This Week Overview                         [▼ Expand]      │
│                                                              │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                   │
│  │Today │  │ Tue  │  │ Wed  │  │ Thu  │  ...               │
│  │Jan 29│  │Jan 30│  │Jan 31│  │Feb 1 │                    │
│  │  4   │  │  2   │  │  1   │  │  1   │                    │
│  │ 👤👤  │  │ 👤   │  │ 👤   │  │ 👤   │                    │
│  └──────┘  └──────┘  └──────┘  └──────┘                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 2. Appointment Detail Dialog (Opens when clicking any appointment)

```
╔═══════════════════════════════════════════════════════════════╗
║  Follow-up                                                    ║
║  ✅ confirmed  🔴 high priority  📹 Telehealth                ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  📅 Monday, January 29, 2024  🕐 9:00 AM (60 min)           ║
║                                                               ║
║  ─────────────────────────────────────────────────────────   ║
║                                                               ║
║  PATIENT INFORMATION           │  APPOINTMENT DETAILS        ║
║                                │                             ║
║  👤 [Avatar]                   │  📹 Telehealth Video Call  ║
║  Sarah Johnson                 │  Video link available       ║
║  45y • Major Depression        │  15 min before appt         ║
║  Health Index: 72 🟢           │                             ║
║                                │  Reason for Visit:          ║
║  📞 (555) 123-4567             │  Depression follow-up,      ║
║  ✉️ patient@email.com          │  medication adjustment      ║
║                                │                             ║
║  [View Full Patient Chart]     │  Provider Notes:            ║
║                                │  Regular follow-up visit    ║
║  ─────────────────────────     │                             ║
║                                │  Last Appointment:          ║
║  CLINICAL SUMMARY              │  Jan 15, 2024              ║
║                                │                             ║
║  PHQ-9 Score:         18       │  ─────────────────────     ║
║  Risk Level:    🟡 Moderate    │                             ║
║  Open Tasks:           3       │  COMMUNICATION HISTORY      ║
║  Active Goals:         1       │                             ║
║                                │  ✅ Request Received        ║
║  Critical Flags:               │     3 days ago              ║
║  Strengths: 2  Moderate: 1     │                             ║
║  Critical: 0                   │  ✅ Email Confirmation      ║
║                                │     2 days ago              ║
║                                │                             ║
║                                │  ✅ Calendar Invite         ║
║                                │     2 days ago              ║
║                                │                             ║
║                                │  ✅ 24-Hour Reminder        ║
║                                │     Yesterday               ║
║                                │                             ║
║  ─────────────────────────────────────────────────────────   ║
║                                                               ║
║  [✅ Start Appointment]  [📹 Join Telehealth Call]           ║
║  [✉️ Send Reminder]  [✏️ Reschedule]  [📝 Add Notes]        ║
║  [✅ Mark Completed]  [❌ Cancel Appointment]                 ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

## Color Coding System

### Appointment Status (Left Border)
- **Green Border**: Confirmed appointments
- **Yellow Border**: Pending confirmation
- **Grey Border**: Completed/past appointments
- **Red Border**: Cancelled appointments

### Badge Colors
- **Green (Confirmed)**: Default badge style
- **Yellow (Pending)**: Secondary badge style
- **Red (High Priority)**: Destructive badge style
- **Blue (Telehealth)**: Custom blue badge with video icon

### Risk Levels
- **Critical/High Risk**: Red badge
- **Moderate Risk**: Yellow/secondary badge
- **Low Risk/Optimal**: Green/outline badge

## Interactive Elements

### Clickable Items:
1. ✅ **Any appointment card** → Opens detailed dialog
2. ✅ **Patient avatar** → Opens detailed dialog
3. ✅ **Week day cards** → Expands to show all appointments for that day
4. ✅ **View Full Calendar** → Opens calendar view (future)
5. ✅ **View Full Patient Chart** → Opens patient detail view (future)
6. ✅ **Action buttons** → Execute respective actions

### Hover Effects:
- Appointment cards: Shadow increases, slight lift effect
- Week day cards: Border color intensifies
- Buttons: Color darkens, cursor changes to pointer

## Empty States

### No Appointments Today:
```
┌──────────────────────────────────────────┐
│                                          │
│         📅                               │
│                                          │
│    No appointments scheduled for today   │
│    Time to catch up on patient notes!    │
│                                          │
└──────────────────────────────────────────┘
```

## Responsive Design

### Desktop (1024px+):
- 4-column week view grid
- Side-by-side layout in detail dialog
- Full appointment cards with all details

### Tablet (768px - 1023px):
- 2-column week view grid
- Stacked layout in detail dialog
- Condensed appointment cards

### Mobile (< 768px):
- Single column week view
- Fully stacked detail dialog
- Minimal appointment card info with expand option

## Smart Features

### Time-Based Actions:
- **"Start Appointment"** button only shows when within 15 minutes of appointment time
- **"Join Telehealth Call"** button only shows for telehealth appointments
- **"Send Reminder"** button disabled if reminder sent in last 24 hours
- Past appointments automatically show as completed with grey styling

### Status-Based Actions:
- **Pending appointments** → Show "Confirm Appointment" button
- **Confirmed appointments** → Show full action menu
- **Completed appointments** → Show limited actions (view notes, reschedule)
- **Cancelled appointments** → Show limited actions (reschedule)

## User Flows

### Primary Flow: View Appointment Details
1. Provider opens dashboard
2. Sees "My Schedule" card with today's appointments
3. Clicks on any appointment card
4. Detail dialog opens showing comprehensive information
5. Reviews patient context and appointment details
6. Takes action (start, join call, send reminder, etc.)
7. Dialog closes

### Secondary Flow: Week Planning
1. Provider opens dashboard
2. Scrolls to "This Week Overview" section
3. Clicks "Expand" to see all days
4. Reviews appointment distribution across the week
5. Clicks on specific day to see more details
6. Plans workflow for the week

### Quick Action Flow: Join Telehealth
1. Provider sees telehealth appointment starting soon
2. Blue video icon indicates telehealth appointment
3. Clicks appointment card
4. Dialog shows "Join Telehealth Call" button prominently
5. Clicks button to join video call
6. Launches telehealth platform

## Data Display Hierarchy

### Primary Information (Always Visible):
1. Patient name and avatar
2. Appointment time
3. Appointment type
4. Status badge

### Secondary Information (Visible on card):
5. Patient condition
6. Location (office/telehealth)
7. Duration
8. Priority level (if high)

### Tertiary Information (In detail dialog):
9. Patient age, contact info
10. Health index, risk level
11. Clinical summary (PHQ-9, tasks, goals, flags)
12. Appointment reason and notes
13. Communication history
14. Last appointment date

## Performance Features

- Lazy loading of patient data
- Optimized rendering with React keys
- Smooth animations with CSS transitions
- Responsive images with proper sizing
- Minimal re-renders with proper state management

## Accessibility Features

- Semantic HTML structure
- Proper heading hierarchy
- ARIA labels on interactive elements
- Keyboard navigation support
- High contrast color schemes
- Focus indicators on all interactive elements
- Screen reader friendly badge text
