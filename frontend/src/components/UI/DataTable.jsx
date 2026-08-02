import React from 'react';

const DataTable = ({ columns, data, onEdit, onDelete, onView }) => {
  return (
    <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-lg shadow ring-1 ring-slate-200 dark:ring-slate-800">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-400">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="px-6 py-3">{col.label}</th>
            ))}
            {(onEdit || onDelete || onView) && <th className="px-6 py-3 text-right">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={columns.length + 1} className="px-6 py-4 text-center text-slate-500">No hay datos disponibles</td></tr>
          ) : (
            data.map((row, i) => (
              <tr key={i} className="border-b dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                {columns.map((col, j) => (
                  <td key={j} className="px-6 py-4">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {(onEdit || onDelete || onView) && (
                  <td className="px-6 py-4 text-right space-x-2">
                    {onView && <button onClick={() => onView(row)} className="text-blue-600 hover:underline">Ver</button>}
                    {onEdit && <button onClick={() => onEdit(row)} className="text-cyan-600 hover:underline">Editar</button>}
                    {onDelete && <button onClick={() => onDelete(row)} className="text-red-600 hover:underline">Eliminar</button>}
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
