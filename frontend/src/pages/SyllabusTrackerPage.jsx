import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { getFirestoreSubjects, getFirestoreSubject } from '../firebase/subjectService';
import {
  toggleFirestoreTopicStatus,
  createFirestoreTopic,
  updateFirestoreTopic,
  deleteFirestoreTopic,
} from '../firebase/topicService';
import { useAuth } from '../context/AuthContext';
import TopicItem from '../components/syllabus/TopicItem';
import AddTopicModal from '../components/syllabus/AddTopicModal';
import ProgressBar from '../components/common/ProgressBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';

const SyllabusTrackerPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSubjectId = searchParams.get('subjectId');

  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(initialSubjectId || '');
  const [subjectDetails, setSubjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Modals & filters
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [activeUnitForNewTopic, setActiveUnitForNewTopic] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Accordion state
  const [collapsedUnits, setCollapsedUnits] = useState({});

  const { showToast } = useToast();
  const uid = user?.uid || user?._id || user?.id;

  // Fetch subjects list
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!uid) return;
      try {
        setLoading(true);
        const data = await getFirestoreSubjects(uid);
        if (data && data.length > 0) {
          setSubjects(data);
          const activeId = initialSubjectId || data[0]._id;
          setSelectedSubjectId(activeId);
        } else {
          setSubjects([]);
        }
      } catch (err) {
        showToast('Failed to load courses list', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [uid, initialSubjectId]);

  // Fetch single subject details with grouped units
  const fetchSubjectDetails = async (subjId) => {
    if (!subjId || !uid) return;
    try {
      setDetailsLoading(true);
      const data = await getFirestoreSubject(uid, subjId);
      setSubjectDetails(data);
    } catch (err) {
      showToast('Failed to load syllabus for this subject', 'error');
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSubjectId && uid) {
      fetchSubjectDetails(selectedSubjectId);
      setSearchParams({ subjectId: selectedSubjectId });
    }
  }, [selectedSubjectId, uid]);

  const handleSubjectChange = (id) => {
    setSelectedSubjectId(id);
  };

  const toggleUnitCollapse = (unitNum) => {
    setCollapsedUnits((prev) => ({
      ...prev,
      [unitNum]: !prev[unitNum],
    }));
  };

  // Toggle status
  const handleToggleTopicStatus = async (topic) => {
    try {
      const updated = await toggleFirestoreTopicStatus(topic);
      showToast(`Marked as ${updated.status}`);
      fetchSubjectDetails(selectedSubjectId);
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  // Create / Edit topic
  const handleCreateOrUpdateTopic = async (formData) => {
    if (!uid) return;
    try {
      if (editingTopic) {
        await updateFirestoreTopic(editingTopic._id || editingTopic.id, formData);
        showToast('Topic updated successfully!');
      } else {
        await createFirestoreTopic(uid, {
          ...formData,
          subject: selectedSubjectId,
          subjectId: selectedSubjectId,
        });
        showToast('Topic added to syllabus!');
      }
      setIsModalOpen(false);
      setEditingTopic(null);
      fetchSubjectDetails(selectedSubjectId);
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDeleteTopic = async (topicId) => {
    if (window.confirm('Delete this topic from syllabus?')) {
      try {
        await deleteFirestoreTopic(topicId);
        showToast('Topic deleted');
        fetchSubjectDetails(selectedSubjectId);
      } catch (err) {
        showToast('Failed to delete topic', 'error');
      }
    }
  };

  const handleAddNewTopicForUnit = (unitNum, unitTitle) => {
    setActiveUnitForNewTopic(unitNum);
    setEditingTopic(null);
    setIsModalOpen(true);
  };

  const handleEditTopic = (topic) => {
    setEditingTopic(topic);
    setIsModalOpen(true);
  };

  if (loading) {
    return <LoadingSpinner text="Loading syllabus tracker..." size={32} />;
  }

  if (subjects.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No Subjects Configured"
        description="Add a subject first to track its units and syllabus topics."
        actionLabel="Go to Subjects"
        onAction={() => (window.location.href = '/dashboard/subjects')}
      />
    );
  }

  return (
    <div>
      {/* Section Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title">5-Unit Syllabus Tracker</h1>
          <p className="section-subtitle">
            Unit-by-unit topic checklist with priority tags and real-time completion tracking
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            setActiveUnitForNewTopic(1);
            setEditingTopic(null);
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} /> Add Topic
        </button>
      </div>

      {/* Course Selector Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          marginBottom: '1.5rem',
        }}
      >
        {subjects.map((s) => {
          const isSelected = s._id === selectedSubjectId;
          return (
            <button
              key={s._id}
              onClick={() => handleSubjectChange(s._id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.65rem 1.15rem',
                borderRadius: 'var(--radius-lg)',
                border: `1px solid ${isSelected ? s.color || 'var(--color-primary)' : 'var(--color-border)'}`,
                backgroundColor: isSelected ? '#FFFFFF' : 'var(--color-surface)',
                color: isSelected ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                fontWeight: isSelected ? 700 : 500,
                fontSize: '0.88rem',
                boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)',
              }}
            >
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: s.color || 'var(--color-primary)',
                }}
              />
              <span>{s.name}</span>
            </button>
          );
        })}
      </div>

      {/* Subject Summary Header Card */}
      {subjectDetails && (
        <div
          className="card"
          style={{
            marginBottom: '1.75rem',
            borderLeft: `5px solid ${subjectDetails.color || 'var(--color-primary)'}`,
            padding: '1.4rem 1.6rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {subjectDetails.code || 'COURSE'}
                </span>
                <span style={{ color: 'var(--color-border)' }}>•</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  {subjectDetails.credits} Credits
                </span>
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                {subjectDetails.name}
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: subjectDetails.color || 'var(--color-primary)' }}>
                  {subjectDetails.progressPercentage}%
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  {subjectDetails.completedTopics} of {subjectDetails.totalTopics} Topics Completed
                </div>
              </div>
            </div>
          </div>

          <ProgressBar
            percentage={subjectDetails.progressPercentage}
            color={subjectDetails.color || 'var(--color-primary)'}
            height={8}
          />
        </div>
      )}

      {/* Filter and Search Controls */}
      <div
        className="card"
        style={{
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <input
            type="text"
            placeholder="Search topic in this course..."
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
            Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="All">All Topics</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Units Accordion List */}
      {detailsLoading ? (
        <LoadingSpinner text="Updating topics..." size={28} />
      ) : subjectDetails?.units && subjectDetails.units.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {subjectDetails.units.map((unitGroup) => {
            const isCollapsed = collapsedUnits[unitGroup.unit];

            // Filter topics in this unit
            const unitTopics = unitGroup.topics.filter((t) => {
              const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
              return matchesSearch && matchesStatus;
            });

            const unitTotal = unitGroup.topics.length;
            const unitCompleted = unitGroup.topics.filter((t) => t.status === 'Completed').length;
            const unitPercent = unitTotal > 0 ? Math.round((unitCompleted / unitTotal) * 100) : 0;

            return (
              <div key={unitGroup.unit} className="card" style={{ padding: '1.25rem 1.4rem' }}>
                {/* Unit Header */}
                <div
                  onClick={() => toggleUnitCollapse(unitGroup.unit)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    userSelect: 'none',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--color-primary-light)',
                        color: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                      }}
                    >
                      U{unitGroup.unit}
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                        {unitGroup.unitTitle || `Unit ${unitGroup.unit}`}
                      </h3>
                      <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>
                        {unitCompleted} of {unitTotal} topics completed ({unitPercent}%)
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddNewTopicForUnit(unitGroup.unit, unitGroup.unitTitle);
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                    >
                      <Plus size={13} /> Add Topic
                    </button>

                    <button className="btn-ghost" style={{ padding: '4px' }}>
                      {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                    </button>
                  </div>
                </div>

                {/* Progress bar for unit */}
                <div style={{ marginTop: '0.85rem', marginBottom: isCollapsed ? 0 : '1rem' }}>
                  <ProgressBar percentage={unitPercent} color="auto" height={5} />
                </div>

                {/* Topics List in Unit */}
                {!isCollapsed && (
                  <div style={{ marginTop: '0.85rem' }}>
                    {unitTopics.length > 0 ? (
                      unitTopics.map((topic) => (
                        <TopicItem
                          key={topic._id}
                          topic={topic}
                          onToggleStatus={handleToggleTopicStatus}
                          onEdit={handleEditTopic}
                          onDelete={handleDeleteTopic}
                        />
                      ))
                    ) : (
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '1.5rem',
                          color: 'var(--color-text-muted)',
                          fontSize: '0.84rem',
                          backgroundColor: 'var(--color-surface-subtle)',
                          borderRadius: 'var(--radius-md)',
                        }}
                      >
                        {searchQuery
                          ? 'No matching topics in this unit.'
                          : 'No topics added to this unit yet.'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Layers}
          title="No Syllabus Units Found"
          description="Click 'Add Topic' to begin structuring this subject's syllabus."
          actionLabel="Add First Topic"
          onAction={() => {
            setActiveUnitForNewTopic(1);
            setIsModalOpen(true);
          }}
        />
      )}

      {/* Add / Edit Topic Modal */}
      <AddTopicModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTopic(null);
        }}
        onSubmit={handleCreateOrUpdateTopic}
        subjects={subjects}
        defaultSubjectId={selectedSubjectId}
        defaultUnit={activeUnitForNewTopic}
        initialData={editingTopic}
      />
    </div>
  );
};

export default SyllabusTrackerPage;
