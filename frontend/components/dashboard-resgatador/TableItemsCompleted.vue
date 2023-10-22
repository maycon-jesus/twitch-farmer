<template>
    <v-table>
        <thead>
        <tr>
            <th>Item</th>
            <th>Conta</th>
            <th>Canal</th>
            <th>Status</th>
            <th>Data</th>
            <th>Ações</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in $props.items" :key="item.id">
            <td>{{ item.item.name }}</td>
            <td>
                <v-chip :prepend-avatar="item.account.profileImageUrl"
                        :text="item.account.displayName"
                        :to="{
                            name: 'dashboard-conta-accountId',
                            params: {
                                accountId: item.accountId
                            }
                        }"></v-chip>
            </td>
            <td>
                <v-chip :prepend-avatar="item.channel.profileImageUrl"
                        :text="item.channel.displayName"
                        :to="{
                            name: 'dashboard-canal-channelId',
                            params: {
                                channelId: item.channelId
                            }
                        }"></v-chip>
            </td>
            <td>
                <v-chip :text="getStatus(item).text" :color="getStatus(item).color"></v-chip>
            </td>
            <td>
                {{getData(item)}}
            </td>
            <td>
                <v-btn variant="text" @click="openModal(item)">
                    Detalhes
                </v-btn>
            </td>
        </tr>
        </tbody>
    </v-table>
    <dashboard-resgatador-modal-item-completed-details v-model="modalOpen" :item="modalItem||undefined" />
</template>

<script lang="ts" setup>
import type { ResgatadorCompletedItem } from '~/types/Resgatador'
import { DateTime } from 'luxon'

const props = defineProps<{
    items: ResgatadorCompletedItem[]
}>()

const modalOpen = ref(false)
const modalItem = ref<ResgatadorCompletedItem | null>(null)

const getStatus = (item: ResgatadorCompletedItem)=>{
    if(item.error) return {
        text: 'Erro',
        color: 'error'
    }
    return {
        text: 'Concluído',
        color: 'success'
    }
}

const getData = (item: ResgatadorCompletedItem)=>{
    return DateTime.fromISO(item.updatedAt).toFormat('dd/LL/yyyy HH:mm')
}

const openModal = (item: ResgatadorCompletedItem) => {
    modalItem.value = item
    modalOpen.value = true
}
</script>