import { useId } from 'react';
import { cn } from '../../lib/utils';

// Wrapper que encapsula label + control + error field-level accesible.
// `register` es el método de react-hook-form. `error` es el objeto errors[field] de RHF.
// `render` es una función (props) => JSX que recibe { id, name, ariaInvalid, ariaDescribedBy, className }
// y debe aplicarlo al control interno (input/textarea/select/IMaskInput/Controller).
export default function FormField({
  name,
  label,
  error,
  hint,
  required = false,
  className = '',
  children,
}) {
  const generatedId = useId();
  const id = generatedId;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  const hasError = Boolean(error);

  const passThrough = {
    id,
    name,
    'aria-invalid': hasError || undefined,
    'aria-describedby': describedBy,
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      {typeof children === 'function' ? children(passThrough) : children}
      {hint && !hasError && (
        <p id={hintId} className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      )}
      {hasError && (
        <p id={errorId} role="alert" className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
          {typeof error === 'string' ? error : error?.message}
        </p>
      )}
    </div>
  );
}