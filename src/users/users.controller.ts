import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getUser(@Req() req: Request) {
    return this.usersService.findCurrentUser(req.headers.authorization);
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Patch('me')
  updateOne(@Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    return this.usersService.updateOne(
      req.headers.authorization,
      updateUserDto,
    );
  }
}
