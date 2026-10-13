import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import {
  loginWithFirebase,
  registerWithFirebase,
  logoutFromFirebase,
  getUserProfileDoc,
  updateUserProfileDoc,
  reseedFirebaseCurriculum,
} from '../firebase/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

const formatFirebaseError = (err) => {
  if (!err) return 'An unexpected error occurred';
  const code = err.code;
  switch (code) {
    case 'auth/invalid-email':
      return 'The email address is invalid.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/network-request-failed':
      return 'Network connection issue. Please check your internet connection.';
    default:
      return err.message || 'An unexpected error occurred.';
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const tokenStr = await fbUser.getIdToken();
          setToken(tokenStr);
          localStorage.setItem('token', tokenStr);

          // Get profile doc
          let profile = await getUserProfileDoc(fbUser.uid);
          if (!profile) {
            profile = {
              uid: fbUser.uid,
              _id: fbUser.uid,
              id: fbUser.uid,
              name: fbUser.displayName || fbUser.email.split('@')[0],
              email: fbUser.email,
              college: 'School of Computer Science & Engineering',
              branch: 'Computer Science & Engineering',
              semester: 'Semester 5',
              targetExamPeriod: 'Semester End Theory Examinations',
              dailyStudyGoalHours: 3,
            };
          } else {
            profile = {
              ...profile,
              _id: fbUser.uid,
              id: fbUser.uid,
            };
          }

          setUser(profile);
          localStorage.setItem('user', JSON.stringify(profile));
        } catch (err) {
          console.error('Error restoring Firebase session:', err);
        }
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const profile = await loginWithFirebase(email, password);
      const enriched = {
        ...profile,
        _id: profile.uid,
        id: profile.uid,
      };
      const tokenStr = await auth.currentUser.getIdToken();
      setToken(tokenStr);
      setUser(enriched);
      localStorage.setItem('token', tokenStr);
      localStorage.setItem('user', JSON.stringify(enriched));
      showToast('Logged in successfully!');
      return { success: true, user: enriched };
    } catch (err) {
      const msg = formatFirebaseError(err);
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    try {
      const profile = await registerWithFirebase(userData);
      const enriched = {
        ...profile,
        _id: profile.uid,
        id: profile.uid,
      };
      const tokenStr = await auth.currentUser.getIdToken();
      setToken(tokenStr);
      setUser(enriched);
      localStorage.setItem('token', tokenStr);
      localStorage.setItem('user', JSON.stringify(enriched));
      showToast('Registration successful! Welcome to ExamMap.');
      return { success: true, user: enriched };
    } catch (err) {
      const msg = formatFirebaseError(err);
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await logoutFromFirebase();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      showToast('Logged out successfully', 'info');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      if (!user) throw new Error('Not logged in');
      const updated = await updateUserProfileDoc(user.uid || user._id, profileData);
      const enriched = {
        ...updated,
        _id: user.uid || user._id,
        id: user.uid || user._id,
      };
      setUser(enriched);
      localStorage.setItem('user', JSON.stringify(enriched));
      showToast('Profile updated successfully!');
      return { success: true, user: enriched };
    } catch (err) {
      const msg = formatFirebaseError(err);
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const reseedCurriculum = async () => {
    try {
      if (!user) throw new Error('Not logged in');
      await reseedFirebaseCurriculum(user.uid || user._id);
      showToast('Sample curriculum loaded successfully!');
      return { success: true };
    } catch (err) {
      const msg = formatFirebaseError(err);
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        reseedCurriculum,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
