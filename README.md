# Online Assessment Platform

A full-stack, production-ready online examination system built with modern web technologies. The platform provides two distinct panels — an **Admin Panel** for exam management and a **Candidate Panel** for secure, proctored exam delivery.

---

## 🔗 Project Links

| Resource            | Link                                                                                                                                                                                                                                                                        |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Live Demo           | https://ibos-exam.vercel.app/                                                                                                                                                                                                                                               |
| Frontend Repository | https://github.com/Mostak-Ahamed-Nishat/online-exam-system-frontend                                                                                                                                                                                                         |
| Backend Repository  | https://github.com/Mostak-Ahamed-Nishat/ibos-online-test-backend                                                                                                                                                                                                            |
| Video Walkthrough   | https://drive.google.com/drive/folders/1NEfpUibruglqY7_hjDmiMd4hi6eJiDUQ?usp=sharing                                                                                                                                                                                        |
| Database ERD        | https://miro.com/welcomeonboard/Tmd1ZzZzT1NxK2hVNGJrLy9KclFVTFYzR0FRRXh5c0IxTlRjV2xpNkRUQ1BrbkRTZGFYQURjSkh6M04rMmhqZHdSQ1RPUXJRVUV1anIwQzhodG1UVC9JRVM5M2tKTUV2UmsxU2xJMUVscndadGlGeS9xZ1Z5MmFYeXllZEdxRmNzVXVvMm53MW9OWFg1bkJoVXZxdFhRPT0hdjE=?share_link_id=752565887110 |

---

## 🔐 Demo Credentials

| Role    | Email              | Password                      |
| ------- | ------------------ | ----------------------------- |
| Admin 1 | admin@example.com  | `ChangeThisAdminPassword123!` |
| Admin 2 | admin2@example.com | `ChangeThisAdminPassword123!` |

---

## 🧩 Feature Overview

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

## 🏗 Backend Architecture

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

## 📡 API Structure

```
/api/auth/*                              — Authentication & token management
/api/admin/exams/*                       — Exam CRUD and configuration
/api/admin/question-bank/questions/*     — Standalone question bank management
/api/candidate/exams/*                   — Candidate exam access and submission
```

---

## 🗄 Database Design

Entity-Relationship Diagram available on Miro:
👉 https://miro.com/welcomeonboard/Tmd1ZzZzT1NxK2hVNGJrLy9KclFVTFYzR0FRRXh5c0IxTlRjV2xpNkRUQ1BrbkRTZGFYQURjSkh6M04rMmhqZHdSQ1RPUXJRVUV1anIwQzhodG1UVC9JRVM5M2tKTUV2UmsxU2xJMUVscndadGlGeS9xZ1Z5MmFYeXllZEdxRmNzVXVvMm53MW9OWFg1bkJoVXZxdFhRPT0hdjE=?share_link_id=752565887110

---

## ⚙️ Local Development

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

## 📋 Additional Questions

---

### 1. MCP (Model Context Protocol) Integration

**Have you worked with any MCP?**

Yes. During development of this project, I integrated **Claude by Anthropic** as an AI-powered development assistant — which operates through the Model Context Protocol (MCP) framework. Claude was used actively throughout the development lifecycle for the following:

- Scaffolding reusable React components and custom hooks (`useExamTimer`, `useBehaviorTracking`, `useOfflineSync`)
- Generating type-safe Zod validation schemas for both frontend forms and backend route validation
- Accelerating RTK Query endpoint definitions and Redux slice generation
- Enforcing consistent naming conventions, folder structure, and code patterns across the codebase
- Reviewing logic for edge cases in the exam session engine and offline sync strategy

**How MCP could further enhance this project:**

| MCP Server              | Use Case                                                                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Figma MCP**           | Auto-generate React components directly from the provided Figma designs, eliminating manual translation of design to code                        |
| **Supabase MCP**        | Enable Claude to interact with the database layer through natural language — running queries, generating migrations, and managing schema changes |
| **Chrome DevTools MCP** | Identify runtime performance bottlenecks and accessibility violations in real-time during the exam screen's interactive flows                    |

---

### 2. AI Tools for Development

**Which AI tools did you use to speed up development?**

| Tool                   | Usage                                                                                                                                                                              |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Claude (Anthropic)** | Primary AI assistant throughout the project. Used for component scaffolding, custom hook generation, Zod schema design, code review, and architectural decisions                   |
| **GitHub Copilot**     | Inline code completions inside VS Code, particularly for repetitive patterns such as RTK Query endpoint boilerplate, form field registration, and TypeScript interface definitions |

These tools significantly reduced time spent on boilerplate and repetitive tasks, allowing more focus on complex product logic — including the exam session engine, behavioral proctoring system, and the offline answer persistence and sync strategy.

---

### 3. Offline Mode Strategy

**How would you handle offline mode if a candidate loses internet during an exam?**

The platform implements a multi-layered offline resilience strategy designed to ensure zero data loss and an uninterrupted exam experience:

**1. Immediate Answer Persistence**
Every answer interaction (selection, text input) is written to `localStorage` synchronously — before any API call is made. Answers are stored with a composite key of `sessionId + questionId`, ensuring granular recovery.

**2. Client-Side Timer**
The countdown timer operates entirely on the client using `Date.now()` relative to the stored `startedAt` timestamp. It continues accurately regardless of network status, with no dependency on server polling.

**3. Automatic Reconnection Sync**
The application listens to the browser's native `online` event. Upon reconnection, all locally persisted answers are batched and synced to the backend in a single request — transparently, without interrupting the candidate's active session.

**4. Session Resume on Reload**
On every page load, the app fetches the latest session state from the backend and performs a deep merge with any locally stored answers — prioritizing local state for unanswered questions and server state for already-submitted ones.

**5. Optimistic UI**
All answer selections are reflected in the UI immediately upon interaction, independent of network status. This ensures a smooth, lag-free experience even on slow or intermittent connections, with background sync handling persistence.
