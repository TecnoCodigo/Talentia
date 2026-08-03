import { useState, useEffect, useId } from 'react';
import { useDebounce } from '../../lib/useDebounce';
import { cn } from '../../lib/utils';

// FilterBar con debounce interno en inputs de texto (400ms) y botón "Limpiar filtros".
// Los selects aplican el cambio inmediatamente (no necesitan debounce).
// El padre recibe `onFilterChange(key, value)` como antes; cuando un filtro
// de texto cambia, se emite tras el debounce.
const DEBOUNCE_MS = 400;

export default function FilterBar({ filters, onFilterChange, onClear }) {
  // Estado local de los inputs para mantener la UI responsiva mientras debouncea.
  const [local, setLocal] = useState(() =>
    Object.fromEntries(filters.map((f) => [f.key, ''])),
  );
  const debounced = useDebounce(local, DEBOUNCE_MS);
  const hasActiveFilters = Object.values(local).some((v) => v !== '' && v != null);

  // Emitir cambios debounced al padre.
  useEffect(() => {
    Object.entries(debounced).forEach(([key, value]) => {
      onFilterChange(key, value);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const handleTextChange = (key, value) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelectChange = (key, value) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
  };

  const handleClear = () => {
    const cleared = Object.fromEntries(filters.map((f) => [f.key, '']));
    setLocal(cleared);
    if (onClear) onClear();
  };

  return (
    <div className="mb-6 flex flex-wrap items-end gap-4 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
      {filters.map((filter) => {
        const id = useId();
        return (
          <div key={filter.key} className="flex min-w-[150px] flex-1 flex-col">
            <label htmlFor={id} className="mb-1 text-xs text-slate-500 dark:text-slate-400">
              {filter.label}
            </label>
            {filter.type === 'select' ? (
              <select
                id={id}
                value={local[filter.key] ?? ''}
                onChange={(e) => handleSelectChange(filter.key, e.target.value)}
                className={cn(
                  'block w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-sm text-slate-900 focus:border-brand-500 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400',
                )}
              >
                <option value="">Todos</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                id={id}
                type="text"
                placeholder={filter.placeholder}
                value={local[filter.key] ?? ''}
                onChange={(e) => handleTextChange(filter.key, e.target.value)}
                className={cn(
                  'block w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-sm text-slate-900 focus:border-brand-500 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400',
                )}
              />
            )}
          </div>
        );
      })}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={handleClear}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}