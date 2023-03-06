import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJwtToken(username: string) {
    const payload = { username: username };
    const token = this.jwtService.sign(payload, {
      secret: 'my_secret_key',
      expiresIn: '1h',
    });
    return token;
  }

  async getJwtPayload(token: string) {
    return this.jwtService.verify(token, { secret: 'my_secret_key' });
  }
}
