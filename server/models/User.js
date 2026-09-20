const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  course: {
    type: String,
    default: 'B.Sc. Computer Science',
    trim: true
  },
  semester: {
    type: Number,
    default: 3
  },
  division: {
    type: String,
    default: 'A',
    trim: true
  },
  dailyStudyGoal: {
    type: Number,
    default: 4 // in hours
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
