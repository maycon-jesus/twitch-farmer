export const useApi = () => {
    const config = useRuntimeConfig()

    return $fetch.create({
        baseURL: config.public.API_BASE_URL,
        onRequest(ctx) {
            const authToken = useCookie('auth-token')
            if (!ctx.options.headers) {
                ctx.options.headers = {}
                if (authToken.value) ctx.options.headers.authorization = authToken.value
            }
        },
        onRequestError(err) {
            if (navigator.onLine) {
                console.error(err)
                const router = useRouter()
                router
                    .push({
                        name: 'index',
                        query: {
                            'error-message': 'Estamos em manutenção no momento. Por favor aguarde...',
                        },
                    })
                    .then()
            } else {
                alert('Não foi possivel concluir a ação. Você esta offline no momento!')
            }
            throw 'unknown'
        },
        onResponseError(err) {
            throw err.response._data
        },
    })
}
