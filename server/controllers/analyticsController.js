const StudySession = require('../models/StudySession');
const Assignment = require('../models/Assignment');
const Exam = require('../models/Exam');
const Subject = require('../models/Subject');
const PomodoroSession = require('../models/PomodoroSession');
const { calculateStreak } = require('../utils/streakCalculator');
const { getUserNotifications } = require('../utils/notificationHelper');

// @desc    Get Summary dashboard data
// @route   GET /api/analytics/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    // 1. Today's Study Sessions & Pomodoros
    const [todayStudySessions, todayPomodoros] = await Promise.all([
      StudySession.find({
        userId,
        date: { $gte: startOfDay, $lte: endOfDay }
      }).populate('subjectId', 'name code color'),
      PomodoroSession.find({
        userId,
        completed: true,
        completedAt: { $gte: startOfDay, $lte: endOfDay }
      })
    ]);

    const completedTodaySessions = todayStudySessions.filter(s => s.completed);
    const studySessionMinutes = completedTodaySessions.reduce((acc, s) => acc + (s.duration || 0), 0);
    const pomodoroMinutes = todayPomodoros.reduce((acc, p) => acc + (p.duration || 25), 0);
    const todayStudyHours = Number(((studySessionMinutes + pomodoroMinutes) / 60).toFixed(1));

    // 2. Tasks Completed (Completed study sessions + completed assignments today/total)
    const completedAssignmentsCount = await Assignment.countDocuments({ userId, status: 'Completed' });
    const completedSessionsCount = await StudySession.countDocuments({ userId, completed: true });
    const totalTasksCompleted = completedAssignmentsCount + completedSessionsCount;

    // 3. Pending Assignments
    const pendingAssignmentsCount = await Assignment.countDocuments({ userId, status: { $ne: 'Completed' } });

    // 4. Next Upcoming Exam
    const upcomingExams = await Exam.find({
      userId,
      date: { $gte: startOfDay }
    }).populate('subjectId', 'name code color').sort({ date: 1 }).limit(1);

    let nextExam = null;
    if (upcomingExams.length > 0) {
      const exam = upcomingExams[0];
      const examDate = new Date(exam.date);
      const diffTime = examDate - now;
      const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

      nextExam = {
        _id: exam._id,
        name: exam.name,
        subject: exam.subjectId ? exam.subjectId.name : 'General',
        subjectCode: exam.subjectId ? exam.subjectId.code : '',
        subjectColor: exam.subjectId ? exam.subjectId.color : '#EC4899',
        date: exam.date,
        time: exam.time,
        location: exam.location,
        daysRemaining,
        preparationPercentage: exam.preparationPercentage
      };
    }

    // 5. Upcoming Assignments (Top 3)
    const upcomingAssignments = await Assignment.find({
      userId,
      status: { $ne: 'Completed' }
    }).populate('subjectId', 'name code color').sort({ dueDate: 1 }).limit(3);

    // 6. Upcoming Exams (Top 3)
    const topExams = await Exam.find({
      userId,
      date: { $gte: startOfDay }
    }).populate('subjectId', 'name code color').sort({ date: 1 }).limit(3);

    // 7. Calculate Streak
    const streakDays = await calculateStreak(userId);

    // 8. Generate In-app notifications
    const notifications = await getUserNotifications(userId);

    res.json({
      studentName: req.user.name,
      dailyStudyGoal: req.user.dailyStudyGoal || 4,
      todayStudyHours,
      tasksCompleted: totalTasksCompleted,
      pendingAssignments: pendingAssignmentsCount,
      nextExam,
      todaySchedule: todayStudySessions,
      upcomingAssignments,
      upcomingExams: topExams,
      streakDays,
      notifications
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Detailed Weekly & Monthly Analytics
// @route   GET /api/analytics/weekly
// @access  Private
const getWeeklyAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    // 1. Calculate Monday through Sunday for current week
    const currentDayOfWeek = now.getDay(); // 0 is Sun, 1 is Mon...
    const distanceToMon = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    
    const monday = new Date(now);
    monday.setDate(now.getDate() + distanceToMon);
    monday.setHours(0, 0, 0, 0);

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklyProgress = [];

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + i);
      const dayStart = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), 0, 0, 0);
      const dayEnd = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), 23, 59, 59);

      const [sessions, pomodoros] = await Promise.all([
        StudySession.find({
          userId,
          completed: true,
          date: { $gte: dayStart, $lte: dayEnd }
        }),
        PomodoroSession.find({
          userId,
          completed: true,
          completedAt: { $gte: dayStart, $lte: dayEnd }
        })
      ]);

      const sessionMins = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
      const pomodoroMins = pomodoros.reduce((acc, p) => acc + (p.duration || 25), 0);
      const totalHours = Number(((sessionMins + pomodoroMins) / 60).toFixed(1));

      weeklyProgress.push({
        day: weekDays[i],
        date: dayDate.toISOString().split('T')[0],
        hours: totalHours
      });
    }

    // 2. Subject Distribution Calculation
    const subjects = await Subject.find({ userId });
    const completedSessions = await StudySession.find({ userId, completed: true }).populate('subjectId');
    const pomodoroSessions = await PomodoroSession.find({ userId, completed: true }).populate('subjectId');

    const subjectMinutesMap = {};
    subjects.forEach(sub => {
      subjectMinutesMap[sub._id.toString()] = {
        name: sub.name,
        code: sub.code,
        color: sub.color,
        minutes: 0
      };
    });

    completedSessions.forEach(s => {
      if (s.subjectId && subjectMinutesMap[s.subjectId._id.toString()]) {
        subjectMinutesMap[s.subjectId._id.toString()].minutes += (s.duration || 0);
      }
    });

    pomodoroSessions.forEach(p => {
      if (p.subjectId && subjectMinutesMap[p.subjectId._id.toString()]) {
        subjectMinutesMap[p.subjectId._id.toString()].minutes += (p.duration || 25);
      }
    });

    const totalMinutes = Object.values(subjectMinutesMap).reduce((sum, item) => sum + item.minutes, 0);
    
    const subjectDistribution = Object.values(subjectMinutesMap).map(item => ({
      name: item.name,
      code: item.code,
      color: item.color,
      minutes: item.minutes,
      percentage: totalMinutes > 0 ? Math.round((item.minutes / totalMinutes) * 100) : 0
    }));

    // 3. Task Completion Stats
    const [pendingCount, inProgressCount, completedCount] = await Promise.all([
      Assignment.countDocuments({ userId, status: 'Pending' }),
      Assignment.countDocuments({ userId, status: 'In Progress' }),
      Assignment.countDocuments({ userId, status: 'Completed' })
    ]);

    // 4. Study Hours Overview (Today, Week, Month)
    const startOfWeek = monday;
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [weekSessions, weekPomodoros, monthSessions, monthPomodoros] = await Promise.all([
      StudySession.find({ userId, completed: true, date: { $gte: startOfWeek } }),
      PomodoroSession.find({ userId, completed: true, completedAt: { $gte: startOfWeek } }),
      StudySession.find({ userId, completed: true, date: { $gte: startOfMonth } }),
      PomodoroSession.find({ userId, completed: true, completedAt: { $gte: startOfMonth } })
    ]);

    const weekMins = weekSessions.reduce((acc, s) => acc + (s.duration || 0), 0) + weekPomodoros.reduce((acc, p) => acc + (p.duration || 25), 0);
    const monthMins = monthSessions.reduce((acc, s) => acc + (s.duration || 0), 0) + monthPomodoros.reduce((acc, p) => acc + (p.duration || 25), 0);

    const streakDays = await calculateStreak(userId);

    res.json({
      weeklyProgress,
      subjectDistribution,
      taskCompletion: {
        completed: completedCount,
        pending: pendingCount,
        inProgress: inProgressCount
      },
      studyHours: {
        thisWeekHours: Number((weekMins / 60).toFixed(1)),
        thisMonthHours: Number((monthMins / 60).toFixed(1))
      },
      streakDays
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getWeeklyAnalytics
};
