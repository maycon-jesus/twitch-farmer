import { UserTwitchChannelsEntity } from 'src/modules/UserTwitchChannels/entities/userTwitchChannels.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'twitch_channels',
})
export class TwitchChannelEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  username: string;

  @Column()
  displayName: string;

  @Column()
  avatarUrl: string;

  @Column({
    unique: true,
  })
  twitchUserId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserTwitchChannelsEntity, (t) => t.channel)
  usersChannels: UserTwitchChannelsEntity[];
}
