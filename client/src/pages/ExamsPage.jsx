import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import ConfirmModal from '../components/common/ConfirmModal';
import { Plus, Edit2, Trash2, GraduationCap, Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react';

export const ExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    subjectId: '',
    name: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    location: 'Hall A',
    notes: '',
    preparationPercentage: 50
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [examsRes, subRes] = await Promise.all([
        api.get('/exams'),
        api.get('/subjects')
      ]);

      setExams(examsRes.data);
      setSubjects(subRes.data);
    } catch (err) {
      console.error('Error fetching exams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingExam(null);
    setFormData({
      subjectId: subjects.length > 0 ? subjects[0]._id : '',
      name: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      location: 'Hall A',
      notes: '',
      preparationPercentage: 50
    });
    setIsModalOpen(true);
  };

  const openEditModal = (exam) => {
    setEditingExam(exam);
    setFormData({
      subjectId: exam.subjectId?._id || exam.subjectId,
      name: exam.name,
      date: new Date(exam.date).toISOString().split('T')[0],
      time: exam.time,
      location: exam.location,
      notes: exam.notes || '',
      preparationPercentage: exam.preparationPercentage
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingExam) {
        await api.put(`/exams/${editingExam._id}`, formData);
      } else {
        await api.post('/exams', formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error saving exam:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrepSliderChange = async (exam, value) => {
    try {
      await api.put(`/exams/${exam._id}`, {
        ...exam,
        subjectId: exam.subjectId?._id || exam.subjectId,
        preparationPercentage: Number(value)
      });
      setExams(exams.map((e) => (e._id === exam._id ? { ...e, preparationPercentage: Number(value) } : e)));
    } catch (err) {
      console.error('Error updating prep percentage:', err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/exams/${deleteId}`);
      setDeleteId(null);
      fetchData();
    } catch (err) {
      console.error('Error deleting exam:', err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark font-sans tracking-tight">
            Exams & Evaluation 🎓
          </h1>
          <p className="text-xs sm:text-sm text-pink-900/60 mt-1">
            Track midterm exams, finals, countdowns, and preparation progress.
          </p>
        </div>

        <Button variant="primary" onClick={openAddModal}>
          <Plus className="w-5 h-5" />
          <span>Add Exam</span>
        </Button>
      </div>

      {/* Exam Grid */}
      {exams.length === 0 ? (
        <EmptyState
          emoji="🎓"
          title="No upcoming exams"
          description="Schedule your upcoming midterms or final exams to track preparation."
          actionLabel="Add Exam"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exams.map((exam) => {
            const now = new Date();
            const examDate = new Date(exam.date);
            const diffTime = examDate - now;
            const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

            return (
              <Card key={exam._id} className="p-6 border-l-4" style={{ borderLeftColor: exam.subjectId?.color || '#EC4899' }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs font-extrabold text-pink-700 bg-pink-100 px-2.5 py-0.5 rounded-full">
                      {exam.subjectId?.name || 'Subject'}
                    </span>
                    <h3 className="text-lg font-bold text-dark mt-1 font-sans">{exam.name}</h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(exam)}
                      className="p-1.5 text-pink-400 hover:text-pink-600 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(exam._id)}
                      className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Days remaining badge & exam info */}
                <div className="p-3 bg-pink-50/60 rounded-2xl mb-4 space-y-2 text-xs text-pink-900/80">
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-pink-500" />
                      {new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-pink-600 font-extrabold bg-white px-2.5 py-1 rounded-xl shadow-xs border border-pink-100">
                      {daysRemaining === 0 ? 'Today!' : `${daysRemaining} Days Remaining`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-pink-900/60">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {exam.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {exam.location}
                    </span>
                  </div>
                </div>

                {/* Interactive Preparation Progress Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-pink-900/70">Preparation Level:</span>
                    <span className="font-extrabold text-pink-600">{exam.preparationPercentage}%</span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={exam.preparationPercentage}
                    onChange={(e) => handlePrepSliderChange(exam, e.target.value)}
                    className="w-full accent-pink-500 cursor-pointer h-2 bg-pink-100 rounded-lg"
                  />
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExam ? 'Edit Exam' : 'Create Exam Record'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-pink-900/70 mb-1">Subject</label>
            <select
              required
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              className="w-full px-4 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="" disabled>Select Subject</option>
              {subjects.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-pink-900/70 mb-1">Exam Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Mathematics Mid-Semester Exam"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-pink-900/70 mb-1">Exam Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-pink-900/70 mb-1">Time</label>
              <input
                type="text"
                placeholder="10:00 AM"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-pink-900/70 mb-1">Location / Hall</label>
              <input
                type="text"
                placeholder="Hall B, Floor 2"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-pink-900/70 mb-1">Preparation %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.preparationPercentage}
                onChange={(e) => setFormData({ ...formData, preparationPercentage: e.target.value })}
                className="w-full px-3 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-pink-900/70 mb-1">Notes / Syllabus Covered</label>
            <textarea
              rows="2"
              placeholder="e.g. Units 1 to 4 focus..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting}>
              {editingExam ? 'Update Exam' : 'Save Exam'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Exam"
        message="Are you sure you want to delete this exam record?"
      />
    </div>
  );
};

export default ExamsPage;
