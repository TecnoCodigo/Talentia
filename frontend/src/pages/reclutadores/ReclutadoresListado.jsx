import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import DataTable from '../../components/UI/DataTable';
import { Plus } from 'lucide-react';
import Toast from '../../components/UI/Toast';

const ReclutadoresListado = () => {
  const [reclutadores, setReclutadores] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchReclutadores();
  }, []);

  const fetchReclutadores = async () => {
    try {
      const res = await api.get('/usuarios');
      setReclutadores(res.data.filter(u => u.rol === 'Reclutador'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleEstado = async (row) => {
    try {
      const newEstado = row.estado === 'Activo' ? 'Inactivo' : 'Activo';
      await api.patch(`/usuarios/${row.id}/estado`, { estado: newEstado });
      setToast({ message: `Estado cambiado a ${newEstado}`, type: 'success' });
      fetchReclutadores();
    } catch (e) {
      setToast({ message: 'Error al cambiar estado', type: 'error' });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reclutadores</h1>
        <Link to="/reclutadores/nuevo" className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Plus size={18} /> Nuevo Reclutador
        </Link>
      </div>

      <DataTable
        columns={[
          { label: 'Nombre', key: 'nombre' },
          { label: 'Usuario', key: 'usuario' },
          { label: 'Correo', key: 'correo' },
          { label: 'Estado', render: (row) => (
            <button 
              onClick={() => handleToggleEstado(row)}
              className={`px-3 py-1 rounded-full text-xs font-medium hover:opacity-80 transition-opacity ${row.estado === 'Activo' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}
              title="Clic para cambiar estado"
            >
              {row.estado}
            </button>
          )}
        ]}
        data={reclutadores}
      />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};
export default ReclutadoresListado;
