import { Controller, Get, Body, Put, Param, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('usuarios')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('Administrador')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles('Administrador')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  @Put(':id')
  @Roles('Administrador')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Patch(':id/estado')
  @Roles('Administrador')
  updateEstado(@Param('id') id: string, @Body() body: UpdateEstadoDto) {
    return this.usersService.updateEstado(+id, body.estado);
  }
}
