import { ControllerBase } from '../base/Controller';
import axios from "axios"

export class NtfyController extends ControllerBase {
    makeRedemptionMessage(data: {
        itemName:string,
        channelName: string,
        accountName:string,
        accessCode?:string
    }){
        const messageArr = [
            `**Item:** ${data.itemName}`,
            `**Canal:** ${data.channelName}`,
            `**Conta:** ${data.accountName}`
        ]
        if(data.accessCode){
            messageArr.push('**Código:**')
            messageArr.push(`\`\`\`\n${data.accessCode}\n\`\`\``)
        }
        return {
            topic:'test',
            title: 'Item resgatado com sucesso!',
            message: messageArr.join('\n'),
            markdown: true,
            tags:['tada'],
            actions:[{
                action:'view',
                label:'Visualizar resgates',
                url: `${process.env.FRONTEND_URL}/dashboard/resgates`
            }]
        }
    }
    sendMessage(message:any){
        axios.post('https://ntfy.mayconjesus.dev', message, {
            headers: { 'Authorization':`Bearer ${process.env.NTFY_TOKEN}` }
        })
    }

    async sendMessageToUser(userId:string, message:any){
        const user = await this.dd.users.findOne(userId)
        if(user.ntfyTopicName){
            message.topic=user.ntfyTopicName
            await this.sendMessage(message)
        }
    }
}