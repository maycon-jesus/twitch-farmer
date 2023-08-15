<template>
    <v-row>
        <v-col cols="12">
            <v-text-field v-model="search" hide-details label="Pesquisar"></v-text-field>
        </v-col>
    </v-row>
    <v-row v-if="channelsFiltered.length === 0">
        <v-col cols="12">
            <v-alert v-if="twitchChannels.channels.length === 0" :icon="false" type="info"
                >Você não tem nenhum canal adicionado!
            </v-alert>
            <v-alert v-else :icon="false" type="info">Não foi encontrado nada correspondente à sua pesquisa.</v-alert>
        </v-col>
    </v-row>
    <v-row v-else>
        <v-col
            v-for="channel in channelsFiltered"
            :key="channel.id"
            cols="12"
            md="6"
            xl="3"
            :lg="$vuetify.display.width <= 1500 ? 6 : 4"
        >
            <v-card>
                <v-card-title>
                    <v-avatar size="64">
                        <v-img :src="channel.profileImageUrl"></v-img>
                    </v-avatar>
                    <span class="ml-4">{{ channel.displayName }}</span>
                </v-card-title>
                <v-card-text>
                    <v-list>
                        <v-list-item>
                            <v-list-item-title>Habilitar farm</v-list-item-title>
                            <template #append>
                                <v-switch :model-value="true" hide-details readonly></v-switch>
                            </template>
                        </v-list-item>
                        <v-list-item>
                            <template v-slot:prepend>
                                <v-icon :icon="iconCoin"></v-icon>
                            </template>
                            <v-list-item-title>Pontos</v-list-item-title>
                            <v-list-item-subtitle>{{ channelsPoints[channel.id] }}</v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item>
                            <template v-slot:prepend>
                                <v-icon :icon="iconCoin"></v-icon>
                            </template>
                            <v-list-item-title>Rank</v-list-item-title>
                            <v-list-item-subtitle>{{ channelsRanks[channel.id] }}</v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                </v-card-text>
                <v-card-actions>
                    <v-btn
                        :to="{
                            name: 'dashboard-canal-channelId',
                            params: {
                                channelId: channel.id,
                            },
                        }"
                        block
                    >Ver canal
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
// noinspection TypeScriptCheckImport
import iconCoin from '~icons/pixelarticons/coin'
import { useTwitchChannels } from '~/store/twitch-channels'
import { useUi } from '~/store/ui'

// Composables/state
const route = useRoute()
const twitchChannels = useTwitchChannels()
const ui = useUi()
const api = useApi()

// Variables
const accountId = route.params.accountId
const channelsPoints = ref<{
    [channelId: string]: number
}>({})
const channelsRanks = ref<{
    [channelId: string]: number
}>({})
const search = ref('')

const loadAccountPoints = (channelId: string) => {
    ui.startLoading()
    api(`/twitch-channels/${channelId}/${accountId}/points`)
        .then((data: any) => {
            channelsPoints.value[channelId] = data.points as any
            channelsRanks.value[channelId] = data.rank as any
        })
        .catch(() => {
            channelsPoints.value[channelId] = 0
        })
        .finally(() => {
            ui.endLoading()
        })
}

const channelsFiltered = computed(() => {
    if (!search.value) return twitchChannels.channels
    return twitchChannels.channels.filter((channel) => {
        if (channel.displayName.toLowerCase().includes(search.value)) return true
        return channel.login.toLowerCase().includes(search.value)
    })
})

watch(
    () => twitchChannels.channels,
    () => {
        twitchChannels.channels.forEach((channel) => {
            loadAccountPoints(channel.id)
        })
        console.log('gg', twitchChannels.channels.length)
    },
    {
        immediate: true,
    }
)
</script>