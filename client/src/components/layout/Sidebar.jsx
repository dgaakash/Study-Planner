import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  BookOpen,
  FileCheck2,
  GraduationCap,
  Timer,
  BarChart3,
  User,
  LogOut,
  Sparkles,
  X
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Planner', path: '/planner', icon: CalendarCheck },
    { name: 'Calendar', path: '/calendar', icon: CalendarDays },
    { name: 'Subjects', path: '/subjects', icon: BookOpen },
    { name: 'Assignments', path: '/assignments', icon: FileCheck2 },
    { name: 'Exams', path: '/exams', icon: GraduationCap },
    { name: 'Pomodoro', path: '/pomodoro', icon: Timer },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Profile', path: '/profile', icon: User }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-dark/40 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-pink-100 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-pink-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-pink-300 flex items-center justify-center text-white shadow-md shadow-pink-500/20">
              <Sparkles className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-dark tracking-tight font-sans">StudyBloom</h1>
              <p className="text-[10px] font-medium text-pink-500 tracking-wider uppercase">Study Planner</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-1 text-pink-400 hover:text-pink-600 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-pink-500 text-white shadow-md shadow-pink-500/25 translate-x-1'
                      : 'text-pink-950/70 hover:bg-pink-50 hover:text-pink-600'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout Footer */}
        <div className="p-4 border-t border-pink-100 bg-pink-50/50">
          <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-pink-100 shadow-xs mb-2">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-600 font-bold flex items-center justify-center text-sm flex-shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-dark truncate">{user?.name || 'Student'}</p>
                <p className="text-[11px] text-pink-900/60 truncate">{user?.course || 'Student'}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
