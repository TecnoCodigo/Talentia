import { z } from 'zod';

export const asignarReclutadorSchema = z.object({
  usuarioId: z.coerce.number({ invalid_type_error: 'El reclutador es obligatorio' }).int().positive('El reclutador es obligatorio'),
  empresaId: z.coerce.number({ invalid_type_error: 'La empresa es obligatoria' }).int().positive('La empresa es obligatoria'),
});

const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/;

export const registerReclutadorSchema = z.object({
  usuario: z.string({ required_error: 'El usuario es obligatorio' }).min(1, 'El usuario es obligatorio').max(50, 'El usuario no puede exceder 50 caracteres'),
  clave: z.string({ required_error: 'La contraseña es obligatoria' }).min(8, 'La contraseña debe tener al menos 8 caracteres').max(255, 'La contraseña no puede exceder 255 caracteres').regex(passwordRegex, 'La contraseña debe contener al menos una mayúscula, un número y un carácter especial'),
  nombre: z.string({ required_error: 'El nombre es obligatorio' }).min(1, 'El nombre es obligatorio').max(100, 'El nombre no puede exceder 100 caracteres'),
  correo: z.string({ required_error: 'El correo es obligatorio' }).email('El correo no es válido').max(100, 'El correo no puede exceder 100 caracteres'),
  telefono: z.string().max(20, 'El teléfono no puede exceder 20 caracteres').optional().or(z.literal('')),
  rol: z.enum(['Reclutador']).optional(),
});

export const updateReclutadorSchema = z.object({
  usuario: z.string().min(1).max(50).optional(),
  nombre: z.string().min(1).max(100).optional(),
  correo: z.string().email('El correo no es válido').max(100).optional().or(z.literal('')),
  telefono: z.string().max(20).optional().or(z.literal('')),
  clave: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').max(255).regex(passwordRegex, 'La contraseña debe contener al menos una mayúscula, un número y un carácter especial').optional().or(z.literal('')),
  estado: z.enum(['Activo', 'Inactivo']).optional(),
});