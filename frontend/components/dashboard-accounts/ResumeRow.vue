<template>
    <tr>
        <td>{{ $props.index }}</td>
        <td>
            <div class="d-flex align-center flex-gap-10">
                <v-avatar><v-img :src="account.profileImageUrl"></v-img></v-avatar>
                {{ account.displayName }}
            </div>
        </td>
        <td>
            <ui-chip-group>
                <v-chip :color="accountStatus.color">{{ accountStatus.text }}</v-chip>
                <v-chip v-if="account.bot">{{ account.bot.channelsConnected }} de {{ account.bot.totalChannels
                    }}
                    canais
                </v-chip>
            </ui-chip-group>
        </td>
        <td>
            <ui-chip-group>
                <v-btn variant="text" :to="{
                    name: 'dashboard-conta-accountId-resgates',
                    params: {
                            accountId: $props.account.id,
                        },
                }">Resgates
                </v-btn>
                <v-btn
                    variant="text"
                    :to="{
                        name: 'dashboard-conta-accountId',
                        params: {
                            accountId: $props.account.id,
                        },
                    }"
                >Ver mais
                </v-btn>
            </ui-chip-group>
        </td>
    </tr>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue' // noinspection TypeScriptCheckImport
import { AccountResume } from '~/types/Accounts'

const props = defineProps<{
    account: AccountResume
    index: number
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

.flex-gap-10{
    gap: 10px;
}
</style>