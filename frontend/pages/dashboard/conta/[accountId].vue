<template>
    <v-container fluid>
        <v-row justify="center">
            <v-col
                :class="{
                    'left-col-desktop': $vuetify.display.mdAndUp,
                }"
                cols="12"
                md="auto"
            >
                <v-row>
                    <v-col v-if="twitchAccount.account" cols="12">
                        <v-card>
                            <v-img :src="twitchAccount.account.profileImageUrl"></v-img>
                            <v-card-text>
                                <v-list>
                                    <v-list-item>
                                        <v-list-item-title>Nome</v-list-item-title>
                                        <v-list-item-subtitle
                                            >{{ twitchAccount.account.displayName }}
                                        </v-list-item-subtitle>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-title>Email</v-list-item-title>
                                        <v-list-item-subtitle>{{ twitchAccount.account.email }}</v-list-item-subtitle>
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
                                    name: `dashboard-conta-accountId-canais`,
                                    params: {
                                        accountId,
                                    },
                                }"
                                >Canais
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

                <NuxtPage />
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import { useTwitchAccount } from '~/store/twitch-account'
import leftIcon from '~icons/material-symbols/arrow-back'
import rightIcon from '~icons/material-symbols/arrow-forward'
import { ref } from 'vue'

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth'],
})

const route = useRoute()
const twitchAccount = useTwitchAccount()
const accountId = ref(route.params.accountId)

useSeoMeta({
    title: () => {
        return twitchAccount.account?.displayName || '...'
    },
})

twitchAccount.getAccount(route.params.accountId as any)
</script>

<style lang="scss" scoped>
.left-col-desktop {
    width: 300px;
}
</style>