import { useUi } from '~/store/ui';

export default defineNuxtRouteMiddleware(() => {
    const ui = useUi();

    ui.startLoading('page-loading');
});
