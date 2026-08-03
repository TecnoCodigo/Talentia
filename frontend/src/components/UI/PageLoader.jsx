import Spinner from './Spinner';
import { cn } from '../../lib/utils';

export default function PageLoader({ className = '', label = 'Cargando…' }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-16', className)} role="status" aria-live="polite">
      <Spinner size="xl" className="text-brand-600 dark:text-brand-400" />
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  );
}