import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), ['clave'] as const) {
  @IsString({ message: 'La contraseña debe ser texto' })
  @IsOptional()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(255, { message: 'La contraseña no puede exceder 255 caracteres' })
  clave?: string;

  @IsEnum(['Activo', 'Inactivo'], { message: 'El estado debe ser Activo o Inactivo' })
  @IsOptional()
  estado?: string;
}