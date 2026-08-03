import { IsString, IsNotEmpty, IsOptional, IsEmail, IsEnum, MaxLength } from 'class-validator';

export class CreateEmpresaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  rif?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  sector?: string;

  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  correoContacto?: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  telefono?: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsString()
  @IsOptional()
  @MaxLength(80)
  pais?: string;

  @IsString()
  @IsOptional()
  @MaxLength(80)
  ciudad?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  responsable?: string;

  @IsEnum(['Activa', 'Inactiva'])
  @IsOptional()
  estado?: string;
}
