<template>
    <v-form @submit.prevent="save" :disabled="loading">
        <v-row justify="center">
            <v-col cols="12">
                <v-text-field v-model="ntfyTopicName" label="Nome do tópico" autocomplete="topic-name" name="topic-name"></v-text-field>
            </v-col>
            <v-col cols="auto">
                <v-btn type="submit" :loading="loading">Salvar</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script lang="ts" setup>
import { useUserDataStore } from '../../store/userData'

const userData = useUserDataStore()
const {$toast}=useNuxtApp()
const $api = useApi()
const ntfyTopicName = ref(userData.userData.ntfyTopicName)
const apiError = ref<null|string>(null)
const loading = ref(false)

const save = () => {
    apiError.value = null
    loading.value = true
    $api(`/users/me/config/ntfy-topic-name`, {
        method: 'post',
        body: {
            ntfyTopicName: ntfyTopicName.value,
        },
    })
        .then(() => {
            userData.userData.ntfyTopicName=ntfyTopicName.value
            $toast.success('Nome do tópico definido com sucesso!')
        })
        .catch((err) => {
            apiError.value = err.errors[0].message
        })
        .finally(() => {
            loading.value = false
        })
}
</script>