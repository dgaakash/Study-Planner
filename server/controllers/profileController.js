const User = require('../models/User');
const StudySession = require('../models/StudySession');
const Assignment = require('../models/Assignment');
const PomodoroSession = require('../models/PomodoroSession');
const { calculateStreak } = require('../utils/streakCalculator');

// @desc    Get user profile with full statistics
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const [completedSessions, completedAssignments, pomodoroSessions, streakDays] = await Promise.all([
      StudySession.countDocuments({ userId: req.user._id, completed: true }),
      Assignment.countDocuments({ userId: req.user._id, status: 'Completed' }),
      PomodoroSession.countDocuments({ userId: req.user._id, completed: true }),
      calculateStreak(req.user._id)
    ]);

    res.json({
      user,
      stats: {
        completedSessions,
        completedAssignments,
        totalPomodoros: pomodoroSessions,
        streakDays,
        accountCreated: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile details
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, course, semester, division, dailyStudyGoal } = req.body;

    user.name = name || user.name;
    user.course = course || user.course;
    user.semester = semester !== undefined ? Number(semester) : user.semester;
    user.division = division || user.division;
    user.dailyStudyGoal = dailyStudyGoal !== undefined ? Number(dailyStudyGoal) : user.dailyStudyGoal;

    const updatedUser = await user.save();
    
    // Omit password from response
    const userObj = updatedUser.toObject();
    delete userObj.password;

    res.json(userObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile
};
