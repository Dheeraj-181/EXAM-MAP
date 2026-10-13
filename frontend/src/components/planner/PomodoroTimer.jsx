import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Award, CheckCircle, Coffee } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '../../context/ToastContext';

const PomodoroTimer = ({ onCycleComplete, activePlanTitle }) => {
  const { showToast } = useToast();
  const [mode, setMode] = useState('focus'); // 'focus' (25m), 'shortBreak' (5m), 'longBreak' (15m)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedCycles, setCompletedCycles] = useState(0);

  const timerRef = useRef(null);

  const getModeTime = (m) => {
    switch (m) {
      case 'shortBreak':
        return 5 * 60;
      case 'longBreak':
        return 15 * 60;
      case 'focus':
      default:
        return 25 * 60;
    }
  };

  const handleModeChange = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(getModeTime(newMode));
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);

            if (mode === 'focus') {
              const newCycles = completedCycles + 1;
              setCompletedCycles(newCycles);
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
              });
              showToast('🎉 Focus session completed! Take a 5-minute break.');
              if (onCycleComplete) onCycleComplete();
              setMode('shortBreak');
              return 5 * 60;
            } else {
              showToast('Break finished! Ready for your next study sprint?');
              setMode('focus');
              return 25 * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, completedCycles, onCycleComplete, showToast]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getModeTime(mode));
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressPercent = ((getModeTime(mode) - timeLeft) / getModeTime(mode)) * 100;

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1.75rem',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F9FAFD 100%)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* Mode Selector Tabs */}
      <div
        style={{
          display: 'flex',
          backgroundColor: '#EDEFF7',
          padding: '4px',
          borderRadius: 'var(--radius-full)',
          gap: '4px',
          marginBottom: '1.5rem',
        }}
      >
        <button
          onClick={() => handleModeChange('focus')}
          style={{
            padding: '0.4rem 1rem',
            fontSize: '0.82rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-full)',
            backgroundColor: mode === 'focus' ? 'var(--color-primary)' : 'transparent',
            color: mode === 'focus' ? '#FFFFFF' : 'var(--color-text-muted)',
            transition: 'all var(--transition-fast)',
          }}
        >
          Study Focus (25m)
        </button>
        <button
          onClick={() => handleModeChange('shortBreak')}
          style={{
            padding: '0.4rem 1rem',
            fontSize: '0.82rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-full)',
            backgroundColor: mode === 'shortBreak' ? 'var(--color-secondary)' : 'transparent',
            color: mode === 'shortBreak' ? '#FFFFFF' : 'var(--color-text-muted)',
            transition: 'all var(--transition-fast)',
          }}
        >
          Short Break (5m)
        </button>
        <button
          onClick={() => handleModeChange('longBreak')}
          style={{
            padding: '0.4rem 1rem',
            fontSize: '0.82rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-full)',
            backgroundColor: mode === 'longBreak' ? 'var(--color-info)' : 'transparent',
            color: mode === 'longBreak' ? '#FFFFFF' : 'var(--color-text-muted)',
            transition: 'all var(--transition-fast)',
          }}
        >
          Long Break (15m)
        </button>
      </div>

      {activePlanTitle && (
        <div
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            marginBottom: '1rem',
            textAlign: 'center',
            maxWidth: '300px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          Current Target: <span style={{ color: 'var(--color-primary)' }}>{activePlanTitle}</span>
        </div>
      )}

      {/* Circular Progress & Digital Display */}
      <div
        style={{
          width: '210px',
          height: '210px',
          borderRadius: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          background: `conic-gradient(${
            mode === 'focus' ? 'var(--color-primary)' : 'var(--color-secondary)'
          } ${progressPercent * 3.6}deg, #E9ECF5 0deg)`,
          padding: '10px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '1.75rem',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'var(--color-surface)',
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: '3rem',
              fontWeight: 800,
              color: 'var(--color-text-main)',
              letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formattedTime}
          </span>
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: mode === 'focus' ? 'var(--color-primary)' : 'var(--color-secondary)',
            }}
          >
            {mode === 'focus' ? (isRunning ? 'Focusing...' : 'Ready') : 'Break Time'}
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
        <button
          onClick={toggleTimer}
          className={`btn ${isRunning ? 'btn-secondary' : 'btn-primary'} btn-lg`}
          style={{ width: '130px' }}
        >
          {isRunning ? (
            <>
              <Pause size={18} /> Pause
            </>
          ) : (
            <>
              <Play size={18} /> Start
            </>
          )}
        </button>

        <button
          onClick={resetTimer}
          className="btn btn-outline"
          style={{ padding: '0.85rem' }}
          title="Reset Timer"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Cycles Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.82rem',
          color: 'var(--color-text-muted)',
          backgroundColor: '#F3F4F9',
          padding: '0.35rem 0.85rem',
          borderRadius: 'var(--radius-full)',
        }}
      >
        <Award size={15} color="var(--color-primary)" />
        <span>
          Cycles Completed Today: <strong style={{ color: 'var(--color-text-main)' }}>{completedCycles}</strong>
        </span>
      </div>
    </div>
  );
};

export default PomodoroTimer;
