import { defineStore } from 'pinia'
import { useUi } from '~/store/ui'
import { ChannelResume } from '~/types/Channels'
import { AccountResume } from '~/types/Accounts'
import { ChannelStoreItem } from '~/types/ChannelStore'
import { ReturnType } from 'birpc'

export const useResgatador = defineStore('resgatador', {
    state(): {
        channels: ChannelResume[]
        accounts: AccountResume[]
        accountsPoints: Record<string, {
            rank: number,
            points: number
        }>
        accountsCooldown: Record<string, number>,
        accountsInRedemptionBot: Record<string, boolean>,
        storeItems: any[],
        loaded: {
            accountsPoints: boolean,
            storeItems: boolean
            accountsCooldown: boolean
            accountsInRedemptionBot:boolean
        },
        loading: {
            accountsPoints: boolean,
            storeItems: boolean
            accountsCooldown: boolean
            accountsInRedemptionBot:boolean
        }
    } {
        return {
            channels: [],
            accounts: [],
            accountsPoints: {},
            accountsCooldown:{},
            accountsInRedemptionBot: {},
            storeItems: [],
            loaded: {
                accountsPoints: false,
                storeItems: false,
                accountsCooldown: false,
                accountsInRedemptionBot:false
            },
            loading: {
                accountsPoints: false,
                storeItems: false,
                accountsCooldown: false,
                accountsInRedemptionBot:false
            }
        }
    },

    actions: {
        loadAccounts() {
            const api = useApi()
            const ui = useUi()
            ui.startLoading()
            api('/twitch-accounts')
                .then((r: any) => {
                    this.accounts = r
                })
                .finally(() => {
                    ui.endLoading()
                })
        },
        loadChannels() {
            const api = useApi()
            const ui = useUi()
            ui.startLoading()
            api('/twitch-channels')
                .then((r: any) => {
                    this.channels = r
                })
                .finally(() => {
                    ui.endLoading()
                })
        },
        loadItems(channelId: string) {
            const $api = useApi()

            this.loaded.storeItems = false
            this.loading.storeItems = true
            $api(`/twitch-channels/${channelId}/store/items`, {
                params:{
                    hideDeleted: true
                }
            })
                .then((_items) => {
                    this.storeItems = _items as any[]
                    this.loaded.storeItems = true
                })
                .finally(() => {
                    this.loading.storeItems = false
                })
        },
        loadAccountsPoints(channelId: string) {
            const api = useApi()
            this.accountsPoints = {}
            this.loaded.accountsPoints = false
            this.loading.accountsPoints=true
            // let remaing = this.accounts.length
            // this.accounts.forEach((account) => {
            //     api(`/twitch-channels/${channelId}/${account.id}/points`)
            //         .then((data: any) => {
            //             this.accountsPoints[account.id] = data.points as any
            //         })
            //         .catch(() => {
            //             this.accountsPoints[account.id] = 0
            //         })
            //         .finally(() => {
            //             remaing--
            //             if (remaing === 0) {
            //                 this.loaded.accountsPoints = true
            //                 this.loading.accountsPoints=false
            //             }
            //         })
            // })
            api(`/twitch-channels/${channelId}/accounts-points`)
                .then((data: any) => {
                    this.accountsPoints = data as any
                })
                .catch(() => {
                    this.accountsPoints = {}
                })
                .finally(() => {
                        this.loaded.accountsPoints = true
                        this.loading.accountsPoints=false
                })
        },
        loadAccountsCooldown(channelId: string) {
            const api = useApi()
            this.accountsCooldown = {}
            this.loaded.accountsCooldown = false
            this.loading.accountsCooldown=true
            api(`/twitch-channels/${channelId}/accounts-cooldown`)
                .then((data: any) => {
                    this.accountsCooldown = data as any
                })
                .catch(() => {
                    this.accountsCooldown = {}
                })
                .finally(() => {
                    this.loaded.accountsCooldown = true
                    this.loading.accountsCooldown=false
                })
        },
        loadAccountsInRedemptionBot(channelId: string) {
            const api = useApi()
            this.accountsInRedemptionBot = {}
            this.loaded.accountsInRedemptionBot = false
            this.loading.accountsInRedemptionBot=true
            api(`/twitch-channels/${channelId}/accounts-in-redemption-bot`)
                .then((data: any) => {
                    this.accountsInRedemptionBot = data as any
                })
                .catch(() => {
                    this.accountsInRedemptionBot = {}
                })
                .finally(() => {
                    this.loaded.accountsInRedemptionBot = true
                    this.loading.accountsInRedemptionBot=false
                })
        }
    }
})
