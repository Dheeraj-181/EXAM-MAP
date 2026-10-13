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
  writeBatch,
} from 'firebase/firestore';
import { db } from './config';

// Get all subjects with topic counts and completion stats
export const getFirestoreSubjects = async (userId) => {
  const subjectsSnap = await getDocs(
    query(collection(db, 'subjects'), where('userId', '==', userId))
  );

  const topicsSnap = await getDocs(
    query(collection(db, 'topics'), where('userId', '==', userId))
  );

  const examsSnap = await getDocs(
    query(collection(db, 'exams'), where('userId', '==', userId))
  );

  const allTopics = topicsSnap.docs.map((d) => ({ ...d.data(), _id: d.id }));
  const allExams = examsSnap.docs.map((d) => ({ ...d.data(), _id: d.id }));

  const subjects = subjectsSnap.docs.map((d) => {
    const sData = d.data();
    const subjId = d.id;

    const subjTopics = allTopics.filter(
      (t) => t.subjectId === subjId || t.subject === subjId
    );
    const totalTopics = subjTopics.length;
    const completedTopics = subjTopics.filter((t) => t.status === 'Completed').length;
    const inProgressTopics = subjTopics.filter((t) => t.status === 'In Progress').length;
    const progressPercentage =
      totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    const exam = allExams.find(
      (e) => e.subjectId === subjId || e.subject === subjId
    ) || null;

    return {
      ...sData,
      _id: subjId,
      id: subjId,
      totalTopics,
      completedTopics,
      inProgressTopics,
      progressPercentage,
      exam,
    };
  });

  return subjects;
};

// Get single subject with grouped units
export const getFirestoreSubject = async (subjectId, userId) => {
  const subjDocRef = doc(db, 'subjects', subjectId);
  const subjSnap = await getDoc(subjDocRef);

  if (!subjSnap.exists()) {
    throw new Error('Subject not found');
  }

  const subjectData = subjSnap.data();

  // Fetch topics
  const topicsSnap = await getDocs(
    query(
      collection(db, 'topics'),
      where('userId', '==', userId),
      where('subjectId', '==', subjectId)
    )
  );

  const topics = topicsSnap.docs.map((d) => ({ ...d.data(), _id: d.id, id: d.id }));

  // Group topics by units (1..totalUnits)
  const totalUnits = subjectData.totalUnits || 5;
  const unitsMap = {};
  for (let u = 1; u <= totalUnits; u++) {
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
  const progressPercentage =
    totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return {
    ...subjectData,
    _id: subjectId,
    id: subjectId,
    totalTopics,
    completedTopics,
    progressPercentage,
    units,
  };
};

// Create Subject
export const createFirestoreSubject = async (userId, data) => {
  const docRef = await addDoc(collection(db, 'subjects'), {
    ...data,
    userId,
    totalUnits: Number(data.totalUnits || 5),
    credits: Number(data.credits || 3),
    createdAt: new Date().toISOString(),
  });

  // If exam date provided, auto-create exam doc
  if (data.targetExamDate) {
    await addDoc(collection(db, 'exams'), {
      userId,
      subjectId: docRef.id,
      examName: `${data.name} Examination`,
      examDate: data.targetExamDate,
      examTime: '10:00 AM',
      targetMarks: 70,
      venue: 'Main Examination Block',
      notes: 'Covers all 5 units according to university curriculum guidelines.',
      createdAt: new Date().toISOString(),
    });
  }

  return { ...data, _id: docRef.id, id: docRef.id };
};

// Update Subject
export const updateFirestoreSubject = async (subjectId, data) => {
  const docRef = doc(db, 'subjects', subjectId);
  await updateDoc(docRef, data);
  const updated = await getDoc(docRef);
  return { ...updated.data(), _id: subjectId, id: subjectId };
};

// Delete Subject & Cascade
export const deleteFirestoreSubject = async (subjectId, userId) => {
  // Delete subject
  await deleteDoc(doc(db, 'subjects', subjectId));

  // Cascading deletes for topics, studyPlans, exams
  const batch = writeBatch(db);

  const topicsSnap = await getDocs(
    query(collection(db, 'topics'), where('subjectId', '==', subjectId))
  );
  topicsSnap.docs.forEach((d) => batch.delete(d.ref));

  const plansSnap = await getDocs(
    query(collection(db, 'studyPlans'), where('subjectId', '==', subjectId))
  );
  plansSnap.docs.forEach((d) => batch.delete(d.ref));

  const examsSnap = await getDocs(
    query(collection(db, 'exams'), where('subjectId', '==', subjectId))
  );
  examsSnap.docs.forEach((d) => batch.delete(d.ref));

  await batch.commit();
};
