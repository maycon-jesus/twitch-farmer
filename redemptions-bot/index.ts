import axios from "axios"
import dotenv from "dotenv"
import WebSocket from "ws"
import {WebShareProxyModule} from "./modules/WebShareProxy";

dotenv.config()

const webShareProxy = new WebShareProxyModule()

let start = Date.now()
let end = Date.now()

let queue: Record<string, {
    "id": string,
    "itemId": string,
    "accountId": string,
    "channelId": string,
    "ownerId": string,
    "completed": 0 | 1,
    "inputs": string[],
    "priority": number,
    "createdAt": string,
    "updatedAt": string,
    "streamElementsToken": string,
    "cooldownGlobal": number
}[]> = {}
let channels: string[] = []
const queueRunEnabled: Record<string, "stop" | "run" | "wait"> = {}

async function enableResgate(itemId: string, force?: boolean) {
    if (queueRunEnabled[itemId] === "wait" && !force) return;
    console.log('Ligando fila')
    start = Date.now()

    queueRunEnabled[itemId] = "run"

    do {
        const queueOfItem = queue[itemId]
        if (queueOfItem.length <= 0) {
            queueRunEnabled[itemId] = "stop"
            continue;
        }
        console.log('Tentando resgatar...')
        const item = queueOfItem[0]
        const body = {
            input: item.inputs
        }
        await axios.post(`https://api.streamelements.com/kappa/v2/store/${item.channelId}/redemptions/${item.itemId}`, body, {
            headers: {
                'Authorization': "Bearer " + item.streamElementsToken
            },
            proxy: webShareProxy.getRandomProxyForAxios()
        })
            .then(async () => {
                queueOfItem.splice(0, 1)
                console.log('Resgatado com sucesso!')
                console.log(Date.now() - start)
            })
            .catch(err => {
                console.log('g', err.response?.data?.message)
                if (err.response?.data?.message === 'Item is Out of stock') {
                    queueRunEnabled[itemId] = "stop"
                }
                if (err.response?.data?.message === 'Sorry you don\'t have enough points') {
                    queueOfItem.splice(0, 1)
                }
                if (err.response?.data?.message === 'You are redeeming too fast') {
                    queueOfItem.splice(0, 1)
                }
            })
    } while (queueRunEnabled[itemId] === "run")
}

async function disableTempResgate(itemId: string, time: number) {
    console.log('a', time * 1000)
    queueRunEnabled[itemId] = "wait"
    setTimeout(() => {
        queueRunEnabled[itemId] = "run"
        enableResgate(itemId)
    }, time * 1000 - 1000)
}

function updateQueue() {
    axios.get(`${process.env.API_URL}/service/redemptions-queue`)
        .then(rQueue => {
            queue = rQueue.data.items
            channels = rQueue.data.channels
        })
        .finally(() => {
            setTimeout(() => {
                updateQueue()
            }, 60000)
        })
}

updateQueue()

const wss = new WebSocket("wss://realtime.streamelements.com/socket.io/?cluster=main&EIO=3&transport=websocket", {})

wss.on('open', () => {
    console.log('OPen')
    const interval = setInterval(function () {
        wss.send('2');
        channels.forEach(channel => {
            wss.send(`420["subscribe",{"room":"store::${channel}"}]`)
        })
    }, 15000)

    wss.once('close', () => {
        process.exit()
    })
})
wss.on('message', (m) => {
    const data = m.toString()
    if (data.startsWith("42[")) {
        const datajson: {
            itemId: string,
            data: {
                enabled?: boolean,
                name: string,
                quantity: {
                    total: number,
                    current: number
                }
            }
        } = JSON.parse(data.slice(2))[1]
        if (!datajson) return
        const queueList = queue[datajson.itemId]
        if (!queueList || queueList.length <= 0) return;
        const hasStock = !!datajson.data.quantity.current || datajson.data.quantity.total === -1 || datajson.data.quantity.current === -1;

        if (datajson.data.enabled === false || !hasStock) {
            console.log('Parando fila', !datajson.data.enabled, !hasStock)
            queueRunEnabled[datajson.itemId] = "stop"
        } else if (datajson.data.enabled === true && hasStock) {
            enableResgate(datajson.itemId)
                .then(() => {
                    console.log('succ1')
                })
                .catch((e) => {
                    console.log('err1', e)
                })
        }

        if (datajson.data.enabled === undefined && datajson.data.quantity.current) {
            const item = queueList[0]
            disableTempResgate(datajson.itemId, item.cooldownGlobal).then(() => {
            }).catch(() => {
            })
        }
    }
})