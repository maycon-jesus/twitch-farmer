<template>
    <v-card>
        <v-list class="bg-background" :style="{overflow: 'initial'}">
            <v-list-item>
                <v-list-item-title class="break">Resgatar {{ $props.item.name }}</v-list-item-title>
                <v-list-item-subtitle>
                    <v-chip-group>
                        <v-chip :prepend-icon="iconCoin">{{ $props.item.cost }}</v-chip>
                        <v-chip :prepend-icon="iconQueue">{{ $props.item.queueSize }}</v-chip>
                    </v-chip-group>
                </v-list-item-subtitle>
            </v-list-item>
        </v-list>
        <v-form v-model="formValid" @submit.prevent="redemption()" v-if="!rescued" :disabled="loading">
            <v-container>
                <v-row>
                    <v-col cols="12">
                        <v-switch v-model="addToBot" label="Adicionar ao bot de resgates"></v-switch>
                    </v-col>
                </v-row>
                <v-row>
                    <v-expand-transition v-show="rescueError">
                        <v-col cols="12">
                            <v-alert :icon="iconError" type="error">{{ rescueError }}</v-alert>
                        </v-col>
                    </v-expand-transition>
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
                <v-btn type="submit" :loading="loading">Resgatar</v-btn>
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
                    <form-text-field-copy label="Código"
                                          :model-value="rescuedAccessCode"
                                          hide-details></form-text-field-copy>
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
import iconCoin from '~icons/pixelarticons/coin'
import iconQueue from '~icons/fluent/people-queue-20-filled'

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
    if (!props.item.allowMessages) return true
    if (!value) return 'Informe uma mensagem'
}

const inputData = ref<string[]>([])
const messageData = ref<string>('')
const accountId = ref<string | null>(null)
const formValid = ref<boolean>(false)
const addToBot = ref<boolean>(false)
const rescued = ref(false)
const rescuedAccessCode = ref<string | null>(null)
const loading = ref<boolean>(false)
const rescueError = ref<string | null>(null)
const step = ref<'form' | 'rescued' | 'added-bot'>('form')

const accounts = computed(() => {
    const pointsObj = twitchChannel.accountsPoints
    return twitchChannel.accounts.sort((a, b) => {
        return pointsObj[b.id] - pointsObj[a.id]
    })
})

const redemption = () => {
    loading.value = true
    rescueError.value = null

    if (addToBot.value) {
        $api('/redemptions-bot/add-item', {
            method: 'post',
            body: {
                channelId: twitchChannel.channel?.id,
                itemId: props.item.id,
                accountId: accountId.value,
                inputs: inputData.value
            }
        })
            .then(() => {
                $toast.success('Item adicionado na fila de resgates!')
            })
            .catch(err => {
                rescueError.value = err.errors[0].message
            })
            .finally(() => {
                loading.value = false
            })
    } else {
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
                step.value = 'rescued'
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
}
</script>

<style lang="scss" scoped>
.break {
    -webkit-line-clamp: unset !important;
    white-space: unset;
}
</style>