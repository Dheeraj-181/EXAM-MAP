import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Layers,
  Zap,
  Target,
  BookOpen,
} from 'lucide-react';
import { getFirestoreAnalytics } from '../firebase/analyticsService';
import { useAuth } from '../context/AuthContext';
import ProgressBar from '../components/common/ProgressBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../context/ToastContext';

const AnalyticsPage = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const uid = user?.uid || user?._id || user?.id;

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!uid) return;
      try {
        setLoading(true);
        const data = await getFirestoreAnalytics(uid);
        setAnalytics(data);
      } catch (err) {
        showToast('Failed to load performance analytics', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [uid]);

  if (loading) {
    return <LoadingSpinner text="Computing preparation analytics..." size={32} />;
  }

  const {
    totalTopics = 0,
    completedTopics = 0,
    inProgressTopics = 0,
    notStartedTopics = 0,
    overallCompletionPercentage = 0,
    totalEstimatedStudyHours = 0,
    completedHours = 0,
    totalPomodoroCycles = 0,
    subjectWiseBreakdown = [],
    priorityBreakdown = { High: {}, Medium: {}, Low: {} },
  } = analytics || {};

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Preparation Analytics & Insights</h1>
          <p className="section-subtitle">
            Detailed breakdown of curriculum coverage, high-priority mastery, and revision velocity
          </p>
        </div>
      </div>

      {/* Top 3 Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <div className="card" style={{ padding: '1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
              Curriculum Mastery
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)', lineHeight: 1.1 }}>
            {overallCompletionPercentage}%
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
            {completedTopics} of {totalTopics} syllabus topics completed
          </p>
          <div style={{ marginTop: '0.85rem' }}>
            <ProgressBar percentage={overallCompletionPercentage} color="var(--color-primary)" height={7} />
          </div>
        </div>

        <div className="card" style={{ padding: '1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
              Estimated Revision Time
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--color-secondary-light)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)', lineHeight: 1.1 }}>
            {completedHours} / {totalEstimatedStudyHours} hrs
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
            Based on average academic reading and numerical solving speeds
          </p>
          <div style={{ marginTop: '0.85rem' }}>
            <ProgressBar
              percentage={totalEstimatedStudyHours > 0 ? (completedHours / totalEstimatedStudyHours) * 100 : 0}
              color="var(--color-secondary)"
              height={7}
            />
          </div>
        </div>

        <div className="card" style={{ padding: '1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
              Pomodoro Focus Cycles
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)', lineHeight: 1.1 }}>
            {totalPomodoroCycles} Sprints
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
            Equivalent to ~{Math.round(totalPomodoroCycles * 25)} minutes of deep uninterrupted study
          </p>
          <div style={{ marginTop: '0.85rem' }}>
            <ProgressBar
              percentage={Math.min(100, (totalPomodoroCycles / 10) * 100)}
              color="#D97706"
              height={7}
            />
          </div>
        </div>
      </div>

      {/* Two Column Section: Priority Matrix & Topic Status Breakdown */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {/* Priority Matrix Card */}
        <div className="card">
          <h3 style={{ fontSize: '1.12rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.35rem' }}>
            Exam Priority Matrix
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            Progress on high-scoring university exam questions
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* High Priority */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-danger)' }}>
                  High Priority Questions ({priorityBreakdown.High?.completed || 0}/{priorityBreakdown.High?.total || 0})
                </span>
                <span style={{ fontWeight: 700 }}>
                  {priorityBreakdown.High?.total > 0
                    ? Math.round((priorityBreakdown.High.completed / priorityBreakdown.High.total) * 100)
                    : 0}%
                </span>
              </div>
              <ProgressBar
                percentage={
                  priorityBreakdown.High?.total > 0
                    ? (priorityBreakdown.High.completed / priorityBreakdown.High.total) * 100
                    : 0
                }
                color="var(--color-danger)"
                height={8}
              />
            </div>

            {/* Medium Priority */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-warning)' }}>
                  Medium Priority Questions ({priorityBreakdown.Medium?.completed || 0}/{priorityBreakdown.Medium?.total || 0})
                </span>
                <span style={{ fontWeight: 700 }}>
                  {priorityBreakdown.Medium?.total > 0
                    ? Math.round((priorityBreakdown.Medium.completed / priorityBreakdown.Medium.total) * 100)
                    : 0}%
                </span>
              </div>
              <ProgressBar
                percentage={
                  priorityBreakdown.Medium?.total > 0
                    ? (priorityBreakdown.Medium.completed / priorityBreakdown.Medium.total) * 100
                    : 0
                }
                color="var(--color-warning)"
                height={8}
              />
            </div>

            {/* Low Priority */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-info)' }}>
                  Low Priority / Supplementary ({priorityBreakdown.Low?.completed || 0}/{priorityBreakdown.Low?.total || 0})
                </span>
                <span style={{ fontWeight: 700 }}>
                  {priorityBreakdown.Low?.total > 0
                    ? Math.round((priorityBreakdown.Low.completed / priorityBreakdown.Low.total) * 100)
                    : 0}%
                </span>
              </div>
              <ProgressBar
                percentage={
                  priorityBreakdown.Low?.total > 0
                    ? (priorityBreakdown.Low.completed / priorityBreakdown.Low.total) * 100
                    : 0
                }
                color="var(--color-info)"
                height={8}
              />
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="card">
          <h3 style={{ fontSize: '1.12rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.35rem' }}>
            Topic Status Breakdown
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            Current state of total syllabus inventory
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                backgroundColor: 'var(--color-success-light)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={20} color="var(--color-success)" />
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-text-main)' }}>
                  Completed Topics
                </span>
              </div>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-success)' }}>
                {completedTopics}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                backgroundColor: 'var(--color-warning-light)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={20} color="var(--color-warning)" />
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-text-main)' }}>
                  In Progress Topics
                </span>
              </div>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-warning)' }}>
                {inProgressTopics}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                backgroundColor: '#F3F4F9',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Layers size={20} color="var(--color-text-muted)" />
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-text-main)' }}>
                  Not Started Topics
                </span>
              </div>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text-muted)' }}>
                {notStartedTopics}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Comparison Table */}
      <div className="card">
        <h3 style={{ fontSize: '1.12rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.35rem' }}>
          Course-by-Course Comparison
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
          Summary of all enrolled subjects with unit and topic progress
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Subject Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Code</th>
                <th style={{ padding: '0.75rem 1rem' }}>Topics</th>
                <th style={{ padding: '0.75rem 1rem' }}>Completed</th>
                <th style={{ padding: '0.75rem 1rem' }}>Progress</th>
              </tr>
            </thead>
            <tbody>
              {subjectWiseBreakdown.map((s) => (
                <tr key={s._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: s.color || 'var(--color-primary)' }} />
                      {s.name}
                    </div>
                  </td>
                  <td style={{ padding: '0.9rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    {s.code || '—'}
                  </td>
                  <td style={{ padding: '0.9rem 1rem' }}>{s.totalTopics}</td>
                  <td style={{ padding: '0.9rem 1rem', fontWeight: 600, color: 'var(--color-success)' }}>
                    {s.completedTopics}
                  </td>
                  <td style={{ padding: '0.9rem 1rem', minWidth: '160px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <ProgressBar percentage={s.percentage} color={s.color} height={6} />
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '0.8rem', minWidth: '35px' }}>
                        {s.percentage}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
