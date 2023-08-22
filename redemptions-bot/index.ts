import axios from "axios"
import dotenv from "dotenv"
import WebSocket from "ws"
import {WebShareProxyModule} from "./modules/WebShareProxy";

dotenv.config()

const wss = new WebSocket("wss://realtime.streamelements.com/socket.io/?cluster=main&EIO=3&transport=websocket", {})
const webShareProxy = new WebShareProxyModule()

let ping = 0
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
    if (queueRunEnabled[itemId] === "run") return;
    if (queueRunEnabled[itemId] === "wait" && !force) return;
    console.log('Ligando fila')

    queueRunEnabled[itemId] = "run"

    do {
        const queueOfItem = queue[itemId]
        if (!queueOfItem || queueOfItem.length <= 0) {
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
            .then(async (response) => {
                queueOfItem.splice(0, 1)
                console.log('Resgatado com sucesso!')
                axios.post(`${process.env.API_URL}/service/redemptions-queue/${item.id}/status`, {
                    completed: true,
                    error: false,
                    accessCode: response.data.accessCode
                }).then(()=>{}).catch(()=>{})
            })
            .catch(err => {
                console.log('g', err.response?.data?.message)
                const errorBody = {
                    completed: true,
                    error: true,
                    errorReason: err.response?.data?.message
                }
                const sendError = ()=>{
                    axios.post(`${process.env.API_URL}/service/redemptions-queue/${item.id}/status`, errorBody).then(()=>{}).catch(()=>{})
                }
                if (err.response?.data?.message === 'Item is Out of stock') {
                    queueRunEnabled[itemId] = "stop"
                }
                if (err.response?.data?.message === 'Sorry you don\'t have enough points') {
                    queueOfItem.splice(0, 1)
                    sendError()
                }
                if (err.response?.data?.message === 'You are redeeming too fast') {
                    queueOfItem.splice(0, 1)
                    sendError()
                }
            })
    } while (queueRunEnabled[itemId] === "run")
}

async function disableTempResgate(itemId: string, time: number) {
    console.log('Esperar 2')
    queueRunEnabled[itemId] = "wait"
    setTimeout(() => {
        console.log('Finalizar fila')
        enableResgate(itemId, true)
    }, time * 1000)
}

function updateQueue() {
    axios.get(`${process.env.API_URL}/service/redemptions-queue`)
        .then(rQueue => {
            queue = rQueue.data.items
            channels = rQueue.data.channels

            if(wss.readyState === wss.OPEN){
                channels.forEach((channel,index)=>{
                    setTimeout(()=>{
                        wss.send(`420["subscribe",{"room":"store::${channel}"}]`)
                    },index*1000)
                })
            }
        })
        .finally(() => {
            setTimeout(() => {
                updateQueue()
            }, 60000)
        })
}

updateQueue()

wss.on('open', () => {
    console.log('OPen')
    const interval = setInterval(function () {
        wss.send('2');
    }, 15000)

    channels.forEach((channel,index)=>{
        setTimeout(()=>{
            wss.send(`420["subscribe",{"room":"store::${channel}"}]`)
        },index*1000)
    })

    wss.once('close', () => {
        console.log('Exit process')
        clearInterval(interval)
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
        console.log(datajson)
        const queueList = queue[datajson.itemId]
        if (!queueList || queueList.length <= 0) return;
        const hasStock = !!datajson.data.quantity.current || datajson.data.quantity.total === -1;

        if (datajson.data.enabled === false || !hasStock) {
            console.log('Parando fila', !datajson.data.enabled, !hasStock)
            queueRunEnabled[datajson.itemId] = "stop"
            // @ts-ignore
        } else if (datajson.data.enabled === true && hasStock) {
            enableResgate(datajson.itemId)
                .then(() => {
                    console.log('succ1')
                })
                .catch((e) => {
                    console.log('err1', e)
                })
        }

        if (datajson.data.enabled === undefined && hasStock) {
            console.log('Esperar 1')
            const item = queueList[0]
            disableTempResgate(datajson.itemId, item.cooldownGlobal-(ping/1000)-0.4).then(() => {
            }).catch(() => {
            })
        }
    }
})

function execPing(){
    if(wss.readyState === wss.OPEN){
        let startPing = Date.now()
        wss.ping()
        wss.once('pong',()=>{
            // console.log('endPing', Date.now()-startPing)
            ping=Date.now()-startPing
            setTimeout(()=>{
                execPing()
            },2000)
        })
    }else{
        setTimeout(()=>{
            execPing()
        },2000)
    }
}
execPing()