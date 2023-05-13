<template>
    <v-row>
        <v-col cols="12">
            <p class="text-h6">Zona de perigo</p>
        </v-col>
        <v-col cols="12">
            <v-col cols="12">
                <v-btn color="error" @click="dialogDeleteChannelOpen = true">Excluir canal</v-btn>
            </v-col>
        </v-col>
    </v-row>
    <dashboard-channels-dialog-channel-delete
        v-if="channel.channel"
        v-model="dialogDeleteChannelOpen"
        :channel-id="channel.channel.id"
        :channel-name="channel.channel.displayName"
    />
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useTwitchChannel } from '~/store/twitch-channel'

const channel = useTwitchChannel()
const dialogDeleteChannelOpen = ref(false)
</script>