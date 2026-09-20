const Exam = require('../models/Exam');

// @desc    Get all exams
// @route   GET /api/exams
// @access  Private
const getExams = async (req, res) => {
  try {
    const exams = await Exam.find({ userId: req.user._id })
      .populate('subjectId', 'name code color')
      .sort({ date: 1 });

    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an exam
// @route   POST /api/exams
// @access  Private
const createExam = async (req, res) => {
  try {
    const { subjectId, name, date, time, location, notes, preparationPercentage } = req.body;

    if (!subjectId || !name || !date) {
      return res.status(400).json({ message: 'Subject, exam name, and date are required' });
    }

    const exam = await Exam.create({
      userId: req.user._id,
      subjectId,
      name,
      date: new Date(date),
      time: time || '10:00 AM',
      location: location || 'Examination Hall',
      notes: notes || '',
      preparationPercentage: preparationPercentage !== undefined ? Number(preparationPercentage) : 0
    });

    const populated = await Exam.findById(exam._id).populate('subjectId', 'name code color');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an exam
// @route   PUT /api/exams/:id
// @access  Private
const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findOne({ _id: req.params.id, userId: req.user._id });

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const { subjectId, name, date, time, location, notes, preparationPercentage } = req.body;

    exam.subjectId = subjectId || exam.subjectId;
    exam.name = name || exam.name;
    exam.date = date ? new Date(date) : exam.date;
    exam.time = time || exam.time;
    exam.location = location !== undefined ? location : exam.location;
    exam.notes = notes !== undefined ? notes : exam.notes;
    if (preparationPercentage !== undefined) {
      exam.preparationPercentage = Number(preparationPercentage);
    }

    await exam.save();
    const populated = await Exam.findById(exam._id).populate('subjectId', 'name code color');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an exam
// @route   DELETE /api/exams/:id
// @access  Private
const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findOne({ _id: req.params.id, userId: req.user._id });

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    await exam.deleteOne();
    res.json({ message: 'Exam removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExams,
  createExam,
  updateExam,
  deleteExam
};
