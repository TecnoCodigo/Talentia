import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import Modal from '../components/UI/Modal';
import Pagination from '../components/ui/Pagination';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { Mail, Phone, Shield, Calendar, Monitor, Smartphone, Globe, Clock, ShieldCheck, Trash2, Filter } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const [sesiones, setSesiones] = useState([]);
  const [loadingSesiones, setLoadingSesiones] = useState(true);

  // Modal de todas las sesiones
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalSesiones, setModalSesiones] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [loadingModal, setLoadingModal] = useState(false);

  const fetchSesionesPrincipales = async () => {
    try {
      const res = await api.get('/auth/sessions?limit=5');
      setSesiones(res.data.data || []);
      setTotalRegistros(res.data.total || 0);
    } catch (err) {
      // silencioso
    } finally {
      setLoadingSesiones(false);
    }
  };

  useEffect(() => {
    fetchSesionesPrincipales();
  }, []);

  const fetchModalSesiones = async (estado = filtroEstado, page = paginaActual) => {
    setLoadingModal(true);
    try {
      const res = await api.get(`/auth/sessions?estado=${estado}&page=${page}&limit=5`);
      setModalSesiones(res.data.data || []);
      setTotalPaginas(res.data.totalPages || 1);
    } catch (err) {
      // silencioso
    } finally {
      setLoadingModal(false);
    }
  };

  const abrirModal = () => {
    setModalAbierto(true);
    setPaginaActual(1);
    fetchModalSesiones('todas', 1);
  };

  const handleCambiarFiltro = (nuevoEstado) => {
    setFiltroEstado(nuevoEstado);
    setPaginaActual(1);
    fetchModalSesiones(nuevoEstado, 1);
  };

  const handleCambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
      fetchModalSesiones(filtroEstado, nuevaPagina);
    }
  };

  const handleRevocarSesion = async (sessionId) => {
    try {
      await api.delete(`/auth/sessions/${sessionId}`);
      fetchSesionesPrincipales();
      if (modalAbierto) fetchModalSesiones(filtroEstado, paginaActual);
    } catch (err) {
      // silencioso
    }
  };

  const fechaRegistro = user?.creadoEn
    ? new Date(user.creadoEn).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  const renderSesion = (s) => {
    const esActiva = s.estado === 'Activa' || s.estado === 'Sesión Actual';
    const esMovil = s.dispositivo.includes('Móvil') || s.dispositivo.includes('Android') || s.dispositivo.includes('iOS');
    return (
      <div
        key={s.id}
        className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-3 transition hover:bg-slate-100/60 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800/80"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="shrink-0 rounded-xl border border-slate-200 bg-white p-2 text-brand-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-brand-400">
            {esMovil ? <Smartphone className="h-4 w-4" aria-hidden="true" /> : <Monitor className="h-4 w-4" aria-hidden="true" />}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">{s.dispositivo}</p>
              <Badge tone={esActiva ? 'success' : 'neutral'}>{esActiva ? '● Activa' : 'Finalizada'}</Badge>
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1"><Globe className="h-3 w-3" aria-hidden="true" /> {s.ipAcceso}</span>
              <span>•</span>
              <span>{new Date(s.creadoEn).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}</span>
            </div>
          </div>
        </div>

        {esActiva && (
          <button
            onClick={() => handleRevocarSesion(s.id)}
            title="Revocar esta sesión"
            aria-label="Revocar esta sesión"
            className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:hover:bg-rose-900/30"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 gap-6 p-4 sm:p-8 lg:grid-cols-12 lg:gap-8">
          {/* Tarjeta de perfil */}
          <div className="z-10 flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-800/40 lg:col-span-4">
            <div className="mb-4 flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-blue-600 text-4xl font-extrabold text-white shadow-md dark:from-brand-700 dark:to-blue-700 sm:h-32 sm:w-32">
              {user?.nombre ? user.nombre.charAt(0) : 'U'}
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.nombre}</h2>
            <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">@{user?.usuario} • ID #{user?.id}</p>

            <div className="my-4 flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 dark:border-brand-800 dark:bg-brand-900/30 dark:text-brand-400">
              <Shield className="h-3.5 w-3.5" aria-hidden="true" /> Rol: {user?.rol || 'Usuario'}
            </div>

            <div className="mt-2 w-full space-y-3.5 border-t border-slate-100 pt-4 text-left dark:border-slate-700">
              <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <Mail className="h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                <span className="truncate">{user?.correo}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <Phone className="h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                <span>{user?.telefono || '—'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <Calendar className="h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                <span>Miembro desde: <strong>{fechaRegistro}</strong></span>
              </div>
            </div>
          </div>

          {/* Panel de sesiones */}
          <div className="space-y-6 pt-0 lg:col-span-8 lg:pt-20">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/40">
              <div className="mb-4 flex flex-col items-start justify-between gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-center dark:border-slate-700">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                    <Clock className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden="true" /> Últimas Sesiones Registradas
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">Priorizando conexiones activas (Máximo 5 visibles)</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Conexión Protegida
                </span>
              </div>

              {loadingSesiones ? (
                <div className="flex justify-center p-6">
                  <Spinner className="text-brand-600 dark:text-brand-400" />
                </div>
              ) : sesiones.length === 0 ? (
                <EmptyState title="No hay sesiones registradas" />
              ) : (
                <div className="space-y-2.5">
                  {sesiones.map(renderSesion)}
                  <div className="border-t border-slate-100 pt-3 text-center dark:border-slate-700">
                    <button
                      onClick={abrirModal}
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 transition hover:text-brand-800 hover:underline dark:text-brand-400 dark:hover:text-brand-300"
                    >
                      Ver todas las sesiones y filtros ({totalRegistros}) →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={modalAbierto} onClose={() => setModalAbierto(false)} title="Gestión completa de sesiones" size="lg">
        {/* Filtros */}
        <div className="mb-4 flex items-center gap-1.5 overflow-x-auto border-b border-slate-100 pb-3 dark:border-slate-700">
          <span className="mr-1 flex shrink-0 items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <Filter className="h-3 w-3" aria-hidden="true" /> Filtrar:
          </span>
          {['todas', 'Activa', 'Finalizada'].map((est) => (
            <button
              key={est}
              onClick={() => handleCambiarFiltro(est)}
              className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                filtroEstado === est
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              {est === 'todas' ? 'Todas' : est === 'Activa' ? 'Activas' : 'Finalizadas'}
            </button>
          ))}
        </div>

        {/* Lista */}
        <div className="space-y-2.5">
          {loadingModal ? (
            <div className="flex justify-center p-8">
              <Spinner className="text-brand-600 dark:text-brand-400" />
            </div>
          ) : modalSesiones.length === 0 ? (
            <EmptyState title="No se encontraron sesiones" description="Prueba con otro filtro." />
          ) : (
            modalSesiones.map(renderSesion)
          )}
        </div>

        <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-700">
          <Pagination page={paginaActual} totalPages={totalPaginas} onChange={handleCambiarPagina} />
        </div>
      </Modal>
    </div>
  );
};

export default Profile;