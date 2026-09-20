import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'danger', 'ghost'
  size = 'md', // 'sm', 'md', 'lg'
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary: 'bg-pink-500 text-white hover:bg-pink-600 focus:ring-pink-400 shadow-md hover:shadow-lg shadow-pink-500/20 active:scale-[0.98]',
    secondary: 'bg-pink-100 text-pink-700 hover:bg-pink-200 focus:ring-pink-300 font-semibold',
    outline: 'border-2 border-pink-200 text-pink-600 hover:bg-pink-50 focus:ring-pink-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 shadow-sm',
    ghost: 'text-pink-700 hover:bg-pink-50 focus:ring-pink-200'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3.5 text-base rounded-2xl gap-2.5 font-semibold'
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
