<template>
    <v-card class="card-item">
        <div class="item-img-wrapper">
            <img v-if="item.thumbnailUrl" :src="item.thumbnailUrl" alt="" class="item-img" loading="lazy" />
        </div>
        <v-card-title class="break"
            >{{ item.name }}
            <v-chip v-if="!item.enabled" color="warning">Oculto</v-chip>
            <v-chip v-if="item.deleted" color="error">Excluído</v-chip>
        </v-card-title>
        <v-card-text>
            <v-list>
                <v-list-item>
                    <template #prepend>
                        <v-icon :icon="iconCoin"></v-icon>
                    </template>
                    <v-list-item-title>Preço</v-list-item-title>
                    <v-list-item-subtitle>{{ item.cost }}</v-list-item-subtitle>
                    <v-list-item-subtitle class="break"
                        >{{ accountsCanBuy.length }} conta sua pode resgatar
                    </v-list-item-subtitle>
                </v-list-item>
                <v-divider class="my-2"></v-divider>
                <v-list-item>
                    <template #prepend>
                        <v-icon :icon="$props.item.quantityCurrent === 0 ? iconBasketOff : iconBasket"></v-icon>
                    </template>
                    <v-list-item-title>Estoque</v-list-item-title>
                    <v-list-item-subtitle>{{ itemQuantity }}</v-list-item-subtitle>
                </v-list-item>
                <v-divider v-show="$props.item.subscriberOnly" class="my-2"></v-divider>
                <v-list-item v-show="$props.item.subscriberOnly">
                    <template #prepend>
                        <v-icon :icon="iconStar"></v-icon>
                    </template>
                    <v-list-item-title>Somente subscribers</v-list-item-title>
                </v-list-item>
                <v-divider class="my-2"></v-divider>
                <v-list-item>
                    <template #prepend>
                        <v-icon :icon="iconQueue"></v-icon>
                    </template>
                    <v-list-item-title class="break">Fila de resgate</v-list-item-title>
                    <v-list-item-subtitle>{{ $props.item.queueSize }}</v-list-item-subtitle>
                </v-list-item>
            </v-list>
        </v-card-text>
        <v-card-actions class="mt-auto flex-column">
            <v-btn block @click="twitchChannel.openModalItemDetails(item)">Detalhes</v-btn>
            <v-btn class="ml-0" block variant="elevated" @click="twitchChannel.openModalRedemption(item)">Resgatar</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
// noinspection TypeScriptCheckImport
import iconCoin from '~icons/pixelarticons/coin'
// noinspection TypeScriptCheckImport
import iconBasket from '~icons/material-symbols/shopping-basket'
// noinspection TypeScriptCheckImport
import iconBasketOff from '~icons/mdi/basket-off'
// noinspection TypeScriptCheckImport
import iconStar from '~icons/mdi/star-circle-outline'
import iconQueue from '~icons/fluent/people-queue-20-filled'
import { ChannelStoreItem } from '~/types/ChannelStore'
import { useTwitchChannel } from '~/store/twitch-channel'

const twitchChannel = useTwitchChannel()

const props = defineProps<{
    item: ChannelStoreItem
}>()

const accountsCanBuy = computed(() => {
    return twitchChannel.accountsCanBuy(props.item.cost)
})
const itemQuantity = computed(() => {
    if (props.item.quantityCurrent < 0) return 'Ilimitado'
    if (props.item.quantityCurrent <= 0) return 'Sem estoque'
    return `${props.item.quantityCurrent} de ${props.item.quantityTotal}`
})
</script>

<style lang="scss" scoped>
.card-item {
    //height: 100%;
}

.item-img-wrapper {
    display: flex;
    justify-content: center;
    min-height: 186px;
}

.item-img {
    aspect-ratio: 267/186;
    width: 100%;
    object-fit: cover;
}

.break {
    -webkit-line-clamp: unset !important;
    white-space: unset;
}
</style>