import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SignupUserDto } from './dto/signup-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequestWithUser } from '../types/index';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() signupUserDto: SignupUserDto) {
    return this.usersService.create(signupUserDto);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  getUser() {
    return 'true1';
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Patch('me')
  updateOne(@Req() req: RequestWithUser, @Body() updateUserDto: UpdateUserDto) {
    // return this.usersService.updateOne(req.user.id, updateUserDto);
  }

  @Delete(':id')
  removeOne(@Param('id') id: string) {
    return this.usersService.removeOne(+id);
  }
}
