import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import DataTable from '../../components/UI/DataTable';
import FilterBar from '../../components/UI/FilterBar';
import ConfirmModal from '../../components/UI/ConfirmModal';
import ErrorState from '../../components/UI/ErrorState';
import Badge from '../../components/UI/Badge';
import Pagination from '../../components/UI/Pagination';
import { useAuth } from '../../context/AuthContext';
import { Plus } from 'lucide-react';

const PAGE_SIZE = 10;

const EmpresasListado = () => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ sector: '', estado: '' });
  const [page, setPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, empresa: null });
  const { hasRole } = useAuth();
  const navigate = useNavigate();

  const fetchEmpresas = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([, v]) => v)),
      ).toString();
      const res = await api.get(`/empresas${query ? `?${query}` : ''}`);
      setEmpresas(res.data);
      setPage(1);
    } catch (err) {
      setError('No se pudo cargar la lista de empresas.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEmpresas();
  }, [fetchEmpresas]);

  // Filtro client-side por sector (el backend solo soporta pais/estado)
  const filtered = useMemo(() => {
    const sector = filters.sector?.toLowerCase().trim();
    if (!sector) return empresas;
    return empresas.filter((e) => (e.sector || '').toLowerCase().includes(sector));
  }, [empresas, filters.sector]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const confirmDelete = async () => {
    const row = deleteModal.empresa;
    if (!row) return;
    try {
      await api.delete(`/empresas/${row.id}`);
      setEmpresas((prev) => prev.filter((e) => e.id !== row.id));
      setDeleteModal({ isOpen: false, empresa: null });
    } catch (err) {
      setDeleteModal({ isOpen: false, empresa: null });
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Empresas</h1>
        {hasRole(['Administrador']) && (
          <Link to="/empresas/nueva" className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 dark:focus:ring-offset-slate-900">
            <Plus size={18} aria-hidden="true" /> Nueva Empresa
          </Link>
        )}
      </div>

      <FilterBar
        filters={[
          { label: 'Sector', key: 'sector', type: 'text', placeholder: 'Buscar por sector…' },
          {
            label: 'Estado',
            key: 'estado',
            type: 'select',
            options: [
              { label: 'Activa', value: 'Activa' },
              { label: 'Inactiva', value: 'Inactiva' },
            ],
          },
        ]}
        onFilterChange={(key, val) => setFilters((prev) => ({ ...prev, [key]: val }))}
        onClear={() => setFilters({ sector: '', estado: '' })}
      />

      {error && !loading && <ErrorState title="No se pudo cargar el listado" description={error} onRetry={fetchEmpresas} />}

      {!error && (
        <>
          <DataTable
            columns={[
              { label: 'Nombre', key: 'nombre' },
              { label: 'Sector', key: 'sector' },
              { label: 'Responsable', key: 'responsable' },
              { label: 'Ubicación', render: (row) => [row.ciudad, row.pais].filter(Boolean).join(', ') || '—' },
              {
                label: 'Estado',
                render: (row) => (
                  <Badge tone={row.estado === 'Activa' ? 'success' : 'neutral'}>
                    {row.estado || 'Activa'}
                  </Badge>
                ),
              },
            ]}
            data={paged}
            isLoading={loading}
            emptyMessage="No se encontraron empresas"
            onView={(row) => navigate(`/empresas/${row.id}`)}
            onEdit={hasRole(['Administrador']) ? (row) => navigate(`/empresas/${row.id}/editar`) : null}
            onDelete={hasRole(['Administrador']) ? (row) => setDeleteModal({ isOpen: true, empresa: row }) : null}
          />
          {!loading && filtered.length > PAGE_SIZE && (
            <Pagination page={page} totalPages={totalPages} onChange={setPage} className="mt-4" />
          )}
        </>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, empresa: null })}
        onConfirm={confirmDelete}
        title="Eliminar Empresa"
        message={`¿Estás seguro que deseas eliminar la empresa ${deleteModal.empresa?.nombre}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
      />
    </div>
  );
};
export default EmpresasListado;