# ExamMap — REST API Backend

> **Plan Smart. Study Better. Score Confidently.**  
> *Node.js & Express REST API backend for ExamMap study planning and syllabus tracking.*

[![Node.js](https://img.shields.io/badge/Runtime-Node.js_v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Framework-Express_4-black?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_|_Mongoose-47A248?logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT_|_bcrypt-black?logo=json-web-tokens&logoColor=white)](https://jwt.io/)

---

## 📌 Architecture & Modules

- **Authentication**: JWT token-based auth with bcrypt password hashing (`controllers/authController.js`)
- **Subjects API**: Full CRUD for semester courses (`controllers/subjectController.js`)
- **Topics API**: Syllabus unit topics and completion tracking (`controllers/topicController.js`)
- **Study Plans API**: Session scheduling & Pomodoro tracking (`controllers/studyPlanController.js`)
- **Exams API**: Exam schedules & days-left countdown calculations (`controllers/examController.js`)
- **Analytics API**: Aggregated progress, hours, and subject breakdown (`controllers/analyticsController.js`)

---

## 🚀 Setup & Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the backend root:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/exammap
JWT_SECRET=exammap_super_secret_jwt_key_2026_secure
JWT_EXPIRE=30d
```

### 3. Start Server
```bash
# Production mode
npm start

# Development mode (with nodemon)
npm run dev
```

Server runs on `http://localhost:5000`.
