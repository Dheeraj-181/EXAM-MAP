import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, BookOpen, Layers } from 'lucide-react';
import {
  getFirestoreSubjects,
  createFirestoreSubject,
  updateFirestoreSubject,
  deleteFirestoreSubject,
} from '../firebase/subjectService';
import { useAuth } from '../context/AuthContext';
import SubjectCard from '../components/subjects/SubjectCard';
import SubjectModal from '../components/subjects/SubjectModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';

const SubjectsPage = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const { showToast } = useToast();
  const uid = user?.uid || user?._id || user?.id;

  const fetchSubjects = async () => {
    if (!uid) return;
    try {
      setLoading(true);
      const data = await getFirestoreSubjects(uid);
      setSubjects(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load subjects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [uid]);

  const handleCreateOrUpdate = async (formData) => {
    if (!uid) return;
    try {
      if (editingSubject) {
        await updateFirestoreSubject(uid, editingSubject._id || editingSubject.id, formData);
        showToast('Subject updated successfully!');
      } else {
        await createFirestoreSubject(uid, formData);
        showToast('New subject added to your curriculum!');
      }
      setIsModalOpen(false);
      setEditingSubject(null);
      fetchSubjects();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject and its associated syllabus topics?')) {
      try {
        await deleteFirestoreSubject(uid, id);
        showToast('Subject deleted');
        fetchSubjects();
      } catch (err) {
        showToast(err.message || 'Failed to delete subject', 'error');
      }
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingSubject(null);
    setIsModalOpen(true);
  };

  const filteredSubjects = subjects.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.code && s.code.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDiff = difficultyFilter === 'All' || s.difficulty === difficultyFilter;
    return matchesSearch && matchesDiff;
  });

  return (
    <div>
      {/* Section Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title">My Subjects & Courses</h1>
          <p className="section-subtitle">
            Manage your enrolled university curriculum and track overall course progress
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleAddNew}>
          <Plus size={16} /> Add New Subject
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '1rem 1.25rem',
          marginBottom: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            placeholder="Search subject by title or course code (e.g. 20A05501T)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search
            size={16}
            color="var(--color-text-light)"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
            Difficulty:
          </span>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            style={{ width: 'auto', minWidth: '130px' }}
          >
            <option value="All">All Levels</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Grid of Subjects */}
      {loading ? (
        <LoadingSpinner text="Loading courses..." size={32} />
      ) : filteredSubjects.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filteredSubjects.map((subject) => (
            <SubjectCard
              key={subject._id}
              subject={subject}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title={searchQuery ? 'No matching subjects found' : 'No subjects added yet'}
          description={
            searchQuery
              ? 'Try adjusting your search query or difficulty filter.'
              : 'Add your first semester course to begin tracking syllabus topics.'
          }
          actionLabel="Add New Subject"
          onAction={handleAddNew}
        />
      )}

      {/* Subject Modal */}
      <SubjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSubject(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingSubject}
      />
    </div>
  );
};

export default SubjectsPage;
