<template>
    <v-card>
        <div class="item-img-wrapper">
            <img v-if="item.thumbnailUrl" :src="item.thumbnailUrl" alt="" class="item-img" loading="lazy" />
        </div>
        <v-card-title class="break">{{ item.name }}</v-card-title>
        <div>
            <v-tabs v-model="tab" :next-icon="rightIcon" :prev-icon="leftIcon" show-arrows>
                <v-tab value="general">Geral</v-tab>
                <v-tab v-if="item.inputs.length > 0" value="form">Formulário</v-tab>
                <v-tab value="cooldown">Cooldown</v-tab>
                <v-tab value="accounts-avaible">Contas disponiveis</v-tab>
            </v-tabs>
        </div>
        <v-window v-model="tab" :style="{overflow: 'initial'}">
            <v-window-item value="general">
                <v-card-text>
                    <v-list>
                        <v-list-item>
                            <v-list-item-title>Descrição</v-list-item-title>
                            <v-list-item-subtitle class="break">{{ item.description }}</v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title>Categoria</v-list-item-title>
                            <v-list-item-subtitle class="break"
                                >{{ item.category || 'Sem categoria' }}
                            </v-list-item-subtitle>
                        </v-list-item>

                        <v-divider class="my-2"></v-divider>

                        <v-list-item>
                            <v-list-item-title>Valor</v-list-item-title>
                            <v-list-item-subtitle>{{ item.cost }}</v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title>Estoque</v-list-item-title>
                            <v-list-item-subtitle>{{ itemQuantity }}</v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title>Fila para resgatar</v-list-item-title>
                            <v-list-item-subtitle>{{ item.queueSize }}</v-list-item-subtitle>
                        </v-list-item>

                        <v-divider class="my-2"></v-divider>

                        <v-list-item>
                            <v-list-item-title>Criado em</v-list-item-title>
                            <v-list-item-subtitle>{{ createdAt }}</v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title>Atualizado em</v-list-item-title>
                            <v-list-item-subtitle>{{ updatedAt }}</v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                </v-card-text>
            </v-window-item>
            <v-window-item v-if="item.inputs.length > 0" value="form">
                <v-card-text>
                    <v-list>
                        <v-list-item v-for="(field, i) in item.inputs" :key="i">
                            <v-list-item-title>Campo {{ i + 1 }}</v-list-item-title>
                            <v-list-item-subtitle class="break">{{ field }}</v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                </v-card-text>
            </v-window-item>
            <v-window-item value="cooldown">
                <v-card-text>
                    <v-list>
                        <twitch-channel-list-item-cooldown
                            :subtitle="transformSecondsInHumanTime(item.cooldownUser)"
                            description="Tempo que leva até a mesma conta poder resgatar novamente"
                            title="Usuário"
                        ></twitch-channel-list-item-cooldown>
                        <twitch-channel-list-item-cooldown
                            :subtitle="transformSecondsInHumanTime(item.cooldownCategory)"
                            description="Tempo que leva até a mesma conta poder resgatar novamente naquela categoria"
                            title="Categoria"
                        ></twitch-channel-list-item-cooldown>
                        <twitch-channel-list-item-cooldown
                            :subtitle="transformSecondsInHumanTime(item.cooldownGlobal)"
                            description="Tempo que leva até alguem poder resgatar novamente"
                            title="Global"
                        ></twitch-channel-list-item-cooldown>
                    </v-list>
                </v-card-text>
            </v-window-item>
            <v-window-item value="accounts-avaible">
                <v-card-text>
                    <v-alert v-if="accountsCanBuy.length <= 0" variant="tonal"
                        >Você não possui nenhuma conta com pontos para resgatar esse item!
                    </v-alert>
                    <v-list v-else>
                        <v-list-item v-for="account in accountsCanBuy" :key="account.id">
                            <template #prepend>
                                <v-avatar>
                                    <v-img :src="account.profileImageUrl"></v-img>
                                </v-avatar>
                            </template>
                            <v-list-item-title class="break">{{ account.displayName }}</v-list-item-title>
                            <v-list-item-subtitle class="break"
                                >Pontuação: {{ twitchChannel.accountsPoints[account.id].points }}
                            </v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                </v-card-text>
            </v-window-item>
        </v-window>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="emits('onClose')">Fechar</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
// noinspection TypeScriptCheckImport
import leftIcon from '~icons/material-symbols/arrow-back'
// noinspection TypeScriptCheckImport
import rightIcon from '~icons/material-symbols/arrow-forward'
import { computed, ref } from 'vue'
import { ChannelStoreItem } from '~/types/ChannelStore'
import { DateTime } from 'luxon'
import { useTwitchChannel } from '~/store/twitch-channel'

const props = defineProps<{
    item: ChannelStoreItem
}>()
const emits = defineEmits<{
    (ev: 'onClose'): void
}>()

const tab = ref('general')
const twitchChannel = useTwitchChannel()

const itemQuantity = computed(() => {
    if (props.item.quantityCurrent < 0 || props.item.quantityTotal < 0) return 'Ilimitado'
    if (props.item.quantityCurrent <= 0 && !props.item.quantityTotal) return 'Sem estoque'
    return `${props.item.quantityCurrent} de ${props.item.quantityTotal}`
})

const createdAt = computed(() => {
    return DateTime.fromISO(props.item.createdAt).toFormat(`dd/LL/yyyy HH:mm`)
})
const updatedAt = computed(() => {
    return DateTime.fromISO(props.item.updatedAt).toFormat(`dd/LL/yyyy HH:mm`)
})

const transformSecondsInHumanTime = (time: number) => {
    const days = Math.floor(time / 86_400)
    time = time - days * 86_400
    const hours = Math.floor(time / 3_600)
    time = time - hours * 3_600
    const minutes = Math.floor(time / 60)
    time = time - minutes * 60
    const seconds = time

    const strArr = []
    if (days > 0) strArr.push(`${days} dias`)
    if (hours > 0) strArr.push(`${hours} horas`)
    if (minutes > 0) strArr.push(`${minutes} minutos`)
    if (seconds > 0) strArr.push(`${seconds} segundos`)
    return strArr.join(' ')
}

const accountsCanBuy = computed(() => {
    const a = twitchChannel.accountsCanBuy(props.item.cost).sort((a, b) => {
        const aPoints = twitchChannel.accountsPoints[a.id].points || 0
        const bPoints = twitchChannel.accountsPoints[b.id].points || 0
        return bPoints - aPoints
    })
    console.log('teste2',a.length)
    return a
})
</script>

<style lang="scss" scoped>
.item-img-wrapper {
    display: flex;
    justify-content: center;
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