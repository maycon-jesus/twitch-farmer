import { defineStore } from 'pinia';

export const useUi = defineStore('ui', {
    state() {
        return {
            loadingCount: 0,
            drawerOpen: false,
        };
    },
    getters: {
        loading: (state) => {
            return state.loadingCount > 0;
        },
    },
    actions: {
        startLoading() {
            this.loadingCount++;
            console.log('startLoading', this.loadingCount);
        },
        endLoading() {
            this.loadingCount--;
            console.log('endLoading', this.loadingCount);
        },
        toggleDrawerOpen() {
            this.drawerOpen = !this.drawerOpen;
        },
        setDrawerOpen(value: boolean) {
            this.drawerOpen = value;
        },
    },
});
