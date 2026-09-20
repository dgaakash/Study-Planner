import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import SummaryCard from '../components/dashboard/SummaryCard';
import { User, Mail, BookOpen, Calendar, Target, Flame, CheckCircle2, FileCheck2, Sparkles } from 'lucide-react';

export const ProfilePage = () => {
  const { updateUserState } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    course: '',
    semester: 3,
    division: 'A',
    dailyStudyGoal: 4
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/profile');
      setProfileData(res.data);
      const u = res.data.user;
      setFormData({
        name: u.name,
        course: u.course || 'B.Sc. Computer Science',
        semester: u.semester || 3,
        division: u.division || 'A',
        dailyStudyGoal: u.dailyStudyGoal || 4
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(false);
    try {
      const res = await api.put('/profile', formData);
      updateUserState(res.data);
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 4000);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-pink-700">Loading student profile...</div>;
  }

  const { user, stats } = profileData || {};

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-dark font-sans tracking-tight">
          Student Profile 👤
        </h1>
        <p className="text-xs sm:text-sm text-pink-900/60 mt-1">
          Manage your personal academic profile and daily study targets.
        </p>
      </div>

      {/* Quick Achievement Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Completed Sessions"
          value={stats?.completedSessions || 0}
          subtitle="Total sessions finished"
          icon={CheckCircle2}
          color="pink"
        />
        <SummaryCard
          title="Assignments Done"
          value={stats?.completedAssignments || 0}
          subtitle="Submissions completed"
          icon={FileCheck2}
          color="emerald"
        />
        <SummaryCard
          title="Pomodoros"
          value={stats?.totalPomodoros || 0}
          subtitle="Timer sessions logged"
          icon={Target}
          color="purple"
        />
        <SummaryCard
          title="Study Streak"
          value={`🔥 ${stats?.streakDays || 0} Days`}
          subtitle="Active consistency streak"
          icon={Flame}
          color="amber"
        />
      </div>

      {/* Edit Profile Card */}
      <Card hover={false} className="max-w-3xl p-6 md:p-8 border border-pink-100">
        <div className="flex items-center gap-4 border-b border-pink-100 pb-6 mb-6">
          <div className="w-16 h-16 rounded-full bg-pink-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-pink-500/20">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-dark font-sans">{user?.name}</h2>
            <p className="text-xs text-pink-900/60">{user?.email}</p>
            <p className="text-[11px] text-pink-500 font-semibold mt-1">
              Member since: {new Date(stats?.accountCreated).toLocaleDateString()}
            </p>
          </div>
        </div>

        {successMessage && (
          <div className="mb-6 p-3 bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Profile settings updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-pink-900/70 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-pink-900/70 mb-1">Email (Read Only)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-2.5 bg-pink-100/50 border border-pink-200 rounded-xl text-sm text-pink-900/60 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-pink-900/70 mb-1">Course / Degree</label>
              <input
                type="text"
                required
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-4 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-pink-900/70 mb-1">Semester</label>
              <input
                type="number"
                min="1"
                max="12"
                required
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-4 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-pink-900/70 mb-1">Division</label>
              <input
                type="text"
                required
                value={formData.division}
                onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                className="w-full px-4 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-pink-900/70 mb-1">
              Daily Study Goal (Hours / Day)
            </label>
            <input
              type="number"
              min="1"
              max="16"
              required
              value={formData.dailyStudyGoal}
              onChange={(e) => setFormData({ ...formData, dailyStudyGoal: e.target.value })}
              className="w-full px-4 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div className="pt-4">
            <Button type="submit" variant="primary" size="lg" isLoading={saving}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProfilePage;
