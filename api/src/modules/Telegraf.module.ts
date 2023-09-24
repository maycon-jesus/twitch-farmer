import { Telegraf } from 'telegraf';
import { ServiceBase } from '../base/Service';

export class TelegrafModule extends ServiceBase {
    telegraf: Telegraf;

    constructor() {
        super();
        this.telegraf = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);
        this.startTelegraf();
    }

    startTelegraf() {
        this.telegraf.command('ativar', (ctx) => {
            if (ctx.chat.type !== 'private') return;
            this.dd.notifications.setTelegramChatId(ctx.chat.username!, ctx.chat.id.toString())
                .then(() => {
                    ctx.reply('Notificações ativadas com sucesso!');
                })
                .catch((err) => {
                    ctx.reply(err.message);
                });
        });
        this.telegraf.launch().then(() => {
        }).catch();
    }

    async sendMessage(chatId: string,message:string) {
        await this.telegraf.telegram.sendMessage(chatId, message, {
            parse_mode: 'MarkdownV2'
        });
    }
}