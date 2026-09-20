import React, { useState, useEffect } from 'react';
import api from '../services/api';
import PomodoroTimer from '../components/pomodoro/PomodoroTimer';
import Card from '../components/common/Card';
import SummaryCard from '../components/dashboard/SummaryCard';
import { Timer, Clock, CheckCircle, Flame } from 'lucide-react';

export const PomodoroPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [stats, setStats] = useState({
    todayCount: 0,
    todayMinutes: 0,
    totalCount: 0,
    totalMinutes: 0
  });

  const fetchData = async () => {
    try {
      const [subRes, pomodoroRes] = await Promise.all([
        api.get('/subjects'),
        api.get('/pomodoro')
      ]);

      setSubjects(subRes.data);
      setStats(pomodoroRes.data);
    } catch (err) {
      console.error('Error fetching Pomodoro page data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-dark font-sans tracking-tight">
          Pomodoro Study Timer ⏱
        </h1>
        <p className="text-xs sm:text-sm text-pink-900/60 mt-1">
          Boost your productivity using timed study intervals (25 min focus / 5 min break).
        </p>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Pomodoros Today"
          value={stats.todayCount}
          subtitle="Sessions completed"
          icon={Timer}
          color="pink"
        />
        <SummaryCard
          title="Today Focus Time"
          value={`${stats.todayMinutes}m`}
          subtitle="Approximate study minutes"
          icon={Clock}
          color="purple"
        />
        <SummaryCard
          title="Total Pomodoros"
          value={stats.totalCount}
          subtitle="All-time sessions"
          icon={CheckCircle}
          color="emerald"
        />
        <SummaryCard
          title="Total Focus Mins"
          value={`${stats.totalMinutes}m`}
          subtitle={`${Number((stats.totalMinutes / 60).toFixed(1))} Total Hours`}
          icon={Flame}
          color="amber"
        />
      </div>

      {/* Interactive Timer Container */}
      <div className="max-w-2xl mx-auto">
        <PomodoroTimer subjects={subjects} onSessionComplete={fetchData} />
      </div>
    </div>
  );
};

export default PomodoroPage;
