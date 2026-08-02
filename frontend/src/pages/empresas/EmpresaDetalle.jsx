import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { Building2, Globe, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const EmpresaDetalle = () => {
  const { id } = useParams();
  const [empresa, setEmpresa] = useState(null);
  const { hasRole } = useAuth();

  useEffect(() => {
    api.get(`/empresas/${id}`).then(res => setEmpresa(res.data)).catch(console.error);
  }, [id]);

  if (!empresa) return <div>Cargando...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden p-6">
        <div className="flex justify-between items-start mb-6 border-b pb-6 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg flex items-center justify-center">
              <Building2 size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{empresa.nombre}</h1>
              <p className="text-slate-500">{empresa.industria || 'Industria no especificada'}</p>
            </div>
          </div>
          {hasRole(['Administrador']) && (
            <Link to={`/empresas/${id}/editar`} className="px-4 py-2 border rounded-lg hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
              Editar
            </Link>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Descripción</h3>
            <p className="text-slate-600 dark:text-slate-400">{empresa.descripcion || 'Sin descripción'}</p>
          </div>
          <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-lg">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <Globe size={18} />
              {empresa.sitioWeb ? <a href={empresa.sitioWeb} className="text-cyan-600 hover:underline">{empresa.sitioWeb}</a> : 'No especificado'}
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <MapPin size={18} />
              {empresa.ciudad || empresa.pais ? `${empresa.ciudad || ''}, ${empresa.pais || ''}` : 'Ubicación no especificada'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EmpresaDetalle;
