import { defineStore } from 'pinia'
import { ChannelResume } from '~/types/Channels'
import { useUi } from '~/store/ui'

const api = useApi()
const ui = useUi()
export const useTwitchChannels = defineStore('twitch-channels', {
    state() {
        return {
            channels: [],
        } as {
            channels: ChannelResume[]
        }
    },

    actions: {
        loadChannels(showLoading = true, force = false) {
            if (!force && this.channels.length > 0) return

            ui.startLoading()
            api('/twitch-channels')
                .then((d) => {
                    this.channels = d as any
                })
                .catch(() => {})
                .finally(() => {
                    ui.endLoading()
                })
        },
    },
})
