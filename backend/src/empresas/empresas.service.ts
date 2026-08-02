import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from './empresa.entity';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Injectable()
export class EmpresasService {
  constructor(
    @InjectRepository(Empresa)
    private empresasRepository: Repository<Empresa>,
  ) {}

  async create(createEmpresaDto: CreateEmpresaDto): Promise<Empresa> {
    const empresa = this.empresasRepository.create(createEmpresaDto);
    return this.empresasRepository.save(empresa);
  }

  async findAll(query: any): Promise<Empresa[]> {
    const where: any = {};
    if (query.pais) where.pais = query.pais;
    if (query.estado) where.estado = query.estado;
    return this.empresasRepository.find({ where });
  }

  async findOne(id: number): Promise<Empresa> {
    const empresa = await this.empresasRepository.findOne({ where: { id } });
    if (!empresa) throw new NotFoundException(`Empresa con ID ${id} no encontrada`);
    return empresa;
  }

  async update(id: number, updateEmpresaDto: UpdateEmpresaDto): Promise<Empresa> {
    const empresa = await this.findOne(id);
    this.empresasRepository.merge(empresa, updateEmpresaDto);
    return this.empresasRepository.save(empresa);
  }

  async remove(id: number): Promise<void> {
    const result = await this.empresasRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Empresa con ID ${id} no encontrada`);
  }
}
