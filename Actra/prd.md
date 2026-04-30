🧠 PRD: AI Daily Learning Companion





📌 Product Overview

💡 Problem

People want to learn skills (coding, fitness, etc.) but:

don’t know what to do daily
feel overwhelmed by long plans
fail to stay consistent
🎯 Solution

A mobile app that:

converts a goal into daily actionable tasks
adapts based on user progress
reminds users at the right time
🧭 One-line Product Vision

“Tell me what to do today — and keep me consistent.”





👤 Target Users

Students learning new skills (coding, design)
Developers upskilling (React, DSA)
Anyone trying to build daily habits
3. 🚀 Core User Flow
User enters goal → sets time → chooses schedule
↓
AI generates today’s tasks
↓
User gets notification
↓
User completes / skips
↓
Next day → new tasks generated (based on progress)
4. 🧩 Core Features (MVP)
4.1 🎯 Goal Setup

User inputs:

Topic (e.g., “Learn React”)
Daily time (e.g., 60 mins)
Preferred time:
Morning
Midday
Evening
4.2 🤖 AI Task Generation

System generates:

3–4 small actionable tasks per day

Example:

Watch hooks video
Build a component
Practice props
4.3 📅 Daily Task Screen
Shows only today’s tasks
Each task:
title
checkbox (complete)
4.4 🔔 Smart Notifications
Sent at preferred time

Example:

“Start your React practice 💡”

4.5 ✅ Task Tracking
Mark tasks:
completed
skipped
4.6 🔁 Daily Task Regeneration
Tasks generated daily automatically
Works even if user doesn’t open app
5. 🤖 AI Behavior
Input to AI:
topic
daily time
previous progress
Output:
3–4 structured tasks
realistic within time
Constraints:
avoid repetition
increase difficulty gradually
6. ⚙️ System Architecture
📱 Frontend
Expo React Native
🧠 Backend
Node.js API
Prisma ORM
PostgreSQL
🤖 AI
OpenAI / Gemini
🔔 Notifications
Expo Push Service
⏰ Scheduling
Option A (MVP)
node-cron
Option B (future)
BullMQ
7. 🗄️ Database Schema
User
User {
  id
  topic
  dailyTime
  preferredTime
  pushToken
}
Task
Task {
  id
  title
  date
  startTime
  completed
  notified
  userId
}
8. 🔄 Background Jobs
8.1 Daily Task Generation
Runs at midnight
Generates tasks for all users
8.2 Notification Job
Runs every minute
Query:
startTime <= now AND notified = false
Sends notification
Marks task as notified
9. 🧠 Adaptive Logic (V1.5)
If user completes tasks:
increase difficulty
If user skips tasks:
simplify next tasks
Optional:
“Lazy Mode”
reduces workload for the day
10. ⚠️ Edge Cases
Duplicate task generation
Missed notifications (server restart)
Timezone handling
AI failure fallback
11. 📊 Metrics (Success)
Daily Active Users (DAU)
Task completion rate
Retention (Day 7, Day 30)
12. 🧪 Future Enhancements
Progress dashboard
Streak system
AI coach messages
BullMQ for precise scheduling
Multi-device sync
13. 🧨 Risks
Over-reliance on AI
Notification fatigue
Poor task quality
14. 🎯 MVP Scope (strict)

Build ONLY:

goal input
task generation