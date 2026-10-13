import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Calendar,
  Hourglass,
  BarChart3,
  Clock,
  ShieldCheck,
  Award,
  Sparkles,
  Zap,
  Target,
  ExternalLink,
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Hero Section */}
      <section
        style={{
          padding: '4.5rem 1.5rem 3.5rem',
          textAlign: 'center',
          maxWidth: '1080px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '1.75rem',
            letterSpacing: '0.02em',
          }}
        >
          <Sparkles size={16} />
          <span>Intelligent Exam Preparation & Syllabus Tracker</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.3rem, 5vw, 3.6rem)',
            fontWeight: 800,
            color: 'var(--color-text-main)',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '1.25rem',
          }}
        >
          Your Syllabus. Your Schedule.{' '}
          <span style={{ color: 'var(--color-primary)' }}>Your Success.</span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--color-text-muted)',
            maxWidth: '680px',
            margin: '0 auto 2.25rem',
            lineHeight: 1.6,
          }}
        >
          Plan Smart. Study Better. Score Confidently. ExamMap bridges textbook theory and exam
          readiness with interactive unit-by-unit tracking, smart study scheduling, and live exam countdowns.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary btn-lg"
              style={{ padding: '0.85rem 2rem' }}
            >
              Go to Your Dashboard
              <ArrowRight size={18} />
            </button>
          ) : (
            <>
              <Link
                to="/register"
                className="btn btn-primary btn-lg"
                style={{ padding: '0.85rem 2rem' }}
              >
                Get Started Free
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="btn btn-outline btn-lg"
                style={{ padding: '0.85rem 2rem' }}
              >
                Sign In to Account
              </Link>
            </>
          )}
        </div>

        {/* Value Prop Highlights */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            marginTop: '2.5rem',
            flexWrap: 'wrap',
            color: 'var(--color-text-muted)',
            fontSize: '0.88rem',
            fontWeight: 500,
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} color="var(--color-success)" /> 100% Free & Open-Source
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} color="var(--color-success)" /> Preloaded Core CS Curriculum
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} color="var(--color-success)" /> Integrated Pomodoro Focus
          </span>
        </div>
      </section>

      {/* Dashboard Preview / Realistic Mockup */}
      <section
        style={{
          maxWidth: '1160px',
          margin: '0 auto 5rem',
          padding: '0 1.5rem',
          width: '100%',
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid var(--color-border)',
            boxShadow: '0 20px 45px -10px rgba(32, 36, 58, 0.12)',
            padding: '1.25rem',
            position: 'relative',
          }}
        >
          {/* Mock Browser Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--color-border)',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
              <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
              <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            </div>
            <div
              style={{
                backgroundColor: '#F3F4F9',
                borderRadius: '6px',
                padding: '0.2rem 1rem',
                fontSize: '0.76rem',
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-mono)',
                margin: '0 auto',
              }}
            >
              https://exammap.internal/dashboard/overview
            </div>
          </div>

          {/* Realistic Dashboard Preview UI */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ backgroundColor: '#F9FAFD', padding: '1.1rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Active Subjects</span>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--color-text-main)', marginTop: '4px' }}>4 Courses</div>
              <span style={{ fontSize: '0.74rem', color: 'var(--color-success)', fontWeight: 600 }}>Active Semester</span>
            </div>

            <div style={{ backgroundColor: '#F9FAFD', padding: '1.1rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Syllabus Covered</span>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '4px' }}>16 / 70 Topics</div>
              <span style={{ fontSize: '0.74rem', color: 'var(--color-primary)', fontWeight: 600 }}>23% Overall Completion</span>
            </div>

            <div style={{ backgroundColor: '#F9FAFD', padding: '1.1rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Next University Exam</span>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--color-danger)', marginTop: '4px' }}>18 Days Left</div>
              <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>Operating Systems Theory</span>
            </div>

            <div style={{ backgroundColor: '#F9FAFD', padding: '1.1rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Pomodoro Focus</span>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--color-secondary)', marginTop: '4px' }}>2 Cycles Today</div>
              <span style={{ fontSize: '0.74rem', color: 'var(--color-secondary)', fontWeight: 600 }}>50 Minutes Pure Study</span>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              padding: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>Operating Systems (20A05501T) — Unit Progress</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 700 }}>4 of 21 Topics Completed</span>
            </div>
            <div className="progress-track" style={{ height: '9px' }}>
              <div className="progress-fill" style={{ width: '24%', backgroundColor: 'var(--color-primary)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section
        id="features"
        style={{
          maxWidth: '1160px',
          margin: '0 auto 5rem',
          padding: '0 1.5rem',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Built Specifically for Engineering Academics
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', maxWidth: '580px', margin: '0 auto' }}>
            Designed around standard 5-unit university curriculums to eliminate exam anxiety and streamline preparation.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div className="card">
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.1rem' }}>
              <BookOpen size={22} />
            </div>
            <h3 style={{ fontSize: '1.18rem', fontWeight: 700, marginBottom: '0.5rem' }}>5-Unit Syllabus Tracker</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              Organize syllabus topics across Units 1 to 5 with real-time status toggling, difficulty weights, and university question notes.
            </p>
          </div>

          <div className="card">
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--color-secondary-light)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.1rem' }}>
              <Calendar size={22} />
            </div>
            <h3 style={{ fontSize: '1.18rem', fontWeight: 700, marginBottom: '0.5rem' }}>Targeted Study Planner</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              Schedule daily study sessions, assign topic goals, and balance your workload leading up to internal mid-terms and external exams.
            </p>
          </div>

          <div className="card">
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#FEE2E2', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.1rem' }}>
              <Hourglass size={22} />
            </div>
            <h3 style={{ fontSize: '1.18rem', fontWeight: 700, marginBottom: '0.5rem' }}>Live Exam Countdown</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              Track days, hours, and minutes remaining for every theory exam, accompanied by real syllabus coverage readiness meters.
            </p>
          </div>

          <div className="card">
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#ECEBFE', color: '#6558F5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.1rem' }}>
              <Clock size={22} />
            </div>
            <h3 style={{ fontSize: '1.18rem', fontWeight: 700, marginBottom: '0.5rem' }}>Built-in Pomodoro Focus</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              Maintain sustained focus with 25-minute sprint timers and short breaks directly linked to your current revision subject.
            </p>
          </div>

          <div className="card">
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--color-info-light)', color: 'var(--color-info)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.1rem' }}>
              <BarChart3 size={22} />
            </div>
            <h3 style={{ fontSize: '1.18rem', fontWeight: 700, marginBottom: '0.5rem' }}>Performance Analytics</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              Visual completion breakdowns, priority distribution metrics, and study hours estimation ensure you never miss high-scoring units.
            </p>
          </div>

          <div className="card">
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.1rem' }}>
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontSize: '1.18rem', fontWeight: 700, marginBottom: '0.5rem' }}>JWT Auth & MongoDB CRUD</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              Built strictly as an enterprise-grade MERN architecture with bcrypt password hashing, JWT sessions, and full database persistence.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        style={{
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
          padding: '4.5rem 1.5rem',
        }}
      >
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              How ExamMap Works in 3 Simple Steps
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Simple, organized, and scientifically proven to boost semester GPA.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  margin: '0 auto 1.25rem',
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Load Your Syllabus</h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Use preloaded core computer science subjects or customize your own units, topics, and credit weights.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-secondary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  margin: '0 auto 1.25rem',
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Track & Focus</h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Mark topics completed as you study and use the 25-minute Pomodoro timer for deep study sprints.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-success)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  margin: '0 auto 1.25rem',
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Ace the Exams</h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Walk into examination halls with 100% syllabus visibility and verified topic mastery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Callout */}
      <section
        id="curriculum"
        style={{
          maxWidth: '1080px',
          margin: '4rem auto',
          padding: '2.5rem',
          backgroundColor: 'var(--color-primary-light)',
          borderRadius: '20px',
          border: '1px solid #D6D2FA',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ maxWidth: '640px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Standard Academic Architecture
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text-main)', margin: '0.35rem 0 0.5rem' }}>
              Engineered for Computer Science & Engineering
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              Pre-configured with complete core courses: Operating Systems, Database Management Systems,
              Computer Networks, and Software Engineering, structured across complete 5-unit syllabus frameworks.
            </p>
          </div>

          <Link to="/register" className="btn btn-primary btn-lg">
            Create Free Account
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          marginTop: 'auto',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--color-border)',
          padding: '2.5rem 1.5rem',
        }}
      >
        <div
          style={{
            maxWidth: '1160px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
            fontSize: '0.86rem',
            color: 'var(--color-text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={20} color="var(--color-primary)" />
            <strong style={{ color: 'var(--color-text-main)' }}>ExamMap</strong>
            <span>— Smart Study Planner & Exam Preparation Tracker</span>
          </div>

          <div>
            ExamMap Platform • Plan Smart. Study Better. Score Confidently.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
