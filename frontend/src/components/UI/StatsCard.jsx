import React from 'react';

const StatsCard = ({ title, value, icon: Icon, colorClass = "text-cyan-500", bgClass = "bg-cyan-100 dark:bg-cyan-900/30" }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm ring-1 ring-slate-200/60 dark:ring-slate-800 flex items-center gap-5 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-1 group">
      <div className={`p-4 rounded-xl ${bgClass} ${colorClass} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
        <Icon size={26} strokeWidth={2.5} />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">{title}</p>
        <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
