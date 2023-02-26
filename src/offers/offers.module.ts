import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Offers } from './entities/offer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Offers])],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
