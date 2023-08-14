<template>
    <v-container fluid>
        <v-row justify="center">
            <v-col
                cols="12"
                md="auto"
                :class="{
                    'left-col-desktop': $vuetify.display.mdAndUp,
                }"
            >
                <v-row>
                    <v-col v-if="twitchChannel.channel" cols="12">
                        <v-card>
                            <v-img :src="twitchChannel.channel.profileImageUrl"></v-img>
                            <v-card-text>
                                <v-list>
                                    <v-list-item>
                                        <v-list-item-title>Nome</v-list-item-title>
                                        <v-list-item-subtitle class="break"
                                            >{{ twitchChannel.channel?.displayName }}
                                        </v-list-item-subtitle>
                                    </v-list-item>
                                </v-list>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="12" md="">
                <v-row>
                    <v-col cols="12">
                        <v-tabs :next-icon="rightIcon" :prev-icon="leftIcon" show-arrows>
                            <!--                            <v-tab-->
                            <!--                                :to="{-->
                            <!--                                    name: `dashboard-conta-accountId-canais`,-->
                            <!--                                    params: {-->
                            <!--                                        accountId:channelId,-->
                            <!--                                    },-->
                            <!--                                }"-->
                            <!--                                >Canais-->
                            <!--                            </v-tab>-->
                            <v-tab
                                :to="{
                                    name: 'dashboard-canal-channelId-pontuacao',
                                    params: { channelId },
                                }"
                                >Pontuação
                            </v-tab>
                            <v-tab
                                :to="{
                                    name: 'dashboard-canal-channelId-loja',
                                    params: { channelId },
                                }"
                                >Loja
                            </v-tab>
                            <v-tab
                                :to="{
                                    name: 'dashboard-canal-channelId-resgates',
                                    params: { channelId },
                                }"
                                >Resgates
                            </v-tab>
                            <v-tab
                                :to="{
                                    name: 'dashboard-canal-channelId-configuracoes',
                                    params: { channelId },
                                }"
                                >Configurações
                            </v-tab>
                        </v-tabs>
                    </v-col>
                </v-row>

                <NuxtPage v-bind="{ channelId }" />
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
// noinspection TypeScriptCheckImport
import leftIcon from '~icons/material-symbols/arrow-back'
// noinspection TypeScriptCheckImport
import rightIcon from '~icons/material-symbols/arrow-forward'
import { ref } from 'vue'
import { useTwitchChannel } from '../../../store/twitch-channel'

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth'],
})

const route = useRoute()
const twitchChannel = useTwitchChannel()
const channelId = ref(route.params.channelId)

useSeoMeta({
    title: () => {
        return twitchChannel.channel?.displayName || '...'
    },
})

twitchChannel.getChannel(route.params.channelId as any)
twitchChannel.loadAccounts()
</script>

<style lang="scss" scoped>
.left-col-desktop {
    width: 300px;
}

.break {
    -webkit-line-clamp: unset !important;
}
</style>