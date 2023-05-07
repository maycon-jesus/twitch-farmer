<template>
    <v-form :disabled="loading" @submit.prevent="save">
        <v-row justify="center">
            <v-col cols="12">
                <v-text-field v-model="token" label="Token JWT"></v-text-field>
            </v-col>
            <v-expand-transition>
                <v-col v-show="apiError" cols="12">
                    <v-alert :icon="false" type="error">{{ apiError }}</v-alert>
                </v-col>
            </v-expand-transition>
            <v-col cols="auto">
                <v-btn :loading="loading" type="submit">Salvar</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useTwitchAccount } from '~/store/twitch-account'

const $api = useApi()
const accountData = useTwitchAccount()
const token = ref(accountData.account?.streamElementsToken || '')
const { $toast } = useNuxtApp()
const apiError = ref<null | string>(null)
const loading = ref(false)

watchEffect(() => {
    token.value = accountData.account?.streamElementsToken || ''
})

const save = () => {
    apiError.value = null
    loading.value = true
    $api(`/twitch-accounts/${accountData.account?.id}/streamelements-token`, {
        method: 'post',
        body: {
            token: token.value,
        },
    })
        .then(() => {
            $toast.success('Token definido com sucesso!')
        })
        .catch((err) => {
            apiError.value = err.errors[0].message
        })
        .finally(() => {
            loading.value = false
        })
}
</script>