<template>
    <v-row>
        <v-col cols="12">
            <v-table class="rounded">
                <thead>
                <tr>
                    <th>Item</th>
                    <th v-if="!$props.accountId">Conta</th>
                    <th v-if="!$props.channelId">Canal</th>
                    <th>Status</th>
                    <th>Data</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                <tr v-if="redemptions.length<=0">
                    <td :colspan="($props.accountId||$props.channelId)? 5:6">Nenhum resgate encontrado</td>
                </tr>
                <tr v-for="item in redemptions" :key="item.id">
                    <td>{{ item.item?.name || 'Item não identificado' }}</td>
                    <td v-if="!$props.accountId">
                        <v-chip :prepend-avatar="item.account.profileImageUrl" :to="{
                                name: 'dashboard-conta-accountId-resgates',
                                params: {
                                    accountId: item.account.id
                                }
                            }">{{ item.account.displayName }}
                        </v-chip>
                    </td>
                    <td v-if="!$props.channelId">
                        <v-chip :prepend-avatar="item.channel.profileImageUrl" :to="{
                                name: 'dashboard-canal-channelId-resgates',
                                params: {
                                    channelId: item.channel.id
                                }
                            }">{{ item.channel.displayName }}
                        </v-chip>
                    </td>
                    <td>
                        <v-chip :color="redemptionStatus(item).color">{{ redemptionStatus(item).text }}</v-chip>
                    </td>
                    <td>
                        {{ redemptionCreatedAt(item) }}
                    </td>
                    <td>
                        <v-btn variant="text" :icon="iconEye" @click="openModal(item)"></v-btn>
                    </td>
                </tr>
                </tbody>
            </v-table>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <v-pagination
                :length="totalPages"
                v-model="page"
            ></v-pagination>
        </v-col>
    </v-row>

    <v-dialog v-model="modalDetailsOpen" max-width="550">
        <dashboard-resgates-redemption-details v-if="modalDetailsItem"
                                               :item="modalDetailsItem"
                                               @on-close="modalDetailsOpen=false" />
    </v-dialog>
</template>

<script setup lang="ts">
import iconEye from '~icons/mdi/eye'
import { useUi } from '../../store/ui'
import type { Redemption } from '~/types/Redemptions'
import { DateTime } from 'luxon'

const props = defineProps<{
    accountId?: string,
    channelId?: string
}>()

const $api = useApi()
const ui = useUi()
const redemptions = ref<Redemption[]>([])
const modalDetailsItem = ref<Redemption | null>(null)
const modalDetailsOpen = ref<boolean>(false)
const page = ref<number>(1)
const totalPages = ref<number>(1)

const loadRedemptions = () => {
    ui.startLoading('resgates')
    $api('/users/me/redemptions', {
        params: {
            page: page.value,
            limit: 25,
            channelId: props.channelId,
            accountId: props.accountId
        }
    })
        .then(r => {
            redemptions.value = r.data
            totalPages.value = r.pagination.totalPages
        })
        .finally(()=>{
            ui.endLoading('resgates')
        })
}

loadRedemptions()

watch(()=> page.value, ()=>{
    loadRedemptions()
})


const redemptionStatus = (redemption: Redemption) => {
    if (redemption.rejected) return {
        color: 'error',
        text: 'Rejeitado'
    }
    if (redemption.completed) return {
        color: 'success',
        text: 'Concluído'
    }
    return {
        color: 'warning',
        text: 'Em andamento'
    }
}
const redemptionCreatedAt = (redemption: Redemption) => {
    return DateTime.fromISO(redemption.createdAt).toFormat(`dd/LL/yyyy HH:mm`)
}

const openModal = (item: Redemption) => {
    modalDetailsItem.value = item
    modalDetailsOpen.value = true
}
</script>