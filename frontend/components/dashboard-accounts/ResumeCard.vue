<template>
    <v-card
        :class="{
            mobile: $vuetify.display.xs,
        }"
        class="channel-card"
        width="450"
    >
        <img :src="account.profileImageUrl" alt="Account profile image" class="channel-img" />
        <v-card-text>
            <div class="d-flex justify-space-between title-div">
                <span class="text-h6 account-name">{{ account.displayName || account.login }}</span>
            </div>
            <div class="chips-list">
                <v-chip :color="accountStatus.color">{{ accountStatus.text }}</v-chip>
                <v-chip v-if="account.bot"
                >{{ account.bot.channelsConnected }} de {{ account.bot.totalChannels }} canais
                </v-chip>
                <v-chip v-if="!account.hasStreamElementsToken" color="warning">Sem token do StreamElements</v-chip>
            </div>
            <div v-if="accountStatus.type === 'invalid_access'" class="mt-4">
                <v-alert :icon="false" type="error"
                ><p class="text-body-1">
                    O bot não está conseguindo acessar os dados de sua conta. Exclua ela e adicione novamente!
                </p></v-alert
                >
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
                    <v-list-item class="text-error" color="error" @click="dialogDeleteAccountOpen = true">
                        <template #prepend>
                            <v-icon :icon="iconDelete"></v-icon>
                        </template>
                        <v-list-item-title>Excluir</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-btn :to="{
                name: 'dashboard-conta-accountId-resgates',
                params: {
                        accountId: $props.account.id,
                    },
            }">Resgates
            </v-btn>
            <v-btn
                :to="{
                    name: 'dashboard-conta-accountId',
                    params: {
                        accountId: $props.account.id,
                    },
                }"
            >Ver mais
            </v-btn>
        </v-card-actions>
        <dashboard-twitch-accounts-dialog-account-delete
            v-model="dialogDeleteAccountOpen"
            :account-id="account.id"
            :account-name="account.displayName || account.login"
            @account-deleted="emitAccountUpdated()"
        />
    </v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue' // noinspection TypeScriptCheckImport
import iconVerticalDots from '~icons/mdi/dots-vertical' // noinspection TypeScriptCheckImport
import iconDelete from '~icons/ic/baseline-delete-forever'
import type { AccountResume } from '~/types/Accounts'

const props = defineProps<{
    account: AccountResume
}>()

const emits = defineEmits<{
    (e: 'account-updated'): void
}>()

const emitAccountUpdated = () => {
    emits('account-updated')
}

const dialogDeleteAccountOpen = ref(false)

const accountStatus = computed<{
    color: string
    text: string
    type?: 'invalid_access'
}>(() => {
    if (props.account.tokenInvalid)
        return {
            color: 'error',
            text: 'Acesso inválido',
            type: 'invalid_access'
        }
    if (props.account.banned)
        return {
            color: 'error',
            text: 'Conta banida'
        }
    if (!props.account.bot || props.account.bot.state === 'CLOSED')
        return {
            color: 'error',
            text: 'Bot desligado'
        }
    if (props.account.bot.state === 'CONNECTING')
        return {
            color: 'success',
            text: 'Bot ligando'
        }
    if (props.account.bot.state === 'OPEN')
        return {
            color: 'success',
            text: 'Farmando'
        }
    if (props.account.bot.state === 'CLOSING')
        return {
            color: 'warn',
            text: 'Desligando'
        }
    return {
        color: 'success',
        text: 'farmando'
    }
})
</script>

<style lang="scss" scoped>
.channel-card {
    --image-size: 128px;
    transition: transform 0.1s ease !important;
    margin-top: calc(var(--image-size) / 2);
    overflow: unset !important;
    position: relative;

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
    aspect-ratio: 1 / 1;
    height: var(--image-size);
    border-radius: 999rem;
    margin-left: 15px;
    position: absolute;
    top: calc(var(--image-size) / -2);
    background: rgb(var(--v-theme-primary));
}

.account-name {
    margin-left: calc(var(--image-size) + 15px);
}
</style>