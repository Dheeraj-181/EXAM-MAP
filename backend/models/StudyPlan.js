const mongoose = require('mongoose');

const StudyPlanSchema = new mongoose.Schema(
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
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
    },
    title: {
      type: String,
      required: [true, 'Please provide a title or goal for this study session'],
      trim: true,
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: [true, 'Session date is required'],
      index: true,
    },
    startTime: {
      type: String, // Format: HH:mm (e.g. 15:30)
      default: '09:00',
    },
    durationMinutes: {
      type: Number,
      default: 60,
      min: 15,
      max: 600,
    },
    status: {
      type: String,
      enum: ['Planned', 'In Progress', 'Completed', 'Missed'],
      default: 'Planned',
      index: true,
    },
    notes: {
      type: String,
      default: '',
    },
    pomodoroCyclesCompleted: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('StudyPlan', StudyPlanSchema);
