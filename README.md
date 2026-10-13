# ExamMap — Smart Study Planner & Exam Preparation Tracker

> **Plan Smart. Study Better. Score Confidently.**  
> *A full-stack academic study planning, syllabus tracking, and exam preparation platform.*

[![Frontend: React + Vite](https://img.shields.io/badge/Frontend-React_18_|_Vite-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Database: Google Firebase](https://img.shields.io/badge/Database-Cloud_Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Auth: Firebase Authentication](https://img.shields.io/badge/Auth-Firebase_Auth-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📌 1. Project Overview

**ExamMap** is an intelligent academic productivity and examination preparation platform engineered to help students organize course materials, schedule study sessions, and monitor preparation readiness.

### Key Capabilities:
- **5-Unit Syllabus Tracker**: Structured unit-by-unit syllabus breakdown (Units 1 through 5) with real-time topic checkboxes and unit completion meters.
- **Preloaded Core Curriculum**: Comes pre-configured with fundamental computer science subjects: **Operating Systems**, **Database Management Systems**, **Computer Networks**, and **Software Engineering**.
- **Smart Study Planner & Pomodoro Suite**: Integrated 25-minute focus sprints, customizable breaks, and celebration milestones linked to scheduled tasks.
- **Live Exam Countdown**: Real-time second-by-second countdown with urgency alerts (<7 days) and dynamic syllabus readiness percentages.
- **Progress Analytics**: Detailed breakdown of high, medium, and low priority topic mastery, revision hours, and course comparisons.

---

## 🎨 2. Design System & Palette

ExamMap utilizes a calm, focused SaaS design system engineered for high legibility and minimal cognitive distraction:

| Token | Hex Code | Usage |
|---|---|---|
| **Background** | `#F7F8FC` | Main app background canvas |
| **Surface** | `#FFFFFF` | Rounded card containers & dialogs |
| **Primary** | `#6558F5` | Primary CTA buttons, active tabs, progress bars |
| **Secondary** | `#35B8A6` | Study timer highlights, secondary accents |
| **Main Text** | `#20243A` | High-contrast readable headings & titles |
| **Muted Text** | `#737B91` | Subtitles, labels, secondary metadata |
| **Border** | `#E7E9F2` | Subtle clean card borders & dividers |

---

## 🛠️ 3. Technology Stack

### Frontend & Client Architecture
- **Framework**: React.js with Vite
- **Routing**: React Router v7 (`react-router-dom`)
- **Icons**: Lucide React (`lucide-react`)
- **Visuals**: Canvas Confetti for study sprint completions
- **State Management**: React Context (`AuthContext`, `ToastContext`)

### Database & Cloud Services
- **Database**: Google Cloud Firestore (real-time NoSQL collections for `users`, `subjects`, `topics`, `studyPlans`, `exams`)
- **Authentication**: Firebase Authentication (secure Email/Password identity management)
- **Security**: Firestore Security Rules enforcing user-level document isolation

---

## 📂 4. Project Directory Structure

```text
exam-map/
├── backend/
│   ├── config/
│   │   └── db.js                 # Resilient MongoDB connector
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile, password
│   │   ├── subjectController.js  # Course CRUD with topic completion aggregates
│   │   ├── topicController.js    # Syllabus topic CRUD, status toggling, filtering
│   │   ├── studyPlanController.js# Daily study sessions & Pomodoro cycle recorder
│   │   ├── examController.js     # Exam schedules with live countdowns & readiness
│   │   └── analyticsController.js# Curriculum mastery & priority breakdown stats
│   ├── middleware/
│   │   ├── auth.js               # JWT verification for protected routes
│   │   └── errorHandler.js       # Centralized error handler
│   ├── models/
│   │   ├── User.js               # Student schema with bcrypt hooks
│   │   ├── Subject.js            # Subject schema with unit counts & colors
│   │   ├── Topic.js              # Syllabus topic schema with priority & status
│   │   ├── StudyPlan.js          # Scheduled study sessions & pomodoro cycles
│   │   └── Exam.js               # University exam countdown records
│   ├── seed/
│   │   └── jntuaData.js          # Core computer science curriculum seed
│   ├── .env                      # Server configuration
│   ├── server.js                 # Express application entrypoint
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Navbar, Sidebar, TopHeader, StatCard, ProgressBar, Modal, Toast
│   │   │   ├── countdown/        # CountdownCard, AddExamModal
│   │   │   ├── planner/          # PomodoroTimer with focus sprints
│   │   │   ├── subjects/         # SubjectCard, SubjectModal
│   │   │   └── syllabus/         # TopicItem, AddTopicModal
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Global student session & user state
│   │   │   └── ToastContext.jsx  # Floating animated toast notifications
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx# Responsive drawer sidebar & topbar layout
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx   # Public landing page with live interactive preview
│   │   │   ├── LoginPage.jsx     # Login with demo one-click credentials
│   │   │   ├── RegisterPage.jsx  # Student signup with automatic curriculum preloading
│   │   │   ├── DashboardOverview.jsx # Main overview with stats & urgent exam alerts
│   │   │   ├── SubjectsPage.jsx  # Course grid with difficulty filters & CRUD
│   │   │   ├── SyllabusTrackerPage.jsx # 5-Unit collapsible checklist
│   │   │   ├── StudyPlannerPage.jsx # Timetable schedule + Pomodoro timer
│   │   │   ├── ExamCountdownPage.jsx # Second-by-second countdown cards
│   │   │   ├── AnalyticsPage.jsx # Priority matrix & coverage charts
│   │   │   ├── ProfilePage.jsx   # Student settings & reset utility
│   │   │   └── NotFoundPage.jsx
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── services/
│   │   │   └── api.js            # Axios client with interceptors
│   │   ├── styles/
│   │   │   ├── variables.css     # CSS custom properties / design tokens
│   │   │   └── global.css        # Clean typography, cards, badges, buttons
│   │   ├── App.jsx               # Route definitions
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── package.json                  # Root runner script
└── README.md
```

---

## 🚀 5. How to Run the Project

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Launch:

1. **Start Backend**:
   ```bash
   cd backend
   npm run start
   ```
   *The backend will start at `http://localhost:5000`.*

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
   *The frontend will start at `http://localhost:5173`.*

---

## 🔑 6. Demo Account Credentials

A pre-configured demo account is available (or click **"Quick Demo Account Login"** on the Login screen):

- **Email**: `harsha.cse@jntua.ac.in`
- **Password**: `password123`
- **Included Courses**:
  1. Operating Systems (`20A05501T`) — 5 Units, 21 Topics
  2. Database Management Systems (`20A05502T`) — 5 Units, 21 Topics
  3. Computer Networks (`20A05503T`) — 5 Units, 15 Topics
  4. Software Engineering (`20A05504T`) — 5 Units, 13 Topics

---

## 📡 7. REST API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user & seed initial syllabus | Public |
| `POST` | `/api/auth/login` | Authenticate user & return JWT | Public |
| `GET` | `/api/auth/me` | Fetch current student details | Private |
| `PUT` | `/api/auth/profile` | Update profile information | Private |
| `PUT` | `/api/auth/change-password` | Update account password | Private |
| `POST` | `/api/auth/reseed` | Reload standard core curriculum | Private |
| `POST` | `/api/auth/logout` | Terminate session & clear cookies | Private |

### Subjects (`/api/subjects`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/subjects` | List subjects with topic completion counts | Private |
| `GET` | `/api/subjects/:id` | Get subject details with grouped 5 units | Private |
| `POST` | `/api/subjects` | Create subject | Private |
| `PUT` | `/api/subjects/:id` | Update subject | Private |
| `DELETE`| `/api/subjects/:id` | Delete subject (cascades topics & exams) | Private |

### Syllabus Topics (`/api/topics`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/topics` | Filter topics by subject, unit, status, priority | Private |
| `POST` | `/api/topics` | Add topic to a specific unit | Private |
| `PUT` | `/api/topics/:id` | Update topic title, notes, priority | Private |
| `PATCH`| `/api/topics/:id/status`| Cycle topic status (`Not Started` ⇄ `In Progress` ⇄ `Completed`) | Private |
| `DELETE`| `/api/topics/:id` | Delete topic | Private |

### Study Planner (`/api/study-plans`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/study-plans` | Retrieve scheduled study sessions | Private |
| `POST` | `/api/study-plans` | Create new study session | Private |
| `PUT` | `/api/study-plans/:id` | Update session or mark completed | Private |
| `POST` | `/api/study-plans/:id/pomodoro` | Increment completed Pomodoro cycles | Private |
| `DELETE`| `/api/study-plans/:id` | Delete session | Private |

### Exam Countdown (`/api/exams`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/exams` | Get all exams with live days left & readiness | Private |
| `POST` | `/api/exams` | Schedule university exam | Private |
| `PUT` | `/api/exams/:id` | Update exam date, time, venue, marks | Private |
| `DELETE`| `/api/exams/:id` | Remove exam record | Private |

### Analytics (`/api/analytics`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/analytics` | Overall syllabus %, high-priority mastery, study hours | Private |
