import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlists } from './entities/wishlist.entity';
import { Users } from 'src/users/entities/user.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlists)
    private wishlistsRepository: Repository<Wishlists>,
    private wishesService: WishesService,
  ) {}

  async findOne(query: FindOneOptions<Wishlists>): Promise<Wishlists> {
    return this.wishlistsRepository.findOne(query);
  }

  findMany(query: FindManyOptions<Wishlists>) {
    return this.wishlistsRepository.find(query);
  }

  async createWishlist(owner: Users, createWishlistDto: CreateWishlistDto) {
    delete owner.password;
    delete owner.email;

    const wishes = await this.wishesService.findMany({});

    const items = createWishlistDto.itemsId.map((item) => {
      return wishes.find((wish) => wish.id === item);
    });

    const newWishList = this.wishlistsRepository.create({
      ...createWishlistDto,
      owner: owner,
      items: items,
    });

    return this.wishlistsRepository.save(newWishList);
  }

  async updateWishlist(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ): Promise<Wishlists> {
    const wishlist = await this.getWishlistsById(id.toString());

    if (!wishlist) {
      throw new NotFoundException('Список не найден');
    }

    if (wishlist.owner.id !== userId) {
      throw new BadRequestException('Запрещено редактировать чужие списки');
    }

    const wishes = await this.wishesService.findManyByIdArr(
      updateWishlistDto.itemsId || [],
    );

    return await this.wishlistsRepository.save({
      ...wishlist,
      name: updateWishlistDto.name,
      image: updateWishlistDto.image,
      description: updateWishlistDto.description,
      items: wishes,
    });
  }
  async getWishlists() {
    const wishLists = await this.findMany({
      relations: {
        owner: true,
        items: true,
      },
    });

    wishLists.forEach((wishList) => {
      delete wishList.owner.password;
      delete wishList.owner.email;
    });

    return wishLists;
  }

  async getWishlistsById(id: string) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: [{ id: +id }],
      relations: {
        items: { offers: true },
        owner: true,
      },
    });

    if (!wishlist) {
      throw new NotFoundException();
    }

    wishlist.items.forEach((item) => {
      const amounts = item.offers.map((offer) => Number(offer.amount));
      item.raised = amounts.reduce(function (acc, val) {
        return acc + val;
      }, 0);
    });

    delete wishlist.owner.password;
    delete wishlist.owner.email;

    return wishlist;
  }

  async removeWishlistById(id: number, userId: number): Promise<Wishlists> {
    const wishlist = await this.getWishlistsById(id.toString());

    if (!wishlist) {
      throw new NotFoundException('Список не найден');
    }

    if (wishlist.owner.id !== userId) {
      throw new BadRequestException('Запрещено удалять чужие списки');
    }

    await this.wishlistsRepository.delete(id);

    return wishlist;
  }
}
