import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../../api/axiosInstance';
import Toast from '../../components/UI/Toast';

const TalentoFormulario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation(); // To receive pre-filled data from CargarCV

  const [formData, setFormData] = useState({
    nombreCompleto: '', correo: '', telefono: '', especialidad: '',
    estadoLaboral: 'Disponible', pais: 'Venezuela', ciudad: '', 
    resumen: '', experienciaAnios: 0, urlCv: '', empresaId: ''
  });
  const [empresas, setEmpresas] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const empRes = await api.get('/empresas');
        setEmpresas(empRes.data);
        if (id) {
          const res = await api.get(`/talentos/${id}`);
          const data = res.data;
          setFormData({
            ...data,
            empresaId: data.empresa?.id || ''
          });
        } else if (state && state.prefilled) {
          setFormData(prev => ({ ...prev, ...state.prefilled }));
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchInit();
  }, [id, state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, experienciaAnios: Number(formData.experienciaAnios) };
      if (!payload.empresaId) delete payload.empresaId;
      
      if (id) {
        await api.put(`/talentos/${id}`, payload);
      } else {
        await api.post('/talentos', payload);
      }
      setToast({ message: 'Talento guardado correctamente', type: 'success' });
      setTimeout(() => navigate('/talentos'), 1500);
    } catch (e) {
      setToast({ message: e.response?.data?.message || 'Error al guardar', type: 'error' });
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
      <h2 className="text-xl font-bold mb-6">{id ? 'Editar' : 'Nuevo'} Talento</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre Completo</label>
            <input required name="nombreCompleto" value={formData.nombreCompleto} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Correo</label>
            <input type="email" name="correo" value={formData.correo} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input name="telefono" value={formData.telefono} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Especialidad</label>
            <input name="especialidad" value={formData.especialidad} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Años de Experiencia</label>
            <input type="number" min="0" name="experienciaAnios" value={formData.experienciaAnios} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Estado Laboral</label>
            <select name="estadoLaboral" value={formData.estadoLaboral} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700">
              <option value="Disponible">Disponible</option>
              <option value="Empleado">Empleado</option>
              <option value="Freelance">Freelance</option>
              <option value="No Disponible">No Disponible</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">País</label>
            <input name="pais" value={formData.pais} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ciudad</label>
            <input name="ciudad" value={formData.ciudad} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Empresa Asociada</label>
            <select name="empresaId" value={formData.empresaId} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700">
              <option value="">Ninguna</option>
              {empresas.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Resumen</label>
            <textarea name="resumen" rows="3" value={formData.resumen} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700"></textarea>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">URL CV (Cloudflare R2)</label>
            <input name="urlCv" value={formData.urlCv} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 text-slate-500" readOnly />
            <span className="text-xs text-slate-500">Este campo se llena automáticamente al cargar un PDF.</span>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={() => navigate('/talentos')} className="px-4 py-2 border rounded text-slate-700 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">Guardar</button>
        </div>
      </form>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};
export default TalentoFormulario;
