import { Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Wishes } from './entities/wish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wishes])],
  controllers: [WishesController],
  providers: [WishesService],
})
export class WishesModule {}
