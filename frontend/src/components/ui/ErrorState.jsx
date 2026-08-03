import { AlertTriangle } from 'lucide-react';
import Button from './Button';
import { cn } from '../../lib/utils';

export default function ErrorState({
  title = 'Algo salió mal',
  description = 'No pudimos cargar la información.',
  onRetry,
  className = '',
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-12 text-center', className)}>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
        <AlertTriangle size={28} aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}