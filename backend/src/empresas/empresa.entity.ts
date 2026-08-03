import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Talento } from '../talentos/talento.entity';
import { ReclutadorEmpresa } from '../reclutador-empresa/reclutador-empresa.entity';

@Entity('empresas')
export class Empresa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ length: 30, nullable: true, unique: true })
  rif: string;

  @Column({ length: 100, nullable: true })
  sector: string;

  @Column({ name: 'correo_contacto', length: 100, nullable: true })
  correoContacto: string;

  @Column({ length: 30, nullable: true })
  telefono: string;

  @Column({ type: 'text', nullable: true })
  direccion: string;

  @Column({ length: 80, default: 'Venezuela' })
  pais: string;

  @Column({ length: 80, nullable: true })
  ciudad: string;

  @Column({ length: 150, nullable: true })
  responsable: string;

  @Column({ type: 'enum', enum: ['Activa', 'Inactiva'], default: 'Activa' })
  estado: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;

  @OneToMany(() => Talento, (talento) => talento.empresa)
  talentos: Talento[];

  @OneToMany(() => ReclutadorEmpresa, (re) => re.empresa)
  reclutadores: ReclutadorEmpresa[];
}
