import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: any): Promise<User> {
    const existe = await this.usersRepository.findOne({ where: [{ usuario: createUserDto.usuario }, { correo: createUserDto.correo }] });
    if (existe) throw new ConflictException('Usuario o correo ya en uso');

    const claveHash = await bcrypt.hash(createUserDto.clave, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      clave: claveHash,
      rol: createUserDto.rol || 'Reclutador'
    });
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ select: ['id', 'usuario', 'nombre', 'correo', 'telefono', 'rol', 'estado', 'creadoEn'] });
  }

  async findByUsuario(usuario: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { usuario } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: any): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    
    if (updateUserDto.clave) {
      updateUserDto.clave = await bcrypt.hash(updateUserDto.clave, 10);
    }
    
    this.usersRepository.merge(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async updateEstado(id: number, estado: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    user.estado = estado;
    return this.usersRepository.save(user);
  }

  async setRefreshToken(userId: number, refreshTokenHash: string | null): Promise<void> {
    await this.usersRepository.update(userId, { refreshTokenHash });
  }
}
