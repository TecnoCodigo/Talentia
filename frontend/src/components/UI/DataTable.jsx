import { Inbox, Eye, Edit2, Trash2 } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';

const DataTable = ({ columns, data, isLoading, onEdit, onDelete, onView, emptyMessage = 'No hay datos disponibles' }) => {
  const hasActions = Boolean(onEdit || onDelete || onView);
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="px-6 py-4 font-semibold">{col.label}</th>
            ))}
            {hasActions && <th className="px-6 py-4 text-right font-semibold">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <tr key={idx} className="border-b dark:border-slate-800">
                {columns.map((_, colIdx) => (
                  <td key={colIdx} className="px-6 py-4">
                    <Skeleton className="h-4 w-3/4" />
                  </td>
                ))}
                {hasActions && (
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (hasActions ? 1 : 0)}>
                <EmptyState icon={Inbox} title={emptyMessage} description="Intenta ajustar tus filtros o crea un nuevo registro." />
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={i} className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
                {columns.map((col, j) => (
                  <td key={j} className="px-6 py-4 text-slate-700 dark:text-slate-300">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {hasActions && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {onView && (
                        <button
                          onClick={() => onView(row)}
                          className="rounded-md bg-blue-50 p-1.5 text-blue-600 transition-colors hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-blue-900/20 dark:hover:bg-blue-900/40"
                          aria-label="Ver detalle"
                          title="Ver detalle"
                        >
                          <Eye size={16} aria-hidden="true" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="rounded-md bg-brand-50 p-1.5 text-brand-600 transition-colors hover:bg-brand-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 dark:bg-brand-900/20 dark:hover:bg-brand-900/40"
                          aria-label="Editar"
                          title="Editar"
                        >
                          <Edit2 size={16} aria-hidden="true" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="rounded-md bg-rose-50 p-1.5 text-rose-600 transition-colors hover:bg-rose-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:bg-rose-900/20 dark:hover:bg-rose-900/40"
                          aria-label="Eliminar"
                          title="Eliminar"
                        >
                          <Trash2 size={16} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;