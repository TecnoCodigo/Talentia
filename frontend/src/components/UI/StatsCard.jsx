import React from 'react';

const StatsCard = ({ title, value, icon: Icon, colorClass = "text-cyan-500", bgClass = "bg-cyan-100 dark:bg-cyan-900/30" }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${bgClass} ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
