const StudySession = require('../models/StudySession');
const PomodoroSession = require('../models/PomodoroSession');

/**
 * Calculates current study streak (consecutive days with completed study session or Pomodoro)
 * @param {String} userId 
 * @returns {Promise<Number>} streak count in days
 */
const calculateStreak = async (userId) => {
  try {
    // Fetch completed study sessions & pomodoros
    const [sessions, pomodoros] = await Promise.all([
      StudySession.find({ userId, completed: true }).select('completedAt date'),
      PomodoroSession.find({ userId, completed: true }).select('completedAt createdAt')
    ]);

    // Gather all completed dates formatted as YYYY-MM-DD
    const completedDatesSet = new Set();

    sessions.forEach(s => {
      const d = s.completedAt || s.date;
      if (d) {
        completedDatesSet.add(new Date(d).toISOString().split('T')[0]);
      }
    });

    pomodoros.forEach(p => {
      const d = p.completedAt || p.createdAt;
      if (d) {
        completedDatesSet.add(new Date(d).toISOString().split('T')[0]);
      }
    });

    if (completedDatesSet.size === 0) return 0;

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Determine starting date for backwards iteration
    let currentDate = new Date();
    
    // If today is completed, start check from today.
    // If today is NOT completed yet, check if yesterday was completed to keep current active streak alive.
    if (!completedDatesSet.has(todayStr)) {
      if (completedDatesSet.has(yesterdayStr)) {
        currentDate = yesterday;
      } else {
        return 0; // Missed yesterday and today -> streak reset
      }
    }

    let streak = 0;
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      if (completedDatesSet.has(dateStr)) {
        streak++;
        // Move to previous day
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error('Error calculating study streak:', error);
    return 0;
  }
};

module.exports = { calculateStreak };
