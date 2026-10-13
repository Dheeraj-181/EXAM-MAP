import React from 'react';

const ProgressBar = ({
  percentage = 0,
  height = 8,
  color = 'var(--color-primary)',
  showLabel = false,
  labelStyle = {},
}) => {
  const clamped = Math.min(100, Math.max(0, Math.round(percentage)));

  // Dynamic color based on completion if default not customized
  let barColor = color;
  if (color === 'auto') {
    if (clamped >= 80) barColor = 'var(--color-success)';
    else if (clamped >= 40) barColor = 'var(--color-primary)';
    else if (clamped > 0) barColor = 'var(--color-warning)';
    else barColor = '#D4D8E6';
  }

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.35rem',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: 'var(--color-text-main)',
            ...labelStyle,
          }}
        >
          <span>Progress</span>
          <span style={{ color: 'var(--color-primary)' }}>{clamped}%</span>
        </div>
      )}
      <div
        className="progress-track"
        style={{
          height: `${height}px`,
          backgroundColor: '#EAEBF2',
          borderRadius: '999px',
          overflow: 'hidden',
        }}
      >
        <div
          className="progress-fill"
          style={{
            width: `${clamped}%`,
            height: '100%',
            backgroundColor: barColor,
            borderRadius: '999px',
            transition: 'width 0.5s ease',
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
