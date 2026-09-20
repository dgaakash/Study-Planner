const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Subject = require('./models/Subject');
const StudySession = require('./models/StudySession');
const Assignment = require('./models/Assignment');
const Exam = require('./models/Exam');
const PomodoroSession = require('./models/PomodoroSession');

const seedData = async () => {
  try {
    const defaultUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/studybloom';

    let conn;
    try {
      conn = await mongoose.connect(defaultUri, { serverSelectionTimeoutMS: 2500 });
      console.log(`Connected to MongoDB for seeding: ${conn.connection.host}`);
    } catch (err) {
      console.log('⚠️ Local MongoDB not detected. Launching MongoMemoryServer for seed...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      conn = await mongoose.connect(mongod.getUri());
      console.log(`Connected to In-Memory MongoDB for seeding: ${conn.connection.host}`);
    }

    // Clear existing sample user
    await User.deleteMany({ email: 'aakash@student.com' });

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Create Sample Student
    const user = await User.create({
      name: 'Aakash Sharma',
      email: 'aakash@student.com',
      password: hashedPassword,
      course: 'B.Sc. Computer Science',
      semester: 3,
      division: 'A',
      dailyStudyGoal: 4
    });

    console.log(`Created Demo User: ${user.name} (${user.email})`);

    // Clean user's past data if any
    await Promise.all([
      Subject.deleteMany({ userId: user._id }),
      StudySession.deleteMany({ userId: user._id }),
      Assignment.deleteMany({ userId: user._id }),
      Exam.deleteMany({ userId: user._id }),
      PomodoroSession.deleteMany({ userId: user._id })
    ]);

    // 2. Create Subjects
    const subjectsData = [
      { name: 'Mathematics', code: 'MATH301', teacher: 'Prof. R. Vance', difficulty: 'Hard', targetPercentage: 88, color: '#EC4899' },
      { name: 'Data Structures', code: 'CS302', teacher: 'Dr. Ananya Roy', difficulty: 'Hard', targetPercentage: 90, color: '#8B5CF6' },
      { name: 'Database Management', code: 'CS303', teacher: 'Prof. K. Patel', difficulty: 'Medium', targetPercentage: 85, color: '#3B82F6' },
      { name: 'Web Development', code: 'CS304', teacher: 'Ms. S. Mehta', difficulty: 'Easy', targetPercentage: 95, color: '#10B981' },
      { name: 'Economics', code: 'ECO305', teacher: 'Dr. M. Kulkarni', difficulty: 'Medium', targetPercentage: 82, color: '#F59E0B' }
    ];

    const createdSubjects = await Subject.insertMany(
      subjectsData.map(s => ({ ...s, userId: user._id }))
    );

    console.log(`Created ${createdSubjects.length} subjects.`);

    const subMap = {};
    createdSubjects.forEach(s => {
      subMap[s.name] = s._id;
    });

    const now = new Date();
    const todayStr = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 3. Create Study Sessions
    const studySessionsData = [
      {
        userId: user._id,
        subjectId: subMap['Mathematics'],
        topic: 'Integration & Calculus Theorems',
        date: todayStr,
        startTime: '09:00',
        duration: 60,
        priority: 'High',
        notes: 'Solve textbook exercises 4.1 to 4.5',
        completed: true,
        completedAt: new Date()
      },
      {
        userId: user._id,
        subjectId: subMap['Economics'],
        topic: 'National Income Analysis',
        date: todayStr,
        startTime: '11:00',
        duration: 45,
        priority: 'Medium',
        notes: 'Review Keynesian multiplier formulas',
        completed: true,
        completedAt: new Date()
      },
      {
        userId: user._id,
        subjectId: subMap['Data Structures'],
        topic: 'Binary Search Trees & AVL Rotations',
        date: todayStr,
        startTime: '14:00',
        duration: 90,
        priority: 'High',
        notes: 'Practice left and right rotation code on LeetCode',
        completed: false
      }
    ];

    await StudySession.insertMany(studySessionsData);
    console.log(`Created study sessions.`);

    // 4. Create Assignments
    const in3Days = new Date(now); in3Days.setDate(in3Days.getDate() + 3);
    const in5Days = new Date(now); in5Days.setDate(in5Days.getDate() + 5);
    const in7Days = new Date(now); in7Days.setDate(in7Days.getDate() + 7);

    const assignmentsData = [
      {
        userId: user._id,
        subjectId: subMap['Data Structures'],
        title: 'AVL Tree Implementation Report',
        description: 'Submit C++ code implementation along with time complexity analysis report.',
        dueDate: in3Days,
        priority: 'High',
        status: 'In Progress'
      },
      {
        userId: user._id,
        subjectId: subMap['Database Management'],
        title: 'SQL Schema & Normalization Assignment',
        description: 'Design 3NF database schema for hospital management domain.',
        dueDate: in5Days,
        priority: 'Medium',
        status: 'Pending'
      },
      {
        userId: user._id,
        subjectId: subMap['Web Development'],
        title: 'Responsive Dashboard Frontend Project',
        description: 'Build responsive grid dashboard using HTML5 and CSS Tailwind.',
        dueDate: in7Days,
        priority: 'Medium',
        status: 'Completed'
      }
    ];

    await Assignment.insertMany(assignmentsData);
    console.log(`Created assignments.`);

    // 5. Create Exams
    const in12Days = new Date(now); in12Days.setDate(in12Days.getDate() + 12);
    const in18Days = new Date(now); in18Days.setDate(in18Days.getDate() + 18);

    const examsData = [
      {
        userId: user._id,
        subjectId: subMap['Mathematics'],
        name: 'Mathematics Mid-Semester Exam',
        date: in12Days,
        time: '10:00 AM',
        location: 'Hall B',
        notes: 'Covers Units 1 to 3: Differential Equations & Matrices',
        preparationPercentage: 72
      },
      {
        userId: user._id,
        subjectId: subMap['Data Structures'],
        name: 'Data Structures Practical Viva',
        date: in18Days,
        time: '02:00 PM',
        location: 'Computer Lab 3',
        notes: 'Trees, Graphs, Sorting algorithms demo',
        preparationPercentage: 65
      }
    ];

    await Exam.insertMany(examsData);
    console.log(`Created exams.`);

    // 6. Create Pomodoro Records
    const pomodorosData = [
      { userId: user._id, subjectId: subMap['Mathematics'], duration: 25, completed: true, completedAt: new Date() },
      { userId: user._id, subjectId: subMap['Data Structures'], duration: 25, completed: true, completedAt: new Date() },
      { userId: user._id, subjectId: subMap['Economics'], duration: 25, completed: true, completedAt: new Date() }
    ];

    await PomodoroSession.insertMany(pomodorosData);
    console.log(`Created Pomodoro session logs.`);

    console.log('\n✅ Database successfully seeded with demo student data!');
    console.log('Login credentials:');
    console.log('Email:    aakash@student.com');
    console.log('Password: password123\n');

    process.exit(0);
  } catch (error) {
    console.error(`Seeding Failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
