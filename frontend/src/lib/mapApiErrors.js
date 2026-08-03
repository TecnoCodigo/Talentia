// Mapea los errores de validación del backend (class-validator) a un objeto { campo: mensaje }
// para poblar los errores field-level de react-hook-form vía setError.
//
// Formatos soportados:
//   - Array: [{ property, message }, ...]  (class-validator ValidationPipe con forbidNonWhitelisted)
//   - Array de strings: ['msg1', 'msg2']
//   - Objeto: { message: 'msg' } | { message: ['msg1','msg2'] }
//   - String plano
export function mapApiErrors(error) {
  const out = {};
  const data = error?.response?.data;
  if (!data) return { root: extractMessage(error) || 'Error inesperado' };

  // Array de errores de class-validator
  if (Array.isArray(data)) {
    data.forEach((item) => {
      if (item && typeof item === 'object' && item.property) {
        const msg = Array.isArray(item.constraints)
          ? item.constraints.join(', ')
          : typeof item.constraints === 'object' && item.constraints
            ? Object.values(item.constraints).join(', ')
            : item.message || 'Valor inválido';
        out[item.property] = msg;
      } else if (typeof item === 'string') {
        out.root = (out.root ? out.root + '; ' : '') + item;
      }
    });
    if (Object.keys(out).length === 0) out.root = 'Error de validación';
    return out;
  }

  // Objeto con message (string o array)
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const msg = data.message;
    if (Array.isArray(msg)) {
      // Algunos mensajes de Nest vienen como array de strings
      out.root = msg.join('; ');
    } else if (typeof msg === 'string') {
      out.root = msg;
    } else if (typeof msg === 'object' && msg !== null) {
      // { campo: 'mensaje', ... }
      Object.entries(msg).forEach(([k, v]) => {
        out[k] = Array.isArray(v) ? v.join(', ') : String(v);
      });
    } else {
      out.root = 'Error inesperado';
    }
    return out;
  }

  // String plano
  if (typeof data === 'string') {
    out.root = data;
    return out;
  }

  out.root = 'Error inesperado';
  return out;
}

function extractMessage(error) {
  if (!error) return null;
  if (typeof error.message === 'string') return error.message;
  return null;
}

// Aplica los errores mapeados a un form de react-hook-form.
// `setError` es el método de RHF. Las claves que no correspondan a un campo
// del form (p.ej. "root") se setearán como error global en `root.serverError`.
export function applyServerErrors(setError, mapped) {
  Object.entries(mapped).forEach(([field, message]) => {
    if (field === 'root' || field === 'root.serverError') {
      setError('root.serverError', { type: 'server', message });
    } else {
      setError(field, { type: 'server', message });
    }
  });
}