import { TwitchAccountEntity } from 'src/modules/TwitchAccounts/entities/twitchAccount.entity';
import { Entity, OneToMany } from 'typeorm';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'users',
})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => TwitchAccountEntity, (t) => t.twitchUserId)
  twitchAccounts: TwitchAccountEntity[];
}
