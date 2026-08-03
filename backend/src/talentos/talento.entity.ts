import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Empresa } from '../empresas/empresa.entity';
import { User } from '../users/user.entity';

@Entity('talentos')
export class Talento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre_completo', length: 150 })
  nombreCompleto: string;

  @Column({ length: 100, nullable: true })
  correo: string;

  @Column({ length: 30, nullable: true })
  telefono: string;

  @Column({ length: 100, nullable: true })
  especialidad: string;

  @Column({ name: 'estado_laboral', type: 'enum', enum: ['Disponible', 'Empleado', 'Freelance', 'No Disponible'], default: 'Disponible' })
  estadoLaboral: string;

  @Column({ length: 80, default: 'Venezuela' })
  pais: string;

  @Column({ length: 80, nullable: true })
  ciudad: string;

  @Column({ type: 'text', nullable: true })
  resumen: string;

  @Column({ name: 'experiencia_anios', type: 'int', default: 0, nullable: true })
  experienciaAnios: number;

  @Column({ name: 'url_cv', length: 500, nullable: true })
  urlCv: string;

  @ManyToOne(() => Empresa, (empresa) => empresa.talentos, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @ManyToOne(() => User, (user) => user.talentos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'registrado_por' })
  registradoPor: User;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;
}
