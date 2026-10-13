import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

const AddTopicModal = ({ isOpen, onClose, onSubmit, subjects, initialData, defaultSubjectId, defaultUnit = 1 }) => {
  const [formData, setFormData] = useState({
    subject: defaultSubjectId || '',
    unit: defaultUnit || 1,
    unitTitle: `Unit ${defaultUnit || 1}`,
    title: '',
    priority: 'Medium',
    status: 'Not Started',
    estimatedHours: 2,
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        subject: initialData.subject?._id || initialData.subject || defaultSubjectId || '',
        unit: initialData.unit || 1,
        unitTitle: initialData.unitTitle || `Unit ${initialData.unit || 1}`,
        title: initialData.title || '',
        priority: initialData.priority || 'Medium',
        status: initialData.status || 'Not Started',
        estimatedHours: initialData.estimatedHours || 2,
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        subject: defaultSubjectId || (subjects && subjects[0]?._id) || '',
        unit: defaultUnit || 1,
        unitTitle: `Unit ${defaultUnit || 1}`,
        title: '',
        priority: 'Medium',
        status: 'Not Started',
        estimatedHours: 2,
        notes: '',
      });
    }
  }, [initialData, defaultSubjectId, defaultUnit, subjects, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'unit' || name === 'estimatedHours' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Syllabus Topic' : 'Add Topic to Syllabus'}
    >
      <form onSubmit={handleSubmit}>
        {!defaultSubjectId && subjects && subjects.length > 0 && (
          <div className="form-group">
            <label className="form-label">Subject *</label>
            <select
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
            >
              <option value="">Select Subject</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.code || 'Course'})
                </option>
              ))}
            </select>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Unit Number</label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((u) => (
                <option key={u} value={u}>
                  Unit {u}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Unit Title (Optional)</label>
            <input
              type="text"
              name="unitTitle"
              placeholder="e.g. Unit 1: Process Management"
              value={formData.unitTitle}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Topic Title *</label>
          <input
            type="text"
            name="title"
            required
            placeholder="e.g. Semaphores and Classic Synchronization Problems"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Est. Hours</label>
            <input
              type="number"
              name="estimatedHours"
              step="0.5"
              min="0.5"
              max="20"
              value={formData.estimatedHours}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Revision Notes & Important Questions</label>
          <textarea
            rows="3"
            name="notes"
            placeholder="Key concepts, formula, textbook chapter, or exam year questions..."
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {initialData ? 'Update Topic' : 'Add Topic'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTopicModal;
