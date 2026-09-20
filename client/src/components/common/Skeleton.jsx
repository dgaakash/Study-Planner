import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-pink-100/70 rounded-xl ${className}`} />
  );
};

export default Skeleton;
