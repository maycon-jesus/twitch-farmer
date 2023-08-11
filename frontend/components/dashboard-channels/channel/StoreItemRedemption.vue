<template>
    <v-card>
        <v-card-title>Resgatar {{ $props.item.name }}</v-card-title>
        <v-form v-model="formValid" @submit.prevent="redemption()" v-if="!rescued" :disabled="loading">
            <v-container>
                <v-expand-transition v-show="rescueError">
                    <v-row>
                        <v-col cols="12">
                            <v-alert :icon="iconError" type="error">{{ rescueError }}</v-alert>
                        </v-col>
                    </v-row>
                </v-expand-transition>
                <v-row>
                    <v-col cols="12">
                        <v-autocomplete label="Conta"
                                        :items="accounts"
                                        item-value="id"
                                        item-title="displayName"
                                        chips
                                        v-model="accountId"
                                        :rules="[validateAccountId]"
                                        no-data-text="Nenhuma conta encontrada!">
                            <template #item="{props,item}">
                                <v-list-item v-bind="props" :prepend-avatar="item.raw.profileImageUrl" title="">
                                    <v-list-item-title>
                                        {{ item.raw.displayName }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                        <v-chip>{{ twitchChannel.accountsPoints[item.raw.id] }}</v-chip>
                                    </v-list-item-subtitle>
                                </v-list-item>
                            </template>
                            <template #chip="{props,item}">
                                <v-chip
                                    v-bind="props"
                                    :prepend-avatar="item.raw.profileImageUrl" :text="item.raw.displayName"
                                ></v-chip>
                            </template>
                        </v-autocomplete>
                    </v-col>
                </v-row>
                <v-row v-if="$props.item.allowMessages">
                    <v-col cols="12">
                        <v-text-field label="Mensagem" v-model="messageData" :rules="[validateMessage]"></v-text-field>
                    </v-col>
                </v-row>
                <v-row v-for="(input, index) of $props.item.inputs">
                    <v-col cols="12">
                        <v-text-field :label="input" v-model="inputData[index]"></v-text-field>
                    </v-col>
                </v-row>
            </v-container>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="on-surface"
                       variant="text"
                       @click="twitchChannel.closeModalRedemption()"
                       :disabled="loading">Fechar
                </v-btn>
                <v-btn variant="elevated" type="submit" :loading="loading">Resgatar</v-btn>
            </v-card-actions>
        </v-form>
        <v-container v-if="rescued">
            <v-row>
                <v-col cols="12">
                    <v-alert color="success" type="info" :icon="iconInfo">
                        Item resgatado com sucesso!
                    </v-alert>
                </v-col>
                <v-col cols="12" v-if="rescuedAccessCode">
                    <v-text-field label="Código" :model-value="rescuedAccessCode"></v-text-field>
                </v-col>
            </v-row>
        </v-container>
        <v-card-actions v-if="rescued">
            <v-spacer></v-spacer>
            <v-btn color="on-surface" variant="text" @click="twitchChannel.closeModalRedemption()">Fechar</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
// noinspection TypeScriptCheckImport
import iconInfo from '~icons/material-symbols/info'
import iconError from '~icons/material-symbols/error'

import { ChannelStoreItem } from '../../../types/ChannelStore'
import { useTwitchChannel } from '../../../store/twitch-channel'

const twitchChannel = useTwitchChannel()
const $api = useApi()
const { $toast } = useNuxtApp()

const props = defineProps<{
    item: ChannelStoreItem
}>()

const validateAccountId = (value: string) => {
    if (!value) return 'Selecione a conta que vai fazer o resgate'
}
const validateMessage = (value: string) => {
    if (!props.item.allowMessages) return
    if (!value) return 'Informe uma mensagem'
}

const inputData = ref<string[]>([])
const messageData = ref<string>('')
const accountId = ref<string | null>(null)
const formValid = ref<boolean>(false)
const rescued = ref(false)
const rescuedAccessCode = ref<string | null>(null)
const loading = ref<boolean>(false)
const rescueError = ref<string | null>(null)

const accounts = computed(() => {
    return twitchChannel.accountsCanBuy(props.item.cost)
})

const redemption = () => {
    loading.value = true
    rescueError.value = null

    const body: {
        input: string[],
        message?: string
    } = {
        input: inputData.value
    }

    if (props.item.allowMessages) {
        body.message = messageData.value
    }

    $api<{
        accessCode: string
    }>(`/twitch-channels/${twitchChannel.channel?.id}/${accountId.value}/redemptions/${props.item.id}`, {
        method: 'post',
        body
    })
        .then((r) => {
            rescued.value = true
            if (r.accessCode) {
                rescuedAccessCode.value = r.accessCode
            }
            $toast.success('Item resgatado com sucesso!')
        })
        .catch(err => {
            rescueError.value = err.errors[0].message
        })
        .finally(() => {
            loading.value = false
        })
}
</script>