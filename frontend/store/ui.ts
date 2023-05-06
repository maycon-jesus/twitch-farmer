import { defineStore } from 'pinia'

export const useUi = defineStore('ui', {
    state() {
        return {
            loadingCount: 0,
            loadingKeys: [] as string[],
            drawerOpen: false,
        }
    },
    getters: {
        loading: (state) => {
            return state.loadingCount > 0
        },
    },
    actions: {
        startLoading(key?: string) {
            if (key && this.loadingKeys.includes(key)) {
                return
            }
            if (key) this.loadingKeys.push(key)
            this.loadingCount++
            console.log('startLoading', key, this.loadingCount)
        },
        endLoading(key?: string) {
            if (key && !this.loadingKeys.includes(key)) return
            if (key) {
                this.loadingKeys = this.loadingKeys.filter((str) => str !== key)
            }
            this.loadingCount--
            console.log('endLoading', key, this.loadingCount)
        },
        toggleDrawerOpen() {
            this.drawerOpen = !this.drawerOpen
        },
        setDrawerOpen(value: boolean) {
            this.drawerOpen = value
        },
    },
})
