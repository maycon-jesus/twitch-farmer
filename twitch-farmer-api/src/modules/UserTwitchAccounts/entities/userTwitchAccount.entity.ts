import { UserEntity } from 'src/modules/Users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'twitch_accounts',
})
export class UserTwitchAccountEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  avatarUrl: string;

  @Column({
    unique: true,
  })
  twitchUserId: string;

  @Column()
  email: string;

  @ManyToOne(() => UserEntity, (user) => user.twitchAccounts, {
    nullable: false,
    eager: true,
  })
  owner: UserEntity;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  tokenExpiresAt: Date;

  @Column()
  tokenStatus: 'authorized' | 'unauthorized';
}
