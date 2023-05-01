import { useUi } from '~/store/ui';

export default defineNuxtPlugin((nuxtApp) => {
    const ui = useUi();

    nuxtApp.hook('page:finish', () => {
        console.log('hook:page:finish');
        ui.endLoading('page-loading');
    });
});