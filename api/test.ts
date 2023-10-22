import { registerWebhookInCategory, sendMessageToCategory } from 'discord-webhook-util';

// Adiciona um webhook em uma categoria
// registerWebhookInCategory(categoryName, url)
registerWebhookInCategory('global', 'https://discord.com/api/webhooks/574258181082185728/IKAh73erXeKarevghNg9h2xqPNtSp4gVWUkT7rTC8Q7bPfcv1_5bVkvda0OUUgKUeDHm');

setTimeout(()=>{
    // Enviar mensagem para todos os webhooks que estão em uma categoria
    sendMessageToCategory('global', {
        content: 'aaa',
        embeds: [{

        }]
    })
        .then(() => {
            console.log('Mensagem enviada com sucesso!');
        })
        .catch(err => {
            console.error(err);
        });
}, 200)