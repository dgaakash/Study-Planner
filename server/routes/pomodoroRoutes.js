const express = require('express');
const router = express.Router();
const { getPomodoroStats, createPomodoroSession } = require('../controllers/pomodoroController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getPomodoroStats)
  .post(createPomodoroSession);

module.exports = router;
