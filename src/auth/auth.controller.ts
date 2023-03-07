import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { SignupUserDto } from 'src/users/dto/signup-user.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local-auth.guard';
import { RequestWithUser } from 'src/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(@Req() req: RequestWithUser) {
    return await this.authService.signin(req);
  }

  @Post('signup')
  async signup(@Body() signupUserDto: SignupUserDto) {
    return await this.authService.signup(signupUserDto);
  }
}
