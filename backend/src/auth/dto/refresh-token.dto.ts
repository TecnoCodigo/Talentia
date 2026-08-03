import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class RefreshTokenDto {
  @IsInt({ message: 'El userId debe ser un número entero' })
  @IsNotEmpty({ message: 'El userId es obligatorio' })
  @Min(1, { message: 'El userId debe ser mayor a 0' })
  userId: number;

  @IsString({ message: 'El refresh token debe ser texto' })
  @IsNotEmpty({ message: 'El refresh token es obligatorio' })
  refresh_token: string;
}