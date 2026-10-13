import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

const AddExamModal = ({ isOpen, onClose, onSubmit, subjects, initialData }) => {
  const [formData, setFormData] = useState({
    subject: '',
    examName: '',
    examDate: '',
    examTime: '10:00 AM',
    durationMinutes: 180,
    targetMarks: 70,
    venue: 'Examination Block - Hall 1',
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        subject: initialData.subject?._id || initialData.subject || '',
        examName: initialData.examName || '',
        examDate: initialData.examDate
          ? new Date(initialData.examDate).toISOString().split('T')[0]
          : '',
        examTime: initialData.examTime || '10:00 AM',
        durationMinutes: initialData.durationMinutes || 180,
        targetMarks: initialData.targetMarks || 70,
        venue: initialData.venue || 'Examination Block',
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        subject: (subjects && subjects[0]?._id) || '',
        examName: '',
        examDate: '',
        examTime: '10:00 AM',
        durationMinutes: 180,
        targetMarks: 70,
        venue: 'Examination Block - Hall 1',
        notes: '',
      });
    }
  }, [initialData, subjects, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'durationMinutes' || name === 'targetMarks' ? Number(value) : value,
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
      title={initialData ? 'Edit Exam Details' : 'Schedule University Examination'}
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Subject *</label>
          <select
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
          >
            <option value="">Select Course</option>
            {subjects &&
              subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.code || 'Course'})
                </option>
              ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Exam Name / Type *</label>
          <input
            type="text"
            name="examName"
            required
            placeholder="e.g. Operating Systems - Semester End Theory Exam"
            value={formData.examName}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Exam Date *</label>
            <input
              type="date"
              name="examDate"
              required
              value={formData.examDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Exam Time</label>
            <input
              type="text"
              name="examTime"
              placeholder="e.g. 10:00 AM - 01:00 PM"
              value={formData.examTime}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Exam Venue / Hall</label>
            <input
              type="text"
              name="venue"
              placeholder="e.g. CSE Block - Hall 3"
              value={formData.venue}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target Marks (Max 70)</label>
            <input
              type="number"
              name="targetMarks"
              min="1"
              max="100"
              value={formData.targetMarks}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Special Instructions or Syllabus Coverage</label>
          <textarea
            rows="2"
            name="notes"
            placeholder="Units 1 to 5, carry scientific calculator, hall ticket mandatory..."
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {initialData ? 'Update Exam' : 'Schedule Exam'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddExamModal;
