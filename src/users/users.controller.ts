import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { Query } from 'typeorm/driver/Query';
import { FindUserDto } from './dto/find-user.dto';

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
  getMyWishes(@Req() req: Request) {
    return 'My wishes';
  }

  @Get(':username/wishes')
  getUserWishes(@Req() req: Request) {
    return 'User wishes';
  }

  @Post('find')
  getUserByQuery(@Body() findUserDto: FindUserDto) {
    return findUserDto;
  }
}
