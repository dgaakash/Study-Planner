# StudyBloom — Student Study Planner 🌸

> A modern, student-focused study planner web application built for college project demonstration.

---

## 📌 Project Overview

**StudyBloom** helps students answer two critical daily questions:
1. *"What do I need to study today?"*
2. *"How much progress have I made?"*

The application features a clean, academic, soft pastel pink theme (#EC4899), responsive layouts, full CRUD operations across subjects, study sessions, assignments, exams, Pomodoro timer, study streak tracking, and live analytics calculated directly from MongoDB.

---

## ✨ Features

- 🌸 **Dashboard:** Student greeting, today's study hours, tasks completed, pending assignments, next exam countdown, and weekly progress chart.
- 📚 **Subject Management:** Add, edit, delete subjects with short code, instructor, difficulty level, target %, and theme color.
- 📅 **Study Planner:** Create, edit, delete, and toggle completion of daily study sessions by topic, duration, priority, and date.
- 🗓 **Academic Calendar:** Interactive monthly and agenda views showing sessions, assignment deadlines, and exam schedules.
- 📝 **Assignments / Task Management:** Track assignment titles, descriptions, due dates, priority, status (Pending, In Progress, Completed), and overdue warnings.
- 🎓 **Exams Management:** Track upcoming exams, countdown days, hall location, notes, and interactive preparation percentage slider.
- ⏱ **Pomodoro Timer:** Built-in 25-min focus / 5-min break timer linked to MongoDB session logging and stats.
- 📊 **Analytics & Streak:** Live weekly study hours, subject distribution %, task status breakdown, and consecutive study streak counter.
- 👤 **Student Profile:** Manage course, semester, division, daily study goal, and view total stats.
- 🔔 **In-App Reminders:** Dynamic notification panel alerting upcoming exams, overdue tasks, and daily schedule reminders.

---

## 🛠 Technology Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS (Soft pastel pink palette)
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose ORM
- **Auth:** JSON Web Tokens (JWT) & bcryptjs password hashing

---

## 📁 Folder Structure

```
student=study/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/        # Layout, Dashboard, Pomodoro & UI components
│   │   ├── context/           # AuthContext
│   │   ├── pages/             # All main pages
│   │   ├── services/          # Axios API service
│   │   ├── App.jsx            # Routing & Protected routes
│   │   ├── index.css          # Tailwind & custom tokens
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Node.js + Express API Backend
│   ├── config/                # DB connection
│   ├── controllers/           # Auth, Subject, Planner, Assignment, Exam, Pomodoro, Analytics, Profile
│   ├── middleware/            # Auth JWT & Error Handler
│   ├── models/                # Mongoose Models (User, Subject, StudySession, Assignment, Exam, Pomodoro, Notification)
│   ├── routes/                # Express API endpoints
│   ├── utils/                 # Streak & Notification calculators
│   ├── seed.js                # Demo student data seeder
│   ├── server.js              # Express app setup
│   └── package.json
├── docs/
│   └── PROJECT_DOCUMENTATION.md # Full 33-Section College Field Project Report
└── README.md
```

---

## 🚀 Quick Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017/studybloom` (or MongoDB Atlas URI)

### 1. Backend Setup

```bash
cd server
npm install
npm run seed     # Populate sample student Aakash demo data
npm start        # Starts server on port 5000
```

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

---

## 🔑 Demo Account Credentials

After running `npm run seed` in the `server` directory:

- **Email:** `aakash@student.com`
- **Password:** `password123`

---

## 🌐 API Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new student | No |
| `POST` | `/api/auth/login` | Log in student | No |
| `GET` | `/api/auth/me` | Fetch authenticated user details | Yes |
| `GET`, `POST` | `/api/subjects` | Fetch / Create subjects | Yes |
| `PUT`, `DELETE` | `/api/subjects/:id` | Update / Remove subject | Yes |
| `GET`, `POST` | `/api/study-sessions` | Fetch / Create study sessions | Yes |
| `PATCH` | `/api/study-sessions/:id/complete` | Toggle session completion | Yes |
| `GET`, `POST` | `/api/assignments` | Fetch / Create assignments | Yes |
| `PATCH` | `/api/assignments/:id/status` | Update assignment status | Yes |
| `GET`, `POST` | `/api/exams` | Fetch / Create exam records | Yes |
| `GET`, `POST` | `/api/pomodoro` | Fetch Pomodoro stats / Log session | Yes |
| `GET` | `/api/analytics/dashboard` | Dashboard totals & notifications | Yes |
| `GET` | `/api/analytics/weekly` | Weekly study hours & distribution | Yes |
| `GET`, `PUT` | `/api/profile` | View / Edit student profile | Yes |

---

## 📄 Documentation

Full college field project documentation report is available at [`docs/PROJECT_DOCUMENTATION.md`](file:///c:/projects/student=study/docs/PROJECT_DOCUMENTATION.md).
