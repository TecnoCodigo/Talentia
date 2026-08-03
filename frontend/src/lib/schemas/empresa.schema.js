import { z } from 'zod';

export const estadoEmpresaEnum = z.enum(['Activa', 'Inactiva']);

export const createEmpresaSchema = z.object({
  nombre: z.string({ required_error: 'El nombre es obligatorio' }).min(1, 'El nombre es obligatorio').max(150, 'El nombre no puede exceder 150 caracteres'),
  rif: z.string().max(30, 'El RIF no puede exceder 30 caracteres').optional().or(z.literal('')),
  sector: z.string().max(100, 'El sector no puede exceder 100 caracteres').optional().or(z.literal('')),
  correoContacto: z.string().email('El correo no es válido').max(100, 'El correo no puede exceder 100 caracteres').optional().or(z.literal('')),
  telefono: z.string().max(30, 'El teléfono no puede exceder 30 caracteres').optional().or(z.literal('')),
  direccion: z.string().optional().or(z.literal('')),
  pais: z.string().max(80, 'El país no puede exceder 80 caracteres').optional().or(z.literal('')),
  ciudad: z.string().max(80, 'La ciudad no puede exceder 80 caracteres').optional().or(z.literal('')),
  responsable: z.string().max(150, 'El responsable no puede exceder 150 caracteres').optional().or(z.literal('')),
  estado: estadoEmpresaEnum.optional(),
});

export const updateEmpresaSchema = createEmpresaSchema.partial();