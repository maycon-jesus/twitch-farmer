<template>
    <v-row>
        <v-col
            v-for="account in accountsInOrder"
            :key="account.id"
            cols="12"
            md="6"
            xl="3"
            :lg="$vuetify.display.width <= 1500 ? 6 : 4"
        >
            <v-card>
                <v-card-title>
                    <v-avatar size="64">
                        <v-img :src="account.profileImageUrl"></v-img>
                    </v-avatar>
                    <span class="ml-4">{{ account.displayName }}</span>
                </v-card-title>
                <v-card-text>
                    <v-list>
                        <v-list-item>
                            <template v-slot:prepend>
                                <v-icon :icon="iconCoin"></v-icon>
                            </template>
                            <v-list-item-title>Pontos</v-list-item-title>
                            <v-list-item-subtitle>{{ twitchChannel.accountsPoints[account.id] }}</v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn
                        :to="{
                            name: 'dashboard-conta-accountId',
                            params: {
                                accountId: account.id,
                            },
                        }"
                        block
                        >Ver usuário
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>
<script lang="ts" setup>
// noinspection TypeScriptCheckImport
import iconCoin from '~icons/pixelarticons/coin'
import { computed } from 'vue'
import { useTwitchChannel } from '~/store/twitch-channel'

const twitchChannel = useTwitchChannel()
const route = useRoute()

const accountsInOrder = computed(() => {
    return twitchChannel.accounts.sort((a, b) => {
        const aPoints = twitchChannel.accountsPoints[a.id] || 0
        const bPoints = twitchChannel.accountsPoints[b.id] || 0
        return bPoints - aPoints
    })
})

watch(
    () => twitchChannel.accounts,
    () => {
        twitchChannel.loadAccountsPoints(route.params.channelId as string)
    },
    {
        immediate: true,
    }
)
</script>