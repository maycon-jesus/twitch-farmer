import { defineStore } from 'pinia'
import type { ChannelResume } from '~/types/Channels'
import { useUi } from '~/store/ui'

export const useTwitchChannels = defineStore('twitch-channels', {
    state() {
        return {
            api: useApi(),
            ui: useUi(),
            channels: [],
        } as {
            api: ReturnType<typeof useApi>
            ui: ReturnType<typeof useUi>
            channels: ChannelResume[]
        }
    },

    actions: {
        loadChannels(showLoading = true, force = false) {
            if (!force && this.channels.length > 0) return

            this.ui.startLoading()
            this.api('/twitch-channels')
                .then((d) => {
                    this.channels = d as any
                })
                .catch(() => {})
                .finally(() => {
                    this.ui.endLoading()
                })
        },
    },
})
