import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Building2 } from 'lucide-react';
import api from '../../api/axiosInstance';
import { createEmpresaSchema, updateEmpresaSchema } from '../../lib/schemas/empresa.schema';
import { mapApiErrors, applyServerErrors } from '../../lib/mapApiErrors';
import FormField from '../../components/ui/FormField';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

const baseFields = {
  nombre: '', rif: '', sector: '', correoContacto: '', telefono: '',
  direccion: '', pais: 'Venezuela', ciudad: '', responsable: '', estado: 'Activa',
};

const EmpresaFormulario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cargandoInicial, setCargandoInicial] = useState(Boolean(id));
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(id ? updateEmpresaSchema : createEmpresaSchema),
    defaultValues: baseFields,
  });

  useEffect(() => {
    if (!id) return;
    api
      .get(`/empresas/${id}`)
      .then((res) => reset({ ...baseFields, ...res.data }))
      .catch(() => toast.error('No se pudo cargar la empresa'))
      .finally(() => setCargandoInicial(false));
  }, [id, reset]);

  const onSubmit = async (values) => {
    try {
      if (id) {
        await api.put(`/empresas/${id}`, values);
      } else {
        await api.post('/empresas', values);
      }
      toast.success('Empresa guardada correctamente');
      navigate('/empresas');
    } catch (err) {
      const mapped = mapApiErrors(err);
      applyServerErrors(setError, mapped);
      if (mapped.root) toast.error(mapped.root);
    }
  };

  const selectClass =
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
        <Building2 size={22} className="text-brand-600 dark:text-brand-400" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{id ? 'Editar' : 'Nueva'} Empresa</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField name="nombre" label="Nombre" error={errors.nombre} required className="md:col-span-2">
            {(props) => (
              <input
                type="text"
                {...register('nombre')}
                {...props}
                className="block w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-brand-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:focus:ring-brand-500"
              />
            )}
          </FormField>

          <FormField name="rif" label="RIF" error={errors.rif} hint="Ej: J-12345678-9">
            {(props) => (
              <input type="text" {...register('rif')} {...props} className="block w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-brand-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:focus:ring-brand-500" />
            )}
          </FormField>

          <FormField name="sector" label="Sector" error={errors.sector}>
            {(props) => (
              <input type="text" {...register('sector')} {...props} className="block w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-brand-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:focus:ring-brand-500" />
            )}
          </FormField>

          <FormField name="correoContacto" label="Correo de contacto" error={errors.correoContacto}>
            {(props) => (
              <input type="email" {...register('correoContacto')} {...props} className="block w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-brand-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:focus:ring-brand-500" />
            )}
          </FormField>

          <FormField name="telefono" label="Teléfono" error={errors.telefono}>
            {(props) => (
              <input type="text" {...register('telefono')} {...props} className="block w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-brand-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:focus:ring-brand-500" />
            )}
          </FormField>

          <FormField name="pais" label="País" error={errors.pais}>
            {(props) => (
              <input type="text" {...register('pais')} {...props} className="block w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-brand-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:focus:ring-brand-500" />
            )}
          </FormField>

          <FormField name="ciudad" label="Ciudad" error={errors.ciudad}>
            {(props) => (
              <input type="text" {...register('ciudad')} {...props} className="block w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-brand-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:focus:ring-brand-500" />
            )}
          </FormField>

          <FormField name="responsable" label="Responsable" error={errors.responsable}>
            {(props) => (
              <input type="text" {...register('responsable')} {...props} className="block w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-brand-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:focus:ring-brand-500" />
            )}
          </FormField>

          <FormField name="estado" label="Estado" error={errors.estado}>
            {(props) => (
              <select {...register('estado')} {...props} className={selectClass}>
                <option value="Activa">Activa</option>
                <option value="Inactiva">Inactiva</option>
              </select>
            )}
          </FormField>

          <FormField name="direccion" label="Dirección" error={errors.direccion} className="md:col-span-2">
            {(props) => (
              <textarea rows={3} {...register('direccion')} {...props} className="block w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-brand-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:focus:ring-brand-500" />
            )}
          </FormField>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t pt-4 dark:border-slate-800">
          <Button type="button" variant="secondary" onClick={() => navigate('/empresas')}>
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

export default EmpresaFormulario;