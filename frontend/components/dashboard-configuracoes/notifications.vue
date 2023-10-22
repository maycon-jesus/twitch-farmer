<template>
    <v-card>
        <v-card-title>Notificações</v-card-title>
        <v-container v-if="!apiError">
            <v-row>
                <v-col cols="12">
                    <p class="text-body-1">
                        Configure as notificações para receber alertas diretamente em seu Telegram quando ocorrer eventos
                        específicos no bot.
                    </p>
                </v-col>
                <v-col cols="12">
                    <p class="text-h6 mb-2"><strong>Tutorial:</strong></p>
                    <ol class="pl-6">
                        <li>Coloque o seu usuário do telegram abaixo e salve.</li>
                        <li>Vá em seu telegram e procure pelo bot <a href="https://t.me/VacuousPatter_bot"
                                                                     target="_blank"
                                                                     class="text-primary">@VacuousPatter_bot</a></li>
                        <li>Mande o comando <strong class="text-primary">/ativar</strong></li>
                    </ol>
                </v-col>
            </v-row>
            <v-form @submit.prevent="save" :disabled="loading">
                <v-row justify="center" class="mt-5">
                    <v-col cols="12">
                        <v-text-field v-model="configData.telegramUsername"
                                      label="Seu @ do telegram"
                                      autocomplete="username-telegram"
                                      :prepend-inner-icon="iconMention"
                                      name="username-telegram"
                                      :messages="['Diferencie as letras maiúsculas e minúsculas!!!']"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-switch label="Receber alertas quando o bot resgatar algo"
                                  v-model="configData.enableRedemptions"
                                  hide-details></v-switch>
                        <v-switch label="Receber alertas quando receber susurros na twitch"
                                  v-model="configData.enableWhispers"
                                  hide-details></v-switch>
                    </v-col>
                    <v-col cols="auto">
                        <v-btn type="submit" :loading="loading">Salvar</v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-container>
        <v-container v-else>
            <v-row>
                <v-col cols="12">
                    <v-alert type="error" :icon="iconError">{{apiError}}</v-alert>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import iconMention from '~icons/octicon/mention-16'
import iconError from '~icons/material-symbols/error'
import { useUi } from '../../store/ui'

const { $toast } = useNuxtApp()
const $api = useApi()
const ui = useUi()
const apiError = ref<null | string>(null)
const configData = ref<{
    userId: string,
    enableRedemptions: boolean,
    enableWhispers: boolean,
    telegramUsername: string | null,
    telegramChatId: string | null
}>({
    userId: '',
    enableRedemptions: false,
    enableWhispers: false,
    telegramUsername: null,
    telegramChatId: null
})
const loading = ref(false)

const getConfig = () => {
    ui.startLoading()
    $api('/users/me/notifications', {
        method: 'get'
    })
        .then(data => {
            configData.value = {
                ...data,
                enableRedemptions: !!data.enableRedemptions,
                enableWhispers: !!data.enableWhispers
            } as any
            ui.endLoading()
        })
        .catch((err) => {
            apiError.value = err.errors[0].message

        })
}
getConfig()

const save = () => {
    apiError.value = null
    loading.value = true
    $api(`/users/me/notifications`, {
        method: 'post',
        body: {
            enableRedemptions: configData.value.enableRedemptions,
            enableWhispers: configData.value.enableWhispers,
            telegramUsername: configData.value.telegramUsername || null
        }
    })
        .then(() => {
            $toast.success('Alterações salvas com sucesso!')
        })
        .catch((err) => {
            apiError.value = err.errors[0].message
        })
        .finally(() => {
            loading.value = false
        })
}
</script>