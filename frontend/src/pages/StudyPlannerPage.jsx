import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  CheckCircle2,
  Trash2,
  Edit2,
  Filter,
  Play,
  RotateCcw,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import {
  getFirestoreStudyPlans,
  createFirestoreStudyPlan,
  updateFirestoreStudyPlan,
  recordFirestorePomodoro,
  deleteFirestoreStudyPlan,
} from '../firebase/studyPlanService';
import { getFirestoreSubjects } from '../firebase/subjectService';
import { useAuth } from '../context/AuthContext';
import PomodoroTimer from '../components/planner/PomodoroTimer';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';

const StudyPlannerPage = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');
  const [activePlanForTimer, setActivePlanForTimer] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    subject: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '18:00',
    durationMinutes: 60,
    notes: '',
  });

  const { showToast } = useToast();
  const uid = user?.uid || user?._id || user?.id;

  const fetchPlans = async () => {
    if (!uid) return;
    try {
      setLoading(true);
      const [plansData, subjectsData] = await Promise.all([
        getFirestoreStudyPlans(uid),
        getFirestoreSubjects(uid),
      ]);

      setPlans(plansData);
      if (plansData.length > 0 && !activePlanForTimer) {
        setActivePlanForTimer(plansData[0]);
      }
      setSubjects(subjectsData);
      if (subjectsData.length > 0 && !formData.subject) {
        setFormData((p) => ({ ...p, subject: subjectsData[0]._id || subjectsData[0].id }));
      }
    } catch (err) {
      showToast('Failed to load study sessions', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [uid]);

  const handleCreateOrUpdatePlan = async (e) => {
    e.preventDefault();
    if (!uid) return;
    try {
      if (editingPlan) {
        await updateFirestoreStudyPlan(uid, editingPlan._id || editingPlan.id, formData);
        showToast('Study session updated');
      } else {
        await createFirestoreStudyPlan(uid, formData);
        showToast('Study session planned successfully!');
      }
      setIsModalOpen(false);
      setEditingPlan(null);
      fetchPlans();
    } catch (err) {
      showToast(err.message || 'Failed to schedule session', 'error');
    }
  };

  const handleTogglePlanComplete = async (plan) => {
    if (!uid) return;
    try {
      const nextStatus = plan.status === 'Completed' ? 'Planned' : 'Completed';
      await updateFirestoreStudyPlan(uid, plan._id || plan.id, { status: nextStatus });
      showToast(`Session marked as ${nextStatus}`);
      fetchPlans();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDeletePlan = async (id) => {
    if (!uid) return;
    if (window.confirm('Delete this scheduled study session?')) {
      try {
        await deleteFirestoreStudyPlan(uid, id);
        showToast('Study session deleted');
        fetchPlans();
      } catch (err) {
        showToast('Failed to delete session', 'error');
      }
    }
  };

  const handlePomodoroCycleCompleted = async () => {
    if (activePlanForTimer && uid) {
      try {
        await recordFirestorePomodoro(uid, activePlanForTimer._id || activePlanForTimer.id);
        fetchPlans();
      } catch (err) {
        console.error('Failed to update cycle:', err);
      }
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      subject: plan.subject?._id || plan.subject || '',
      title: plan.title || '',
      date: plan.date || '',
      startTime: plan.startTime || '18:00',
      durationMinutes: plan.durationMinutes || 60,
      notes: plan.notes || '',
    });
    setIsModalOpen(true);
  };

  const filteredPlans = plans.filter((p) => {
    if (!dateFilter) return true;
    return p.date === dateFilter;
  });

  return (
    <div>
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title">Study Planner & Focus Suite</h1>
          <p className="section-subtitle">
            Plan daily syllabus revisions and maintain focus with Pomodoro sprints
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingPlan(null);
            setFormData({
              subject: subjects[0]?._id || '',
              title: '',
              date: new Date().toISOString().split('T')[0],
              startTime: '18:00',
              durationMinutes: 60,
              notes: '',
            });
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} /> Schedule Session
        </button>
      </div>

      {/* Main Grid: Pomodoro Timer & Schedule List */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.75rem',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Pomodoro Focus Timer */}
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
              Integrated Study Timer
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              25m focus blocks proven to maximize memory retention
            </p>
          </div>

          <PomodoroTimer
            activePlanTitle={activePlanForTimer ? `${activePlanForTimer.subject?.name}: ${activePlanForTimer.title}` : null}
            onCycleComplete={handlePomodoroCycleCompleted}
          />
        </div>

        {/* Right Column: Scheduled Study Sessions */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                Study Schedule
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                Targeted daily preparation timetable
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
              />
              {dateFilter && (
                <button
                  onClick={() => setDateFilter('')}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: '0.78rem' }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading study sessions..." size={30} />
          ) : filteredPlans.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {filteredPlans.map((plan) => {
                const isSelectedForTimer = activePlanForTimer?._id === plan._id;
                const isDone = plan.status === 'Completed';

                return (
                  <div
                    key={plan._id}
                    className="card"
                    style={{
                      padding: '1.1rem 1.25rem',
                      borderLeft: `4px solid ${plan.subject?.color || 'var(--color-primary)'}`,
                      backgroundColor: isSelectedForTimer ? '#FDFDFF' : '#FFFFFF',
                      boxShadow: isSelectedForTimer ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                        <button
                          onClick={() => handleTogglePlanComplete(plan)}
                          style={{
                            color: isDone ? 'var(--color-success)' : 'var(--color-text-light)',
                            cursor: 'pointer',
                            marginTop: '2px',
                          }}
                          title={isDone ? 'Mark as planned' : 'Mark as completed'}
                        >
                          <CheckCircle2 size={20} />
                        </button>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                color: plan.subject?.color || 'var(--color-primary)',
                              }}
                            >
                              {plan.subject?.name}
                            </span>
                            <span style={{ color: 'var(--color-border)' }}>•</span>
                            <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                              {plan.date} at {plan.startTime || '18:00'} ({plan.durationMinutes}m)
                            </span>
                          </div>

                          <h4
                            style={{
                              fontSize: '0.98rem',
                              fontWeight: 700,
                              color: 'var(--color-text-main)',
                              textDecoration: isDone ? 'line-through' : 'none',
                              marginBottom: '4px',
                            }}
                          >
                            {plan.title}
                          </h4>

                          {plan.notes && (
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                              {plan.notes}
                            </p>
                          )}

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                            {plan.pomodoroCyclesCompleted > 0 && (
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  padding: '0.15rem 0.5rem',
                                  borderRadius: '4px',
                                  backgroundColor: 'var(--color-primary-light)',
                                  color: 'var(--color-primary)',
                                  fontWeight: 600,
                                }}
                              >
                                {plan.pomodoroCyclesCompleted} Pomodoros Done
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <button
                          onClick={() => setActivePlanForTimer(plan)}
                          className="btn btn-outline btn-sm"
                          style={{
                            fontSize: '0.74rem',
                            padding: '0.35rem 0.65rem',
                            borderColor: isSelectedForTimer ? 'var(--color-primary)' : 'var(--color-border)',
                            color: isSelectedForTimer ? 'var(--color-primary)' : 'var(--color-text-muted)',
                            fontWeight: isSelectedForTimer ? 700 : 500,
                          }}
                        >
                          {isSelectedForTimer ? 'Active Target' : 'Focus'}
                        </button>

                        <button
                          onClick={() => handleEdit(plan)}
                          className="btn-ghost"
                          style={{ padding: '5px', borderRadius: '6px' }}
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>

                        <button
                          onClick={() => handleDeletePlan(plan._id)}
                          className="btn-ghost"
                          style={{ padding: '5px', borderRadius: '6px', color: 'var(--color-danger)' }}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={CalendarIcon}
              title="No Study Sessions Planned"
              description="Schedule revision sessions leading up to semester exams."
              actionLabel="Schedule Session"
              onAction={() => setIsModalOpen(true)}
            />
          )}
        </div>
      </div>

      {/* Schedule Session Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPlan(null);
        }}
        title={editingPlan ? 'Edit Study Session' : 'Schedule Study Session'}
      >
        <form onSubmit={handleCreateOrUpdatePlan}>
          <div className="form-group">
            <label className="form-label">Subject *</label>
            <select
              required
              value={formData.subject}
              onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))}
            >
              <option value="">Select Course</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.code || 'Course'})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Session Goal / Topic *</label>
            <input
              type="text"
              required
              placeholder="e.g. Revise CPU Scheduling Algorithms & solve Gantt chart numericals"
              value={formData.title}
              onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData((p) => ({ ...p, startTime: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Planned Duration (Minutes)</label>
            <input
              type="number"
              min="15"
              step="15"
              max="360"
              value={formData.durationMinutes}
              onChange={(e) => setFormData((p) => ({ ...p, durationMinutes: Number(e.target.value) }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Study Notes / Reference Questions</label>
            <textarea
              rows="2"
              placeholder="Textbook pages, university previous year question number..."
              value={formData.notes}
              onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingPlan(null);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingPlan ? 'Update Session' : 'Save Session'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudyPlannerPage;
