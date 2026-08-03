import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axiosInstance';
import DataTable from '../../components/UI/DataTable';
import FilterBar from '../../components/UI/FilterBar';
import ErrorState from '../../components/ui/ErrorState';
import Badge from '../../components/ui/Badge';
import Pagination from '../../components/ui/Pagination';
import { Plus } from 'lucide-react';

const PAGE_SIZE = 10;

const ReclutadoresListado = () => {
  const [reclutadores, setReclutadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ nombre: '', estado: '' });
  const [page, setPage] = useState(1);

  const fetchReclutadores = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/usuarios');
      setReclutadores(res.data.filter((u) => u.rol === 'Reclutador'));
    } catch (err) {
      setError('No se pudo cargar la lista de reclutadores.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReclutadores();
  }, [fetchReclutadores]);

  const filtered = useMemo(() => {
    const nombre = filters.nombre?.toLowerCase().trim();
    return reclutadores.filter((r) => {
      if (nombre && !(r.nombre || '').toLowerCase().includes(nombre) && !(r.usuario || '').toLowerCase().includes(nombre)) return false;
      if (filters.estado && r.estado !== filters.estado) return false;
      return true;
    });
  }, [reclutadores, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleToggleEstado = async (row) => {
    try {
      const newEstado = row.estado === 'Activo' ? 'Inactivo' : 'Activo';
      await api.patch(`/usuarios/${row.id}/estado`, { estado: newEstado });
      toast.success(`Estado cambiado a ${newEstado}`);
      fetchReclutadores();
    } catch (err) {
      toast.error('Error al cambiar estado');
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reclutadores</h1>
        <Link to="/reclutadores/nuevo" className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 dark:focus:ring-offset-slate-900">
          <Plus size={18} aria-hidden="true" /> Nuevo Reclutador
        </Link>
      </div>

      <FilterBar
        filters={[
          { label: 'Buscar', key: 'nombre', type: 'text', placeholder: 'Nombre o usuario…' },
          {
            label: 'Estado',
            key: 'estado',
            type: 'select',
            options: [
              { label: 'Activo', value: 'Activo' },
              { label: 'Inactivo', value: 'Inactivo' },
            ],
          },
        ]}
        onFilterChange={(key, val) => setFilters((prev) => ({ ...prev, [key]: val }))}
        onClear={() => setFilters({ nombre: '', estado: '' })}
      />

      {error && !loading && <ErrorState title="No se pudo cargar el listado" description={error} onRetry={fetchReclutadores} />}

      {!error && (
        <>
          <DataTable
            columns={[
              { label: 'Nombre', key: 'nombre' },
              { label: 'Usuario', key: 'usuario' },
              { label: 'Correo', key: 'correo' },
              {
                label: 'Estado',
                render: (row) => (
                  <button
                    onClick={() => handleToggleEstado(row)}
                    className="transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded-full"
                    aria-label={`Cambiar estado de ${row.nombre} (actual: ${row.estado})`}
                    title="Clic para cambiar estado"
                  >
                    <Badge tone={row.estado === 'Activo' ? 'success' : 'danger'}>
                      {row.estado}
                    </Badge>
                  </button>
                ),
              },
            ]}
            data={paged}
            isLoading={loading}
            emptyMessage="No se encontraron reclutadores"
          />
          {!loading && filtered.length > PAGE_SIZE && (
            <Pagination page={page} totalPages={totalPages} onChange={setPage} className="mt-4" />
          )}
        </>
      )}
    </div>
  );
};
export default ReclutadoresListado;