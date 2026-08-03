import { forwardRef } from 'react';
import { useId } from 'react';
import { cn } from '../../lib/utils';

const baseInput =
  'block w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:placeholder:text-slate-500 dark:focus:ring-brand-500';

const Input = forwardRef(function Input(
  {
    label,
    name,
    error,
    hint,
    icon: Icon,
    type = 'text',
    className = '',
    id,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  const hasError = Boolean(error);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400',
              hasError && 'text-rose-400',
            )}
          />
        )}
        <input
          ref={ref}
          id={inputId}
          name={name || inputId}
          type={type}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          className={cn(
            baseInput,
            Icon && 'pl-10',
            hasError
              ? 'ring-rose-500 focus:ring-rose-500'
              : 'ring-slate-300 focus:ring-brand-600 dark:ring-slate-700',
            className,
          )}
          {...props}
        />
      </div>
      {hint && !hasError && (
        <p id={hintId} className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      )}
      {hasError && (
        <p id={errorId} role="alert" className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;