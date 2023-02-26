import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wishes } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wishes)
    private wishesRepository: Repository<Wishes>,
  ) {}

  async create(createWishDto: CreateWishDto): Promise<Wishes> {
    const newWish = this.wishesRepository.create({});

    return this.wishesRepository.save(newWish);
  }

  findAll() {
    return `This action returns all wishes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wish`;
  }

  update(id: number, updateWishDto: UpdateWishDto) {
    return `This action updates a #${id} wish`;
  }

  remove(id: number) {
    return `This action removes a #${id} wish`;
  }
}
