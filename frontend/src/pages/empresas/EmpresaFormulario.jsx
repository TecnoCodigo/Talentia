import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axiosInstance';
import Toast from '../../components/UI/Toast';

const EmpresaFormulario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '', descripcion: '', sitioWeb: '',
    industria: '', pais: '', ciudad: ''
  });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (id) {
      api.get(`/empresas/${id}`)
        .then(res => setFormData(res.data))
        .catch(console.error);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/empresas/${id}`, formData);
      } else {
        await api.post('/empresas', formData);
      }
      setToast({ message: 'Empresa guardada', type: 'success' });
      setTimeout(() => navigate('/empresas'), 1500);
    } catch (e) {
      setToast({ message: 'Error al guardar empresa', type: 'error' });
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
      <h2 className="text-xl font-bold mb-6">{id ? 'Editar' : 'Nueva'} Empresa</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input required name="nombre" value={formData.nombre} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Industria</label>
            <input name="industria" value={formData.industria} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sitio Web</label>
            <input type="url" name="sitioWeb" value={formData.sitioWeb} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" />
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
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea name="descripcion" rows="3" value={formData.descripcion} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700"></textarea>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={() => navigate('/empresas')} className="px-4 py-2 border rounded text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">Guardar</button>
        </div>
      </form>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};
export default EmpresaFormulario;
