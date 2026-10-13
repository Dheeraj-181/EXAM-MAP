const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const StudyPlan = require('../models/StudyPlan');
const Exam = require('../models/Exam');

// @desc    Get all subjects for current user with completion stats
// @route   GET /api/subjects
// @access  Private
exports.getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find({ user: req.user.id }).sort({ createdAt: -1 });

    // Enrich each subject with topics count and completion percentage
    const enrichedSubjects = await Promise.all(
      subjects.map(async (subject) => {
        const topics = await Topic.find({ subject: subject._id, user: req.user.id });
        const totalTopics = topics.length;
        const completedTopics = topics.filter((t) => t.status === 'Completed').length;
        const inProgressTopics = topics.filter((t) => t.status === 'In Progress').length;
        const progressPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

        // Exam for this subject if any
        const exam = await Exam.findOne({ subject: subject._id, user: req.user.id });

        return {
          ...subject.toObject(),
          totalTopics,
          completedTopics,
          inProgressTopics,
          progressPercentage,
          exam: exam || null,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: enrichedSubjects.length,
      data: enrichedSubjects,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single subject with topics grouped by unit
// @route   GET /api/subjects/:id
// @access  Private
exports.getSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, user: req.user.id });
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    const topics = await Topic.find({ subject: subject._id, user: req.user.id }).sort({ unit: 1, createdAt: 1 });
    const exam = await Exam.findOne({ subject: subject._id, user: req.user.id });

    // Group topics by unit (1..totalUnits)
    const unitsMap = {};
    for (let u = 1; u <= (subject.totalUnits || 5); u++) {
      unitsMap[u] = {
        unit: u,
        unitTitle: `Unit ${u}`,
        topics: [],
      };
    }

    topics.forEach((t) => {
      const u = t.unit || 1;
      if (!unitsMap[u]) {
        unitsMap[u] = {
          unit: u,
          unitTitle: t.unitTitle || `Unit ${u}`,
          topics: [],
        };
      } else if (t.unitTitle && unitsMap[u].unitTitle === `Unit ${u}`) {
        unitsMap[u].unitTitle = t.unitTitle;
      }
      unitsMap[u].topics.push(t);
    });

    const units = Object.values(unitsMap).sort((a, b) => a.unit - b.unit);

    const totalTopics = topics.length;
    const completedTopics = topics.filter((t) => t.status === 'Completed').length;
    const progressPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        ...subject.toObject(),
        totalTopics,
        completedTopics,
        progressPercentage,
        units,
        exam,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new subject
// @route   POST /api/subjects
// @access  Private
exports.createSubject = async (req, res, next) => {
  try {
    const { name, code, credits, totalUnits, color, icon, difficulty, targetExamDate, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Please provide subject name' });
    }

    const subject = await Subject.create({
      user: req.user.id,
      name,
      code: code || '',
      credits: credits || 3,
      totalUnits: totalUnits || 5,
      color: color || '#6558F5',
      icon: icon || 'BookOpen',
      difficulty: difficulty || 'Medium',
      targetExamDate: targetExamDate || null,
      description: description || '',
    });

    // If targetExamDate provided, auto-create an exam entry
    if (targetExamDate) {
      await Exam.create({
        user: req.user.id,
        subject: subject._id,
        examName: `${subject.name} Examination`,
        examDate: targetExamDate,
        examTime: '10:00 AM',
        targetMarks: 70,
        venue: 'Main Exam Hall',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: subject,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private
exports.updateSubject = async (req, res, next) => {
  try {
    let subject = await Subject.findOne({ _id: req.params.id, user: req.user.id });
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Subject updated successfully',
      data: subject,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete subject (cascades topics, study plans, exams)
// @route   DELETE /api/subjects/:id
// @access  Private
exports.deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, user: req.user.id });
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    await Subject.deleteOne({ _id: req.params.id });
    await Topic.deleteMany({ subject: req.params.id });
    await StudyPlan.deleteMany({ subject: req.params.id });
    await Exam.deleteMany({ subject: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Subject and associated syllabus data deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
