<template>
    <v-btn @click="modalOpen = true">Criar novo convite</v-btn>

    <v-dialog v-model="modalOpen" max-width="500" persistent>
        <v-card :loading="modalState.loading">
            <v-card-title>{{ modalState.title }}</v-card-title>
            <v-expand-transition v-show="modalState.apiError">
                <v-card-text>
                    <v-alert :icon="iconError" type="error">{{ modalState.apiError }}</v-alert>
                </v-card-text>
            </v-expand-transition>
            <v-expand-transition v-if="inviteData" v-show="modalState.showInvite && inviteData">
                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <p class="text-body-1">Link de convite:</p>
                        </v-col>
                        <v-col cols="12">
                            <form-text-field-copy :model-value="inviteData.url"></form-text-field-copy>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-expand-transition>
            <v-expand-transition v-show="modalState.showCloseBtn">
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="on-surface" variant="text" @click="closeModal()">Fechar</v-btn>
                </v-card-actions>
            </v-expand-transition>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
// noinspection TypeScriptCheckImport
import iconError from '~icons/material-symbols/error-rounded'

const runtimeConfig = useRuntimeConfig()
const emits = defineEmits<{
    (e: 'created:invite'): void
    (e: 'modal-closed'): void
}>()

const api = useApi()
const modalOpen = ref(false)
const modalState = ref<{
    loading: boolean
    title: string
    showCloseBtn: boolean
    showInvite: boolean
    apiError: null | string
}>({
    loading: false,
    title: '',
    showCloseBtn: false,
    showInvite: false,
    apiError: null,
})
const inviteData = ref<{
    code: string
    url: string
}>({ code: '', url: '' })

const createInvite = () => {
    modalState.value = {
        loading: true,
        title: 'Criando convite...',
        showCloseBtn: false,
        showInvite: false,
        apiError: null,
    }
    api<{ code: string }>('/invite-codes', { method: 'post' })
        .then((data) => {
            inviteData.value.code = data.code
            inviteData.value.url = `${runtimeConfig.public.APP_URL}/registrar?invite-code=${data.code}`
            modalState.value = {
                loading: false,
                title: 'Convite criado com sucesso!',
                showCloseBtn: true,
                showInvite: true,
                apiError: null,
            }
            emits('created:invite')
        })
        .catch((err) => {
            if (err === 'unknown') {
                modalOpen.value = false
                return
            }
            modalState.value = {
                loading: false,
                title: 'Ocorreu um erro ao criar o convite!',
                showCloseBtn: true,
                showInvite: false,
                apiError: err.errors[0].message,
            }
        })
}

const closeModal = () => {
    emits('modal-closed')
    modalOpen.value = false
}

watchEffect(() => {
    if (modalOpen.value) {
        createInvite()
    }
})
</script>