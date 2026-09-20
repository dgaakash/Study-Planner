import React from 'react';
import Card from '../common/Card';

export const WeeklyChart = ({ data = [] }) => {
  // Find max value to normalize height
  const maxHours = Math.max(...data.map(d => d.hours), 4);

  return (
    <Card hover={false} className="h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-base text-dark">Weekly Progress 📊</h3>
          <p className="text-xs text-pink-900/60">Study hours breakdown (Monday → Sunday)</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-pink-50 text-pink-700 rounded-full border border-pink-100">
          This Week
        </span>
      </div>

      <div className="flex items-end justify-between gap-2 md:gap-4 h-48 pt-6 pb-2 px-2">
        {data.map((item, index) => {
          const heightPercent = Math.round((item.hours / maxHours) * 100);
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              {/* Value Label */}
              <span className="text-[11px] font-bold text-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                {item.hours}h
              </span>

              {/* Bar */}
              <div className="w-full bg-pink-100 rounded-2xl overflow-hidden h-full max-h-[140px] flex items-end">
                <div
                  style={{ height: `${Math.max(heightPercent, 8)}%` }}
                  className={`w-full rounded-t-2xl transition-all duration-500 ${
                    item.hours > 0
                      ? 'bg-gradient-to-t from-pink-500 to-pink-400 group-hover:from-pink-600 group-hover:to-pink-500'
                      : 'bg-pink-200'
                  }`}
                />
              </div>

              {/* Day Label */}
              <span className="text-xs font-semibold text-pink-950/70">{item.day}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default WeeklyChart;
