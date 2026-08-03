import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

// Paginación accesible reutilizable.
// `page` es 1-indexed. `totalPages` puede ser 0 (se renderiza estado vacío).
export default function Pagination({ page, totalPages, onChange, className = '' }) {
  if (totalPages <= 1) return null;

  const goPrev = () => page > 1 && onChange(page - 1);
  const goNext = () => page < totalPages && onChange(page + 1);

  return (
    <nav
      className={cn('flex items-center justify-between gap-4', className)}
      aria-label="Paginación"
    >
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
        Página <span className="font-semibold text-slate-700 dark:text-slate-200">{page}</span> de {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={goPrev}
          disabled={page <= 1}
          aria-label="Página anterior"
          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <ChevronLeft size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={page >= totalPages}
          aria-label="Página siguiente"
          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}