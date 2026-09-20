const express = require('express');
const router = express.Router();
const {
  getAssignments,
  createAssignment,
  updateAssignment,
  updateAssignmentStatus,
  deleteAssignment
} = require('../controllers/assignmentController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAssignments)
  .post(createAssignment);

router.route('/:id')
  .put(updateAssignment)
  .delete(deleteAssignment);

router.patch('/:id/status', updateAssignmentStatus);

module.exports = router;
