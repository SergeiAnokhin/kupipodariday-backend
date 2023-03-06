import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SigninUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2, {
    message: 'Имя пользователя не может быть короче 2-х символов',
  })
  @MaxLength(30, {
    message: 'Имя пользователя не может быть длиннее 30 символов',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
