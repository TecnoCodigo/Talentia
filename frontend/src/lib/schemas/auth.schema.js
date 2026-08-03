import { z } from 'zod';

export const loginSchema = z.object({
  usuario: z.string({ required_error: 'El usuario es obligatorio' }).min(1, 'El usuario es obligatorio').max(50, 'El usuario no puede exceder 50 caracteres'),
  clave: z.string({ required_error: 'La contraseña es obligatoria' }).min(6, 'La contraseña debe tener al menos 6 caracteres').max(255, 'La contraseña no puede exceder 255 caracteres'),
  aceptaTerminos: z.literal(true, { errorMap: () => ({ message: 'Debes aceptar los términos y condiciones' }) }),
});

export const refreshTokenSchema = z.object({
  userId: z.number().int().positive(),
  refresh_token: z.string().min(1),
});