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
        accountsRanks: Record<string, number>
        storeItems: any[],
        loaded: {
            accountsPoints: boolean,
            storeItems: boolean
        },
        loading: {
            accountsPoints: boolean,
            storeItems: boolean
        }
    } {
        return {
            channels: [],
            accounts: [],
            accountsPoints: {},
            accountsRanks: {},
            storeItems: [],
            loaded: {
                accountsPoints: false,
                storeItems: false
            },
            loading: {
                accountsPoints: false,
                storeItems: false
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
        }
    }
})
