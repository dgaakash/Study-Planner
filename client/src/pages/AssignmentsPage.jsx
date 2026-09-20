import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import ConfirmModal from '../components/common/ConfirmModal';
import { Plus, Edit2, Trash2, Calendar, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    subjectId: '',
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'Medium',
    status: 'Pending'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assignRes, subRes] = await Promise.all([
        api.get('/assignments'),
        api.get('/subjects')
      ]);

      setAssignments(assignRes.data);
      setSubjects(subRes.data);
    } catch (err) {
      console.error('Error fetching assignments data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingAssignment(null);
    setFormData({
      subjectId: subjects.length > 0 ? subjects[0]._id : '',
      title: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'Medium',
      status: 'Pending'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (assign) => {
    setEditingAssignment(assign);
    setFormData({
      subjectId: assign.subjectId?._id || assign.subjectId,
      title: assign.title,
      description: assign.description || '',
      dueDate: new Date(assign.dueDate).toISOString().split('T')[0],
      priority: assign.priority,
      status: assign.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingAssignment) {
        await api.put(`/assignments/${editingAssignment._id}`, formData);
      } else {
        await api.post('/assignments', formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error saving assignment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/assignments/${id}/status`, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/assignments/${deleteId}`);
      setDeleteId(null);
      fetchData();
    } catch (err) {
      console.error('Error deleting assignment:', err);
    }
  };

  // Helper: check if overdue
  const getOverdueStatus = (dueDateStr, status) => {
    if (status === 'Completed') return null;
    const now = new Date();
    const dueDate = new Date(dueDateStr);
    const diffTime = dueDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return `⚠️ Assignment overdue by ${Math.abs(diffDays)} day(s)`;
    }
    return null;
  };

  // Filter list
  const filteredAssignments = assignments.filter((a) => {
    if (statusFilter !== 'All' && a.status !== statusFilter) return false;
    if (subjectFilter && (a.subjectId?._id !== subjectFilter && a.subjectId !== subjectFilter)) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark font-sans tracking-tight">
            Assignments & Tasks 📝
          </h1>
          <p className="text-xs sm:text-sm text-pink-900/60 mt-1">
            Keep track of project deadlines, homework submissions, and status.
          </p>
        </div>

        <Button variant="primary" onClick={openAddModal}>
          <Plus className="w-5 h-5" />
          <span>Add Assignment</span>
        </Button>
      </div>

      {/* Filter Controls */}
      <Card hover={false} className="p-4 bg-white/70 backdrop-blur-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-pink-900/60 mb-1">Filter by Status</label>
            <div className="flex flex-wrap gap-2">
              {['All', 'Pending', 'In Progress', 'Completed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    statusFilter === st
                      ? 'bg-pink-500 text-white shadow-xs'
                      : 'bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-pink-900/60 mb-1">Filter by Subject</label>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full px-3 py-2 bg-pink-50/50 border border-pink-200 rounded-xl text-xs text-dark focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="">All Subjects</option>
              {subjects.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Assignment List */}
      {filteredAssignments.length === 0 ? (
        <EmptyState
          emoji="✨"
          title="Nothing due yet ✨"
          description="You currently have no assignments matching this filter."
          actionLabel="Add Assignment"
          onAction={openAddModal}
        />
      ) : (
        <div className="space-y-4">
          {filteredAssignments.map((assign) => {
            const overdueMsg = getOverdueStatus(assign.dueDate, assign.status);
            return (
              <Card key={assign._id} className="p-5 border-l-4" style={{ borderLeftColor: assign.subjectId?.color || '#EC4899' }}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-pink-700 bg-pink-100 px-2.5 py-0.5 rounded-full">
                        {assign.subjectId?.name || 'Subject'}
                      </span>
                      <Badge variant={assign.priority.toLowerCase()}>{assign.priority} Priority</Badge>
                    </div>

                    <h3 className={`text-base font-bold ${assign.status === 'Completed' ? 'line-through text-pink-900/40' : 'text-dark'}`}>
                      {assign.title}
                    </h3>

                    {assign.description && (
                      <p className="text-xs text-pink-900/60 max-w-2xl">{assign.description}</p>
                    )}

                    {overdueMsg && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 mt-2">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{overdueMsg}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-pink-100">
                    <div className="text-right text-xs text-pink-900/70">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-pink-500" />
                        Due: {new Date(assign.dueDate).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Status Dropdown */}
                    <select
                      value={assign.status}
                      onChange={(e) => handleStatusChange(assign._id, e.target.value)}
                      className="px-3 py-1.5 bg-pink-50 border border-pink-200 rounded-xl text-xs font-bold text-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(assign)}
                        className="p-1.5 text-pink-400 hover:text-pink-600 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(assign._id)}
                        className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
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
        title={editingAssignment ? 'Edit Assignment' : 'Create Assignment'}
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
            <label className="block text-xs font-semibold text-pink-900/70 mb-1">Assignment Title</label>
            <input
              type="text"
              required
              placeholder="e.g. SQL Schema Normalization Report"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-pink-900/70 mb-1">Description (Optional)</label>
            <textarea
              rows="2"
              placeholder="Provide assignment guidelines or submission link details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-pink-900/70 mb-1">Due Date</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-pink-900/70 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-pink-900/70 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting}>
              {editingAssignment ? 'Update Assignment' : 'Save Assignment'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Assignment"
        message="Are you sure you want to delete this assignment?"
      />
    </div>
  );
};

export default AssignmentsPage;
