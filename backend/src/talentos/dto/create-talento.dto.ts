import { IsString, IsNotEmpty, IsOptional, IsEmail, IsEnum, IsInt, Min, MaxLength, IsUrl } from 'class-validator';

export class CreateTalentoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombreCompleto: string;

  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  correo?: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  telefono?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  especialidad?: string;

  @IsEnum(['Disponible', 'Empleado', 'Freelance', 'No Disponible'])
  @IsOptional()
  estadoLaboral?: string;

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
  resumen?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  experienciaAnios?: number;

  @IsUrl()
  @IsOptional()
  @MaxLength(500)
  urlCv?: string;

  @IsInt()
  @IsOptional()
  empresaId?: number;
}
