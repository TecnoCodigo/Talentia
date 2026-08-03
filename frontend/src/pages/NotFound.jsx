import { Link } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';
import Button from '../components/UI/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center dark:bg-slate-950">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
        <FileQuestion size={40} aria-hidden="true" />
      </div>
      <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white">404</h1>
      <p className="mt-2 text-lg font-semibold text-slate-700 dark:text-slate-200">Página no encontrada</p>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        La página que buscas no existe o fue movida. Verifica la URL o vuelve al inicio.
      </p>
      <Link to="/dashboard" className="mt-6">
        <Button icon={Home}>Volver al inicio</Button>
      </Link>
    </div>
  );
}