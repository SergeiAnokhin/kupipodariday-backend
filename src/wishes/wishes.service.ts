import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindManyOptions, FindOneOptions, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wishes } from './entities/wish.entity';
import { Users } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wishes)
    private wishesRepository: Repository<Wishes>,
  ) {}

  findMany(query: FindManyOptions<Wishes>) {
    return this.wishesRepository.find(query);
  }

  async findManyByIdArr(idArr: number[]): Promise<Wishes[]> {
    return this.wishesRepository.find({
      where: { id: In(idArr) },
    });
  }

  async create(user: Users, createWishDto: CreateWishDto) {
    delete user.password;
    delete user.email;
    const newWish = this.wishesRepository.create({
      ...createWishDto,
      owner: user,
    });
    await this.wishesRepository.save(newWish);
    return {};
  }

  async getLastWishes(): Promise<Wishes[]> {
    return await this.wishesRepository.find({
      take: 40,
      order: { createdAt: 'desc' },
      relations: [
        'owner',
        'offers',
        'offers.user',
        'offers.user.wishes',
        'offers.user.offers',
        'offers.user.wishlists',
      ],
    });
  }

  async getTopWishes(): Promise<Wishes[]> {
    return await this.wishesRepository.find({
      take: 20,
      order: { copied: 'desc' },
      relations: [
        'owner',
        'offers',
        'offers.user',
        'offers.user.wishes',
        'offers.user.offers',
        'offers.user.wishlists',
      ],
    });
  }

  async getWishById(id: number) {
    const wish = await this.wishesRepository.findOne({
      where: [{ id: id }],
      relations: {
        owner: true,
        offers: {
          item: true,
          user: { offers: true, wishes: true, wishlists: true },
        },
      },
    });

    if (!wish) {
      throw new NotFoundException();
    }

    const amounts = wish.offers.map((offer) => Number(offer.amount));

    wish.raised = amounts.reduce(function (acc, val) {
      return acc + val;
    }, 0);

    delete wish.owner.password;
    delete wish.owner.email;

    return wish;
  }

  async updateWishById(
    updateWishDto: UpdateWishDto,
    id: string,
    userId: number,
  ) {
    const wish = await this.wishesRepository.findOne({
      where: [{ id: +id }],
      relations: {
        owner: true,
        offers: true,
      },
    });

    if (wish.offers.length !== 0 && wish.raised !== 0) {
      throw new ForbiddenException(
        'Редактирование подарка невозможжно, если есть желающие скинуться',
      );
    }

    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Редактирование чужих подарков невозможно');
    }

    await this.wishesRepository.update(id, updateWishDto);
    return {};
  }

  async removeWishById(id: number, userId: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: [
        'owner',
        'offers',
        'offers.user',
        'offers.user.wishes',
        'offers.user.offers',
        'offers.user.wishlists',
      ],
    });

    if (wish.offers.length !== 0) {
      throw new BadRequestException(
        'Нельзя удалять подарок, на который кто-то подписан',
      );
    }

    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }

    if (wish.owner.id !== userId) {
      throw new BadRequestException('Нельзя удалть чужие подарки');
    }

    await this.wishesRepository.delete(id);

    return wish;
  }

  async findOne(query: FindOneOptions<Wishes>): Promise<Wishes> {
    return this.wishesRepository.findOne(query);
  }

  async copyWish(owner: Users, wishId: number) {
    const wish = await this.findOne({
      where: { id: wishId },
      relations: {
        owner: true,
      },
    });
    if (!wish) {
      throw new NotFoundException();
    }

    const copiedCreateWishDto = {
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
    };

    const copiedWish = await this.create(owner, copiedCreateWishDto);

    if (copiedWish) {
      const updatedWish = {
        ...wish,
        copied: wish.copied + 1,
      };

      await this.updateWishById(
        updatedWish,
        updatedWish.id.toString(),
        updatedWish.owner.id,
      );
    }

    return {};
  }
}
