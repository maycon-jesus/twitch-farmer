import { defineStore } from 'pinia'
import { useUi } from '~/store/ui'
import { ChannelResume } from '~/types/Channels'
import { AccountResume } from '~/types/Accounts'
import { ChannelStoreItem } from '~/types/ChannelStore'
import { ReturnType } from 'birpc'

export const useTwitchChannel = defineStore('twitch-channel', {
    state(): {
        api: ReturnType<typeof useApi>
        ui: ReturnType<typeof useUi>
        channel: ChannelResume | null
        accountsPoints: Record<string, {
            rank:number,
            points:number
        }>
        accountsCooldown: Record<string, number>,
        accountsInRedemptionBot: Record<string,boolean>
        accounts: AccountResume[]
        loaded: {
            channel: boolean
            accountsPoints: boolean
            accounts: boolean
            accountsCooldown: boolean
            accountsInRedemptionBot: boolean
        }
        modalItemDetails: {
            open: boolean
            item: ChannelStoreItem | null
        },
        modalRedemption: {
            open: boolean
            item: ChannelStoreItem | null
        }
    } {
        return {
            api: useApi(),
            ui: useUi(),
            channel: null,
            accountsPoints: {},
            accounts: [],
            accountsCooldown: {},
            accountsInRedemptionBot: {},
            loaded: {
                channel: false,
                accountsPoints: false,
                accounts: false,
                accountsCooldown: false,
                accountsInRedemptionBot:false
            },
            modalItemDetails: {
                open: false,
                item: null
            },
            modalRedemption: {
                open: false,
                item: null
            }
        }
    },

    actions: {
        getChannel(id: string) {
            const api = useApi()
            const ui = useUi()
            ui.startLoading()
            api('/twitch-channels/' + id)
                .then((r: any) => {
                    this.channel = r
                })
                .finally(() => {
                    ui.endLoading()
                    this.loaded.channel = true
                })
        },
        loadAccountsPoints(channelId: string) {
            this.accountsPoints = {}

            this.ui.startLoading()
            this.api(`/twitch-channels/${channelId}/accounts-points`)
                .then((data: any) => {
                    this.accountsPoints = data as any
                })
                .catch(() => {
                    this.accountsPoints = {}
                })
                .finally(() => {
                    this.ui.endLoading()
                    this.loaded.accountsPoints = true
                })

        },
        loadAccounts(showLoading = true, force = false) {
            if (!force && this.accounts.length > 0) return

            this.ui.startLoading()
            this.api('/twitch-accounts')
                .then((d: any) => {
                    this.accounts = d
                })
                .catch(() => {
                    this.accounts = []
                })
                .finally(() => {
                    this.ui.endLoading()
                    this.loaded.accounts = true
                })
        },
        loadAccountsCooldown(channelId: string) {
            const api = useApi()
            this.accountsCooldown = {}
            this.loaded.accountsCooldown = false
            api(`/twitch-channels/${channelId}/accounts-cooldown`)
                .then((data: any) => {
                    this.accountsCooldown = data as any
                })
                .catch(() => {
                    this.accountsCooldown = {}
                })
                .finally(() => {
                    this.loaded.accountsCooldown = true
                })
        },
        loadAccountsInRedemptionBot(channelId: string) {
            const api = useApi()
            this.accountsInRedemptionBot = {}
            this.loaded.accountsInRedemptionBot = false
            api(`/twitch-channels/${channelId}/accounts-in-redemption-bot`)
                .then((data: any) => {
                    this.accountsInRedemptionBot = data as any
                })
                .catch(() => {
                    this.accountsInRedemptionBot = {}
                })
                .finally(() => {
                    this.loaded.accountsInRedemptionBot = true
                })
        },
        accountsCanBuy(cost: number): AccountResume[] {
            const accounts = this.accounts
            const b = Object.entries(this.accountsPoints)
                .filter((a) => {
                    return a[1].points >= cost
                })
                .map((b) => {
                    return accounts.find((a) => a.id === b[0])
                })
                .filter((a) => !!a) as AccountResume[]
            return b
        },
        openModalItemDetails(item: ChannelStoreItem) {
            this.modalItemDetails.item = item
            this.modalItemDetails.open = true
        },
        closeModalItemDetails() {
            this.modalItemDetails.item = null
            this.modalItemDetails.open = false
        },
        openModalRedemption(item: ChannelStoreItem) {
            this.modalRedemption.item = item
            this.modalRedemption.open = true
        },
        closeModalRedemption() {
            this.modalRedemption.item = null
            this.modalRedemption.open = false
        }
    }
})
