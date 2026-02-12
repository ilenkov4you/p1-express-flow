

# P1.express Task Manager — Implementation Plan

## Overview
A minimalist task manager following the OMIMO P1.express methodology. Cloud-based with Supabase, bilingual (EN/RU), light/dark themes, clean minimal design.

---

## Phase 1: Foundation & Data Layer

### Supabase Setup
- **Tasks table**: id, title, status (doing/postponed/finished/canceled), date, is_recurring, notes, recurrence_rule, history (jsonb), created_at, updated_at, user_id
- **Goals table**: id, title, description, status (open/closed), created_at, updated_at, closed_at, user_id
- **Authentication**: Email sign-up/login with user profiles
- **Row-level security**: Users see only their own data

### Internationalization
- Language switcher (EN/RU) stored in user preferences
- All UI strings externalized for easy translation

### Theme
- Light/dark mode with system preference detection and manual toggle

---

## Phase 2: Core Task Management

### Task Creation (D2 Quick Capture)
- Persistent quick-input field at top of the Today screen
- Type title → press Enter → task created as **postponed** with date=today
- Stays on current screen after creation, ready for next capture

### Task Editing
- Inline edit for title and notes
- Status changes via action buttons only (not dropdowns) to preserve methodology logic

### State Machine (4 statuses)
- **postponed → doing** ("Do today" button)
- **doing → finished / canceled / postponed**
- **postponed → finished / canceled**
- **finished/canceled**: terminal — no going back in MVP
- Every transition logged to history array with timestamp, from/to status, and date

### Postpone Mechanism
- Date picker + quick buttons: Tomorrow, +3 days, Next week, Next month
- Bulk postpone for multiple selected tasks

---

## Phase 3: Daily Workflow Screens

### Today Screen (D1 + D2)
- Shows tasks with status **doing** and date=today
- Each task has action buttons: Finish, Cancel, Postpone
- Quick capture input always visible at top
- Clean, focused — only what matters right now

### Plan Tomorrow (D4)
- Shown in the evening to plan the next day
- Lists: unfinished doing tasks from today + tasks already set for tomorrow
- Bulk actions: move to tomorrow, postpone further, cancel
- Task counter showing "X tasks planned for tomorrow"

### Lottery (D3)
- Button on Today screen
- Randomly picks 1 postponed non-recurring task
- Shows it with actions: Do today, Postpone, Cancel

---

## Phase 4: Recurring Tasks

### Creation
- Toggle "Recurring" when creating a task
- Set rule: daily / weekly / monthly / yearly + interval (every N periods)

### Completion Logic
- Finishing a recurring task creates a separate **finished** task record (as evidence)
- The original recurring task auto-advances to the next occurrence date and stays active
- Recurring tasks never disappear from the system

---

## Phase 5: Reviews

### Weekly Review (C1)
- Summary of finished/canceled tasks from last 7 days
- Text area for notes: "What drained energy? What got in the way?"
- Quick-create button to spawn fix-it tasks directly from the review

### Monthly Review (B1)
- Summary of finished/canceled tasks from last 30 days
- Notes field for trends and reflections
- List of open goals with inline progress notes

### Yearly: Goals (A1)
- Create, edit, close goals
- Simple list view with open/closed filter

### Yearly: Cleanup Postponed (A2)
- Card-by-card view of all postponed tasks
- Quick actions per card: Keep (keep as-is), Cancel, Reschedule (pick new date)
- Designed for speed — "20-second rule" per task

---

## Phase 6: Board View & Navigation

### Board Screen
- Tasks grouped by status columns: Doing, Postponed, Finished, Canceled
- Within each column, grouped by date
- Sorted by updatedAt within date groups

### Navigation (5 sections)
1. **Today** — daily workflow hub
2. **Board** — full task overview
3. **Plan Tomorrow** — D4 planning
4. **Reviews** — Weekly / Monthly / Yearly sub-pages
5. **Settings** — export/import, theme, language, about (OMIMO CC BY attribution)

---

## Phase 7: Export/Import & Polish

### Export
- JSON file with version, exportedAt, tasks[], goals[]

### Import
- Validate version, merge by ID, "last updatedAt wins" conflict resolution

### Attribution
- "About" section crediting OMIMO P1.express (CC BY) with link to methodology

