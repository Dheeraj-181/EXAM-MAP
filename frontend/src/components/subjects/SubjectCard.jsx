import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Edit3, Trash2, ArrowRight, Award } from 'lucide-react';
import ProgressBar from '../common/ProgressBar';
import Badge from '../common/Badge';

const SubjectCard = ({ subject, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'Hard':
        return <Badge variant="danger">Hard</Badge>;
      case 'Easy':
        return <Badge variant="success">Easy</Badge>;
      default:
        return <Badge variant="warning">Medium</Badge>;
    }
  };

  return (
    <div
      className="card card-clickable"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderTop: `4px solid ${subject.color || '#6558F5'}`,
        height: '100%',
      }}
    >
      <div>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.04em',
                }}
              >
                {subject.code || 'COURSE'}
              </span>
              <span style={{ color: 'var(--color-border)' }}>•</span>
              <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                {subject.credits || 3} Credits
              </span>
            </div>

            <h3
              style={{
                fontSize: '1.18rem',
                fontWeight: 700,
                color: 'var(--color-text-main)',
                lineHeight: 1.3,
              }}
            >
              {subject.name}
            </h3>
          </div>

          <div>{getDifficultyBadge(subject.difficulty)}</div>
        </div>

        {/* Description if present */}
        {subject.description && (
          <p
            style={{
              fontSize: '0.82rem',
              color: 'var(--color-text-muted)',
              marginBottom: '1rem',
              lineHeight: 1.45,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {subject.description}
          </p>
        )}

        {/* Progress Section */}
        <div style={{ margin: '1rem 0' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: '0.4rem',
            }}
          >
            <span style={{ color: 'var(--color-text-muted)' }}>
              {subject.completedTopics || 0} of {subject.totalTopics || 0} topics completed
            </span>
            <span style={{ color: subject.color || 'var(--color-primary)' }}>
              {subject.progressPercentage || 0}%
            </span>
          </div>
          <ProgressBar
            percentage={subject.progressPercentage || 0}
            color={subject.color || 'var(--color-primary)'}
          />
        </div>

        {/* Unit & Exam Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '0.75rem 0' }}>
          <span
            style={{
              fontSize: '0.74rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '6px',
              backgroundColor: '#F3F4F9',
              color: 'var(--color-text-main)',
              fontWeight: 500,
            }}
          >
            {subject.totalUnits || 5} Units
          </span>

          {subject.targetExamDate && (
            <span
              style={{
                fontSize: '0.74rem',
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Calendar size={12} />
              {new Date(subject.targetExamDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--color-border)',
          paddingTop: '0.85rem',
          marginTop: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(subject);
            }}
            className="btn-ghost"
            style={{ padding: '6px', borderRadius: '6px' }}
            title="Edit Subject"
          >
            <Edit3 size={15} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(subject._id);
            }}
            className="btn-ghost"
            style={{ padding: '6px', borderRadius: '6px', color: 'var(--color-danger)' }}
            title="Delete Subject"
          >
            <Trash2 size={15} />
          </button>
        </div>

        <button
          onClick={() => navigate(`/dashboard/syllabus?subjectId=${subject._id}`)}
          className="btn btn-outline btn-sm"
          style={{ gap: '4px', fontSize: '0.78rem' }}
        >
          View Syllabus
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};

export default SubjectCard;
