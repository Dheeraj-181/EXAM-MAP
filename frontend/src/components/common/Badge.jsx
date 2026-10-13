import React from 'react';

const Badge = ({ children, variant = 'neutral', icon: Icon, className = '' }) => {
  const getStyles = () => {
    switch (variant) {
      case 'primary':
        return { bg: 'var(--color-primary-light)', color: 'var(--color-primary)' };
      case 'success':
        return { bg: 'var(--color-success-light)', color: 'var(--color-success)' };
      case 'warning':
        return { bg: 'var(--color-warning-light)', color: 'var(--color-warning)' };
      case 'danger':
        return { bg: 'var(--color-danger-light)', color: 'var(--color-danger)' };
      case 'info':
        return { bg: 'var(--color-info-light)', color: 'var(--color-info)' };
      default:
        return { bg: '#ECEEF4', color: 'var(--color-text-muted)' };
    }
  };

  const { bg, color } = getStyles();

  return (
    <span
      className={`badge ${className}`}
      style={{
        backgroundColor: bg,
        color: color,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '0.2rem 0.6rem',
        borderRadius: '999px',
        fontSize: '0.74rem',
        fontWeight: 600,
      }}
    >
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
};

export default Badge;
