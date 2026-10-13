const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please enter subject name'],
      trim: true,
      maxlength: [80, 'Subject name cannot exceed 80 characters'],
    },
    code: {
      type: String,
      trim: true,
      default: '',
    },
    credits: {
      type: Number,
      default: 3,
      min: 1,
      max: 10,
    },
    totalUnits: {
      type: Number,
      default: 5,
      min: 1,
      max: 10,
    },
    color: {
      type: String,
      default: '#6558F5',
    },
    icon: {
      type: String,
      default: 'BookOpen',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    targetExamDate: {
      type: Date,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for topics in this subject
SubjectSchema.virtual('topics', {
  ref: 'Topic',
  localField: '_id',
  foreignField: 'subject',
  justOne: false,
});

module.exports = mongoose.model('Subject', SubjectSchema);
