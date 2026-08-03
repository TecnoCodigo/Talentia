import { z } from 'zod';

const emptyToUndefined = (val) => (val === '' || val === null || val === undefined ? undefined : val);

export const estadoEmpresaEnum = z.enum(['Activa', 'Inactiva']);

export const createEmpresaSchema = z.object({
  nombre: z
    .string({ required_error: 'El nombre de la empresa es obligatorio' })
    .trim()
    .min(1, 'El nombre de la empresa es obligatorio')
    .max(150, 'El nombre no puede exceder 150 caracteres'),

  rif: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(30, 'El RIF no puede exceder 30 caracteres').optional()
  ),

  sector: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(100, 'El sector no puede exceder 100 caracteres').optional()
  ),

  correoContacto: z.preprocess(
    emptyToUndefined,
    z.string().trim().email('El correo de contacto no es válido').max(100, 'El correo no puede exceder 100 caracteres').optional()
  ),

  telefono: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(30, 'El teléfono no puede exceder 30 caracteres').optional()
  ),

  direccion: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(500, 'La dirección no puede exceder 500 caracteres').optional()
  ),

  pais: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(80, 'El país no puede exceder 80 caracteres').optional()
  ),

  ciudad: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(80, 'La ciudad no puede exceder 80 caracteres').optional()
  ),

  responsable: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(150, 'El nombre del responsable no puede exceder 150 caracteres').optional()
  ),

  estado: estadoEmpresaEnum.optional(),
});

export const updateEmpresaSchema = createEmpresaSchema.partial();