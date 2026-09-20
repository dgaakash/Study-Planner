import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import { Sparkles, Mail, Lock, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log in. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7FB] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-pink-100 p-8 shadow-card">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-pink-300 mx-auto flex items-center justify-center text-white shadow-md shadow-pink-500/20 mb-3">
            <Sparkles className="w-6 h-6 fill-white/20" />
          </div>
          <h2 className="text-2xl font-extrabold text-dark font-sans">Welcome Back 🌸</h2>
          <p className="text-xs text-pink-900/60 mt-1">Log in to access your student planner</p>
        </div>

        {/* Demo Credentials Quick Pill */}
        <div className="mb-6 p-3 bg-pink-50 rounded-2xl border border-pink-200 text-xs text-pink-900">
          <p className="font-bold text-pink-700 mb-0.5">💡 Demo Account Credentials:</p>
          <p><span className="font-semibold">Email:</span> aakash@student.com</p>
          <p><span className="font-semibold">Password:</span> password123</p>
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
            <label className="block text-xs font-semibold text-pink-900/70 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-pink-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aakash@student.com"
                className="w-full pl-10 pr-4 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm text-dark placeholder:text-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-pink-900/70 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-pink-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-sm text-dark placeholder:text-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full mt-2" isLoading={loading}>
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-pink-900/60">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-pink-600 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
