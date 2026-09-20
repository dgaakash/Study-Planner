import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import ConfirmModal from '../components/common/ConfirmModal';
import { Plus, Search, Edit2, Trash2, BookOpen, User, Target, Palette } from 'lucide-react';

export const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    teacher: '',
    difficulty: 'Medium',
    targetPercentage: 85,
    color: '#EC4899'
  });

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/subjects');
      setSubjects(res.data);
    } catch (err) {
      console.error('Error fetching subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const openAddModal = () => {
    setEditingSubject(null);
    setFormData({
      name: '',
      code: '',
      teacher: '',
      difficulty: 'Medium',
      targetPercentage: 85,
      color: '#EC4899'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (sub) => {
    setEditingSubject(sub);
    setFormData({
      name: sub.name,
      code: sub.code,
      teacher: sub.teacher || '',
      difficulty: sub.difficulty,
      targetPercentage: sub.targetPercentage,
      color: sub.color || '#EC4899'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingSubject) {
        await api.put(`/subjects/${editingSubject._id}`, formData);
      } else {
        await api.post('/subjects', formData);
      }
      setIsModalOpen(false);
      fetchSubjects();
    } catch (err) {
      console.error('Error saving subject:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/subjects/${deleteId}`);
      setDeleteId(null);
      fetchSubjects();
    } catch (err) {
      console.error('Error deleting subject:', err);
    }
  };

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark font-sans tracking-tight">
            Subjects & Courses 📚
          </h1>
          <p className="text-xs sm:text-sm text-pink-900/60 mt-1">
            Manage your registered academic subjects, target grades, and instructors.
          </p>
        </div>

        <Button variant="primary" onClick={openAddModal}>
          <Plus className="w-5 h-5" />
          <span>Add Subject</span>
        </Button>
      </div>

      {/* Search Input */}
      <Card hover={false} className="p-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-pink-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search subjects by name or short code..."
            className="w-full pl-10 pr-4 py-2 bg-pink-50/50 border border-pink-200 rounded-xl text-xs text-dark focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>
      </Card>

      {/* Subjects Grid */}
      {filteredSubjects.length === 0 ? (
        <EmptyState
          emoji="🌱"
          title="Your study journey starts here 🌱"
          description="Add your first subject to begin planning sessions, assignments, and exams."
          actionLabel="Add First Subject"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((sub) => (
            <Card key={sub._id} className="relative overflow-hidden border-t-4" style={{ borderTopColor: sub.color }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs font-extrabold text-pink-700 bg-pink-100 px-2.5 py-0.5 rounded-full">
                    {sub.code}
                  </span>
                  <h3 className="text-lg font-bold text-dark mt-1 font-sans">{sub.name}</h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(sub)}
                    className="p-1.5 text-pink-400 hover:text-pink-600 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(sub._id)}
                    className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs text-pink-900/70 border-t border-pink-100/60 pt-3">
                <p className="flex items-center gap-2">
                  <User className="w-4 h-4 text-pink-500" />
                  <span>Teacher: {sub.teacher || 'Not specified'}</span>
                </p>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-pink-500" />
                    <span>Target: <strong>{sub.targetPercentage}%</strong></span>
                  </div>
                  <Badge variant={sub.difficulty.toLowerCase()}>{sub.difficulty}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubject ? 'Edit Subject' : 'Add New Subject'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-pink-900/70 mb-1">Subject Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Data Structures & Algorithms"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-pink-900/70 mb-1">Short Code</label>
              <input
                type="text"
                required
                placeholder="e.g. CS302"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-pink-900/70 mb-1">Teacher / Prof</label>
              <input
                type="text"
                placeholder="Dr. Ananya Roy"
                value={formData.teacher}
                onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                className="w-full px-4 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-pink-900/70 mb-1">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-3 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-pink-900/70 mb-1">Target %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.targetPercentage}
                onChange={(e) => setFormData({ ...formData, targetPercentage: e.target.value })}
                className="w-full px-3 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-pink-900/70 mb-1">Theme Color</label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full h-10 p-1 bg-pink-50/40 border border-pink-200 rounded-xl cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting}>
              {editingSubject ? 'Update Subject' : 'Save Subject'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Subject"
        message="Are you sure you want to delete this subject? All related study sessions, assignments, and exams will also be removed."
      />
    </div>
  );
};

export default SubjectsPage;
