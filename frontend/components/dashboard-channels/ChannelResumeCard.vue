<template>
    <v-card class="channel-card" width="450">
        <div class="d-flex flex-nowrap">
            <div class="channel-img-wrapper">
                <img :src="channel.profileImageUrl" alt="Channel profile image" class="channel-img" />
            </div>
            <div class="flex-grow-1">
                <v-card-text>
                    <div class="d-flex justify-space-between">
                        <span class="text-h6">{{ channel.displayName || channel.login }}</span>
                    </div>
                    <div class="chips-list">
                        <v-chip color="success">Farmando</v-chip>
                        <!--                        <v-chip>21/25 canais</v-chip>-->
                    </div>
                    <div class="d-flex justify-end mt-3">
                        <v-menu>
                            <template #activator="{ props }">
                                <v-btn color="white" v-bind="props" variant="text">
                                    <v-icon :icon="iconVerticalDots"></v-icon>
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item class="text-error" color="error" @click="dialogDeleteChannelOpen = true">
                                    <template #prepend>
                                        <v-icon :icon="iconDelete"></v-icon>
                                    </template>
                                    <v-list-item-title>Excluir</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                        <v-btn disabled>Ver mais</v-btn>
                    </div>
                </v-card-text>
            </div>
        </div>
        <lazy-dashboard-channels-dialog-channel-delete
            v-model="dialogDeleteChannelOpen"
            :channel-id="channel.id"
            :channel-name="channel.displayName || channel.login"
            @channel-deleted="emitChannelUpdated()"
        />
    </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
// noinspection TypeScriptCheckImport
import iconVerticalDots from '~icons/mdi/dots-vertical'
// noinspection TypeScriptCheckImport
import iconDelete from '~icons/ic/baseline-delete-forever'
import { ChannelResume } from '~/types/Channels'

const props = defineProps<{
    channel: ChannelResume
}>()

const emits = defineEmits<{
    (e: 'channel-updated'): void
}>()

const emitChannelUpdated = () => {
    emits('channel-updated')
}

const dialogDeleteChannelOpen = ref(false)
</script>

<style lang="scss">
.channel-card {
    transition: transform 0.1s ease !important;

    &:hover {
        transform: scale(1.05);
    }
}

.break {
    white-space: normal;
}

.chips-list {
    display: flex;
    flex-flow: row wrap;
    gap: 10px;
    margin-top: 10px;
}

.channel-img-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 10px;

    .channel-img {
        aspect-ratio: 1/1;
        height: 128px;
        border-radius: 999rem;
    }
}
</style>