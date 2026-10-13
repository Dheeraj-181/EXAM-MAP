import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

const COLOR_OPTIONS = ['#6558F5', '#35B8A6', '#3B82F6', '#EC4899', '#F59E0B', '#8B5CF6', '#10B981', '#6366F1'];

const SubjectModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: 3,
    totalUnits: 5,
    difficulty: 'Medium',
    color: '#6558F5',
    targetExamDate: '',
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        code: initialData.code || '',
        credits: initialData.credits || 3,
        totalUnits: initialData.totalUnits || 5,
        difficulty: initialData.difficulty || 'Medium',
        color: initialData.color || '#6558F5',
        targetExamDate: initialData.targetExamDate
          ? new Date(initialData.targetExamDate).toISOString().split('T')[0]
          : '',
        description: initialData.description || '',
      });
    } else {
      setFormData({
        name: '',
        code: '',
        credits: 3,
        totalUnits: 5,
        difficulty: 'Medium',
        color: '#6558F5',
        targetExamDate: '',
        description: '',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Subject Details' : 'Add New Subject'}
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Subject Name *</label>
          <input
            type="text"
            name="name"
            required
            placeholder="e.g. Operating Systems, Computer Networks"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Course Code</label>
            <input
              type="text"
              name="code"
              placeholder="e.g. 20A05501T"
              value={formData.code}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Credits</label>
            <input
              type="number"
              name="credits"
              min="1"
              max="10"
              value={formData.credits}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Total Units (Standard: 5)</label>
            <input
              type="number"
              name="totalUnits"
              min="1"
              max="10"
              value={formData.totalUnits}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Difficulty Level</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Target Exam Date (Optional)</label>
          <input
            type="date"
            name="targetExamDate"
            value={formData.targetExamDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Accent Theme Color</label>
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            {COLOR_OPTIONS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setFormData((p) => ({ ...p, color: c }))}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: c,
                  border: formData.color === c ? '3px solid #20243A' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'transform 0.1s ease',
                  transform: formData.color === c ? 'scale(1.15)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Course Description / Notes</label>
          <textarea
            rows="3"
            name="description"
            placeholder="Brief overview of course syllabus, textbook references..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {initialData ? 'Update Subject' : 'Create Subject'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SubjectModal;
