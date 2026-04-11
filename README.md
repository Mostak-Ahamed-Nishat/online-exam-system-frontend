# Online Assessment Platform

Full-stack online exam system with separate Admin and Candidate workflows.

## Live Links
- Live Demo: https://ibos-exam.vercel.app/
- Backend Repository: https://github.com/Mostak-Ahamed-Nishat/ibos-online-test-backend
- Frontend Repository: https://github.com/Mostak-Ahamed-Nishat/online-exam-system-frontend
- Project Video: https://drive.google.com/drive/folders/1NEfpUibruglqY7_hjDmiMd4hi6eJiDUQ?usp=sharing

## Demo Credentials
- Admin 1
  - Email: `admin@example.com`
  - Password: `Admin@123`
- Admin 2
  - Email: `admin2@example.com`
  - Password: `Admin@123`

## Project Scope

### Admin Panel
- Authentication (login/logout, role-based access)
- Exam dashboard with search and pagination
- 2-step exam creation flow (basic info + question setup)
- Question management:
  - create during exam flow
  - create separately in question bank
  - add from question bank to exam
  - duplicate question prevention
- Supports question types:
  - `RADIO`
  - `CHECKBOX`
  - `TEXT` (manual evaluation required)
- Attempt control and exam configuration:
  - attempt limit per exam
  - immediate result publish toggle
  - pass threshold
  - negative marking
  - violation threshold
- Result management:
  - submitted attempt listing
  - per-candidate attempt detail
  - text answer marks input
  - evaluated/publish flow
  - publish all ready results
- Analytics:
  - total submitted vs pending
  - average score
  - pass/fail counts
  - candidate result table
  - CSV export

### Candidate Panel
- Authentication (login/logout)
- Available exam listing with search and pagination
- Exam instructions view
- One-question-at-a-time attempt flow:
  - save and continue
  - skip
  - jump navigation by question number
  - review summary before submit
- Exam session engine:
  - start/resume session
  - timer-based expiration handling
  - manual submit
  - timeout submit
- Integrity and anti-cheat events:
  - tab switch
  - fullscreen exit
  - copy-paste
  - right-click
  - auto-submit on max violation
- Offline support:
  - offline answer sync
  - sync state fetch on reconnect
- Result visibility:
  - not available / in progress / pending evaluation / not published / published
  - score visible only after publish

## Backend Architecture
- Stack: Node.js, Express.js, TypeScript, MongoDB (Mongoose), Zod
- Pattern: `routes -> controller -> service -> model`
- Centralized error handling
- Async wrapper usage across controllers
- Request validation with Zod at route boundaries
- Security hardening:
  - Helmet
  - CORS whitelist support
  - global and exam-route specific rate limiting
  - JWT access + refresh flow
  - refresh token rotation and revocation
  - email verification and password reset flows

## Core Backend API Groups
- `/api/auth/*`
- `/api/admin/exams/*`
- `/api/admin/question-bank/questions/*`
- `/api/candidate/exams/*`

## Local Development

### Prerequisites
- Node.js 20+
- MongoDB

### Run Backend
```bash
cd backend
npm install
npm run dev
```

### Run Frontend
```bash
cd frontend
npm install
npm run dev
```

## Database Design
- ERD (Miro): https://miro.com/welcomeonboard/Tmd1ZzZzT1NxK2hVNGJrLy9KclFVTFYzR0FRRXh5c0IxTlRjV2xpNkRUQ1BrbkRTZGFYQURjSkh6M04rMmhqZHdSQ1RPUXJRVUV1anIwQzhodG1UVC9JRVM5M2tKTUV2UmsxU2xJMUVscndadGlGeS9xZ1Z5MmFYeXllZEdxRmNzVXVvMm53MW9OWFg5bkJoVXZxdFhRPT0hdjE=?share_link_id=752565887110
