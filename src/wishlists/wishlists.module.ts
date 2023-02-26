import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Wishlists } from './entities/wishlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlists])],
  controllers: [WishlistsController],
  providers: [WishlistsService],
})
export class WishlistsModule {}
