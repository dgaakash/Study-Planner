const express = require('express');
const router = express.Router();
const { 
  getStudySessions, 
  createStudySession, 
  updateStudySession, 
  toggleCompleteSession, 
  deleteStudySession 
} = require('../controllers/studySessionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getStudySessions)
  .post(createStudySession);

router.route('/:id')
  .put(updateStudySession)
  .delete(deleteStudySession);

router.patch('/:id/complete', toggleCompleteSession);

module.exports = router;
