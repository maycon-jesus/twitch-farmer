import { defineStore } from 'pinia'

export const useUserDataStore = defineStore('user-data', {
    state() {
        return {
            userData: null as null | { id: string; role: string; firstName: string; lastName: string },
            $api: useApi(),
        }
    },
    actions: {
        async getUserData() {
            this.userData = await this.$api<any>('/users/me')
        },
        async reset() {
            const cookie = useCookie('auth-token')
            this.userData = null
            cookie.value = null
        },
    },
})
