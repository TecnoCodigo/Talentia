import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existe = await this.usersRepository.findOne({ where: [{ usuario: createUserDto.usuario }, { correo: createUserDto.correo }] });
    if (existe) throw new ConflictException('Usuario o correo ya en uso');

    const claveHash = await bcrypt.hash(createUserDto.clave, 10);
    const user = this.usersRepository.create({
      usuario: createUserDto.usuario,
      clave: claveHash,
      nombre: createUserDto.nombre,
      correo: createUserDto.correo,
      telefono: createUserDto.telefono,
      rol: createUserDto.rol || 'Reclutador',
    } as unknown as User);
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

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);

    const dto = { ...updateUserDto } as any;
    if (dto.clave) {
      dto.clave = await bcrypt.hash(dto.clave, 10);
    }

    this.usersRepository.merge(user, dto);
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
