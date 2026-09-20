import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Card from '../components/common/Card';
import SummaryCard from '../components/dashboard/SummaryCard';
import WeeklyChart from '../components/dashboard/WeeklyChart';
import Skeleton from '../components/common/Skeleton';
import { BarChart3, Flame, Clock, Calendar, CheckCircle2, PieChart } from 'lucide-react';

export const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/analytics/weekly');
        setData(res.data);
      } catch (err) {
        console.error('Error loading analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const {
    weeklyProgress = [],
    subjectDistribution = [],
    taskCompletion = { completed: 0, pending: 0, inProgress: 0 },
    studyHours = { thisWeekHours: 0, thisMonthHours: 0 },
    streakDays = 0
  } = data || {};

  const totalTasks = taskCompletion.completed + taskCompletion.pending + taskCompletion.inProgress;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-dark font-sans tracking-tight">
          Study Analytics & Streak 📊
        </h1>
        <p className="text-xs sm:text-sm text-pink-900/60 mt-1">
          Detailed metrics calculated directly from your MongoDB database records.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          title="Current Streak"
          value={`🔥 ${streakDays} Days`}
          subtitle="Consecutive study days"
          icon={Flame}
          color="amber"
        />
        <SummaryCard
          title="This Week Study"
          value={`${studyHours.thisWeekHours}h`}
          subtitle="Mon - Sun Total"
          icon={Clock}
          color="pink"
        />
        <SummaryCard
          title="This Month Study"
          value={`${studyHours.thisMonthHours}h`}
          subtitle="Cumulative hours"
          icon={Calendar}
          color="purple"
        />
      </div>

      {/* Weekly Progress Chart */}
      <WeeklyChart data={weeklyProgress} />

      {/* Distribution & Task Completion Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subject Distribution */}
        <Card hover={false} className="space-y-4">
          <div className="flex items-center gap-2 border-b border-pink-100 pb-3">
            <PieChart className="w-5 h-5 text-pink-500" />
            <h3 className="font-bold text-base text-dark">Subject Distribution (%) 📚</h3>
          </div>

          {subjectDistribution.length === 0 ? (
            <p className="text-xs text-pink-900/50 py-4 text-center">No study data recorded yet</p>
          ) : (
            <div className="space-y-3">
              {subjectDistribution.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-dark">{item.name} ({item.code})</span>
                    <span className="font-extrabold text-pink-600">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-pink-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color || '#EC4899'
                      }}
                      className="h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Task Completion Breakdown */}
        <Card hover={false} className="space-y-4">
          <div className="flex items-center gap-2 border-b border-pink-100 pb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-base text-dark">Task Completion Status 📝</h3>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center my-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <span className="text-2xl font-extrabold text-emerald-600 block">{taskCompletion.completed}</span>
              <span className="text-xs font-semibold text-emerald-800">Completed</span>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
              <span className="text-2xl font-extrabold text-blue-600 block">{taskCompletion.inProgress}</span>
              <span className="text-xs font-semibold text-blue-800">In Progress</span>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <span className="text-2xl font-extrabold text-amber-600 block">{taskCompletion.pending}</span>
              <span className="text-xs font-semibold text-amber-800">Pending</span>
            </div>
          </div>

          <div className="p-4 bg-pink-50 rounded-2xl text-xs text-pink-900/80">
            <p className="font-bold text-dark mb-1">💡 Progress Insight:</p>
            <p>
              You have completed {totalTasks > 0 ? Math.round((taskCompletion.completed / totalTasks) * 100) : 0}% of all your assigned tasks. Keep up the high study consistency!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
