import React, { useState } from 'react';
import { User, School, BookOpen, Lock, RefreshCw, CheckCircle2, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { changeUserFirebasePassword } from '../firebase/authService';

const ProfilePage = () => {
  const { user, updateProfile, reseedCurriculum } = useAuth();
  const { showToast } = useToast();

  // Profile fields state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    college: user?.college || 'School of Computer Science & Engineering',
    branch: user?.branch || 'Computer Science & Engineering',
    semester: user?.semester || 'Semester 5',
    targetExamPeriod: user?.targetExamPeriod || 'Semester End Theory Examinations',
    dailyStudyGoalHours: user?.dailyStudyGoalHours || 3,
  });

  // Password fields state
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isReseeding, setIsReseeding] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((p) => ({
      ...p,
      [name]: name === 'dailyStudyGoalHours' ? Number(value) : value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((p) => ({ ...p, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    await updateProfile(profileData);
    setIsUpdatingProfile(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    try {
      setIsChangingPassword(true);
      await changeUserFirebasePassword(passwords.newPassword);
      showToast('Password changed successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') {
        showToast('Please log out and log back in to update your password.', 'warning');
      } else {
        showToast(err.message || 'Failed to change password', 'error');
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleReseed = async () => {
    if (
      window.confirm(
        'Reload standard core computer science sample syllabus? This will reload Operating Systems, DBMS, CN, SE with complete units.'
      )
    ) {
      setIsReseeding(true);
      await reseedCurriculum();
      setIsReseeding(false);
      window.location.reload();
    }
  };

  return (
    <div style={{ maxWidth: '960px' }}>
      <div className="section-header">
        <div>
          <h1 className="section-title">Student Profile & Academic Settings</h1>
          <p className="section-subtitle">
            Manage your personal details, academic institution, and study preferences
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
        {/* Left Column: Profile Information Form */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 800,
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || 'S'}
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                {user?.name}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={profileData.name}
                onChange={handleProfileChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">College / Institute</label>
              <input
                type="text"
                name="college"
                value={profileData.college}
                onChange={handleProfileChange}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Branch / Specialization</label>
                <input
                  type="text"
                  name="branch"
                  value={profileData.branch}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Academic Semester</label>
                <input
                  type="text"
                  name="semester"
                  value={profileData.semester}
                  onChange={handleProfileChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Target Examination Period</label>
              <input
                type="text"
                name="targetExamPeriod"
                value={profileData.targetExamPeriod}
                onChange={handleProfileChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Daily Study Goal (Hours)</label>
              <input
                type="number"
                name="dailyStudyGoalHours"
                min="1"
                max="16"
                value={profileData.dailyStudyGoalHours}
                onChange={handleProfileChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isUpdatingProfile}
              style={{ marginTop: '0.75rem' }}
            >
              {isUpdatingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Right Column: Security & Demo Utilities */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Change Password Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.12rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.35rem' }}>
              Security & Password
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              Update your account password
            </p>

            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  required
                  placeholder="••••••••"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  required
                  placeholder="Min 6 characters"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="Re-enter new password"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <button
                type="submit"
                className="btn btn-outline"
                disabled={isChangingPassword}
                style={{ marginTop: '0.5rem' }}
              >
                {isChangingPassword ? 'Updating Password...' : 'Change Password'}
              </button>
            </form>
          </div>

          {/* Curriculum Reset Card for Lab Evaluation */}
          <div
            className="card"
            style={{
              backgroundColor: '#FAFBFE',
              borderColor: '#D8DCEE',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <Sparkles size={18} color="var(--color-primary)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                Curriculum Reset Utility
              </h3>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
              Need to restore standard sample curriculum data? Click below to repopulate the complete
              core computer science courses with realistic topics, exams, and study sessions.
            </p>

            <button
              type="button"
              onClick={handleReseed}
              disabled={isReseeding}
              className="btn btn-outline btn-sm"
              style={{
                backgroundColor: '#FFFFFF',
                color: 'var(--color-primary)',
                borderColor: 'var(--color-primary-light)',
                fontWeight: 600,
              }}
            >
              <RefreshCw size={14} className={isReseeding ? 'spin' : ''} />
              {isReseeding ? 'Reloading...' : 'Reload Standard Curriculum'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
