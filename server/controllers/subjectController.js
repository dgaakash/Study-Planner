const Subject = require('../models/Subject');
const StudySession = require('../models/StudySession');
const Assignment = require('../models/Assignment');
const Exam = require('../models/Exam');

// @desc    Get all subjects for logged-in user
// @route   GET /api/subjects
// @access  Private
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.user._id }).sort({ name: 1 });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new subject
// @route   POST /api/subjects
// @access  Private
const createSubject = async (req, res) => {
  try {
    const { name, code, teacher, difficulty, targetPercentage, color } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: 'Subject name and short code are required' });
    }

    const subject = await Subject.create({
      userId: req.user._id,
      name,
      code,
      teacher: teacher || '',
      difficulty: difficulty || 'Medium',
      targetPercentage: targetPercentage || 85,
      color: color || '#EC4899'
    });

    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a subject
// @route   PUT /api/subjects/:id
// @access  Private
const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, userId: req.user._id });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const { name, code, teacher, difficulty, targetPercentage, color } = req.body;

    subject.name = name || subject.name;
    subject.code = code || subject.code;
    subject.teacher = teacher !== undefined ? teacher : subject.teacher;
    subject.difficulty = difficulty || subject.difficulty;
    subject.targetPercentage = targetPercentage !== undefined ? targetPercentage : subject.targetPercentage;
    subject.color = color || subject.color;

    const updatedSubject = await subject.save();
    res.json(updatedSubject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a subject
// @route   DELETE /api/subjects/:id
// @access  Private
const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, userId: req.user._id });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Optionally cleanup related records
    await Promise.all([
      StudySession.deleteMany({ subjectId: req.params.id, userId: req.user._id }),
      Assignment.deleteMany({ subjectId: req.params.id, userId: req.user._id }),
      Exam.deleteMany({ subjectId: req.params.id, userId: req.user._id })
    ]);

    await subject.deleteOne();
    res.json({ message: 'Subject and related tasks removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject
};
