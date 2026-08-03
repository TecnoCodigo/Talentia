import { useEffect, useState } from 'react';

// Devuelve el valor tras `delay` ms sin cambios. Útil para inputs de búsqueda
// para no disparar una petición HTTP por cada tecla.
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handle);
  }, [value, delay]);

  return debounced;
}