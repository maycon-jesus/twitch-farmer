export const useApi = () => {
    const config = useRuntimeConfig();

    return $fetch.create({
        baseURL: config.public.API_BASE_URL,
        onRequest(ctx) {
            const authToken = useCookie('auth-token');
            if (!ctx.options.headers) {
                ctx.options.headers = {};
                if (authToken.value) ctx.options.headers.authorization = authToken.value;
            }
        },
    });
};
