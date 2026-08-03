import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { Building2, Mail, Phone, MapPin, Globe, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import Badge from '../../components/ui/Badge';

const EmpresaDetalle = () => {
  const { id } = useParams();
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { hasRole } = useAuth();

  const fetchEmpresa = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/empresas/${id}`);
      setEmpresa(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'No se pudo cargar la empresa.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpresa();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <div className="mb-6 flex items-center gap-4 border-b pb-6 dark:border-slate-800">
            <Skeleton className="h-16 w-16 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-3">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl">
        <ErrorState title="No se pudo cargar la empresa" description={error} onRetry={fetchEmpresa} />
      </div>
    );
  }

  if (!empresa) return null;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
        <div className="mb-6 flex items-start justify-between border-b pb-6 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
              <Building2 size={32} aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{empresa.nombre}</h1>
              <p className="text-slate-500 dark:text-slate-400">{empresa.sector || 'Sector no especificado'}</p>
              <div className="mt-2 flex items-center gap-3">
                <Badge tone={empresa.estado === 'Activa' ? 'success' : 'neutral'}>{empresa.estado || 'Activa'}</Badge>
                {empresa.rif && <span className="text-sm text-slate-500 dark:text-slate-400">RIF: {empresa.rif}</span>}
              </div>
            </div>
          </div>
          {hasRole(['Administrador']) && (
            <Link
              to={`/empresas/${id}/editar`}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Editar
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Dirección</h3>
            <p className="text-slate-600 dark:text-slate-400">{empresa.direccion || 'Sin dirección registrada'}</p>
          </div>
          <div className="space-y-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/30">
            {empresa.responsable && (
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <User size={18} className="text-slate-400" aria-hidden="true" />
                <span><span className="font-medium text-slate-900 dark:text-white">Responsable:</span> {empresa.responsable}</span>
              </div>
            )}
            {empresa.correoContacto && (
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <Mail size={18} className="text-slate-400" aria-hidden="true" />
                <a href={`mailto:${empresa.correoContacto}`} className="hover:text-brand-600 dark:hover:text-brand-400">{empresa.correoContacto}</a>
              </div>
            )}
            {empresa.telefono && (
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <Phone size={18} className="text-slate-400" aria-hidden="true" />
                <a href={`tel:${empresa.telefono}`} className="hover:text-brand-600 dark:hover:text-brand-400">{empresa.telefono}</a>
              </div>
            )}
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <Globe size={18} className="text-slate-400" aria-hidden="true" />
              {empresa.pais || empresa.ciudad ? `${empresa.ciudad ? empresa.ciudad + ', ' : ''}${empresa.pais || ''}` : 'Ubicación no especificada'}
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <MapPin size={18} className="text-slate-400" aria-hidden="true" />
              {empresa.pais || '—'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EmpresaDetalle;