<template>
    <div
        :class="{
            'pa-4': $vuetify.display.xs,
            'pa-6': !$vuetify.display.xs,
        }"
        class="page"
    >
        <v-card :loading="cardState.loading" class="card" max-width="500">
            <v-card-title>{{ cardState.title }}</v-card-title>
            <v-card-text v-if="cardState.loading === false && cardState.success === false">
                <v-row justify="center">
                    <v-col cols="12">
                        <v-alert :icon="iconError" type="error">{{ cardState.error }}</v-alert>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-text v-if="!cardState.loading && cardState.success">
                <v-row align="center">
                    <v-col cols="12">
                        <v-alert :icon="iconSuccess" type="success">Conta adicionada com sucessos!</v-alert>
                    </v-col>
                    <v-col cols="auto">
                        <v-avatar size="64">
                            <v-img :src="accountData.profileImageUrl"></v-img>
                        </v-avatar>
                    </v-col>
                    <v-col cols="">
                        <span class="text-h6">{{ accountData.displayName || accountData.login }}</span>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions v-if="!cardState.loading">
                <v-spacer></v-spacer>
                <v-btn color="on-surface" variant="text" @click="closeWindow">Fechar janela</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
// noinspection TypeScriptCheckImport
import iconError from '~icons/material-symbols/error-rounded'
// noinspection TypeScriptCheckImport
import iconSuccess from '~icons/mdi/success-circle'

useSeoMeta({
    title: 'Adicionar conta',
})

const route = useRoute()
const $api = useApi()

const cardState = ref<{
    loading: boolean
    title: string
    error: null | string
    success: boolean | null
}>({
    loading: true,
    title: 'Adicionando conta...',
    error: null,
    success: null,
})

const accountData = ref({
    id: '',
    profileImageUrl: '',
    login: '',
    displayName: '',
})
const cardError = (error: string) => {
    cardState.value = {
        loading: false,
        title: 'Ocorreu um erro ao adicionar a conta.',
        error,
        success: false,
    }
}
const cardSuccess = () => {
    cardState.value = {
        loading: false,
        title: 'Conta adicionada com sucesso!',
        error: null,
        success: true,
    }
}

if (!route.query.code) {
    cardError('Campo "code" não foi fornecido!')
}
if (!route.query.state) {
    cardError('Campo "state" não foi fornecido!')
}

const closeWindow = () => {
    window.close()
}

$api('/public/add-twitch-account', {
    method: 'post',
    body: {
        identifyCode: route.query.state,
        code: route.query.code,
        redirectUrl: `${window.location.protocol}//${window.location.host}${route.path}`,
    },
})
    .then((data) => {
        accountData.value = data as any
        cardSuccess()
    })
    .catch((err) => {
        cardError(err.errors[0].message)
    })
</script>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .card {
        width: 500px;
    }
}
</style>