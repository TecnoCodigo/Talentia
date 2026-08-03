import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Talento } from './talento.entity';
import { ReclutadorEmpresa } from '../reclutador-empresa/reclutador-empresa.entity';
import { TalentosService } from './talentos.service';
import { TalentosController } from './talentos.controller';
import { StorageModule } from '../storage/storage.module';
import { CvParserModule } from '../cv-parser/cv-parser.module';

@Module({
  imports: [TypeOrmModule.forFeature([Talento, ReclutadorEmpresa]), StorageModule, CvParserModule],
  controllers: [TalentosController],
  providers: [TalentosService],
  exports: [TalentosService],
})
export class TalentosModule {}
