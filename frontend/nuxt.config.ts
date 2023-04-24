import vuetify from 'vite-plugin-vuetify';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,

    runtimeConfig: {
        public: {
            API_BASE_URL: process.env.API_BASE_URL,
        },
    },

    css: ['~/assets/css/destyle.css', 'vuetify/styles'],

    modules: ['unplugin-icons/nuxt', 'nuxt-icons', '@pinia/nuxt'],
    plugins: ['~/plugins/vuetify'],

    vite: {
        plugins: [
            vuetify({
                styles: {
                    configFile: '/assets/css/vuetify.scss',
                },
            }),
        ],
    },

    build: {
        transpile: ['vuetify'],
    },
});
