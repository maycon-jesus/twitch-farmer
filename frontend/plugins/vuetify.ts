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
                    dark: false,
                    colors: {
                        // primary: '#907ad6',
                        primary: '#dabfff',
                        secondary: '#dabfff',
                        background: '#2c2a4a',
                        surface: '#3E3E6B',
                        'text-surface': '#ffffff',
                        error: '#e74c3c'
                    }
                }
            }
        }
    });

    nuxt.vueApp.use(vuetify);
});
