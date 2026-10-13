import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  FileText,
  AlertCircle,
} from 'lucide-react';
import Badge from '../common/Badge';

const TopicItem = ({ topic, onToggleStatus, onEdit, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'High':
        return <Badge variant="danger">High Priority</Badge>;
      case 'Low':
        return <Badge variant="info">Low Priority</Badge>;
      default:
        return <Badge variant="warning">Medium</Badge>;
    }
  };

  const isCompleted = topic.status === 'Completed';
  const isInProgress = topic.status === 'In Progress';

  return (
    <div
      style={{
        backgroundColor: isCompleted ? '#FAFCFB' : '#FFFFFF',
        border: `1px solid ${isCompleted ? '#D1FAE5' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1rem',
        marginBottom: '0.5rem',
        transition: 'all var(--transition-fast)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
        {/* Status Checkbox / Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
          <button
            onClick={() => onToggleStatus(topic)}
            title={`Status: ${topic.status}. Click to cycle.`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: isCompleted
                ? 'var(--color-success)'
                : isInProgress
                ? 'var(--color-warning)'
                : 'var(--color-text-light)',
              flexShrink: 0,
            }}
          >
            {isCompleted ? (
              <CheckCircle2 size={22} />
            ) : isInProgress ? (
              <Clock size={22} />
            ) : (
              <Circle size={22} />
            )}
          </button>

          <div style={{ flex: 1, minWidth: 0 }}>
            <span
              style={{
                fontSize: '0.92rem',
                fontWeight: 600,
                color: isCompleted ? 'var(--color-text-muted)' : 'var(--color-text-main)',
                textDecoration: isCompleted ? 'line-through' : 'none',
                display: 'block',
                lineHeight: 1.4,
              }}
            >
              {topic.title}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
              {getPriorityBadge(topic.priority)}

              <span
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--color-text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                <Clock size={11} />
                {topic.estimatedHours || 2}h study
              </span>

              {topic.notes && (
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--color-primary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px',
                    fontWeight: 600,
                  }}
                >
                  <FileText size={11} />
                  {showDetails ? 'Hide Notes' : 'View Notes'}
                  {showDetails ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <button
            onClick={() => onEdit(topic)}
            className="btn-ghost"
            style={{ padding: '5px', borderRadius: '6px' }}
            title="Edit Topic"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(topic._id)}
            className="btn-ghost"
            style={{ padding: '5px', borderRadius: '6px', color: 'var(--color-danger)' }}
            title="Delete Topic"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Expanded Notes Section */}
      {showDetails && topic.notes && (
        <div
          style={{
            marginTop: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px dashed var(--color-border)',
            fontSize: '0.82rem',
            color: 'var(--color-text-muted)',
            lineHeight: 1.5,
            backgroundColor: 'var(--color-surface-subtle)',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <strong style={{ color: 'var(--color-text-main)', display: 'block', marginBottom: '2px' }}>
            Study Notes & Reference:
          </strong>
          {topic.notes}
        </div>
      )}
    </div>
  );
};

export default TopicItem;
