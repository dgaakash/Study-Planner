const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Exam name is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Exam date is required']
  },
  time: {
    type: String,
    default: '10:00 AM',
    trim: true
  },
  location: {
    type: String,
    default: 'Examination Hall',
    trim: true
  },
  notes: {
    type: String,
    default: '',
    trim: true
  },
  preparationPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Exam', examSchema);
