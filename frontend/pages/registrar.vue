<template>
    <div
        :class="{
            'pa-4': $vuetify.display.xs,
            'pa-6': !$vuetify.display.xs,
        }"
        class="wrapper"
    >
        <v-card class="card-login">
            <v-container fluid>
                <v-row>
                    <v-col cols="12">
                        <div class="titles-wrapper">
                            <h1 class="text-h4">Twitch Farmer BOT</h1>
                        </div>
                    </v-col>
                </v-row>
                <RegisterLoginSelector />
                <v-form v-if="step == 0" v-model="formValid" :disabled="formLoading" @submit.prevent="onSubmit">
                    <v-row>
                        <v-col cols="12" sm="6">
                            <v-text-field
                                v-model="data.firstName"
                                :rules="[validations.firstName]"
                                autocomplete="given-name"
                                label="Nome"
                                name="given-name"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field
                                v-model="data.lastName"
                                :rules="[validations.lastName]"
                                autocomplete="family-name"
                                label="Sobrenome"
                                name="family-name"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field
                                v-model="data.email"
                                :rules="[validations.email]"
                                autocomplete="email"
                                label="Email"
                                name="email"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <FormTextFieldPassword
                                v-model="data.password"
                                :rules="[validations.password]"
                                autocomplete="new-password"
                                label="Senha"
                                name="new-password"
                            ></FormTextFieldPassword>
                        </v-col>
                        <v-col cols="12">
                            <FormTextFieldPassword
                                v-model="data.confirmPassword"
                                :rules="[validations.confirmPassword]"
                                autocomplete="new-password"
                                label="Digite a senha novamente"
                                name="new-password2"
                            ></FormTextFieldPassword>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field
                                v-model="data.inviteCode"
                                :rules="[validations.inviteCode]"
                                label="Código de convite"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row justify="center">
                        <v-col cols="auto">
                            <v-btn :loading="formLoading" size="large" type="submit">Registrar</v-btn>
                        </v-col>
                    </v-row>
                    <v-expand-transition v-show="apiError">
                        <v-row>
                            <v-col cols="12">
                                <v-alert type="error">{{ apiError }}</v-alert>
                            </v-col>
                        </v-row>
                    </v-expand-transition>
                </v-form>
                <v-row v-if="step == 1" justify="center">
                    <v-col class="text-center" cols="auto">
                        <nuxt-icon class="icon-success" filled name="register/success"></nuxt-icon>
                        <p class="text-h6">Conta criada com sucesso!</p>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </div>
</template>

<script lang="ts" setup>
import { z } from 'zod';
import { ref } from 'vue';

const route = useRoute()
const router = useRouter()
const $api = useApi()

const formValid = ref(false)
const formLoading = ref(false)
const apiError = ref<null | string>(null)
const step = ref(0)
const data = reactive({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    inviteCode: route.query['invite-code'] || '',
})

const validations = {
    firstName: (val: any) => {
        const validator = z
            .string({
                required_error: 'O primeiro nome é um campo obrigatório',
            })
            .nonempty('Informe seu nome')
            .trim()

        const validation = validator.safeParse(val;)
        if (validation.success) {
            data.firstName = validation.data;
            return true;
        }
        return validation.error.errors[0].message;
    },
    lastName: (val: any) => {
        const validator = z.string().nonempty('Informe seu sobrenome').trim();

        const validation = validator.safeParse(val);
        if (validation.success) {
            data.lastName = validation.data;
            return true;
        }
        return validation.error.errors[0].message;
    },
    email: (val: any) => {
        const validator = z
            .string({
                required_error: 'O email é um campo obrigatório'
            })
            .email('Informe um email válido')

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
            .nonempty('Informe uma senha')
            .min(8, 'O mínimo de caracteres para a senha é 8')
            .max(50, 'O máximo de caracteres para a senha é 50')

        const validation = validator.safeParse(val);
        if (validation.success) {
            data.password = validation.data;
            return true;
        }
        return validation.error.errors[0].message;
    },
    confirmPassword: (val: any) => {
        const validator = z
            .string({
                required_error: 'A senha é um campo obrigatório'
            })
            .superRefine((pass, ctx) => {
                if (pass !== data.password) {
                    ctx.addIssue({
                        code: 'custom',
                        message: 'As senhas devem ser iguais'
                    })
                }
            })

        const validation = validator.safeParse(val);
        if (validation.success) {
            data.password = validation.data;
            return true;
        }
        return validation.error.errors[0].message;
    },
    inviteCode: (val: any) => {
        const validator = z
            .string({
                required_error: 'O código de convite é um campo obrigatório'
            })
            .trim()
            .uuid('Código inválido')

        const validation = validator.safeParse(val);
        if (validation.success) {
            data.inviteCode = validation.data;
            return true;
        }
        return validation.error.errors[0].message;
    },
}

const onSubmit = async () => {
    if (!formValid.value) return;
    formLoading.value = true;
    apiError.value = null;
    $api('/auth/register', {
        method: 'post',
        body: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            inviteCode: data.inviteCode
        },
        async onResponse(res) {
            if (res.response.status !== 200) {
                const data = await res.response._data;
                apiError.value = data.errors[0].message;
            } else {
                step.value++;
                window.sessionStorage.setItem('login.email', data.email);
                window.sessionStorage.setItem('login.password', data.password);
                router
                    .push({
                        name: 'Index'
                    })
                    .then();
            }
        },
    }).finally(() => {
        formLoading.value = false;
    })
}
</script>

<style lang="scss" scoped>
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

.icon-success {
    font-size: 96px;
    line-height: 96px;
}
</style>