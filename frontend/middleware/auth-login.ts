import { useUi } from '~/store/ui'
import { useUserDataStore } from '~/store/userData'

export default defineNuxtRouteMiddleware(async (to) => {
    const userStore = useUserDataStore()
    const ui = useUi()
    ui.startLoading('auth-login')

    try {
        await userStore.getUserData()
        ui.endLoading('auth-login')
        return navigateTo(
            {
                name: 'dashboard'
            },
            { replace: true }
        )
    } catch (err) {
        ui.endLoading('auth-login')
        const userData = useUserDataStore()
        await userData.reset()
    }
})
