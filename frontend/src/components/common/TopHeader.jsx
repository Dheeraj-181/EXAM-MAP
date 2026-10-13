import React from 'react';
import { Menu, Calendar as CalendarIcon, Clock, Award, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TopHeader = ({ onMenuClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.75rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onMenuClick}
          className="btn-ghost"
          style={{
            display: 'none',
            padding: '6px',
            borderRadius: '8px',
          }}
          id="mobile-menu-toggle"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2
            style={{
              fontSize: '1.18rem',
              fontWeight: 700,
              color: 'var(--color-text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Welcome, {user?.name?.split(' ')[0] || 'Student'}
            <span style={{ fontSize: '1.1rem' }}>👋</span>
          </h2>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              color: 'var(--color-text-muted)',
              marginTop: '1px',
            }}
          >
            <CalendarIcon size={13} />
            <span>{formattedDate}</span>
            <span style={{ color: 'var(--color-border-hover)' }}>•</span>
            <span style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>
              {user?.college || 'Computer Science & Engineering'}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => navigate('/dashboard/planner')}
          style={{ gap: '6px' }}
        >
          <Clock size={15} color="var(--color-primary)" />
          <span className="header-action-text">Study Timer</span>
        </button>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => navigate('/dashboard/syllabus')}
          style={{ gap: '6px' }}
        >
          <Sparkles size={15} />
          <span className="header-action-text">Syllabus Tracker</span>
        </button>
      </div>

      <style>{`
        @media (max-width: 991px) {
          #mobile-menu-toggle {
            display: flex !important;
          }
        }
        @media (max-width: 640px) {
          .header-action-text {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default TopHeader;
