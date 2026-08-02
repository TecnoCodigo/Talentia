import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import DataTable from '../../components/UI/DataTable';
import { useAuth } from '../../context/AuthContext';
import { Plus } from 'lucide-react';

const EmpresasListado = () => {
  const [empresas, setEmpresas] = useState([]);
  const { hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const res = await api.get('/empresas');
        setEmpresas(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchEmpresas();
  }, []);

  const handleDelete = async (row) => {
    if (window.confirm(`¿Eliminar la empresa ${row.nombre}?`)) {
      try {
        await api.delete(`/empresas/${row.id}`);
        setEmpresas(empresas.filter(e => e.id !== row.id));
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Empresas</h1>
        {hasRole(['Administrador']) && (
          <Link to="/empresas/nueva" className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Plus size={18} /> Nueva Empresa
          </Link>
        )}
      </div>

      <DataTable
        columns={[
          { label: 'Nombre', key: 'nombre' },
          { label: 'Industria', key: 'industria' },
          { label: 'Ubicación', render: (row) => `${row.ciudad || ''} ${row.pais || ''}` },
          { label: 'Sitio Web', render: (row) => row.sitioWeb ? <a href={row.sitioWeb} target="_blank" rel="noreferrer" className="text-cyan-600 hover:underline">{row.sitioWeb}</a> : '-' },
        ]}
        data={empresas}
        onView={(row) => navigate(`/empresas/${row.id}`)}
        onEdit={hasRole(['Administrador']) ? (row) => navigate(`/empresas/${row.id}/editar`) : null}
        onDelete={hasRole(['Administrador']) ? handleDelete : null}
      />
    </div>
  );
};
export default EmpresasListado;
