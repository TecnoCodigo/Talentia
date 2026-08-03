import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { User, Mail, Phone, MapPin, Briefcase, FileText, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Skeleton from '../../components/UI/Skeleton';
import ErrorState from '../../components/UI/ErrorState';
import Badge from '../../components/UI/Badge';

const TalentoDetalle = () => {
  const { id } = useParams();
  const [talento, setTalento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { canEditTalento } = useAuth();

  const fetchTalento = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/talentos/${id}`);
      setTalento(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'No se pudo cargar el talento.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTalento();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <div className="border-b border-slate-200 p-6 dark:border-slate-800 sm:p-10">
            <div className="flex items-center gap-6">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="space-y-4 p-6 md:col-span-2">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="space-y-4 bg-slate-50 p-6 dark:bg-slate-800/30">
              <Skeleton className="h-5 w-1/3" />
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
        <ErrorState
          title="No se pudo cargar el talento"
          description={error}
          onRetry={fetchTalento}
        />
      </div>
    );
  }

  if (!talento) return null;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
        <div className="border-b border-slate-200 p-6 dark:border-slate-800 sm:p-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-brand-500 to-blue-500 text-3xl font-bold text-white shadow-md">
                {talento.nombreCompleto.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{talento.nombreCompleto}</h1>
                <p className="font-medium text-brand-600 dark:text-brand-400">{talento.especialidad || 'Sin especialidad definida'}</p>
                <div className="mt-2 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1"><MapPin size={14} aria-hidden="true" /> {talento.ciudad ? `${talento.ciudad}, ` : ''}{talento.pais}</span>
                  <Badge tone={talento.estadoLaboral === 'Disponible' ? 'success' : 'neutral'}>
                    {talento.estadoLaboral}
                  </Badge>
                </div>
              </div>
            </div>
            {canEditTalento(talento) && (
              <Link
                to={`/talentos/${id}/editar`}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Editar
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 divide-y border-slate-200 dark:border-slate-800 md:grid-cols-3 md:divide-y-0 md:divide-x">
          <div className="space-y-6 p-6 md:col-span-2">
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white"><User size={18} aria-hidden="true" /> Acerca de</h3>
              <p className="whitespace-pre-wrap text-slate-600 dark:text-slate-400">{talento.resumen || 'No hay resumen disponible.'}</p>
            </div>
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white"><Briefcase size={18} aria-hidden="true" /> Experiencia y Empresa</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li><span className="font-medium text-slate-900 dark:text-white">Años de experiencia:</span> {talento.experienciaAnios} años</li>
                <li><span className="font-medium text-slate-900 dark:text-white">Empresa Asociada:</span> {talento.empresa?.nombre || 'Ninguna'}</li>
                <li><span className="font-medium text-slate-900 dark:text-white">Registrado por:</span> {talento.registradoPor?.nombre || 'Desconocido'}</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 bg-slate-50 p-6 dark:bg-slate-800/30">
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white"><Mail size={18} aria-hidden="true" /> Contacto</h3>
              <ul className="space-y-3">
                {talento.correo && (
                  <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Mail size={16} className="text-slate-400" aria-hidden="true" />
                    <a href={`mailto:${talento.correo}`} className="hover:text-brand-600 dark:hover:text-brand-400">{talento.correo}</a>
                  </li>
                )}
                {talento.telefono && (
                  <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Phone size={16} className="text-slate-400" aria-hidden="true" />
                    <a href={`tel:${talento.telefono}`} className="hover:text-brand-600 dark:hover:text-brand-400">{talento.telefono}</a>
                  </li>
                )}
              </ul>
            </div>

            {talento.urlCv && (
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white"><FileText size={18} aria-hidden="true" /> Currículum</h3>
                <a
                  href={talento.urlCv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2 font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 dark:focus:ring-offset-slate-900"
                >
                  <Download size={18} aria-hidden="true" /> Descargar PDF
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default TalentoDetalle;