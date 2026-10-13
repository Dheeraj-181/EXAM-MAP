const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    examName: {
      type: String,
      required: [true, 'Please enter exam title (e.g. Mid-1, Semester End Theory)'],
      trim: true,
    },
    examDate: {
      type: Date,
      required: [true, 'Exam date is required'],
      index: true,
    },
    examTime: {
      type: String,
      default: '10:00 AM',
      trim: true,
    },
    durationMinutes: {
      type: Number,
      default: 180,
    },
    targetMarks: {
      type: Number,
      default: 70,
      min: 0,
      max: 100,
    },
    venue: {
      type: String,
      default: 'Exam Hall',
      trim: true,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Exam', ExamSchema);
