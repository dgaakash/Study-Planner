import React from 'react';
import Button from './Button';

export const EmptyState = ({
  icon: Icon,
  emoji = '🌱',
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white/60 rounded-3xl border border-pink-100 border-dashed my-4">
      <div className="w-16 h-16 rounded-full bg-pink-100/80 flex items-center justify-center text-3xl mb-4 shadow-sm">
        {Icon ? <Icon className="w-8 h-8 text-pink-500" /> : emoji}
      </div>
      <h3 className="text-lg font-bold text-dark mb-1 font-sans">{title}</h3>
      <p className="text-sm text-pink-900/60 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
