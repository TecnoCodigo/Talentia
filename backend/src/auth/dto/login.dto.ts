import { IsString, IsNotEmpty, IsOptional, MaxLength, MinLength, IsIP } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'El usuario debe ser texto' })
  @IsNotEmpty({ message: 'El usuario es obligatorio' })
  @MaxLength(50, { message: 'El usuario no puede exceder 50 caracteres' })
  usuario: string;

  @IsString({ message: 'La contraseña debe ser texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(255, { message: 'La contraseña no puede exceder 255 caracteres' })
  clave: string;

  @IsOptional()
  @IsIP('4', { message: 'La dirección IP no es válida' })
  clientIp?: string;
}