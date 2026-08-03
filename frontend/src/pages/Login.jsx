import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, ShieldCheck, User, KeyRound } from 'lucide-react';
import { loginSchema } from '../lib/schemas/auth.schema';
import { mapApiErrors, applyServerErrors } from '../lib/mapApiErrors';
import FormField from '../components/UI/FormField';
import Button from '../components/UI/Button';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { usuario: '', clave: '', aceptaTerminos: true },
  });

  const onSubmit = async (values) => {
    try {
      await login(values.usuario, values.clave);
      navigate('/dashboard');
    } catch (err) {
      const mapped = mapApiErrors(err);
      applyServerErrors(setError, mapped);
    }
  };

  const serverError = errors?.root?.serverError?.message;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-brand-900 via-slate-900 to-slate-950 p-4 text-slate-800 sm:p-6">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20">
        <div className="h-[600px] w-[600px] rounded-full border border-brand-400/30 flex items-center justify-center">
          <div className="h-[450px] w-[450px] rounded-full border border-brand-400/30" />
        </div>
      </div>

      <div className="z-10 grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 lg:grid-cols-2">
        <div className="flex flex-col justify-between p-8 sm:p-10">
          <div>
            <div className="mb-1 text-2xl font-bold text-slate-900 dark:text-white">Iniciar Sesión</div>
            <p className="mb-6 text-xs font-medium text-slate-500 dark:text-slate-400">
              Autenticación segura, información en tus manos.
            </p>

            {serverError && (
              <div className="mb-5 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-600 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-300" role="alert">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" aria-hidden="true" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <FormField
                name="usuario"
                label="Usuario o Correo Electrónico"
                error={errors.usuario}
                required
              >
                {(props) => (
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} aria-hidden="true" />
                    <input
                      type="text"
                      placeholder="admin o reclutador"
                      {...register('usuario')}
                      {...props}
                      className="w-full rounded-xl border-0 bg-slate-100/80 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition duration-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                    />
                  </div>
                )}
              </FormField>

              <FormField
                name="clave"
                label="Contraseña"
                error={errors.clave}
                required
              >
                {(props) => (
                  <div className="relative">
                    <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} aria-hidden="true" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      {...register('clave')}
                      {...props}
                      className="w-full rounded-xl border-0 bg-slate-100/80 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition duration-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                    />
                  </div>
                )}
              </FormField>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terminos"
                  {...register('aceptaTerminos')}
                  className="h-4 w-4 cursor-pointer rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor="terminos" className="cursor-pointer select-none text-xs text-slate-500 dark:text-slate-400">
                  Acepto los <span className="font-medium text-brand-600 hover:underline dark:text-brand-400">términos del servicio</span>
                </label>
              </div>
              {errors.aceptaTerminos && (
                <p role="alert" className="-mt-2 text-xs font-medium text-rose-600 dark:text-rose-400">
                  {errors.aceptaTerminos.message}
                </p>
              )}

              <Button type="submit" loading={isSubmitting} icon={ShieldCheck} className="mt-2 w-full py-3 shadow-brand-500/30">
                {isSubmitting ? 'Iniciando Sesión…' : 'Iniciar Sesión'}
              </Button>
            </form>
          </div>
        </div>

        <div className="relative hidden flex-col items-center justify-center border-l border-slate-100 bg-slate-50/60 p-8 dark:border-slate-800 dark:bg-slate-800/40 lg:flex sm:p-10">
          <div className="mb-6 flex items-center justify-center">
            <img src="/logo_full.png" alt="Talentia" className="h-44 w-auto max-w-sm object-contain drop-shadow-md dark:brightness-110" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">Cada Talento es <strong>único</strong> y queremos <strong>valorarlo</strong>.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;