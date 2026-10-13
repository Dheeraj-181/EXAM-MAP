import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          backgroundColor: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
        }}
      >
        <Compass size={28} />
      </div>

      <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--color-text-main)', lineHeight: 1 }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0.5rem 0 0.75rem' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--color-text-muted)', maxWidth: '420px', marginBottom: '1.75rem', fontSize: '0.92rem' }}>
        The study path or page you are looking for does not exist or may have been relocated.
      </p>

      <Link to="/" className="btn btn-primary">
        <ArrowLeft size={16} /> Return to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
