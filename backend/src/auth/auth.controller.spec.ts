import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authServiceMock: any;
  let usersServiceMock: any;

  const mockUser = { id: 1, usuario: 'admin', nombre: 'Nelson Ruiz', rol: 'Administrador' };

  beforeEach(async () => {
    authServiceMock = {
      validateUser: jest.fn(),
      login: jest.fn(),
      refreshTokens: jest.fn(),
      getUserSessions: jest.fn(),
      revokeSession: jest.fn(),
      logout: jest.fn(),
      getEventsObservable: jest.fn(),
    };
    usersServiceMock = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: UsersService, useValue: usersServiceMock },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('debe hacer login exitosamente con credenciales válidas', async () => {
      authServiceMock.validateUser.mockResolvedValue(mockUser);
      authServiceMock.login.mockResolvedValue({ access_token: 'jwt', refresh_token: 'ref' });

      const req = { headers: { 'user-agent': 'Chrome' }, ip: '127.0.0.1' };
      const body = { usuario: 'admin', clave: 'Password123!' };

      const res = await controller.login(req as any, body);
      expect(res).toHaveProperty('access_token');
      expect(authServiceMock.validateUser).toHaveBeenCalledWith('admin', 'Password123!');
    });

    it('debe lanzar UnauthorizedException si las credenciales son inválidas', async () => {
      authServiceMock.validateUser.mockResolvedValue(null);
      const req = { headers: {} };
      await expect(controller.login(req as any, { usuario: 'admin', clave: 'wrong' })).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refresh', () => {
    it('debe renovar token', async () => {
      authServiceMock.refreshTokens.mockResolvedValue({ access_token: 'new_token' });
      const res = await controller.refresh({ userId: 1, refresh_token: 'ref' });
      expect(res).toEqual({ access_token: 'new_token' });
    });
  });

  describe('register', () => {
    it('debe delegar la creación al UsersService', async () => {
      usersServiceMock.create.mockResolvedValue(mockUser);
      const res = await controller.register({ usuario: 'recr', clave: 'Password123!', nombre: 'Recrut', correo: 'r@r.com', telefono: '123', rol: 'Reclutador' });
      expect(res).toEqual(mockUser);
      expect(usersServiceMock.create).toHaveBeenCalled();
    });
  });

  describe('getProfile', () => {
    it('debe retornar el usuario de la petición', () => {
      const req = { user: mockUser };
      expect(controller.getProfile(req as any)).toEqual(mockUser);
    });
  });

  describe('getSessions', () => {
    it('debe retornar las sesiones', async () => {
      authServiceMock.getUserSessions.mockResolvedValue({ data: [], total: 0 });
      const req = { user: { id: 1 } };
      const res = await controller.getSessions(req as any, 'todas', 1, 5);
      expect(res).toHaveProperty('data');
    });
  });

  describe('revokeSession', () => {
    it('debe revocar sesión', async () => {
      authServiceMock.revokeSession.mockResolvedValue({ message: 'Sesión revocada correctamente' });
      const req = { user: { id: 1 } };
      const res = await controller.revokeSession(req as any, '10');
      expect(res).toEqual({ message: 'Sesión revocada correctamente' });
    });
  });

  describe('logout', () => {
    it('debe cerrar sesión', async () => {
      authServiceMock.logout.mockResolvedValue({ message: 'Sesión cerrada correctamente' });
      const req = { user: { id: 1 }, headers: { 'user-agent': 'Chrome' } };
      const res = await controller.logout(req as any);
      expect(res).toEqual({ message: 'Sesión cerrada correctamente' });
    });
  });
});