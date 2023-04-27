import { createVuetify } from 'vuetify';
import { md3 } from 'vuetify/blueprints';

export default defineNuxtPlugin((nuxt) => {
    const vuetify = createVuetify({
        blueprint: md3,
        ssr: false,
        theme: {
            defaultTheme: 'dark',
            themes: {
                dark: {
                    dark: true,
                    colors: {
                        primary: '#907ad6',
                        secondary: '#dabfff',
                        background: '#2c2a4a',
                        surface: '#3E3E6B',
                    },
                },
            },
        },
    });

    nuxt.vueApp.use(vuetify);
});
