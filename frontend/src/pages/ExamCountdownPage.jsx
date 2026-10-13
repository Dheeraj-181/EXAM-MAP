import React, { useState, useEffect } from 'react';
import { Hourglass, Plus, Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';
import {
  getFirestoreExams,
  createFirestoreExam,
  updateFirestoreExam,
  deleteFirestoreExam,
} from '../firebase/examService';
import { getFirestoreSubjects } from '../firebase/subjectService';
import { useAuth } from '../context/AuthContext';
import CountdownCard from '../components/countdown/CountdownCard';
import AddExamModal from '../components/countdown/AddExamModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';

const ExamCountdownPage = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);

  const { showToast } = useToast();
  const uid = user?.uid || user?._id || user?.id;

  const fetchExams = async () => {
    if (!uid) return;
    try {
      setLoading(true);
      const [examsData, subjectsData] = await Promise.all([
        getFirestoreExams(uid),
        getFirestoreSubjects(uid),
      ]);

      setExams(examsData);
      setSubjects(subjectsData);
    } catch (err) {
      showToast('Failed to load exam countdowns', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, [uid]);

  const handleCreateOrUpdate = async (formData) => {
    if (!uid) return;
    try {
      if (editingExam) {
        await updateFirestoreExam(uid, editingExam._id || editingExam.id, formData);
        showToast('Exam schedule updated successfully');
      } else {
        await createFirestoreExam(uid, formData);
        showToast('Exam scheduled with real-time countdown!');
      }
      setIsModalOpen(false);
      setEditingExam(null);
      fetchExams();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!uid) return;
    if (window.confirm('Delete this examination schedule?')) {
      try {
        await deleteFirestoreExam(uid, id);
        showToast('Exam removed');
        fetchExams();
      } catch (err) {
        showToast(err.message || 'Failed to remove exam', 'error');
      }
    }
  };

  const handleEdit = (exam) => {
    setEditingExam(exam);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingExam(null);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Live Examination Countdown</h1>
          <p className="section-subtitle">
            Real-time second-by-second countdowns paired with course syllabus readiness
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleAddNew}>
          <Plus size={16} /> Schedule Exam
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Calculating examination countdowns..." size={32} />
      ) : exams.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {exams.map((exam) => (
            <CountdownCard
              key={exam._id}
              exam={exam}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Hourglass}
          title="No Examinations Scheduled"
          description="Schedule your upcoming university mid-terms or semester end theory exams."
          actionLabel="Schedule Exam"
          onAction={handleAddNew}
        />
      )}

      <AddExamModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingExam(null);
        }}
        onSubmit={handleCreateOrUpdate}
        subjects={subjects}
        initialData={editingExam}
      />
    </div>
  );
};

export default ExamCountdownPage;
