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
  increment,
} from 'firebase/firestore';
import { db } from './config';

// Helper to populate subject and topic details
const populatePlan = async (planData, planId) => {
  let subjectData = null;
  const subjId = planData.subjectId || planData.subject;
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

  let topicData = null;
  const topicId = planData.topicId || planData.topic;
  if (topicId) {
    try {
      const tSnap = await getDoc(doc(db, 'topics', topicId));
      if (tSnap.exists()) {
        topicData = { _id: tSnap.id, id: tSnap.id, ...tSnap.data() };
      }
    } catch {
      topicData = null;
    }
  }

  return {
    ...planData,
    _id: planId,
    id: planId,
    subject: subjectData || { name: 'General', color: '#6558F5', code: 'GEN' },
    topic: topicData,
  };
};

// Get all study plans for a user
export const getFirestoreStudyPlans = async (userId, filters = {}) => {
  const plansSnap = await getDocs(
    query(collection(db, 'studyPlans'), where('userId', '==', userId))
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
  const topicsMap = {};
  topicsSnap.docs.forEach((d) => {
    topicsMap[d.id] = { _id: d.id, id: d.id, ...d.data() };
  });

  let plans = plansSnap.docs.map((d) => {
    const data = d.data();
    const subjId = data.subjectId || data.subject;
    const topicId = data.topicId || data.topic;

    return {
      ...data,
      _id: d.id,
      id: d.id,
      subject: subjectsMap[subjId] || { name: 'General', color: '#6558F5', code: 'GEN' },
      topic: topicsMap[topicId] || null,
    };
  });

  if (filters.date) {
    plans = plans.filter((p) => p.date === filters.date);
  }
  if (filters.subject) {
    plans = plans.filter(
      (p) =>
        (p.subject && (p.subject._id === filters.subject || p.subject.id === filters.subject)) ||
        p.subjectId === filters.subject
    );
  }
  if (filters.status) {
    plans = plans.filter((p) => p.status === filters.status);
  }

  // Sort by date ascending, then startTime
  plans.sort((a, b) => {
    const dateComp = (a.date || '').localeCompare(b.date || '');
    if (dateComp !== 0) return dateComp;
    return (a.startTime || '').localeCompare(b.startTime || '');
  });

  return plans;
};

// Create a study plan session
export const createFirestoreStudyPlan = async (userId, planData) => {
  const docRef = await addDoc(collection(db, 'studyPlans'), {
    userId,
    subject: planData.subject,
    subjectId: planData.subject,
    topic: planData.topic || null,
    topicId: planData.topic || null,
    title: planData.title,
    date: planData.date,
    startTime: planData.startTime || '09:00',
    durationMinutes: Number(planData.durationMinutes) || 60,
    notes: planData.notes || '',
    status: planData.status || 'Planned',
    pomodoroCyclesCompleted: 0,
    createdAt: new Date().toISOString(),
  });

  const snap = await getDoc(docRef);
  return await populatePlan(snap.data(), docRef.id);
};

// Update a study plan session
export const updateFirestoreStudyPlan = async (userId, planId, updateData) => {
  const ref = doc(db, 'studyPlans', planId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    throw new Error('Study plan not found');
  }

  const existing = snap.data();
  if (existing.userId !== userId) {
    throw new Error('Unauthorized');
  }

  const fields = { ...updateData };
  if (fields.subject) {
    fields.subjectId = fields.subject;
  }
  if (fields.topic !== undefined) {
    fields.topicId = fields.topic;
  }
  if (fields.status === 'Completed' && existing.status !== 'Completed') {
    fields.completedAt = new Date().toISOString();
  }

  await updateDoc(ref, fields);
  const updatedSnap = await getDoc(ref);
  return await populatePlan(updatedSnap.data(), planId);
};

// Record Pomodoro cycle completed
export const recordFirestorePomodoro = async (userId, planId) => {
  const ref = doc(db, 'studyPlans', planId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    throw new Error('Study plan not found');
  }

  const existing = snap.data();
  if (existing.userId !== userId) {
    throw new Error('Unauthorized');
  }

  const currentCycles = (existing.pomodoroCyclesCompleted || 0) + 1;
  const updates = {
    pomodoroCyclesCompleted: currentCycles,
  };
  if (existing.status === 'Planned') {
    updates.status = 'In Progress';
  }

  await updateDoc(ref, updates);
  const updatedSnap = await getDoc(ref);
  return await populatePlan(updatedSnap.data(), planId);
};

// Delete a study plan session
export const deleteFirestoreStudyPlan = async (userId, planId) => {
  const ref = doc(db, 'studyPlans', planId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    throw new Error('Study plan not found');
  }

  const existing = snap.data();
  if (existing.userId !== userId) {
    throw new Error('Unauthorized');
  }

  await deleteDoc(ref);
  return true;
};
