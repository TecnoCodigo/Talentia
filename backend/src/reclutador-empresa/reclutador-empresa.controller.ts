import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ReclutadorEmpresaService } from './reclutador-empresa.service';
import { AsignarReclutadorDto } from './dto/asignar-reclutador.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('asignaciones')
export class ReclutadorEmpresaController {
  constructor(private readonly reclutadorEmpresaService: ReclutadorEmpresaService) {}

  @Post()
  @Roles('Administrador')
  asignar(@Body() dto: AsignarReclutadorDto) {
    return this.reclutadorEmpresaService.asignar(dto);
  }

  @Post('multiple')
  @Roles('Administrador')
  asignarMultiple(@Body() body: { usuarioId: number; empresaIds: number[] }) {
    return this.reclutadorEmpresaService.asignarMultiple(body.usuarioId, body.empresaIds);
  }

  @Get(':userId')
  @Roles('Administrador')
  findByUsuario(@Param('userId') userId: string) {
    return this.reclutadorEmpresaService.findByUsuario(+userId);
  }

  @Delete(':id')
  @Roles('Administrador')
  remove(@Param('id') id: string) {
    return this.reclutadorEmpresaService.remove(+id);
  }
}
