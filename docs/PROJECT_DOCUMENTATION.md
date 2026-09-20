# COLLEGE FIELD PROJECT REPORT

## **PROJECT TITLE: StudyBloom — Student Study Planner**

---

### **1. TITLE PAGE**

**Project Title:** StudyBloom — Student Study Planner  
**Project Type:** College Field Project (Full-Stack Web Development)  
**Academic Year:** 2025–2026  

| Information | Details |
| :--- | :--- |
| **Student Name:** | [Student Name Placeholder] |
| **Roll Number:** | [Roll Number Placeholder] |
| **Course / Program:** | B.Sc. Computer Science / B.Tech CSE |
| **Semester / Year:** | Semester V / Year 3 |
| **College Name:** | [Department of Computer Science, College Name] |
| **Project Guide:** | [Prof. Guide Name Placeholder] |

---

### **2. ABSTRACT**

Managing college academic schedules across multiple subjects, project deadlines, midterms, and daily study routines often leads to cognitive overload for students. **StudyBloom** is a full-stack student productivity web application designed to help students organize their academic life, track progress, and build consistent study habits.

Built using the MERN stack architecture (MongoDB, Express.js, React with Vite, and Node.js) and styled with a soft pastel pink theme, StudyBloom provides daily study scheduling, subject management, assignment deadline tracking, exam preparation countdowns, an interactive Pomodoro timer, study streak calculations, and real-time database-driven analytics. This project emphasizes clean code structure, practical database relationships, and demonstration-friendly features for academic project evaluation.

---

### **3. INTRODUCTION**

In modern academic environments, students take 5 to 8 subjects simultaneously, each with distinct syllabi, assignments, lab sessions, and exam dates. Traditional paper planners or generic note-taking apps present several limitations:
- **Lack of Integration:** Deadlines, study hours, and subject lists remain disconnected across multiple notes.
- **Manual Calculation:** Students cannot easily calculate weekly study hours or subject time distribution without manual arithmetic.
- **Inconsistency:** Without visual streak tracking and daily reminders, maintaining a routine becomes difficult.

**StudyBloom — Student Study Planner** addresses these issues by offering a centralized web application specifically tailored to college students. It provides actionable answers to:
1. *"What do I need to study today?"*
2. *"How much progress have I made this week?"*

---

### **4. PROBLEM STATEMENT**

College students frequently experience stress and inefficiency due to fragmented academic management. Existing enterprise tools (like Jira or Trello) are overengineered for simple student study routines, while basic todo apps lack subject grouping, exam countdowns, Pomodoro tracking, and study streak analytics. There is a need for an easy-to-use, aesthetically pleasing, and centralized digital study planner that runs efficiently on web platforms.

---

### **5. OBJECTIVES**

1. Develop a clean, responsive web interface using React and Tailwind CSS.
2. Build a modular RESTful API backend using Node.js and Express.js.
3. Model student academic records (Subjects, Planner Sessions, Assignments, Exams, Pomodoros) in MongoDB using Mongoose.
4. Implement secure JSON Web Token (JWT) authentication and bcrypt password hashing.
5. Provide live analytics including weekly study hours, subject time distribution, task completion rates, and daily study streaks.
6. Design an in-app reminder system for upcoming exams and overdue assignments.

---

### **6. SCOPE**

#### **In-Scope (Implemented Features)**
- User registration, login, JWT token persistence, and profile management.
- CRUD operations for Academic Subjects (with short code, difficulty, target %, theme color).
- Daily Study Planner with priority levels, duration, and completion toggles.
- Interactive Academic Calendar with Monthly and Agenda views.
- Assignment tracker with priority, due date, status filtering, and overdue warnings.
- Exam countdown manager with preparation confidence percentage slider.
- 25/5 Pomodoro Timer with automated database session logging.
- Real-time Analytics Dashboard (Weekly hours chart, subject distribution %, streak count).
- Demo seed script (`node seed.js`) for viva demonstration readiness.

#### **Out-Of-Scope (Future Scope Boundaries)**
- No push notification infrastructure or SMS/email gateways.
- No AI/ML predictive scheduling algorithms.
- No real-time WebSockets or microservices.
- No cloud file upload attachments or OAuth login.

---

### **7. PROPOSED SYSTEM**

The proposed **StudyBloom** system replaces paper logs and scattered notes with a unified database-backed platform. Students log in, register their subjects, schedule daily study sessions, track project assignments, manage exam preparation, and monitor progress metrics on an interactive dashboard.

```
+-------------------------------------------------------------------+
|                           STUDENT USER                            |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|               REACT 18 FRONTEND (Vite + Tailwind CSS)             |
|  - Dashboard, Planner, Calendar, Subjects, Assignments, Exams,    |
|    Pomodoro Timer, Analytics, Profile                             |
+-------------------------------------------------------------------+
                                  | (HTTPS / REST API JSON)
                                  v
+-------------------------------------------------------------------+
|                  EXPRESS.JS BACKEND (Node.js API)                 |
|  - JWT Middleware Auth, Controllers, Validation, Router            |
+-------------------------------------------------------------------+
                                  | (Mongoose ODM Queries)
                                  v
+-------------------------------------------------------------------+
|                    MONGODB DATABASE (NoSQL Storage)               |
|  - Users, Subjects, StudySessions, Assignments, Exams, Pomodoros |
+-------------------------------------------------------------------+
```

---

### **8. EXISTING SYSTEM VS. PROPOSED SYSTEM**

| Feature | Existing System (Paper / Notes Apps) | Proposed System (StudyBloom) |
| :--- | :--- | :--- |
| **Data Centralization** | Fragmented across notebooks/apps | Single unified database |
| **Progress Calculation** | Manual calculation | Automated live charts & hours totals |
| **Exam Countdown** | Manually counting calendar days | Automated daily countdown & prep slider |
| **Focus Management** | External timer needed | Built-in Pomodoro timer linked to database |
| **Study Streak** | Not available | Calculated automatically based on daily activity |
| **Overdue Warnings** | Requires manual check | Automated visual warning indicators |

---

### **9. FUNCTIONAL REQUIREMENTS**

1. **Authentication:** Register, Login, Token storage, Logout, Route protection.
2. **Subject Management:** Create, Read, Update, Delete subjects.
3. **Planner Management:** Create study sessions with date, time, duration, topic, and mark completed.
4. **Assignment Tracking:** Manage project tasks, due dates, priority, status, and overdue flags.
5. **Exam Management:** Track exam dates, locations, notes, and preparation percentage.
6. **Pomodoro Timer:** Run 25-min study timer, log session on completion.
7. **Analytics:** Calculate weekly hours breakdown, subject %, task counts, and streak.
8. **Profile:** Update student name, degree course, semester, division, and daily study goal.

---

### **10. NON-FUNCTIONAL REQUIREMENTS**

- **Usability:** Soft pink palette (#EC4899), intuitive navigation sidebar, rounded cards, clear empty states.
- **Performance:** Fast initial page loads via Vite bundle optimization (<1.5s load time).
- **Reliability:** Centralized Express error handler prevents server crashes.
- **Security:** Hashed passwords using `bcryptjs` (salt factor 10), sanitized JWT auth header validation.
- **Responsiveness:** Fully functional on mobile screens, tablets, and desktop displays.

---

### **11. HARDWARE REQUIREMENTS**

#### **Minimum Requirements**
- **Processor:** Dual-Core Intel/AMD Processor 2.0 GHz
- **RAM:** 4 GB DDR4
- **Disk Space:** 500 MB free space
- **Display:** 1280 x 720 resolution screen

---

### **12. SOFTWARE REQUIREMENTS**

- **Operating System:** Windows 10/11, macOS, or Linux
- **Runtime Environment:** Node.js (v18.0.0 or higher)
- **Database Server:** MongoDB Community Edition (v6.0+) or MongoDB Atlas
- **Frontend Tools:** React 18, Vite 5, Tailwind CSS 3
- **Web Browser:** Google Chrome, Mozilla Firefox, or Microsoft Edge

---

### **13. TECHNOLOGY EXPLANATION**

- **React:** Component-based UI library used to build a dynamic, single-page application (SPA).
- **Vite:** Next-generation frontend build tool providing lightning-fast Hot Module Replacement (HMR).
- **Tailwind CSS:** Utility-first CSS framework configured with custom tokens for StudyBloom's soft pink identity.
- **Node.js & Express.js:** Lightweight server runtime and web framework for building RESTful endpoints.
- **MongoDB & Mongoose:** Flexible NoSQL database with Mongoose schema modeling and validation.
- **JWT (JSON Web Token):** Stateless authentication standard encoding user ID into encrypted bearer tokens.

---

### **14. SYSTEM ARCHITECTURE**

```
Client (Browser) -> Axios HTTP Request -> Express App Router -> Auth Middleware -> Controller -> Mongoose Model -> MongoDB Engine
```

Every incoming client request passes through JWT authentication verification. Valid requests trigger business logic in controllers, query MongoDB via Mongoose ORM models, and return JSON payloads back to React state hooks.

---

### **15. DATABASE ARCHITECTURE**

#### **1. Users Collection (`users`)**
| Field | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Unique user identifier |
| `name` | String | Required | Full student name |
| `email` | String | Unique, Required | Student email address |
| `password` | String | Required | Bcrypt hashed password |
| `course` | String | Default: B.Sc. CS | Degree program |
| `semester` | Number | Default: 3 | Current semester |
| `division` | String | Default: A | Class division |
| `dailyStudyGoal`| Number | Default: 4 | Daily target study hours |

#### **2. Subjects Collection (`subjects`)**
| Field | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Subject identifier |
| `userId` | ObjectId | Ref: User | Foreign key reference |
| `name` | String | Required | Subject title (e.g. Mathematics) |
| `code` | String | Required | Short code (e.g. MATH301) |
| `teacher` | String | Optional | Instructor name |
| `difficulty` | String | Easy/Medium/Hard | Subject difficulty level |
| `targetPercentage`| Number | 0 - 100 | Target score percentage |
| `color` | String | Hex Code | Visual theme color |

#### **3. StudySessions Collection (`studysessions`)**
| Field | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Session identifier |
| `userId` | ObjectId | Ref: User | Student owner |
| `subjectId` | ObjectId | Ref: Subject | Associated subject |
| `topic` | String | Required | Topic name |
| `date` | Date | Required | Scheduled date |
| `startTime` | String | Required | Time string (e.g. 09:00) |
| `duration` | Number | Min: 5 | Duration in minutes |
| `priority` | String | Low/Medium/High | Session priority |
| `completed` | Boolean | Default: false | Completion status |
| `completedAt` | Date | Optional | Timestamp when completed |

#### **4. Assignments Collection (`assignments`)**
| Field | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Assignment identifier |
| `userId` | ObjectId | Ref: User | Student owner |
| `subjectId` | ObjectId | Ref: Subject | Associated subject |
| `title` | String | Required | Assignment title |
| `description` | String | Optional | Guidelines/details |
| `dueDate` | Date | Required | Submission deadline |
| `priority` | String | Low/Medium/High | Priority level |
| `status` | String | Pending/In Progress/Completed | Current status |

#### **5. Exams Collection (`exams`)**
| Field | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Exam identifier |
| `userId` | ObjectId | Ref: User | Student owner |
| `subjectId` | ObjectId | Ref: Subject | Associated subject |
| `name` | String | Required | Exam title |
| `date` | Date | Required | Examination date |
| `time` | String | Default: 10:00 AM| Exam time |
| `location` | String | Optional | Hall/Room location |
| `preparationPercentage`| Number | 0 - 100 | Student prep level |

#### **6. PomodoroSessions Collection (`pomodorosessions`)**
| Field | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Pomodoro record ID |
| `userId` | ObjectId | Ref: User | Student owner |
| `subjectId` | ObjectId | Ref: Subject | Linked subject (optional) |
| `duration` | Number | Default: 25 | Focus duration mins |
| `completed` | Boolean | Default: true | Completion flag |

---

### **16. DATABASE RELATIONSHIP EXPLANATION**

- **User → Subjects (1 : N):** A single User can add multiple subjects.
- **User → StudySessions (1 : N):** A User can create many study sessions.
- **Subject → StudySessions (1 : N):** Each StudySession belongs to one Subject via `subjectId`.
- **User → Assignments (1 : N):** Assignments belong to a User.
- **Subject → Assignments (1 : N):** Assignments are tied to specific Subjects.
- **User → Exams (1 : N):** Exam records are owned by a User and referenced to a Subject.

---

### **17. ER-STYLE CONCEPTUAL DIAGRAM**

```
+----------------+        1 : N        +------------------+
|      USER      |-------------------->|     SUBJECT      |
+----------------+                     +------------------+
  |            |                         |            |
  | 1:N        | 1:N                     | 1:N        | 1:N
  v            v                         v            v
+--------------------+                 +--------------------+
|   STUDY_SESSION    |                 |     ASSIGNMENT     |
+--------------------+                 +--------------------+
  |                                      |
  | 1:N                                  | 1:N
  v                                      v
+--------------------+                 +--------------------+
|  POMODORO_SESSION  |                 |        EXAM        |
+--------------------+                 +--------------------+
```

---

### **18. API DOCUMENTATION**

#### **Authentication Endpoints**
- `POST /api/auth/register` — Registers new user. Request: `{ name, email, password, course, semester, division }`.
- `POST /api/auth/login` — Authenticates email/password and returns JWT token.
- `GET /api/auth/me` — Returns current logged-in user profile.

#### **Subjects Endpoints**
- `GET /api/subjects` — Returns user's subjects list.
- `POST /api/subjects` — Creates subject. Request: `{ name, code, teacher, difficulty, targetPercentage, color }`.
- `PUT /api/subjects/:id` — Updates existing subject.
- `DELETE /api/subjects/:id` — Removes subject and associated tasks.

#### **Study Sessions Endpoints**
- `GET /api/study-sessions` — Returns sessions (supports `?date=`, `?subjectId=`, `?completed=`).
- `POST /api/study-sessions` — Creates session. Request: `{ subjectId, topic, date, startTime, duration, priority, notes }`.
- `PATCH /api/study-sessions/:id/complete` — Toggles session completion state.

#### **Analytics Endpoints**
- `GET /api/analytics/dashboard` — Returns summary cards totals, schedule, next exam, notifications.
- `GET /api/analytics/weekly` — Returns Mon–Sun study hours, subject distribution %, and streak.

---

### **19. AUTHENTICATION FLOW**

1. Student enters Email & Password on `/login`.
2. Request is sent to `POST /api/auth/login`.
3. Backend retrieves User record from MongoDB and compares hashed passwords using `bcrypt.compare()`.
4. On success, backend signs a JWT token containing `userId` and returns it.
5. React stores JWT in `localStorage` under `studybloom_token`.
6. Subsequent Axios requests attach `Authorization: Bearer <token>` in HTTP headers.
7. Backend `protect` middleware verifies token on protected routes.

---

### **20. FEATURE WORKING**

- **Dashboard Page:** Aggregates live data from `GET /api/analytics/dashboard`. Renders greeting, summary stat cards, today's schedule, upcoming assignments/exams, and weekly chart.
- **Planner Page:** Allows creation, filtering, editing, deletion, and completion toggles for study sessions.
- **Calendar Page:** Formats sessions, assignments, and exams into an interactive Monthly & Agenda view with detail modals.
- **Pomodoro Page:** Runs 25-minute timer countdown with SVG progress ring. On zero, automatically posts session log to `/api/pomodoro`.

---

### **21. STUDY STREAK ALGORITHM**

The streak algorithm checks for consecutive completed study sessions or Pomodoros:

```
FUNCTION calculateStreak(userId):
    FETCH all completed StudySessions & PomodoroSessions for userId
    EXTRACT unique dates formatted as "YYYY-MM-DD" into completedDatesSet

    IF completedDatesSet IS EMPTY:
        RETURN 0

    today = CURRENT_DATE ("YYYY-MM-DD")
    yesterday = PREVIOUS_DATE ("YYYY-MM-DD")

    IF today NOT IN completedDatesSet AND yesterday NOT IN completedDatesSet:
        RETURN 0

    currentCheckDate = today IN completedDatesSet ? today : yesterday
    streakCount = 0

    WHILE currentCheckDate IN completedDatesSet:
        streakCount = streakCount + 1
        currentCheckDate = SUBTRACT_ONE_DAY(currentCheckDate)

    RETURN streakCount
END FUNCTION
```

---

### **22. ANALYTICS CALCULATION FORMULAS**

1. **Today's Study Hours:**  
   $$\text{Today Hours} = \frac{\sum \text{Session Minutes (Today)} + \sum \text{Pomodoro Minutes (Today)}}{60}$$

2. **Subject Distribution Percentage:**  
   $$\text{Subject } i \text{ Percentage} = \left( \frac{\text{Minutes Spent on Subject } i}{\text{Total Study Minutes across All Subjects}} \right) \times 100$$

---

### **23. CRUD OPERATIONS**

- **Create:** `POST` endpoints (`/api/subjects`, `/api/study-sessions`, `/api/assignments`, `/api/exams`).
- **Read:** `GET` endpoints with filtering parameters.
- **Update:** `PUT` / `PATCH` endpoints (`/api/study-sessions/:id/complete`, `/api/exams/:id`).
- **Delete:** `DELETE` endpoints with modal confirmation before execution.

---

### **24. DATA VALIDATION**

- **Frontend:** HTML5 required attributes, type checks, password confirmation matching, min length validation.
- **Backend:** Express controller validation, Mongoose schema type rules (`enum` checks, `min`/`max` percentage rules).

---

### **25. ERROR HANDLING**

Centralized Express middleware (`server/middleware/errorHandler.js`) handles server errors cleanly:
- 400 Bad Request (Missing required fields)
- 401 Unauthorized (Invalid JWT token)
- 404 Not Found (Resource missing)
- 500 Server Error (Friendly JSON message without exposing full code stack traces in production).

---

### **26. SECURITY MEASURES**

- **Password Hashing:** Passwords hashed with `bcryptjs` salt rounds = 10.
- **Protected Endpoints:** JWT middleware guards all private data endpoints.
- **CORS Configuration:** Explicit CORS middleware restricts unauthorized origin access.
- **Environment Isolation:** Secrets stored in `.env` files.

---

### **27. USER INTERFACE EXPLANATION**

- **Aesthetic:** Soft pastel pink theme (`#EC4899` primary, `#FCE7F3` soft pink, `#FFF7FB` background).
- **Component Design:** Soft shadows, rounded card borders (`rounded-2xl`, `rounded-3xl`), responsive mobile collapsible sidebar.
- **Feedback:** Loading skeletons, disabled button state spinners, and empty states.

---

### **28. TESTING DOCUMENTATION (TEST CASES)**

| Test Case ID | Feature | Test Input | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC01** | Registration | Valid details | Account created, JWT returned | PASS |
| **TC02** | Registration | Mismatched passwords | Error "Passwords do not match" | PASS |
| **TC03** | Registration | Existing email | Error "Email address already registered" | PASS |
| **TC04** | Login | Valid credentials | Redirect to `/dashboard` | PASS |
| **TC05** | Login | Incorrect password | Error "Invalid email or password" | PASS |
| **TC06** | Add Subject | Valid name & code | Subject card displayed in grid | PASS |
| **TC07** | Edit Subject | Change target % to 90% | Subject updated in database | PASS |
| **TC08** | Delete Subject | Click delete & confirm | Subject & related items removed | PASS |
| **TC09** | Create Session | Topic & duration | Session added to planner | PASS |
| **TC10** | Toggle Session | Click checkbox | Session marked done, hours update | PASS |
| **TC11** | Filter Planner | Select subject | Shows only sessions for that subject | PASS |
| **TC12** | Add Assignment | Due date in 3 days | Assignment card added | PASS |
| **TC13** | Assignment Status| Change to "Completed" | Status updated in DB | PASS |
| **TC14** | Overdue Warning | Due date in past | Red overdue alert displayed | PASS |
| **TC15** | Add Exam | Exam date & prep % | Exam card & countdown rendered | PASS |
| **TC16** | Update Prep % | Move slider to 80% | Preparation % saved in DB | PASS |
| **TC17** | Start Pomodoro | Click "Start Timer" | 25-minute countdown starts | PASS |
| **TC18** | Complete Pomodoro| Timer hits 00:00 | Session logged to MongoDB | PASS |
| **TC19** | Dashboard Stats | Load dashboard | Live stats fetched from DB | PASS |
| **TC20** | Profile Update | Change daily goal to 5h | Profile updated in DB | PASS |

---

### **29. ADVANTAGES**

1. **Student-Tailored Design:** Combines subjects, sessions, exams, and Pomodoro timer into one app.
2. **Dynamic Analytics:** Calculates live study hours, weekly trends, and subject breakdown.
3. **Demo Ready:** Seeding script populates complete demo data instantly.
4. **No Overengineering:** Simple architecture easy to explain during a viva presentation.

---

### **30. LIMITATIONS**

1. No automatic timetable creation algorithms.
2. No native mobile push notifications.
3. No multi-user real-time collaboration or group study chats.
4. No cloud file attachment storage for assignment submissions.

---

### **31. FUTURE SCOPE**

- Mobile native applications (React Native / Android).
- Google Calendar sync integration.
- AI-driven study timetable recommendations.
- Collaborative peer study groups and shared assignment notes.

---

### **32. CONCLUSION**

**StudyBloom — Student Study Planner** demonstrates a complete, functional full-stack web application built according to modern web standards. By combining React, Node.js, Express, and MongoDB, the system solves real-world study management problems for college students while maintaining an easy-to-understand codebase suitable for college field project evaluation.

---

### **33. VIVA EXAMINATION Q&A GUIDE**

#### **Q1: What is the main purpose of this project?**
> **Answer:** StudyBloom is a full-stack student productivity application that allows college students to manage subjects, daily study sessions, project assignments, exam preparation, and focus timers while viewing live database-calculated analytics.

#### **Q2: Why did you choose MongoDB over a relational SQL database?**
> **Answer:** MongoDB's document model fits hierarchical student study records (e.g., subjects with embedded properties, varying session notes) and allows fast development with Mongoose schemas without complex SQL migration scripts.

#### **Q3: How does JWT Authentication work in your application?**
> **Answer:** When a user logs in, the backend verifies their hashed password with `bcrypt.compare()`, signs a JWT containing the user ID, and sends it to the frontend. The frontend saves it in `localStorage` and includes it as a `Bearer` token in the `Authorization` header of API requests.

#### **Q4: How is the study streak calculated?**
> **Answer:** The system queries all completed study sessions and Pomodoro logs for the user, extracts unique dates formatted as `YYYY-MM-DD`, and checks backwards day-by-day starting from today (or yesterday if today isn't finished yet) to count consecutive active days.

#### **Q5: Are the statistics on the dashboard hardcoded?**
> **Answer:** No. All dashboard statistics—including today's study hours, tasks completed, pending assignments, exam countdowns, weekly charts, and subject distribution percentages—are computed dynamically in the backend from MongoDB query aggregations.
