<template>
    <twitch-channel-store-filters v-model="itemsVisible" :items="storeItems" />
    <v-row justify="center">
        <v-col
            v-for="item in itemsInPage"
            :key="item.id"
            cols="12"
            md="6"
            xl="3"
            :lg="$vuetify.display.width <= 1500 ? 6 : 4"
        >
            <twitch-channel-store-item-card :item="item"></twitch-channel-store-item-card>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <v-pagination v-model="pagination" :length="paginationMax"></v-pagination>
        </v-col>
    </v-row>
    <v-dialog
        :model-value="twitchChannel.modalItemDetails.open"
        max-width="550"
        @update:model-value="twitchChannel.closeModalItemDetails()"
    >
        <twitch-channel-store-item-details
            :item="twitchChannel.modalItemDetails.item"
        />
    </v-dialog>
    <v-dialog
        :model-value="twitchChannel.modalRedemption.open"
        max-width="550"
        @update:model-value="twitchChannel.closeModalRedemption()"
    >
        <twitch-channel-store-item-redemption
            :item="twitchChannel.modalRedemption.item"
        />
    </v-dialog>
</template>

<script lang="ts" setup>
import { ChannelStoreItem } from '~/types/ChannelStore'
import { ref } from 'vue'
import { useTwitchChannel } from '~/store/twitch-channel'
import { useUi } from '~/store/ui'

const props = defineProps<{
    channelId: string
}>()

const storeItems = ref<ChannelStoreItem[]>([])
const itemsVisible = ref<ChannelStoreItem[]>([])
const pagination = ref(1)
const itemsPerPage = ref(15)
const twitchChannel = useTwitchChannel()
const route = useRoute()

const $api = useApi()
const ui = useUi()

ui.startLoading()
$api(`/twitch-channels/${props.channelId}/store/items`)
    .then((_items) => {
        storeItems.value = _items as any[]
    })
    .finally(() => {
        ui.endLoading()
    })

const paginationMax = computed(() => {
    return Math.ceil(itemsVisible.value.length / itemsPerPage.value)
})

const itemsInPage = computed(() => {
    return itemsVisible.value.slice((pagination.value - 1) * itemsPerPage.value, pagination.value * itemsPerPage.value)
})

watch(
    () => twitchChannel.accounts,
    () => {
        twitchChannel.loadAccountsPoints(route.params.channelId as string)
    },
    {
        immediate: true
    }
)
</script>