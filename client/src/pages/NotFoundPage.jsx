import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { Sparkles, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#FFF7FB] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-3xl mb-4 shadow-sm">
        🌸
      </div>
      <h1 className="text-4xl font-extrabold text-dark mb-2 font-sans">404 - Page Not Found</h1>
      <p className="text-sm text-pink-900/60 max-w-sm mb-8">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/dashboard">
        <Button variant="primary">
          <Home className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
