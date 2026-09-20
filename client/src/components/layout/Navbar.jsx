import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Menu, Bell, Flame, Calendar as CalendarIcon, CheckCircle2, AlertCircle } from 'lucide-react';

export const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [streakDays, setStreakDays] = useState(0);

  useEffect(() => {
    const fetchNavbarData = async () => {
      try {
        const res = await api.get('/analytics/dashboard');
        if (res.data) {
          setNotifications(res.data.notifications || []);
          setStreakDays(res.data.streakDays || 0);
        }
      } catch (err) {
        console.error('Error fetching navbar metadata:', err);
      }
    };

    fetchNavbarData();
  }, []);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/80 backdrop-blur-md border-b border-pink-100 px-4 md:px-8 flex items-center justify-between">
      {/* Left side: Mobile menu & Page Greeting */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 text-pink-700 hover:bg-pink-50 rounded-xl transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-100 text-xs font-semibold text-pink-700">
          <CalendarIcon className="w-3.5 h-3.5 text-pink-500" />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Right side: Streak Badge & In-app Notifications */}
      <div className="flex items-center gap-3">
        {/* Streak Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold shadow-xs">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
          <span>{streakDays} Day Streak</span>
        </div>

        {/* Notifications Dropdown Container */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-2xl bg-pink-50 text-pink-600 hover:bg-pink-100 hover:text-pink-700 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-ping" />
            )}
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Modal / Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-pink-100 py-3 z-50 animate-scaleUp">
              <div className="px-5 py-2 border-b border-pink-100 flex items-center justify-between">
                <h4 className="font-bold text-sm text-dark">Notifications 🔔</h4>
                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-semibold">
                  {notifications.length} New
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-pink-50 px-2">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-pink-900/50">
                    No urgent reminders right now! ✨
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-pink-50/60 rounded-2xl transition-colors flex items-start gap-3">
                      <div className={`p-2 rounded-xl flex-shrink-0 ${
                        n.type === 'overdue_assignment' ? 'bg-rose-100 text-rose-600' :
                        n.type === 'upcoming_exam' ? 'bg-purple-100 text-purple-600' : 'bg-pink-100 text-pink-600'
                      }`}>
                        {n.type === 'overdue_assignment' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <div className="text-xs">
                        <p className="font-medium text-dark leading-snug">{n.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
