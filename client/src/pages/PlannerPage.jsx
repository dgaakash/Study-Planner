import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import ConfirmModal from '../components/common/ConfirmModal';
import { Plus, Filter, CheckSquare, Square, Edit2, Trash2, CalendarCheck, Clock } from 'lucide-react';

export const PlannerPage = () => {
  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modal & Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Confirm delete modal
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    subjectId: '',
    topic: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    duration: 60,
    priority: 'Medium',
    notes: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sessionsRes, subjectsRes] = await Promise.all([
        api.get('/study-sessions'),
        api.get('/subjects')
      ]);

      setSessions(sessionsRes.data);
      setSubjects(subjectsRes.data);
    } catch (err) {
      console.error('Error fetching planner data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingSession(null);
    setFormData({
      subjectId: subjects.length > 0 ? subjects[0]._id : '',
      topic: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      duration: 60,
      priority: 'Medium',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (session) => {
    setEditingSession(session);
    setFormData({
      subjectId: session.subjectId?._id || session.subjectId,
      topic: session.topic,
      date: new Date(session.date).toISOString().split('T')[0],
      startTime: session.startTime,
      duration: session.duration,
      priority: session.priority,
      notes: session.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingSession) {
        await api.put(`/study-sessions/${editingSession._id}`, formData);
      } else {
        await api.post('/study-sessions', formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error saving session:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      await api.patch(`/study-sessions/${id}/complete`);
      fetchData();
    } catch (err) {
      console.error('Error toggling completion:', err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/study-sessions/${deleteId}`);
      setDeleteId(null);
      fetchData();
    } catch (err) {
      console.error('Error deleting session:', err);
    }
  };

  // Filtered session list
  const filteredSessions = sessions.filter((s) => {
    if (selectedSubject && (s.subjectId?._id !== selectedSubject && s.subjectId !== selectedSubject)) return false;
    if (selectedDate && new Date(s.date).toISOString().split('T')[0] !== selectedDate) return false;
    if (selectedStatus === 'Completed' && !s.completed) return false;
    if (selectedStatus === 'Pending' && s.completed) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark font-sans tracking-tight">
            Study Planner 📅
          </h1>
          <p className="text-xs sm:text-sm text-pink-900/60 mt-1">
            Organize your daily study sessions and stay on track.
          </p>
        </div>

        <Button variant="primary" onClick={openAddModal}>
          <Plus className="w-5 h-5" />
          <span>Add Study Session</span>
        </Button>
      </div>

      {/* Filter Controls */}
      <Card hover={false} className="p-4 bg-white/70 backdrop-blur-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-pink-900/60 mb-1">Filter by Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
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

          <div>
            <label className="block text-xs font-semibold text-pink-900/60 mb-1">Filter by Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 bg-pink-50/50 border border-pink-200 rounded-xl text-xs text-dark focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-pink-900/60 mb-1">Completion Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-pink-50/50 border border-pink-200 rounded-xl text-xs text-dark focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending Only</option>
              <option value="Completed">Completed Only</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <EmptyState
          emoji="🌸"
          title="No study sessions found"
          description="Create your first study session or clear filters to view your planner."
          actionLabel="Add Session"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSessions.map((session) => (
            <Card key={session._id} className="flex flex-col justify-between border-l-4" style={{ borderLeftColor: session.subjectId?.color || '#EC4899' }}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-pink-700 bg-pink-100 px-2.5 py-1 rounded-full">
                    {session.subjectId?.name || 'Subject'}
                  </span>
                  <div className="flex items-center gap-1">
                    <Badge variant={session.priority.toLowerCase()}>{session.priority}</Badge>
                    <button
                      onClick={() => openEditModal(session)}
                      className="p-1.5 text-pink-400 hover:text-pink-600 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(session._id)}
                      className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className={`text-base font-bold mb-1 ${session.completed ? 'line-through text-pink-900/40' : 'text-dark'}`}>
                  {session.topic}
                </h3>

                {session.notes && (
                  <p className="text-xs text-pink-900/60 mb-3 bg-pink-50/50 p-2 rounded-xl italic">
                    "{session.notes}"
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-pink-100 mt-3 text-xs">
                <div className="flex items-center gap-3 text-pink-900/70 font-medium">
                  <span className="flex items-center gap-1">
                    <CalendarCheck className="w-3.5 h-3.5 text-pink-500" />
                    {new Date(session.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-pink-500" />
                    {session.startTime} ({session.duration}m)
                  </span>
                </div>

                <Button
                  variant={session.completed ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => handleToggleComplete(session._id)}
                >
                  {session.completed ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                  <span>{session.completed ? 'Done' : 'Mark Done'}</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Session Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSession ? 'Edit Study Session' : 'Create Study Session'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-pink-900/70 mb-1">Subject</label>
            <select
              required
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              className="w-full px-4 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="" disabled>Select a subject</option>
              {subjects.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-pink-900/70 mb-1">Topic / Chapter</label>
            <input
              type="text"
              required
              placeholder="e.g. Calculus Integration Theorems"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              className="w-full px-4 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-pink-900/70 mb-1">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-pink-900/70 mb-1">Start Time</label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-pink-900/70 mb-1">Duration (minutes)</label>
              <input
                type="number"
                min="5"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-pink-900/70 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-pink-900/70 mb-1">Notes (Optional)</label>
            <textarea
              rows="2"
              placeholder="e.g. Solve exercises 1 to 10..."
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
              {editingSession ? 'Update Session' : 'Save Session'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Study Session"
        message="Are you sure you want to delete this study session?"
      />
    </div>
  );
};

export default PlannerPage;
