const StudyPlan = require('../models/StudyPlan');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');

// @desc    Get study plans (optional filter by date, subject, status)
// @route   GET /api/study-plans
// @access  Private
exports.getPlans = async (req, res, next) => {
  try {
    const query = { user: req.user.id };

    if (req.query.date) {
      query.date = req.query.date;
    }
    if (req.query.subject) {
      query.subject = req.query.subject;
    }
    if (req.query.status) {
      query.status = req.query.status;
    }

    const plans = await StudyPlan.find(query)
      .populate('subject', 'name color code')
      .populate('topic', 'title unit status priority')
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create study plan session
// @route   POST /api/study-plans
// @access  Private
exports.createPlan = async (req, res, next) => {
  try {
    const { subject, topic, title, date, startTime, durationMinutes, notes } = req.body;

    if (!subject || !title || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide subject, session title, and date',
      });
    }

    const plan = await StudyPlan.create({
      user: req.user.id,
      subject,
      topic: topic || null,
      title,
      date,
      startTime: startTime || '09:00',
      durationMinutes: durationMinutes || 60,
      notes: notes || '',
    });

    const populatedPlan = await StudyPlan.findById(plan._id)
      .populate('subject', 'name color code')
      .populate('topic', 'title unit status');

    res.status(201).json({
      success: true,
      message: 'Study session scheduled successfully',
      data: populatedPlan,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update study plan
// @route   PUT /api/study-plans/:id
// @access  Private
exports.updatePlan = async (req, res, next) => {
  try {
    let plan = await StudyPlan.findOne({ _id: req.params.id, user: req.user.id });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Study plan not found' });
    }

    if (req.body.status && req.body.status === 'Completed' && plan.status !== 'Completed') {
      req.body.completedAt = new Date();
    }

    plan = await StudyPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('subject', 'name color code')
      .populate('topic', 'title unit status');

    res.status(200).json({
      success: true,
      message: 'Study plan updated',
      data: plan,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Record completed Pomodoro cycle
// @route   POST /api/study-plans/:id/pomodoro
// @access  Private
exports.recordPomodoroCycle = async (req, res, next) => {
  try {
    const plan = await StudyPlan.findOne({ _id: req.params.id, user: req.user.id });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Study plan not found' });
    }

    plan.pomodoroCyclesCompleted = (plan.pomodoroCyclesCompleted || 0) + 1;
    if (plan.status === 'Planned') {
      plan.status = 'In Progress';
    }
    await plan.save();

    res.status(200).json({
      success: true,
      message: `Pomodoro cycle recorded! Total completed: ${plan.pomodoroCyclesCompleted}`,
      data: plan,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete study plan
// @route   DELETE /api/study-plans/:id
// @access  Private
exports.deletePlan = async (req, res, next) => {
  try {
    const plan = await StudyPlan.findOne({ _id: req.params.id, user: req.user.id });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Study plan not found' });
    }

    await StudyPlan.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Study session deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
