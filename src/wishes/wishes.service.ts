import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
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

  async create(user: Users, createWishDto: CreateWishDto) {
    delete user.password;
    delete user.email;
    const newWish = this.wishesRepository.create({
      ...createWishDto,
      owner: user,
    });
    return this.wishesRepository.save(newWish);
  }

  async getLastWish() {
    const wishes = await this.wishesRepository.find({
      relations: {
        owner: true,
        offers: {
          item: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });

    wishes.forEach((wish) => {
      const amounts = wish.offers.map((offer) => Number(offer.amount));

      wish.raised = amounts.reduce(function (acc, val) {
        return acc + val;
      }, 0);

      delete wish.owner.password;
      delete wish.owner.email;
    });

    return wishes;
  }

  async getTopWish() {
    const wishes = await this.wishesRepository.find({
      relations: {
        owner: true,
        offers: {
          item: true,
        },
      },
      order: {
        copied: 'DESC',
      },
      take: 10,
    });

    const copiedWishes = wishes.filter((wish) => {
      if (wish.copied === 0) {
        return;
      }
      return wish;
    });

    copiedWishes.forEach((wish) => {
      const amounts = wish.offers.map((offer) => Number(offer.amount));

      wish.raised = amounts.reduce(function (acc, val) {
        return acc + val;
      }, 0);

      delete wish.owner.password;
      delete wish.owner.email;
    });

    return copiedWishes;
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
  }

  async removeWishById(id: number) {
    return this.wishesRepository.delete({ id });
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

      console.log(updatedWish);

      await this.updateWishById(
        updatedWish,
        updatedWish.id.toString(),
        updatedWish.owner.id,
      );
    }

    return {};
  }
}
