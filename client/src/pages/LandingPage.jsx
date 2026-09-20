import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, CalendarCheck, GraduationCap, BarChart3, Timer, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../components/common/Button';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#FFF7FB] flex flex-col justify-between">
      {/* Header Navigation */}
      <header className="px-6 lg:px-12 py-6 flex items-center justify-between border-b border-pink-100/60 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-pink-300 flex items-center justify-center text-white shadow-md shadow-pink-500/20">
            <Sparkles className="w-5 h-5 fill-white/20" />
          </div>
          <span className="font-extrabold text-xl text-dark tracking-tight">StudyBloom</span>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 lg:px-12 py-16 md:py-24 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 text-pink-700 text-xs font-bold mb-8 border border-pink-200 shadow-xs animate-fadeIn">
          <Sparkles className="w-4 h-4 text-pink-500" />
          <span>The College Student's Productivity Companion 🌸</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-dark tracking-tight leading-tight mb-6 font-sans">
          Plan Better. Study Smarter. <br />
          <span className="bg-gradient-to-r from-pink-600 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            Bloom Brighter. 🌸
          </span>
        </h1>

        <p className="text-base md:text-lg text-pink-900/70 max-w-2xl mx-auto leading-relaxed mb-10">
          A simple, beautiful study planner that helps college students organize subjects, manage assignments, prepare for exams, and build consistent study habits without overcomplication.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link to="/register" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              <span>Login to Account</span>
            </Button>
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-soft hover:shadow-card transition-all">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mb-4">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-dark text-base mb-1">Smart Planning</h3>
            <p className="text-xs text-pink-900/60 leading-relaxed">
              Schedule daily study sessions, assign subjects, set duration, and track topics seamlessly.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-soft hover:shadow-card transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-dark text-base mb-1">Exam Tracking</h3>
            <p className="text-xs text-pink-900/60 leading-relaxed">
              Monitor upcoming exam countdowns, locations, topics, and preparation confidence percentages.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-soft hover:shadow-card transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-dark text-base mb-1">Study Analytics</h3>
            <p className="text-xs text-pink-900/60 leading-relaxed">
              Visualize weekly study hours, subject distribution, assignment completion rates, and streaks.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-soft hover:shadow-card transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
              <Timer className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-dark text-base mb-1">Productivity Timer</h3>
            <p className="text-xs text-pink-900/60 leading-relaxed">
              Stay focused with built-in 25-minute Pomodoro timer sessions linked directly to your database.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-pink-100 text-center text-xs text-pink-900/50">
        <p>© 2026 StudyBloom — Student Study Planner. College Field Project.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
