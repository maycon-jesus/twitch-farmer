<template>
    <div
        :class="{
            'pa-4': $vuetify.display.xs,
            'pa-6': !$vuetify.display.xs,
        }"
        class='wrapper'
    >
        <v-card class='card-login'>
            <v-container fluid>
                <v-row v-if='errorMessage'>
                    <v-col cols='12'>
                        <LazyRegisterLoginErrorMessage :message='errorMessage' />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols='12'>
                        <div class='titles-wrapper'>
                            <h1 class='text-h4'>Twitch Farmer BOT</h1>
                        </div>
                    </v-col>
                </v-row>
                <RegisterLoginSelector />
                <v-form v-model='formValid' :disabled='formLoading' @submit.prevent='onSubmit'>
                    <v-row>
                        <v-col cols='12'>
                            <v-text-field
                                v-model='data.email'
                                :rules='[validators.email]'
                                autocomplete='email'
                                label='Email'
                                name='email'
                            ></v-text-field>
                        </v-col>
                        <v-col cols='12'>
                            <FormTextFieldPassword
                                v-model='data.password'
                                :rules='[validators.password]'
                                autocomplete='current-password'
                                label='Digite a senha novamente'
                                name='current-password'
                            ></FormTextFieldPassword>
                        </v-col>
                    </v-row>
                    <v-expand-transition v-show='apiError'>
                        <v-row>
                            <v-col cols='12'>
                                <v-alert :icon='iconError' type='error'>{{ apiError }}</v-alert>
                            </v-col>
                        </v-row>
                    </v-expand-transition>
                    <v-row justify='center'>
                        <v-col cols='auto'>
                            <v-btn :loading='formLoading' size='large' type='submit'>Entrar</v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-container>
        </v-card>
    </div>
</template>

<script lang='ts' setup>
import iconError from '~icons/material-symbols/error-rounded';
import { ref } from 'vue';
import { z } from 'zod';

const $api = useApi();
const router = useRouter();
const route = useRoute();

const formValid = ref(false);
const formLoading = ref(false);
const apiError = ref<null | string>(null);
const errorMessage = ref<null | string>((route.query['error-message'] as string) || null);
const data = reactive({
    email: sessionStorage.getItem('login.email') || '',
    password: sessionStorage.getItem('login.password') || ''
});

const validators = {
    email: (val: any) => {
        const validator = z
            .string({
                required_error: 'O email é um campo obrigatório'
            })
            .email('Informe um email válido');

        const validation = validator.safeParse(val);
        if (validation.success) {
            data.email = validation.data;
            return true;
        }
        return validation.error.errors[0].message;
    },
    password: (val: any) => {
        const validator = z
            .string({
                required_error: 'A senha é um campo obrigatório'
            })
            .nonempty('Informe sua senha')
            .min(8, 'O mínimo de caracteres para a senha é 8')
            .max(50, 'O máximo de caracteres para a senha é 50');

        const validation = validator.safeParse(val);
        if (validation.success) {
            data.password = validation.data;
            return true;
        }
        return validation.error.errors[0].message;
    }
};

const onSubmit = () => {
    if (!formValid.value) return;
    formLoading.value = true;
    apiError.value = null;

    $api<{ token: string }>('/auth/login', {
        method: 'post',
        body: data,
        onResponseError(res) {
            const data = res.response._data;
            if (data) {
                apiError.value = data.errors[0].message;
            }
        }
    })
        .then((data) => {
            const authCookie = useCookie('auth-token');
            authCookie.value = data.token;
            router.push({
                name: (route.query.redirectTo as string) || 'dashboard'
            });
        })
        .finally(() => {
            formLoading.value = false;
        });
};
</script>

<style lang='scss' scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.card-login {
  width: 500px;
  max-width: 500px;

  .titles-wrapper {
    padding: 1.5rem;

    h1 {
      text-align: center;
    }
  }
}
</style>
