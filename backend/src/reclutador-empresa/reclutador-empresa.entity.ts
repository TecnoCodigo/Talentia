import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from '../users/user.entity';
import { Empresa } from '../empresas/empresa.entity';

@Entity('reclutador_empresa')
@Unique('uk_reclutador_empresa', ['usuario', 'empresa'])
export class ReclutadorEmpresa {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.empresasAsignadas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @ManyToOne(() => Empresa, (empresa) => empresa.reclutadores, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @CreateDateColumn({ name: 'asignado_en' })
  asignadoEn: Date;
}
