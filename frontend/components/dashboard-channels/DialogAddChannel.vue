<template>
    <v-dialog v-model="modalOpen" max-width="500" persistent>
        <template #activator="{ props }">
            <v-btn v-bind="props">Adicionar canal</v-btn>
        </template>
        <v-card>
            <v-card-title>Adicionar canal</v-card-title>
            <v-form v-model="formValid">
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field
                                v-model="form.twitchChannelUrl"
                                :rules="[vuetifyValidators.validateTwitchChannelUrl]"
                                label="Link do canal na twitch"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field
                                v-model="form.streamElementsStoreUrl"
                                :rules="[vuetifyValidators.validateStreamElementsStoreUrl]"
                                label="Link da loja no StreamElements"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-expand-transition v-show="apiError">
                        <v-row>
                            <v-col cols="12">
                                <v-alert :icon="iconError" type="error">{{ apiError }}</v-alert>
                            </v-col>
                        </v-row>
                    </v-expand-transition>
                </v-container>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :disabled="loading" color="text-surface" variant="text" @click="modalOpen = false"
                    >Cancelar
                </v-btn>
                <v-btn :loading="loading" variant="elevated" @click="addChannel()">Adicionar canal</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { z } from 'zod'
// noinspection TypeScriptCheckImport
import iconError from '~icons/material-symbols/error'

const { $toast } = useNuxtApp()

const props = defineProps<{
    modelValue?: boolean
}>()
const emits = defineEmits<{
    (ev: 'update:modelValue', val: boolean): void
    (ev: 'channel-added'): void
}>()

const $api = useApi()
const modalOpen = ref(props.modelValue || false)
const loading = ref(false)
const apiError = ref<null | string>(null)
const formValid = ref(false)
const form = ref({
    twitchChannelUrl: '',
    streamElementsStoreUrl: '',
    twitchUsername: '',
    streamElementsUsername: '',
})

const regex = {
    twitchChannelUrl: /^(https:\/\/)?www\.twitch\.tv\/(.+)$/,
    streamElementsStoreUrl: /^(https:\/\/)?streamelements.com\/(.+)\/store$/,
}
const formValidators = {
    twitchChannelUrl: z
        .string()
        .regex(regex.twitchChannelUrl, 'Link inválido. Ex: www.twitch.tv/exemplo')
        .nonempty('Campo obrigatório')
        .trim(),
    streamElementsStoreUrl: z
        .string()
        .regex(regex.streamElementsStoreUrl, 'Link inválido. Ex: streamelements.com/exemplo/store')
        .nonempty('Campo obrigatório')
        .trim(),
}
const vuetifyValidators = {
    validateTwitchChannelUrl: (val: string) => {
        const parse = formValidators.twitchChannelUrl.safeParse(val)
        if (!parse.success) return parse.error.errors[0].message
        form.value.twitchChannelUrl = parse.data
        form.value.twitchUsername = regex.twitchChannelUrl.exec(parse.data)![2]
        return true
    },
    validateStreamElementsStoreUrl: (val: string) => {
        const parse = formValidators.streamElementsStoreUrl.safeParse(val)
        if (!parse.success) return parse.error.errors[0].message
        form.value.streamElementsStoreUrl = parse.data
        form.value.streamElementsUsername = regex.streamElementsStoreUrl.exec(parse.data)![2]
        return true
    },
}

const resetForm = () => {
    form.value = {
        twitchUsername: '',
        twitchChannelUrl: '',
        streamElementsUsername: '',
        streamElementsStoreUrl: '',
    }
    apiError.value = null
}

const addChannel = () => {
    if (!formValid.value) return
    loading.value = true
    apiError.value = null
    $api('/twitch-channels', {
        method: 'post',
        body: { streamElementsUsername: form.value.streamElementsUsername, twitchUsername: form.value.twitchUsername },
    })
        .then(() => {
            resetForm()
            emits('channel-added')
            modalOpen.value = false
            $toast.success('Canal adicionado com sucesso!')
        })
        .catch((err) => {
            apiError.value = err.errors[0].message
        })
        .finally(() => {
            loading.value = false
        })
}

watchEffect(() => {
    emits('update:modelValue', modalOpen.value)
})
watchEffect(() => {
    modalOpen.value = props.modelValue
})
</script>