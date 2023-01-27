import { TwitchChannelEntity } from 'src/modules/TwitchChannels/entities/twitchChannel.entity';
import { UserEntity } from 'src/modules/Users/entities/user.entity';
import {
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'user_twitch_channels',
})
export class UserTwitchChannelsEntity {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  channelId: number;

  @ManyToOne(() => UserEntity, (t) => t.twitchChannels, {
    nullable: false,
  })
  user: UserEntity;

  @ManyToOne(() => TwitchChannelEntity, (t) => t.usersChannels, {
    nullable: false,
  })
  channel: TwitchChannelEntity;
}
