import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/config/typeorm.config';
import { WishesModule } from 'src/wishes/wishes.module';
import { WishlistsModule } from 'src/wishlists/wishlists.module';
import { OffersModule } from 'src/offers/offers.module';
import { AuthModule } from 'src/auth/auth.module';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    AuthModule,
    TokenModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
