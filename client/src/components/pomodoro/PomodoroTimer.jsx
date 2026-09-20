import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import api from '../../services/api';
import { Play, Pause, RotateCcw, SkipForward, CheckCircle2, Sparkles } from 'lucide-react';

export const PomodoroTimer = ({ subjects = [], onSessionComplete }) => {
  const WORK_TIME = 25 * 60; // 25 mins
  const BREAK_TIME = 5 * 60;  // 5 mins

  const [mode, setMode] = useState('work'); // 'work' or 'break'
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [saving, setSaving] = useState(false);
  const [completedNotice, setCompletedNotice] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      clearInterval(interval);
      setIsActive(false);
      handleTimerFinish();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleTimerFinish = async () => {
    if (mode === 'work') {
      try {
        setSaving(true);
        await api.post('/pomodoro', {
          subjectId: selectedSubject || null,
          duration: 25
        });
        setCompletedNotice(true);
        if (onSessionComplete) onSessionComplete();
        setTimeout(() => setCompletedNotice(false), 5000);
      } catch (err) {
        console.error('Error saving pomodoro session:', err);
      } finally {
        setSaving(false);
      }
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? WORK_TIME : BREAK_TIME);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'work' ? WORK_TIME : BREAK_TIME);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = Math.round(
    (( (mode === 'work' ? WORK_TIME : BREAK_TIME) - timeLeft) / (mode === 'work' ? WORK_TIME : BREAK_TIME)) * 100
  );

  return (
    <Card hover={false} className="text-center p-8 border border-pink-200">
      {/* Mode Tabs */}
      <div className="inline-flex p-1.5 bg-pink-50 rounded-2xl mb-8 border border-pink-100">
        <button
          onClick={() => switchMode('work')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
            mode === 'work' ? 'bg-pink-500 text-white shadow-md' : 'text-pink-700 hover:text-pink-900'
          }`}
        >
          🧠 Study Session (25m)
        </button>
        <button
          onClick={() => switchMode('break')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
            mode === 'break' ? 'bg-emerald-500 text-white shadow-md' : 'text-pink-700 hover:text-pink-900'
          }`}
        >
          ☕ Short Break (5m)
        </button>
      </div>

      {/* Subject Selector for Work Mode */}
      {mode === 'work' && (
        <div className="max-w-xs mx-auto mb-6">
          <label className="block text-xs font-semibold text-pink-900/60 mb-2">
            Link to Subject (Optional):
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-4 py-2 bg-pink-50/50 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="">-- Select Subject --</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Timer Circle */}
      <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            className="stroke-pink-100"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            className={mode === 'work' ? 'stroke-pink-500' : 'stroke-emerald-500'}
            strokeWidth="8"
            strokeDasharray="264"
            strokeDashoffset={264 - (264 * progressPercent) / 100}
            strokeLinecap="round"
            fill="transparent"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-extrabold text-dark font-sans tracking-tight">
            {formattedTime}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-pink-500 mt-2">
            {mode === 'work' ? 'Focus Time' : 'Rest & Refresh'}
          </span>
        </div>
      </div>

      {/* Notice Alert */}
      {completedNotice && (
        <div className="max-w-md mx-auto mb-6 p-3 bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center justify-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Great job! 25-minute study session completed & recorded in your stats.</span>
        </div>
      )}

      {/* Action Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant={isActive ? 'secondary' : 'primary'}
          size="lg"
          onClick={toggleTimer}
          className="min-w-[140px]"
        >
          {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
          <span>{isActive ? 'Pause' : 'Start Timer'}</span>
        </Button>

        <Button variant="outline" size="lg" onClick={resetTimer}>
          <RotateCcw className="w-5 h-5" />
          <span>Reset</span>
        </Button>

        <Button
          variant="ghost"
          size="lg"
          onClick={() => switchMode(mode === 'work' ? 'break' : 'work')}
        >
          <SkipForward className="w-5 h-5" />
          <span>Skip</span>
        </Button>
      </div>
    </Card>
  );
};

export default PomodoroTimer;
