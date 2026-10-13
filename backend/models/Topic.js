const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema(
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
      index: true,
    },
    unit: {
      type: Number,
      required: [true, 'Unit number is required'],
      default: 1,
      min: 1,
      max: 10,
    },
    unitTitle: {
      type: String,
      trim: true,
      default: 'Unit 1',
    },
    title: {
      type: String,
      required: [true, 'Topic title is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed'],
      default: 'Not Started',
      index: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    estimatedHours: {
      type: Number,
      default: 2,
      min: 0.5,
      max: 50,
    },
    notes: {
      type: String,
      default: '',
    },
    resources: [
      {
        type: String,
        trim: true,
      },
    ],
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Topic', TopicSchema);
