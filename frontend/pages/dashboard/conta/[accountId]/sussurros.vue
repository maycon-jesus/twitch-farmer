<template>
    <v-row>
        <v-col cols="12">
            <v-list class="rounded" v-if="threadsComputed.length>0">
                <v-list-item v-for="(thread, index) in threadsComputed"
                             :key="index"
                             :prepend-avatar="thread.sender.profileImageUrl"
                             :title="thread.sender.displayName"
                             @click="openThread(thread)"
                             :append-icon="iconEye"
                >
                </v-list-item>
            </v-list>
            <v-alert v-else variant="tonal">Nenhum sussurro foi enviado para esta conta!</v-alert>
        </v-col>
    </v-row>
    <v-dialog v-model="openDialog" max-width="550">
        <twitch-account-whisper-thread-dialog :thread="threadOpen"
                                              :accountId="$props.accountId"
                                              :model-value="openDialog"
                                              @on-close="openDialog=false" />
    </v-dialog>
</template>
<script lang="ts" setup>
import { useTwitchAccount } from '../../../../store/twitch-account'
import iconEye from '~icons/mdi/eye'
import { useUi } from '../../../../store/ui'

const props = defineProps<{
    accountId: string
}>()

const api = useApi()
const ui = useUi()
const account = useTwitchAccount()
const threads = ref([])
const threadOpen = ref<any | null>(null)
const openDialog = ref(false)

ui.startLoading('sussurros')
api(`/twitch-accounts/${props.accountId}/whispers/threads`)
    .then(_threads => {
        threads.value = _threads
    })
    .finally(()=>{
        ui.endLoading('sussurros')
    })

const threadsComputed = computed(() => {
    return threads.value.map(thread => {
        if (thread.twitchUserId1 === account.account.userId) {
            return {
                ...thread,
                sender: thread.twitchUser2
            }
        }
        return {
            ...thread,
            sender: thread.twitchUser1
        }
    })
})

const openThread = (thread: any) => {
    threadOpen.value = thread
    openDialog.value = true
}
</script>
