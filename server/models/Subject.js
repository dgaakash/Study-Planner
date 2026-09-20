const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Subject short code is required'],
    trim: true,
    uppercase: true
  },
  teacher: {
    type: String,
    default: '',
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  targetPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 85
  },
  color: {
    type: String,
    default: '#EC4899'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subject', subjectSchema);
