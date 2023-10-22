<template>
    <v-card :loading="loading">
        <v-card-title>
            <v-avatar size="32">
                <v-img v-if="$props.thread" :src="$props.thread.sender.profileImageUrl"></v-img>
            </v-avatar>
            <span class="ml-2">{{ $props.thread.sender.displayName }}</span>
        </v-card-title>
        <v-card-text>
            <v-alert type="info" variant="tonal" class="mb-2" :icon="iconInfo">Por limitações da twitch não é possivel enviar sussurros de fora da twitch.</v-alert>
            <p v-for="message in messages" :key="message.id" class="chat-message my-1">
                <v-chip class="mr-2">{{messageDate(message.createdAt)}}</v-chip>
                <v-chip class="mr-2">{{message.authorUser.displayName}}</v-chip>
                <span>{{message.message}}</span>
            </p>
        </v-card-text>
        <v-card-actions class="sticky-bottom bg-surface">
            <v-spacer></v-spacer>
            <v-btn @click="emits('onClose')">Fechar</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import iconInfo from '~icons/material-symbols/info'
import { DateTime } from 'luxon'

const props = defineProps<{
    thread: any | null
    accountId:string,
    modelValue: boolean
}>()
const emits = defineEmits<{
    (ev: 'onClose'):void
}>()

const $api = useApi()
const messages = ref([])
const loading = ref(false)

const getMessages = ()=>{
    loading.value=true
    $api(`/twitch-accounts/${props.accountId}/whispers/threads/${props.thread.id}/messages`)
        .then(_messages => {
            messages.value=_messages
        })
        .finally(()=>{
            loading.value=false
        })
}

const messageDate = (date:string)=>{
    return DateTime.fromISO(date).toFormat('dd/LL/yyyy HH:mm')
}

getMessages()
</script>

<style lang="scss" scoped>
.chat-message{
    display: block;
}

.sticky-bottom{
    position: sticky;
    bottom: 0;
    left: 0;
}
</style>