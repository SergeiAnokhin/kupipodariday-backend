import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupUserDto } from './dto/signup-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/user.entity';
import { hash } from 'bcrypt';
import { BasicEntity } from 'src/utils/basic.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async create(createUserDto: SignupUserDto): Promise<Users> {
    const { password } = createUserDto;
    const passwordHash = await hash(password, 10);
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: passwordHash,
    });
    return await this.usersRepository.save(newUser);
  }

  async findByEmailOrUsername(
    email: string,
    username: string,
  ): Promise<Users[]> {
    return this.usersRepository.find({
      where: [{ email: email }, { username: username }],
    });
  }

  async findByUsername(username: string): Promise<Users> {
    return await this.usersRepository.findOne({
      where: [{ username: username }],
    });
  }

  async findByEmail(email: string): Promise<Users> {
    return await this.usersRepository.findOne({
      where: [{ email: email }],
    });
  }

  // updateOne(updateUserDto: UpdateUserDto) {
  //   return `This action updates user`;
  // }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    // if (updateUserDto.password) {
    //   updateUserDto.password = await this.hashServise.hash(
    //     updateUserDto.password,
    //   );
    // }
    await this.usersRepository.update(id, updateUserDto);

    // const updatedUser = await this.findOne({
    //   where: { id: +id },
    // });

    return await this.usersRepository.update(id, updateUserDto);
  }

  removeOne(id: number) {
    return `This action removes a #${id} user`;
  }
}
