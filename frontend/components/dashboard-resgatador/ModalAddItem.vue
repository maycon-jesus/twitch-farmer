<template>
    <v-card>
        <v-card-title>Adiciona para resgatar</v-card-title>
        <v-form @submit.prevent="onSubmit" v-model="formValid">
            <v-container>
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
                                        :disabled="!channelId"
                                        :loading="resgatador.loading.storeItems"
                                        no-data-text="Nenhum item encontrado!">
                            <template #item="{props,item}">
                                <v-list-item v-bind="props" :prepend-avatar="item.raw.profileImageUrl" title="">
                                    <v-list-item-title>
                                        {{ item.raw.name }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                        <v-chip :prepend-icon="iconCoin">{{ item.raw.cost }}</v-chip>
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
                                    :text="item.raw.cost"
                                ></v-chip>
                            </template>
                        </v-autocomplete>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-autocomplete label="Conta"
                                        :items="resgatador.accounts"
                                        item-value="id"
                                        item-title="displayName"
                                        chips
                                        v-model="accountId"
                                        :rules="[validateAccountId]"
                                        :disabled="!resgatador.loaded.accountsPoints||!channelId"
                                        :loading="resgatador.loading.accountsPoints"
                                        no-data-text="Nenhuma conta encontrada!">
                            <template #item="{props,item}">
                                <v-list-item v-bind="props" :prepend-avatar="item.raw.profileImageUrl" title="">
                                    <v-list-item-title>
                                        {{ item.raw.displayName }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                        <v-chip :prepend-icon="iconCoin">{{ resgatador.accountsPoints[item.raw.id] }}</v-chip>
                                    </v-list-item-subtitle>
                                </v-list-item>
                            </template>
                            <template #chip="{props,item}">
                                <v-chip
                                    v-bind="props"
                                    :prepend-avatar="item.raw.profileImageUrl" :text="item.raw.displayName"
                                ></v-chip>
                                <v-chip
                                    class="ml-2"
                                    v-bind="props"
                                    :prepend-icon="iconCoin" :text="(resgatador.accountsPoints[item.raw.id]).toString()"
                                ></v-chip>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" v-for="(itemInput,index) of itemInputs" :key="index">
                        <v-text-field :label="itemInput" v-model="formInputs[index]"></v-text-field>
                    </v-col>
                </v-row>
            </v-container>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="on-surface" variant="text" @click="emits('onClose')">Cancelar</v-btn>
                <v-btn type="submit">Adicionar</v-btn>
            </v-card-actions>
        </v-form>
    </v-card>
</template>

<script setup lang="ts">
import { useResgatador } from '../../store/resgatador'
import iconCoin from '~icons/pixelarticons/coin'

const emits = defineEmits<{
    (ev: 'onClose'): void
}>()

const resgatador = useResgatador()
const $api = useApi()
const {$toast} = useNuxtApp()
const apiError = ref<null | string>(null)
const channelId = ref<null | string>(null)
const accountId = ref<null | string>(null)
const itemId = ref<null | string>(null)
const formInputs = ref<string[]>([])
const formValid = ref<boolean>(false)

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

const onSubmit = ()=> {
    if(!formValid)return;
    $api('/redemptions-bot/add-item', {
        method: 'post',
        body: {
            channelId: channelId.value,
            itemId: itemId.value,
            accountId: accountId.value,
            inputs: formInputs.value
        }
    })
        .then(()=>{
            $toast.success('Item adicionado na fila de resgates')
            emits('onClose')
        })
        .catch(err => {
            apiError.value=err.errors[0].message
        })
}

const itemInputs = computed(()=>{
    const itemSelected = resgatador.storeItems.find(i => i.id === itemId.value)
    return itemSelected?.inputs||[]
})

watch(() => channelId.value, () => {
    itemId.value=null
    accountId.value=null
    if (channelId.value && typeof channelId.value === 'string') {
        resgatador.loadItems(channelId.value)
        resgatador.loadAccountsPoints(channelId.value)
    } else {
        resgatador.accountsPoints = {}
        resgatador.storeItems = []
    }
})
</script>