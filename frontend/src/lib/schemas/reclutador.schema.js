import { z } from 'zod';

const emptyToUndefined = (val) => (val === '' || val === null || val === undefined ? undefined : val);

export const asignarReclutadorSchema = z.object({
  usuarioId: z.coerce.number({ invalid_type_error: 'El reclutador es obligatorio' }).int().positive('El reclutador es obligatorio'),
  empresaId: z.coerce.number({ invalid_type_error: 'La empresa es obligatoria' }).int().positive('La empresa es obligatoria'),
});

const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/;

export const registerReclutadorSchema = z.object({
  usuario: z
    .string({ required_error: 'El nombre de usuario es obligatorio' })
    .trim()
    .min(1, 'El nombre de usuario es obligatorio')
    .max(50, 'El usuario no puede exceder 50 caracteres'),

  clave: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(255, 'La contraseña no puede exceder 255 caracteres')
    .regex(passwordRegex, 'La contraseña debe contener al menos una mayúscula, un número y un carácter especial'),

  nombre: z
    .string({ required_error: 'El nombre completo es obligatorio' })
    .trim()
    .min(1, 'El nombre completo es obligatorio')
    .max(100, 'El nombre no puede exceder 100 caracteres'),

  correo: z
    .string({ required_error: 'El correo electrónico es obligatorio' })
    .trim()
    .email('El correo electrónico no es válido')
    .max(100, 'El correo no puede exceder 100 caracteres'),

  telefono: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(20, 'El teléfono no puede exceder 20 caracteres').optional()
  ),

  empresaIds: z.array(z.coerce.number()).optional().default([]),

  rol: z.enum(['Reclutador']).optional(),
});

export const updateReclutadorSchema = z.object({
  usuario: z.preprocess(
    emptyToUndefined,
    z.string().trim().min(1, 'El usuario no puede estar vacío').max(50, 'El usuario no puede exceder 50 caracteres').optional()
  ),

  nombre: z.preprocess(
    emptyToUndefined,
    z.string().trim().min(1, 'El nombre no puede estar vacío').max(100, 'El nombre no puede exceder 100 caracteres').optional()
  ),

  correo: z.preprocess(
    emptyToUndefined,
    z.string().trim().email('El correo electrónico no es válido').max(100, 'El correo no puede exceder 100 caracteres').optional()
  ),

  telefono: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(20, 'El teléfono no puede exceder 20 caracteres').optional()
  ),

  clave: z.preprocess(
    emptyToUndefined,
    z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').max(255, 'La contraseña no puede exceder 255 caracteres').regex(passwordRegex, 'La contraseña debe contener al menos una mayúscula, un número y un carácter especial').optional()
  ),

  estado: z.enum(['Activo', 'Inactivo']).optional(),
});