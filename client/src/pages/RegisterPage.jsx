import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import { Sparkles, User, Mail, Lock, BookOpen, AlertCircle } from 'lucide-react';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    course: 'B.Sc. Computer Science',
    semester: 3,
    division: 'A'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7FB] flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-pink-100 p-8 shadow-card">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-pink-300 mx-auto flex items-center justify-center text-white shadow-md shadow-pink-500/20 mb-3">
            <Sparkles className="w-6 h-6 fill-white/20" />
          </div>
          <h2 className="text-2xl font-extrabold text-dark font-sans">Create Account 🌸</h2>
          <p className="text-xs text-pink-900/60 mt-1">Start organizing your college study routine</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-pink-900/70 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-pink-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Aakash Sharma"
                className="w-full pl-10 pr-4 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm text-dark placeholder:text-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-pink-900/70 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-pink-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="student@college.edu"
                className="w-full pl-10 pr-4 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm text-dark placeholder:text-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-pink-900/70 mb-1">Course / Degree</label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="B.Sc. CS"
                className="w-full px-4 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm text-dark focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-pink-900/70 mb-1">Semester & Div</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  placeholder="Sem 3"
                  className="w-full px-3 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm text-dark focus:outline-none focus:ring-2 focus:ring-pink-400 text-center"
                />
                <input
                  type="text"
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  placeholder="Div A"
                  className="w-full px-3 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm text-dark focus:outline-none focus:ring-2 focus:ring-pink-400 text-center"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-pink-900/70 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-pink-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm text-dark placeholder:text-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-pink-900/70 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-pink-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm text-dark placeholder:text-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full mt-4" isLoading={loading}>
            Create Account
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-pink-900/60">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-pink-600 hover:underline">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
