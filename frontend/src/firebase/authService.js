import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as updateFirebaseProfile,
  updatePassword,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from './config';
import { seedFirestoreUserData, clearAndReseedFirestoreData } from './seedData';

// Register User
export const registerWithFirebase = async ({
  name,
  email,
  password,
  college = 'School of Computer Science & Engineering',
  branch = 'Computer Science & Engineering',
  semester = 'Semester 5',
}) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const user = userCredential.user;

  // Update display name
  await updateFirebaseProfile(user, { displayName: name });

  // Store student profile doc in Firestore
  const userDocRef = doc(db, 'users', user.uid);
  const userProfile = {
    uid: user.uid,
    name,
    email: user.email,
    college,
    branch,
    semester,
    targetExamPeriod: 'Semester End Theory Examinations',
    dailyStudyGoalHours: 3,
    createdAt: new Date().toISOString(),
  };
  await setDoc(userDocRef, userProfile);

  // Auto-seed default curriculum into Firestore
  await seedFirestoreUserData(user.uid);

  return userProfile;
};

// Login User
export const loginWithFirebase = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  const user = userCredential.user;

  // Retrieve user profile doc
  const userDocRef = doc(db, 'users', user.uid);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }

  // Fallback profile if doc was not present
  const profile = {
    uid: user.uid,
    name: user.displayName || user.email.split('@')[0],
    email: user.email,
    college: 'School of Computer Science & Engineering',
    branch: 'Computer Science & Engineering',
    semester: 'Semester 5',
    targetExamPeriod: 'Semester End Theory Examinations',
    dailyStudyGoalHours: 3,
  };
  await setDoc(userDocRef, profile);
  await seedFirestoreUserData(user.uid);
  return profile;
};

// Logout User
export const logoutFromFirebase = async () => {
  await signOut(auth);
};

// Get Profile
export const getUserProfileDoc = async (uid) => {
  const userDocRef = doc(db, 'users', uid);
  const snap = await getDoc(userDocRef);
  if (snap.exists()) {
    return snap.data();
  }
  return null;
};

// Update Profile
export const updateUserProfileDoc = async (uid, updatedFields) => {
  const userDocRef = doc(db, 'users', uid);
  await updateDoc(userDocRef, updatedFields);
  const updatedSnap = await getDoc(userDocRef);
  return updatedSnap.data();
};

// Change Password
export const changeUserFirebasePassword = async (newPassword) => {
  if (!auth.currentUser) throw new Error('No authenticated user session');
  await updatePassword(auth.currentUser, newPassword);
};

// Reseed Curriculum
export const reseedFirebaseCurriculum = async (uid) => {
  await clearAndReseedFirestoreData(uid);
};
