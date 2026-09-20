const StudySession = require('../models/StudySession');

// @desc    Get all study sessions (with filtering support)
// @route   GET /api/study-sessions
// @access  Private
const getStudySessions = async (req, res) => {
  try {
    const { date, subjectId, completed } = req.query;
    const filter = { userId: req.user._id };

    if (date) {
      const queryDate = new Date(date);
      const startOfDay = new Date(queryDate.getFullYear(), queryDate.getMonth(), queryDate.getDate());
      const endOfDay = new Date(queryDate.getFullYear(), queryDate.getMonth(), queryDate.getDate(), 23, 59, 59);
      filter.date = { $gte: startOfDay, $lte: endOfDay };
    }

    if (subjectId) {
      filter.subjectId = subjectId;
    }

    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }

    const sessions = await StudySession.find(filter)
      .populate('subjectId', 'name code color')
      .sort({ date: 1, startTime: 1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a study session
// @route   POST /api/study-sessions
// @access  Private
const createStudySession = async (req, res) => {
  try {
    const { subjectId, topic, date, startTime, duration, priority, notes } = req.body;

    if (!subjectId || !topic || !date || !startTime || !duration) {
      return res.status(400).json({ message: 'Subject, topic, date, start time, and duration are required' });
    }

    const session = await StudySession.create({
      userId: req.user._id,
      subjectId,
      topic,
      date: new Date(date),
      startTime,
      duration: Number(duration),
      priority: priority || 'Medium',
      notes: notes || ''
    });

    const populatedSession = await StudySession.findById(session._id).populate('subjectId', 'name code color');
    res.status(201).json(populatedSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a study session
// @route   PUT /api/study-sessions/:id
// @access  Private
const updateStudySession = async (req, res) => {
  try {
    const session = await StudySession.findOne({ _id: req.params.id, userId: req.user._id });

    if (!session) {
      return res.status(404).json({ message: 'Study session not found' });
    }

    const { subjectId, topic, date, startTime, duration, priority, notes, completed } = req.body;

    session.subjectId = subjectId || session.subjectId;
    session.topic = topic || session.topic;
    session.date = date ? new Date(date) : session.date;
    session.startTime = startTime || session.startTime;
    session.duration = duration !== undefined ? Number(duration) : session.duration;
    session.priority = priority || session.priority;
    session.notes = notes !== undefined ? notes : session.notes;
    
    if (completed !== undefined) {
      session.completed = completed;
      session.completedAt = completed ? new Date() : null;
    }

    await session.save();
    const populatedSession = await StudySession.findById(session._id).populate('subjectId', 'name code color');
    res.json(populatedSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle complete status of study session
// @route   PATCH /api/study-sessions/:id/complete
// @access  Private
const toggleCompleteSession = async (req, res) => {
  try {
    const session = await StudySession.findOne({ _id: req.params.id, userId: req.user._id });

    if (!session) {
      return res.status(404).json({ message: 'Study session not found' });
    }

    session.completed = !session.completed;
    session.completedAt = session.completed ? new Date() : null;

    await session.save();
    const populatedSession = await StudySession.findById(session._id).populate('subjectId', 'name code color');
    res.json(populatedSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a study session
// @route   DELETE /api/study-sessions/:id
// @access  Private
const deleteStudySession = async (req, res) => {
  try {
    const session = await StudySession.findOne({ _id: req.params.id, userId: req.user._id });

    if (!session) {
      return res.status(404).json({ message: 'Study session not found' });
    }

    await session.deleteOne();
    res.json({ message: 'Study session removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStudySessions,
  createStudySession,
  updateStudySession,
  toggleCompleteSession,
  deleteStudySession
};
