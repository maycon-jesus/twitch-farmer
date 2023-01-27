import { UserTwitchChannelsEntity } from './../../UserTwitchChannels/entities/userTwitchChannels.entity';
import { UserTwitchAccountEntity } from 'src/modules/UserTwitchAccounts/entities/userTwitchAccount.entity';
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

  @OneToMany(() => UserTwitchAccountEntity, (t) => t.owner)
  twitchAccounts: UserTwitchAccountEntity[];

  @OneToMany(() => UserTwitchChannelsEntity, (t) => t.user)
  twitchChannels: UserTwitchChannelsEntity[];
}
