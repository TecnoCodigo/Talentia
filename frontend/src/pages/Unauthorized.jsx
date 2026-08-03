import { Link } from 'react-router-dom';
import { ShieldOff, Home } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function Unauthorized() {
  const { user } = useAuth();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center dark:bg-slate-950">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
        <ShieldOff size={40} aria-hidden="true" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Acceso restringido</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        {user
          ? `Hola ${user.nombre}, no tienes permisos para acceder a esta sección. Si crees que es un error, contacta al administrador.`
          : 'No tienes permisos para acceder a esta sección.'}
      </p>
      <Link to="/dashboard" className="mt-6">
        <Button icon={Home}>Volver al panel</Button>
      </Link>
    </div>
  );
}