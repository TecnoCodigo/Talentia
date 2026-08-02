import React from 'react';

const FilterBar = ({ filters, onFilterChange }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6 bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
      {filters.map((filter, i) => (
        <div key={i} className="flex flex-col flex-1 min-w-[150px]">
          <label className="text-xs text-slate-500 dark:text-slate-400 mb-1">{filter.label}</label>
          {filter.type === 'select' ? (
            <select
              className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-slate-800 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
              onChange={(e) => onFilterChange(filter.key, e.target.value)}
            >
              <option value="">Todos</option>
              {filter.options.map((opt, j) => (
                <option key={j} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              placeholder={filter.placeholder}
              className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-slate-800 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
              onChange={(e) => onFilterChange(filter.key, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default FilterBar;
