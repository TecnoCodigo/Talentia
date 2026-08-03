import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { IMaskInput } from 'react-imask';
import toast from 'react-hot-toast';
import { UserCircle } from 'lucide-react';
import api from '../../api/axiosInstance';
import { createTalentoSchema, updateTalentoSchema } from '../../lib/schemas/talento.schema';
import { mapApiErrors, applyServerErrors } from '../../lib/mapApiErrors';
import FormField from '../../components/ui/FormField';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

const baseFields = {
  nombreCompleto: '', correo: '', telefono: '', especialidad: '',
  estadoLaboral: 'Disponible', pais: 'Venezuela', ciudad: '',
  resumen: '', experienciaAnios: 0, urlCv: '', empresaId: '',
};

const TalentoFormulario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [empresas, setEmpresas] = useState([]);
  const [cargandoInicial, setCargandoInicial] = useState(Boolean(id));
  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(id ? updateTalentoSchema : createTalentoSchema),
    defaultValues: baseFields,
  });

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const empRes = await api.get('/empresas');
        setEmpresas(empRes.data);
        if (id) {
          const res = await api.get(`/talentos/${id}`);
          reset({ ...baseFields, ...res.data, empresaId: res.data.empresa?.id || '' });
        } else if (state && state.prefilled) {
          reset({ ...baseFields, ...state.prefilled });
        }
      } catch {
        toast.error('No se pudo cargar la información');
      } finally {
        setCargandoInicial(false);
      }
    };
    fetchInit();
  }, [id, state, reset]);

  const onSubmit = async (values) => {
    try {
      const payload = { ...values };
      if (!payload.empresaId) delete payload.empresaId;
      if (id) {
        await api.put(`/talentos/${id}`, payload);
      } else {
        await api.post('/talentos', payload);
      }
      toast.success('Talento guardado correctamente');
      navigate('/talentos');
    } catch (err) {
      const mapped = mapApiErrors(err);
      applyServerErrors(setError, mapped);
      if (mapped.root) toast.error(mapped.root);
    }
  };

  const inputClass =
    'block w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-brand-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:focus:ring-brand-500';
  const selectClass = inputClass;

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
        <UserCircle size={22} className="text-brand-600 dark:text-brand-400" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{id ? 'Editar' : 'Nuevo'} Talento</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField name="nombreCompleto" label="Nombre Completo" error={errors.nombreCompleto} required className="md:col-span-2">
            {(props) => <input type="text" {...register('nombreCompleto')} {...props} className={inputClass} />}
          </FormField>

          <FormField name="correo" label="Correo" error={errors.correo}>
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

          <FormField name="especialidad" label="Especialidad" error={errors.especialidad}>
            {(props) => <input type="text" {...register('especialidad')} {...props} className={inputClass} />}
          </FormField>

          <FormField name="experienciaAnios" label="Años de Experiencia" error={errors.experienciaAnios}>
            {(props) => <input type="number" min="0" step="1" {...register('experienciaAnios')} {...props} className={inputClass} />}
          </FormField>

          <FormField name="estadoLaboral" label="Estado Laboral" error={errors.estadoLaboral}>
            {(props) => (
              <select {...register('estadoLaboral')} {...props} className={selectClass}>
                <option value="Disponible">Disponible</option>
                <option value="Empleado">Empleado</option>
                <option value="Freelance">Freelance</option>
                <option value="No Disponible">No Disponible</option>
              </select>
            )}
          </FormField>

          <FormField name="pais" label="País" error={errors.pais}>
            {(props) => <input type="text" {...register('pais')} {...props} className={inputClass} />}
          </FormField>

          <FormField name="ciudad" label="Ciudad" error={errors.ciudad}>
            {(props) => <input type="text" {...register('ciudad')} {...props} className={inputClass} />}
          </FormField>

          <FormField name="empresaId" label="Empresa Asociada" error={errors.empresaId} className="md:col-span-2">
            {(props) => (
              <select {...register('empresaId')} {...props} className={selectClass}>
                <option value="">Ninguna (Pool general)</option>
                {empresas.map((e) => (
                  <option key={e.id} value={e.id}>{e.nombre}</option>
                ))}
              </select>
            )}
          </FormField>

          <FormField name="resumen" label="Resumen" error={errors.resumen} className="md:col-span-2">
            {(props) => <textarea rows={3} {...register('resumen')} {...props} className={inputClass} />}
          </FormField>

          <FormField name="urlCv" label="URL CV (Cloudflare R2)" error={errors.urlCv} className="md:col-span-2" hint="Se autocompleta al cargar un PDF">
            {(props) => (
              <input type="url" readOnly {...register('urlCv')} {...props} className={`${inputClass} bg-slate-50 text-slate-500 dark:bg-slate-800/50`} />
            )}
          </FormField>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t pt-4 dark:border-slate-800">
          <Button type="button" variant="secondary" onClick={() => navigate('/talentos')}>
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isSubmitting ? 'Guardando…' : 'Guardar'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TalentoFormulario;