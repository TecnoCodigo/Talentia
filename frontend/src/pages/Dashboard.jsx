import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import StatsCard from '../components/UI/StatsCard';
import DataTable from '../components/UI/DataTable';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import Badge from '../components/ui/Badge';
import { Users, Building2, UserCheck, Briefcase } from 'lucide-react';

const Dashboard = () => {
  const { user, hasRole } = useAuth();
  const [stats, setStats] = useState({ talentos: 0, empresas: 0, activos: 0, misTalentos: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const [resTalentos, resEmpresas] = await Promise.all([
        api.get('/talentos'),
        api.get('/empresas'),
      ]);
      const talentos = resTalentos.data;
      setStats({
        talentos: talentos.length,
        empresas: resEmpresas.data.length,
        activos: talentos.filter((t) => t.estadoLaboral === 'Disponible').length,
        misTalentos: talentos.filter((t) => t.registradoPor?.id === user?.id).length,
      });
      setRecent(talentos.slice(0, 5));
    } catch (err) {
      setError('No se pudo cargar la información del panel.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Hola, {user?.nombre} 👋</h1>

      {error && !loading && (
        <ErrorState title="No se pudo cargar el panel" description={error} onRetry={fetchDashboard} />
      )}

      {loading && !error && (
        <>
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-28 rounded-xl" />
            {hasRole(['Administrador']) && <Skeleton className="h-28 rounded-xl" />}
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
            <Skeleton className="mb-4 h-6 w-1/4" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </>
      )}

      {!loading && !error && (
        <>
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard title="Total Talentos" value={stats.talentos} icon={Users} colorClass="text-blue-500" bgClass="bg-blue-100 dark:bg-blue-900/30" />
            {hasRole(['Administrador']) && (
              <StatsCard title="Empresas" value={stats.empresas} icon={Building2} colorClass="text-purple-500" bgClass="bg-purple-100 dark:bg-purple-900/30" />
            )}
            <StatsCard title="Talentos Disponibles" value={stats.activos} icon={UserCheck} colorClass="text-green-500" bgClass="bg-green-100 dark:bg-green-900/30" />
            <StatsCard title="Mis Talentos" value={stats.misTalentos} icon={Briefcase} colorClass="text-orange-500" bgClass="bg-orange-100 dark:bg-orange-900/30" />
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
            <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">Talentos Añadidos Recientemente</h2>
            <DataTable
              columns={[
                { label: 'Nombre', key: 'nombreCompleto' },
                { label: 'Especialidad', key: 'especialidad' },
                {
                  label: 'Estado',
                  render: (row) => (
                    <Badge tone={row.estadoLaboral === 'Disponible' ? 'success' : 'neutral'}>
                      {row.estadoLaboral}
                    </Badge>
                  ),
                },
              ]}
              data={recent}
              emptyMessage="Aún no hay talentos registrados"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;