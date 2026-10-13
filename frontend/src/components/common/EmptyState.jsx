import React from 'react';
import { BookOpen } from 'lucide-react';

const EmptyState = ({
  icon: Icon = BookOpen,
  title = 'No items found',
  description = 'Get started by creating your first record.',
  actionLabel,
  onAction,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3.5rem 1.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '2px dashed var(--color-border)',
        backgroundColor: '#FCFCFE',
        margin: '1rem 0',
      }}
    >
      <div
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        <Icon size={26} />
      </div>

      <h4
        style={{
          fontSize: '1.08rem',
          fontWeight: 700,
          color: 'var(--color-text-main)',
          marginBottom: '0.4rem',
        }}
      >
        {title}
      </h4>

      <p
        style={{
          fontSize: '0.86rem',
          color: 'var(--color-text-muted)',
          maxWidth: '380px',
          lineHeight: 1.5,
          marginBottom: actionLabel ? '1.25rem' : '0',
        }}
      >
        {description}
      </p>

      {actionLabel && onAction && (
        <button className="btn btn-primary btn-sm" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
