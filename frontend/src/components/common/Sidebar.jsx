import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  Calendar,
  Hourglass,
  BarChart3,
  User,
  LogOut,
  Compass,
  Sparkles,
  RefreshCw,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { name: 'My Subjects', path: '/dashboard/subjects', icon: BookOpen },
  { name: 'Syllabus Tracker', path: '/dashboard/syllabus', icon: CheckSquare },
  { name: 'Study Planner', path: '/dashboard/planner', icon: Calendar },
  { name: 'Exam Countdown', path: '/dashboard/countdown', icon: Hourglass },
  { name: 'Progress Analytics', path: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Profile', path: '/dashboard/profile', icon: User },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, reseedCurriculum } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleReseed = async () => {
    if (window.confirm('Reload standard sample curriculum? This will refresh demo subjects.')) {
      await reseedCurriculum();
      window.location.reload();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(32, 36, 58, 0.4)',
            zIndex: 199,
          }}
          className="mobile-backdrop"
        />
      )}

      <aside
        className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
        style={{
          width: 'var(--sidebar-width)',
          backgroundColor: 'var(--color-surface)',
          borderRight: '1px solid var(--color-border)',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 200,
          transition: 'transform var(--transition-normal)',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 4px 10px rgba(101, 88, 245, 0.3)',
              }}
            >
              <Compass size={20} />
            </div>
            <div>
              <span
                style={{
                  fontSize: '1.18rem',
                  fontWeight: 800,
                  color: 'var(--color-text-main)',
                  letterSpacing: '-0.02em',
                }}
              >
                Exam<span style={{ color: 'var(--color-primary)' }}>Map</span>
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.66rem',
                  fontWeight: 600,
                  color: 'var(--color-secondary)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Study Workspace
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              display: 'none',
              padding: '4px',
              color: 'var(--color-text-muted)',
            }}
            className="mobile-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Quick Pill */}
        <div
          style={{
            margin: '1rem 1.25rem 0.5rem',
            padding: '0.75rem 0.9rem',
            backgroundColor: 'var(--color-surface-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.88rem',
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--color-text-main)',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              {user?.name || 'Student'}
            </div>
            <div
              style={{
                fontSize: '0.72rem',
                color: 'var(--color-text-muted)',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              {user?.branch || 'Computer Science'}
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--color-text-light)',
              letterSpacing: '0.05em',
              padding: '0.5rem 0.75rem 0.25rem',
            }}
          >
            Study Workspace
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={onClose}
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
                  transition: 'all var(--transition-fast)',
                })}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <button
            onClick={handleReseed}
            className="btn btn-outline btn-sm"
            style={{
              width: '100%',
              fontSize: '0.78rem',
              justifyContent: 'flex-start',
              color: 'var(--color-text-muted)',
            }}
            title="Reset syllabus to standard core computer science subjects"
          >
            <RefreshCw size={14} />
            Reset Sample Syllabus
          </button>

          <button
            onClick={handleLogout}
            className="btn btn-ghost btn-sm"
            style={{
              width: '100%',
              fontSize: '0.84rem',
              justifyContent: 'flex-start',
              color: 'var(--color-danger)',
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <style>{`
        @media (max-width: 991px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar.sidebar-open {
            transform: translateX(0);
          }
          .mobile-close-btn {
            display: block !important;
          }
        }
        .nav-link:hover {
          color: var(--color-primary) !important;
          background-color: #F4F3FE !important;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
