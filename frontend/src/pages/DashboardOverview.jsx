import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  ListTodo,
  TrendingUp,
  Clock,
  Calendar,
  AlertCircle,
  Plus,
  ArrowRight,
  Sparkles,
  Award,
} from 'lucide-react';
import { getFirestoreAnalytics } from '../firebase/analyticsService';
import { getFirestoreStudyPlans } from '../firebase/studyPlanService';
import { createFirestoreSubject } from '../firebase/subjectService';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/common/StatCard';
import ProgressBar from '../components/common/ProgressBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SubjectModal from '../components/subjects/SubjectModal';
import { useToast } from '../context/ToastContext';

const DashboardOverview = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [recentPlans, setRecentPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const uid = user.uid || user._id || user.id;
      const [analyticsData, plansData] = await Promise.all([
        getFirestoreAnalytics(uid),
        getFirestoreStudyPlans(uid),
      ]);

      setAnalytics(analyticsData);
      setRecentPlans(plansData.slice(0, 3));
    } catch (err) {
      console.error('Failed to load dashboard overview data:', err);
      showToast('Could not load dashboard data. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleCreateSubject = async (formData) => {
    if (!user) return;
    try {
      const uid = user.uid || user._id || user.id;
      await createFirestoreSubject(uid, formData);
      showToast('Subject created successfully!');
      setIsSubjectModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.message || 'Failed to create subject', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your study dashboard..." size={32} />;
  }

  const nearestExam = analytics?.upcomingExams?.[0];

  return (
    <div>
      {/* Top Banner / Urgent Exam Alert */}
      {nearestExam && (
        <div
          style={{
            backgroundColor: nearestExam.daysLeft <= 7 ? '#FEF2F2' : 'var(--color-primary-light)',
            border: `1px solid ${nearestExam.daysLeft <= 7 ? '#FCA5A5' : '#D6D2FA'}`,
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: nearestExam.daysLeft <= 7 ? '#DC2626' : 'var(--color-primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem',
              }}
            >
              {nearestExam.daysLeft}d
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: nearestExam.daysLeft <= 7 ? '#DC2626' : 'var(--color-primary)',
                    letterSpacing: '0.04em',
                  }}
                >
                  Upcoming University Exam
                </span>
                <span style={{ color: 'var(--color-border-hover)' }}>•</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  {nearestExam.subject?.name}
                </span>
              </div>
              <h4 style={{ fontSize: '1.08rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                {nearestExam.examName} is in{' '}
                <strong style={{ color: nearestExam.daysLeft <= 7 ? '#DC2626' : 'var(--color-primary)' }}>
                  {nearestExam.daysLeft} days
                </strong>
              </h4>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard/countdown')}
            className="btn btn-outline btn-sm"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            View Countdown
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* 4 Primary Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <StatCard
          title="Total Subjects"
          value={analytics?.totalSubjects || 0}
          subtitle="Enrolled semester courses"
          icon={BookOpen}
          iconColor="#6558F5"
          iconBg="#ECEBFE"
          onClick={() => navigate('/dashboard/subjects')}
        />

        <StatCard
          title="Syllabus Topics"
          value={analytics?.totalTopics || 0}
          subtitle={`${analytics?.inProgressTopics || 0} currently in progress`}
          icon={ListTodo}
          iconColor="#3B82F6"
          iconBg="#EBF4FE"
          onClick={() => navigate('/dashboard/syllabus')}
        />

        <StatCard
          title="Topics Mastered"
          value={analytics?.completedTopics || 0}
          subtitle={`${analytics?.notStartedTopics || 0} topics remaining`}
          icon={CheckCircle2}
          iconColor="#10B981"
          iconBg="#EAFBF3"
          badgeText="Verified"
          badgeVariant="success"
          onClick={() => navigate('/dashboard/syllabus')}
        />

        <StatCard
          title="Overall Syllabus"
          value={`${analytics?.overallCompletionPercentage || 0}%`}
          subtitle="University curriculum ready"
          icon={TrendingUp}
          iconColor="#35B8A6"
          iconBg="#E3F8F5"
          badgeText={analytics?.overallCompletionPercentage >= 50 ? 'On Track' : 'In Progress'}
          badgeVariant={analytics?.overallCompletionPercentage >= 50 ? 'success' : 'warning'}
          onClick={() => navigate('/dashboard/analytics')}
        />
      </div>

      {/* Two Column Grid: Subject Progress & Today's Study Schedule */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {/* Left Column: Course-wise Syllabus Progress */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.12rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                Course-wise Syllabus Progress
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Unit completion rate across subjects
              </p>
            </div>
            <button
              onClick={() => setIsSubjectModalOpen(true)}
              className="btn btn-outline btn-sm"
              style={{ gap: '4px' }}
            >
              <Plus size={14} /> Add Subject
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {analytics?.subjectWiseBreakdown && analytics.subjectWiseBreakdown.length > 0 ? (
              analytics.subjectWiseBreakdown.map((subj) => (
                <div
                  key={subj._id}
                  onClick={() => navigate(`/dashboard/syllabus?subjectId=${subj._id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      marginBottom: '0.35rem',
                      fontSize: '0.86rem',
                    }}
                  >
                    <div>
                      <strong style={{ color: 'var(--color-text-main)' }}>{subj.name}</strong>
                      <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginLeft: '6px' }}>
                        ({subj.completedTopics}/{subj.totalTopics} topics)
                      </span>
                    </div>
                    <span style={{ fontWeight: 700, color: subj.color || 'var(--color-primary)' }}>
                      {subj.percentage}%
                    </span>
                  </div>
                  <ProgressBar percentage={subj.percentage} color={subj.color || 'var(--color-primary)'} height={7} />
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.86rem' }}>
                No subjects found. Click "Add Subject" to create your first course.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Today's Study Sessions & Quick Pomodoro */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.12rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                Upcoming Study Sessions
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Targeted preparation schedule
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard/planner')}
              className="btn btn-primary btn-sm"
              style={{ gap: '4px' }}
            >
              <Calendar size={14} /> Open Planner
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentPlans && recentPlans.length > 0 ? (
              recentPlans.map((plan) => (
                <div
                  key={plan._id}
                  style={{
                    backgroundColor: 'var(--color-surface-subtle)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: plan.subject?.color || 'var(--color-primary)',
                        }}
                      >
                        {plan.subject?.name}
                      </span>
                      <span style={{ color: 'var(--color-border-hover)' }}>•</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                        {plan.date} at {plan.startTime || '18:00'}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        color: 'var(--color-text-main)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {plan.title}
                    </div>
                  </div>

                  <span
                    className={`badge badge-${
                      plan.status === 'Completed'
                        ? 'success'
                        : plan.status === 'In Progress'
                        ? 'warning'
                        : 'neutral'
                    }`}
                  >
                    {plan.status}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.86rem' }}>
                No study sessions scheduled yet. Click "Open Planner" to create one.
              </div>
            )}
          </div>

          {/* Quick Focus Button */}
          <div
            style={{
              marginTop: '1.25rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              <Clock size={16} color="var(--color-primary)" />
              <span>Ready for deep study?</span>
            </div>
            <button
              onClick={() => navigate('/dashboard/planner')}
              className="btn btn-outline btn-sm"
              style={{ gap: '4px' }}
            >
              Launch Pomodoro
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        onSubmit={handleCreateSubject}
      />
    </div>
  );
};

export default DashboardOverview;
