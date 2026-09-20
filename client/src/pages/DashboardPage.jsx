import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import SummaryCard from '../components/dashboard/SummaryCard';
import WeeklyChart from '../components/dashboard/WeeklyChart';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Skeleton from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import { Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  Calendar,
  CheckSquare,
  Square,
  ArrowRight,
  Plus
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashRes, weeklyRes] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/analytics/weekly')
      ]);

      setData(dashRes.data);
      setWeeklyData(weeklyRes.data.weeklyProgress || []);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleSession = async (sessionId) => {
    try {
      await api.patch(`/study-sessions/${sessionId}/complete`);
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to toggle session:', err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark font-sans tracking-tight">
            Good morning, {user?.name?.split(' ')[0] || 'Student'} 🌸
          </h1>
          <p className="text-xs sm:text-sm text-pink-900/60 mt-1">
            Here is your study routine overview for today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/planner">
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4" />
              <span>New Session</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Today's Study"
          value={`${data?.todayStudyHours || 0}h`}
          subtitle={`Goal: ${data?.dailyStudyGoal || 4}h / day`}
          icon={Clock}
          color="pink"
        />
        <SummaryCard
          title="Tasks Completed"
          value={data?.tasksCompleted || 0}
          subtitle="Assignments & Sessions"
          icon={CheckCircle2}
          color="emerald"
        />
        <SummaryCard
          title="Assignments"
          value={`${data?.pendingAssignments || 0} Pending`}
          subtitle="Requires attention"
          icon={FileCheck2}
          color="amber"
        />
        <SummaryCard
          title="Next Exam"
          value={
            data?.nextExam
              ? `${data.nextExam.daysRemaining} Days`
              : 'No Exams'
          }
          subtitle={data?.nextExam ? data.nextExam.name : 'All clear!'}
          icon={GraduationCap}
          color="purple"
        />
      </div>

      {/* Today's Schedule & Weekly Progress Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule (2 cols on desktop) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-pink-500" />
              <h2 className="font-bold text-lg text-dark">Today's Schedule 📅</h2>
            </div>
            <Link to="/planner" className="text-xs font-bold text-pink-600 hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {data?.todaySchedule?.length === 0 ? (
            <EmptyState
              emoji="🌿"
              title="Your schedule is clear"
              description="No study sessions scheduled for today yet."
              actionLabel="Add Study Session"
              onAction={() => window.location.href = '/planner'}
            />
          ) : (
            <div className="space-y-3">
              {data?.todaySchedule?.map((session) => (
                <Card key={session._id} hover={false} className="flex items-center justify-between p-4 border border-pink-100">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleToggleSession(session._id)}
                      className="text-pink-400 hover:text-pink-600 transition-colors"
                    >
                      {session.completed ? (
                        <CheckSquare className="w-6 h-6 text-pink-500 fill-pink-100" />
                      ) : (
                        <Square className="w-6 h-6" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-pink-700 bg-pink-100 px-2 py-0.5 rounded-md">
                          {session.startTime}
                        </span>
                        <h4 className={`text-sm font-bold ${session.completed ? 'line-through text-pink-900/40' : 'text-dark'}`}>
                          {session.subjectId?.name || 'Subject'}
                        </h4>
                      </div>
                      <p className="text-xs text-pink-900/60 mt-0.5">{session.topic}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-semibold text-pink-950/70">{session.duration} min</span>
                    <div className="mt-1">
                      <Badge variant={session.priority.toLowerCase()}>{session.priority}</Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Weekly Progress Chart */}
        <div>
          <WeeklyChart data={weeklyData} />
        </div>
      </div>

      {/* Upcoming Assignments & Upcoming Exams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Assignments Widget */}
        <Card hover={false} className="space-y-4">
          <div className="flex items-center justify-between border-b border-pink-100 pb-3">
            <h3 className="font-bold text-base text-dark">Upcoming Assignments 📝</h3>
            <Link to="/assignments" className="text-xs font-bold text-pink-600 hover:underline">
              Manage All
            </Link>
          </div>

          {data?.upcomingAssignments?.length === 0 ? (
            <p className="text-xs text-pink-900/50 py-4 text-center">Nothing due soon ✨</p>
          ) : (
            <div className="space-y-3">
              {data?.upcomingAssignments?.map((assign) => (
                <div key={assign._id} className="flex items-center justify-between p-3 rounded-2xl bg-pink-50/50 border border-pink-100">
                  <div>
                    <h5 className="text-xs font-bold text-dark">{assign.title}</h5>
                    <p className="text-[11px] text-pink-900/60 mt-0.5">
                      {assign.subjectId?.name} • Due: {new Date(assign.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={assign.status === 'In Progress' ? 'inProgress' : 'pending'}>
                    {assign.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Upcoming Exams Widget */}
        <Card hover={false} className="space-y-4">
          <div className="flex items-center justify-between border-b border-pink-100 pb-3">
            <h3 className="font-bold text-base text-dark">Upcoming Exams 🎓</h3>
            <Link to="/exams" className="text-xs font-bold text-pink-600 hover:underline">
              Manage All
            </Link>
          </div>

          {data?.upcomingExams?.length === 0 ? (
            <p className="text-xs text-pink-900/50 py-4 text-center">No upcoming exams 🎉</p>
          ) : (
            <div className="space-y-3">
              {data?.upcomingExams?.map((exam) => (
                <div key={exam._id} className="p-3 rounded-2xl bg-pink-50/50 border border-pink-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-dark">{exam.name}</h5>
                      <p className="text-[11px] text-pink-900/60">{exam.subjectId?.name} • {new Date(exam.date).toLocaleDateString()}</p>
                    </div>
                    <span className="text-xs font-bold text-pink-600 bg-pink-100 px-2.5 py-1 rounded-full">
                      Prep: {exam.preparationPercentage}%
                    </span>
                  </div>
                  {/* Preparation Bar */}
                  <div className="w-full bg-pink-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${exam.preparationPercentage}%` }}
                      className="bg-pink-500 h-full rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
