import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReclutadorEmpresa } from './reclutador-empresa.entity';
import { ReclutadorEmpresaService } from './reclutador-empresa.service';
import { ReclutadorEmpresaController } from './reclutador-empresa.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ReclutadorEmpresa])],
  controllers: [ReclutadorEmpresaController],
  providers: [ReclutadorEmpresaService],
  exports: [ReclutadorEmpresaService],
})
export class ReclutadorEmpresaModule {}
