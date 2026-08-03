import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateEstadoDto {
  @IsEnum(['Activo', 'Inactivo'], { message: 'El estado debe ser Activo o Inactivo' })
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  estado: string;
}