import { ControllerBase } from '../base/Controller';
import { TelegrafModule } from '../modules/Telegraf.module';

type NotificationSettings = {
    userId: string,
    enableRedemptions: 0 | 1,
    enableWhispers: 0 | 1,
    telegramUsername: string | null
    telegramChatId: string | null
}

export class NotificationsController extends ControllerBase {
    private telegraf: TelegrafModule = new TelegrafModule();

    async getUserSettings(userId: string): Promise<NotificationSettings> {
        const userSettings: NotificationSettings | undefined = await this.dd.database.db('notifications_settings').where({ userId }).first();
        return userSettings as any || {
            userId,
            enableRedemptions: 1,
            enableWhispers: 1
        };
    }

    async updateUserSettings(userId: string, settings: Partial<NotificationSettings>) {
        const userSettings = await this.dd.database.db('notifications_settings').where({ userId }).first();
        if (!userSettings) {
            await this.dd.database.db('notifications_settings').insert({
                userId,
                ...settings
            });
        } else {
            await this.dd.database.db('notifications_settings').update({
                ...settings
            }).where({ userId });
        }
    }

    async setTelegramChatId(telegramUsername: string, telegramChatId: string) {
        const userFind = await this.dd.database.db('notifications_settings').where({ telegramUsername }).first();
        if (!userFind) throw new Error('Nenhuma conta encontrada para vincular o seu telegram a ela!');
        await this.dd.database.db('notifications_settings').update({
            telegramChatId
        }).where({ telegramUsername });
    }

    async sendRedemptionNotification(userId: string, data: {
        itemName: string,
        channelName: string,
        accountName: string,
        accessCode?: string
    }) {
        const userSettings = await this.getUserSettings(userId);
        if (!userSettings.enableRedemptions) return;
        if (userSettings.telegramChatId) {
            const message = [
                '*🎉 Item resgatado com sucesso*',
                '',
                `*Item:* ${data.itemName}`,
                `*Canal:* ${data.channelName}`,
                `*Conta:* ${data.accountName}`
            ];
            if (data.accessCode) {
                message.push('');
                message.push(`Código: \`${data.accessCode}\``);
            }
            try{
                this.telegraf.sendMessage(userSettings.telegramChatId, message.join('\n'));
            }catch(e){
                console.log(e)
            }
        }
    }

    async sendWhisperNotification(userId: string, data: {
        fromUser: string,
        toUser: string,
        toUserId:string
    }) {
        const userSettings = await this.getUserSettings(userId);
        console.log(userSettings)
        if (!userSettings.enableWhispers) return;
        if (userSettings.telegramChatId) {
            const message = [
                `💬 Você recebeu um susurro na twitch de *${data.fromUser}* na conta *[${data.toUser}](${process.env.FRONTEND_URL}/dashboard/conta/${data.toUserId})*\\.`,
            ];
            try{
                this.telegraf.sendMessage(userSettings.telegramChatId, message.join('\n'));
            }catch(e){
                console.log(e)
            }
        }
    }
}