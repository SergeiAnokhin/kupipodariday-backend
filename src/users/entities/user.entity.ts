import { Entity, Column, OneToMany } from 'typeorm';
import { IsEmail, Length } from 'class-validator';
import { BasicEntity } from 'src/utils/basic.entity';
import { Wishes } from 'src/wishes/entities/wish.entity';
import { Offers } from 'src/offers/entities/offer.entity';
import { Wishlists } from 'src/wishlists/entities/wishlist.entity';
import { Exclude, classToPlain } from 'class-transformer';

@Entity()
export class Users extends BasicEntity {
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  @Length(2, 30)
  username: string;

  @Column({
    type: 'varchar',
    default: 'Пока ничего не рассказал о себе',
  })
  @Length(2, 200)
  about: string;

  @Column({
    default: 'https://i.pravatar.cc/300',
  })
  avatar: string;

  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @OneToMany(() => Wishes, (wish) => wish.owner)
  wishes: Wishes[];

  @OneToMany(() => Offers, (offer) => offer.user)
  offers: Offers[];

  @OneToMany(() => Wishlists, (wishlist) => wishlist.owner)
  wishlists: Wishlists[];

  toJSON() {
    return classToPlain(this);
  }
}
