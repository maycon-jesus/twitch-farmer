import { defineStore } from 'pinia';

export const useUserDataStore = defineStore('user-data', {
    state() {
        return {
            userData: null as null | { id: string; role: string; firstName: string; lastName: string },
            $api: useApi(),
        };
    },
    actions: {
        async getUserData() {
            const userData = await this.$api<any>('/users/me');
            this.userData = userData;
        },
    },
});
