const Assignment = require('../models/Assignment');
const Exam = require('../models/Exam');
const StudySession = require('../models/StudySession');

/**
 * Dynamically computes notifications for a user based on due dates, upcoming exams, etc.
 * @param {String} userId 
 * @returns {Promise<Array>} List of notification objects
 */
const getUserNotifications = async (userId) => {
  const notifications = [];
  const now = new Date();
  
  // 1. Check assignments due in the next 48 hours or overdue
  const assignments = await Assignment.find({ 
    userId, 
    status: { $ne: 'Completed' } 
  }).populate('subjectId', 'name shortCode');

  assignments.forEach(assign => {
    const dueDate = new Date(assign.dueDate);
    const diffTime = dueDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const subjectName = assign.subjectId ? assign.subjectId.name : 'Subject';

    if (diffDays < 0) {
      notifications.push({
        id: `overdue-${assign._id}`,
        type: 'overdue_assignment',
        message: `⚠️ Assignment "${assign.title}" (${subjectName}) was due ${Math.abs(diffDays)} day(s) ago!`,
        priority: 'high',
        createdAt: assign.createdAt
      });
    } else if (diffDays <= 2) {
      notifications.push({
        id: `due-${assign._id}`,
        type: 'assignment_due',
        message: `📝 Assignment "${assign.title}" (${subjectName}) is due ${diffDays === 0 ? 'today' : `in ${diffDays} day(s)`}!`,
        priority: 'medium',
        createdAt: assign.createdAt
      });
    }
  });

  // 2. Check upcoming exams in next 7 days
  const exams = await Exam.find({ userId }).populate('subjectId', 'name shortCode');
  exams.forEach(exam => {
    const examDate = new Date(exam.date);
    const diffTime = examDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const subjectName = exam.subjectId ? exam.subjectId.name : 'Subject';

    if (diffDays >= 0 && diffDays <= 7) {
      notifications.push({
        id: `exam-${exam._id}`,
        type: 'upcoming_exam',
        message: `🎓 ${exam.name} (${subjectName}) is in ${diffDays === 0 ? 'today' : `${diffDays} days`}! Preparation: ${exam.preparationPercentage}%`,
        priority: diffDays <= 2 ? 'high' : 'medium',
        createdAt: exam.createdAt
      });
    }
  });

  // 3. Check today's study sessions
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  
  const todaySessions = await StudySession.find({
    userId,
    date: { $gte: startOfDay, $lte: endOfDay },
    completed: false
  }).populate('subjectId', 'name');

  if (todaySessions.length > 0) {
    notifications.push({
      id: `today-sessions-${startOfDay.toISOString()}`,
      type: 'session_soon',
      message: `🌸 You have ${todaySessions.length} study session(s) scheduled for today. Keep up the momentum!`,
      priority: 'info',
      createdAt: new Date()
    });
  }

  return notifications;
};

module.exports = { getUserNotifications };
