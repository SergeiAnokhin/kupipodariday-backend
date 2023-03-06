import { ConflictException, Injectable } from '@nestjs/common';
import { Users } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignupUserDto } from 'src/users/dto/signup-user.dto';
import { HashService } from 'src/hash/hash.service';
import { SigninUserDto } from 'src/users/dto/signin-user.dto';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private tokenService: TokenService,
    private usersService: UsersService,
    private hashService: HashService,
  ) {}

  async signup(signupUserDto: SignupUserDto): Promise<Users> {
    const { email, username } = signupUserDto;
    const existUser = await this.usersService.findByEmailOrUsername(
      email,
      username,
    );
    if (existUser.length) {
      throw new ConflictException(
        'Пользователь с таким email или username уже зарегистрирован',
      );
    }
    return this.usersService.create(signupUserDto);
  }

  async signin(signinUserDto: SigninUserDto) {
    const token = await this.tokenService.generateJwtToken(
      signinUserDto.username,
    );
    return {
      access_token: token,
    };
  }

  async validateUser(username: string, password: string) {
    const userPassword = password;
    const user = await this.usersService.findByUsername(username);
    if (user) {
      const isValidHash = await this.hashService.verifyHash(
        userPassword,
        user.password,
      );

      return isValidHash ? user : null;
    }
    return user;
  }
}
