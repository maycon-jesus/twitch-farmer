<template>
    <v-card>
        <v-card-title>Adiciona para resgatar</v-card-title>
        <v-form @submit.prevent="onSubmit" v-model="formValid" :disabled="loading">
            <v-container>
                <v-row v-if="apiError">
                    <v-col cols="12">
                        <v-alert type="error" :icon="iconError">{{ apiError }}</v-alert>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-autocomplete label="Canal"
                                        :items="resgatador.channels"
                                        item-value="id"
                                        item-title="displayName"
                                        chips
                                        v-model="channelId"
                                        :rules="[validateTwitchId]"
                                        no-data-text="Nenhum canal encontrado!">
                            <template #item="{props,item}">
                                <v-list-item v-bind="props" :prepend-avatar="item.raw.profileImageUrl" title="">
                                    <v-list-item-title>
                                        {{ item.raw.displayName }}
                                    </v-list-item-title>
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
                <v-row>
                    <v-col cols="12">
                        <v-autocomplete label="Item"
                                        :items="resgatador.storeItems"
                                        item-value="id"
                                        item-title="name"
                                        chips
                                        v-model="itemId"
                                        :rules="[validateItemId]"
                                        :disabled="!resgatador.loaded.storeItems || !channelId"
                                        :loading="resgatador.loading.storeItems"
                                        no-data-text="Nenhum item encontrado!">
                            <template #item="{props,item}">
                                <v-list-item v-bind="props" :prepend-avatar="item.raw.profileImageUrl" title="">
                                    <v-list-item-title>
                                        {{ item.raw.name }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                        <v-chip :prepend-icon="iconCoin">{{ item.raw.cost }}</v-chip>
                                        <v-chip :prepend-icon="iconQueue" class="ml-2">{{ item.raw.queueSize }}</v-chip>
                                    </v-list-item-subtitle>
                                </v-list-item>
                            </template>
                            <template #chip="{props,item}">
                                <v-chip
                                    v-bind="props"
                                    :text="item.raw.name"
                                ></v-chip>
                                <v-chip
                                    class="ml-2"
                                    v-bind="props"
                                    :prepend-icon="iconCoin"
                                    :text="item.raw.cost.toString()"
                                ></v-chip>
                                <v-chip :prepend-icon="iconQueue" class="ml-2">{{ item.raw.queueSize }}</v-chip>
                            </template>
                        </v-autocomplete>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <form-select-redemption-accounts v-model="accountsIds"
                                                         :disabled="!resgatador.loaded.accountsCooldown||!resgatador.loaded.accountsPoints"
                                                         :accounts="resgatador.accounts"
                                                         :accounts-points="resgatador.accountsPoints"
                                                         :item="resgatador.storeItems.find(i => i.id === itemId)"
                                                         :accountsCooldown="resgatador.accountsCooldown"
                        />
                    </v-col>
                </v-row>
                <!--                <v-row>-->
                <!--                    <v-col cols="12">-->
                <!--                        <v-autocomplete label="Conta"-->
                <!--                                        :items="accountsOrder"-->
                <!--                                        item-value="id"-->
                <!--                                        item-title="displayName"-->
                <!--                                        chips-->
                <!--                                        v-model="accountId"-->
                <!--                                        :rules="[validateAccountId]"-->
                <!--                                        :disabled="!resgatador.loaded.accountsPoints||!channelId"-->
                <!--                                        :loading="resgatador.loading.accountsPoints"-->
                <!--                                        no-data-text="Nenhuma conta encontrada!">-->
                <!--                            <template #item="{props,item}">-->
                <!--                                <v-list-item v-bind="props" :prepend-avatar="item.raw.profileImageUrl" title="">-->
                <!--                                    <v-list-item-title>-->
                <!--                                        {{ item.raw.displayName }}-->
                <!--                                    </v-list-item-title>-->
                <!--                                    <v-list-item-subtitle>-->
                <!--                                        <v-chip :prepend-icon="iconCoin">-->
                <!--                                            {{ resgatador.accountsPoints[item.raw.id].points }}-->
                <!--                                        </v-chip>-->
                <!--                                    </v-list-item-subtitle>-->
                <!--                                </v-list-item>-->
                <!--                            </template>-->
                <!--                            <template #chip="{props,item}">-->
                <!--                                <v-chip-->
                <!--                                    v-bind="props"-->
                <!--                                    :prepend-avatar="item.raw.profileImageUrl" :text="item.raw.displayName"-->
                <!--                                ></v-chip>-->
                <!--                                <v-chip-->
                <!--                                    class="ml-2"-->
                <!--                                    v-bind="props"-->
                <!--                                    :prepend-icon="iconCoin"-->
                <!--                                    :text="(resgatador.accountsPoints[item.raw.id].points).toString()"-->
                <!--                                ></v-chip>-->
                <!--                            </template>-->
                <!--                        </v-autocomplete>-->
                <!--                    </v-col>-->
                <!--                    <v-col cols="12" v-for="(itemInput,index) of itemInputs" :key="index">-->
                <!--                        <v-text-field :label="itemInput" v-model="formInputs[index]"></v-text-field>-->
                <!--                    </v-col>-->
                <!--                </v-row>-->
            </v-container>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="on-surface" variant="text" @click="emits('onClose')" :disabled="loading">Cancelar</v-btn>
                <v-btn type="submit" :loading="loading">Adicionar</v-btn>
            </v-card-actions>
        </v-form>
    </v-card>
</template>

<script setup lang="ts">
import { useResgatador } from '../../store/resgatador'
import iconCoin from '~icons/pixelarticons/coin'
import iconQueue from '~icons/fluent/people-queue-20-filled'
import iconError from '~icons/material-symbols/error'

const emits = defineEmits<{
    (ev: 'onClose'): void
    (ev: 'itemAdded'): void
}>()

const resgatador = useResgatador()
const $api = useApi()
const { $toast } = useNuxtApp()
const apiError = ref<null | string>(null)
const channelId = ref<null | string>(null)
const accountsIds = ref<string[]>([])
const itemId = ref<null | string>(null)
const formInputs = ref<string[]>([])
const formValid = ref<boolean>(false)
const loading = ref<boolean>(false)

const validateTwitchId = (value: string) => {
    if (!value) return 'Selecione o canal que você deseja resgatar'
    return true
}
const validateItemId = (value: string) => {
    if (!value) return 'Selecione o item que você deseja resgatar'
    return true
}
const validateAccountId = (value: string) => {
    if (!value) return 'Selecione com qual conta você deseja resgatar'
    return true
}

const onSubmit = () => {
    if (!formValid) return
    loading.value = true
    apiError.value = null

    $api('/redemptions-bot/add-item', {
        method: 'post',
        body: {
            channelId: channelId.value,
            itemId: itemId.value[0],
            accountsIds: accountsIds.value,
            inputs: formInputs.value
        }
    })
        .then(() => {
            $toast.success('Item adicionado na fila de resgates')
            emits('onClose')
            emits('itemAdded')
        })
        .catch(err => {
            apiError.value = err.errors[0].message
        })
        .finally(() => {
            loading.value = false
        })
}

const itemInputs = computed(() => {
    const itemSelected = resgatador.storeItems.find(i => i.id === itemId.value)
    return itemSelected?.inputs || []
})

const accountsOrder = computed(() => {
    const pointsObj = resgatador.accountsPoints
    if (!resgatador.loaded.accountsPoints) return resgatador.accounts
    return resgatador.accounts.sort((a, b) => {
        return pointsObj[b.id].points - pointsObj[a.id].points
    })
})

watch(() => channelId.value, () => {
    itemId.value = null
    accountsIds.value = null
    if (channelId.value && typeof channelId.value === 'string') {
        resgatador.loadItems(channelId.value)
        resgatador.loadAccountsPoints(channelId.value)
        resgatador.loadAccountsCooldown(channelId.value)
    } else {
        resgatador.accountsPoints = {}
        resgatador.storeItems = []
    }
})

watch(() => itemId.value, () => {
    formInputs.value = []
})
</script>