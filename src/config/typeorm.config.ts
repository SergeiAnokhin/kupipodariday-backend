import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Offers } from 'src/offers/entities/offer.entity';
import { Users } from 'src/users/entities/user.entity';
import { Wishes } from 'src/wishes/entities/wish.entity';
import { Wishlists } from 'src/wishlists/entities/wishlist.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'student',
  password: 'student',
  database: 'kupipodariday',
  entities: [Users, Wishes, Wishlists, Offers],
  synchronize: true,
};
