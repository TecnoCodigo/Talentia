import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import Toast from '../../components/UI/Toast';

const ReclutadorFormulario = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '', usuario: '', correo: '', telefono: '', clave: '', empresaId: ''
  });
  const [empresas, setEmpresas] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    api.get('/empresas').then(res => setEmpresas(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', {
        ...formData,
        rol: 'Reclutador'
      });
      
      const newUserId = res.data.id;

      if (formData.empresaId) {
        await api.post('/asignaciones', {
          usuarioId: newUserId,
          empresaId: Number(formData.empresaId)
        });
      }

      setToast({ message: 'Reclutador registrado y asignado', type: 'success' });
      setTimeout(() => navigate('/reclutadores'), 1500);
    } catch (e) {
      setToast({ message: e.response?.data?.message || 'Error al registrar', type: 'error' });
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
      <h2 className="text-xl font-bold mb-6">Nuevo Reclutador</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre Completo</label>
            <input required name="nombre" value={formData.nombre} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Usuario</label>
            <input required name="usuario" value={formData.usuario} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Correo Electrónico</label>
            <input required type="email" name="correo" value={formData.correo} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input name="telefono" value={formData.telefono} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contraseña Inicial</label>
            <input required type="password" name="clave" value={formData.clave} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Asignar a Empresa (Opcional)</label>
            <select name="empresaId" value={formData.empresaId} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700">
              <option value="">No asignar de inmediato</option>
              {empresas.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={() => navigate('/reclutadores')} className="px-4 py-2 border rounded text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">Registrar</button>
        </div>
      </form>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};
export default ReclutadorFormulario;
