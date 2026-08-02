import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query, Req, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TalentosService } from './talentos.service';
import { CreateTalentoDto } from './dto/create-talento.dto';
import { UpdateTalentoDto } from './dto/update-talento.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { CvParserService } from '../cv-parser/cv-parser.service';
import { R2StorageService } from '../storage/r2-storage.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('api/talentos')
export class TalentosController {
  constructor(
    private readonly talentosService: TalentosService,
    private readonly cvParserService: CvParserService,
    private readonly r2StorageService: R2StorageService
  ) {}

  @Post('upload-cv')
  @Roles('Administrador', 'Reclutador')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCv(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('El archivo es requerido');
    const cvData = await this.cvParserService.parseCv(file.buffer);
    const urlCv = await this.r2StorageService.uploadFile(file);
    return { ...cvData, urlCv };
  }

  @Post()
  @Roles('Administrador', 'Reclutador')
  create(@Body() createTalentoDto: CreateTalentoDto, @Req() req: any) {
    return this.talentosService.create(createTalentoDto, req.user);
  }

  @Get()
  @Roles('Administrador', 'Reclutador')
  findAll(@Query() query: any) {
    return this.talentosService.findAll(query);
  }

  @Get(':id')
  @Roles('Administrador', 'Reclutador')
  findOne(@Param('id') id: string) {
    return this.talentosService.findOne(+id);
  }

  @Put(':id')
  @Roles('Administrador', 'Reclutador')
  update(@Param('id') id: string, @Body() updateTalentoDto: UpdateTalentoDto, @Req() req: any) {
    return this.talentosService.update(+id, updateTalentoDto, req.user);
  }

  @Delete(':id')
  @Roles('Administrador')
  remove(@Param('id') id: string) {
    return this.talentosService.remove(+id);
  }
}
