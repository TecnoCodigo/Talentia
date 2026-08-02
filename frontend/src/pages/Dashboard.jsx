import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import StatsCard from '../components/UI/StatsCard';
import DataTable from '../components/UI/DataTable';
import { Users, Building2, UserCheck, Briefcase } from 'lucide-react';

const Dashboard = () => {
  const { user, hasRole } = useAuth();
  const [stats, setStats] = useState({ talentos: 0, empresas: 0, activos: 0, misTalentos: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const resTalentos = await api.get('/talentos');
        const resEmpresas = await api.get('/empresas');
        const talentos = resTalentos.data;
        
        setStats({
          talentos: talentos.length,
          empresas: resEmpresas.data.length,
          activos: talentos.filter(t => t.estadoLaboral === 'Disponible').length,
          misTalentos: talentos.filter(t => t.registradoPor?.id === user?.id).length
        });
        
        setRecent(talentos.slice(0, 5));
      } catch (e) {
        console.error(e);
      }
    };
    fetchDashboard();
  }, [user]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Hola, {user?.nombre} 👋</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Talentos" value={stats.talentos} icon={Users} colorClass="text-blue-500" bgClass="bg-blue-100 dark:bg-blue-900/30" />
        {hasRole(['Administrador']) && (
          <StatsCard title="Empresas" value={stats.empresas} icon={Building2} colorClass="text-purple-500" bgClass="bg-purple-100 dark:bg-purple-900/30" />
        )}
        <StatsCard title="Talentos Disponibles" value={stats.activos} icon={UserCheck} colorClass="text-green-500" bgClass="bg-green-100 dark:bg-green-900/30" />
        <StatsCard title="Mis Talentos" value={stats.misTalentos} icon={Briefcase} colorClass="text-orange-500" bgClass="bg-orange-100 dark:bg-orange-900/30" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 p-6">
        <h2 className="text-xl font-semibold mb-4">Talentos Añadidos Recientemente</h2>
        <DataTable 
          columns={[
            { label: 'Nombre', key: 'nombreCompleto' },
            { label: 'Especialidad', key: 'especialidad' },
            { label: 'Estado', render: (row) => (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.estadoLaboral === 'Disponible' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'}`}>
                {row.estadoLaboral}
              </span>
            )}
          ]}
          data={recent}
        />
      </div>
    </div>
  );
};

export default Dashboard;
