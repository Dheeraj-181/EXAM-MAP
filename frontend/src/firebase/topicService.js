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

// Get topics
export const getFirestoreTopics = async (userId, filters = {}) => {
  const q = query(collection(db, 'topics'), where('userId', '==', userId));
  const snap = await getDocs(q);

  let topics = snap.docs.map((d) => ({ ...d.data(), _id: d.id, id: d.id }));

  if (filters.subjectId) {
    topics = topics.filter(
      (t) => t.subjectId === filters.subjectId || t.subject === filters.subjectId
    );
  }
  if (filters.unit) {
    topics = topics.filter((t) => Number(t.unit) === Number(filters.unit));
  }
  if (filters.status && filters.status !== 'All') {
    topics = topics.filter((t) => t.status === filters.status);
  }
  if (filters.priority && filters.priority !== 'All') {
    topics = topics.filter((t) => t.priority === filters.priority);
  }

  return topics.sort((a, b) => (a.unit || 1) - (b.unit || 1));
};

// Create Topic
export const createFirestoreTopic = async (userId, data) => {
  const subjectId = data.subjectId || data.subject;
  const docRef = await addDoc(collection(db, 'topics'), {
    ...data,
    userId,
    subjectId,
    unit: Number(data.unit || 1),
    estimatedHours: Number(data.estimatedHours || 2),
    status: data.status || 'Not Started',
    createdAt: new Date().toISOString(),
  });

  return { ...data, _id: docRef.id, id: docRef.id };
};

// Update Topic
export const updateFirestoreTopic = async (topicId, data) => {
  const docRef = doc(db, 'topics', topicId);
  const updatePayload = { ...data };

  if (data.status === 'Completed') {
    updatePayload.completedAt = new Date().toISOString();
  } else if (data.status && data.status !== 'Completed') {
    updatePayload.completedAt = null;
  }

  await updateDoc(docRef, updatePayload);
  const updated = await getDoc(docRef);
  return { ...updated.data(), _id: topicId, id: topicId };
};

// Toggle Topic Status
export const toggleFirestoreTopicStatus = async (topic) => {
  const topicId = topic._id || topic.id;
  const docRef = doc(db, 'topics', topicId);

  let nextStatus = 'In Progress';
  if (topic.status === 'Not Started') nextStatus = 'In Progress';
  else if (topic.status === 'In Progress') nextStatus = 'Completed';
  else nextStatus = 'Not Started';

  const updatePayload = {
    status: nextStatus,
    completedAt: nextStatus === 'Completed' ? new Date().toISOString() : null,
  };

  await updateDoc(docRef, updatePayload);
  return { ...topic, ...updatePayload, _id: topicId, id: topicId };
};

// Delete Topic
export const deleteFirestoreTopic = async (topicId) => {
  await deleteDoc(doc(db, 'topics', topicId));
};
