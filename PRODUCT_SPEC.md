# Learn Tracker — Product Specification

> **Version:** 1.1  
> **Last Updated:** February 27, 2026  
> **Status:** In Development (Advanced MVP)

---

## 1. Overview

**Learn Tracker** is a personal learning management application that helps self-directed learners organize, track, and gamify their learning journey. It combines structured roadmaps, study session logging, resource bookmarking, and quick notes into a single, visually immersive dashboard.

### Vision

> _"Turn self-learning into a game you want to keep playing."_

### Target Users

| Persona                    | Description                                                 |
| -------------------------- | ----------------------------------------------------------- |
| **Self-taught Developers** | Learners following online courses, tutorials, and bootcamps |
| **Career Switchers**       | Professionals reskilling into tech with structured goals    |
| **Students**               | University/college students supplementing formal education  |
| **Lifelong Learners**      | Anyone systematically learning new skills or subjects       |

---

## 2. Tech Stack

| Layer                  | Technology             | Version               |
| ---------------------- | ---------------------- | --------------------- |
| **Frontend Framework** | Next.js (App Router)   | 16.1.6                |
| **UI Library**         | React                  | 19.2.3                |
| **Styling**            | Tailwind CSS           | v4                    |
| **Animations**         | Framer Motion          | 12.34.2               |
| **Icons**              | Lucide React           | 0.575.0               |
| **Backend Framework**  | Go (standard library)  | 1.26                  |
| **Database Driver**    | pgx v5 (Pool)          | latest                |
| **Database**           | PostgreSQL             | —                     |
| **Auth**               | Auth.js v5 + HS256 JWT | GitHub & Google OAuth |

---

## 3. Architecture

```mermaid
graph TB
    subgraph Frontend["Frontend — Next.js 16"]
        A[App Router] --> B[DashboardLayout]
        B --> C[BentoGrid]
        C --> D[StreakWidget]
        C --> E[RoadmapWidget]
        C --> F[RecentLogWidget]
        C --> G[QuickNoteWidget]
        C --> H["+ Add Widget"]
    end

    subgraph Backend["Backend — Go"]
        I[CORS Middleware] --> J[http.ServeMux]
        J --> K["/users"]
        J --> L["/roadmaps"]
        J --> M["/resources"]
        J --> N["/notes"]
        J --> X["/projects /flashcards /inventory"]
        J --> Y["/quests /studio /dashboard /familiar"]
    end

    subgraph Database["Database — PostgreSQL"]
        O[(User)]
        P[(Roadmap)]
        Q[(Step)]
        R[(Resource)]
        S[(StudyLog)]
        T[(Note)]
        U[(Project)]
        V[(Quest)]
    end

    Frontend -->|HTTP REST| Backend
    Backend -->|pgx driver| Database
```

### Design System

- **Theme:** Dark mode with glassmorphism aesthetic
- **Base Component:** `GlassCard` — translucent cards with backdrop blur, subtle borders, and hover elevation
- **Layout:** Responsive Bento Grid (1-col mobile → 4-col desktop)
- **Animations:** Staggered entry with Framer Motion (`opacity + translateY`)

---

## 4. Data Model

```mermaid
erDiagram
    User ||--o{ Roadmap : creates
    User ||--o{ Resource : saves
    User ||--o{ StudyLog : logs
    User ||--o{ Note : writes
    User ||--|| Familiar : owns
    Roadmap ||--o{ Step : contains

    User {
        string id PK
        string email UK
        string username
        int xp
        int level
        int streak
        datetime createdAt
        datetime updatedAt
    }

    Familiar {
        string id PK
        string name
        int hp
        int maxHp
        string status
        string userId FK
        datetime lastFed
    }

    Roadmap {
        string id PK
        string title
        string description
        bool isActive
        int progress
        string userId FK
        datetime createdAt
        datetime updatedAt
    }

    Step {
        string id PK
        string title
        bool isCompleted
        int order
        string roadmapId FK
    }

    Resource {
        string id PK
        string title
        string url
        string type
        string topic
        string userId FK
        datetime createdAt
    }

    StudyLog {
        string id PK
        datetime startTime
        datetime endTime
        string status
        string topic
        string userId FK
    }

    LevelConfig {
        int level PK
        int minXp
        int maxXp
        string titleBadge
    }

    Note {
        string id PK
        string title
        string content
        string[] tags
        string userId FK
        datetime createdAt
        datetime updatedAt
    }
```

---

## 5. Features

### 5.1 Bento Grid Dashboard

The main interface uses a **Bento-style grid layout** that arranges widgets in a visually dynamic, card-based grid. Each widget is wrapped in a `GlassCard` with glassmorphism styling.

| Widget          | Grid Span       | Purpose                                   |
| --------------- | --------------- | ----------------------------------------- |
| **Streak**      | 1 col × 2 rows  | Shows current streak, XP bar, and level   |
| **Roadmap**     | 2 cols × 2 rows | Active learning path with step completion |
| **Recent Log**  | 1 col × 1 row   | Last study session with resume action     |
| **Add Widget**  | 1 col × 1 row   | Placeholder for extensibility             |
| **Quick Notes** | 4 cols × 1 row  | Full-width markdown note-taking area      |

---

### 5.2 Streak & Gamification

Tracks learning consistency and rewards progress with XP and levels.

| Field               | Description                                                         |
| ------------------- | ------------------------------------------------------------------- |
| `streak`            | Consecutive days of logged study activity                           |
| `xp`                | Experience points earned from completing steps and logging sessions |
| `level`             | Derived from XP thresholds (displayed as badge)                     |
| **XP Progress Bar** | Animated bar showing progress to next level                         |

**Rules:**

- Earn 1 XP per 1 minute of completed study time. Sessions must be at least 5 minutes long to yield XP.
- +25 XP per roadmap step completed
- +50 XP bonus for 7-day streak milestone
- Streak resets if no activity for 24 hours

---

### 5.3 Learning Roadmaps

Structured learning paths with ordered steps.

**Current capabilities:**

- Display active roadmap with step list
- Visual distinction between completed and pending steps
- Hover-to-reveal "Start" action on incomplete steps
- Progress percentage tracking

**Planned capabilities:**

- Create, edit, and delete roadmaps
- Mark steps as completed (toggle)
- Auto-calculate progress based on completed steps
- Multiple roadmaps with active selection

---

### 5.4 Study Log & Timer

Tracks study sessions with duration and topic.

**Current capabilities:**

- Display last session topic, duration, and category
- "Resume Session" action button

**Planned capabilities:**

- Built-in study timer (start/pause/stop)
  - _Note: Frontend uses `localStorage` to persist the active timer's `startTime` to prevent data loss on browser refresh._
- Session history view with daily/weekly/monthly stats
- Time-per-topic analytics
- Chart visualizations (bar/line charts)

---

### 5.5 Quick Notes

Lightweight note-taking with markdown support.

**Current capabilities:**

- Full-width textarea with markdown hint
- "AI Assist" button (UI placeholder)

**Planned capabilities:**

- Save notes to database with title and tags
- Markdown rendering preview
- Tag-based filtering and search
- AI-powered summarization and suggestions

---

### 5.6 Resource Library

Bookmark and categorize learning resources.

**Current capabilities:**

- Database model defined (title, url, type, topic)
- Skeleton API endpoint

**Planned capabilities:**

- Add/edit/delete resources
- Categorize by type (article, video, course, book)
- Tag by topic
- Quick-access resource cards on dashboard

---

### 5.7 Virtual Familiar

A gamified virtual pet companion that motivates consistent learning habits.

**Current mechanics:**

- **HP Restoration (Feeding):** Users restore HP by completing quests or finishing study sessions.
- **Stat Tracking:** level, current HP, max HP, and last fed timestamp are persisted in PostgreSQL.
- **Context-aware Feeding:** Quests and study sessions automatically trigger familiar feeding in the frontend store.

**Planned mechanics:**

- **HP Decay:** Automatic health decrease over time.
- **Status & Form:** Visual evolution of the pet based on level.

---

## 6. API Endpoints

### Standardized API Response Format

All backend API responses are standardized into a JSON envelope wrapper to ease frontend state management and error parsing:

**Success Response:**

```json
{
  "success": true,
  "data": { ... } // or [...]
}
```

**Paginated Success Response (e.g. `/notes`):**

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": { "currentPage": 1, "totalPages": 5, "totalItems": 42 }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": {
    "code": "DB_ERROR",
    "message": "Human readable error string",
    "details": []
  }
}
```

### Current Implemented Endpoints

| Method    | Endpoint                           | Description                  | Status         |
| --------- | ---------------------------------- | ---------------------------- | -------------- |
| `GET`     | `/health`                          | Health check                 | ✅ Implemented |
| `GET`     | `/api/v1/users`                    | List users (Stub)            | ✅ Implemented |
| `GET/PUT` | `/api/v1/notes`                    | Full CRUD + Pagination/XSS   | ✅ Implemented |
| `CRUD`    | `/projects /flashcards /inventory` | Resources                    | ✅ Implemented |
| `CRUD`    | `/quests /studio /dashboard`       | Gamification & Layout        | ✅ Implemented |
| `GET/PUT` | `/api/v1/familiar`                 | Familiar HP & Status updates | ✅ Implemented |

---

### Planned Full API (Roadmap)

| Method   | Endpoint                               | Description                 |
| -------- | -------------------------------------- | --------------------------- |
| `POST`   | `/api/v1/users`                        | Create user                 |
| `GET`    | `/api/v1/users/{id}`                   | Get user profile            |
| `PUT`    | `/api/v1/users/{id}`                   | Update user profile         |
| `POST`   | `/api/v1/roadmaps`                     | Create roadmap              |
| `GET`    | `/api/v1/roadmaps/{id}`                | Get roadmap with steps      |
| `PUT`    | `/api/v1/roadmaps/{id}`                | Update roadmap              |
| `DELETE` | `/api/v1/roadmaps/{id}`                | Delete roadmap              |
| `PUT`    | `/api/v1/roadmaps/{id}/steps/{stepId}` | Toggle step completion      |
| `POST`   | `/api/v1/study-logs`                   | Log a study session         |
| `GET`    | `/api/v1/study-logs`                   | Get study history           |
| `GET`    | `/api/v1/study-logs/stats`             | Get aggregated stats        |
| `POST`   | `/api/v1/notes`                        | Create note                 |
| `GET`    | `/api/v1/notes/{id}`                   | Get note                    |
| `PUT`    | `/api/v1/notes/{id}`                   | Update note                 |
| `DELETE` | `/api/v1/notes/{id}`                   | Delete note                 |
| `POST`   | `/api/v1/resources`                    | Add resource                |
| `GET`    | `/api/v1/resources`                    | List resources (filterable) |
| `DELETE` | `/api/v1/resources/{id}`               | Delete resource             |

---

## 7. Project Structure

```
LearnTracker/
├── backend/
│   ├── cmd/
│   │   └── server/
│   │       └── main.go             # Go entry point
│   ├── internal/
│   │   ├── config/
│   │   │   └── config.go           # Env config
│   │   ├── database/
│   │   │   └── database.go         # pgx connection pool
│   │   ├── handlers/
│   │   │   ├── common.go           # JSON helpers
│   │   │   ├── notes.go            # Paginated notes + XSS config
│   │   │   └── ... (others)
│   │   ├── middleware/
│   │   │   ├── auth.go             # HS256 JWT Authentication
│   │   │   └── context.go          # Context injection
│   │   ├── models/
│   │   │   └── models.go           # Go structs (*time.Time nullables)
│   │   ├── response/
│   │   │   └── response.go         # Standardized API Envelope
│   │   ├── sanitize/
│   │   │   └── sanitize.go         # bluemonday XSS prevention
│   │   └── router/
│   │       └── router.go           # Go 1.22+ ServeMux
│   ├── migrations/
│   │   └── 001_phase2.sql          # DB Schema Definitions
│   ├── go.mod
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx          # Root layout
│   │   │   ├── page.tsx            # Dashboard page
│   │   │   └── globals.css         # Global styles
│   │   └── components/
│   │       ├── dashboard/
│   │       │   ├── BentoGrid.tsx    # Grid layout
│   │       │   └── widgets/
│   │       │       ├── StreakWidget.tsx
│   │       │       ├── RoadmapWidget.tsx
│   │       │       ├── RecentLogWidget.tsx
│   │       │       └── QuickNoteWidget.tsx
│   │       ├── layout/
│   │       │   └── DashboardLayout.tsx
│   │       └── ui/
│   │           └── GlassCard.tsx    # Shared glass card
│   └── package.json
│
└── README.md
```

---

## 8. Development Roadmap

### Phase 1 — Foundation ✅

- [x] Project scaffolding (Next.js + Go)
- [x] Database schema design
- [x] Go struct models
- [x] Bento Grid dashboard layout
- [x] GlassCard design system component
- [x] All 5 main dashboard widgets (Streak, Roadmap, Timer, Daily Goals, Quick Note)
- [x] CRUD API for Projects, Flashcards, Quests, etc.
- [x] CORS configuration (Go middleware)

### Phase 2 — Core Functionality ✅

- [x] Connect to PostgreSQL with pgxpool
- [x] Implement full CRUD API in Go
- [x] Note CRUD with markdown rendering and pagination
- [x] Setup XSS sanitization (bluemonday) and generalized envelope API responses
- [x] HS256 JWT Authentication Middleware in Go
- [x] Wire frontend widgets to real API data (via Zustand + Fetch)
- [x] Study timer tracking and session logging

### Phase 3 — Gamification & Analytics ✅

- [x] XP calculation engine and level-up system
- [x] Level-up system with thresholds logic in frontend store
- [x] Virtual Familiar state management (HP/Level/Feeding)
- [x] Daily Quest generation (weighted random ranking)
- [ ] Streak tracking logic (daily reset calculation)
- [ ] Study time analytics (daily/weekly charts)

### Phase 4 — Authentication & Multi-User ✅

- [x] Auth.js v5 integration with GitHub and Google Providers
- [x] Custom HS256 JWT strategy (solving JWE cross-platform issue)
- [x] Secure API calls with non-HttpOnly JWT cookie for Go backend
- [x] User registration/login flows and data isolation

### Phase 5 — Polish & AI 🔲

- [ ] AI-assisted note summarization
- [ ] AI roadmap suggestions
- [ ] Widget customization ("Add Widget" functionality)
- [ ] Dark/light theme toggle
- [ ] Mobile-first responsive refinements
- [ ] PWA support for offline access

---

## 9. Non-Functional Requirements

| Requirement           | Target                                   |
| --------------------- | ---------------------------------------- |
| **Performance**       | Dashboard loads in < 2s on 3G            |
| **Responsiveness**    | Fully functional on mobile (375px+)      |
| **Accessibility**     | WCAG 2.1 AA compliance                   |
| **Browser Support**   | Chrome, Firefox, Safari, Edge (latest 2) |
| **API Response Time** | < 200ms for all endpoints                |
| **Data Integrity**    | All mutations validated via Go structs   |

---

## 10. Open Questions

1. **Auth Strategy** — _Decision made:_ Use Auth.js v5 with a custom HS256 JWT strategy to communicate statelessly with the Go backend.
2. **AI Provider** — Which LLM provider for "AI Assist" feature (OpenAI, Google Gemini, local model)?
3. **Deployment Target** — Vercel (frontend) + Railway/Render (backend) + Supabase (database)?
4. **Notification System** — Add streak reminders via email or push notifications?
5. **Social Features** — Should users be able to share roadmaps or compete on leaderboards?
