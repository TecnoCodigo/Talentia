import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Talento } from '../talentos/talento.entity';
import { ReclutadorEmpresa } from '../reclutador-empresa/reclutador-empresa.entity';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  usuario: string;

  @Column({ length: 255 })
  clave: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ unique: true, length: 100 })
  correo: string;

  @Column({ length: 20 })
  telefono: string;

  @Column({ length: 30, default: 'Reclutador' })
  rol: string;

  @Column({ type: 'enum', enum: ['Activo', 'Inactivo'], default: 'Activo' })
  estado: string;

  @Column({ name: 'refresh_token_hash', nullable: true, length: 255 })
  refreshTokenHash: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;

  @OneToMany(() => Talento, (talento) => talento.registradoPor)
  talentos: Talento[];

  @OneToMany(() => ReclutadorEmpresa, (re) => re.usuario)
  empresasAsignadas: ReclutadorEmpresa[];
}
