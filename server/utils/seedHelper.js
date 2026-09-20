const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Subject = require('../models/Subject');
const StudySession = require('../models/StudySession');
const Assignment = require('../models/Assignment');
const Exam = require('../models/Exam');
const PomodoroSession = require('../models/PomodoroSession');

/**
 * Seeds the currently-connected database with demo data.
 * Called automatically when the server boots with In-Memory MongoDB.
 */
const seedDatabase = async () => {
  // Skip if demo user already exists
  const existing = await User.findOne({ email: 'aakash@student.com' });
  if (existing) {
    console.log('📦 Demo data already exists — skipping seed.');
    return;
  }

  const hashedPassword = await bcrypt.hash('password123', 10);

  const user = await User.create({
    name: 'Aakash Sharma',
    email: 'aakash@student.com',
    password: hashedPassword,
    course: 'B.Sc. Computer Science',
    semester: 3,
    division: 'A',
    dailyStudyGoal: 4
  });

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

  const subMap = {};
  createdSubjects.forEach(s => { subMap[s.name] = s._id; });

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  await StudySession.insertMany([
    { userId: user._id, subjectId: subMap['Mathematics'], topic: 'Integration & Calculus Theorems', date: todayStart, startTime: '09:00', duration: 60, priority: 'High', notes: 'Solve textbook exercises 4.1 to 4.5', completed: true, completedAt: new Date() },
    { userId: user._id, subjectId: subMap['Economics'], topic: 'National Income Analysis', date: todayStart, startTime: '11:00', duration: 45, priority: 'Medium', notes: 'Review Keynesian multiplier formulas', completed: true, completedAt: new Date() },
    { userId: user._id, subjectId: subMap['Data Structures'], topic: 'Binary Search Trees & AVL Rotations', date: todayStart, startTime: '14:00', duration: 90, priority: 'High', notes: 'Practice left and right rotation code', completed: false }
  ]);

  const in3 = new Date(now); in3.setDate(in3.getDate() + 3);
  const in5 = new Date(now); in5.setDate(in5.getDate() + 5);
  const in7 = new Date(now); in7.setDate(in7.getDate() + 7);

  await Assignment.insertMany([
    { userId: user._id, subjectId: subMap['Data Structures'], title: 'AVL Tree Implementation Report', description: 'Submit C++ code implementation along with time complexity analysis.', dueDate: in3, priority: 'High', status: 'In Progress' },
    { userId: user._id, subjectId: subMap['Database Management'], title: 'SQL Schema & Normalization Assignment', description: 'Design 3NF database schema for hospital management domain.', dueDate: in5, priority: 'Medium', status: 'Pending' },
    { userId: user._id, subjectId: subMap['Web Development'], title: 'Responsive Dashboard Frontend Project', description: 'Build responsive grid dashboard using HTML5 and CSS Tailwind.', dueDate: in7, priority: 'Medium', status: 'Completed' }
  ]);

  const in12 = new Date(now); in12.setDate(in12.getDate() + 12);
  const in18 = new Date(now); in18.setDate(in18.getDate() + 18);

  await Exam.insertMany([
    { userId: user._id, subjectId: subMap['Mathematics'], name: 'Mathematics Mid-Semester Exam', date: in12, time: '10:00 AM', location: 'Hall B', notes: 'Covers Units 1 to 3', preparationPercentage: 72 },
    { userId: user._id, subjectId: subMap['Data Structures'], name: 'Data Structures Practical Viva', date: in18, time: '02:00 PM', location: 'Computer Lab 3', notes: 'Trees, Graphs, Sorting algorithms', preparationPercentage: 65 }
  ]);

  await PomodoroSession.insertMany([
    { userId: user._id, subjectId: subMap['Mathematics'], duration: 25, completed: true, completedAt: new Date() },
    { userId: user._id, subjectId: subMap['Data Structures'], duration: 25, completed: true, completedAt: new Date() },
    { userId: user._id, subjectId: subMap['Economics'], duration: 25, completed: true, completedAt: new Date() }
  ]);

  console.log('🌱 Auto-seeded demo data for: aakash@student.com / password123');
};

module.exports = { seedDatabase };
