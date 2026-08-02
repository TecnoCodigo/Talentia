import { IsInt, IsNotEmpty } from 'class-validator';

export class AsignarReclutadorDto {
  @IsInt()
  @IsNotEmpty()
  usuarioId: number;

  @IsInt()
  @IsNotEmpty()
  empresaId: number;
}
