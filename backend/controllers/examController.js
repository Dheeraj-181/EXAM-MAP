const Exam = require('../models/Exam');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');

// @desc    Get all exams with calculated countdowns and syllabus readiness
// @route   GET /api/exams
// @access  Private
exports.getExams = async (req, res, next) => {
  try {
    const exams = await Exam.find({ user: req.user.id })
      .populate('subject', 'name color code credits')
      .sort({ examDate: 1 });

    const now = new Date();

    const examsWithReadiness = await Promise.all(
      exams.map(async (exam) => {
        const examObj = exam.toObject();

        // Calculate countdown
        const examTime = new Date(exam.examDate).getTime();
        const diffMs = examTime - now.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        let status = 'upcoming';
        if (diffDays < 0) status = 'completed';
        else if (diffDays === 0) status = 'today';
        else if (diffDays <= 7) status = 'critical';

        // Syllabus coverage readiness
        let totalTopics = 0;
        let completedTopics = 0;
        let readinessPercentage = 0;

        if (exam.subject) {
          const topics = await Topic.find({ subject: exam.subject._id, user: req.user.id });
          totalTopics = topics.length;
          completedTopics = topics.filter((t) => t.status === 'Completed').length;
          readinessPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
        }

        return {
          ...examObj,
          daysLeft: diffDays,
          status,
          totalTopics,
          completedTopics,
          readinessPercentage,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: examsWithReadiness.length,
      data: examsWithReadiness,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new exam
// @route   POST /api/exams
// @access  Private
exports.createExam = async (req, res, next) => {
  try {
    const { subject, examName, examDate, examTime, durationMinutes, targetMarks, venue, notes } = req.body;

    if (!subject || !examName || !examDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide subject, exam title, and exam date',
      });
    }

    const exam = await Exam.create({
      user: req.user.id,
      subject,
      examName,
      examDate,
      examTime: examTime || '10:00 AM',
      durationMinutes: durationMinutes || 180,
      targetMarks: targetMarks || 70,
      venue: venue || 'Examination Hall',
      notes: notes || '',
    });

    const populated = await Exam.findById(exam._id).populate('subject', 'name color code');

    res.status(201).json({
      success: true,
      message: 'Exam schedule added successfully',
      data: populated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update exam
// @route   PUT /api/exams/:id
// @access  Private
exports.updateExam = async (req, res, next) => {
  try {
    let exam = await Exam.findOne({ _id: req.params.id, user: req.user.id });
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('subject', 'name color code');

    res.status(200).json({
      success: true,
      message: 'Exam updated successfully',
      data: exam,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete exam
// @route   DELETE /api/exams/:id
// @access  Private
exports.deleteExam = async (req, res, next) => {
  try {
    const exam = await Exam.findOne({ _id: req.params.id, user: req.user.id });
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    await Exam.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Exam removed successfully',
    });
  } catch (err) {
    next(err);
  }
};
