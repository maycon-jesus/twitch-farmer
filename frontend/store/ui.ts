import { defineStore } from 'pinia';

export const useUi = defineStore('ui', {
    state() {
        return {
            loadingCount: 0,
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
    },
});
