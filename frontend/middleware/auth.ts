import { useUi } from '~/store/ui';
import { useUserDataStore } from '~/store/userData';

export default defineNuxtRouteMiddleware(async (to) => {
    const userStore = useUserDataStore();
    const ui = useUi();
    ui.startLoading();

    if (userStore.userData) return;

    try {
        await userStore.getUserData();
        ui.endLoading();
    } catch (err) {
        ui.endLoading();
        return navigateTo(
            {
                name: 'index',
                query: {
                    redirectTo: String(to.name),
                },
            },
            { replace: true }
        );
    }
});
