import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { HashModule } from 'src/hash/hash.module';
import { LocalStrategy } from './strategies/local.strategy';
import { TokenModule } from 'src/token/token.module';
import { TokenService } from 'src/token/token.service';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [UsersModule, PassportModule, HashModule, TokenModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    JwtService,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
