import { Entity, Column, ManyToOne } from 'typeorm';
import { BasicEntity } from 'src/utils/basic.entity';
import { Users } from 'src/users/entities/user.entity';
import { Wishes } from 'src/wishes/entities/wish.entity';

@Entity()
export class Offers extends BasicEntity {
  @ManyToOne(() => Users, (user) => user.offers)
  user: Users;

  @ManyToOne(() => Wishes, (wish) => wish.offers)
  item: Wishes;

  @Column({
    type: 'numeric',
    scale: 2,
  })
  amount: number;

  @Column({
    default: false,
  })
  hidden: boolean;
}
