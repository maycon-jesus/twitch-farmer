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
                    <v-col v-if="twitchAccount.account" cols="12">
                        <v-card>
                            <v-img :src="twitchAccount.account.profileImageUrl"></v-img>
                            <v-card-text>
                                <v-list>
                                    <v-list-item>
                                        <v-list-item-title>Nome</v-list-item-title>
                                        <v-list-item-subtitle class="break"
                                            >{{ twitchAccount.account?.displayName }}
                                        </v-list-item-subtitle>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-title>Email</v-list-item-title>
                                        <v-list-item-subtitle class="break">
                                            {{ twitchAccount.account?.email || 'Email não confirmado na twitch' }}
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
                            <v-tab
                                :to="{
                                    name: `dashboard-conta-accountId-pontuacao`,
                                    params: {
                                        accountId,
                                    },
                                }"
                                >Pontuação
                            </v-tab>
                            <v-tab
                                :to="{
                                    name: `dashboard-conta-accountId-resgates`,
                                    params: {
                                        accountId,
                                    },
                                }"
                                >Resgates
                            </v-tab>
                            <v-tab
                                :to="{
                                    name: `dashboard-conta-accountId-anotacoes`,
                                    params: {
                                        accountId,
                                    },
                                }"
                                >Anotações
                            </v-tab>
                            <v-tab
                                :to="{
                                    name: `dashboard-conta-accountId-sussurros`,
                                    params: {
                                        accountId,
                                    },
                                }"
                            >Sussurros
                            </v-tab>
                            <v-tab
                                :to="{
                                    name: `dashboard-conta-accountId-configuracoes`,
                                    params: {
                                        accountId,
                                    },
                                }"
                                >Configurações
                            </v-tab>
                        </v-tabs>
                    </v-col>
                </v-row>

                <NuxtPage v-bind="{accountId}" />
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import { useTwitchAccount } from '~/store/twitch-account'
// noinspection TypeScriptCheckImport
import leftIcon from '~icons/material-symbols/arrow-back'
// noinspection TypeScriptCheckImport
import rightIcon from '~icons/material-symbols/arrow-forward'
import { ref } from 'vue'
import { useTwitchChannels } from '~/store/twitch-channels'

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth'],
})

const route = useRoute()
const twitchAccount = useTwitchAccount()
const twitchChannels = useTwitchChannels()
const accountId = ref(route.params.accountId as string)

useSeoMeta({
    title: () => {
        return twitchAccount.account?.displayName || '...'
    },
})

twitchChannels.loadChannels()
twitchAccount.getAccount(route.params.accountId as any)
</script>

<style lang="scss" scoped>
.left-col-desktop {
    width: 300px;
}

.break {
    -webkit-line-clamp: unset !important;
}
</style>