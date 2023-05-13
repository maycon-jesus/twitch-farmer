<template>
    <v-card
        :class="{
            mobile: $vuetify.display.xs,
        }"
        class="channel-card"
        width="450"
    >
        <img :src="channel.profileImageUrl" alt="Channel profile image" class="channel-img" />
        <v-card-text>
            <div class="d-flex justify-space-between title-div">
                <span class="text-h6 channel-name">{{ channel.displayName || channel.login }}</span>
            </div>
            <div class="chips-list">
                <v-chip color="success">Farmando</v-chip>
                <!--                        <v-chip>21/25 canais</v-chip>-->
            </div>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
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
            <v-btn
                :to="{
                    name: 'dashboard-canal-channelId-loja',
                    params: {
                        channelId: $props.channel.id,
                    },
                }"
                >Loja
            </v-btn>
            <v-btn disabled>Ver mais</v-btn>
        </v-card-actions>
        <lazy-dashboard-channels-dialog-channel-delete
            v-model="dialogDeleteChannelOpen"
            :channel-id="channel.id"
            :channel-name="channel.displayName || channel.login"
            @channel-deleted="emitChannelUpdated()"
        />
    </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue' // noinspection TypeScriptCheckImport
import iconVerticalDots from '~icons/mdi/dots-vertical' // noinspection TypeScriptCheckImport
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
    --image-size: 128px;
    transition: transform 0.1s ease !important;
    margin-top: 64px;
    position: relative;
    overflow: unset !important;

    &:hover {
        transform: scale(1.05);
    }

    &.mobile {
        --image-size: 84px;
    }
}

.chips-list {
    display: flex;
    flex-flow: row wrap;
    gap: 10px;
    margin-top: 15px;
}

.title-div {
    min-height: calc(var(--image-size) / 2 - 16px);
}

.channel-img {
    aspect-ratio: 1/1;
    height: var(--image-size);
    border-radius: 999rem;
    margin-left: 15px;
    position: absolute;
    top: calc(var(--image-size) / -2);
    background: rgb(var(--v-theme-primary));
}

.channel-name {
    margin-left: calc(var(--image-size) + 15px);
}
</style>