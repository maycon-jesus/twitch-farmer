<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <dashboard-template-page-title title="Resgatador Automático" />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="6">
                <v-card :loading="loadingPendingItems">
                    <v-card-title>Aguardando resgate</v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-btn block @click="openModal=true">Adicionar item</v-btn>
                                </v-col>
                            </v-row>
                            <v-row v-if="pendingItemsError">
                                <v-col cols="12">
                                    <v-alert :icon="iconError" type="error">{{pendingItemsError}}</v-alert>
                                </v-col>
                            </v-row>
                        </v-container>
                        <v-expansion-panels :multiple="true">
                            <v-expansion-panel v-for="item in itemsComputed" :key="item.channel.id">
                                <v-expansion-panel-title :expand-icon="chevronDown" :collapse-icon="chevronUp">
                                    <v-avatar size="32">
                                        <v-img :src="item.channel.profileImageUrl"></v-img>
                                    </v-avatar>
                                    <span class="text-body-1 ml-2">{{ item.channel.displayName }}</span>
                                </v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-list>
                                        <v-list-item v-for="itemItem in item.items"
                                                     :key="itemItem.id"
                                                     title="">
                                            <v-list-item-title>{{ itemItem.item.name }}</v-list-item-title>
                                            <v-list-item-subtitle>
                                                <v-chip :prepend-avatar="itemItem.account.profileImageUrl"
                                                        :text="itemItem.account.displayName"
                                                        :to="{
                                                                name: 'dashboard-conta-accountId',
                                                                params: {
                                                                    accountId: itemItem.accountId
                                                                }
                                                            }"></v-chip>
                                                <v-chip
                                                    :prepend-icon="iconQueue"
                                                    class="ml-2"
                                                        :text="`Posição: ${itemItem.queuePosition}`"
                                                        ></v-chip>
                                            </v-list-item-subtitle>
                                            <template #append>
                                                <v-btn :icon="iconDelete" variant="text" @click="openModalRemove(itemItem)"></v-btn>
                                            </template>
                                        </v-list-item>
                                    </v-list>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="6">
                <v-card>
                    <v-card-title>Últimos resgates</v-card-title>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog max-width="550" v-model="openModal" persistent>
            <dashboard-resgatador-modal-add-item @on-close="openModal=false"  @item-added="updateItemsPending()" />
        </v-dialog>
        <dashboard-resgatador-modal-remove-item v-model="openModalRemoveItem" v-bind="modalRemoveItemData" @item-removed="updateItemsPending()" />
    </v-container>
</template>

<script setup lang="ts">
import { useResgatador } from '../../store/resgatador'
import chevronDown from '~icons/mdi/chevron-down'
import chevronUp from '~icons/mdi/chevron-up'
import iconQueue from '~icons/fluent/people-queue-20-filled'
import iconDelete from '~icons/typcn/delete'
import iconError from '~icons/material-symbols/error'

type Item = {
    accountId: string,
    channelId: string,
    completed: 0 | 1,
    createdAt: string,
    id: string,
    inputs: string[],
    item: {
        name: string,
        cost: number,
        subscriberOnly: 0 | 1
    },
    channel: {
        id: string
        login: string,
        displayName: string,
        profileImageUrl: string
    },
    account: {
        id: string
        login: string,
        displayName: string,
        profileImageUrl: string
    }
    itemId: string,
    priority: number,
    updatedAt: string,
    queuePosition: number
}

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth']
})

useSeoMeta({
    title: 'Resgatador Automático'
})

const resgatador = useResgatador()
const $api = useApi()
const loadingPendingItems = ref(false)
const pendingItemsError = ref<string|null>(null)
const openModal = ref(false)
const openModalRemoveItem = ref(false)
const modalRemoveItemData = ref({
    itemId: '',
    itemName: ''
})
const itemsList = ref<Item[]>([])

const itemsComputed = computed(() => {
    return itemsList.value.reduce<{ channel: Item['channel'], items: Item[] }[]>((p, v) => {
        const existsItemInArr = p.find(item => item.channel.id === v.channelId)
        if (existsItemInArr) {
            existsItemInArr.items.push(v)
        } else {
            p.push({
                channel: v.channel,
                items: [v]
            })
        }
        return p
    }, [])
})

resgatador.loadChannels()
resgatador.loadAccounts()

const updateItemsPending = ()=>{
    loadingPendingItems.value=true
    pendingItemsError.value=null
    $api('/redemptions-bot/list-my-items')
        .then(data => {
            itemsList.value = data
        })
        .catch((err) => {
            pendingItemsError.value=err.errors[0].message
        })
        .finally(()=>{
            loadingPendingItems.value=false
        })
}
updateItemsPending()

const openModalRemove = (item:Item)=>{
    openModalRemoveItem.value=true
    modalRemoveItemData.value={
        itemName: item.item.name,
        itemId: item.id
    }
}
</script>