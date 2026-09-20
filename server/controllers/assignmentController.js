const Assignment = require('../models/Assignment');

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Private
const getAssignments = async (req, res) => {
  try {
    const { status, subjectId } = req.query;
    const filter = { userId: req.user._id };

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (subjectId) {
      filter.subjectId = subjectId;
    }

    const assignments = await Assignment.find(filter)
      .populate('subjectId', 'name code color')
      .sort({ dueDate: 1 });

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an assignment
// @route   POST /api/assignments
// @access  Private
const createAssignment = async (req, res) => {
  try {
    const { subjectId, title, description, dueDate, priority, status } = req.body;

    if (!subjectId || !title || !dueDate) {
      return res.status(400).json({ message: 'Subject, assignment title, and due date are required' });
    }

    const assignment = await Assignment.create({
      userId: req.user._id,
      subjectId,
      title,
      description: description || '',
      dueDate: new Date(dueDate),
      priority: priority || 'Medium',
      status: status || 'Pending'
    });

    const populated = await Assignment.findById(assignment._id).populate('subjectId', 'name code color');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an assignment
// @route   PUT /api/assignments/:id
// @access  Private
const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findOne({ _id: req.params.id, userId: req.user._id });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const { subjectId, title, description, dueDate, priority, status } = req.body;

    assignment.subjectId = subjectId || assignment.subjectId;
    assignment.title = title || assignment.title;
    assignment.description = description !== undefined ? description : assignment.description;
    assignment.dueDate = dueDate ? new Date(dueDate) : assignment.dueDate;
    assignment.priority = priority || assignment.priority;
    assignment.status = status || assignment.status;

    await assignment.save();
    const populated = await Assignment.findById(assignment._id).populate('subjectId', 'name code color');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update assignment status
// @route   PATCH /api/assignments/:id/status
// @access  Private
const updateAssignmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !['Pending', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Valid status required (Pending, In Progress, Completed)' });
    }

    const assignment = await Assignment.findOne({ _id: req.params.id, userId: req.user._id });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    assignment.status = status;
    await assignment.save();

    const populated = await Assignment.findById(assignment._id).populate('subjectId', 'name code color');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an assignment
// @route   DELETE /api/assignments/:id
// @access  Private
const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findOne({ _id: req.params.id, userId: req.user._id });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    await assignment.deleteOne();
    res.json({ message: 'Assignment removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAssignments,
  createAssignment,
  updateAssignment,
  updateAssignmentStatus,
  deleteAssignment
};
