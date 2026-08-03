import { z } from 'zod';

export const estadoLaboralEnum = z.enum(['Disponible', 'Empleado', 'Freelance', 'No Disponible']);

export const createTalentoSchema = z.object({
  nombreCompleto: z.string({ required_error: 'El nombre completo es obligatorio' }).min(1, 'El nombre completo es obligatorio').max(150, 'El nombre no puede exceder 150 caracteres'),
  correo: z.string().email('El correo no es válido').max(100, 'El correo no puede exceder 100 caracteres').optional().or(z.literal('')),
  telefono: z.string().max(30, 'El teléfono no puede exceder 30 caracteres').optional().or(z.literal('')),
  especialidad: z.string().max(100, 'La especialidad no puede exceder 100 caracteres').optional().or(z.literal('')),
  estadoLaboral: estadoLaboralEnum.optional(),
  pais: z.string().max(80, 'El país no puede exceder 80 caracteres').optional().or(z.literal('')),
  ciudad: z.string().max(80, 'La ciudad no puede exceder 80 caracteres').optional().or(z.literal('')),
  resumen: z.string().optional().or(z.literal('')),
  experienciaAnios: z.coerce.number({ invalid_type_error: 'La experiencia debe ser un número' }).int('La experiencia debe ser un entero').min(0, 'La experiencia no puede ser negativa').optional().or(z.literal(0)),
  urlCv: z.string().url('La URL del CV no es válida').max(500, 'La URL no puede exceder 500 caracteres').optional().or(z.literal('')),
  empresaId: z.coerce.number({ invalid_type_error: 'La empresa debe ser un número' }).int().optional(),
});

export const updateTalentoSchema = createTalentoSchema.partial();