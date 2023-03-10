import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Users } from './entities/user.entity';
import { TokenModule } from 'src/token/token.module';
import { TokenService } from 'src/token/token.service';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), TokenModule],
  controllers: [UsersController],
  providers: [UsersService, TokenService, JwtService, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule {}
