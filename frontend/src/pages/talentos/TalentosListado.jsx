import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import DataTable from '../../components/UI/DataTable';
import FilterBar from '../../components/UI/FilterBar';
import { Plus, UploadCloud } from 'lucide-react';

const TalentosListado = () => {
  const [talentos, setTalentos] = useState([]);
  const [filters, setFilters] = useState({});
  const { canEditTalento } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTalentos = async () => {
      try {
        const query = new URLSearchParams(filters).toString();
        const res = await api.get(`/talentos?${query}`);
        setTalentos(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchTalentos();
  }, [filters]);

  const handleDelete = async (row) => {
    if (window.confirm(`¿Eliminar a ${row.nombreCompleto}?`)) {
      try {
        await api.delete(`/talentos/${row.id}`);
        setTalentos(talentos.filter(t => t.id !== row.id));
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Talentos</h1>
        <div className="flex gap-3">
          <Link to="/talentos/cargar-cv" className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
            <UploadCloud size={18} /> Cargar CV
          </Link>
          <Link to="/talentos/nuevo" className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Plus size={18} /> Nuevo
          </Link>
        </div>
      </div>

      <FilterBar 
        filters={[
          { label: 'Especialidad', key: 'especialidad', type: 'text', placeholder: 'Buscar...' },
          { label: 'Estado', key: 'estadoLaboral', type: 'select', options: [
            { label: 'Disponible', value: 'Disponible' },
            { label: 'Empleado', value: 'Empleado' },
            { label: 'Freelance', value: 'Freelance' }
          ]}
        ]}
        onFilterChange={(key, val) => setFilters(prev => ({ ...prev, [key]: val }))}
      />

      <DataTable
        columns={[
          { label: 'Nombre', key: 'nombreCompleto' },
          { label: 'Especialidad', key: 'especialidad' },
          { label: 'Experiencia', render: (row) => `${row.experienciaAnios} años` },
          { label: 'Empresa', render: (row) => row.empresa?.nombre || 'Ninguna' },
          { label: 'Estado', render: (row) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.estadoLaboral === 'Disponible' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'}`}>
              {row.estadoLaboral}
            </span>
          )}
        ]}
        data={talentos}
        onView={(row) => navigate(`/talentos/${row.id}`)}
        onEdit={(row) => canEditTalento(row) ? navigate(`/talentos/${row.id}/editar`) : null}
        onDelete={(row) => canEditTalento(row) ? handleDelete(row) : null}
      />
    </div>
  );
};
export default TalentosListado;
