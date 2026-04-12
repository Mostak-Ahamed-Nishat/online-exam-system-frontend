# Online Assessment Platform

A full-stack online examination system built with modern web technologies. The platform provides two distinct panels — an **Admin Panel** for exam management and a **Candidate Panel** for secure, proctored exam delivery.

---

## Project Links

| Resource            | Link                                                                                                                                                                                                                                                                        |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Live Demo           | https://ibos-exam.vercel.app/                                                                                                                                                                                                                                               |
| Frontend Repository | https://github.com/Mostak-Ahamed-Nishat/online-exam-system-frontend                                                                                                                                                                                                         |
| Backend Repository  | https://github.com/Mostak-Ahamed-Nishat/ibos-online-test-backend                                                                                                                                                                                                            |
| Video Walkthrough   | https://drive.google.com/drive/folders/1NEfpUibruglqY7_hjDmiMd4hi6eJiDUQ?usp=sharing                                                                                                                                                                                        |
| Database ERD        | https://miro.com/welcomeonboard/Tmd1ZzZzT1NxK2hVNGJrLy9KclFVTFYzR0FRRXh5c0IxTlRjV2xpNkRUQ1BrbkRTZGFYQURjSkh6M04rMmhqZHdSQ1RPUXJRVUV1anIwQzhodG1UVC9JRVM5M2tKTUV2UmsxU2xJMUVscndadGlGeS9xZ1Z5MmFYeXllZEdxRmNzVXVvMm53MW9OWFg1bkJoVXZxdFhRPT0hdjE=?share_link_id=752565887110 |

---

## Demo Credentials

| Role    | Email              | Password                      |
| ------- | ------------------ | ----------------------------- |
| Admin 1 | admin@example.com  | `ChangeThisAdminPassword123!` |
| Admin 2 | admin2@example.com | `ChangeThisAdminPassword123!` |

---

## Feature Overview

### Admin Panel

**Authentication & Access Control**

- Secure login/logout with role-based access control (RBAC)
- JWT access token + refresh token flow with rotation and revocation

**Exam Management**

- Dashboard with exam listing, search, and pagination
- 2-step exam creation wizard:
  - Step 1: Basic information (title, candidates, slots, duration, start/end time, question type)
  - Step 2: Question set builder with full CRUD support
- Supported question types: `RADIO`, `CHECKBOX`, `TEXT` (requires manual evaluation)
- Standalone question bank — create questions independently and reuse across exams
- Configurable exam settings:
  - Attempt limit per candidate (default: 3)
  - Tab switch violation threshold for auto-submission
  - Immediate result publish toggle _(backend supported, UI pending)_

**Result Management** _(backend supported, UI pending)_

- View submitted attempts per exam
- Per-candidate attempt detail view
- Manual marks entry for `TEXT` type answers
- Evaluated result publish flow
- Bulk publish for all ready results

---

### Candidate Panel

**Authentication**

- Secure login/logout with session persistence

**Exam Experience**

- Available exam listing with search and pagination
- Exam instructions screen before attempt begins
- One-question-at-a-time delivery for focused assessment
- Answer actions: Save & Continue, Skip
- Jump navigation by question number _(backend supported, UI pending)_
- Review summary screen before final submission _(backend supported, UI pending)_

**Exam Session Engine**

- Persistent session: start and resume support across page reloads
- Server-synced countdown timer
- Manual submit with confirmation
- Auto-submit with timeout modal on expiry

**Proctoring & Behavioral Tracking**

- Tab switch detection with configurable violation limit
- Auto-submission triggered upon exceeding violation threshold
- Fullscreen exit detection and warning

**Offline Resilience**

- Answers persisted to `localStorage` on every interaction
- Timer continues running client-side during connectivity loss
- Automatic answer sync to backend upon reconnection
- Session state restored from server on page reload and merged with local data

**Result Visibility** _(backend supported, UI pending)_

- Status tracking: `not available` / `in progress` / `pending evaluation` / `not published` / `published`
- Score visible to candidate only after admin publishes result

---

## Backend Architecture

**Stack:** Node.js · Express.js · TypeScript · MongoDB (Mongoose) · Zod

**Design Pattern:** `Route → Controller → Service → Model`

**Core Principles**

- Centralized error handling with consistent API response structure
- Async wrapper utility across all controllers to eliminate try/catch repetition
- Zod schema validation enforced at every route boundary
- Clean separation of concerns across all layers

**Security**

- Helmet for HTTP security headers
- CORS with whitelist configuration
- Global rate limiting + exam-route specific rate limiting
- JWT access + refresh token flow with rotation and revocation
- Email verification and password reset flows

---

## API Structure

```
/api/auth/*                              — Authentication & token management
/api/admin/exams/*                       — Exam CRUD and configuration
/api/admin/question-bank/questions/*     — Standalone question bank management
/api/candidate/exams/*                   — Candidate exam access and submission
```

---

## Database Design

Entity-Relationship Diagram available on Miro:
https://miro.com/welcomeonboard/Tmd1ZzZzT1NxK2hVNGJrLy9KclFVTFYzR0FRRXh5c0IxTlRjV2xpNkRUQ1BrbkRTZGFYQURjSkh6M04rMmhqZHdSQ1RPUXJRVUV1anIwQzhodG1UVC9JRVM5M2tKTUV2UmsxU2xJMUVscndadGlGeS9xZ1Z5MmFYeXllZEdxRmNzVXVvMm53MW9OWFg1bkJoVXZxdFhRPT0hdjE=?share_link_id=752565887110

---

## Local Development

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Additional Questions

### MCP Integration

**Have you worked with any MCP (Model Context Protocol)?**

I have not used any MCP directly in this project. I used ChatGPT and Claude free version for development assistance. However, here is an idea of how MCP could be applied:

- **Supabase MCP** — Instead of the current MongoDB + Express backend, Supabase MCP could be connected to an AI assistant (e.g., Claude) to let it directly introspect the database schema, generate Supabase queries, and scaffold API logic. During development, this would reduce the time spent manually writing CRUD endpoints and migration scripts.
- **Figma MCP** — A Figma MCP server could allow the AI assistant to read Figma design tokens (colors, spacing, typography) and auto-generate the CSS variables and component markup, ensuring pixel-perfect consistency between the design file and the final UI.
- **Chrome DevTools MCP** — During debugging, a DevTools MCP could let the AI read console errors, network waterfall data, and DOM state in real-time, enabling faster diagnosis of issues like the offline-sync race conditions encountered during development.

---

### AI Tools for Development

**Which AI tools have you used to speed up frontend development?**

| Tool               | How It Was Used                                                                                                                                                                                                  |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ChatGPT (Free)** | Generated boilerplate code for components and API service layers. Also used for quick reference on library APIs and syntax.                                                                                      |
| **Claude**         | Used for generating complex validation schemas (Zod), debugging tricky errors (e.g., token rotation race conditions, offline sync edge cases), and getting architectural suggestions for the exam session engine. |

**How these tools increased development speed:**

- **Boilerplate generation** — Repetitive patterns like RTK Query endpoint definitions, form validation schemas, and CRUD components were scaffolded by AI and then customized, saving significant time.
- **Error resolution** — When encountering unfamiliar errors (e.g., hydration mismatches in Next.js, JWT refresh token edge cases), pasting the error into Claude or ChatGPT often gave a direct fix faster than searching through documentation.
- **Validation logic** — Complex Zod schemas with conditional validation rules (e.g., different rules based on question type) were generated with AI assistance and refined manually.

---

### Offline Mode

**How would you handle offline mode if a candidate loses internet during an exam?**

**Implementation Details:**

1. **Answer Queuing** — When a candidate saves or skips an answer while offline, the action is serialized and pushed into a per-exam `localStorage` queue (`exam_attempt_offline_queue_v1_{examId}`). The candidate sees a toast notification indicating the answer has been queued locally.

2. **Network Detection** — The app listens to the browser's native `online` / `offline` events via `useAttemptNetworkEffect`. An `isOnline` state flag controls whether API calls or local queuing is used.

3. **Client-Side Timer** — The countdown timer runs entirely on the client using `setInterval` against a server-provided deadline timestamp. It continues ticking even when the network is down, so the candidate always sees accurate remaining time.

4. **Automatic Sync on Reconnect** — When the `online` event fires, the app immediately:
   - Flushes the offline queue by calling `POST /candidate/exams/{examId}/offline-sync` with all queued answers
   - Reloads the current question from the server to get the latest state
   - Notifies the candidate that connectivity has been restored

5. **Submission Guard** — If the candidate tries to submit the exam while still offline, the submission is blocked with a notification to reconnect first. Once back online, any pending offline answers are flushed before the final submission proceeds.

6. **Session Restore** — On page reload, the session state is fetched from the server and merged with any remaining items in the local offline queue, ensuring no answers are lost.

**Key Files:**

| File                                  | Purpose                                                                |
| ------------------------------------- | ---------------------------------------------------------------------- |
| `exam-attempt-offline-storage.js`     | `localStorage` queue helpers: `load`, `save`, `clear`                  |
| `use-student-exam-attempt.js`         | Core hook: `enqueueOfflineAction`, `flushOfflineQueue`, submit guards  |
| `use-student-exam-attempt-effects.js` | Side-effect hooks: network listener, timer, initialization             |
| `examApi.js`                          | RTK Query endpoints: `syncStudentOfflineAnswers`, `refetchOnReconnect` |
