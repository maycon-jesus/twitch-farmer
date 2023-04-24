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
            console.log('al');
            this.loadingCount++;
        },
        endLoading() {
            this.loadingCount--;
        },
    },
});
