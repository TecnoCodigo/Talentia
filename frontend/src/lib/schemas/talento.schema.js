import { z } from 'zod';

const emptyToUndefined = (val) => (val === '' || val === null || val === undefined ? undefined : val);

export const estadoLaboralEnum = z.enum(['Disponible', 'Empleado', 'Freelance', 'No Disponible']);

export const createTalentoSchema = z.object({
  nombreCompleto: z
    .string({ required_error: 'El nombre completo es obligatorio' })
    .trim()
    .min(1, 'El nombre completo es obligatorio')
    .max(150, 'El nombre no puede exceder 150 caracteres'),

  correo: z.preprocess(
    emptyToUndefined,
    z.string().trim().email('El correo electrónico no es válido').max(100, 'El correo no puede exceder 100 caracteres').optional()
  ),

  telefono: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(30, 'El teléfono no puede exceder 30 caracteres').optional()
  ),

  especialidad: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(100, 'La especialidad no puede exceder 100 caracteres').optional()
  ),

  estadoLaboral: estadoLaboralEnum.optional(),

  pais: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(80, 'El país no puede exceder 80 caracteres').optional()
  ),

  ciudad: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(80, 'La ciudad no puede exceder 80 caracteres').optional()
  ),

  resumen: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(1000, 'El resumen no puede exceder 1000 caracteres').optional()
  ),

  experienciaAnios: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? 0 : Number(val)),
    z
      .number({ invalid_type_error: 'Los años de experiencia deben ser un número entero' })
      .int('Los años de experiencia deben ser un número entero')
      .min(0, 'Los años de experiencia no pueden ser negativos')
      .optional()
  ),

  urlCv: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(500, 'La URL no puede exceder 500 caracteres').optional()
  ),

  empresaId: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number({ invalid_type_error: 'La empresa seleccionada no es válida' }).int().optional()
  ),
});

export const updateTalentoSchema = createTalentoSchema.partial();