const PomodoroSession = require('../models/PomodoroSession');

// @desc    Get Pomodoro statistics
// @route   GET /api/pomodoro
// @access  Private
const getPomodoroStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Today's pomodoros
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    const todaySessions = await PomodoroSession.find({
      userId,
      completed: true,
      completedAt: { $gte: startOfDay, $lte: endOfDay }
    }).populate('subjectId', 'name shortCode color');

    // Total pomodoros
    const totalSessions = await PomodoroSession.find({
      userId,
      completed: true
    });

    const todayCount = todaySessions.length;
    const todayMinutes = todaySessions.reduce((sum, s) => sum + (s.duration || 25), 0);

    const totalCount = totalSessions.length;
    const totalMinutes = totalSessions.reduce((sum, s) => sum + (s.duration || 25), 0);

    res.json({
      todayCount,
      todayMinutes,
      totalCount,
      totalMinutes,
      recentSessions: todaySessions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Record a completed Pomodoro session
// @route   POST /api/pomodoro
// @access  Private
const createPomodoroSession = async (req, res) => {
  try {
    const { subjectId, duration } = req.body;

    const pomodoro = await PomodoroSession.create({
      userId: req.user._id,
      subjectId: subjectId || null,
      duration: duration || 25,
      completed: true,
      completedAt: new Date()
    });

    const populated = await PomodoroSession.findById(pomodoro._id).populate('subjectId', 'name shortCode color');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPomodoroStats,
  createPomodoroSession
};
