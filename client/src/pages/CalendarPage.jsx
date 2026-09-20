import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, GraduationCap, FileCheck2, BookOpen } from 'lucide-react';

export const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'week'
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      try {
        const [sessionsRes, assignRes, examsRes] = await Promise.all([
          api.get('/study-sessions'),
          api.get('/assignments'),
          api.get('/exams')
        ]);

        const formatted = [];

        sessionsRes.data.forEach((s) => {
          formatted.push({
            id: `session-${s._id}`,
            type: 'session',
            title: `${s.subjectId?.code || 'Session'}: ${s.topic}`,
            date: new Date(s.date),
            time: s.startTime,
            subject: s.subjectId?.name,
            color: '#EC4899',
            raw: s
          });
        });

        assignRes.data.forEach((a) => {
          formatted.push({
            id: `assign-${a._id}`,
            type: 'assignment',
            title: `📝 ${a.title}`,
            date: new Date(a.dueDate),
            time: 'Due EOD',
            subject: a.subjectId?.name,
            color: '#F59E0B',
            raw: a
          });
        });

        examsRes.data.forEach((e) => {
          formatted.push({
            id: `exam-${e._id}`,
            type: 'exam',
            title: `🎓 ${e.name}`,
            date: new Date(e.date),
            time: e.time,
            subject: e.subjectId?.name,
            color: '#8B5CF6',
            raw: e
          });
        });

        setEvents(formatted);
      } catch (err) {
        console.error('Error fetching calendar data:', err);
      }
    };

    fetchCalendarEvents();
  }, []);

  // Calendar math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper: get events for a specific day
  const getEventsForDay = (dayNumber) => {
    return events.filter((ev) => {
      const d = ev.date;
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === dayNumber;
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark font-sans tracking-tight">
            Academic Calendar 🗓
          </h1>
          <p className="text-xs sm:text-sm text-pink-900/60 mt-1">
            View upcoming study sessions, assignment deadlines, and exam dates.
          </p>
        </div>

        {/* View Mode Switch */}
        <div className="flex items-center gap-3">
          <div className="inline-flex p-1 bg-pink-100/70 rounded-2xl border border-pink-200">
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'month' ? 'bg-pink-500 text-white shadow-xs' : 'text-pink-700 hover:text-pink-900'
              }`}
            >
              Monthly View
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'week' ? 'bg-pink-500 text-white shadow-xs' : 'text-pink-700 hover:text-pink-900'
              }`}
            >
              Agenda View
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Controls */}
      <Card hover={false} className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-dark font-sans">
            {monthNames[month]} {year}
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-2 text-pink-600 hover:bg-pink-100 rounded-xl transition-colors border border-pink-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 text-xs font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 rounded-xl border border-pink-200"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-2 text-pink-600 hover:bg-pink-100 rounded-xl transition-colors border border-pink-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Card>

      {/* Monthly Grid */}
      {viewMode === 'month' ? (
        <Card hover={false} className="p-4 overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="py-2 text-xs font-bold text-pink-900/60 uppercase">
                  {d}
                </div>
              ))}
            </div>

            {/* Day Cells Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Blank cells before month starts */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`blank-${i}`} className="h-28 bg-pink-50/20 rounded-2xl border border-pink-100/30 opacity-40" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dayEvents = getEventsForDay(dayNum);
                const isToday =
                  new Date().getDate() === dayNum &&
                  new Date().getMonth() === month &&
                  new Date().getFullYear() === year;

                return (
                  <div
                    key={dayNum}
                    className={`h-28 p-2 rounded-2xl border transition-all flex flex-col justify-between ${
                      isToday
                        ? 'bg-pink-50/80 border-pink-400 ring-2 ring-pink-400/20 shadow-sm'
                        : 'bg-white border-pink-100 hover:border-pink-300'
                    }`}
                  >
                    <span className={`text-xs font-bold self-end w-6 h-6 flex items-center justify-center rounded-full ${
                      isToday ? 'bg-pink-500 text-white' : 'text-dark'
                    }`}>
                      {dayNum}
                    </span>

                    <div className="space-y-1 overflow-y-auto max-h-16">
                      {dayEvents.map((ev) => (
                        <div
                          key={ev.id}
                          onClick={() => setSelectedEvent(ev)}
                          className="px-1.5 py-1 text-[10px] font-semibold text-white rounded-lg truncate cursor-pointer hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: ev.color }}
                        >
                          {ev.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      ) : (
        /* Agenda / List View */
        <Card hover={false} className="space-y-4">
          <h3 className="font-bold text-base text-dark">Events Agenda ({events.length})</h3>
          <div className="divide-y divide-pink-100">
            {events.map((ev) => (
              <div
                key={ev.id}
                onClick={() => setSelectedEvent(ev)}
                className="py-3 flex items-center justify-between hover:bg-pink-50/50 px-3 rounded-2xl transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: ev.color }} />
                  <div>
                    <h4 className="text-xs font-bold text-dark">{ev.title}</h4>
                    <p className="text-[11px] text-pink-900/60">{ev.subject || 'General'}</p>
                  </div>
                </div>
                <div className="text-right text-xs text-pink-900/70 font-medium">
                  <p>{ev.date.toLocaleDateString()}</p>
                  <p className="text-[10px] text-pink-500 font-semibold">{ev.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title="Event Details 📌"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span
                className="w-3.5 h-3.5 rounded-full"
                style={{ backgroundColor: selectedEvent.color }}
              />
              <span className="text-xs font-bold uppercase tracking-wider text-pink-500">
                {selectedEvent.type}
              </span>
            </div>

            <h3 className="text-lg font-bold text-dark">{selectedEvent.title}</h3>

            <div className="p-3 bg-pink-50 rounded-2xl space-y-2 text-xs">
              <p className="flex items-center gap-2 text-pink-900">
                <BookOpen className="w-4 h-4 text-pink-500" />
                <span className="font-semibold">Subject:</span> {selectedEvent.subject || 'General'}
              </p>
              <p className="flex items-center gap-2 text-pink-900">
                <CalendarIcon className="w-4 h-4 text-pink-500" />
                <span className="font-semibold">Date:</span> {selectedEvent.date.toDateString()}
              </p>
              <p className="flex items-center gap-2 text-pink-900">
                <Clock className="w-4 h-4 text-pink-500" />
                <span className="font-semibold">Time:</span> {selectedEvent.time}
              </p>
            </div>

            {selectedEvent.type === 'exam' && (
              <div className="p-3 border border-purple-200 bg-purple-50 rounded-2xl text-xs text-purple-900">
                <p><span className="font-bold">Location:</span> {selectedEvent.raw.location}</p>
                <p><span className="font-bold">Preparation:</span> {selectedEvent.raw.preparationPercentage}%</p>
              </div>
            )}

            {selectedEvent.type === 'assignment' && (
              <div className="p-3 border border-amber-200 bg-amber-50 rounded-2xl text-xs text-amber-900">
                <p><span className="font-bold">Priority:</span> {selectedEvent.raw.priority}</p>
                <p><span className="font-bold">Status:</span> {selectedEvent.raw.status}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CalendarPage;
