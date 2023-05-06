<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <dashboard-template-page-title title="Canais" />
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col cols="12" lg="8" md="9" sm="10">
                <v-text-field v-model="search" hide-details label="Pesquisar"></v-text-field>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col cols="auto">
                <dashboard-channels-dialog-add-channel @channel-added="getChannels(false)" />
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col cols="12">
                <div class="accounts-list">
                    <lazy-dashboard-channels-channel-resume-card
                        v-for="channel in channelsToShow"
                        :key="channel.id"
                        :channel="channel"
                        @channel-updated="getChannels(false)"
                    />
                </div>
            </v-col>
            <v-col v-if="channelsToShow.length === 0" cols="8">
                <v-alert variant="tonal">
                    {{ search ? 'Nenhum canal encontrada!' : 'Você não adicionou nenhum canal ainda' }}
                </v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useUi } from '~/store/ui'
import { ChannelResume } from '~/types/Channels'

// Types
definePageMeta({
    layout: 'dashboard',
    middleware: ['auth'],
})

useSeoMeta({
    title: 'Canais',
})

const api = useApi()
const ui = useUi()
const channels = ref<ChannelResume[]>([])
const search = ref('')
const channelsToShow = computed(() => {
    return channels.value.filter((a) => {
        const searchLowerCase = search.value.toLowerCase()
        if (a.login.toLowerCase().includes(searchLowerCase)) return true
        return a.displayName.toLowerCase().includes(searchLowerCase)
    })
})

const getChannels = (showLoading: boolean = true) => {
    if (showLoading) {
        ui.startLoading()
    }

    api('/twitch-channels')
        .then((_accounts) => {
            channels.value = _accounts as any
        })
        .finally(() => {
            if (showLoading) {
                ui.endLoading()
            }
        })
}

getChannels()
</script>

<style lang="scss" scoped>
.accounts-list {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    gap: 15px;
}
</style>