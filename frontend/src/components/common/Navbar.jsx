import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, ArrowRight, LayoutDashboard, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--color-border)',
        height: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(101, 88, 245, 0.3)',
            }}
          >
            <Compass size={22} />
          </div>
          <div>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--color-text-main)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              Exam<span style={{ color: 'var(--color-primary)' }}>Map</span>
            </div>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 600,
                color: 'var(--color-secondary)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Smart Study Planner
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav
          style={{
            display: 'none',
            gap: '2rem',
            alignItems: 'center',
          }}
          className="desktop-nav"
        >
          <a
            href="#features"
            style={{
              fontSize: '0.9rem',
              fontWeight: 500,
              color: 'var(--color-text-muted)',
              transition: 'color var(--transition-fast)',
            }}
            onMouseOver={(e) => (e.target.style.color = 'var(--color-primary)')}
            onMouseOut={(e) => (e.target.style.color = 'var(--color-text-muted)')}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            style={{
              fontSize: '0.9rem',
              fontWeight: 500,
              color: 'var(--color-text-muted)',
              transition: 'color var(--transition-fast)',
            }}
            onMouseOver={(e) => (e.target.style.color = 'var(--color-primary)')}
            onMouseOut={(e) => (e.target.style.color = 'var(--color-text-muted)')}
          >
            How It Works
          </a>
          <a
            href="#curriculum"
            style={{
              fontSize: '0.9rem',
              fontWeight: 500,
              color: 'var(--color-text-muted)',
              transition: 'color var(--transition-fast)',
            }}
            onMouseOver={(e) => (e.target.style.color = 'var(--color-primary)')}
            onMouseOut={(e) => (e.target.style.color = 'var(--color-text-muted)')}
          >
            Curriculum
          </a>
        </nav>

        {/* Auth CTA Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {isAuthenticated ? (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/dashboard')}
              style={{ padding: '0.55rem 1.15rem' }}
            >
              <LayoutDashboard size={16} />
              Open Dashboard
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-ghost btn-sm"
                style={{ fontWeight: 600 }}
              >
                <LogIn size={15} />
                Log In
              </Link>
              <Link
                to="/register"
                className="btn btn-primary btn-sm"
                style={{ padding: '0.55rem 1.15rem' }}
              >
                Get Started
                <ArrowRight size={15} />
              </Link>
            </>
          )}
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
