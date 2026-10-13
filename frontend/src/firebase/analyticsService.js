import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './config';

export const getFirestoreAnalytics = async (userId) => {
  const [subjectsSnap, topicsSnap, plansSnap, examsSnap] = await Promise.all([
    getDocs(query(collection(db, 'subjects'), where('userId', '==', userId))),
    getDocs(query(collection(db, 'topics'), where('userId', '==', userId))),
    getDocs(query(collection(db, 'studyPlans'), where('userId', '==', userId))),
    getDocs(query(collection(db, 'exams'), where('userId', '==', userId))),
  ]);

  const subjects = subjectsSnap.docs.map((d) => ({ ...d.data(), _id: d.id, id: d.id }));
  const topics = topicsSnap.docs.map((d) => ({ ...d.data(), _id: d.id, id: d.id }));
  const studyPlans = plansSnap.docs.map((d) => ({ ...d.data(), _id: d.id, id: d.id }));
  const exams = examsSnap.docs.map((d) => ({ ...d.data(), _id: d.id, id: d.id }));

  const totalSubjects = subjects.length;
  const totalTopics = topics.length;
  const completedTopics = topics.filter((t) => t.status === 'Completed').length;
  const inProgressTopics = topics.filter((t) => t.status === 'In Progress').length;
  const notStartedTopics = topics.filter((t) => t.status === 'Not Started').length;

  const overallCompletionPercentage =
    totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // Study sessions & pomodoro stats
  const totalStudySessions = studyPlans.length;
  const completedStudySessions = studyPlans.filter((p) => p.status === 'Completed').length;
  const totalPomodoroCycles = studyPlans.reduce(
    (sum, p) => sum + (p.pomodoroCyclesCompleted || 0),
    0
  );

  // Estimated study hours
  const totalEstimatedStudyHours = topics.reduce(
    (sum, t) => sum + (Number(t.estimatedHours) || 2),
    0
  );
  const completedHours = topics
    .filter((t) => t.status === 'Completed')
    .reduce((sum, t) => sum + (Number(t.estimatedHours) || 2), 0);

  // Subject-wise breakdown
  const subjectWiseBreakdown = subjects.map((subj) => {
    const subjTopics = topics.filter(
      (t) => t.subjectId === subj._id || t.subject === subj._id
    );
    const sTotal = subjTopics.length;
    const sCompleted = subjTopics.filter((t) => t.status === 'Completed').length;
    const sInProgress = subjTopics.filter((t) => t.status === 'In Progress').length;
    const sPercentage = sTotal > 0 ? Math.round((sCompleted / sTotal) * 100) : 0;

    return {
      _id: subj._id,
      id: subj._id,
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

  // Upcoming exams countdown
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const subjectsMap = {};
  subjects.forEach((s) => {
    subjectsMap[s._id] = s;
  });

  const upcomingExams = exams
    .filter((e) => new Date(e.examDate).getTime() >= todayStart)
    .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime())
    .slice(0, 4)
    .map((e) => {
      const diffMs = new Date(e.examDate).getTime() - now.getTime();
      const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      const subjId = e.subjectId || e.subject;
      const subjObj = subjectsMap[subjId] || { name: 'Subject', color: '#6558F5' };

      return {
        _id: e._id,
        id: e._id,
        examName: e.examName,
        subject: subjObj,
        examDate: e.examDate,
        examTime: e.examTime,
        daysLeft,
      };
    });

  return {
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
  };
};
