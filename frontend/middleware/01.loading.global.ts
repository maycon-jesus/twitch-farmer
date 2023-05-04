import { useUi } from '~/store/ui'

export default defineNuxtRouteMiddleware((to, from) => {
    const ui = useUi()
    if (to.name === from.name) return
    ui.startLoading('page-loading')
})
