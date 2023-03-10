import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
  Post,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { Query } from 'typeorm/driver/Query';
import { FindUserDto } from './dto/find-user.dto';
import { RequestWithUser } from 'src/types';
import { Wishes } from 'src/wishes/entities/wish.entity';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getCurrentUser(@Req() req: Request) {
    return this.usersService.findCurrentUser(req.headers.authorization);
  }

  @Get(':username')
  getUserByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Patch('me')
  updateCurrentUser(@Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    return this.usersService.updateOne(
      req.headers.authorization,
      updateUserDto,
    );
  }

  @Get('me/wishes')
  getMyWishes(@Req() req: RequestWithUser) {
    return this.usersService.getUserWishes(req.user.id);
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return await this.usersService.getUserWishes(user.id);
  }

  @Post('find')
  getUserByQuery(@Body() findUserDto: FindUserDto) {
    return this.usersService.findByEmail(findUserDto.query);
  }
}
