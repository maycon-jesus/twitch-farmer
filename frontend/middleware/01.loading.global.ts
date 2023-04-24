import { useUi } from '~/store/ui';

export default defineNuxtRouteMiddleware((to) => {
    const ui = useUi();
    const app = useNuxtApp();
    const hookDefined = useState('loading-paga-hook-defined', () => false);

    ui.startLoading();

    if (!hookDefined.value) {
        app.hook('page:finish', () => {
            console.log('alo');
            ui.endLoading();
        });
        hookDefined.value = true;
    }
});
