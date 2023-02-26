import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlists } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlists)
    private wishlistRepository: Repository<Wishlists>,
  ) {}

  async create(createWishlistDto: CreateWishlistDto): Promise<Wishlists> {
    const newWishlist = this.wishlistRepository.create({});

    return this.wishlistRepository.save(newWishlist);
  }

  findAll() {
    return `This action returns all wishlists`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wishlist`;
  }

  update(id: number, updateWishlistDto: UpdateWishlistDto) {
    return `This action updates a #${id} wishlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} wishlist`;
  }
}
