import { useUi } from '~/store/ui'
import { useUserDataStore } from '~/store/userData'

export default defineNuxtRouteMiddleware(async (to) => {
    const userStore = useUserDataStore()
    const ui = useUi()

    if (userStore.userData) return
    ui.startLoading('auth-middleware')

    try {
        await userStore.getUserData()
        ui.endLoading('auth-middleware')
    } catch (err) {
        ui.endLoading('auth-middleware')
        const userData = useUserDataStore()
        await userData.reset()
        return navigateTo(
            {
                name: 'index',
                query: {
                    redirectTo: String(to.name),
                },
            },
            { replace: true }
        )
    }
})
