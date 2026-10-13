import React, { useState, useEffect } from 'react';
import { Clock, Calendar, MapPin, Target, Edit2, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import ProgressBar from '../common/ProgressBar';

const CountdownCard = ({ exam, onEdit, onDelete }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const examTime = new Date(exam.examDate).getTime();
      const now = new Date().getTime();
      const diff = examTime - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [exam.examDate]);

  const isCritical = timeLeft.days <= 7 && !timeLeft.isPast;

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderLeft: `5px solid ${exam.subject?.color || 'var(--color-primary)'}`,
        position: 'relative',
        background: isCritical
          ? 'linear-gradient(180deg, #FFFFFF 0%, #FFFDFD 100%)'
          : '#FFFFFF',
      }}
    >
      <div>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: exam.subject?.color || 'var(--color-primary)',
                  backgroundColor: '#F3F4F9',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px',
                }}
              >
                {exam.subject?.name || 'Subject'}
              </span>

              {isCritical && (
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: 'var(--color-danger)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                  }}
                >
                  <AlertTriangle size={13} />
                  Urgent
                </span>
              )}

              {timeLeft.isPast && (
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: 'var(--color-success)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                  }}
                >
                  <CheckCircle2 size={13} />
                  Concluded
                </span>
              )}
            </div>

            <h3
              style={{
                fontSize: '1.18rem',
                fontWeight: 700,
                color: 'var(--color-text-main)',
                lineHeight: 1.3,
              }}
            >
              {exam.examName}
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '2px' }}>
            <button
              onClick={() => onEdit(exam)}
              className="btn-ghost"
              style={{ padding: '5px', borderRadius: '6px' }}
              title="Edit Exam"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => onDelete(exam._id)}
              className="btn-ghost"
              style={{ padding: '5px', borderRadius: '6px', color: 'var(--color-danger)' }}
              title="Delete Exam"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Live Countdown Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            margin: '1.1rem 0',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: isCritical ? '#FEF2F2' : '#F7F8FC',
              border: `1px solid ${isCritical ? '#FEE2E2' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 0.25rem',
            }}
          >
            <div
              style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                color: isCritical ? 'var(--color-danger)' : 'var(--color-primary)',
                lineHeight: 1.1,
              }}
            >
              {timeLeft.days}
            </div>
            <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Days
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#F7F8FC',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 0.25rem',
            }}
          >
            <div
              style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                color: 'var(--color-text-main)',
                lineHeight: 1.1,
              }}
            >
              {timeLeft.hours}
            </div>
            <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Hours
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#F7F8FC',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 0.25rem',
            }}
          >
            <div
              style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                color: 'var(--color-text-main)',
                lineHeight: 1.1,
              }}
            >
              {timeLeft.minutes}
            </div>
            <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Mins
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#F7F8FC',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 0.25rem',
            }}
          >
            <div
              style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                color: 'var(--color-text-main)',
                lineHeight: 1.1,
              }}
            >
              {timeLeft.seconds}
            </div>
            <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Secs
            </div>
          </div>
        </div>

        {/* Exam Metadata */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} color="var(--color-primary)" />
            <span>
              {new Date(exam.examDate).toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}{' '}
              at {exam.examTime || '10:00 AM'}
            </span>
          </div>

          {exam.venue && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} color="var(--color-secondary)" />
              <span>{exam.venue}</span>
            </div>
          )}

          {exam.targetMarks && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Target size={14} color="var(--color-warning)" />
              <span>Target Score: {exam.targetMarks}/70</span>
            </div>
          )}
        </div>
      </div>

      {/* Syllabus Readiness */}
      <div
        style={{
          marginTop: '1.25rem',
          paddingTop: '0.9rem',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.35rem' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>Syllabus Readiness</span>
          <span style={{ color: exam.readinessPercentage >= 75 ? 'var(--color-success)' : 'var(--color-primary)' }}>
            {exam.readinessPercentage || 0}%
          </span>
        </div>
        <ProgressBar
          percentage={exam.readinessPercentage || 0}
          color={exam.readinessPercentage >= 75 ? 'var(--color-success)' : exam.subject?.color}
          height={6}
        />
      </div>
    </div>
  );
};

export default CountdownCard;
