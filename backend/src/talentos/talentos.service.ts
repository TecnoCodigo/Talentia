import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Talento } from './talento.entity';
import { ReclutadorEmpresa } from '../reclutador-empresa/reclutador-empresa.entity';
import { CreateTalentoDto } from './dto/create-talento.dto';
import { UpdateTalentoDto } from './dto/update-talento.dto';
import { R2StorageService } from '../storage/r2-storage.service';

@Injectable()
export class TalentosService {
  constructor(
    @InjectRepository(Talento)
    private talentosRepository: Repository<Talento>,
    @InjectRepository(ReclutadorEmpresa)
    private reclutadorEmpresaRepository: Repository<ReclutadorEmpresa>,
    private r2StorageService: R2StorageService,
  ) {}

  private async signTalentoCv(talento: Talento): Promise<Talento> {
    if (talento && talento.urlCv) {
      talento.urlCv = await this.r2StorageService.getPresignedUrl(talento.urlCv);
    }
    return talento;
  }

  private cleanUrlCv(urlCv?: string): string | undefined {
    if (!urlCv) return urlCv;
    return urlCv.split('?')[0];
  }

  async create(createTalentoDto: CreateTalentoDto, user: any): Promise<Talento> {
    if (createTalentoDto.urlCv) {
      createTalentoDto.urlCv = this.cleanUrlCv(createTalentoDto.urlCv);
    }

    const talento = this.talentosRepository.create({
      ...createTalentoDto,
      registradoPor: { id: user.id },
      empresa: createTalentoDto.empresaId ? { id: createTalentoDto.empresaId } : null
    } as unknown as Talento);
    
    const saved = await this.talentosRepository.save(talento);
    return this.signTalentoCv(saved);
  }

  async findAll(query: any): Promise<Talento[]> {
    const qb = this.talentosRepository.createQueryBuilder('talento')
      .leftJoinAndSelect('talento.empresa', 'empresa')
      .leftJoinAndSelect('talento.registradoPor', 'registradoPor');
    
    if (query.empresaId) qb.andWhere('talento.empresaId = :empresaId', { empresaId: query.empresaId });
    if (query.estadoLaboral) qb.andWhere('talento.estadoLaboral = :estadoLaboral', { estadoLaboral: query.estadoLaboral });
    if (query.pais) qb.andWhere('talento.pais = :pais', { pais: query.pais });
    if (query.especialidad) qb.andWhere('talento.especialidad LIKE :especialidad', { especialidad: `%${query.especialidad}%` });
    if (query.correo) qb.andWhere('talento.correo LIKE :correo', { correo: `%${query.correo}%` });

    qb.orderBy('talento.creadoEn', 'DESC');

    const talentos = await qb.getMany();
    return Promise.all(talentos.map((t) => this.signTalentoCv(t)));
  }

  async findOne(id: number): Promise<Talento> {
    const talento = await this.talentosRepository.findOne({ 
      where: { id },
      relations: ['empresa', 'registradoPor']
    });
    if (!talento) throw new NotFoundException(`Talento con ID ${id} no encontrado`);
    return this.signTalentoCv(talento);
  }

  async canEdit(talento: Talento, user: any): Promise<boolean> {
    if (user.rol === 'Administrador') return true;
    if (talento.registradoPor?.id === user.id) return true;
    if (talento.empresa) {
      const assigned = await this.reclutadorEmpresaRepository.findOne({
        where: { usuario: { id: user.id }, empresa: { id: talento.empresa.id } }
      });
      if (assigned) return true;
    }
    return false;
  }

  async update(id: number, updateTalentoDto: UpdateTalentoDto, user: any): Promise<Talento> {
    const talento = await this.findOne(id);
    const hasPermission = await this.canEdit(talento, user);
    if (!hasPermission) throw new ForbiddenException('No tienes permisos para editar este talento');

    if (updateTalentoDto.urlCv !== undefined) {
      updateTalentoDto.urlCv = this.cleanUrlCv(updateTalentoDto.urlCv);
    }

    if (updateTalentoDto.empresaId !== undefined) {
      (talento as any).empresa = updateTalentoDto.empresaId ? { id: updateTalentoDto.empresaId } : null;
      delete updateTalentoDto.empresaId;
    }
    
    this.talentosRepository.merge(talento, updateTalentoDto);
    const saved = await this.talentosRepository.save(talento);
    return this.signTalentoCv(saved);
  }

  async remove(id: number): Promise<void> {
    const result = await this.talentosRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Talento con ID ${id} no encontrado`);
  }
}
