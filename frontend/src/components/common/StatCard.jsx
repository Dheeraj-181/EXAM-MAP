import React from 'react';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = '#6558F5',
  iconBg = '#ECEBFE',
  badgeText,
  badgeVariant = 'success',
  onClick,
}) => {
  return (
    <div
      className={`card ${onClick ? 'card-clickable' : ''}`}
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.25rem 1.4rem',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.9rem' }}>
        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            letterSpacing: '0.01em',
          }}
        >
          {title}
        </span>
        {Icon && (
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: iconColor,
            }}
          >
            <Icon size={20} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span
          style={{
            fontSize: '1.85rem',
            fontWeight: 800,
            color: 'var(--color-text-main)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
        >
          {value}
        </span>
        {badgeText && (
          <span
            className={`badge badge-${badgeVariant}`}
            style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem' }}
          >
            {badgeText}
          </span>
        )}
      </div>

      {subtitle && (
        <span
          style={{
            fontSize: '0.78rem',
            color: 'var(--color-text-muted)',
            marginTop: '0.5rem',
          }}
        >
          {subtitle}
        </span>
      )}
    </div>
  );
};

export default StatCard;
