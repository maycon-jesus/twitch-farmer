<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <dashboard-template-page-title title="Resgatador Automático" />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
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
                                    <v-alert :icon="iconError" type="error">{{ pendingItemsError }}</v-alert>
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
                                    <v-table v-if="display.mdAndUp.value">
                                        <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th>Conta</th>
                                            <th>Posição</th>
                                            <th>Ações</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr v-for="itemItem in item.items"
                                            :key="itemItem.id">
                                            <td>{{ itemItem.item.name }}</td>
                                            <td>
                                                <v-chip :prepend-avatar="itemItem.account.profileImageUrl"
                                                        :text="itemItem.account.displayName"
                                                        :to="{
                                                                name: 'dashboard-conta-accountId',
                                                                params: {
                                                                    accountId: itemItem.accountId
                                                                }
                                                            }"></v-chip>
                                            </td>
                                            <td>
                                                <v-chip
                                                    v-if="!itemItem.suspended"
                                                    :prepend-icon="iconQueue"
                                                    :text="`Posição: ${itemItem.queuePosition}`"
                                                ></v-chip>
                                                <v-chip
                                                    v-else
                                                    :prepend-icon="iconQueue"
                                                    color="warning"
                                                    text="Resgate suspenso"
                                                ></v-chip>
                                            </td>
                                            <td>
                                                <v-btn variant="text" @click="openModalRemove(itemItem)" color="error">
                                                    Remover
                                                </v-btn>
                                                <v-btn variant="text" @click="onModalPendingItemDetails(itemItem)">
                                                    Detalhes
                                                </v-btn>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </v-table>
                                    <div class="d-flex gap-2 flex-column" v-else>
                                        <v-card v-for="itemItem in item.items"
                                                :key="itemItem.id" variant="outlined">
                                            <v-card-title>{{ itemItem.item.name }}</v-card-title>
                                            <v-card-text>
                                                <v-chip-group>
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
                                                        :text="`Posição: ${itemItem.queuePosition}`"
                                                    ></v-chip>
                                                </v-chip-group>
                                            </v-card-text>
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn variant="text" @click="openModalRemove(itemItem)" color="error">
                                                    Remover
                                                </v-btn>
                                                <v-btn variant="text" @click="onModalPendingItemDetails(itemItem)">
                                                    Detalhes
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </div>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="12">
                <v-card :loading="loadingPendingItems">
                    <v-card-title>Últimos resgates</v-card-title>
                    <v-card-text>
                        <dashboard-resgatador-table-items-completed :items="itemsCompletedList" />
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog max-width="550" v-model="openModal" persistent>
            <dashboard-resgatador-modal-add-item @on-close="openModal=false" @item-added="updateItemsPending()" />
        </v-dialog>
        <dashboard-resgatador-modal-remove-item v-model="openModalRemoveItem"
                                                v-bind="modalRemoveItemData"
                                                @item-removed="updateItemsPending()" />
        <dashboard-resgatador-modal-item-pending-details v-model="openModalPendingItemDetails"
                                                         v-bind="{item:modalPendingItemDetails}" />
    </v-container>
</template>

<script setup lang="ts">
import { useResgatador } from '../../store/resgatador'
import chevronDown from '~icons/mdi/chevron-down'
import chevronUp from '~icons/mdi/chevron-up'
import iconQueue from '~icons/fluent/people-queue-20-filled'
import iconDelete from '~icons/typcn/delete'
import iconError from '~icons/material-symbols/error'
import type { ResgatadorCompletedItem, ResgatadorItem } from '~/types/Resgatador'
import { useDisplay } from 'vuetify'

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
const pendingItemsError = ref<string | null>(null)
const openModal = ref(false)
const openModalRemoveItem = ref(false)
const modalRemoveItemData = ref({
    itemId: '',
    itemName: ''
})
const openModalPendingItemDetails = ref(false)
const modalPendingItemDetails = ref<null | ResgatadorItem>(null)
const itemsList = ref<ResgatadorItem[]>([])
const itemsCompletedList = ref<ResgatadorCompletedItem[]>([])
const display = useDisplay()

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

const updateItemsPending = () => {
    loadingPendingItems.value = true
    pendingItemsError.value = null
    $api('/redemptions-bot/list-my-items')
        .then(data => {
            itemsList.value = data.itemsPending
            itemsCompletedList.value = data.itemsCompleted
        })
        .catch((err) => {
            pendingItemsError.value = err.errors[0].message
        })
        .finally(() => {
            loadingPendingItems.value = false
        })
}
updateItemsPending()

const openModalRemove = (item: ResgatadorItem) => {
    openModalRemoveItem.value = true
    modalRemoveItemData.value = {
        itemName: item.item.name,
        itemId: item.id
    }
}

const onModalPendingItemDetails = (item: ResgatadorItem) => {
    openModalPendingItemDetails.value = true
    modalPendingItemDetails.value = item
}
</script>

<style scoped>
.break {
    -webkit-line-clamp: unset !important;
    white-space: unset;
}

.gap-2 {
    gap: 12px;
}
</style>