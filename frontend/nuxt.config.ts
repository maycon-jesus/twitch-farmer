import vuetify from 'vite-plugin-vuetify';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    // @ts-ignore
    ssr: false,

    runtimeConfig: {
        public: {
            API_BASE_URL: process.env.API_BASE_URL,
            APP_URL: process.env.APP_URL
        }
    },

    css: ['~/assets/css/reset.css', 'vuetify/styles'],

    modules: ['unplugin-icons/nuxt', 'nuxt-icons', '@pinia/nuxt'],
    plugins: ['~/plugins/loading', '~/plugins/vuetify'],

    vite: {
        plugins: [
            vuetify({
                styles: {
                    configFile: '/assets/css/vuetify.scss'
                }
            })
        ]
    },

    build: {
        transpile: ['vuetify']
    }
});
