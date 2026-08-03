import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import DataTable from '../../components/UI/DataTable';
import FilterBar from '../../components/UI/FilterBar';
import ConfirmModal from '../../components/UI/ConfirmModal';
import ErrorState from '../../components/UI/ErrorState';
import Badge from '../../components/UI/Badge';
import Pagination from '../../components/UI/Pagination';
import { Plus, UploadCloud } from 'lucide-react';

const PAGE_SIZE = 10;

const TalentosListado = () => {
  const [talentos, setTalentos] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, talento: null });
  const { canEditTalento } = useAuth();
  const navigate = useNavigate();

  const fetchTalentos = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([, v]) => v)),
      ).toString();
      const res = await api.get(`/talentos${query ? `?${query}` : ''}`);
      setTalentos(res.data);
      setPage(1);
    } catch (err) {
      setError('No se pudo cargar la lista de talentos.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTalentos();
  }, [fetchTalentos]);

  // Filtro client-side por especialidad (el backend recibe estadoLaboral y otros por query)
  const filtered = useMemo(() => {
    const esp = filters.especialidad?.toLowerCase().trim();
    if (!esp) return talentos;
    return talentos.filter((t) => (t.especialidad || '').toLowerCase().includes(esp));
  }, [talentos, filters.especialidad]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const confirmDelete = async () => {
    const row = deleteModal.talento;
    if (!row) return;
    try {
      await api.delete(`/talentos/${row.id}`);
      setTalentos((prev) => prev.filter((t) => t.id !== row.id));
      setDeleteModal({ isOpen: false, talento: null });
    } catch (err) {
      setDeleteModal({ isOpen: false, talento: null });
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Talentos</h1>
        <div className="flex gap-3">
          <Link to="/talentos/cargar-cv" className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600">
            <UploadCloud size={18} aria-hidden="true" /> Cargar CV
          </Link>
          <Link to="/talentos/nuevo" className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 dark:focus:ring-offset-slate-900">
            <Plus size={18} aria-hidden="true" /> Nuevo
          </Link>
        </div>
      </div>

      <FilterBar
        filters={[
          { label: 'Especialidad', key: 'especialidad', type: 'text', placeholder: 'Buscar…' },
          {
            label: 'Estado',
            key: 'estadoLaboral',
            type: 'select',
            options: [
              { label: 'Disponible', value: 'Disponible' },
              { label: 'Empleado', value: 'Empleado' },
              { label: 'Freelance', value: 'Freelance' },
            ],
          },
        ]}
        onFilterChange={(key, val) => setFilters((prev) => ({ ...prev, [key]: val }))}
        onClear={() => setFilters({ especialidad: '', estadoLaboral: '' })}
      />

      {error && !loading && <ErrorState title="No se pudo cargar el listado" description={error} onRetry={fetchTalentos} />}

      {!error && (
        <>
          <DataTable
            columns={[
              { label: 'Nombre', key: 'nombreCompleto' },
              { label: 'Especialidad', key: 'especialidad' },
              { label: 'Experiencia', render: (row) => `${row.experienciaAnios} años` },
              { label: 'Empresa', render: (row) => row.empresa?.nombre || 'Ninguna' },
              {
                label: 'Estado',
                render: (row) => (
                  <Badge tone={row.estadoLaboral === 'Disponible' ? 'success' : 'neutral'}>
                    {row.estadoLaboral}
                  </Badge>
                ),
              },
            ]}
            data={paged}
            isLoading={loading}
            emptyMessage="No se encontraron talentos"
            onView={(row) => navigate(`/talentos/${row.id}`)}
            onEdit={(row) => navigate(`/talentos/${row.id}/editar`)}
            onDelete={(row) => setDeleteModal({ isOpen: true, talento: row })}
            isEditDisabled={(row) => !canEditTalento(row)}
            isDeleteDisabled={(row) => !canEditTalento(row)}
          />
          {!loading && filtered.length > PAGE_SIZE && (
            <Pagination page={page} totalPages={totalPages} onChange={setPage} className="mt-4" />
          )}
        </>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, talento: null })}
        onConfirm={confirmDelete}
        title="Eliminar Talento"
        message={`¿Estás seguro que deseas eliminar al talento ${deleteModal.talento?.nombreCompleto}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
      />
    </div>
  );
};
export default TalentosListado;