import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { IsUrl, Length } from 'class-validator';
import { BasicEntity } from 'src/utils/basic.entity';
import { Offers } from 'src/offers/entities/offer.entity';
import { Users } from 'src/users/entities/user.entity';

@Entity()
export class Wishes extends BasicEntity {
  @Column({
    type: 'varchar',
  })
  @Length(1, 250)
  name: string;

  @Column()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({
    type: 'numeric',
    scale: 2,
  })
  price: number;

  @Column({
    scale: 2,
    default: 0,
  })
  raised: number;

  @ManyToOne(() => Users, (user) => user.wishes)
  owner: Users;

  @Column({
    type: 'varchar',
  })
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offers, (offer) => offer.item)
  offers: Offers[];

  @Column({
    scale: 0,
    default: 0,
  })
  copied: number;
}
