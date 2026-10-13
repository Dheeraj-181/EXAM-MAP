import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from './config';

// Populate subject details on an exam doc
const populateExam = async (examData, examId) => {
  let subjectData = null;
  const subjId = examData.subjectId || examData.subject;
  if (subjId) {
    try {
      const sSnap = await getDoc(doc(db, 'subjects', subjId));
      if (sSnap.exists()) {
        subjectData = { _id: sSnap.id, id: sSnap.id, ...sSnap.data() };
      }
    } catch {
      subjectData = null;
    }
  }

  return {
    ...examData,
    _id: examId,
    id: examId,
    subject: subjectData || { name: 'Subject', color: '#6558F5', code: 'SUB' },
  };
};

// Get all exams with countdown and syllabus readiness
export const getFirestoreExams = async (userId) => {
  const examsSnap = await getDocs(
    query(collection(db, 'exams'), where('userId', '==', userId))
  );

  const subjectsSnap = await getDocs(
    query(collection(db, 'subjects'), where('userId', '==', userId))
  );
  const subjectsMap = {};
  subjectsSnap.docs.forEach((d) => {
    subjectsMap[d.id] = { _id: d.id, id: d.id, ...d.data() };
  });

  const topicsSnap = await getDocs(
    query(collection(db, 'topics'), where('userId', '==', userId))
  );
  const allTopics = topicsSnap.docs.map((d) => ({ ...d.data(), _id: d.id, id: d.id }));

  const now = new Date();

  const exams = examsSnap.docs.map((d) => {
    const data = d.data();
    const examId = d.id;
    const subjId = data.subjectId || data.subject;
    const subject = subjectsMap[subjId] || { name: 'Subject', color: '#6558F5', code: 'SUB' };

    // Calculate countdown
    const examTime = new Date(data.examDate).getTime();
    const diffMs = examTime - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    let status = 'upcoming';
    if (diffDays < 0) status = 'completed';
    else if (diffDays === 0) status = 'today';
    else if (diffDays <= 7) status = 'critical';

    // Syllabus coverage readiness
    const subjTopics = allTopics.filter(
      (t) => t.subjectId === subjId || t.subject === subjId
    );
    const totalTopics = subjTopics.length;
    const completedTopics = subjTopics.filter((t) => t.status === 'Completed').length;
    const readinessPercentage =
      totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    return {
      ...data,
      _id: examId,
      id: examId,
      subject,
      daysLeft: diffDays,
      status,
      totalTopics,
      completedTopics,
      readinessPercentage,
    };
  });

  // Sort by examDate ascending
  exams.sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());

  return exams;
};

// Create a new exam
export const createFirestoreExam = async (userId, examData) => {
  const docRef = await addDoc(collection(db, 'exams'), {
    userId,
    subject: examData.subject,
    subjectId: examData.subject,
    examName: examData.examName,
    examDate: examData.examDate,
    examTime: examData.examTime || '10:00 AM',
    durationMinutes: Number(examData.durationMinutes) || 180,
    targetMarks: Number(examData.targetMarks) || 70,
    venue: examData.venue || 'Examination Hall',
    notes: examData.notes || '',
    createdAt: new Date().toISOString(),
  });

  const snap = await getDoc(docRef);
  return await populateExam(snap.data(), docRef.id);
};

// Update an exam
export const updateFirestoreExam = async (userId, examId, updateData) => {
  const ref = doc(db, 'exams', examId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    throw new Error('Exam not found');
  }

  const existing = snap.data();
  if (existing.userId !== userId) {
    throw new Error('Unauthorized');
  }

  const fields = { ...updateData };
  if (fields.subject) {
    fields.subjectId = fields.subject;
  }
  if (fields.durationMinutes) {
    fields.durationMinutes = Number(fields.durationMinutes);
  }
  if (fields.targetMarks) {
    fields.targetMarks = Number(fields.targetMarks);
  }

  await updateDoc(ref, fields);
  const updatedSnap = await getDoc(ref);
  return await populateExam(updatedSnap.data(), examId);
};

// Delete an exam
export const deleteFirestoreExam = async (userId, examId) => {
  const ref = doc(db, 'exams', examId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    throw new Error('Exam not found');
  }

  const existing = snap.data();
  if (existing.userId !== userId) {
    throw new Error('Unauthorized');
  }

  await deleteDoc(ref);
  return true;
};
