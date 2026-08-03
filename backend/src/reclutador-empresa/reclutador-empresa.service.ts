import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReclutadorEmpresa } from './reclutador-empresa.entity';
import { AsignarReclutadorDto } from './dto/asignar-reclutador.dto';

@Injectable()
export class ReclutadorEmpresaService {
  constructor(
    @InjectRepository(ReclutadorEmpresa)
    private reclutadorEmpresaRepository: Repository<ReclutadorEmpresa>,
  ) {}

  async asignar(dto: AsignarReclutadorDto): Promise<ReclutadorEmpresa> {
    const existe = await this.reclutadorEmpresaRepository.findOne({
      where: { usuario: { id: dto.usuarioId }, empresa: { id: dto.empresaId } }
    });
    if (existe) throw new ConflictException('El reclutador ya está asignado a esta empresa');

    const asignacion = this.reclutadorEmpresaRepository.create({
      usuario: { id: dto.usuarioId },
      empresa: { id: dto.empresaId }
    } as unknown as ReclutadorEmpresa);

    return this.reclutadorEmpresaRepository.save(asignacion);
  }

  async asignarMultiple(usuarioId: number, empresaIds: number[]): Promise<ReclutadorEmpresa[]> {
    if (!Array.isArray(empresaIds) || empresaIds.length === 0) return [];
    const asignaciones: ReclutadorEmpresa[] = [];
    for (const empresaId of empresaIds) {
      const existe = await this.reclutadorEmpresaRepository.findOne({
        where: { usuario: { id: usuarioId }, empresa: { id: empresaId } }
      });
      if (!existe) {
        const asignacion = this.reclutadorEmpresaRepository.create({
          usuario: { id: usuarioId },
          empresa: { id: empresaId }
        } as unknown as ReclutadorEmpresa);
        asignaciones.push(await this.reclutadorEmpresaRepository.save(asignacion));
      } else {
        asignaciones.push(existe);
      }
    }
    return asignaciones;
  }

  async findByUsuario(usuarioId: number): Promise<ReclutadorEmpresa[]> {
    return this.reclutadorEmpresaRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: ['empresa']
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.reclutadorEmpresaRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Asignación con ID ${id} no encontrada`);
  }
}
