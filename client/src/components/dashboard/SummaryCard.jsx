import React from 'react';
import Card from '../common/Card';

export const SummaryCard = ({ title, value, subtitle, icon: Icon, color = 'pink' }) => {
  const colorMap = {
    pink: 'bg-pink-100 text-pink-600',
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600',
    emerald: 'bg-emerald-100 text-emerald-600'
  };

  return (
    <Card className="flex items-center gap-4">
      <div className={`p-4 rounded-2xl flex-shrink-0 ${colorMap[color] || colorMap.pink}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-semibold text-pink-900/60 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-extrabold text-dark mt-0.5 font-sans">{value}</h3>
        {subtitle && <p className="text-xs text-pink-700/80 mt-1 font-medium">{subtitle}</p>}
      </div>
    </Card>
  );
};

export default SummaryCard;
