import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { User } from './users/user.entity';
import { Session } from './auth/session.entity';
import { Empresa } from './empresas/empresa.entity';
import { Talento } from './talentos/talento.entity';
import { ReclutadorEmpresa } from './reclutador-empresa/reclutador-empresa.entity';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { JwtStrategy } from './auth/jwt.strategy';
import { HealthController } from './health.controller';
import { EmpresasModule } from './empresas/empresas.module';
import { TalentosModule } from './talentos/talentos.module';
import { ReclutadorEmpresaModule } from './reclutador-empresa/reclutador-empresa.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get<string>('DB_USER', 'talentia_user'),
        password: config.get<string>('DB_PASSWORD', 'talentia_password'),
        database: config.get<string>('DB_NAME', 'talentia_db'),
        entities: [User, Session, Empresa, Talento, ReclutadorEmpresa],
        synchronize: false,
        retryAttempts: 30, // Espera hasta 90 segundos a que la BD inicie
      }),
    }),
    TypeOrmModule.forFeature([User, Session, Empresa, Talento, ReclutadorEmpresa]),
    PassportModule,
    JwtModule.register({}),
    EmpresasModule,
    TalentosModule,
    ReclutadorEmpresaModule,
  ],
  controllers: [AuthController, HealthController, UsersController],
  providers: [UsersService, AuthService, JwtStrategy],
})
export class AppModule { }
