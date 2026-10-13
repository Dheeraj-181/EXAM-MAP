const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const StudyPlan = require('../models/StudyPlan');
const Exam = require('../models/Exam');

// @desc    Get comprehensive dashboard and progress analytics
// @route   GET /api/analytics
// @access  Private
exports.getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch all user records concurrently
    const [subjects, topics, studyPlans, exams] = await Promise.all([
      Subject.find({ user: userId }),
      Topic.find({ user: userId }),
      StudyPlan.find({ user: userId }),
      Exam.find({ user: userId }).populate('subject', 'name color').sort({ examDate: 1 }),
    ]);

    const totalSubjects = subjects.length;
    const totalTopics = topics.length;
    const completedTopics = topics.filter((t) => t.status === 'Completed').length;
    const inProgressTopics = topics.filter((t) => t.status === 'In Progress').length;
    const notStartedTopics = topics.filter((t) => t.status === 'Not Started').length;

    const overallCompletionPercentage =
      totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    // Study sessions and pomodoro stats
    const totalStudySessions = studyPlans.length;
    const completedStudySessions = studyPlans.filter((p) => p.status === 'Completed').length;
    const totalPomodoroCycles = studyPlans.reduce(
      (sum, p) => sum + (p.pomodoroCyclesCompleted || 0),
      0
    );

    // Total estimated study hours
    const totalEstimatedStudyHours = topics.reduce(
      (sum, t) => sum + (t.estimatedHours || 2),
      0
    );
    const completedHours = topics
      .filter((t) => t.status === 'Completed')
      .reduce((sum, t) => sum + (t.estimatedHours || 2), 0);

    // Subject-wise breakdown
    const subjectWiseBreakdown = subjects.map((subj) => {
      const subjTopics = topics.filter((t) => t.subject.toString() === subj._id.toString());
      const sTotal = subjTopics.length;
      const sCompleted = subjTopics.filter((t) => t.status === 'Completed').length;
      const sInProgress = subjTopics.filter((t) => t.status === 'In Progress').length;
      const sPercentage = sTotal > 0 ? Math.round((sCompleted / sTotal) * 100) : 0;

      return {
        _id: subj._id,
        name: subj.name,
        code: subj.code,
        color: subj.color,
        totalTopics: sTotal,
        completedTopics: sCompleted,
        inProgressTopics: sInProgress,
        percentage: sPercentage,
      };
    });

    // Priority breakdown
    const priorityBreakdown = {
      High: {
        total: topics.filter((t) => t.priority === 'High').length,
        completed: topics.filter((t) => t.priority === 'High' && t.status === 'Completed').length,
      },
      Medium: {
        total: topics.filter((t) => t.priority === 'Medium').length,
        completed: topics.filter((t) => t.priority === 'Medium' && t.status === 'Completed').length,
      },
      Low: {
        total: topics.filter((t) => t.priority === 'Low').length,
        completed: topics.filter((t) => t.priority === 'Low' && t.status === 'Completed').length,
      },
    };

    // Calculate countdown for upcoming exams
    const now = new Date();
    const upcomingExams = exams
      .filter((e) => new Date(e.examDate) >= new Date(now.setHours(0, 0, 0, 0)))
      .slice(0, 4)
      .map((e) => {
        const diffMs = new Date(e.examDate).getTime() - new Date().getTime();
        const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        return {
          _id: e._id,
          examName: e.examName,
          subject: e.subject,
          examDate: e.examDate,
          examTime: e.examTime,
          daysLeft,
        };
      });

    res.status(200).json({
      success: true,
      data: {
        totalSubjects,
        totalTopics,
        completedTopics,
        inProgressTopics,
        notStartedTopics,
        overallCompletionPercentage,
        totalStudySessions,
        completedStudySessions,
        totalPomodoroCycles,
        totalEstimatedStudyHours,
        completedHours,
        subjectWiseBreakdown,
        priorityBreakdown,
        upcomingExams,
      },
    });
  } catch (err) {
    next(err);
  }
};
