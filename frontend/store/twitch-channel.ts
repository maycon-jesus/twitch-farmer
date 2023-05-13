import { defineStore } from 'pinia'
import { useUi } from '~/store/ui'
import { twitchChannel } from '~/types/Channels'
import { AccountResume } from '~/types/Accounts'
import { ChannelStoreItem } from '~/types/ChannelStore'

const api = useApi()
const ui = useUi()

export const useTwitchChannel = defineStore('twitch-channel', {
    state(): {
        channel: twitchChannel | null
        accountsPoints: Record<string, number>
        accounts: AccountResume[]
        loaded: {
            channel: boolean
            accountsPoints: boolean
            accounts: boolean
        }
        modalItemDetails: {
            open: boolean
            item: ChannelStoreItem | null
        }
    } {
        return {
            channel: null,
            accountsPoints: {},
            accounts: [],
            loaded: {
                channel: false,
                accountsPoints: false,
                accounts: false,
            },
            modalItemDetails: {
                open: false,
                item: null,
            },
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
            let remaing = this.accounts.length
            this.accounts.forEach((account) => {
                ui.startLoading()
                api(`/twitch-channels/${channelId}/${account.id}/points`)
                    .then((data: any) => {
                        this.accountsPoints[account.id] = data.points as any
                    })
                    .catch(() => {
                        this.accountsPoints[account.id] = 0
                    })
                    .finally(() => {
                        ui.endLoading()
                        remaing--
                        if (remaing === 0) {
                            this.loaded.accountsPoints = true
                        }
                    })
            })
        },
        loadAccounts(showLoading = true, force = false) {
            if (!force && this.accounts.length > 0) return

            ui.startLoading()
            api('/twitch-accounts')
                .then((d: any) => {
                    this.accounts = d
                })
                .catch(() => {
                    this.accounts = []
                })
                .finally(() => {
                    ui.endLoading()
                    this.loaded.accounts = true
                })
        },
        accountsCanBuy(cost: number): AccountResume[] {
            const accounts = this.accounts
            return Object.entries(this.accountsPoints)
                .filter((a) => a[1] >= cost)
                .map(() => accounts.find((a) => a.id))
                .filter((a) => !!a) as AccountResume[]
        },
        openModalItemDetails(item: ChannelStoreItem) {
            this.modalItemDetails.item = item
            this.modalItemDetails.open = true
        },
        closeModalItemDetails() {
            this.modalItemDetails.item = null
            this.modalItemDetails.open = false
        },
    },
})
