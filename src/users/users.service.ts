import { Injectable } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupUserDto } from './dto/signup-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/user.entity';
import { hash } from 'bcrypt';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private tokenService: TokenService,
  ) {}

  async findOne(query: FindOneOptions<Users>): Promise<Users> {
    return this.usersRepository.findOne(query);
  }

  async create(createUserDto: SignupUserDto): Promise<Users> {
    const { password } = createUserDto;
    const passwordHash = await hash(password, 10);
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: passwordHash,
    });
    return await this.usersRepository.save(newUser);
  }

  async findCurrentUser(token: string) {
    const { username } = await this.tokenService.getJwtPayload(
      token.split(' ')[1],
    );
    return this.findByUsername(username);
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
    const user = await this.usersRepository.findOne({
      where: [{ username: username }],
    });
    return user;
  }

  async findByEmail(email: string): Promise<Users> {
    const user = await this.usersRepository.findOne({
      where: [{ email: email }],
    });
    return user;
  }

  async updateOne(token: string, updateUserDto: UpdateUserDto) {
    const { id } = await this.tokenService.getJwtPayload(token.split(' ')[1]);
    const passwordHash = await hash(updateUserDto.password, 10);

    updateUserDto.password = passwordHash;
    await this.usersRepository.update(id, updateUserDto);

    const updatedUser = await this.usersRepository.findOne({
      where: { id: id },
    });

    delete updatedUser.password;

    return updatedUser;
  }

  async getUserWishes(id: number) {
    const currentUser = await this.findOne({
      where: { id: id },
      relations: {
        wishes: {
          owner: true,
          offers: {
            item: { owner: true, offers: true },
            user: { wishes: true, offers: true, wishlists: true },
          },
        },
      },
    });

    const currentUserWishes = currentUser.wishes.filter((wish) => {
      const amounts = wish.offers.map((offer) => Number(offer.amount));
      delete wish.owner.email;
      wish.raised = amounts.reduce(function (acc, val) {
        return acc + val;
      }, 0);
      wish.price = Number(wish.price);
      return wish;
    });

    return currentUserWishes;
  }
}
