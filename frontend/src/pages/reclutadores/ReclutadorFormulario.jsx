import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { IMaskInput } from 'react-imask';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';
import api from '../../api/axiosInstance';
import { registerReclutadorSchema, asignarReclutadorSchema } from '../../lib/schemas/reclutador.schema';
import { mapApiErrors, applyServerErrors } from '../../lib/mapApiErrors';
import FormField from '../../components/ui/FormField';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

const ReclutadorFormulario = () => {
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState([]);
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerReclutadorSchema),
    defaultValues: {
      nombre: '', usuario: '', correo: '', telefono: '', clave: '', empresaId: '',
    },
  });

  useEffect(() => {
    api
      .get('/empresas')
      .then((res) => setEmpresas(res.data))
      .catch(() => toast.error('No se pudo cargar la lista de empresas'))
      .finally(() => setCargandoInicial(false));
  }, []);

  const onSubmit = async (values) => {
    try {
      const { empresaId, ...userPayload } = values;
      const res = await api.post('/auth/register', { ...userPayload, rol: 'Reclutador' });
      const newUserId = res.data.id;

      if (empresaId) {
        const parsed = asignarReclutadorSchema.safeParse({
          usuarioId: newUserId,
          empresaId: Number(empresaId),
        });
        if (parsed.success) {
          try {
            await api.post('/asignaciones', parsed.data);
          } catch {
            toast.success('Reclutador creado, pero no se pudo asignar a la empresa. Puedes intentarlo desde el listado.');
            navigate('/reclutadores');
            return;
          }
        }
      }

      toast.success('Reclutador registrado y asignado');
      navigate('/reclutadores');
    } catch (err) {
      const mapped = mapApiErrors(err);
      applyServerErrors(setError, mapped);
      if (mapped.root) toast.error(mapped.root);
    }
  };

  const inputClass =
    'block w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-brand-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:focus:ring-brand-500';

  if (cargandoInicial) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="xl" className="text-brand-600 dark:text-brand-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
      <div className="mb-6 flex items-center gap-2">
        <UserPlus size={22} className="text-brand-600 dark:text-brand-400" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Nuevo Reclutador</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField name="nombre" label="Nombre Completo" error={errors.nombre} required>
            {(props) => <input type="text" {...register('nombre')} {...props} className={inputClass} />}
          </FormField>

          <FormField name="usuario" label="Usuario" error={errors.usuario} required>
            {(props) => <input type="text" {...register('usuario')} {...props} className={inputClass} />}
          </FormField>

          <FormField name="correo" label="Correo Electrónico" error={errors.correo} required>
            {(props) => <input type="email" {...register('correo')} {...props} className={inputClass} />}
          </FormField>

          <FormField name="telefono" label="Teléfono" error={errors.telefono}>
            {(props) => (
              <Controller
                control={control}
                name="telefono"
                render={({ field }) => (
                  <IMaskInput
                    mask="+{58} (000) 000-0000"
                    unmask={false}
                    value={field.value}
                    onAccept={field.onChange}
                    placeholder="+58 (412) 123-4567"
                    {...props}
                    className={inputClass}
                  />
                )}
              />
            )}
          </FormField>

          <FormField
            name="clave"
            label="Contraseña Inicial"
            error={errors.clave}
            required
            hint="Mínimo 8 caracteres, una mayúscula, un número y un carácter especial"
            className="md:col-span-2"
          >
            {(props) => <input type="password" {...register('clave')} {...props} className={inputClass} />}
          </FormField>

          <FormField name="empresaId" label="Asignar a Empresa (Opcional)" error={errors.empresaId} className="md:col-span-2">
            {(props) => (
              <select {...register('empresaId')} {...props} className={inputClass}>
                <option value="">No asignar de inmediato</option>
                {empresas.map((e) => (
                  <option key={e.id} value={e.id}>{e.nombre}</option>
                ))}
              </select>
            )}
          </FormField>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t pt-4 dark:border-slate-800">
          <Button type="button" variant="secondary" onClick={() => navigate('/reclutadores')}>
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isSubmitting ? 'Registrando…' : 'Registrar'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReclutadorFormulario;