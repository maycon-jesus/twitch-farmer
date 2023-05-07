import { defineStore } from 'pinia'
import { useUi } from '~/store/ui'

type TwitchAccount = {
    id: string
    profileImageUrl: string
    email: string
    displayName: string
    streamElementsToken: null | string
}

export const useTwitchAccount = defineStore('twitch-account', {
    state(): {
        account: TwitchAccount | null
    } {
        return {
            account: null,
        }
    },

    actions: {
        getAccount(id: string) {
            const api = useApi()
            const ui = useUi()
            ui.startLoading()
            api('/twitch-accounts/' + id)
                .then((r: any) => {
                    this.account = r
                })
                .finally(() => {
                    ui.endLoading()
                })
        },
    },
})
