import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { User, Mail, Phone, MapPin, Briefcase, FileText, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TalentoDetalle = () => {
  const { id } = useParams();
  const [talento, setTalento] = useState(null);
  const { canEditTalento } = useAuth();

  useEffect(() => {
    const fetchTalento = async () => {
      try {
        const res = await api.get(`/talentos/${id}`);
        setTalento(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchTalento();
  }, [id]);

  if (!talento) return <div>Cargando...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">
        <div className="p-6 sm:p-10 border-b border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-3xl text-white font-bold shadow-md">
                {talento.nombreCompleto.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{talento.nombreCompleto}</h1>
                <p className="text-cyan-600 dark:text-cyan-400 font-medium">{talento.especialidad || 'Sin especialidad definida'}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><MapPin size={14} /> {talento.ciudad ? `${talento.ciudad}, ` : ''}{talento.pais}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${talento.estadoLaboral === 'Disponible' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                    {talento.estadoLaboral}
                  </span>
                </div>
              </div>
            </div>
            {canEditTalento(talento) && (
              <Link to={`/talentos/${id}/editar`} className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
                Editar
              </Link>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-slate-200 dark:border-slate-800">
          <div className="p-6 md:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3"><User size={18} /> Acerca de</h3>
              <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{talento.resumen || 'No hay resumen disponible.'}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3"><Briefcase size={18} /> Experiencia y Empresa</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li><span className="font-medium text-slate-900 dark:text-white">Años de experiencia:</span> {talento.experienciaAnios} años</li>
                <li><span className="font-medium text-slate-900 dark:text-white">Empresa Asociada:</span> {talento.empresa?.nombre || 'Ninguna'}</li>
                <li><span className="font-medium text-slate-900 dark:text-white">Registrado por:</span> {talento.registradoPor?.nombre || 'Desconocido'}</li>
              </ul>
            </div>
          </div>
          
          <div className="p-6 space-y-6 bg-slate-50 dark:bg-slate-800/30">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3"><Mail size={18} /> Contacto</h3>
              <ul className="space-y-3">
                {talento.correo && (
                  <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Mail size={16} className="text-slate-400" />
                    <a href={`mailto:${talento.correo}`} className="hover:text-cyan-600">{talento.correo}</a>
                  </li>
                )}
                {talento.telefono && (
                  <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Phone size={16} className="text-slate-400" />
                    <a href={`tel:${talento.telefono}`} className="hover:text-cyan-600">{talento.telefono}</a>
                  </li>
                )}
              </ul>
            </div>
            
            {talento.urlCv && (
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-3"><FileText size={18} /> Currículum</h3>
                <a href={talento.urlCv} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors font-medium">
                  <Download size={18} /> Descargar PDF
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
