const Topic = require('../models/Topic');
const Subject = require('../models/Subject');
const StudyPlan = require('../models/StudyPlan');

// @desc    Get all topics (optional filter by subject, unit, status)
// @route   GET /api/topics
// @access  Private
exports.getTopics = async (req, res, next) => {
  try {
    const query = { user: req.user.id };

    if (req.query.subject) {
      query.subject = req.query.subject;
    }
    if (req.query.unit) {
      query.unit = Number(req.query.unit);
    }
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    const topics = await Topic.find(query)
      .populate('subject', 'name color code')
      .sort({ unit: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: topics.length,
      data: topics,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new topic
// @route   POST /api/topics
// @access  Private
exports.createTopic = async (req, res, next) => {
  try {
    const { subject, unit, unitTitle, title, priority, estimatedHours, notes, resources } = req.body;

    if (!subject || !title) {
      return res.status(400).json({
        success: false,
        message: 'Subject and topic title are required',
      });
    }

    const subjectExists = await Subject.findOne({ _id: subject, user: req.user.id });
    if (!subjectExists) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    const topic = await Topic.create({
      user: req.user.id,
      subject,
      unit: unit || 1,
      unitTitle: unitTitle || `Unit ${unit || 1}`,
      title,
      priority: priority || 'Medium',
      estimatedHours: estimatedHours || 2,
      notes: notes || '',
      resources: resources || [],
    });

    res.status(201).json({
      success: true,
      message: 'Topic created successfully',
      data: topic,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update topic
// @route   PUT /api/topics/:id
// @access  Private
exports.updateTopic = async (req, res, next) => {
  try {
    let topic = await Topic.findOne({ _id: req.params.id, user: req.user.id });
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    if (req.body.status && req.body.status === 'Completed' && topic.status !== 'Completed') {
      req.body.completedAt = new Date();
    } else if (req.body.status && req.body.status !== 'Completed') {
      req.body.completedAt = null;
    }

    topic = await Topic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('subject', 'name color code');

    res.status(200).json({
      success: true,
      message: 'Topic updated successfully',
      data: topic,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Quick toggle topic status (Not Started -> In Progress -> Completed)
// @route   PATCH /api/topics/:id/status
// @access  Private
exports.toggleTopicStatus = async (req, res, next) => {
  try {
    const topic = await Topic.findOne({ _id: req.params.id, user: req.user.id });
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    let nextStatus = req.body.status;
    if (!nextStatus) {
      if (topic.status === 'Not Started') nextStatus = 'In Progress';
      else if (topic.status === 'In Progress') nextStatus = 'Completed';
      else nextStatus = 'Not Started';
    }

    topic.status = nextStatus;
    topic.completedAt = nextStatus === 'Completed' ? new Date() : null;
    await topic.save();

    res.status(200).json({
      success: true,
      message: `Topic status marked as ${nextStatus}`,
      data: topic,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete topic
// @route   DELETE /api/topics/:id
// @access  Private
exports.deleteTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findOne({ _id: req.params.id, user: req.user.id });
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    await Topic.deleteOne({ _id: req.params.id });
    await StudyPlan.deleteMany({ topic: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Topic deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
