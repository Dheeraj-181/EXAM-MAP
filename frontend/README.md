# ExamMap — Smart Study Planner & Exam Preparation Tracker (Frontend)

> **Plan Smart. Study Better. Score Confidently.**  
> *A modern academic study planning, syllabus tracking, and examination preparation web application built with React, Vite, and Google Firebase.*

[![React](https://img.shields.io/badge/Frontend-React_18_|_Vite-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Database-Cloud_Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Auth](https://img.shields.io/badge/Auth-Firebase_Authentication-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📌 Features

- **Unit-by-Unit Syllabus Tracker**: Structured 5-unit curriculum tracking with instant completion percentages, unit progress bars, and topic status management (`Not Started`, `In Progress`, `Completed`).
- **Preloaded Core Curriculum**: Automatically seeds fundamental computer science courses:
  - Operating Systems
  - Database Management Systems
  - Computer Networks
  - Software Engineering
- **Focus Pomodoro Timer**: Integrated 25-minute study intervals, rest periods, confetti celebrations, and cycle tracking.
- **Dynamic Exam Countdown**: Real-time second-by-second countdown with critical alerts (≤7 days) and syllabus readiness calculations.
- **Performance Analytics**: Visual overview of overall syllabus progress, topic priority breakdowns (High / Medium / Low), and revision hours.
- **SaaS Design System**: Minimal, focused dashboard UI built with clean tokens (`#6558F5` primary, `#35B8A6` teal accent, `#F7F8FC` surface canvas).

---

## 🛠️ Tech Stack

- **Framework**: React.js with Vite
- **Routing**: React Router v7 (`react-router-dom`)
- **Backend-as-a-Service**: Google Firebase
  - **Firebase Authentication**: User registration, login, and secure sessions
  - **Cloud Firestore**: Real-time NoSQL database
- **Icons**: Lucide React (`lucide-react`)
- **Effects**: Canvas Confetti (`canvas-confetti`)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```

---

## 📁 Project Structure

```text
src/
├── components/          # Reusable UI components
│   ├── common/          # StatCards, Modals, ProgressBars, EmptyStates
│   ├── countdown/       # Exam countdown cards and scheduling modals
│   ├── layout/          # Dashboard sidebar, header, and wrappers
│   ├── planner/         # Pomodoro timer and session schedule cards
│   ├── subjects/        # Course cards and creation modals
│   └── syllabus/        # Unit accordions and topic checklist items
├── context/             # Global React Context (AuthContext, ToastContext)
├── firebase/            # Firebase SDK configuration and Firestore services
│   ├── config.js        # Firebase app initialization
│   ├── authService.js   # Auth methods (signup, login, profile)
│   ├── subjectService.js# Subjects CRUD & metrics
│   ├── topicService.js  # Syllabus topic tracking
│   ├── studyPlanService.js # Study sessions & Pomodoro stats
│   ├── examService.js   # Exam schedules & readiness countdown
│   ├── analyticsService.js # Dashboard performance aggregation
│   └── seedData.js      # Automatic core curriculum provisioner
├── pages/               # Application views
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardOverview.jsx
│   ├── SubjectsPage.jsx
│   ├── SyllabusTrackerPage.jsx
│   ├── StudyPlannerPage.jsx
│   ├── ExamCountdownPage.jsx
│   ├── AnalyticsPage.jsx
│   └── ProfilePage.jsx
└── App.jsx              # Main router and application entry
```

---

## 📄 License
This project is licensed under the MIT License.
