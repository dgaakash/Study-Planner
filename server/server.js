const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, isUsingInMemory } = require('./config/db');
const { seedDatabase } = require('./utils/seedHelper');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/subjects', require('./routes/subjectRoutes'));
app.use('/api/study-sessions', require('./routes/studySessionRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/exams', require('./routes/examRoutes'));
app.use('/api/pomodoro', require('./routes/pomodoroRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to StudyBloom API Server 🌸',
    version: '1.0.0',
    status: 'Running'
  });
});

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Boot sequence: connect DB first, then start listening
const startServer = async () => {
  try {
    await connectDB();

    // When running with In-Memory DB, auto-seed demo data so the app works instantly
    if (isUsingInMemory()) {
      console.log('📦 In-Memory mode detected — auto-seeding demo data...');
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`🌸 StudyBloom Server ready on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`❌ Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
