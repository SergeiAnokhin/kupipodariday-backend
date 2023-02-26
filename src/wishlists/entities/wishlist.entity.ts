import { Length } from 'class-validator';
import { Users } from 'src/users/entities/user.entity';
import { BasicEntity } from 'src/utils/basic.entity';
import { Wishes } from 'src/wishes/entities/wish.entity';
import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';

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
