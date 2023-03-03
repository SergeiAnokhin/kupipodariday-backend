import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Length } from 'class-validator';
import { BasicEntity } from 'src/utils/basic.entity';
import { Users } from 'src/users/entities/user.entity';
import { Wishes } from 'src/wishes/entities/wish.entity';

@Entity()
export class Wishlists extends BasicEntity {
  @Column({
    type: 'varchar',
  })
  @Length(1, 250)
  name: string;

  @Column({
    type: 'varchar',
  })
  @Length(1, 1500)
  description: string;

  @Column()
  image: string;

  @ManyToOne(() => Users, (user) => user.wishlists)
  owner: Users;

  @ManyToMany(() => Wishes)
  @JoinTable()
  items: Wishes[];
}
